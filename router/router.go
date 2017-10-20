package router

import (
	"fmt"

	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/controllers"
	log "github.com/sirupsen/logrus"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func LoggedInMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		accountID := session.Get("account_id")
		fmt.Printf("debug in logged in middleware --%v\n", accountID)

		if accountID != nil && len(accountID.(string)) > 0 {
			log.WithField("account_id", accountID).Debug("[AuthFilter] User is logged in")

			//do something here
			c.Next()
		} else {
			log.Debug("[AuthFilter]No user is logged in, redirect to login")
			c.Redirect(302, "/login")
		}
	}
}

func Initialize(r *gin.Engine, c *config.Config) {

	s := static.Serve("/assets", static.LocalFile("static", true))
	r.Use(s)

	r.GET("/login", controllers.Login)
	r.GET("/logout", controllers.Logout)
	r.POST("/login_oauth", controllers.LoginOauth)
	r.GET("/oauth/callback", controllers.RedirectOauth)

	if c.DemoMode == false {
		//TODO how can we group calls together?
		r.Use(LoggedInMiddleWare())
	}
	r.GET("/", controllers.Dashboard)

	r.GET("/apis.json", controllers.APIEndpoints)

	//Apis require api key or logged in session
	//TODO have middleware set the logged account based on the api key or the session cookie
	api := r.Group("")
	{
		api.POST("/upload", controllers.UploadApplication)

		api.GET("/accounts", controllers.GetAccounts)
		api.GET("/accounts/:id", controllers.GetAccount)
		api.POST("/accounts", controllers.CreateAccount)
		api.PUT("/accounts/:id", controllers.UpdateAccount)
		api.DELETE("/accounts/:id", controllers.DeleteAccount)

		api.GET("/apikeys", controllers.GetApikeys)
		api.GET("/apikeys/:id", controllers.GetApikey)
		api.POST("/apikeys", controllers.CreateApikey)
		api.PUT("/apikeys/:id", controllers.UpdateApikey)
		api.DELETE("/apikeys/:id", controllers.DeleteApikey)

		api.GET("/applications", controllers.GetApplications)
		api.GET("/applications/:id", controllers.GetApplication)
		api.POST("/applications", controllers.CreateApplication)
		api.PUT("/applications/:id", controllers.UpdateApplication)
		api.DELETE("/applications/:id", controllers.DeleteApplication)

	}
}
