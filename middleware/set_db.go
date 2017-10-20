package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
)

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func SetConfigtoContext(conf *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(config.DefaultKey, conf)
		c.Next()
	}
}
