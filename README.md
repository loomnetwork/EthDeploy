# EthDeploy 

Ethdeploy is a system that allows for cloud based 'staging' or 'development' environments for blockchains. The actual service is in private beta. Its simply an easy way for people to have a private Ethereum blockchain, since Ropsten Test network can be unstable at times. It is written in Go with a pure JS frontend. It requires Kubernetes to run, older builds supported Nomad but that is no longer supported.

This project is only lightly updated, as we are currently focused on dAppChain tech. The code is licensed under GPLv3.

# API Server

Simple Rest API using gin(framework) & gorm(orm)
server runs at http://localhost:8080


### Setup
```bash
glide install
mysql -u root -p -e "create database loom"
go get github.com/loomnetwork/fresh
```

__For Local Development__

Install hot reload server
```bash
go get fresh
```

### Run

Without hot reloading
```bash
LOG_LEVEL=debug BETA_MODE=true INVITE_MODE=false  go run main.go
```

With hot reloading
```bash
fresh
```

asset pipeline
```
gulp #to compile it once
gulp watch #to do autoreload
```


## config options

Beta mode disables security and opens all features even just uncompleted ones
```
BETA_MODE=true
```

Invite mode requires people to be whitelisted before they can login
```
INVITE_MODE=false
```


## Web3 proxy info

to get public/private keys
```
curl -XPOST localhost:8081/_loom/accounts
```

to make web3 requests
```
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' localhost:8081/
```

###to run in fresh

first time
```
mkdir -p tmp
rm -rf tmp/testrpc ; true
cd tmp
git clone https://github.com/loomnetwork/testrpc.git
cd testrpc
git checkout save-keys
cd .. 
cd ..
```

after that
```
fresh -c proxy_runner.conf
```

or

```
PRIVATE_KEY_JSON_PATH=tmp/testrpc/data.json SPAWN_NETWORK="/usr/local/bin/node tmp/testrpc/build/cli.node.js" PRE_KILL=true go run cmd/rpc_proxy/rpc_proxy.go
```
