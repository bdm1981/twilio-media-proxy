# twilio-media-proxy

Twilio MMS messages require media to be hosted and publicly accisbled in order for Twilio servers to copy the media. This project provides and example of securely hosting media in a private S3 bucket. A combination of API Gateway and Lambda functions are used to validate requests are from Twilio and serve media if authorized. The media can also be deleted immediately after being accessed by Twilio.

The application uses several AWS resources, including Lambda functions, an API Gateway API, and Amazon S3. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

```
AWS SAM => an open-source framework that enables you to build serverless applications on AWS
AWS CLI => Not required, but recommended because it simplifies credentials when deploying
AWS Lambda => serverless compute service
API Gateway => managed api service
S3 => Persistence layer used to store configuration and data (could be something else)
```

### Prerequisites
This is not a beginner level build! You need to have some knowledge of AWS, serverless computing, and programming.
```
* Twilio Account. If you don’t yet have one, you can sign up for a free account here.
* AWS Account with permissions to provision Lambdas, a S3 bucket, IAM Roles & Policies, an *API Gateway, and a custom EventBus. You can sign up for an account here.
* AWS SAM CLI installed
```

### Let’s Build it!
Here are the basic steps of our serverless multichannel build today.
1. Provision a Twilio Phone Number
1. Add your Twilio Credentials to AWS Parameter Store
1. Download the code
1. Deploy the code

Try it out!

## 1. Provision Twilio Phone Number

Purchasing a phone number from Twilio is a snap. Login to your Twilio Account, and then select PHONE NUMBERS > MANAGE > BUY A NUMBER.

Here is a Twilio article that explains this process in more detail.

Copy the phone number that you purchased to use later.

## 2. Add Parameters to AWS Parameter Store
Making sure that you never include credentials in your code is a core security tenet. So we are going to use AWS Parameter Store to save our Twilio credentials. The compute components will be able to access these credentials at runtime to call the Twilio APIs.

From your AWS Console, be sure that you are in the AWS Region where you wish to deploy this project! Next, go to Systems Manager and then select Parameter Store.

Select Create parameter and enter values for:

TWILIO_ACCOUNT_SID\
TWILIO_AUTH_TOKEN


## 3. Download the Code for this Application