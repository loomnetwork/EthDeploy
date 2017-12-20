package k8s

import (
	"fmt"

	apiv1 "k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	k8serror "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apputils "k8s.io/apimachinery/pkg/util/intstr"

	"strings"

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

	ig, err := g.getIngress(makeIngressName(slug), client)
	if err == nil && ig != nil {
		g.updateStruct(ig, ingress)
		if _, err := iClient.Update(ig); err != nil {
			return errors.Wrap(err, "Ingress update failed")
		}

		return nil
	}

	// Transform the Error.
	ss, ok := err.(k8serror.APIStatus)
	if !ok {
		return errors.Wrapf(err, "Unexpected error message %v", err)
	}

	if strings.Contains(ss.Status().Message, "not found") {
		if _, err := iClient.Create(ingress); err != nil {
			return errors.Wrap(err, "Ingress rule creation failed")
		}
		return nil
	}

	return errors.Errorf("Unhandled Error %v", ss.Status().Message)
}

func (g *GatewayInstaller) getIngress(slug string, client *kubernetes.Clientset) (*extensionsv1beta1.Ingress, error) {
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	return iClient.Get(slug, metav1.GetOptions{})
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
