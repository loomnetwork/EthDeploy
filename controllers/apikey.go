package controllers

import (
	"encoding/json"
	"net/http"

	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/helper"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/models"
	"github.com/loomnetwork/dashboard/version"

	"github.com/gin-gonic/gin"
)

func GetApikeys(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb := middleware.GetLoggedInScope(c)

	parameter, err := dbpkg.NewParameter(c, models.Apikey{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb, err = parameter.Paginate(authDb)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb = parameter.SetPreloads(authDb)
	authDb = parameter.SortRecords(authDb)
	authDb = parameter.FilterFields(authDb)
	apikeys := []models.Apikey{}
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Apikey{}, fields)

	if err := authDb.Where(queryFields).Find(&apikeys).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	index := 0

	if len(apikeys) > 0 {
		index = int(apikeys[len(apikeys)-1].ID)
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

		for _, apikey := range apikeys {
			fieldMap, err := helper.FieldToMap(apikey, fields)
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

		for _, apikey := range apikeys {
			fieldMap, err := helper.FieldToMap(apikey, fields)
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

func GetApikey(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.Apikey{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb = parameter.SetPreloads(authDb)
	apikey := models.Apikey{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.Apikey{}, fields)

	if err := authDb.Select(queryFields).First(&apikey, id).Error; err != nil {
		content := gin.H{"error": "apikey with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(apikey, fields)
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

func CreateApikey(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb := middleware.GetLoggedInScope(c)
	accountID := middleware.GetLoggedInUser(c) //TODO get this to work in loggedin scope
	apikey := models.Apikey{}

	if err := c.Bind(&apikey); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	apikey.AccountID = accountID

	if err := authDb.Create(&apikey).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(201, apikey)
}

func UpdateApikey(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb := middleware.GetLoggedInScope(c)
	id := c.Params.ByName("id")
	apikey := models.Apikey{}

	if authDb.First(&apikey, id).Error != nil {
		content := gin.H{"error": "apikey with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := c.Bind(&apikey); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	accountID := middleware.GetLoggedInUser(c) //TODO get this to work in loggedin scope
	apikey.AccountID = accountID
	if err := authDb.Save(&apikey).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.JSON(200, apikey)
}

func DeleteApikey(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	authDb := middleware.GetLoggedInScope(c)
	id := c.Params.ByName("id")
	apikey := models.Apikey{}

	if authDb.First(&apikey, id).Error != nil {
		content := gin.H{"error": "apikey with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	if err := authDb.Delete(&apikey).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if version.Range("1.0.0", "<=", ver) && version.Range(ver, "<", "2.0.0") {
		// conditional branch by version.
		// 1.0.0 <= this version < 2.0.0 !!
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
