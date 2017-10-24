#!/bin/bash

mkdir -p tmp
rm -rf tmp/testrpc ; true
cd tmp
git clone git@github.com:loomnetwork/testrpc.git
cd testrpc
git checkout save-keys
cd .. 
cd ..

glide install
CGO_ENABLED=0 GOOS=linux go build -o rpc_proxy cmd/rpc_proxy/rpc_proxy.go

REV=`git rev-parse --short HEAD`
DOC_IMAGE=loomnetwork/rpc_gateway:$REV

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile-proxy .
docker push $DOC_IMAGE

