// models/appkey.go
package models

type Appkey struct {
	ID      uint     `gorm:"primary_key;AUTO_INCREMENT" json:"id" form:"id"`
	Key     string   `json:"key" form:"key"`
	Account *Account `json:"account form:"account`
}
