package main

import (
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
	gw.Run()
}
