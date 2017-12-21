package gateway

import (
	"github.com/loomnetwork/dashboard/config"
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

// Get the zone this Slug should be installed in.
// Try to maintain the affinity.
// Also try to balance the load evenly between the available zones.
func (g *Installer) GetZone(slug string, c *kubernetes.Clientset) (string, error) {
	return "us-central1-f", nil
}

func int32Ptr(i int32) *int32 {
	return &i
}
