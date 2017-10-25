package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"

	dbpkg "github.com/loomnetwork/dashboard/db"
	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
)

func UploadApplication(c *gin.Context) {
	r := c.Request
	w := c.Writer

	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile("uploadfile")
	if err != nil {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}
	defer file.Close()
	fmt.Fprintf(w, "%v", handler.Header)
	f, err := os.OpenFile("./upload_tmp/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	// create new version
	db := dbpkg.DBInstance(c)
	deployHistory := models.DeployHistory{
		BundleName: handler.Filename,
	}

	if err := db.Create(&deployHistory).Error; err != nil {
		log.WithField("error", err).Warn("Error when storing new version")
	}
}
