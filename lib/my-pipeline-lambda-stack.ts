import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";

export class MyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Function(this, "LambdaFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new InlineCode(`exports.handler = async function(event) {
        console.log("request:", JSON.stringify(event, undefined, 2));
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/plain" },
          body: 'Hello, CDK!'
        };
      };`),
    });
  }
}
