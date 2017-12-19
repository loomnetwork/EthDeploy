package k8s

import (
	"fmt"
	"strings"

	"github.com/pkg/errors"
	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func makeGatewayName(slug string) string {
	return fmt.Sprintf("%v-%v", Gateway, slug)
}

func (g *GatewayInstaller) createServiceStruct(slug string) *apiv1.Service {
	// Create a service
	return &apiv1.Service{
		TypeMeta: metav1.TypeMeta{
			Kind:       "Service",
			APIVersion: "v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: makeGatewayName(slug),
		},
		Spec: apiv1.ServiceSpec{
			Type: apiv1.ServiceTypeClusterIP,
			Selector: map[string]string{
				"app":  Gateway,
				"slug": slug,
			},
			Ports: []apiv1.ServicePort{
				{
					Name:     "http",
					Protocol: apiv1.ProtocolTCP,
					Port:     gatewayPort,
				},
			},
		},
	}
}

func (g *GatewayInstaller) createService(slug string, client *kubernetes.Clientset) error {
	sClient := client.CoreV1().Services(apiv1.NamespaceDefault)

	service := g.createServiceStruct(slug)
	s, err := g.getService(makeGatewayName(slug), client)
	if s != nil {
		if _, err := sClient.Update(s); err != nil {
			return errors.Wrap(err, "Service update failed.")
		}
		return nil
	}

	if !strings.Contains(err.Error(), "not found") {
		return errors.Wrap(err, "Cannot fetch service.")
	}

	//Create a defined service
	if _, err := sClient.Create(service); err != nil {
		return errors.Wrap(err, "Service creation failed.")
	}

	return nil
}

func (g *GatewayInstaller) getService(slug string, client *kubernetes.Clientset) (*apiv1.Service, error) {
	sClient := client.CoreV1().Services(apiv1.NamespaceDefault)
	s, err := sClient.Get(slug, metav1.GetOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "Cannot get service")
	}
	return s, nil
}
