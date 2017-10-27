package gateway

/*
func downloadAndExtractApp(applicationZipPath, c *Config) (string, err) {
	appDir := fmt.Printf("%s/%s", tmpDir, filepath.Base(applicationZipPath))
	err := os.MkdirAll(tmpDir, 0600)
	if err != nil {
		return "", err
	}
	//If we need to download from digitalocean
	if strings.Index(appDir, "do://") == 0 {
		//TODO download
		accessKeyID := "Q3AM3UQ867SPQQA43P2F"
		secretAccessKey := "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG"
		useSSL := true

		// Initialize minio client object.
		minioClient, err := minio.New(endpoint, accessKeyID, secretAccessKey, useSSL)
		if err != nil {
			log.Fatalln(err)
		}

		// Make a new bucket called mymusic.
		bucketName := "mymusic"
		location := "us-east-1"

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
	}

	err = archiver.Zip.Open(applicationZipPath, appDir)
	return appDir, err
}
*/
