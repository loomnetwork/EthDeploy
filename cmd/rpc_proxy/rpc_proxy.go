package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/ianschenck/envflag"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/gateway"
	log "github.com/sirupsen/logrus"
)

func main() {
	level := envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	preKill := envflag.Bool("PRE_KILL", false, "kills all node processes to cleanup first")

	cfg := config.GetDefaultedRPCConfig()

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

	gw := gateway.InitGateway(cfg)

	go gw.Run()

	//Wait for CTRL-C
	c := make(chan os.Signal, 2)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c

		gw.StopChannel <- true
		time.Sleep(2 * time.Second) // Atleast try and give time to kill the subprogram

		os.Exit(1)
	}()

	for {
		fmt.Println("sleeping...")
		time.Sleep(10 * time.Second) // or runtime.Gosched() or similar per @misterbee
	}
}
