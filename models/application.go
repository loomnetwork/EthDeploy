// models/appkey.go
package models

type Application struct {
	ID      uint     `gorm:"primary_key;AUTO_INCREMENT" json:"id" form:"id"`
	Name    string   `json:"name" form:"name"`
	Slug    string   `json:"slug" form:"slug"`
	Status  string   `json:"status" form:"status"`
	Account *Account `json:"account form:"account`
}
