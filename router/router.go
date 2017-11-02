package router

import (
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

		//Check if there is an apikey header for commandline clients

		//If we find one, look it up in the database and set it into the gin context

		if accountID != nil && len(accountID.(string)) > 0 {
			log.WithField("account_id", accountID).Debug("[AuthFilter] User is logged in")

			//do something here
			c.Next()
		} else {
			c.Abort()
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
	//Is there a cleaner way then multiple urls?
	r.GET("/oauth/callback_linkedin", controllers.RedirectOauthLinkedIn)
	r.GET("/oauth/callback_github", controllers.RedirectOauthGithub)

	if c.EnableAuth == true {
		//TODO how can we group calls together?
		r.Use(LoggedInMiddleWare())
	}

	// Pages
	r.GET("/", controllers.ApplicationIndex)
	r.GET("/dashboard/:id", controllers.Dashboard)
	r.GET("/newdapp", controllers.NewDApp)
	r.POST("/updated_default_chain/:id", controllers.UpdateApplication)

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

		//Not sure we need to expose this, maybe just edit database
		/*
			api.GET("/beta_users", controllers.GetBetaUsers)
			api.GET("/beta_users/:id", controllers.GetBetaUsers)
			api.POST("/beta_users", controllers.CreateBetaUsers)
			api.PUT("/beta_users/:id", controllers.UpdateBetaUsers)
			api.DELETE("/beta_users/:id", controllers.DeleteBetaUsers)
		*/
		api.GET("/deploy_histories", controllers.GetDeployHistories)
		api.GET("/deploy_histories/:id", controllers.GetDeployHistory)
		api.POST("/deploy_histories", controllers.CreateDeployHistory)
		api.PUT("/deploy_histories/:id", controllers.UpdateDeployHistory)
		api.DELETE("/deploy_histories/:id", controllers.DeleteDeployHistory)
	}
}
