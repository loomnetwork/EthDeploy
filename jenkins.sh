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
DOC_IMAGE=gcr.io/robotic-catwalk-188706/dashboard:${REV}

echo "sending $DOC_IMAGE"
docker build -t $DOC_IMAGE -f Dockerfile .

gcloud docker -- push ${DOC_IMAGE}

export IMAGE=dashboard

#export sshcommand="docker pull loomnetwork/${IMAGE}:$REV && docker stop ${IMAGE}; true && docker rm ${IMAGE}; true && docker run  --log-driver=syslog -d -v /dev/log:/dev/log -e NOMAD_ADDR=http://159.89.198.88:4646 -e BIND_ADDR=\":8080\" -e LOOM_ENV=production -e SERVER_HOST=\"https://dashboard.loomx.io\" -e DEMO_MODE=false -e BETA_MODE=false  -e GIN_MODE=debug -e LOG_LEVEL=debug  -e AUTOMIGRATE=1 -e DATABASE_PASS=power2edit -e \"LETSENCRYPT_HOST=dashboard.loomx.io\" -e \"LETSENCRYPT_EMAIL=team@loomx.com\" -e \"VIRTUAL_HOST=dashboard.loomx.io\" -e DATABASE_HOST=172.17.0.1 -p 8081:8080 --name ${IMAGE} loomnetwork/${IMAGE}:$REV && docker update --restart=always ${IMAGE}"
#echo $sshcommand
#ssh root@128.199.83.146 $sshcommand

#deploy to nomad

#TMP_FILE=tmp_dashboard.nomad
#cp dashboard.nomad $TMP_FILE
#sed -i 's/REV_REPLACE/'"$REV"'/g' $TMP_FILE
#cat $TMP_FILE
#NOMAD_ADDR=http://45.55.246.200:4646 nomad run $TMP_FILE


echo "Ok now building the RPC Gateway, we don't deploy it anyway automatically yet"
#todo maybe have two jenkins jobs??
./build_proxy_docker.sh