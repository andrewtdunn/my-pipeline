import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { MyPipelineAppStage } from "./my-pipeline-app-stage";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MyPipelineQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "MyPipeline",
      crossAccountKeys: true,
      synth: new ShellStep("Synth", {
        //input: CodePipelineSource.gitHub("andrewtdunn/my-pipeline", "main"),
        input: CodePipelineSource.connection(
          "andrewtdunn/my-pipeline",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:us-east-1:637423577773:connection/78b54ada-1f46-4e0d-8b5c-572f1c8ee882",
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(
      new MyPipelineAppStage(this, "deploy-test", {
        env: { account: "730335377532", region: "us-east-1" },
      })
    );

    pipeline.addStage(
      new MyPipelineAppStage(this, "deploy-prod", {
        env: { account: "339713083299", region: "us-east-1" },
      })
    );
  }
}
