package k8s

import (
	"testing"

	"flag"
	"github.com/loomnetwork/dashboard/config"
	"log"
	"os"

	"fmt"
	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"math/rand"
	"strconv"
)

var kubeConfigPath string

func TestInstall(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := fmt.Sprintf("hello-world-%s", strconv.Itoa(rand.Int()))

	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)

	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)
}

func TestInstallAndUpdate(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := fmt.Sprintf("slug-test-%s", strconv.Itoa(rand.Int()))

	//create setup
	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)

	//update setup
	if err := Install(Gateway, slug, map[string]interface{}{"b": 2}, c); err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)
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

func assertDeploymentExists(slug string, cfg *config.Config, t *testing.T) {
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

	if expected := fmt.Sprintf("%v-%v", Gateway, slug); expected != d.ObjectMeta.GetName() {
		fmt.Println("Expected: ", slug, "Actual: ", d.ObjectMeta.GetName())
		t.Fail()
	}
}

func assertServiceExists(slug string, cfg *config.Config, t *testing.T) {
	client, err := makeClient(cfg)
	if err != nil {
		t.Fail()
	}

	s, err := client.CoreV1().Services("default").Get(makeGatewayName(slug), metav1.GetOptions{})
	if err != nil {
		fmt.Println("Cannot get service.")
		t.Fail()
	}

	if expected := fmt.Sprintf("%v-%v", Gateway, slug); expected != s.ObjectMeta.GetName() {
		fmt.Println("Expected: ", expected, "Actual: ", s.ObjectMeta.GetName())
		t.Fail()
	}
}

func assertIngressExists(slug string, cfg *config.Config, t *testing.T) {
	client, err := makeClient(cfg)
	if err != nil {
		t.Fail()
	}

	i, err := client.ExtensionsV1beta1().Ingresses("default").Get(makeIngressName(slug), metav1.GetOptions{})
	if err != nil {
		fmt.Println("Cannot create ingress.")
		t.Fail()
	}

	if expected := makeIngressName(slug); expected != i.ObjectMeta.GetName() {
		fmt.Println("Expected: ", expected, "Actual: ", i.ObjectMeta.GetName())
	}
}
