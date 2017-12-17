package k8s

import (
	"fmt"
	"testing"

	"github.com/containous/traefik/log"
	"github.com/loomnetwork/dashboard/config"
)

func TestInstall(t *testing.T) {
	c, err := makeClient(&config.Config{KubeConfigPath: "/home/meson10/workspace/loomx/kubeconfig"})
	log.Println(c, err)
}

func TestMain(m *testing.M) {
	fmt.Println("ok")
	m.Run()
}
