package k8s

import (
	"fmt"

	"github.com/loomnetwork/dashboard/config"
	"github.com/pkg/errors"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
)

const Gateway = "gateway"

type GatewayInstaller struct{}

func makeEnv(env map[string]interface{}) []apiv1.EnvVar {
	var e []apiv1.EnvVar
	for k, v := range env {
		e = append(e, apiv1.EnvVar{Name: k, Value: fmt.Sprintf("%v", v)})
	}
	return e
}

func (g *GatewayInstaller) getImage(cfg *config.Config) (string, error) {
	if cfg.GatewayDockerImage == "" {
		return "", errors.New("Config has no gateway image defined")
	}

	return cfg.GatewayDockerImage, nil
}

// Get the zone this Slug should be installed in.
// Try to maintain the affinity.
// Also try to balance the load evenly between the available zones.
func (g *GatewayInstaller) getZone(slug string, c *kubernetes.Clientset) (string, error) {
	return "us-central1-f", nil
}
