exports.handler = async (event) => {
  console.log("env: ", JSON.stringify(process.env))
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (event?.body) {
    messageInput = JSON.parse(event.body);
  }

  let messageParams = {
    body: messageInput.body,
    from: messageInput.from,
    to: messageInput.to,
  };

  if (messageInput?.filename) {
    messageParams.mediaUrl = `${messageInput.url}/${messageInput.filename}?delete=${messageInput.delete}`;
  }

  console.log(messageParams);

  try{
    let message = await client.messages.create(messageParams);
    console.log(message)
  
    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(message),
    };
  }catch(err){
    console.log(err);
    return {
      statusCode: 500,
      body: err.message
    }
  }

};
