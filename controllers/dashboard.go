package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
)

func ApplicationIndex(c *gin.Context) {
	app1 := &models.Application{
		Name:         "test123",
		Slug:         "123",
		Status:       "Live",
		LastDeployed: time.Now(),
	}
	app2 := &models.Application{
		Name:         "test123",
		Slug:         "123",
		Status:       "Live",
		LastDeployed: time.Now(),
	}

	apps := []*models.Application{
		app1, app2,
	}
	c.HTML(http.StatusOK, "dashboard/index", gin.H{
		"loggedIn":     true,
		"applications": apps,
	})
}
