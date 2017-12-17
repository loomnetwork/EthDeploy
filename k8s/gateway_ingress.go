package k8s

import (
	"fmt"

	"github.com/containous/traefik/log"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apputils "k8s.io/apimachinery/pkg/util/intstr"

	"k8s.io/client-go/kubernetes"
)

const ingressControllerClass = "traefik"

func makeHost(slug string) string {
	return fmt.Sprintf("%v.loomapps.io", slug)
}

func makeIngressName(slug string) string {
	return fmt.Sprintf("%v-%v-%v", ingressControllerClass, Gateway, slug)
}

func (g *GatewayInstaller) createIngress(slug string, client *kubernetes.Clientset) error {

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

	log.Println(ingress)

	//fmt.Println("\n Creating ingress rule.")
	//result, err := client.ExtensionsV1beta1().Ingresses("default").Create(ingress)
	//if err != nil {
	//	return err
	//}
	//
	//fmt.Printf("Created a ingress: %s ", result.GetObjectMeta().GetName())
	return nil
}
