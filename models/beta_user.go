// models/beat_users.go
package models

import "github.com/jinzhu/gorm"

type BetaUser struct {
	gorm.Model
	Email string `json:"email" form:"email"`
}
