import { Construct } from 'constructs';
import {
  Cluster,
  FargateService,
  FargateTaskDefinition,
  ContainerImage,
  Protocol,
} from 'aws-cdk-lib/aws-ecs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance } from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export interface EcsServiceModuleProps {
  vpc: IVpc;
  desiredCount: number;
  dbInstance: DatabaseInstance;
  dbSecret: Secret;
  // other props: container image, port, etc
}

export class EcsServiceModule extends Construct {
  constructor(scope: Construct, id: string, props: EcsServiceModuleProps) {
    super(scope, id);

    const cluster = new Cluster(this, 'Cluster', {
      vpc: props.vpc,
    });

    const taskDef = new FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    // example: a container that connects to the DB
    const container = taskDef.addContainer('AppContainer', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      environment: {
        DB_ENDPOINT: props.dbInstance.dbInstanceEndpointAddress,
        DB_SECRET_ARN: props.dbSecret.secretArn,
      },
      // more container settings
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: Protocol.TCP,
    });

    new FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: props.desiredCount,
    });

    // you might also grant the container task role permission to read the secret
    props.dbSecret.grantRead(taskDef.taskRole);
  }
}
