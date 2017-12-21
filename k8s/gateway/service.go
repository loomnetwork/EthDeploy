package gateway

import (
	"fmt"

	"strings"

	"github.com/pkg/errors"
	apiv1 "k8s.io/api/core/v1"
	k8serror "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func MakeName(slug string) string {
	return fmt.Sprintf("%v-%v", Ident, slug)
}

func (g *Installer) createServiceStruct(slug string) *apiv1.Service {
	// Create a service
	return &apiv1.Service{
		TypeMeta: metav1.TypeMeta{
			Kind:       "Service",
			APIVersion: "v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: MakeName(slug),
		},
		Spec: apiv1.ServiceSpec{
			Type: apiv1.ServiceTypeClusterIP,
			Selector: map[string]string{
				"app":  Ident,
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

func (g *Installer) CreateService(slug string, client *kubernetes.Clientset) error {
	sClient := client.CoreV1().Services(apiv1.NamespaceDefault)

	service := g.createServiceStruct(slug)

	s, err := g.GetService(MakeName(slug), client)
	if err == nil && s != nil {
		g.updateStruct(service, s)
		if _, err := sClient.Update(service); err != nil {
			return errors.Wrap(err, "Service update failed")
		}
		return nil
	}

	// Transform the Error.
	ss, ok := err.(k8serror.APIStatus)
	if !ok {
		return errors.Wrapf(err, "Unexpected error message %v", err)
	}

	if strings.Contains(ss.Status().Message, "not found") {
		if _, err := sClient.Create(service); err != nil {
			return errors.Wrap(err, "Service creation failed")
		}
		return nil
	}

	return errors.Errorf("Unhandled Error %v", ss.Status().Message)
}

func (g *Installer) GetService(slug string, client *kubernetes.Clientset) (*apiv1.Service, error) {
	sClient := client.CoreV1().Services(apiv1.NamespaceDefault)
	return sClient.Get(slug, metav1.GetOptions{})
}
