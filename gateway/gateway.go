package gateway

import (
	"fmt"
	"io"
	"os/exec"
	"strings"
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

func (g *Gateway) spawnChildNetwork() {
	args := strings.Split(g.cfg.SpawnNetwork, " ")
	fmt.Printf("launching -%s -(%d)-%v\n", args[0], len(args[1:]), args[1:])
	cmd := exec.Command(args[0], args[1:]...)
	/*
		path, err := os.Getwd()
		if err != nil {
			log.WithField("error", err).Error("failed getting path")
		}
		fmt.Printf("path-%s-\n", path)
			cmd.Dir = path
	*/
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

type Gateway struct {
	StopChannel chan bool
	cfg         *config.Config
}

func InitGateway(c *config.Config) *Gateway {
	return &Gateway{StopChannel: make(chan bool), cfg: c}
}

func (g *Gateway) Run(bindAddr string, skipLetsEncrypt bool) {
	/*
		err := downloadAndExtractApp(*applicationZipPath)
		if err != nil {
			log.WithField("error", err).Error("failed downloading and extracted zip")
			log.Fatal(err)
		}
	*/
	go g.spawnChildNetwork()

	//	database := db.Connect()
	s := setup(nil, g.cfg) //database //TODO readd database

	//TODO move http to seperate thread, and main thread just checks for Ctrl-C

	//local dev we will ignore using letsencrypt
	//	if *skipLetsEncrypt == false {
	s.Run()
	/*	} else {
			http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
				s.ServeHTTP(w, r)
			})
			var m letsencrypt.Manager
			if err := m.CacheFile("letsencrypt.cache"); err != nil {
				log.Fatal(err)
			}
			log.Fatal(m.Serve())
		}
	*/
	// Likely this would never happen, cause the http server would have to close
	g.StopChannel <- true
	time.Sleep(2 * time.Second) // Atleast try and give time to kill the subprogram
}
