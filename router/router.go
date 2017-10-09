package router

import (
	"github.com/mattkanwisher/loom/controllers"

	"github.com/gin-gonic/gin"
)

func Initialize(r *gin.Engine) {
	r.GET("/", controllers.APIEndpoints)

	api := r.Group("")
	{

		api.POST("/upload", controllers.UploadApplication)

		api.GET("/accounts", controllers.GetAccounts)
		api.GET("/accounts/:id", controllers.GetAccount)
		api.POST("/accounts", controllers.CreateAccount)
		api.PUT("/accounts/:id", controllers.UpdateAccount)
		api.DELETE("/accounts/:id", controllers.DeleteAccount)

		api.GET("/appkeys", controllers.GetAppkeys)
		api.GET("/appkeys/:id", controllers.GetAppkey)
		api.POST("/appkeys", controllers.CreateAppkey)
		api.PUT("/appkeys/:id", controllers.UpdateAppkey)
		api.DELETE("/appkeys/:id", controllers.DeleteAppkey)

		api.GET("/applications", controllers.GetApplications)
		api.GET("/applications/:id", controllers.GetApplication)
		api.POST("/applications", controllers.CreateApplication)
		api.PUT("/applications/:id", controllers.UpdateApplication)
		api.DELETE("/applications/:id", controllers.DeleteApplication)

	}
}
