package controllers

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/minio/minio-go"
	"github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
	"github.com/pkg/errors"

	"github.com/loomnetwork/dashboard/k8s"
	"github.com/loomnetwork/dashboard/k8s/ganache"
	"github.com/loomnetwork/dashboard/k8s/gateway"
)

func uploadS3CompatibleFile(cfg *config.Config, objectName string, reader io.Reader) error {
	// Initialize minio client object.
	minioClient, err := minio.New(cfg.S3.EndPointUrl, cfg.S3.AccessKeyID, cfg.S3.SecretAccessKey, true)
	if err != nil {
		log.Fatalln(err)
	}
	bucketName := "loomx"
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
	if err := k8s.Install(ganache.Ident, slug, map[string]interface{}{}, cfg); err != nil {
		return errors.Wrapf(err, "Cannot deploy Ganache for %v", slug)
	}

	env := map[string]interface{}{
		"APP_ZIP_FILE": fmt.Sprintf("do://uploads/%s", filename),
		"DEMO_MODE":    "false",
		"APP_SLUG":     slug,
		"ETHEREUM_URI": fmt.Sprintf("http://ganache-%v:8545", slug),
		"PROXY_ADDR":   fmt.Sprintf("http://ganache-%v:8545", slug),
	}

	if err := k8s.Install(gateway.Ident, slug, env, cfg); err != nil {
		return errors.Wrapf(err, "Cannot deploy Gateway for %v", slug)
	}

	return nil
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
