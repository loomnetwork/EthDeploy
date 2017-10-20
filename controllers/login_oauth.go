package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	dbpkg "github.com/loomnetwork/dashboard/db"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/linkedin"
)

func Dashboard(c *gin.Context) {
	fmt.Printf("In dashboard\n")
	c.HTML(http.StatusOK, "dashboard/dashboard", gin.H{
		"loggedIn": true,
	})
}

func Login(c *gin.Context) {
	fmt.Printf("In Login\n")
	c.HTML(http.StatusOK, "login/login", gin.H{})
}

func RedirectOauth(c *gin.Context) {
	clientID := "86zs2w1g2j8hfu"
	clientSecret := "mBd0gDHQdEwSRgt8"

	//linkedin reqs
	scopes := []string{"r_emailaddress", "r_basicprofile"} // []string{"account"},

	conf := &oauth2.Config{
		ClientID:     clientID,     // also known as slient key sometimes
		ClientSecret: clientSecret, // also known as secret key
		Scopes:       scopes,
		Endpoint:     linkedin.Endpoint,
	}

	// Redirect user to consent page to ask for permission
	// for the scopes specified above.
	conf.RedirectURL = fmt.Sprintf("http://127.0.0.1:8080/oauth/callback")
	conf.AuthCodeURL("state", oauth2.AccessTypeOffline)

	sslcli := &http.Client{}
	ctx := context.WithValue(context.Background(), oauth2.HTTPClient, sslcli)

	code := c.Query("code")
	email := ""
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
		email = extractLinkedInEmail(client, "")
		fmt.Printf("got email %s", email)
	}

	//redirect to dashboard
	if len(email) > 0 {
		_, accountID := getOrCreateApiKey(c, email)
		//Set Cookie for api key
		session := sessions.Default(c)

		session.Set("account_id", accountID)
		session.Save()
	}

	c.Redirect(302, "/")
}

//Api calls
func LoginOauth(c *gin.Context) {
	la := &LoginAuth{ApiKey: ""}

	auth := c.GetHeader("Authorization")

	email := extractLinkedInEmail(&http.Client{}, auth)

	la.Email = email
	if len(email) > 0 {
		la.ApiKey, _ = getOrCreateApiKey(c, email)
	}

	//			c.JSON(400, gin.H{"error": err.Error()})
	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, la)
	} else {
		c.JSON(200, la)
	}
}

func getOrCreateApiKey(c *gin.Context, email string) (string, string) {
	var account models.Account
	db := dbpkg.DBInstance(c)

	if err := db.First(&account, "email = ?", email).Error; err != nil {
		log.WithField("error", err).Warn("Failed retrieving user, will try and create")

		account := models.Account{}
		account.Email = email

		if err := db.Create(&account).Error; err != nil {
			log.WithField("error", err).Warn("Failed creating account")
			return "", ""
		}
	}
	fmt.Printf("almost\n")
	apikey := &models.Apikey{}
	// Ok we have an account, see if they have an api key first
	if err := db.First(&apikey, "account_id = ?", account.ID).Error; err != nil {
		log.WithField("error", err).Info("Failed retrieving apikey, will try and create")

		apikey.AccountID = apikey.ID
		apikey.Key = uuid.NewV4().String()

		if err := db.Create(&apikey).Error; err != nil {
			log.WithField("error", err).Info("Failed creating apikey")
			return "", ""
		}
	}
	acid := fmt.Sprintf("%d", apikey.AccountID) //TODO switch to using a GUID for IDs
	return apikey.Key, acid
}

/*
{"emailAddress": "hyper@hyperworks.nu"}
*/
type LinkedinEmail struct {
	Email string `json:"emailAddress,omitempty" form:"id"`
}
type LoginAuth struct {
	Email  string `json:"email,omitempty" form:"id"`
	ApiKey string `json:"apikey,omitempty" form:"id"`
}

func extractLinkedInEmail(c *http.Client, auth string) string {
	peopleURL := "https://api.linkedin.com/v1/people/~:(email-address)?format=json"

	req, err := http.NewRequest("GET", peopleURL, nil)
	if auth != "" {
		req.Header.Add("Authorization", auth)
	}
	resp, err := c.Do(req)

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
