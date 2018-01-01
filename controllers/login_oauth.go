package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/loomnetwork/dashboard/config"
	dbpkg "github.com/loomnetwork/dashboard/db"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/loomnetwork/dashboard/models"
	uuid "github.com/satori/go.uuid"
	log "github.com/sirupsen/logrus"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/linkedin"
)

var (
	PROD_GITHUB_WEB_KEY    = "a6abecccefa53842aba4"
	PROD_GITHUB_WEB_SECRET = "1ee2a16122358308c556a08fbb487a4d1b7b4473"
	DEV_GITHUB_KEY         = "8d316b5c2fa614ecffef"
	DEV_GITHUB_SECRET      = "161f2858cde208b57e492bedc16b09fee31716e6"
)

func Login(c *gin.Context) {
	cfg := config.Default(c)
	githubClientID := DEV_GITHUB_KEY
	if cfg.Env == "production" {
		githubClientID = PROD_GITHUB_WEB_KEY
	}

	c.HTML(http.StatusOK, "login/login", gin.H{
		"serverbasepath": cfg.ServerHost,
		"githubClientID": githubClientID,
	})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.Redirect(302, "/")
}

func RedirectOauthGithub(c *gin.Context) {
	provider := "github"
	clientID := DEV_GITHUB_KEY
	clientSecret := DEV_GITHUB_SECRET

	cfg := config.Default(c)
	if cfg.Env == "production" {
		clientID = PROD_GITHUB_WEB_KEY
		clientSecret = PROD_GITHUB_WEB_SECRET
	}

	scopes := []string{"user:email"}

	conf := &oauth2.Config{
		ClientID:     clientID,     // also known as slient key sometimes
		ClientSecret: clientSecret, // also known as secret key
		Scopes:       scopes,
		Endpoint:     github.Endpoint,
	}
	redirectOauth(c, conf, provider)
}

func RedirectOauthLinkedIn(c *gin.Context) {
	provider := "linkedin"
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
	redirectOauth(c, conf, provider)
}

func redirectOauth(c *gin.Context, conf *oauth2.Config, provider string) {
	// Redirect user to consent page to ask for permission
	// for the scopes specified above.
	configuration := config.Default(c)
	redirectURL := fmt.Sprintf("%s/oauth/callback_%s", configuration.ServerHost, provider)
	conf.RedirectURL = redirectURL
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
		if provider == "linkedin" {
			email = extractLinkedInEmail(client, "")
			fmt.Printf("got email %s", email)
		} else if provider == "github" {
			email = extractGithubEmail(client, "")
			fmt.Printf("got email %s", email)
		} else {
			log.WithField("provider", provider).Error("unknown provider")
		}
	}

	//redirect to dashboard
	if len(email) > 0 {
		_, accountID := getOrCreateApiKey(c, email)
		//Set Cookie for api key
		session := sessions.Default(c)
		log.WithField("account_id", session.Get("account_id")).Info("previous user")

		log.WithField("account_id", accountID).Info("logging user in")
		session.Set("account_id", accountID)
		session.Save()
	}

	c.Redirect(302, "/")
}

//Api calls
func LoginOauth(c *gin.Context) {
	la := &LoginAuth{ApiKey: ""}

	auth := c.GetHeader("Authorization")

	email := ""
	provider := c.GetHeader("Loom-Oauth-Provider")

	if provider == "linkedin" {
		email = extractLinkedInEmail(&http.Client{}, auth)
	} else if provider == "github" {
		email = extractGithubEmail(&http.Client{}, auth)
	}

	la.Email = email
	if len(email) > 0 {
		la.ApiKey, _ = getOrCreateApiKey(c, email)
	}

	//right now errors give blank apikey, maybe we should return error instead
	//			c.JSON(400, gin.H{"error": err.Error()})
	if _, ok := c.GetQuery("pretty"); ok {
		c.IndentedJSON(200, la)
	} else {
		c.JSON(200, la)
	}
}

func getOrCreateApiKey(c *gin.Context, email string) (string, string) {
	account := models.Account{}
	db := dbpkg.DBInstance(c)

	if err := db.First(&account, "email = ?", email).Error; err != nil {
		log.WithField("error", err).Warn("Failed retrieving user, will try and create")

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

		apikey.AccountID = account.ID
		apikey.Key = uuid.NewV4().String()

		if err := db.Create(&apikey).Error; err != nil {
			log.WithField("error", err).Info("Failed creating apikey")
			return "", ""
		}
	}
	acid := fmt.Sprintf("%d", account.ID) //TODO switch to using a GUID for IDs
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
	Email    string `json:"email,omitempty"`
	Verified bool   `json:"verified,omitempty""`
	Primary  bool   `json:"primary,omitempty""`
}

func extractGithubEmail(c *http.Client, auth string) string {
	githubEmailURL := "https://api.github.com/user/emails"
	req, err := http.NewRequest("GET", githubEmailURL, nil)
	if auth != "" {
		req.Header.Add("Authorization", auth)
	}
	resp, err := c.Do(req)
	if err != nil {
		fmt.Println("error:", err)
		return ""
	}
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
		for _, email := range gemails {
			if email.Verified == true && email.Primary == true {
				return email.Email
			}
		}
	}

	return ""
}
