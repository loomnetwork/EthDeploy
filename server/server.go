package server

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/router"

	eztemplate "github.com/loomnetwork/ez-gin-template"
)

func Setup(db *gorm.DB, c *config.Config) *gin.Engine {
	r := gin.Default()

	render := eztemplate.New()
	render.TemplatesDir = "templates/"
	render.Layout = "layout/application"
	render.PartialDir = "partials"
	render.Ext = ".tmpl"
	render.Debug = true // default
	// render.TemplateFuncMap = template.FuncMap{}

	r.HTMLRender = render.Init()

	r.Use(middleware.SetDBtoContext(db))
	r.Use(middleware.SetConfigtoContext(c))
	router.Initialize(r, c)
	return r
}
