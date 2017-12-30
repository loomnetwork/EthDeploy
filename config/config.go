package config

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ianschenck/envflag"
	log "github.com/sirupsen/logrus"
)

const (
	DefaultKey          = "CONFIG"
	DefaultGanacheImage = "gcr.io/robotic-catwalk-188706/loom-ganache:test"
	DefaultGatewayImage = "gcr.io/robotic-catwalk-188706/rpc_gateway:e3face0"
)

type S3EndPoint struct {
	AccessKeyID     string
	SecretAccessKey string
	EndPointUrl     string
}

type Config struct {
	DemoMode           bool   //Disables Auth and enables all UI
	InviteOnlyMode     bool   //Requires users to be whitelisted before creating an account
	ServerHost         string // base domain, useful for absolute redirects and oauth
	Env                string //Environment we are in
	BindAddr           string
	EnableAuth         bool
	DisableUpload      bool
	GatewayDockerImage string
	GanacheDockerImage string
	KubeConfigPath     string // Path to GCP Kubernetes config file for out-of-cluster authentication.

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
	EnableFakeData     bool
	LoomDashboardHost  string
	AppSlug            string
	EthereumURI        string
}

var (
	proxyAddr          = envflag.String("PROXY_ADDR", "http://localhost:8545", "Where the actual web3 rpc address exists")
	privateKeyJsonFile = envflag.String("PRIVATE_KEY_JSON_PATH", "data.json", "TestRPC json output")
	spawnNetwork       = envflag.String("SPAWN_NETWORK", "node tmp/testrpc/build/cli.node.js", "How does test rpc spawn the testrpc or ethereum network")
	tmpDir             = envflag.String("TMP_DIR", "tmp_uploads", "the directory where we will store the uploaded zip")
	appSlug            = envflag.String("APP_SLUG", "block_ssh", "domain slug for the application")
	demo               = envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	enableAuth         = envflag.Bool("ENABLE_AUTH", true, "Enables/Disables auth for development")
	loomEnv            = envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr           = envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")
	applicationZipPath = envflag.String("APP_ZIP_FILE", "misc/block_ssh.zip", "Location of app zip file. Relative or on s3 or Digitalocean bucket. Ex. do://uploads/block_ssh.zip")
	enableFakeData     = envflag.Bool("ENABLE_FAKE_DATA", false, "Stubs out data")
	inviteOnlyMode     = envflag.Bool("INVITE_ONLY_MODE", true, "Whitelisted users can login")
	disableUpload      = envflag.Bool("DISABLE_UPLOAD", false, "Doesn't upload to s3 or nomad. Maybe in future we store to local disk?")
	level              = envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	serverHost         = envflag.String("SERVER_HOST", "http://127.0.0.1:8081", "hostname for oauth redirects")
	loomDashboardHost  = envflag.String("LOOM_DASHBOARD_API_HOST", "https://dashboard.loomx.io", "hostname for production dashboard to read data from it, for the gateway.")
	gatewayDockerImage = envflag.String("GATEWAY_DOCKER_IMAGE", DefaultGatewayImage, "Gateway docker image version")
	ganacheDockerImage = envflag.String("GANACHE_DOCKER_IMAGE", DefaultGanacheImage, "Ganache docker image version")
	ethereumURI        = envflag.String("ETHEREUM_URI", "http://localhost:8545", "Test RPC Host address")
	kubeConfigPath     = envflag.String("KUBECONFIFG", "~/.kube/config", "Path to K8s configuration file")
)

func GetDefaultedConfig() *Config {
	envflag.Parse()

	if *loomEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	log.WithField("loomEnv", loomEnv).Debug("parsing config and setting loom environment")

	//Ghetto for now
	accessKeyID := "5X5SWWI4MYYT2K4HQE4S"
	secretAccessKey := "2s29YdRWnox3fixcPpZPsE4FWo/U+06LitAM3oWh820"
	endpoint := "nyc3.digitaloceanspaces.com"

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}
	// Check for log level specified by environment variable
	if logLevel := strings.ToLower(*level); logLevel != "" {
		// Check for level, default to info on bad level
		level, err := log.ParseLevel(logLevel)
		if err != nil {
			log.WithField("level", logLevel).Error("invalid log level, defaulting to 'info'")
			level = log.InfoLevel
		}

		// Set log level
		log.SetLevel(log.Level(level))
	}

	return &Config{
		DemoMode:           *demo,
		Env:                *loomEnv,
		BindAddr:           *bindAddr,
		EnableAuth:         *enableAuth,
		DisableUpload:      *disableUpload,
		ServerHost:         *serverHost,
		GatewayDockerImage: *gatewayDockerImage,
		GanacheDockerImage: *ganacheDockerImage,
		InviteOnlyMode:     *inviteOnlyMode,
		KubeConfigPath:     *kubeConfigPath,
		S3:                 &S3EndPoint{AccessKeyID: accessKeyID, SecretAccessKey: secretAccessKey, EndPointUrl: endpoint}}
}

func GetDefaultedRPCConfig() *RPCConfig {
	cfg := GetDefaultedConfig()
	return &RPCConfig{
		ProxyAddr:          *proxyAddr,
		PrivateKeyJsonFile: *privateKeyJsonFile,
		SpawnNetwork:       *spawnNetwork,
		TmpDir:             *tmpDir,
		ApplicationZipPath: *applicationZipPath,
		EnableFakeData:     *enableFakeData,
		LoomDashboardHost:  *loomDashboardHost,
		AppSlug:            *appSlug,
		EthereumURI:        *ethereumURI,
		Config:             cfg,
	}
}

//Finding the config on the gin context
func Default(c *gin.Context) *Config {
	return c.MustGet(DefaultKey).(*Config)
}
