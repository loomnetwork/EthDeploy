package gateway

import (
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"

	minio "github.com/minio/minio-go"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
)

func UploadS3CompatibleFile(fileData io.Reader, uploadPath string) error {
	/*
		// Upload the zip file with FPutObject
		n, err := minioClient.FPutObject(bucketName, objectName, filePath, minio.PutObjectOptions{ContentType: contentType})
		if err != nil {
			log.Fatalln(err)
		}

		log.Printf("Successfully uploaded %s of size %d\n", objectName, n)
	*/
	return nil
}

func (g *Gateway) downloadS3CompatibleFile(applicationZipPath, outputPath string) error {
	useSSL := true

	// Initialize minio client object.
	minioClient, err := minio.New(g.cfg.S3.EndPointUrl, g.cfg.S3.AccessKeyID, g.cfg.S3.SecretAccessKey, useSSL)
	if err != nil {
		log.Fatalln(err)
	}
	bucketName := "loom"
	//	minioClient.TraceOn(os.Stderr)

	err = minioClient.FGetObject(bucketName, applicationZipPath, outputPath)
	if err != nil {
		return err
	}
	return nil
}

func (g *Gateway) downloadAndExtractApp(applicationZipPath string) error {
	var err error

	guid := uuid.NewV4().String()
	if strings.Index(applicationZipPath, "s3://") == 0 {
		return errors.New("We don't support s3 urls yet")
	}

	appDir := filepath.Join(g.cfg.TmpDir, guid)
	log.WithField("dir", g.cfg.TmpDir).Debug("creating folder")
	err = os.MkdirAll(g.cfg.TmpDir, 0766)
	if err != nil {
		return err
	}

	outFile := applicationZipPath
	//If we need to download from digitalocean
	if strings.Index(applicationZipPath, "do://") == 0 {
		dataPath := strings.Split(applicationZipPath, "do://")[1]
		outFile = filepath.Join(g.cfg.TmpDir, guid+".zip")
		log.WithField("dataPath", dataPath).WithField("outFile", outFile).Debug("download file from remote server")
		err = g.downloadS3CompatibleFile(dataPath, outFile)
		if err != nil {
			return err
		}
		defer os.Remove(outFile)
	}

	log.WithField("outFile", outFile).WithField("appDir", appDir).Debug("extractfile")
	err = unzip(outFile, appDir)
	g.appDir = appDir
	return err
}
