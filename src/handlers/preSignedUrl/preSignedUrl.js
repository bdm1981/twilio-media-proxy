const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const {"v4": uuidv4} = require('uuid');


/**
 * The Presigned URL endpoint requires the following inputs
 * @param {string} contentType - Content type of the file that will be uploaded
 * @param {string} fileExtension - Extension of the file to be uploaded. 
 * @returns 
 */
exports.handler = async (event) => {
  console.log("Event: ", JSON.stringify(event));
  let messageInput = {};
  let filename = uuidv4();

  if (event?.body) {
    messageInput = JSON.parse(event.body);

  }

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${filename}.${messageInput.fileExtension}`,
    Expires: 60 * 60,
    ContentType: messageInput.contentType
  };

  const url = await s3.getSignedUrlPromise("putObject", s3Params);

  const response = {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({
      uploadURL: url,
      filename: `${filename}.${messageInput.fileExtension}`
    }),
  };

  return response;
};
