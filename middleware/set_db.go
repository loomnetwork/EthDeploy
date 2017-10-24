package middleware

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
)

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func SetConfigtoContext(conf *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(config.DefaultKey, conf)
		c.Next()
	}
}

func SetProxyToContext(conf *config.Config) gin.HandlerFunc {
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
