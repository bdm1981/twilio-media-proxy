# twilio-media-proxy

To send MMS messages with Twilio, the media must be publicly accessible in order for Twilio API to copy the media. This project provides and example of securely hosting media in a private S3 bucket. A combination of API Gateway and Lambda functions are used to validate requests are from Twilio and serve the media if authorized. The media can also be deleted immediately after being accessed by Twilio.

![Twilio Media Proxy Overview](/screenshots/Overview.png "Twilio Media Proxy Overview")

The application uses several AWS resources, including Lambda functions, API Gateway API, and S3. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

```
AWS SAM => an open-source framework that enables you to build serverless applications on AWS
AWS CLI => Not required, but recommended because it simplifies credentials when deploying
AWS Lambda => serverless compute service
API Gateway => managed api service
S3 => Persistence layer used to store configuration and data (could be something else)
```

### Prerequisites
This is not a beginner level build! You need to have some knowledge of AWS, serverless computing, and programming.

* Twilio Account. If you don’t yet have one, you can sign up for a free account [here](https://twilio.com/signup).
* AWS Account with permissions to provision Lambdas, a S3 bucket, IAM Roles & Policies, an *API Gateway, and a custom EventBus. You can sign up for an account here.
* [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) CLI installed


### Let’s Build it!
Here are the basic steps of our serverless multichannel build today.
1. Provision a Twilio Phone Number
1. Add your Twilio Credentials to AWS Parameter Store
1. Download the code
1. Deploy the code
1. Deploy the sample frontend

Try it out!

## 1. Provision Twilio Phone Number

Purchasing a phone number from Twilio is a snap. Login to your Twilio Account, and then select PHONE NUMBERS > MANAGE > BUY A NUMBER.

Here is a [Twilio article](https://support.twilio.com/hc/en-us/articles/223183168-Buying-a-toll-free-number-with-Twilio?_ga=2.254142280.1582717002.1654519910-422144059.1641824484&_gac=1.50072532.1653485065.CjwKCAjwp7eUBhBeEiwAZbHwkQlxAYEQEulfZGfKgnJczPdWIWjNpATrCsny3qHRazu8ePvVuqnAAxoChpsQAvD_BwE) that explains this process in more detail.

Copy the phone number that you purchased to use later.

## 2. Add Parameters to AWS Parameter Store
Making sure that you never include credentials in your code is a core security tenet. So we are going to use AWS Parameter Store to save our Twilio credentials. The compute components will be able to access these credentials at runtime to call the Twilio APIs.

From your AWS Console, be sure that you are in the AWS Region where you wish to deploy this project! Next, go to Systems Manager and then select Parameter Store.

Select Create parameter and enter values for:

TWILIO_ACCOUNT_SID\
TWILIO_AUTH_TOKEN

![AWS Parameter Store](/screenshots/aws-param-store.png?raw=true "AWS Parameter Store")


## 3. Download the Code for this Application
Download the code from this [repo](https://github.com/bdm1981/twilio-media-proxy).

## 4. Deploy Code
Using AWS SAM makes deploying serverless applications really easy. First, run:

```bash
sam build
``` 
This command goes through the yaml file template.yaml and builds all of the functions and layers, preparing the stack to be deployed.

Take a moment and go through the commented template.yaml file to review the resources that will be created upon deployment.

In order to deploy the SAM application, you need to be sure that you have the proper AWS credentials configured. Having the AWS CLI also installed makes it easier, but here are some instructions.

Once you have authenticated into your AWS account, you can run:
```bash
sam deploy --guided
```
This will start an interactive command prompt session to set basic configurations and then deploy all of your resources via a stack in CloudFormation. Here are the answers to enter after running that command (except, substitute your AWS Region of choice – be sure to use the same region as step 2 above!):

```
Configuring SAM deploy
======================

        Looking for config file [samconfig.toml] :  Found
        Reading default arguments  :  Success

        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [twilio-media-proxy-1]: 
        AWS Region [us-east-1]: 
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: 
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: 
        #Preserves the state of previously provisioned resources when an operation fails
        Disable rollback [y/N]: 
        mediaProxyFunction may not have authorization defined, Is this okay? [y/N]: y
        sendMessageFunction may not have authorization defined, Is this okay? [y/N]: y
        presignedUrlFunction may not have authorization defined, Is this okay? [y/N]: y
        Save arguments to configuration file [Y/n]: 
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]: 
```

## 5. Deploy the sample frontend
I have provided a simple UI for sending MMS messages. This is a React App that can be run locally or deployed to S3 as a static website or Twilio Serverless. I will be highlighting how to run this locally for demo purposes.

1. From the `frontend` directory run the following command
   ```bash
   npm install
   ```

1. Copy the sample.env to .env
    ```bash
    cp sample.env .env
    ```

1. Update the .env file with the details for your environment\
REACT_APP_RUNTIME_DOMAIN - this was generated by the sam deployment. It should be formatted like this: https://<sample>.execute-api.us-east-1.amazonaws.com/Prod/\
REACT_APP_DEFAULT_TWILIO_NUMBER - Insert the phone number that was purchased in step 1. Include the +1

1. Start up the application
   ```bash
   npm start
   ```

1. The application is now accesible via a local address. The default is: http://localhost:3000
![Sample UI](/screenshots/sample-ui.png?raw=true "Sample UI")


