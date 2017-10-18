package router

import (
	"os"

	"github.com/loomnetwork/dashboard/controllers"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func Initialize(r *gin.Engine) {
	r.LoadHTMLGlob("templates/**/*")

	s := static.Serve("/static", static.LocalFile("static", true))
	r.Use(s)
	secret := os.Getenv("COOKIE_SECRET")
	if secret == "" {
		secret = "123213312fdsjdsflkjdsfajkafsd"
	}
	store := sessions.NewCookieStore([]byte(secret))
	r.Use(sessions.Sessions("mysession", store))

	r.GET("/", controllers.Login)
	r.GET("/apis.json", controllers.APIEndpoints)

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
