package db

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/loomnetwork/dashboard/models"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/serenize/snaker"
)

func Connect() *gorm.DB {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbPass := os.Getenv("DATABASE_PASS")
		dbURL = fmt.Sprintf("root:%s@tcp(127.0.0.1:3306)/loom?charset=utf8", dbPass)
	}

	db, err := gorm.Open("mysql", dbURL)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}

	db.LogMode(false)

	if gin.IsDebugging() {
		db.LogMode(true)
	}

	if os.Getenv("AUTOMIGRATE") == "1" {
		db.AutoMigrate(
			&models.Account{},
			&models.Appkey{},
			&models.Application{},
		)
	}

	return db
}

func DBInstance(c *gin.Context) *gorm.DB {
	return c.MustGet("DB").(*gorm.DB)
}

func (self *Parameter) SetPreloads(db *gorm.DB) *gorm.DB {
	if self.Preloads == "" {
		return db
	}

	for _, preload := range strings.Split(self.Preloads, ",") {
		var a []string

		for _, s := range strings.Split(preload, ".") {
			a = append(a, snaker.SnakeToCamel(s))
		}

		db = db.Preload(strings.Join(a, "."))
	}

	return db
}
