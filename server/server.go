package server

import (
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/router"

	"github.com/gin-gonic/gin"

	"github.com/jinzhu/gorm"
)

func Setup(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.SetDBtoContext(db))
	router.Initialize(r)
	return r
}
