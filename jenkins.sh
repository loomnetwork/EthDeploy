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
DOC_IMAGE=gcr.io/robotic-catwalk-188706/dashboard:${REV}

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile .

gcloud docker -- push ${DOC_IMAGE}

export IMAGE=dashboard

#deploy to k8s

K8S_TMP_FILE=k8s_deployment.yaml

if [[ "$GIT_BRANCH" = "origin/staging" ]]
then
    cp deploy/staging.yaml $K8S_TMP_FILE
    sed -i 's/REV_REPLACE/'"$REV"'/g' $K8S_TMP_FILE
    kubectl replace -f $K8S_TMP_FILE --kubeconfig=/var/lib/jenkins/staging_kube_config.yaml --force
fi