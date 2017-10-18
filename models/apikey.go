// models/apikey.go
package models

import (
	"github.com/jinzhu/gorm"
)

type Apikey struct {
	gorm.Model
	Key       string   `json:"key" form:"key"`
	AccountID uint     `json:"account_id" form:"account_id"`
	Account   *Account `json:"account form:"account`
}
