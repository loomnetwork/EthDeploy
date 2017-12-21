package gateway

import (
	"fmt"
	logf "log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/loomnetwork/ethcontract"
	"github.com/minio/minio-go"
	"github.com/pkg/errors"
	"github.com/satori/go.uuid"
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

////TODO random, right now always first ;)
//func (g *Gateway) getRandomWalletPrivateKey() (string, error) {
//	accountJson, err := readJsonOutput(g.cfg.PrivateKeyJsonFile) //TODO we should move this to a separate go routine that is spawning the other executable
//	if err != nil {
//		log.WithField("error", err).Error("Failed reading the json file")
//		return "", err
//	}
//	for k, v := range accountJson.AccountPrivateKeys {
//		fmt.Printf("k-%s, v-%s", k, v)
//		return v, nil
//	}
//	return "", nil
//}

func (g *Gateway) deployContracts() {
	log.Debug("Deploying contracts")
	time.Sleep(4 * time.Second) //To be certain we don't accidentally load to quickly

	eclient, err := ethcontract.NewEthUtil(g.cfg.EthereumURI)
	if err != nil {
		log.Fatalf("Failed to connect to the Ethereum client: %v", err)
	}

	//key, err := g.getRandomWalletPrivateKey()
	key, err := g.getTestRPCPrivateKey()

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
			log.Fatalf("Failed to deploy contract file %v: %v", truffleFile, err)
		}

		basename := filepath.Base(truffleFile)
		name := strings.TrimSuffix(basename, filepath.Ext(basename))
		fmt.Printf("Deployed truffle contract -%s to address 0x%x", truffleFile, address)
		g.addContract(name, fmt.Sprintf("0x%x", address))
	}
	//TODO check for abi/bin files for non truffle style
}

var testKeyspace = &AccountJson{AccountPrivateKeys: map[string]string{
	"0xefa479be14bc9fd809f3e4aeb8cb053b96f27318": "174c5054ddfc4994d79f7d75616ed50d1159ccfffb6542efdeeca16a12bb3e76",
	"0xd597ad3cf62c886cb35484f6e267f4a44cfc469d": "58099adea0b246f6f716f082480d0d22145563b88a9731618ea5d68673a69eb6",
	"0x6349883feb556aba531c2f1dae0e04989f56d45a": "1bf096c11e1e18898a6674b649855c6c9d448f3d806ed0f368f9b263bd7c9126",
	"0xa3a5131b61e7d83bcb3942f17b58820150d17cc7": "6bb5c7975d01c8a27e53428a01b12781cd6a13dff7272d597dcbfab826e1b595",
	"0x182df3c60c41039c7208155b40e085ef33afd527": "dfeb9d26e02bb6f818d05a0912b487c5a3c37ce476063b0a7382f1256307e7c1",
	"0x5233b94618ea42579f62b46df4fdffe43266eeb0": "e0c8166aa3e6ae65f8b48756dcd5b6d89003e6357a3aa5dd735f9e1a8059452a",
	"0x54254787940709212e3638e932d4766383c56992": "7559857c2b83dfccda942600c8189e3eea0505e51c2c47a2be85a1b73ff0283b",
	"0x4e8d58973e3e87880b115adb0487cd03de1da967": "d4b7485fdb7eae9ea2ccd99317e2784b2efd8e87eb9bb402833712ce57105147",
	"0x26a28508664df36ccfc703a3f8d683b433a72f1b": "f499d4b12cd99818991a2630d63997860dd1a105ecce8e1c1321ff32b10509de",
	"0x82cec069299a0c62cecbc433ee280e13234a17ac": "e0857acc170ff2fee45e0dc99118b02a356d0f1ab754905d440ae347fb4959ee",
}}

func (g *Gateway) getTestRPCPrivateKey() (string, error) {
	rand.Seed(time.Now().Unix())
	testSpace := []string{}

	for _, v := range testKeyspace.AccountPrivateKeys {
		testSpace = append(testSpace, v)
	}

	return testSpace[rand.Intn(len(testSpace))], nil
}
