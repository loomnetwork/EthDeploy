#!/bin/bash
export GOPATH=~/gopath
export PATH=$PATH:~/gopath/bin

mkdir -p ~/gopath/src/github.com/loomnetwork
ln -sfn `pwd` ~/gopath/src/github.com/loomnetwork/dashboard
cd  ~/gopath/src/github.com/loomnetwork/dashboard

glide install
CGO_ENABLED=0 GOOS=linux go build -o dashboard main.go

npm install
./node_modules/.bin/gulp

REV=`git rev-parse --short HEAD`
DOC_IMAGE=loomnetwork/dashboard:$REV

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile .
docker push $DOC_IMAGE

export IMAGE=dashboard


ssh root@128.199.83.146 "docker pull loomnetwork/${IMAGE}:$REV && docker stop ${IMAGE}; true && docker rm ${IMAGE}; true && docker run  --log-driver=syslog -d -v /dev/log:/dev/log -e SERVER_HOST=\"https://dashboard.loomx.io\" -e DEMO_MODE=false -e BETA_MODE=false  -e GIN_MODE=release -e LOG_LEVEL=debug  -e AUTOMIGRATE=1 -e DATABASE_PASS=power2edit -e \"LETSENCRYPT_HOST=dashboard.loomx.io\" -e \"LETSENCRYPT_EMAIL=team@loomx.com\" -e \"VIRTUAL_HOST=dashboard.loomx.io\" -e DATABASE_HOST=172.17.0.1 -p 8081:8080 --name ${IMAGE} loomnetwork/${IMAGE}:$REV && docker update --restart=always ${IMAGE}"