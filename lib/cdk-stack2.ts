import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', {isDefault: true});

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'yum install -y httpd',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html',
    );

    const serverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc: defaultVpc,
      allowAllOutbound: true,
    });

    serverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP access from anywhere',
    );

    const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
      vpc: defaultVpc,
      securityGroup: serverSG,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.NANO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
    });

    new cdk.CfnOutput(this, 'EC2 Public DNS', {
      value: ec2Instance.instancePublicDnsName,
    });
  }
}
