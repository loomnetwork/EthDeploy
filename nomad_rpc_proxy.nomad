
job "example" {
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
      config {
        image = "loomnetwork/rpc_gateway:8ad8cae"
        port_map {
          rpc = 8080
        }
      }
      env {
        SPAWN_NETWORK = "node /src/build/cli.node.js --acctKeys data.json"
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 256 # 256MB
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