package ganache

import (
	apiv1 "k8s.io/api/core/v1"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"k8s.io/client-go/kubernetes"
)

func (g *Installer) CreateIngress(slug, host string, client *kubernetes.Clientset) error {
	return nil
}

func (g *Installer) GetIngress(slug string, client *kubernetes.Clientset) (*extensionsv1beta1.Ingress, error) {
	iClient := client.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	return iClient.Get(slug, metav1.GetOptions{})
}
