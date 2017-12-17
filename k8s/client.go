package k8s

import (
	"github.com/loomnetwork/dashboard/config"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	// Uncomment the following line to load the gcp plugin (only required to authenticate against GKE clusters).
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
)

func int32Ptr(i int32) *int32 {
	return &i
}

func makeClient(cfg *config.Config) (*kubernetes.Clientset, error) {
	c, err := clientcmd.BuildConfigFromFlags("", cfg.KubeConfigPath)
	if err != nil {
		panic(err)
	}

	return kubernetes.NewForConfig(c)
}
