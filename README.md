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
AUTOMIGRATE=1 go run main.go
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
