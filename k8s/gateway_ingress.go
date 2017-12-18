package k8s

import (
	"fmt"
	"log"

	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apputils "k8s.io/apimachinery/pkg/util/intstr"

	"k8s.io/client-go/kubernetes"
	"github.com/pkg/errors"
)

const ingressControllerClass = "traefik"

func makeHost(slug string) string {
	return fmt.Sprintf("%v.loomapps.io", slug)
}

func makeIngressName(slug string) string {
	return fmt.Sprintf("%v-%v-%v", ingressControllerClass, Gateway, slug)
}

func (g *GatewayInstaller) createIngress(slug string, client *kubernetes.Clientset) error {

	i, err := g.getIngress(makeIngressName(slug), client)
	if i != nil {
		updatedIngress, err := client.ExtensionsV1beta1().Ingresses("default").Update(i)
		if err != nil {
			return errors.Wrap(err, "Ingress update failed.")
		}

		log.Println(updatedIngress)
		return nil
	}

	if err.Error() != fmt.Sprintf("Cannot get ingress: ingress \"%s\" not found", makeGatewayName(slug)) {
		return errors.Wrap(err, "Error in checking if ingress exists.")
	}


	ingress := &extensionsv1beta1.Ingress{
		TypeMeta: metav1.TypeMeta{
			Kind: "Ingress",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: makeIngressName(slug),
			Annotations: map[string]string{
				"kubernetes.io/ingress.class": ingressControllerClass,
			},
		},
		Spec: extensionsv1beta1.IngressSpec{
			Rules: []extensionsv1beta1.IngressRule{
				{
					Host: makeHost(slug),
					IngressRuleValue: extensionsv1beta1.IngressRuleValue{
						HTTP: &extensionsv1beta1.HTTPIngressRuleValue{
							Paths: []extensionsv1beta1.HTTPIngressPath{
								{
									Path: "/",
									Backend: extensionsv1beta1.IngressBackend{
										ServiceName: makeGatewayName(slug),
										ServicePort: apputils.IntOrString{IntVal: gatewayPort},
									},
								},
							},
						},
					},
				},
			},
		},
	}


	result, err := client.ExtensionsV1beta1().Ingresses("default").Create(ingress)
	if err != nil {
		return errors.Wrap(err, "Ingress creration failed.")
	}
	log.Println(result)

	return nil
}

func (g *GatewayInstaller) getIngress(slug string, client *kubernetes.Clientset) (*extensionsv1beta1.Ingress, error) {
	i, err := client.ExtensionsV1beta1().Ingresses("default").Get(slug, metav1.GetOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "Could not get ingress")
	}
	return i, nil
}