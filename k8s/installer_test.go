package k8s

import (
	"testing"

	"flag"
	"log"
	"os"
	"github.com/loomnetwork/dashboard/config"
)

var kubeConfigPath string

func TestInstall(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	err := Install(Gateway, "hello-world", map[string]interface{}{"a": 1}, c)
	if err != nil {
		log.Println(err)
	}
}

func TestMain(m *testing.M) {
	flag.StringVar(&kubeConfigPath, "kubeconfig", "", "Path to Kubernetes config.")
	if !flag.Parsed() {
		flag.Parse()
	}

	if kubeConfigPath == "" {
		log.Println("Missing -kubeconfig")
		os.Exit(127)
	}

	m.Run()
}
