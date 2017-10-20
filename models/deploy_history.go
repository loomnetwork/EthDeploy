// models/beat_users.go
package models

type DeployHistory struct {
	//gorm.Model
	AccountID     uint `json:"account_id" form:"account_id"`
	ApplicationID uint `json:"application_id" form:"application_id"`
	Version       uint `json:"version" form:"version"`
}
