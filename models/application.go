// models/apikey.go
package models

import (
	"strings"
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
	AccountID    uint      `json:"account_id" form:"account_id"`
}

func NormalizeSlug(slug string) string {
	return strings.Replace(slug, "_", "-", -1)
}
func (a *Application) BeforeSave() error {
	a.Slug = NormalizeSlug(a.Slug) //No dashes in nomad name
	//TODO validate other failures in the name
	return nil
}
