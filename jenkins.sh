#!/bin/bash
export GOPATH=~/gopath
export PATH=$PATH:~/gopath/bin


glide install
CGO_ENABLED=0 GOOS=linux go build --prefix loomnetwork/dashboard -o dashboard main.go

REV=`git rev-parse --short HEAD`
DOC_IMAGE=loomnetwork/dashboard:$REV

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile .
docker push $DOC_IMAGE

IMAGE=dashboard


ssh root@128.199.83.146 "docker pull loomnetwork/${IMAGE}:$REV && docker stop ${IMAGE}; true && docker rm ${IMAGE}; true && docker run  --log-driver=syslog -d -v /dev/log:/dev/log -e \"LETSENCRYPT_HOST=dashboard.loomx.io\" -e \"LETSENCRYPT_EMAIL=team@loomx.com\" -e \"VIRTUAL_HOST=dashboard.loomx.io\" -p 8080:8080 --name loom_apps loomnetwork/${IMAGE}:$REV && docker update --restart=always ${IMAGE}"