package k8s

import (
	"flag"
	"fmt"
	"log"
	"os"
	"reflect"
	"testing"

	"github.com/loomnetwork/dashboard/config"

	"strings"

	"github.com/loomnetwork/dashboard/k8s/ganache"
	"github.com/loomnetwork/dashboard/k8s/gateway"
	"github.com/pkg/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apiv1 "k8s.io/api/core/v1"
)

var kubeConfigPath string
var gwi gateway.Installer

const (
	slug = "hello-world"
)

func TestGetZone(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	client, _ := makeClient(c)
	if _, err := gwi.GetZone(slug, client); err != nil {
		t.Error(err)
		return
	}

	if _, err := gwi.GetZone("abcd", client); err != nil {
		t.Error(err)
		return
	}
}

func TestInstallAndUpdate(t *testing.T) {
	c := &config.Config{KubeConfigPath: kubeConfigPath}

	t.Run("Install without a valid docker image should raise an error", func(t *testing.T) {
		err := Install(gateway.Ident, slug, map[string]interface{}{"a": 1}, c)
		if err == nil {
			t.Fatal("Should have raised an Error")
			return
		}

		if !strings.Contains(err.Error(), "Config has no gateway image defined") {
			t.Errorf("Should complain about missing Image. Got %v instead", err.Error())
			return
		}

	})

	// Set the Image Path.
	c.GatewayDockerImage = config.DefaultGatewayImage
	c.GanacheDockerImage = config.DefaultGanacheImage

	t.Run("Install a ganache service for this service", func(t *testing.T) {
		if err := Install(ganache.Ident, slug, map[string]interface{}{}, c); err != nil {
			t.Fatal(err)
			return
		}
	})

	t.Run("Install a gateway and wait for service, deployment and ingress", func(t *testing.T) {
		newEnv := map[string]interface{}{
			"APP_ZIP_FILE": "do://block_ssh.zip",
			"DEMO_MODE":    "false",
			"APP_SLUG":     slug,
			"ETHEREUM_URI": fmt.Sprintf("http://ganache-%v:8545", slug),
			"PROXY_ADDR":   fmt.Sprintf("http://ganache-%v:8545", slug),
			//"PRIVATE_KEY_JSON_PATH": "data.json",
			//"SPAWN_NETWORK":         "node /src/build/cli.node.js",
		}

		//update setupO
		if err := Install(gateway.Ident, slug, newEnv, c); err != nil {
			t.Errorf("Ident updation failed: %v", err)
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
		if err := assertDeploymentUpdated(slug, c, newEnv); err != nil {
			t.Error(err)
		}
	})

	t.Run("Terminate Gateway and Ganache deployments", func(t *testing.T) {
		client, err := makeClient(c)
		if err != nil {
			t.Error(err)
			return
		}
		dClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)
		deletePolicy := metav1.DeletePropagationForeground

		if err := dClient.Delete(ganache.MakeName(slug), &metav1.DeleteOptions{
			PropagationPolicy: &deletePolicy,
		}); err != nil {
			t.Error(err)
			return
		}

		if err := dClient.Delete(gateway.MakeName(slug), &metav1.DeleteOptions{
			PropagationPolicy: &deletePolicy,
		}); err != nil {
			t.Error(err)
			return
		}
	})
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

	gwi = gateway.Installer{}
	m.Run()
}

func assertDeploymentExists(slug string) error {
	cfg := &config.Config{KubeConfigPath: kubeConfigPath}
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	d, err := gwi.GetDeployment(gateway.MakeName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get deployment: %v", err)
	}

	if expected := fmt.Sprintf("%v-%v", gateway.Ident, slug); expected != d.ObjectMeta.GetName() {
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

	s, err := gwi.GetService(gateway.MakeName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get service: %v", err)
	}

	if expected := fmt.Sprintf("%v-%v", gateway.Ident, slug); expected != s.ObjectMeta.GetName() {
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

	i, err := gwi.GetIngress(gateway.MakeIngressName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get ingress: %v", err)
	}

	if expected := gateway.MakeIngressName(slug); expected != i.ObjectMeta.GetName() {
		return errors.Errorf("Expected: %s \nActual: %s", expected, i.ObjectMeta.GetName())
	}

	return nil
}

func assertDeploymentUpdated(slug string, cfg *config.Config, env map[string]interface{}) error {
	client, err := makeClient(cfg)
	if err != nil {
		return err
	}

	d, err := gwi.GetDeployment(gateway.MakeName(slug), client)
	if err != nil {
		return errors.Errorf("Cannot get deployment: %v", err)
	}

	expectedEnv := makeEnv(env)
	if !reflect.DeepEqual(d.Spec.Template.Spec.Containers[0].Env[0], expectedEnv) {
		errors.Errorf("Expected: %s Actual: %s", expectedEnv, d.Spec.Template.Spec.Containers[0].Env[0])
	}

	return nil
}
