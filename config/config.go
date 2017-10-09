package config

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/user"
	"path"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Apikey   string `yaml:"apikey"`
	HostName string `yaml:"hostname"`
}

func findOrCreateConfigFile() string {
	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	configFile := path.Join(usr.HomeDir, ".loom")

	return configFile
}

func ReadConfig() *Config {
	filename := findOrCreateConfigFile()
	b, err := ioutil.ReadFile(filename) // just pass the file name
	if err != nil {
		//If we dont have a file its fine, we can just ignore
		//		fmt.Print(err)
	}

	t := &Config{}

	err = yaml.Unmarshal([]byte(b), &t)
	if err != nil {
		log.Fatalf("error parsing .loom config file: %v", err)
	}

	return t
}

func WriteConfig(apikey string) {
	filename := findOrCreateConfigFile()
	b, err := ioutil.ReadFile(filename) // just pass the file name
	if err != nil {
		fmt.Print(err)
	}

	t := Config{Apikey: apikey}

	err = yaml.Unmarshal([]byte(b), &t)

	d, err := yaml.Marshal(&t)
	if err != nil {
		log.Fatalf("failed creating config file: %v", err)
	}

	err = ioutil.WriteFile(filename, d, os.FileMode(0644))
	if err != nil {
		log.Fatalf("failed saving config file: %v", err)
	}
}
