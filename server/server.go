package server

import (
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/router"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/jinzhu/gorm"
)

func Setup(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	s := static.Serve("/static", static.LocalFile("static", true))
	r.Use(s)
	r.Use(middleware.SetDBtoContext(db))
	router.Initialize(r)
	return r
}
