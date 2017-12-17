package k8s

import (
	"log"

	"github.com/pkg/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	appsv1beta1 "k8s.io/api/apps/v1beta1"
	apiv1 "k8s.io/api/core/v1"
)

// How many pods should be created for this service.
const (
	gatewayReplicas = 1
	gatewayPort     = 8081
	gatewayMemLimit = "500M"
	gatewayCPULimit = "5300m"
)

func (g *GatewayInstaller) createDeployment(slug string, env map[string]interface{}, client *kubernetes.Clientset) error {
	zone, err := g.getZone(slug, client)
	if err != nil {
		return errors.Wrap(err, "Cannot select zone")
	}

	image, err := g.getImage()
	if err != nil {
		return errors.Wrap(err, "Cannot get Image")
	}

	//Create deployment definition
	deployment := &appsv1beta1.Deployment{
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
		Spec: appsv1beta1.DeploymentSpec{
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

	log.Println(deployment)

	//deploymentsClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)
	//
	//// Create Deployment
	//fmt.Println("Creating ganache deployment...")
	//result, err := deploymentsClient.Create(deployment)
	//if err != nil {
	//	panic(err)
	//}
	//fmt.Printf("Created deployment %q.\n", result.GetObjectMeta().GetName())
	//
	////List deployments
	//fmt.Printf("Listing deployments in namespace %q:\n", apiv1.NamespaceDefault)
	//list, err := deploymentsClient.List(metav1.ListOptions{})
	//if err != nil {
	//	return err
	//}
	//
	//for _, d := range list.Items {
	//	fmt.Printf(" * %s (%d replicas)\n", d.Name, *d.Spec.Replicas)
	//}

	return nil
}
