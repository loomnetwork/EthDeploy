package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ianschenck/envflag"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/gateway"
	log "github.com/sirupsen/logrus"
)

func main() {
	preKill := envflag.Bool("PRE_KILL", false, "kills all node processes to cleanup first")

	cfg := config.GetDefaultedRPCConfig()

	if *preKill == true {
		log.Info("killing all node instances")
		//preKillNode()
	}

	gw := gateway.InitGateway(cfg)

	go gw.Run()

	//Wait for CTRL-C
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	fmt.Printf("waiting for signals\n")
	<-sigs
	fmt.Printf("after waiting for signals\n")

	gw.StopChannel <- true
	time.Sleep(2 * time.Second) // Atleast try and give time to kill the subprogram
}
