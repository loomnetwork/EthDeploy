package k8s

import (
	"fmt"
	"strings"

	apiv1 "k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apputils "k8s.io/apimachinery/pkg/util/intstr"

	"github.com/pkg/errors"
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
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	ingress := g.createIngressStruct(slug)

	i, err := g.getIngress(makeIngressName(slug), client)
	if i != nil {
		if _, err := iClient.Update(ingress); err != nil {
			return errors.Wrap(err, "Ingress update failed.")
		}

		return nil
	}

	if !strings.Contains(err.Error(), "not found") {
		return errors.Wrap(err, "Cannot fetch Ingress rule")
	}

	if _, err := iClient.Create(ingress); err != nil {
		return errors.Wrap(err, "Cannot create Ingress rule")
	}

	return nil
}

func (g *GatewayInstaller) getIngress(slug string, client *kubernetes.Clientset) (*extensionsv1beta1.Ingress, error) {
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	i, err := iClient.Get(slug, metav1.GetOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "Cannot get Ingress rule")
	}
	return i, nil
}

// Create an Ingress document.
func (g *GatewayInstaller) createIngressStruct(slug string) *extensionsv1beta1.Ingress {
	return &extensionsv1beta1.Ingress{
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
}
