package k8s

import (
	"github.com/pkg/errors"
	"k8s.io/api/apps/v1beta2"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"strings"
)

// How many pods should be created for this service.
const (
	gatewayReplicas = 1
	gatewayPort     = 8081
	gatewayMemLimit = "500M"
	gatewayCPULimit = "5300m"
)

func (g *GatewayInstaller) createDeployment(slug string, env map[string]interface{}, client *kubernetes.Clientset) error {
	dClient := client.AppsV1beta2().Deployments(apiv1.NamespaceDefault)

	//check if deployment exists
	d, err := g.getDeployment(makeGatewayName(slug), client)
	if d != nil {
		if env != nil {
			for i := 0; i < len(d.Spec.Template.Spec.Containers); i++ {
				d.Spec.Template.Spec.Containers[i].Env = makeEnv(env)
			}

			if _, err := dClient.Update(d); err != nil {
				return errors.Wrap(err, "Update to deployment failed.")
			}
		}

		return nil
	}

	if !strings.Contains(err.Error(), "not found") {
		return errors.Wrap(err, "Error in checking if deployment exists.")
	}

	zone, err := g.getZone(slug, client)
	if err != nil {
		return errors.Wrap(err, "Cannot select zone")
	}

	image, err := g.getImage()
	if err != nil {
		return errors.Wrap(err, "Cannot get Image")
	}

	//Create deployment definition
	deployment := &v1beta2.Deployment{
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
		Spec: v1beta2.DeploymentSpec{
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

	if _, err := dClient.Create(deployment); err != nil {
		return errors.Wrap(err, "Deployment creation failed.")
	}

	return nil
}

func (g *GatewayInstaller) getDeployment(slug string, client *kubernetes.Clientset) (*v1beta2.Deployment, error) {
	dClient := client.AppsV1beta2().Deployments(apiv1.NamespaceDefault)
	d, err := dClient.Get(slug, metav1.GetOptions{})
	if err != nil {
		return nil, errors.Wrap(err, "Cannot get deployment")
	}
	return d, nil
}
