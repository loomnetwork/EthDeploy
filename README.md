# API Server

Simple Rest API using gin(framework) & gorm(orm)

## Endpoint list

### Accounts Resource

```
GET    /accounts
GET    /accounts/:id
POST   /accounts
PUT    /accounts/:id
DELETE /accounts/:id
```

### Apikeys Resource

```
GET    /apikeys
GET    /apikeys/:id
POST   /apikeys
PUT    /apikeys/:id
DELETE /apikeys/:id
```

### Applications Resource

```
GET    /applications
GET    /applications/:id
POST   /applications
PUT    /applications/:id
DELETE /applications/:id
```

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
