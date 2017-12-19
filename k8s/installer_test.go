package k8s

import (
	"testing"

	"flag"
	"log"
	"os"
	"github.com/loomnetwork/dashboard/config"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"fmt"
	"math/rand"
	"strconv"
)

var kubeConfigPath string

func TestInstall(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := fmt.Sprintf("hello-world-%s", strconv.Itoa(rand.Int()))

	err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c)
	if err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)

	err = Install(Gateway, slug, map[string]interface{}{"a": 1}, c)
	if err != nil {
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
	err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c)
	if err != nil {
		log.Println(err)
	}

	assertDeploymentExists(slug, c, t)
	assertServiceExists(slug, c, t)
	assertIngressExists(slug, c, t)

	//update setup
	err = Install(Gateway, slug, map[string]interface{}{"b": 2}, c)
	if err != nil {
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

	expected := fmt.Sprintf("%v-%v", Gateway, slug)

	if expected != s.ObjectMeta.GetName() {
		fmt.Println("Expected: ", expected, "Actual: ", s.ObjectMeta.GetName())
		t.Fail()
	}
}

func assertIngressExists(slug string, cfg *config.Config, t *testing.T)  {
	client, err := makeClient(cfg)
	if err != nil {
		t.Fail()
	}

	i, err := client.ExtensionsV1beta1().Ingresses("default").Get(makeIngressName(slug), metav1.GetOptions{})
	if err != nil {
		fmt.Println("Cannot create ingress.")
		t.Fail()
	}

	expected := makeIngressName(slug)

	if expected != i.ObjectMeta.GetName() {
		fmt.Println("Expected: ", expected, "Actual: ", i.ObjectMeta.GetName())
	}
}
