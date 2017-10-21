package main

import (
	"strings"

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
	inviteMode := envflag.Bool("INVITE_MODE", true, "Requires whitelisting to create an account")
	level := envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	serverHost := envflag.String("SERVER_HOST", "http://127.0.0.1:8080", "Hostname for server, useful for absolute redirects and oauth")
	loomEnv := envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")

	envflag.Parse()

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}

	// Check for log level specified by environment variable
	if logLevel := strings.ToLower(*level); logLevel != "" {
		// Check for level, default to info on bad level
		level, err := log.ParseLevel(logLevel)
		if err != nil {
			log.WithField("level", logLevel).Error("invalid log level, defaulting to 'info'")
			level = log.InfoLevel
		}

		// Set log level
		log.SetLevel(log.Level(level))
	}

	config := &config.Config{
		DemoMode:       *demo,
		InviteOnlyMode: *inviteMode,
		ServerHost:     *serverHost,
		Env:            *loomEnv,
	}

	database := db.Connect()
	s := server.Setup(database, config)

	s.Run(*bindAddr)
}
