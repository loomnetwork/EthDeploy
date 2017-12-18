package k8s

import (
	"testing"

	"flag"
	"log"
	"os"
	"dashboard/config"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"fmt"
)

var kubeConfigPath string

func TestInstall(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := "hello-world"

	err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c)
	if err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
}

func TestMain(m *testing.M) {
	flag.StringVar(&kubeConfigPath, "kubeconfig", "", "Path to Kubernetes config.")
	if !flag.Parsed() {
		flag.Parse()
	}

	if kubeConfigPath == "" {
		log.Println("Missing -kubeconfig")
		os.Exit(127)
	}

	m.Run()
}

func assertDeploymentExists(slug string,  cfg *config.Config, t *testing.T) {
	client, err := makeClient(cfg)
	if err != nil {
		t.Fail()
	}

	dClient := client.AppsV1beta2().Deployments(apiv1.NamespaceDefault)
	d, err := dClient.Get(makeGatewayName(slug), metav1.GetOptions{})
	if err != nil {
		fmt.Println("Cannot get deployment.")
		t.Fail()
	}


	expected := fmt.Sprintf("%v-%v", Gateway, slug)


	if expected != d.ObjectMeta.GetName()  {
		fmt.Println("Expected: ", slug, "Actual: ", d.ObjectMeta.GetName())
		t.Fail()
	}
}
