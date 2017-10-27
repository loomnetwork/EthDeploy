package gateway

import (
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"

	uuid "github.com/satori/go.uuid"
)

func UploadS3CompatibleFile(fileData io.Reader, uploadPath string) error {
	return nil
}

func (g *Gateway) downloadS3CompatibleFile(applicationZipPath, outputPath string) error {
	/*	useSSL := true

		// Initialize minio client object.
		minioClient, err := minio.New(g.cfg.S3.EndPoint, accessKeyID, secretAccessKey, useSSL)
		if err != nil {
			log.Fatalln(err)
		}

		// Make a new bucket called mymusic.
		bucketName := "loom"
		location := "nyc3"

		err = minioClient.MakeBucket(bucketName, location)
		if err != nil {
			// Check to see if we already own this bucket (which happens if you run this twice)
			exists, err := minioClient.BucketExists(bucketName)
			if err == nil && exists {
				log.Printf("We already own %s\n", bucketName)
			} else {
				log.Fatalln(err)
			}
		}
		log.Printf("Successfully created %s\n", bucketName)

		// Upload the zip file
		objectName := "golden-oldies.zip"
		filePath := "/tmp/golden-oldies.zip"
		contentType := "application/zip"

		// Upload the zip file with FPutObject
		n, err := minioClient.FPutObject(bucketName, objectName, filePath, minio.PutObjectOptions{ContentType: contentType})
		if err != nil {
			log.Fatalln(err)
		}

		log.Printf("Successfully uploaded %s of size %d\n", objectName, n)
	*/
	return nil
}

func (g *Gateway) downloadAndExtractApp(applicationZipPath string) error {
	appDir := filepath.Join(g.cfg.TmpDir, filepath.Base(applicationZipPath))
	err := os.MkdirAll(g.cfg.TmpDir, 0600)
	if err != nil {
		return err
	}
	if strings.Index(appDir, "s3://") == 0 {
		return errors.New("We don't support s3 urls yet")
	}
	//If we need to download from digitalocean
	if strings.Index(appDir, "s3://") == 0 {
		dataPath := strings.Split(appDir, "s3://")[1]
		outFile := filepath.Join(g.cfg.TmpDir, uuid.NewV4().String()+".zip")
		err = g.downloadS3CompatibleFile(dataPath, outFile)
		if err != nil {
			return err
		}
		err = unzip(outFile, appDir)
		if err != nil {
			return err
		}

		err = os.Remove(outFile)
		if err != nil {
			return err
		}
	} else {
		err = unzip(applicationZipPath, appDir)
	}
	g.appDir = appDir
	return err
}
