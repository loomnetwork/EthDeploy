package router

import (
	"fmt"
	"os"

	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/controllers"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func LoggedInMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		accountID := session.Get("account_id")
		fmt.Printf("debug in logged in middleware --\n")

		if accountID != nil && len(accountID.(string)) > 0 {
			fmt.Printf("User logged in --%s\n", accountID)

			//do something here
			c.Next()
		} else {
			fmt.Printf("No user is logged in, redirect to login")
			c.Redirect(302, "/login")
		}
	}
}

func Initialize(r *gin.Engine, c *config.Config) {
	secret := os.Getenv("COOKIE_SECRET")
	if secret == "" {
		secret = "123213312fdsjdsflkjdsfajkafsd"
	}

	//TODO: when do sessions get invalidated?
	store := sessions.NewCookieStore([]byte(secret))
	r.Use(sessions.Sessions("mysession", store))

	s := static.Serve("/assets", static.LocalFile("static", true))
	r.Use(s)

	r.GET("/login", controllers.Login)

	if c.DemoMode == false {
		r.Use(LoggedInMiddleWare())
	}
	r.GET("/", controllers.Dashboard)

	r.GET("/apis.json", controllers.APIEndpoints)

	//Apis require api key or logged in session
	//TODO have middleware set the logged account based on the api key or the session cookie
	api := r.Group("")
	{

		api.POST("/upload", controllers.UploadApplication)
		api.POST("/login_oauth", controllers.LoginOauth)
		api.GET("/oauth/callback", controllers.RedirectOauth)

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
