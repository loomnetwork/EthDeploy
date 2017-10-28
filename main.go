package main

import (
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/server"
)

// main ...
func main() {
	cfg := config.GetDefaultedConfig()

	database := db.Connect()
	s := server.Setup(database, cfg)

	s.Run(cfg.BindAddr)
}
