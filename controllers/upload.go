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
	minio "github.com/minio/minio-go"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
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

//TODO set NOMAD_ADDR
func sendNomadJob(filename string) error {
	ncfg := api.DefaultConfig()
	nomadClient, err := api.NewClient(ncfg)
	if err != nil {
		return err
	}
	job := &api.Job{
		ID:          helper.StringToPtr("example_template"),
		Name:        helper.StringToPtr("example_template"),
		Datacenters: []string{"dc1"},
		Type:        helper.StringToPtr("service"),
		Update: &api.UpdateStrategy{
			MaxParallel: helper.IntToPtr(1),
		},
		TaskGroups: []*api.TaskGroup{
			{
				Name:  helper.StringToPtr("cache"),
				Count: helper.IntToPtr(1),
				RestartPolicy: &api.RestartPolicy{
					Interval: helper.TimeToPtr(5 * time.Minute),
					Attempts: helper.IntToPtr(10),
					Delay:    helper.TimeToPtr(25 * time.Second),
					Mode:     helper.StringToPtr("delay"),
				},
				EphemeralDisk: &api.EphemeralDisk{
					SizeMB: helper.IntToPtr(300),
				},
				Tasks: []*api.Task{
					{
						Name:   "redis",
						Driver: "docker",
						Config: map[string]interface{}{
							"image": "redis:3.2",
							"port_map": []map[string]int{{
								"db": 6379,
							}}},
						Resources: &api.Resources{
							CPU:      helper.IntToPtr(500),
							MemoryMB: helper.IntToPtr(256),
							Networks: []*api.NetworkResource{
								{
									MBits: helper.IntToPtr(10),
									DynamicPorts: []api.Port{
										{
											Label: "db",
										},
									},
								},
							},
						},
						Services: []*api.Service{
							{
								Name:      "global-redis-check",
								Tags:      []string{"global", "cache"},
								PortLabel: "db",
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
	w := c.Writer
	cfg := config.Default(c)

	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile("uploadfile")
	if err != nil {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"Error": "unable able to parse the upload"})
		return
	}
	defer file.Close()
	fmt.Fprintf(w, "%v", handler.Header)

	uniqueFilename := genObjectName(c)
	err = uploadS3CompatibleFile(cfg, uniqueFilename, file)
	if err != nil {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"Error": "storage of data failed"})
		return
	}

	err = sendNomadJob(uniqueFilename)
	if err != nil {
		fmt.Println(err) //TODO log

		c.JSON(http.StatusBadRequest, gin.H{"Error": "Could not create test network"})
		return
	}
	// create new version
	db := dbpkg.DBInstance(c)
	deployHistory := models.DeployHistory{
		BundleName:     handler.Filename, //uploaded name
		UniqueFileName: uniqueFilename,
	}
	if err := db.Create(&deployHistory).Error; err != nil {
		log.WithField("error", err).Warn("Error when storing new version")
	}
}
