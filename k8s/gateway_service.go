package k8s

import (
	"fmt"
	"log"

	"k8s.io/client-go/kubernetes"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func makeGatewayName(slug string) string {
	return fmt.Sprintf("%v-%v", Gateway, slug)
}

func (g *GatewayInstaller) createService(slug string, client *kubernetes.Clientset) error {
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

	log.Println(service)

	////Create a defined service
	//fmt.Println("\n Creating ganache service.")
	//result, err := client.Services("default").Create(service)
	//if err != nil {
	//	return err
	//}
	//
	//fmt.Printf("Created service: %s !!", result.GetObjectMeta().GetName())
	//
	////List Services
	//services, err := client.Services("").List(metav1.ListOptions{})
	//if err != nil {
	//	return err
	//}
	//
	//for _, s := range services.Items {
	//	fmt.Printf(" Service created: %s \n", s.Name)
	//}

	return nil
}
