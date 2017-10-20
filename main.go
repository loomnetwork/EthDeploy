package main

import (
	"github.com/ianschenck/envflag"

	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/server"
	log "github.com/sirupsen/logrus"
)

// main ...
func main() {

	demo := envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors")
	bindAddr := envflag.String("BIND_ADDR", ":8080", "What address to bind the main webserver to")

	envflag.Parse()

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}

	config := &config.Config{
		DemoMode: *demo,
	}

	database := db.Connect()
	s := server.Setup(database, config)

	s.Run(*bindAddr)
}
