// models/account.go
package models

import "time"

type Account struct {
	ID        uint       `gorm:"primary_key;AUTO_INCREMENT" json:"id" form:"id"`
	Name      string     `json:"name" form:"name"`
	Emails    string     `json:"emails" form:"emails"`
	CreatedAt *time.Time `json:"created_at" form:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" form:"updated_at"`
}
