package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func APIEndpoints(c *gin.Context) {
	reqScheme := "http"

	if c.Request.TLS != nil {
		reqScheme = "https"
	}

	reqHost := c.Request.Host
	baseURL := fmt.Sprintf("%s://%s", reqScheme, reqHost)

	resources := map[string]string{
		"accounts_url":     baseURL + "/accounts",
		"account_url":      baseURL + "/accounts/{id}",
		"appkeys_url":      baseURL + "/appkeys",
		"appkey_url":       baseURL + "/appkeys/{id}",
		"applications_url": baseURL + "/applications",
		"application_url":  baseURL + "/applications/{id}",
	}

	c.IndentedJSON(http.StatusOK, resources)
}
