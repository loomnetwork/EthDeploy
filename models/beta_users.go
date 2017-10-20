// models/beat_users.go
package models

type BetaUsers struct {
	//gorm.Model
	Email string `json:"email" form:"email"`
}
