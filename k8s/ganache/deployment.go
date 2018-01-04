package ganache

import (
	"github.com/imdario/mergo"
	"github.com/pkg/errors"

	"k8s.io/api/apps/v1beta1"
	k8serror "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/client-go/kubernetes"

	"strings"

	"github.com/loomnetwork/dashboard/k8s/helper"
	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// How many pods should be created for this service.
const (
	ganacheReplicas   = 1
	ganachePort       = 8545
	ganacheMemLimit   = "200M"
	ganacheCPULimit   = "200m"
	GlusterEndpoint   = "staging-glusterfs"
	GlusterVolumeName = "ganache-data"
)

func (g *Installer) createDeploymentStruct(image, slug string, env []apiv1.EnvVar, client *kubernetes.Clientset) (*v1beta1.Deployment, error) {
	zone, err := g.GetZone(slug, client)
	if err != nil {
		return nil, errors.Wrap(err, "Cannot select zone")
	}

	d := &v1beta1.Deployment{
		TypeMeta: metav1.TypeMeta{
			Kind: "Deployment",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: MakeName(slug),
			Labels: map[string]string{
				"app":  Ident,
				"slug": slug,
			},
		},
		Spec: v1beta1.DeploymentSpec{
			Replicas: helper.Int32Ptr(ganacheReplicas),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": Ident,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app":  Ident,
						"slug": slug,
					},
				},
				Spec: apiv1.PodSpec{
					NodeSelector: map[string]string{
						"failure-domain.beta.kubernetes.io/zone": zone,
					},
					Volumes: []apiv1.Volume{
						{
							Name: "ganachedb",
							VolumeSource: apiv1.VolumeSource{Glusterfs: &apiv1.GlusterfsVolumeSource{
								EndpointsName: GlusterEndpoint,
								Path:          GlusterVolumeName,
								ReadOnly:      false,
							}},
						},
					},
					Containers: []apiv1.Container{
						{
							Name:    Ident,
							Image:   image,
							Command: []string{"/usr/local/bin/loom-ganache", "-n", slug},
							Resources: apiv1.ResourceRequirements{
								Limits: apiv1.ResourceList{
									apiv1.ResourceCPU:    resource.MustParse(ganacheCPULimit),
									apiv1.ResourceMemory: resource.MustParse(ganacheMemLimit),
									//I don't think Kubernetes can limit Network bandwidth as of yet.
								},
							},
							Ports: []apiv1.ContainerPort{
								{
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: ganachePort,
								},
							},
							VolumeMounts: []apiv1.VolumeMount{
								{
									MountPath: "/ganache-data",
									Name:      "ganachedb",
								},
							},
							Env: env,
						},
					},
				},
			},
		},
	}

	return d, nil
}

func (g *Installer) CreateDeployment(image, slug string, env []apiv1.EnvVar, client *kubernetes.Clientset) error {
	dClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)

	//Create deployment definition
	deployment, derr := g.createDeploymentStruct(image, slug, env, client)
	if derr != nil {
		return errors.Wrap(derr, "Cannot create deployment request")
	}

	//check if deployment exists
	d, err := g.GetDeployment(MakeName(slug), client)
	if err == nil && d != nil {
		g.updateStruct(deployment, d)
		if _, err := dClient.Update(deployment); err != nil {
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

func (g *Installer) GetDeployment(slug string, client *kubernetes.Clientset) (*v1beta1.Deployment, error) {
	dClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)
	return dClient.Get(slug, metav1.GetOptions{})
}

func (g *Installer) updateStruct(dest, src interface{}) {
	mergo.Merge(dest, src)
}
