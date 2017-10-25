# API Server

Simple Rest API using gin(framework) & gorm(orm)
server runs at http://localhost:8080


### Setup
```bash
glide install
mysql -u root -p -e "create database loom"
go get github.com/pilu/fresh
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

one window
```
git clone git@github.com:loomnetwork/testrpc.git
git checkout save-keys
node cli.js --acctKeys data.json --db testdata
```

another window
```
PRIVATE_KEY_JSON_PATH=<checkoutPath>testrpc/data.json  go run cmd/rpc_proxy/rpc_proxy.go
```

to get public/private keys
```
curl -XPOST localhost:8081/_loom/accounts
```

to make web3 requests
```
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' localhost:8081/
```

to run in fresh
```
fresh -c proxy_runner.conf
```