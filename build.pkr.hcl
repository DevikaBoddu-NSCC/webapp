packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.1"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "googlecompute" "custom-image" {
  project_id          = "dev-csye6225-415809"
  source_image_family = "centos-stream-8"
  zone                = "us-east5-a"
  ssh_username        = "centos"
  ssh_timeout         = "10m"
}
// source "googlecompute" "custom-image" {
//   project_id   = "${var.project_id}"
//   source_image = "${var.source_image}"
//   zone         = "${var.zone}"
//   image_family = "${var.image_family}"
//   ssh_username = "${var.ssh_username}"
//   labels = {
//     "private" = "true"
//   }
// }

build {
  sources = ["source.googlecompute.custom-image"]

  provisioner "shell" {
    inline = [
      // "sudo yum update -y",
      // "sudo dnf install -y unzip",
      // "sudo dnf install -y mysql-server",
      // "sudo systemctl start mysqld",
      // "sudo systemctl enable mysqld",
      // "sudo mysql -u root -p -e \"ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin@12345'; FLUSH PRIVILEGES;\"",
      "sudo dnf module enable -y nodejs:20",
      "sudo dnf install -y npm",
      "sudo npm install -g npm@10.5.0",
      "sudo mkdir -p /home/centos/webapp/dist",
      "sudo chmod -R 777 /home/centos/webapp",
    ]
  }

  provisioner "file" {
    source      = fileexists("dist/bundle.js") ? "dist/bundle.js" : "/"
    destination = "/home/centos/webapp/dist/bundle.js"
  }

  provisioner "file" {
    source      = fileexists(".env") ? ".env" : "/"
    destination = "/home/centos/webapp/.env"
  }

  provisioner "file" {
    source      = "./package.json"
    destination = "/home/centos/webapp/package.json"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "file" {
    source      = "./logging_config.yaml" # Path to your logging configuration file
    destination = "/tmp/logging_config.yaml"
  }

  provisioner "shell" {
    inline = [
      "cd ~/webapp && npm i",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo mkdir -p /opt/csye6225",
      "sudo mv ~/webapp /opt/csye6225/",
      "sudo mv /tmp/webapp.service /etc/systemd/system/",
      "sudo chown -R csye6225:csye6225 /opt/csye6225/",
      "sudo chmod 755 /opt/csye6225/",
      #logs
      "sudo mkdir -p /var/log/webapp",
      "sudo chown -R csye6225:csye6225 /var/log/webapp/",
      "sudo chmod 755 /var/log/webapp/",
      #systemd-services
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp",
      "sudo systemctl start webapp",
      #ops-agent
      "curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh",
      "sudo bash add-google-cloud-ops-agent-repo.sh --also-install",
      "sudo systemctl enable --now google-cloud-ops-agent",
      #config
      "sudo mv /tmp/logging_config.yaml /etc/google-cloud-ops-agent/config.yaml",
      "sudo systemctl restart google-cloud-ops-agent"

    ]
  }
}

