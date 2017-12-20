package k8s

import (
	"flag"
	"fmt"
	"log"
	"math/rand"
	"os"
	"reflect"
	"strconv"
	"testing"

	"github.com/loomnetwork/dashboard/config"

	"github.com/pkg/errors"
)

var kubeConfigPath string
var gwi GatewayInstaller

func TestInstall(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := fmt.Sprintf("hello-world-%s", strconv.Itoa(rand.Int()))

	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		t.Fatal(err)
		return
	}

	if err := assertDeploymentExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertServiceExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertIngressExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		t.Error("Gateway installation failed: ", err)
	}

	if err := assertDeploymentExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertServiceExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertIngressExists(slug); err != nil {
		t.Error(err)
		return
	}
}

func TestInstallAndUpdate(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	slug := fmt.Sprintf("slug-test-%s", strconv.Itoa(rand.Int()))

	//create setup
	if err := Install(Gateway, slug, map[string]interface{}{"a": 1}, c); err != nil {
		t.Error("Gateway installation failed: ", err)
	}

	if err := assertDeploymentExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertServiceExists(slug); err != nil {
		t.Error(err)
		return
	}

	if err := assertIngressExists(slug); err != nil {
		t.Error(err)
		return
	}

	newEnv := map[string]interface{}{"b": 2}

	//update setupO
	if err := Install(Gateway, slug, newEnv, c); err != nil {
		t.Errorf("Gateway updation failed: %v", err)
	}

	if err := assertDeploymentUpdated(slug, c, newEnv); err != nil {
		t.Error(err)
	}
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

	gwi = GatewayInstaller{}
	m.Run()
}

func assertDeploymentExists(slug string) error {
	cfg := &config.Config{KubeConfigPath: kubeConfigPath}
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	d, err := gwi.getDeployment(makeGatewayName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get deployment: %v", err)
	}

	if expected := fmt.Sprintf("%v-%v", Gateway, slug); expected != d.ObjectMeta.GetName() {
		return errors.Errorf("Expected: %s \nActual: %s", expected, d.ObjectMeta.GetName())
	}

	return nil
}

func assertServiceExists(slug string) error {
	cfg := &config.Config{KubeConfigPath: kubeConfigPath}
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	s, err := gwi.getService(makeGatewayName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get service: %v", err)
	}

	if expected := fmt.Sprintf("%v-%v", Gateway, slug); expected != s.ObjectMeta.GetName() {
		return errors.Errorf("Expected: %s \nActual: %s", expected, s.ObjectMeta.GetName())
	}

	return nil
}

func assertIngressExists(slug string) error {
	cfg := &config.Config{KubeConfigPath: kubeConfigPath}
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	i, err := gwi.getIngress(makeIngressName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get ingress: %v", err)
	}

	if expected := makeIngressName(slug); expected != i.ObjectMeta.GetName() {
		return errors.Errorf("Expected: %s \nActual: %s", expected, i.ObjectMeta.GetName())
	}

	return nil
}

func assertDeploymentUpdated(slug string, cfg *config.Config, env map[string]interface{}) error {
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	d, err := gwi.getDeployment(makeGatewayName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get deployment: %v", err)
	}

	expectedEnv := makeEnv(env)
	if !reflect.DeepEqual(d.Spec.Template.Spec.Containers[0].Env[0], expectedEnv) {
		errors.Errorf("Expected: %s Actual: %s", expectedEnv, d.Spec.Template.Spec.Containers[0].Env[0])
	}

	return nil
}
