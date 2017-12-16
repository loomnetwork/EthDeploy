package controllers

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/hashicorp/nomad/api"
	"github.com/hashicorp/nomad/helper"
	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/minio/minio-go"
	"github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
	"github.com/pkg/errors"

	appsv1beta1 "k8s.io/api/apps/v1beta1"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	extensionsv1beta1 "k8s.io/api/extensions/v1beta1"
)

func uploadS3CompatibleFile(cfg *config.Config, objectName string, reader io.Reader) error {
	// Initialize minio client object.
	minioClient, err := minio.New(cfg.S3.EndPointUrl, cfg.S3.AccessKeyID, cfg.S3.SecretAccessKey, true)
	if err != nil {
		log.Fatalln(err)
	}
	bucketName := "loom"
	//	minioClient.TraceOn(os.Stderr)

	uploadFilePath := fmt.Sprintf("uploads/%s", objectName)
	n, err := minioClient.PutObject(bucketName, uploadFilePath, reader, "application/zip")
	if err != nil {
		log.Fatalln(err)
	}

	log.WithField("uploadFilePath", uploadFilePath).WithField("size", n).Info("uploadS3CompatibleFile")

	return nil
}

func genObjectName(c *gin.Context) string {
	//TODO we should generate a unique name
	//we should put a prefix with their account name or something

	guid := uuid.NewV4().String()
	return fmt.Sprintf("%s.zip", guid)
}

func deployToK8s(filename, slug string, cfg *config.Config) error {
	client, err := createK8sClient(cfg)
	if err != nil {
		return errors.Wrap(err, "Error creating k8s client")
	}

	zone, err := selectZone(slug, client)
	if err != nil {
		return errors.Wrapf(err,"Cannot assign a zone for %s", slug)
	}

	if err := createDeployment(filename, slug, zone, cfg.GatewayDockerImage, client); err != nil {
		return errors.Wrapf(err, "Could not deploy the k8s application for %s.", slug)
	}

	if err := createService(slug, client); err != nil {
		return errors.Wrapf(err, "could not create k8s service for %s", slug)
	}

	if err := createIngress(slug, client); err != nil {
		return errors.Wrapf(err, "could not create k8s Ingress for %s", slug)
	}

	return nil
}

func createK8sClient(cfg *config.Config) (*kubernetes.Clientset, error) {
	return nil, nil
}

// createIngress registers a new rule for slug.loomapps.io on the K8s ingress controller.
// Skips if already present.
func createIngress(slug string, client *kubernetes.Clientset) error {
	return nil
}

func createService(slug string, client *kubernetes.Clientset) error {
	return nil
}

func int32Ptr(i int32) *int32 { return &i }

func backendPtr(bptr extensionsv1beta1.IngressBackend) *extensionsv1beta1.IngressBackend { return &bptr }

func createDeployment(filename, slug, zone, image string, client *kubernetes.Clientset) error {
	//Create ganache deployment definition
	deployment := &appsv1beta1.Deployment{
		TypeMeta: metav1.TypeMeta{
			Kind: "Deployment",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: fmt.Sprintf("gateway-%v", slug),
		},
		Spec: appsv1beta1.DeploymentSpec{
			Replicas: int32Ptr(1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": "gateway",
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app":  "gateway",
						"slug": slug,
					},
				},
				Spec: apiv1.PodSpec{
					NodeSelector: map[string]string{
						"failure-domain.beta.kubernetes.io/zone": zone,
					},
					Containers: []apiv1.Container{
						{
							Name:    "gateway",
							Image:   image,
							Command: []string{"./root/start.sh"},
							Ports: []apiv1.ContainerPort{
								{
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: 8081,
								},
							},
							Env: []apiv1.EnvVar{
								{Name: "SPAWN_NETWORK", Value: "node /src/build/cli.node.js"},
								{Name: "APP_ZIP_FILE", Value: fmt.Sprintf("do,//uploads/%s", filename)},
								{Name: "DEMO_MODE", Value: "false"},
								{Name: "PRIVATE_KEY_JSON_PATH", Value: "data.json"},
								{Name: "APP_SLUG", Value: slug},
							},
						},
					},
				},
			},
		},
	}

	deploymentsClient := client.AppsV1beta1().Deployments(apiv1.NamespaceDefault)

	// Create Deployment
	fmt.Println("Creating ganache deployment...")
	result, err := deploymentsClient.Create(deployment)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Created deployment %q.\n", result.GetObjectMeta().GetName())

	//List deployments
	fmt.Printf("Listing deployments in namespace %q:\n", apiv1.NamespaceDefault)
	list, err := deploymentsClient.List(metav1.ListOptions{})
	if err != nil {
		return err
	}

	for _, d := range list.Items {
		fmt.Printf(" * %s (%d replicas)\n", d.Name, *d.Spec.Replicas)
	}

	return nil
}

func selectZone(s string, client *kubernetes.Clientset) (string, error) {
    return "f", nil
}

//TODO set NOMAD_ADDR
func SendNomadJob(filename, slug, dockerVersion string) error {
	if slug == "" {
		return errors.New("slug is blank won't send to nomad")
	}

	ncfg := api.DefaultConfig()
	nomadClient, err := api.NewClient(ncfg)
	if err != nil {
		return err
	}
	name := fmt.Sprintf("loomapp-%s", slug)
	traefikTags := fmt.Sprintf("traefik.frontend.rule=Host:%s.loomapps.io", slug)
	job := &api.Job{
		ID:          helper.StringToPtr(name),
		Name:        helper.StringToPtr(name),
		Datacenters: []string{"dc1"},
		Type:        helper.StringToPtr("service"),
		Update: &api.UpdateStrategy{
			MaxParallel: helper.IntToPtr(1),
		},
		TaskGroups: []*api.TaskGroup{
			{
				Name:  helper.StringToPtr("loomapps-client"),
				Count: helper.IntToPtr(1),
				RestartPolicy: &api.RestartPolicy{
					Interval: helper.TimeToPtr(5 * time.Minute),
					Attempts: helper.IntToPtr(10),
					Delay:    helper.TimeToPtr(25 * time.Second),
					Mode:     helper.StringToPtr("delay"),
				},
				//				EphemeralDisk: &api.EphemeralDisk{
				//					SizeMB: helper.IntToPtr(300),
				//				},
				Tasks: []*api.Task{
					{
						Name:   name,
						Driver: "docker",
						Config: map[string]interface{}{
							"image": fmt.Sprintf("loomnetwork/rpc_gateway:%s", dockerVersion), //TODO make this a config option
							"port_map": []map[string]int{{
								"web": 8081,
							}},
						},
						Env: map[string]string{
							"SPAWN_NETWORK":         "node /src/build/cli.node.js",
							"APP_ZIP_FILE":          fmt.Sprintf("do://uploads/%s", filename),
							"DEMO_MODE":             "false",
							"PRIVATE_KEY_JSON_PATH": "data.json",
							"APP_SLUG":              slug,
						},
						Resources: &api.Resources{
							CPU:      helper.IntToPtr(500),
							MemoryMB: helper.IntToPtr(500),
							Networks: []*api.NetworkResource{
								{
									MBits: helper.IntToPtr(10),
									DynamicPorts: []api.Port{
										{
											Label: "web",
										},
									},
								},
							},
						},
						Services: []*api.Service{
							{
								Name:      fmt.Sprintf("loomapp-%s-check", slug),
								Tags:      []string{"global", "traefik.tags=loomapp", traefikTags},
								PortLabel: "web",
								Checks: []api.ServiceCheck{
									{
										Name:     "alive",
										Type:     "tcp",
										Interval: 10 * time.Second,
										Timeout:  2 * time.Second,
									},
								},
							},
						},
						Templates: []*api.Template{},
					},
				},
			},
		},
	}

	jobs := nomadClient.Jobs()
	res, wmeta, err := jobs.Register(job, nil)
	fmt.Printf("res--%v \n wmeta --- %v\n", res, wmeta)
	return err
}

func UploadApplication(c *gin.Context) {
	r := c.Request
	cfg := config.Default(c)
	db := dbpkg.DBInstance(c)

	slugId := models.NormalizeSlug(c.PostForm("application_slug"))
	if slugId == "" {
		slugId = c.Params.ByName("slug") // try reading from the url in a restful manner
	}
	autoCreate := c.PostForm("auto_create")
	accountID := middleware.GetLoggedInUser(c) //TODO get this to work in loggedin scope

	app := models.Application{}
	if err := db.Where("slug = ?", slugId).Find(&app).Error; err != nil {
		if autoCreate == "true" {
			log.WithField("slug", slugId).Warn("Creating new application on upload")
			application := models.Application{AccountID: accountID, LastDeployed: time.Now(), Name: slugId, Slug: slugId}

			if err := db.Create(&application).Error; err != nil {
				log.WithField("error", err).Warn("Failed creating application in db")

				c.JSON(http.StatusBadRequest, gin.H{"Error": "failed creating application"})
				return
			}
		} else {
			log.WithField("error", err).Warn("Failed retrieving application slug from db")

			c.JSON(http.StatusBadRequest, gin.H{"Error": "duplicate application and/or error"})
			return
		}
	}

	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile("uploadfile")
	if err != nil {
		log.WithField("error", err).Warn("Failed retrieving zipfile from form")

		c.JSON(http.StatusBadRequest, gin.H{"Error": "unable able to parse the upload"})
		return
	}
	defer file.Close()

	uniqueFilename := genObjectName(c)

	//speed up development testing
	if cfg.DisableUpload == false {
		err = uploadS3CompatibleFile(cfg, uniqueFilename, file)
		if err != nil {
			log.WithField("error", err).Warn("upload to s3 failed")

			c.JSON(http.StatusBadRequest, gin.H{"Error": "storage of data failed"})
			return
		}

		if err := deployToK8s(uniqueFilename, slugId, cfg); err != nil {
			log.WithField("error", err).Warn("sendnomadjob failed")

			c.JSON(http.StatusBadRequest, gin.H{"Error": "Could not create test network"})
			return
		}
	}

	// create new version
	deployHistory := models.DeployHistory{
		BundleName:     handler.Filename, //uploaded name
		UniqueFileName: uniqueFilename,
		AccountID:      accountID,
		ApplicationID:  app.ID,
	}
	if err := db.Create(&deployHistory).Error; err != nil {
		log.WithField("error", err).Warn("Error when storing new version")
	}
}
