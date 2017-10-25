// models/apikey.go
package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Application struct {
	gorm.Model
	Name         string    `json:"name" form:"name"`
	Slug         string    `json:"slug" form:"slug"`
	Status       string    `json:"status" form:"status"`
	Account      *Account  `json:"account form:"account`
	LastDeployed time.Time `json:"lastdeployed" form:"lastdeployed"`
	DefaultChain string    `json:"default_chain" form:"default_chain" gorm:"default:'loom'"`
}
