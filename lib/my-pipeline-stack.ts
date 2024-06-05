import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { MyPipelineAppStage } from "./my-pipeline-app-stage";

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "hyperTunnel-pipeline-react",
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
        commands: [
          "cd react_code/my-app/",
          "npm i",
          "npm build",
          "cd ..",
          "cd ..",
          "npm ci",
          "npm run build",
          "npx cdk synth",
        ],
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
