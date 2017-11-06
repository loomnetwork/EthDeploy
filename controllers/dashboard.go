package controllers

import (
	"fmt"
	"net/http"

	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/middleware"
	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
)

func ApplicationIndex(c *gin.Context) {
	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.Application{})
	if err != nil {
		log.WithField("error", err).Warn("Failed retrieving applications")
	}

	db, err = parameter.Paginate(db)
	if err != nil {
		log.WithField("error", err).Warn("Failed retrieving applications")
	}

	db = parameter.SetPreloads(db)
	db = parameter.SortRecords(db)
	db = parameter.FilterFields(db)
	apps := []models.Application{}

	if err := db.Where("").Find(&apps).Error; err != nil {
		log.WithField("error", err).Warn("Failed retrieving applications")
	}

	c.HTML(http.StatusOK, "dashboard/index", gin.H{
		"loggedIn":     true,
		"applications": apps,
	})
}

func Dashboard(c *gin.Context) {
	id := c.Param("id")

	// if id == nil {
	// 	c.Redirect(301, "/")
	// }

	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.Application{})
	if err != nil {
		log.WithField("error", err).Warn("Failed retrieving application for dashboard")
	}

	db, err = parameter.Paginate(db)
	if err != nil {
		log.WithField("error", err).Warn("Failed retrieving application for dashboard")
	}

	db = parameter.SetPreloads(db)
	db = parameter.SortRecords(db)
	db = parameter.FilterFields(db)
	app := models.Application{}

	if err := db.Where("slug = ?", id).Find(&app).Error; err != nil {
		log.WithField("error", err).Warn("Failed retrieving application for dashboard")
	}

	cfg := config.Default(c)
	c.HTML(http.StatusOK, "dashboard/dashboard", gin.H{
		"loggedIn": true,
		"demoMode": cfg.DemoMode,
		"app":      app,
	})
}

func NewDApp(c *gin.Context) {
	fmt.Printf("got params %s", c.Params)
	application := models.Application{}

	c.HTML(http.StatusOK, "dashboard/new", gin.H{
		"loggedIn":    true,
		"application": application,
	})
}
