package controllers

import (
	"encoding/json"

	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/helper"
	"github.com/loomnetwork/dashboard/middleware"
	"github.com/loomnetwork/dashboard/models"
	"github.com/loomnetwork/dashboard/version"

	"github.com/gin-gonic/gin"
)

func GetDeployHistories(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.DeployHistory{})
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
	deployHistories := []models.DeployHistory{}
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.DeployHistory{}, fields)

	if err := db.Select(queryFields).Find(&deployHistories).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	index := 0

	if len(deployHistories) > 0 {
		index = int(deployHistories[len(deployHistories)-1].ID)
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

		for _, deployHistory := range deployHistories {
			fieldMap, err := helper.FieldToMap(deployHistory, fields)
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

		for _, deployHistory := range deployHistories {
			fieldMap, err := helper.FieldToMap(deployHistory, fields)
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

func GetDeployHistory(c *gin.Context) {
	ver, err := version.New(c)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := middleware.GetLoggedInScope(c)
	parameter, err := dbpkg.NewParameter(c, models.DeployHistory{})
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db = parameter.SetPreloads(db)
	deployHistory := models.DeployHistory{}
	id := c.Params.ByName("id")
	fields := helper.ParseFields(c.DefaultQuery("fields", "*"))
	queryFields := helper.QueryFields(models.DeployHistory{}, fields)

	if err := db.Select(queryFields).First(&deployHistory, id).Error; err != nil {
		content := gin.H{"error": "deploy_history with id#" + id + " not found"}
		c.JSON(404, content)
		return
	}

	fieldMap, err := helper.FieldToMap(deployHistory, fields)
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

//Users can't modify a deploy history
/*
func CreateDeployHistory(c *gin.Context) {
func UpdateDeployHistory(c *gin.Context) {
func DeleteDeployHistory(c *gin.Context) {
*/
