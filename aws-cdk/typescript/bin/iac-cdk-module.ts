#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IacCdkModuleStack } from '../lib/stacks/iac-cdk-module-stack';

const app = new cdk.App();

// Get region from context or env vars
const region = app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION;

new IacCdkModuleStack(app, 'IacCdkModuleStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: region,
  },
});