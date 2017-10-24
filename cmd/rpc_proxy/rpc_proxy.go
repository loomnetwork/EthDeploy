package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ianschenck/envflag"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/middleware"
	log "github.com/sirupsen/logrus"
	"rsc.io/letsencrypt"
)

//Two headers
//Loom API KEY -> loom_api_key
//Loom Application slug -> loom_application_slug

func LoggedInMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		/*
			if accountID != nil && len(accountID.(string)) > 0 {
				log.WithField("account_id", accountID).Debug("[AuthFilter] User is logged in")

				//do something here
				c.Next()
			} else {
				c.Abort()
				log.Debug("[AuthFilter]No user is logged in, redirect to login")
				c.Redirect(302, "/login")
			}
		*/
		//Read an api key header if not send a 500 with an error code
		c.Abort()
		c.JSON(401, gin.H{"error": "Invalid or missing API Key"})
	}
}

func commonHeaders(c *gin.Context) {
	c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")
}

func Web3CatchAll(c *gin.Context) {
	commonHeaders(c)

	proxy := c.MustGet("WEB3PROXY").(*httputil.ReverseProxy)
	proxy.ServeHTTP(c.Writer, c.Request)
}

func OptionsCatchAll(c *gin.Context) {
	commonHeaders(c)
	c.Header("Content-Type", "text/plain")
	c.HTML(200, "", nil)
}

type AccountJson struct {
	AccountPrivateKeys map[string]string `json:"private_keys"`
}

func readJsonOutput(filename string) (*AccountJson, error) {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var data *AccountJson
	json.Unmarshal(file, &data)
	return data, nil
}

func LoomAccounts(c *gin.Context) {
	commonHeaders(c)
	config := config.Default(c)
	fmt.Printf("serving file-%s\n", config.PrivateKeyJsonFile)
	accountJson, err := readJsonOutput(config.PrivateKeyJsonFile) //TODO we should move this to a separate go routine that is spawning the other executable
	if err != nil {
		log.WithField("error", err).Error("Failed reading the json file")
		c.JSON(400, gin.H{"error": "Invalid or missing API Key"})
	}
	c.JSON(200, accountJson)
}

func routerInitialize(r *gin.Engine, c *config.Config) {
	if c.DemoMode == false {
		//TODO how can we group calls together?
		r.Use(LoggedInMiddleWare())
	}

	//We prefix our apis with underscore so there is no conflict with the Web3 RPC APOs
	r.POST("/_loom/accounts", LoomAccounts) //Returns accounts and private keys for this test network

	// Web3 RPCs
	r.NoRoute(Web3CatchAll)
}

func setup(db *gorm.DB, c *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.SetDBtoContext(db))
	r.Use(middleware.SetConfigtoContext(c))
	r.Use(middleware.SetProxyToContext(c))
	routerInitialize(r, c)
	return r
}

func main() {
	demo := envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	level := envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	loomEnv := envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr := envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")
	skipLetsEncrypt := envflag.Bool("LETS_ENCRYPT_ENABLE", false, "enables or disables lets encrypt ssl")
	proxyAddr := envflag.String("PROXY_ADDR", "http://localhost:8545", "Where the actual web3 rpc address exists")
	privateKeyJsonFile := envflag.String("PRIVATE_KEY_JSON_PATH", "misc/example_private_keys.json", "TestRPC json output")

	envflag.Parse()

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

	config := &config.Config{
		DemoMode:           *demo,
		Env:                *loomEnv,
		ProxyAddr:          *proxyAddr,
		PrivateKeyJsonFile: *privateKeyJsonFile,
	}

	database := db.Connect()
	s := setup(database, config)

	//local dev we will ignore using letsencrypt
	if *skipLetsEncrypt == false {
		s.Run(*bindAddr)
	} else {
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			s.ServeHTTP(w, r)
		})
		var m letsencrypt.Manager
		if err := m.CacheFile("letsencrypt.cache"); err != nil {
			log.Fatal(err)
		}
		log.Fatal(m.Serve())
	}
}
