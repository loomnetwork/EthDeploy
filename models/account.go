// models/account.go
package models

import "github.com/jinzhu/gorm"

type Account struct {
	gorm.Model
	Name      string `json:"name" form:"name"`
	Email     string `json:"email" form:"email"`
	Provider  string `json:"provider" form:"provider"`
	AuthToken string `json:"auth_token" form:"auth_token"`
}
