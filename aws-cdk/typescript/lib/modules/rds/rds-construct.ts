import { Construct } from 'constructs';
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  Credentials,
  IInstanceEngine,
  PostgresEngineVersion,
  MysqlEngineVersion,
} from 'aws-cdk-lib/aws-rds';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';


export interface RdsModuleProps {
  vpc: IVpc;
  engine: 'postgres' | 'mysql'; // simple choice
  instanceType: string;
  // other props like storage, subnet groups, etc
}

export class RdsModule extends Construct {
  public readonly instance: DatabaseInstance;
  public readonly secret: Secret;

  constructor(scope: Construct, id: string, props: RdsModuleProps) {
    super(scope, id);

    // pick the engine
    let engine: IInstanceEngine;
    if (props.engine === 'postgres') {
      engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16, });
    } else {
      engine = DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_36, });
    }

    this.secret = new Secret(this, 'RdsSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'rdsuser' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
      },
    });

    this.instance = new DatabaseInstance(this, 'RdsInstance', {
      engine,
      vpc: props.vpc,
      credentials: Credentials.fromSecret(this.secret),
      // instanceType: you’ll convert string to actual instance type object
      // e.g., InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO)
      // plus storage, subnet, etc
    });
  }
}
