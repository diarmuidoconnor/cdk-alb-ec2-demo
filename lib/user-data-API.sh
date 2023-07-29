#!/bin/bash
yum update -y
sudo su
yum install -y git
yum install -y ruby
curl --silent --location https://rpm.nodesource.com/setup_16.x | bash
yum -y install nodejs

git clone https://github.com/diarmuidoconnor/distributed-systems-express-moviesAPI
cd distributed-systems-express-moviesAPI
npm install
npm run build
 
export SEED_DB=true
export SECRET=ilikecake
export PORT=3000
export MONGO_DB='mongodb+srv://readuser:687flM1WOz@doconnor-atlas-cluster.vddmf.mongodb.net/test?retryWrites=true&w=majority'
npm run start:prod
