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
		//Accounts shouldn't be enabled yet
		//		"accounts_url":         baseURL + "/accounts",
		//		"account_url":          baseURL + "/accounts/{id}",
		"apikeys_url":      baseURL + "/apikeys",
		"apikey_url":       baseURL + "/apikeys/{id}",
		"applications_url": baseURL + "/applications",
		"application_url":  baseURL + "/applications/{id}",
		"upload_url":       baseURL + "/upload",
		"login_oauth":      baseURL + "/login_oauth",
		// This needs to be only used internally
		//		"beta_users_url":       baseURL + "/beta_users",
		//		"beta_user_url":        baseURL + "/beta_users/{id}",
		"deploy_histories_url": baseURL + "/deploy_histories",
		"deploy_history_url":   baseURL + "/deploy_histories/{id}",
	}

	c.IndentedJSON(http.StatusOK, resources)
}
