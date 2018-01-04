package k8s

import (
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/k8s/ganache"
	"github.com/loomnetwork/dashboard/k8s/gateway"
	"github.com/pkg/errors"

	"fmt"

	apiv1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
)

type installer interface {
	GetImage(*config.Config) (string, error)
	GetZone(slug string, c *kubernetes.Clientset) (string, error)

	CreateService(slug string, c *kubernetes.Clientset) error
	CreateIngress(slug, host string, c *kubernetes.Clientset) error
	CreateDeployment(image, slug string, env []apiv1.EnvVar, c *kubernetes.Clientset) error
}

func getInstaller(ident string) installer {
	switch ident {
	case gateway.Ident:
		return &gateway.Installer{}
	case ganache.Ident:
		return &ganache.Installer{}
	}

	panic(errors.New("Unknown type " + ident))
	return nil
}

func makeHost(slug string, cfg *config.Config) string {
	return fmt.Sprintf("%v.%v", slug, cfg.GatewayTld)
}

func Install(ident, slug string, env map[string]interface{}, cfg *config.Config) error {
	client, err := makeClient(cfg)
	if err != nil {
		return errors.Wrap(err, "Cannot create Kubernetes client")
	}

	i := getInstaller(ident)

	image, err := i.GetImage(cfg)
	if err != nil {
		return errors.Wrap(err, "Cannot find a valid Image file")
	}

	if err := i.CreateDeployment(image, slug, makeEnv(env), client); err != nil {
		return errors.Wrap(err, "Could not deploy the k8s application")
	}

	if err := i.CreateService(slug, client); err != nil {
		return errors.Wrap(err, "could not create k8s service.")
	}

	if err := i.CreateIngress(slug, makeHost(slug, cfg), client); err != nil {
		return errors.Wrap(err, "could not create k8s Ingress.")
	}

	return nil
}
