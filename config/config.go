package config

import (
	"github.com/gin-gonic/gin"
	"github.com/ianschenck/envflag"
	"github.com/labstack/gommon/log"
)

const (
	DefaultKey = "CONFIG"
)

type S3EndPoint struct {
	AccessKeyID     string
	SecretAccessKey string
	EndPointUrl     string
}

type Config struct {
	DemoMode       bool   //Disables Auth and enables all UI
	InviteOnlyMode bool   //Requires users to be whitelisted before creating an account
	ServerHost     string // base domain, useful for absolute redirects and oauth
	Env            string //Environment we are in
	BindAddr       string

	S3 *S3EndPoint
}

//RPCConfiguration
type RPCConfig struct {
	*Config

	PrivateKeyJsonFile string //File to read Private key files
	ProxyAddr          string //Address of the testrpc/ethereum instance tied to a specific rpc proxy
	SpawnNetwork       string
	TmpDir             string
	ApplicationZipPath string
}

var (
	proxyAddr          = envflag.String("PROXY_ADDR", "http://localhost:8545", "Where the actual web3 rpc address exists")
	privateKeyJsonFile = envflag.String("PRIVATE_KEY_JSON_PATH", "misc/example_private_keys.json", "TestRPC json output")
	spawnNetwork       = envflag.String("SPAWN_NETWORK", "node tmp/testrpc/build/cli.node.js", "How does test rpc spawn the testrpc or ethereum network")
	tmpDir             = envflag.String("TMP_DIR", "tmp_uploads", "the directory where we will store the uploaded zip")
	appSlug            = envflag.String("APP_SLUG", "block_ssh", "domain slug for the application")
	demo               = envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	loomEnv            = envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr           = envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")
	applicationZipPath = envflag.String("APP_ZIP_FILE", "misc/block_ssh.zip", "Location of app zip file. Relative or on s3 or Digitalocean bucket. Ex. do://uploads/block_ssh.zip")
)

func GetDefaultedConfig() *Config {
	envflag.Parse()
	//Ghetto for now
	accessKeyID := "N35N62UCP4AKTEXLVFUP"
	secretAccessKey := "q9fJnv8IhGpC+tDtpFAOr0mXSRUCJydlOMwW3fNDBQk"
	endpoint := "nyc3.digitaloceanspaces.com"

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}

	return &Config{
		DemoMode: *demo,
		Env:      *loomEnv,
		BindAddr: *bindAddr,
		S3:       &S3EndPoint{AccessKeyID: accessKeyID, SecretAccessKey: secretAccessKey, EndPointUrl: endpoint}}
}

func GetDefaultedRPCConfig() *RPCConfig {
	return &RPCConfig{
		ProxyAddr:          *proxyAddr,
		PrivateKeyJsonFile: *privateKeyJsonFile,
		SpawnNetwork:       *spawnNetwork,
		TmpDir:             *tmpDir,
		ApplicationZipPath: *applicationZipPath,
		Config:             GetDefaultedConfig()}
}

//Finding the config on the gin context
func Default(c *gin.Context) *Config {
	return c.MustGet(DefaultKey).(*Config)
}
