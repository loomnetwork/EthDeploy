package gateway

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http/httputil"

	"github.com/containous/traefik/log"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/middleware"
)

type AccountJson struct {
	AccountPrivateKeys map[string]string `json:"private_keys"`
}

//Loom API KEY -> loom_api_key
//Loom Application slug -> loom_application_slug

func (g *Gateway) LoggedInMiddleWare() gin.HandlerFunc {
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

func (g *Gateway) Web3CatchAll(c *gin.Context) {
	//Test rpc is already putting the headers in, maybe in future we can inspect if they aren't there to add them
	//commonHeaders(c)

	proxy := c.MustGet("WEB3PROXY").(*httputil.ReverseProxy)
	proxy.ServeHTTP(c.Writer, c.Request)
}

func (g *Gateway) OptionsCatchAll(c *gin.Context) {
	commonHeaders(c)
	c.Header("Content-Type", "text/plain")
	c.HTML(200, "", nil)
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

func (g *Gateway) LoomContracts(c *gin.Context) {
	commonHeaders(c)

	if g.cfg.EnableFakeData {
		contracts := []Contract{
			Contract{
				Name:    "blockssh",
				Address: "0x000000",
			},
		}
		c.JSON(200, contracts)
		return
	}

	c.JSON(200, g.getContracts())
}

func (g *Gateway) LoomNetwork(c *gin.Context) {
	commonHeaders(c)

	network := "mainnet"
	c.JSON(200, gin.H{"network": network})
}

func (g *Gateway) LoomAccounts(c *gin.Context) {
	commonHeaders(c)
	fmt.Printf("serving file-%s\n", g.cfg.PrivateKeyJsonFile)
	accountJson, err := readJsonOutput(g.cfg.PrivateKeyJsonFile) //TODO we should move this to a separate go routine that is spawning the other executable
	if err != nil {
		log.WithField("error", err).Error("Failed reading the json file")
		c.JSON(400, gin.H{"error": "Invalid or missing API Key"})
	}
	c.JSON(200, accountJson)
}

func (g *Gateway) routerInitialize(r *gin.Engine) {
	if g.cfg.DemoMode == false {
		//TODO how can we group calls together?
		//r.Use(LoggedInMiddleWare())
	}

	r.OPTIONS("/", g.OptionsCatchAll)
	//We prefix our apis with underscore so there is no conflict with the Web3 RPC APOs
	r.POST("/_loom/accounts", g.LoomAccounts)   //Returns accounts and private keys for this test network
	r.POST("/_loom/contracts", g.LoomContracts) //Returns what contracts have been deployed to the smart contract
	r.POST("/_loom/network", g.LoomNetwork)     //Returns what contracts have been deployed to the smart contract
	// Web3 RPCs
	r.POST("/", g.Web3CatchAll)

	p := g.getextractedDir() + "/static"
	s := static.Serve("/", static.LocalFile(p, true))
	r.Use(s)
}

//TODO maybe split http to a seperate class
func (g *Gateway) setupHttp(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	//	r.Use(middleware.SetDBtoContext(db))
	//r.Use(middleware.SetConfigtoContext(c)) //Should be part of gateway class now
	r.Use(middleware.SetProxyToContext(g.cfg))
	g.routerInitialize(r)
	return r
}
