package k8s

import (
	"github.com/imdario/mergo"
	"github.com/pkg/errors"

	"k8s.io/api/apps/v1beta1"
	k8serror "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/client-go/kubernetes"

	"strings"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// How many pods should be created for this service.
const (
	gatewayReplicas = 1
	gatewayPort     = 8081
	gatewayMemLimit = "500M"
	gatewayCPULimit = "530m"
	notFoundMessage = "the server could not find the requested resource"
)

func (g *GatewayInstaller) createDeploymentStruct(image, slug string, env map[string]interface{}, client *kubernetes.Clientset) (*v1beta1.Deployment, error) {
	zone, err := g.getZone(slug, client)
	if err != nil {
		return nil, errors.Wrap(err, "Cannot select zone")
	}

	d := &v1beta1.Deployment{
		TypeMeta: metav1.TypeMeta{
			Kind: "Deployment",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: makeGatewayName(slug),
			Labels: map[string]string{
				"app":  Gateway,
				"slug": slug,
			},
		},
		Spec: v1beta1.DeploymentSpec{
			Replicas: int32Ptr(gatewayReplicas),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": Gateway,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app":  Gateway,
						"slug": slug,
					},
				},
				Spec: apiv1.PodSpec{
					NodeSelector: map[string]string{
						"failure-domain.beta.kubernetes.io/zone": zone,
					},
					Containers: []apiv1.Container{
						{
							Name:  Gateway,
							Image: image,
							//Command: []string{"./root/start.sh"},
							Resources: apiv1.ResourceRequirements{
								Limits: apiv1.ResourceList{
									apiv1.ResourceCPU:    resource.MustParse(gatewayCPULimit),
									apiv1.ResourceMemory: resource.MustParse(gatewayMemLimit),
									//I don't think Kubernetes can limit Network bandwidth as of yet.
								},
							},
							Ports: []apiv1.ContainerPort{
								{
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: gatewayPort,
								},
							},
							Env: makeEnv(env),
						},
					},
				},
			},
		},
	}

	return d, nil
}

func (g *GatewayInstaller) createDeployment(image, slug string, env map[string]interface{}, client *kubernetes.Clientset) error {
	dClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)

	//Create deployment definition
	deployment, derr := g.createDeploymentStruct(image, slug, env, client)
	if derr != nil {
		return errors.Wrap(derr, "Cannot create deployment request")
	}

	//check if deployment exists
	d, err := g.getDeployment(makeGatewayName(slug), client)
	if err == nil && d != nil {
		g.updateStruct(d, deployment)
		if _, err := dClient.Update(d); err != nil {
			return errors.Wrap(err, "Deployment update failed")
		}
		return nil
	}

	// Transform the Error.
	ss, ok := err.(k8serror.APIStatus)
	if !ok {
		return errors.Wrapf(err, "Unexpected error message %v", err)
	}

	if strings.Contains(ss.Status().Message, "not found") {
		if _, err := dClient.Create(deployment); err != nil {
			return errors.Wrap(err, "Deployment creation failed")
		}
		return nil
	}

	return errors.Errorf("Unhandled Error %v", ss.Status().Message)
}

func (g *GatewayInstaller) getDeployment(slug string, client *kubernetes.Clientset) (*v1beta1.Deployment, error) {
	dClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)
	return dClient.Get(slug, metav1.GetOptions{})
}

func (g *GatewayInstaller) updateStruct(dest, src interface{}) {
	mergo.Merge(dest, src)
}
