// models/account.go
package models

import "time"

type Account struct {
	ID        uint       `gorm:"primary_key;AUTO_INCREMENT" json:"id" form:"id"`
	Name      string     `json:"name" form:"name"`
	Email     string     `json:"email" form:"email"`
	Provider  string     `json:"provider" form:"provider"`
	AuthToken string     `json:"auth_token" form:"auth_token"`
	CreatedAt *time.Time `json:"created_at" form:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" form:"updated_at"`
}
