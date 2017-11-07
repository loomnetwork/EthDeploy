package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/helper"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/models"
	"github.com/loomnetwork/dashboard/version"

	"github.com/gin-gonic/gin"
)

func GetApplications(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.Application{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db, err = parameter.Paginate(db)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	db = parameter.SortRecords(db)
	db = parameter.FilterFields(db)
	applications := []models.Application{}
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Application{}, fields)

	if err := db.Select(queryFields).Find(&applications).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	index := 0

	if len(applications) > 0 {
		index = int(applications[len(applications)-1].ID)
	}

	if err := parameter.SetHeaderLink(c, index); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	if _, ok := c.GetQuery("stream"); ok {
		enc := json.NewEncoder(c.Writer)
		c.Status(200)

		for _, application := range applications {
			fieldMap, err := helper.FieldToMap(application, fields)
			if err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			if err := enc.Encode(fieldMap); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
		}
	} else {
		fieldMaps := []map[string]interface{}{}

		for _, application := range applications {
			fieldMap, err := helper.FieldToMap(application, fields)
			if err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			fieldMaps = append(fieldMaps, fieldMap)
		}

		if _, ok := c.GetQuery("pretty"); ok {
			c.IndentedJSON(200, fieldMaps)
		} else {
			c.JSON(200, fieldMaps)
		}
	}
}

func GetApplication(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.Application{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	application := models.Application{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Application{}, fields)

	if err := db.Select(queryFields).First(&application, id).Error; err != nil {
		content := gin.H{"error": "application with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(application, fields)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, fieldMap)
	} else {
		c.JSON(200, fieldMap)
	}
}

func GetApplicationNetwork(c *gin.Context) {
	network := "mainnet"
	c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")

	slugId := models.NormalizeSlug(c.PostForm("application_slug"))
	if slugId == "" {
		slugId = c.Params.ByName("id") // try reading from the url in a restful manner
	}

	db := dbpkg.DBInstance(c)
	app := models.Application{}
	if err := db.Where("slug = ?", slugId).Find(&app).Error; err == nil {
		if app.DefaultChain == "loom" {
			network = "loom"
		}
	}
	c.JSON(200, gin.H{"network": network})
}

func CreateApplication(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	application := models.Application{LastDeployed: time.Now()}

	if err := c.Bind(&application); err != nil {
		switch c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON) {
		case gin.MIMEHTML:
			c.HTML(http.StatusOK, "dashboard/new", gin.H{
				"loggedIn":    true,
				"errors":      err,
				"application": application,
			})
		case gin.MIMEJSON:
			c.JSON(400, gin.H{"error": err.Error()})
		}
		return
	}

	accountID := middleware.GetLoggedInUser(c) //TODO get this to work in loggedin scope
	application.AccountID = accountID
	if err := db.Create(&application).Error; err != nil {
		switch c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON) {
		case gin.MIMEHTML:
			c.HTML(http.StatusOK, "dashboard/new", gin.H{
				"loggedIn":    true,
				"errors":      err,
				"application": application,
			})
		case gin.MIMEJSON:
			c.JSON(400, gin.H{"error": err.Error()})
		}

		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	asdf := c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON)
	fmt.Printf("NegotiateFormat-%s\n", asdf)
	switch c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON) {
	case gin.MIMEHTML:
		c.Redirect(301, fmt.Sprintf("/dashboard/%s", application.Slug))
	case gin.MIMEJSON:
		c.JSON(201, application)
	}
}

func UpdateApplication(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	id := c.Params.ByName("id")
	application := models.Application{}

	if db.First(&application, id).Error != nil {
		content := gin.H{"error": "application with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&application); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	accountID := middleware.GetLoggedInUser(c) //TODO get this to work in loggedin scope
	application.AccountID = accountID
	if err := db.Save(&application).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	asdf := c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON)
	fmt.Printf("NegotiateFormat-%s\n", asdf)
	switch c.NegotiateFormat(gin.MIMEHTML, gin.MIMEJSON) {
	case gin.MIMEHTML:
		c.Redirect(301, fmt.Sprintf("/dashboard/%s#settings", application.Slug))
	case gin.MIMEJSON:
		c.JSON(201, application)
	}
}

func DeleteApplication(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	id := c.Params.ByName("id")
	application := models.Application{}

	if db.First(&application, id).Error != nil {
		content := gin.H{"error": "application with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := db.Delete(&application).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
