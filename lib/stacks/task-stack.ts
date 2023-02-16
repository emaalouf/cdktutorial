import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda_node from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as gateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TaskStack extends cdk.Stack {
  api: gateway.RestApi;
  apiCustomAuthorizer: gateway.CfnAuthorizer
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.createApi();
    this.createTaskLambdafunction();
  }
  createApi() {
    this.api = new gateway.RestApi(this, "taskApi", {});
    
  }
  createTaskLambdafunction() {
    //1- create resource
    const taskResource = this.api.root.addResource("get-task");

    //2- create lambda function

    const getTasksLambdaFn = new lambda_node.NodejsFunction(
      this,
      "helloworldfn",
      {
        functionName: "helloworldfn",
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "getTasks",
        entry: path.join(__dirname, "../controllers/taskController.ts"),
      }
    );

    //3- create method and integration
    taskResource.addMethod(
      "GET",
      new gateway.LambdaIntegration(getTasksLambdaFn)
    );
  }
  }

