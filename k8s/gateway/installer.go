package gateway

import (
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/k8s/helper"
	"github.com/pkg/errors"
	"k8s.io/client-go/kubernetes"
)

const Ident = "gateway"

type Installer struct{}

func (g *Installer) GetImage(cfg *config.Config) (string, error) {
	if cfg.GatewayDockerImage == "" {
		return "", errors.New("Config has no gateway image defined")
	}

	return cfg.GatewayDockerImage, nil
}

func (g *Installer) GetZone(slug string, c *kubernetes.Clientset) (string, error) {
	return helper.GetZone(slug, c)
}
