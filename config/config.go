package config

type Config struct {
	DemoMode bool //Disables Auth and enables all UI
	BetaMode bool //Requires users to be whitelisted before creating an account
}
