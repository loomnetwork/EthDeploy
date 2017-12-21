package k8s

import (
	"github.com/loomnetwork/dashboard/config"

	apiv1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	// Uncomment the following line to load the gcp plugin (only required to authenticate against GKE clusters).
	"fmt"

	"github.com/pkg/errors"
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
)

func makeClient(cfg *config.Config) (*kubernetes.Clientset, error) {
	c, err := clientcmd.BuildConfigFromFlags("", cfg.KubeConfigPath)
	if err != nil {
		return nil, errors.Wrap(err, "Error building config from Flags.")
	}

	return kubernetes.NewForConfig(c)
}

func makeEnv(env map[string]interface{}) []apiv1.EnvVar {
	var e []apiv1.EnvVar
	for k, v := range env {
		e = append(e, apiv1.EnvVar{Name: k, Value: fmt.Sprintf("%v", v)})
	}
	return e
}
