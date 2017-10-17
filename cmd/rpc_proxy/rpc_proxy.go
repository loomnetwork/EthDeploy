package main

import (
	"fmt"
	"log"
	"net/http"

	"rsc.io/letsencrypt"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, TLS!\n")
	})
	var m letsencrypt.Manager
	if err := m.CacheFile("letsencrypt.cache"); err != nil {
		log.Fatal(err)
	}
	log.Fatal(m.Serve())
}
