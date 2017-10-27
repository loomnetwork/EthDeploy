package main

import (
	"strings"
	"time"

	"github.com/ianschenck/envflag"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/gateway"
	log "github.com/sirupsen/logrus"
)

func main() {
	demo := envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	level := envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	loomEnv := envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr := envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")
	skipLetsEncrypt := envflag.Bool("LETS_ENCRYPT_ENABLE", false, "enables or disables lets encrypt ssl")
	proxyAddr := envflag.String("PROXY_ADDR", "http://localhost:8545", "Where the actual web3 rpc address exists")
	privateKeyJsonFile := envflag.String("PRIVATE_KEY_JSON_PATH", "misc/example_private_keys.json", "TestRPC json output")
	spawnNetwork := envflag.String("SPAWN_NETWORK", "node tmp/testrpc/build/cli.node.js", "How does test rpc spawn the testrpc or ethereum network")
	preKill := envflag.Bool("PRE_KILL", false, "kills all node processes to cleanup first")
	tmpDir := envflag.String("TMP_DIR", "tmp_uploads", "the directory where we will store the uploaded zip")
	//	applicationZipPath := envflag.String("APP_ZIP_FILE", "do://https://loom.nyc3.digitaloceanspaces.com/uploads/block_ssh.zip", "Location of app zip file")
	//	appSlug := envflag.String("APP_SLUG", "block_ssh", "domain slug for the application")

	envflag.Parse()

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}
	if *preKill == true {
		log.Info("killing all node instances")
		//preKillNode()
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
		DemoMode:           *demo,
		Env:                *loomEnv,
		ProxyAddr:          *proxyAddr,
		PrivateKeyJsonFile: *privateKeyJsonFile,
		SpawnNetwork:       *spawnNetwork,
		TmpDir:             *tmpDir,
	}

	gw := gateway.InitGateway(config)

	go gw.Run(*bindAddr, *skipLetsEncrypt)

	// Likely this would never happen, cause the http server would have to close
	gw.StopChannel <- true
	time.Sleep(2 * time.Second) // Atleast try and give time to kill the subprogram

}
