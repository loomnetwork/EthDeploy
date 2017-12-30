package middleware

import (
	"fmt"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/models"
)

func SetDBtoContext(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}

func GetLoggedInScope(c *gin.Context) *gorm.DB {
	session := sessions.Default(c)
	accountID := session.Get("account_id")

	db := dbpkg.DBInstance(c)
	return db.Where("account_id = ?", accountID)

}
func GetAccountFromApiKey(c *gin.Context) string {
	apikeyheader := c.GetHeader("Loom-Api-Key")
	if apikeyheader != "" {

		db := dbpkg.DBInstance(c)
		apikey := &models.Apikey{}
		if err := db.Where("`key` = ?", apikeyheader).Find(&apikey).Error; err == nil {

			return strconv.Itoa(int(apikey.AccountID))
			//session doesn't work for api clients, maybe revisit that
			//			session.Set("account_id", string(apikey.AccountID))
		}
	}
	return ""
}

func CheckBetaAccess(accountID string, c *gin.Context) bool {
	cfg := config.Default(c)
	if !cfg.InviteOnlyMode {
		return true
	}

	db := dbpkg.DBInstance(c)
	account := &models.Account{}
	if err := db.Find(&account, accountID).Error; err != nil {
		return false
	}
	fmt.Printf("found account-%v", account)
	betaUser := &models.BetaUser{}
	if err := db.Where("`email` = ?", account.Email).Find(&betaUser).Error; err != nil {
		return false
	}
	fmt.Printf("found betaUser-%v", betaUser)

	return true
}

//TODO: this is convoluted refactor
func GetLoggedInUser(c *gin.Context) uint {
	session := sessions.Default(c)
	accountID := session.Get("account_id")

	res, err := strconv.Atoi(accountID.(string))
	if err != nil {
		panic(fmt.Sprintf("impossible-%v", accountID))
	}

	return uint(res)

}

func SetConfigtoContext(conf *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(config.DefaultKey, conf)
		c.Next()
	}
}
