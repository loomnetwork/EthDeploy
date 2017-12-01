job "dashboard-web" {
  datacenters = ["dc1"]

  type = "service"

  update {
    max_parallel = 2
    min_healthy_time = "30s"
    healthy_deadline = "3m"
    auto_revert = true
    canary = 0
  }

  group "dashboard-web" {
    count = 1
    restart {
      attempts = 10
      interval = "5m"

      delay = "25s"
      mode = "delay"
    }

    ephemeral_disk {
      size = 300
    }

    task "dashboard" {
      driver = "docker"
      config {
        image = "loomnetwork/dashboard:REV_REPLACE"
        port_map {
          web = 8080
        }
      }
      env {
        AUTOMIGRATE = "1"
        DATABASE_PASS = "power2edit"
        GIN_MODE = "debug"
        DATABASE_HOST = "138.197.37.181"
        #TODO should probably have more then one?
        NOMAD_ADDR = "http://45.55.246.200:4646"
        BIND_ADDR = "8080"
        LOOM_ENV = "production"
        SERVER_HOST = "https://dashboard.loomx.io"
        DEMO_MODE = "false"
        BETA_MODE = "false"
        LOG_LEVEL = "debug"  
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 500 # 256MB
        network {
          mbits = 10
          port "web" {}
        }
      }

      service {
        name = "dashboard-web"
        tags = ["global", "traefik.tags=loomapp", "traefik.frontend.rule=Host:dashboard.loomx.io"]
        port = "web"
        check {
          name     = "alive"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}