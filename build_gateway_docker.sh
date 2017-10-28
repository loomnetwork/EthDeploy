#!/bin/bash

glide install
#CGO_ENABLED=0  #TODO cant disable cgo cause ethereum, need to tweak some other flags
rm rpc_proxy ; true
GOOS=linux go build -o rpc_proxy cmd/rpc_proxy/rpc_proxy.go

REV=`git rev-parse --short HEAD`
DOC_IMAGE=loomnetwork/rpc_gateway:$REV

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile-proxy .
docker push $DOC_IMAGE

