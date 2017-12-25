package gateway

import (
	"errors"
	"fmt"
	logf "log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/loomnetwork/ethcontract"
	minio "github.com/minio/minio-go"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
)

func (g *Gateway) downloadS3CompatibleFile(applicationZipPath, outputPath string) error {
	// Initialize minio client object.
	minioClient, err := minio.New(g.cfg.S3.EndPointUrl, g.cfg.S3.AccessKeyID, g.cfg.S3.SecretAccessKey, true)
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

func (g *Gateway) getextractedDir() string {
	if g.guid == "" {
		g.guid = uuid.NewV4().String()
	}
	return filepath.Join(g.cfg.TmpDir, g.guid)
}

func (g *Gateway) downloadAndExtractApp(applicationZipPath string) error {
	var err error

	if strings.Index(applicationZipPath, "s3://") == 0 {
		return errors.New("We don't support s3 urls yet")
	}

	appDir := g.getextractedDir()
	log.WithField("dir", g.cfg.TmpDir).Debug("creating folder")
	err = os.MkdirAll(g.cfg.TmpDir, 0766)
	if err != nil {
		return err
	}

	outFile := applicationZipPath
	//If we need to download from digitalocean
	if strings.Index(applicationZipPath, "do://") == 0 {
		dataPath := strings.Split(applicationZipPath, "do://")[1]
		outFile = filepath.Join(g.cfg.TmpDir, g.guid+".zip")
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

//TODO random, right now always first ;)
func (g *Gateway) getRandomWalletPrivateKey() (string, error) {
	accountJson, err := readJsonOutput(g.cfg.PrivateKeyJsonFile) //TODO we should move this to a separate go routine that is spawning the other executable
	if err != nil {
		log.WithField("error", err).Error("Failed reading the json file")
		return "", err
	}
	for k, v := range accountJson.AccountPrivateKeys {
		fmt.Printf("k-%s, v-%s", k, v)
		return v, nil
	}
	return "", nil
}

func (g *Gateway) deployContracts() {
	log.Debug("Deploying contracts")
	time.Sleep(4 * time.Second) //To be certain we don't accidentally load to quickly

	eclient, err := ethcontract.NewEthUtil(g.cfg.EthereumURI)
	if err != nil {
		log.Fatalf("Failed to connect to the Ethereum client: %v", err)
	}

	key, err := g.getRandomWalletPrivateKey()
	if err != nil {
		log.Fatalf("Failed finding private key: %v", err)
	}
	log.WithField("privatekey", key).Debug("found a private key")
	eclient.SetWalletPrivateKey(key)

	//Currently only handling truffle style json contracts
	contractDir := filepath.Join(g.appDir, "contracts/*.json")
	files, err := filepath.Glob(contractDir)
	if err != nil {
		log.WithError(err).Error(err)
		logf.Fatal(err) //nothing we can do?
	}
	for _, truffleFile := range files {
		idx := strings.Index(truffleFile, "Migrations.json")
		if idx != -1 {
			fmt.Printf("skipping -%s -%d\n", truffleFile, idx)
			continue
		}
		log.WithField("contract", truffleFile).Info("deploying contract")

		address, err := eclient.DeployContractTruffleFromFile(truffleFile)
		if err != nil {
			log.Fatalf("Failed to deploy contract: %v", err)
		}
		basename := filepath.Base(truffleFile)
		name := strings.TrimSuffix(basename, filepath.Ext(basename))
		fmt.Printf("Deployed truffle contract -%s to address 0x%x", truffleFile, address)
		g.addContract(name, fmt.Sprintf("0x%x", address))
	}
	//TODO check for abi/bin files for non truffle style
}
