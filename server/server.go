package server

import (
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/router"
	eztemplate "github.com/loomnetwork/ez-gin-template"
)

func Setup(db *gorm.DB, c *config.Config) *gin.Engine {
	r := gin.Default()
	secret := os.Getenv("COOKIE_SECRET")
	if secret == "" {
		secret = "123213312fdsjdsflkjdsfajkafsd"
	}

	//TODO: when do sessions get invalidated?
	store := sessions.NewCookieStore([]byte(secret))
	r.Use(sessions.Sessions("mysession", store))

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
