package k8s

import (
	"fmt"
	"log"

	"k8s.io/client-go/kubernetes"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"github.com/pkg/errors"
	"strings"
)

func makeGatewayName(slug string) string {
	return fmt.Sprintf("%v-%v", Gateway, slug)
}

func (g *GatewayInstaller) createService(slug string, client *kubernetes.Clientset) error {

	s, err := g.getService(makeGatewayName(slug), client)
	if s != nil {
		updatedService, err := client.CoreV1().Services("default").Update(s)
		if err != nil {
			return errors.Wrap(err, "Update service failed.")
		}

		log.Println(updatedService)
		return nil
	}

	if !strings.Contains(err.Error(), "not found") {
		return errors.Wrap(err, "Error in checking if service exists.")
	}

	// Create a service
	service := &apiv1.Service{
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

	//Create a defined service
	result, err := client.CoreV1().Services("default").Create(service)
	if err != nil {
		return errors.Wrap(err, "Service creation failed.")
	}
	log.Println(result)

	return nil
}

func (g *GatewayInstaller) getService(slug string, client *kubernetes.Clientset) (*apiv1.Service, error) {
	s, err := client.CoreV1().Services("default").Get(slug, metav1.GetOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "Cannot get service")
	}
	return s, nil
}