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
	DefaultGatewayTld   = "loomapps.io"
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
	GatewayTld         string
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
	demo               = envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	enableAuth         = envflag.Bool("ENABLE_AUTH", true, "Enables/Disables auth for development")
	loomEnv            = envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr           = envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")
	inviteOnlyMode     = envflag.Bool("INVITE_ONLY_MODE", true, "Whitelisted users can login")
	disableUpload      = envflag.Bool("DISABLE_UPLOAD", false, "Doesn't upload to s3 or nomad. Maybe in future we store to local disk?")
	level              = envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	serverHost         = envflag.String("SERVER_HOST", "http://127.0.0.1:8081", "hostname for oauth redirects")
	gatewayTLD         = envflag.String("GATEWAY_TLD", DefaultGatewayTld, "Default top level domain for gateway, loomapps.io")
	gatewayDockerImage = envflag.String("GATEWAY_DOCKER_IMAGE", DefaultGatewayImage, "Gateway docker image version")
	ganacheDockerImage = envflag.String("GANACHE_DOCKER_IMAGE", DefaultGanacheImage, "Ganache docker image version")
	kubeConfigPath     = envflag.String("KUBECONFIFG", "~/.kube/config", "Path to K8s configuration file")

	//Initially we were saving this data to Digital Ocean Spaces
	//It also supports any S3 compatible iterface, so also AWS
	accessKeyID     = envflag.String("DO_ACCESS_ID", "", "S3/Digital Ocean Spaces access ID")
	secretAccessKey = envflag.String("DO_SECRET_KEY", "", "S3/Digital Ocean Spaces access Secret")
	endpoint        = envflag.String("STORAGE_ENPOINT", "", "S3/Digital Ocean Spaces URL Endpoint")
)

func GetDefaultedConfig() *Config {
	envflag.Parse()

	if *loomEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	log.WithField("loomEnv", loomEnv).Debug("parsing config and setting loom environment")

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
		GatewayTld:         *gatewayTLD,
		GatewayDockerImage: *gatewayDockerImage,
		GanacheDockerImage: *ganacheDockerImage,
		InviteOnlyMode:     *inviteOnlyMode,
		KubeConfigPath:     *kubeConfigPath,
		S3:                 &S3EndPoint{AccessKeyID: *accessKeyID, SecretAccessKey: *secretAccessKey, EndPointUrl: *endpoint}}
}

//Finding the config on the gin context
func Default(c *gin.Context) *Config {
	return c.MustGet(DefaultKey).(*Config)
}
