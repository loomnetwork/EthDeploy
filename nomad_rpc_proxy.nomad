
job "example" {
  datacenters = ["dc1"]

  type = "service"

  update {
    max_parallel = 1
    
    min_healthy_time = "10s"
    
    healthy_deadline = "3m"
    
    auto_revert = false
    
    canary = 0
  }

  group "loom" {
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

    task "rpc_gateway" {
      driver = "docker"
      config {
        image = "loomnetwork/rpc_gateway:70dc654"
        port_map {
          rpc = 8081
        }
      }
      env {
          "SPAWN_NETWORK" = "node /src/build/cli.node.js"
          "APP_ZIP_FILE" = "do://uploads/a4200d60-8817-44a5-92a0-5fe6de44e563.zip"
          "DEMO_MODE" = "false"
          "PRIVATE_KEY_JSON_PATH" = "data.json"
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 500 # 256MB
        network {
          mbits = 10
          port "rpc" {}
        }
      }

      service {
        name = "loomapp-rpc"
        tags = ["global", "loomapp"]
        port = "rpc"
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