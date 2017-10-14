package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	c.HTML(http.StatusOK, "index.tmpl", gin.H{
		"title": "Loom Network Login",
	})
}

func RedirectOauth(c *gin.Context) {
	//TODO validate oauth token
	c.HTML(http.StatusOK, "dashboard/index.tmpl", gin.H{
		"title": "Dashboard",
	})
}

//Api calls
func LoginOauth(c *gin.Context) {
	//	r := c.Request
	//	w := c.Writer

}
