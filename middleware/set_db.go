package middleware

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/models"
)

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func GetLoggedInScope(c *gin.Context) *gorm.DB {
	session := sessions.Default(c)
	accountID := session.Get("account_id")

	db := dbpkg.DBInstance(c)
	return db.Where("account_id = ?", accountID)

}
func GetAccountFromApiKey(c *gin.Context) string {
	apikeyheader := c.GetHeader("Loom-Api-Key")
	if apikeyheader != "" {

		db := dbpkg.DBInstance(c)
		apikey := &models.Apikey{}
		if err := db.Where("`key` = ?", apikeyheader).Find(&apikey).Error; err == nil {

			return strconv.Itoa(int(apikey.AccountID))
			//session doesn't work for api clients, maybe revisit that
			//			session.Set("account_id", string(apikey.AccountID))
		}
	}
	return ""
}

//TODO: this is convoluted refactor
func GetLoggedInUser(c *gin.Context) uint {
	session := sessions.Default(c)
	accountID := session.Get("account_id")

	res, err := strconv.Atoi(accountID.(string))
	if err != nil {
		panic(fmt.Sprintf("impossible-%v", accountID))
	}

	return uint(res)

}

func SetConfigtoContext(conf *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(config.DefaultKey, conf)
		c.Next()
	}
}

func SetProxyToContext(conf *config.RPCConfig) gin.HandlerFunc {
	u, _ := url.Parse(conf.ProxyAddr)
	proxy := httputil.NewSingleHostReverseProxy(u)
	proxy.Transport = &myTransport{}
	return func(c *gin.Context) {
		c.Set("WEB3PROXY", proxy)
		c.Next()
	}
}

type myTransport struct {
	// Uncomment this if you want to capture the transport
	// CapturedTransport http.RoundTripper
}

func (t *myTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	response, err := http.DefaultTransport.RoundTrip(request)
	// or, if you captured the transport
	// response, err := t.CapturedTransport.RoundTrip(request)

	// The httputil package provides a DumpResponse() func that will copy the
	// contents of the body into a []byte and return it. It also wraps it in an
	// ioutil.NopCloser and sets up the response to be passed on to the client.
	body, err := httputil.DumpResponse(response, true)
	if err != nil {
		// copying the response body did not work
		return nil, err
	}

	// You may want to check the Content-Type header to decide how to deal with
	// the body. In this case, we're assuming it's text.
	log.Print(string(body))

	return response, err
}
