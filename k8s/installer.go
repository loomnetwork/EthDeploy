package k8s

import (
	"github.com/loomnetwork/dashboard/config"
	"github.com/pkg/errors"
	"k8s.io/client-go/kubernetes"
)

type installer interface {
	getImage(*config.Config) (string, error)
	getZone(slug string, c *kubernetes.Clientset) (string, error)

	createService(slug string, c *kubernetes.Clientset) error
	createIngress(slug string, c *kubernetes.Clientset) error
	createDeployment(image, slug string, env map[string]interface{}, c *kubernetes.Clientset) error
}

func getInstaller(ident string) installer {
	switch ident {
	case Gateway:
		return &GatewayInstaller{}
	}

	panic(errors.New("Unknown type " + ident))
	return nil
}

func Install(ident, slug string, env map[string]interface{}, cfg *config.Config) error {
	client, err := makeClient(cfg)
	if err != nil {
		return errors.Wrap(err, "Cannot create Kubernetes client")
	}

	i := getInstaller(ident)

	image, err := i.getImage(cfg)
	if err != nil {
		return errors.Wrap(err, "Cannot find a valid Image file")
	}

	if err := i.createDeployment(image, slug, env, client); err != nil {
		return errors.Wrap(err, "Could not deploy the k8s application")
	}

	if err := i.createService(slug, client); err != nil {
		return errors.Wrap(err, "could not create k8s service.")
	}

	if err := i.createIngress(slug, client); err != nil {
		return errors.Wrap(err, "could not create k8s Ingress.")
	}

	return nil
}
