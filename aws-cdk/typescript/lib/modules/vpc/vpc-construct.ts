import { Construct } from 'constructs';
import { Vpc, SubnetType, IVpc, SubnetConfiguration } from 'aws-cdk-lib/aws-ec2';

export interface VpcModuleProps {
  maxAzs?: number;
  cidr?: string;
  // other VPC options you want to expose
}

export class VpcModule extends Construct {
  public readonly vpc: IVpc;

  constructor(scope: Construct, id: string, props: VpcModuleProps) {
    super(scope, id);

    const subnetConfigs: SubnetConfiguration[] = [
      {
        name: 'Public',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: 'Private',
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
      },
    ];

    this.vpc = new Vpc(this, 'Vpc', {
      cidr: props.cidr ?? '10.0.0.0/16',
      maxAzs: props.maxAzs ?? 2,
      subnetConfiguration: subnetConfigs,
    });
  }
}
