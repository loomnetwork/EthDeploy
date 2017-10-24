package config

import "github.com/gin-gonic/gin"

const (
	DefaultKey = "CONFIG"
)

type Config struct {
	DemoMode       bool   //Disables Auth and enables all UI
	InviteOnlyMode bool   //Requires users to be whitelisted before creating an account
	ServerHost     string // base domain, useful for absolute redirects and oauth
	Env            string //Environment we are in

	//Only used in rpc gateway for now
	PrivateKeyJsonFile string //File to read Private key files
	ProxyAddr          string //Address of the testrpc/ethereum instance tied to a specific rpc proxy
	SpawnNetwork       string
}

//Finding the config on the gin context
func Default(c *gin.Context) *Config {
	return c.MustGet(DefaultKey).(*Config)
}
