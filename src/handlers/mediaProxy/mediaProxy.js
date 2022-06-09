const AWS = require("aws-sdk");
const twilio = require("twilio");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  let response;
  console.log("event: ", JSON.stringify(event));

  const twilioSignature = event.headers["X-Twilio-Signature"];
  const params = event?.body ?? {};
  const url = `https://${event.requestContext.domainName}${event.requestContext.path}`;

  const requestIsValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    params
  );

  console.log("is request valid? ", requestIsValid);

  if (requestIsValid) {
    const bucketParams = {
      Bucket: process.env.S3_BUCKET,
      Key: event.pathParameters.asset,
    };

    try{
      const bucket = await s3.getObject(bucketParams).promise();

      return {
        statusCode: 200,
        body: Buffer.from(bucket.Body).toString("base64"),
        headers: {
          "Accept-Ranges": "bytes",
          "Content-Length": bucket.ContentLength,
          "Content-Type": bucket.ContentType,
          "Last-Modified": bucket.LastModified,
        },
        isBase64Encoded: true,
      };
    }catch(err){
      console.log("Error Fetching data: ", JSON.stringify(err))
      return {
        statusCode: 500,
        body: err.message
      }
    }
  } else {
    console.log("DENIED!");
    return {
      statusCode: 403,
      body: "Invalid Signature, Access Denied",
    };
  }
  
};
