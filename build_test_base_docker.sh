#!/bin/bash

mkdir -p tmp
rm -rf tmp/testrpc ; true
cd tmp
git clone https://github.com/loomnetwork/testrpc.git
cd testrpc
git checkout save-keys
rm -rf build
npm install
npm run build
cd .. 
cd ..

REV=`git rev-parse --short HEAD`
DOC_IMAGE=loomnetwork/test_rpc_base:$REV

echo "building $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile-testrpc-base .
echo "sending $DOC_IMAGE"
docker push $DOC_IMAGE

