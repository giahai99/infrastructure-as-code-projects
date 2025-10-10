import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { VpcModule } from '../modules/vpc';
import { EcsServiceModule } from '../modules/ecs-service';
import { RdsModule } from '../modules/rds';

export interface IacCdkModuleStackProps extends StackProps {
  // you can extend with custom props if needed
}

export class IacCdkModuleStack extends Stack {
  constructor(scope: Construct, id: string, props?: IacCdkModuleStackProps) {
    super(scope, id, props);

    // create a VPC module
    const vpc = new VpcModule(this, 'VpcModule', {
      maxAzs: 2,
      cidr: '10.0.0.0/16',
    });

    // create RDS (database) module
    const rds = new RdsModule(this, 'RdsModule', {
      vpc: vpc.vpc,
      engine: 'postgres',
      instanceType: 't3.micro',  // just for example
    });

    // create an ECS service module
    const ecs = new EcsServiceModule(this, 'EcsModule', {
      vpc: vpc.vpc,
      desiredCount: 2,
      // pass DB connection, security groups, etc
      dbInstance: rds.instance,
      dbSecret: rds.secret,
    });
  }
}
