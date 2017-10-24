package main

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ianschenck/envflag"
	"github.com/jinzhu/gorm"
	"github.com/loomnetwork/dashboard/config"
	"github.com/loomnetwork/dashboard/db"
	"github.com/loomnetwork/dashboard/middleware"
	log "github.com/sirupsen/logrus"
	//	"rsc.io/letsencrypt"
)

//Two headers
//Loom API KEY -> loom_api_key
//Loom Application slug -> loom_application_slug

func LoggedInMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		/*
			if accountID != nil && len(accountID.(string)) > 0 {
				log.WithField("account_id", accountID).Debug("[AuthFilter] User is logged in")

				//do something here
				c.Next()
			} else {
				c.Abort()
				log.Debug("[AuthFilter]No user is logged in, redirect to login")
				c.Redirect(302, "/login")
			}
		*/
		//Read an api key header if not send a 500 with an error code
		c.Abort()
		c.JSON(401, gin.H{"error": "Invalid or missing API Key"})
	}
}

func Web3CatchAll(c *gin.Context) {
}

func OptionsCatchAll(c *gin.Context) {
	/*
			 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
		     "Access-Control-Allow-Origin": "*",
		     "Access-Control-Allow-Methods": "*"



			 headers["Content-Type"] = "text/plain"
	*/
	c.HTML(200, "", nil)
}

func LoomAccounts(c *gin.Context) {
}

func routerInitialize(r *gin.Engine, c *config.Config) {
	if c.DemoMode == false {
		//TODO how can we group calls together?
		r.Use(LoggedInMiddleWare())
	}

	//We prefix our apis with underscore so there is no conflict with the Web3 RPC APOs
	r.POST("/_loom/accounts", LoomAccounts) //Returns accounts and private keys for this test network

	// Web3 RPCs
	api := r.Group("")
	{
		api.PUT("/", Web3CatchAll)
	}
}

func setup(db *gorm.DB, c *config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.SetDBtoContext(db))
	r.Use(middleware.SetConfigtoContext(c))
	routerInitialize(r, c)
	return r
}

func main() {
	demo := envflag.Bool("DEMO_MODE", true, "Enable demo mode for investors, or local development")
	level := envflag.String("LOG_LEVEL", "debug", "Log level minimum to output. Info/Debug/Warn")
	loomEnv := envflag.String("LOOM_ENV", "devlopment", "devlopment/staging/production")
	bindAddr := envflag.String("BIND_ADDR", ":8081", "What address to bind the main webserver to")

	envflag.Parse()

	if *demo == true {
		log.Info("You are running in demo mode, don't use this in production. As it skips authentication and other features")
	}

	// Check for log level specified by environment variable
	if logLevel := strings.ToLower(*level); logLevel != "" {
		// Check for level, default to info on bad level
		level, err := log.ParseLevel(logLevel)
		if err != nil {
			log.WithField("level", logLevel).Error("invalid log level, defaulting to 'info'")
			level = log.InfoLevel
		}

		// Set log level
		log.SetLevel(log.Level(level))
	}

	config := &config.Config{
		DemoMode: *demo,
		Env:      *loomEnv,
	}

	database := db.Connect()
	s := setup(database, config)

	s.Run(*bindAddr)
	/*
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(w, "Hello, TLS!\n")
		})
		var m letsencrypt.Manager
		if err := m.CacheFile("letsencrypt.cache"); err != nil {
			log.Fatal(err)
		}
		log.Fatal(m.Serve())
	*/
}

/*
   var headers = {
     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "*"
   };

   switch (method) {
     case "OPTIONS":
       headers["Content-Type"] = "text/plain"
       response.writeHead(200, headers);
       response.end("");
       break;
     case "POST":
       //console.log("Request coming in:", body);

       var payload;
       try {
         payload = JSON.parse(body);
       } catch(e) {
         headers["Content-Type"] = "text/plain";
         response.writeHead(400, headers);
         response.end("400 Bad Request");
         return;
       }

       // Log messages that come into the TestRPC via http
       if (payload instanceof Array) {
         // Batch request
         for (var i = 0; i < payload.length; i++) {
           var item = payload[i];
           logger.log(item.method);
         }
       } else {
         logger.log(payload.method);
       }

       provider.sendAsync(payload, function(err, result) {
         headers["Content-Type"] = "application/json";
         response.writeHead(200, headers);
         response.end(JSON.stringify(result));
       });

       break;
     default:
       response.writeHead(400, {
         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "*",
         "Content-Type": "text/plain"
       });
       response.end("400 Bad Request");
       break;
*/
