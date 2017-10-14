package controllers

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"golang.org/x/oauth2"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	c.HTML(http.StatusOK, "index.tmpl", gin.H{
		"title": "Loom Network Login",
	})
}

func RedirectOauth(c *gin.Context) {
	clientID := "86zs2w1g2j8hfu"
	clientSecret := "mBd0gDHQdEwSRgt8"

	authURL := "https://www.linkedin.com/uas/oauth2/authorization"
	tokenURL := "https://www.linkedin.com/uas/oauth2/accessToken"
	scopes := []string{"r_emailaddress", "r_basicprofile"} // []string{"account"},

	conf := &oauth2.Config{
		ClientID:     clientID,     // also known as slient key sometimes
		ClientSecret: clientSecret, // also known as secret key
		Scopes:       scopes,
		Endpoint: oauth2.Endpoint{
			AuthURL:  authURL,
			TokenURL: tokenURL,
		},
	}

	// Redirect user to consent page to ask for permission
	// for the scopes specified above.
	conf.RedirectURL = fmt.Sprintf("http://127.0.0.1:8080/oauth/callback")
	conf.AuthCodeURL("state", oauth2.AccessTypeOffline)

	// add transport for self-signed certificate to context
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: false},
	}
	sslcli := &http.Client{Transport: tr}
	ctx := context.WithValue(context.Background(), oauth2.HTTPClient, sslcli)

	code := c.Query("code")
	apikey := ""
	if code != "" {
		// Exchange will do the handshake to retrieve the initial access token.
		tok, err := conf.Exchange(ctx, code)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("got client %v", tok)

		// The HTTP Client returned by conf.Client will refresh the token as necessary.
		client := conf.Client(ctx, tok)
		fmt.Printf("got client %v", client)

		//TODO figure out which provider it is?
		email := extractLinkedInEmail(client)
		fmt.Printf("got email %s", email)
	}

	//Set Cookie for api key

	//redirect to dashboard

	c.HTML(http.StatusOK, "dashboard.tmpl", gin.H{
		"title":  "Dashboard",
		"apikey": apikey,
	})
}

//Api calls
func LoginOauth(c *gin.Context) {
	//	r := c.Request
	//	w := c.Writer

}

/*
{"emailAddress": "hyper@hyperworks.nu"}
*/
type LinkedinEmail struct {
	Email string `json:"emailAddress,omitempty" form:"id"`
}

func extractLinkedInEmail(c *http.Client) string {
	peopleURL := "https://api.linkedin.com/v1/people/~:(email-address)?format=json"
	resp, err := c.Get(peopleURL)

	defer resp.Body.Close()

	if resp.StatusCode != 200 { // OK
		fmt.Printf("bad response code %d\n", resp.StatusCode)
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	bodyString := string(bodyBytes)
	fmt.Printf(bodyString)

	var email LinkedinEmail
	err = json.Unmarshal(bodyBytes, &email)
	if err != nil {
		fmt.Println("error:", err)
		return ""
	}

	return email.Email
}

/*
[
  {
    "email": "octocat@github.com",
    "verified": true,
    "primary": true,
    "visibility": "public"
  }
]*/
type GithubEmail struct {
	Email    string `json:"email,omitempty" form:"id"`
	Verified uint   `json:"verified,omitempty" form:"id"`
}

func extractGithubEmail(c *http.Client) string {
	githubEmailURL := "https://api.github.com/user/emails"
	resp, err := c.Get(githubEmailURL)

	defer resp.Body.Close()

	if resp.StatusCode != 200 { // OK
		fmt.Printf("bad response code %d\n", resp.StatusCode)
	}
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	bodyString := string(bodyBytes)
	fmt.Printf(bodyString)

	var gemails []GithubEmail
	err = json.Unmarshal(bodyBytes, &gemails)
	if err != nil {
		fmt.Println("error:", err)
	}
	if len(gemails) > 0 {
		return gemails[0].Email
	}

	return ""
}
