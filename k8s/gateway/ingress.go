package gateway

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

func MakeIngressName(slug string) string {
	return fmt.Sprintf("%v-%v-%v", ingressControllerClass, Ident, slug)
}

func (g *Installer) CreateIngress(slug, host string, client *kubernetes.Clientset) error {
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	ingress := g.createIngressStruct(slug, host)

	ig, err := g.GetIngress(MakeIngressName(slug), client)
	if err == nil && ig != nil {
		g.updateStruct(ingress, ig)
		if _, err := iClient.Update(ingress); err != nil {
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

func (g *Installer) GetIngress(slug string, client *kubernetes.Clientset) (*extensionsv1beta1.Ingress, error) {
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	return iClient.Get(slug, metav1.GetOptions{})
}

// Create an Ingress document.
func (g *Installer) createIngressStruct(slug, host string) *extensionsv1beta1.Ingress {
	return &extensionsv1beta1.Ingress{
		TypeMeta: metav1.TypeMeta{
			Kind: "Ingress",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: MakeIngressName(slug),
			Annotations: map[string]string{
				"kubernetes.io/ingress.class": ingressControllerClass,
			},
		},
		Spec: extensionsv1beta1.IngressSpec{
			Rules: []extensionsv1beta1.IngressRule{
				{
					Host: host,
					IngressRuleValue: extensionsv1beta1.IngressRuleValue{
						HTTP: &extensionsv1beta1.HTTPIngressRuleValue{
							Paths: []extensionsv1beta1.HTTPIngressPath{
								{
									Path: "/",
									Backend: extensionsv1beta1.IngressBackend{
										ServiceName: MakeName(slug),
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
