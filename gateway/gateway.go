package gateway

import (
	"sync"

	"log"

	"fmt"

	"github.com/loomnetwork/dashboard/config"
)

//type appLogWriter struct{ Pid int }
//
//func (a appLogWriter) Write(p []byte) (n int, err error) {
//	//Non structured logs from executable
//	fmt.Print(string(p))
//
//	//In prod use structured
//	//	log.WithField("PID", a.Pid).Info(string(p))
//
//	return len(p), nil
//}

//func (g *Gateway) spawnChildNetwork() {
//	args := strings.Split(g.cfg.SpawnNetwork, " ")
//	args = append(args, "--acctKeys")
//	args = append(args, "data.json")
//	//	fmt.Printf("launching -%s -(%d)-%v\n", args[0], len(args[1:]), args[1:])
//	log.WithField("args", args).Info("Launching childnetwork")
//	cmd := exec.Command(args[0], args[1:]...)
//
//	stderr, err := cmd.StderrPipe()
//	if err != nil {
//		log.WithField("error", err).Error("failed redirecting stderr")
//	}
//
//	stdout, err := cmd.StdoutPipe()
//	if err != nil {
//		log.WithField("error", err).Error("failed redirecting stdout")
//	}
//
//	err = cmd.Start()
//	if err != nil {
//		log.WithField("error", err).Error("failed starting child network")
//	}
//
//	go io.Copy(appLogWriter{cmd.Process.Pid}, stderr)
//	go io.Copy(appLogWriter{cmd.Process.Pid}, stdout)
//
//	log.WithField("pid", cmd.Process.Pid).Error("Launched!")
//	go func() {
//		<-g.StopChannel
//		pid := cmd.Process.Pid
//		log.WithField("pid", pid).Error("killing pid")
//
//		cmd.Process.Kill()
//	}()
//
//	go g.deployContracts()
//
//	cmd.Wait()
//	//TODO respawn???
//
//	log.Error("self killing since the subprocess died\n")
//	//Mildly gross, kill ourselves
//	proc, err := os.FindProcess(os.Getpid())
//	if err != nil {
//		log.Println(err)
//	}
//	// Kill the process
//	proc.Kill()
//}

//func preKillNode() {
//	cmd := exec.Command("pkill", "node")
//	err := cmd.Start()
//	if err != nil {
//		log.Errorf("Failed killing Node %v", err)
//	}
//}

type Contract struct {
	Name    string
	Address string
}

func (g *Gateway) getContracts() []*Contract {
	g.RLock()
	defer g.RUnlock()

	ret := []*Contract{}
	for _, contract := range g.contracts {
		ret = append(ret, contract) //the pointers never change only the array, if the pointers change then we need to make copies of them also
	}
	return ret //TODO fix
}

func (g *Gateway) addContract(name, address string) {
	g.Lock()
	defer g.Unlock()
	c := &Contract{Name: name, Address: address}

	g.contracts = append(g.contracts, c)
}

type Gateway struct {
	sync.RWMutex // for the contracts
	appDir       string
	guid         string //unique id for this instance
	cfg          *config.RPCConfig
	contracts    []*Contract //Only access with helper methods, cause its not threadsafe
}

func InitGateway(c *config.RPCConfig) *Gateway {
	return &Gateway{cfg: c}
}

func (g *Gateway) Run() {
	err := g.downloadAndExtractApp(g.cfg.ApplicationZipPath)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		if err := g.deployContracts(); err != nil {
			fmt.Println(err)
		}
	}()

	//	database := db.Connect()
	s := g.setupHttp(nil) //database //TODO readd database
	s.Run(g.cfg.BindAddr) //Gin run
}
