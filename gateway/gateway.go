package gateway

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/containous/traefik/log"
	"github.com/loomnetwork/dashboard/config"
)

type appLogWriter struct{ Pid int }

func (a appLogWriter) Write(p []byte) (n int, err error) {
	//Non structured logs from executable
	fmt.Print(string(p))

	//In prod use structured
	//	log.WithField("PID", a.Pid).Info(string(p))

	return len(p), nil
}

func (g *Gateway) deployContracts() {
	time.Sleep(2 * time.Second) //To be certain we don't accidentally load to quickly
}

func (g *Gateway) spawnChildNetwork() {
	args := strings.Split(g.cfg.SpawnNetwork, " ")
	fmt.Printf("launching -%s -(%d)-%v\n", args[0], len(args[1:]), args[1:])
	cmd := exec.Command(args[0], args[1:]...)

	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.WithField("error", err).Error("failed redirecting stderr")
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.WithField("error", err).Error("failed redirecting stdout")
	}

	err = cmd.Start()
	if err != nil {
		log.WithField("error", err).Error("failed starting child network")
	}

	go io.Copy(appLogWriter{cmd.Process.Pid}, stderr)
	go io.Copy(appLogWriter{cmd.Process.Pid}, stdout)

	log.WithField("pid", cmd.Process.Pid).Error("Launched!")
	go func() {
		<-g.StopChannel
		pid := cmd.Process.Pid
		log.WithField("pid", pid).Error("killing pid")

		cmd.Process.Kill()
	}()

	go g.deployContracts()

	cmd.Wait()
	//TODO respawn???
}

func preKillNode() {
	cmd := exec.Command("pkill", "node")
	err := cmd.Start()
	if err != nil {
		log.WithField("error", err).Error("failed killing node")
	}
}

type Contract struct {
	Name    string
	Address string
}

func (g *Gateway) getContracts() []*Contract {
	g.RLock()
	defer g.RUnlock()

	ret := []*Contract{}
	copy(g.contracts, ret) //the pointers never change only the array, if the pointers change then we need to make copies of them also
	return ret
}
func (g *Gateway) addContracts(c *Contract) {
	g.Lock()
	defer g.Unlock()

	g.contracts = append(g.contracts, c)
}

type Gateway struct {
	sync.RWMutex // for the contracts
	StopChannel  chan bool
	appDir       string
	cfg          *config.RPCConfig
	contracts    []*Contract //Only access with helper methods, cause its not threadsafe
}

func InitGateway(c *config.RPCConfig) *Gateway {
	return &Gateway{StopChannel: make(chan bool), cfg: c}
}

func (g *Gateway) Run() {
	err := g.downloadAndExtractApp(g.cfg.ApplicationZipPath)
	if err != nil {
		log.WithField("error", err).Error("failed downloading and extracted zip")
		log.Fatal(err)
	}
	os.Exit(1)

	go g.spawnChildNetwork()

	//	database := db.Connect()
	s := g.setupHttp(nil) //database //TODO readd database

	s.Run(g.cfg.BindAddr) //Gin run

	// Likely this would never happen, cause the http server would have to close
	g.StopChannel <- true
	time.Sleep(2 * time.Second) // Atleast try and give time to kill the subprogram
}
