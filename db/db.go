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
		dbHost := os.Getenv("DATABASE_HOST")
		dbUser := os.Getenv("DATABASE_USER")
		if len(dbHost) == 0 {
			dbHost = "127.0.0.1"
		}

		dbURL = fmt.Sprintf("%s:%s@tcp(%s:3306)/loom?charset=utf8&parseTime=true", dbUser, dbPass, dbHost)
		log.Printf("dbURL   %s   \n", dbURL)
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
			&models.Apikey{},
			&models.Application{},
			&models.BetaUser{},
			&models.DeployHistory{},
		)
	}

	return db
}

func DBInstance(c *gin.Context) *gorm.DB {
	return c.MustGet("DB").(*gorm.DB)
}
func AuthDBInstance(c *gin.Context) *gorm.DB {
	return c.MustGet("AUTHDB").(*gorm.DB)
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
