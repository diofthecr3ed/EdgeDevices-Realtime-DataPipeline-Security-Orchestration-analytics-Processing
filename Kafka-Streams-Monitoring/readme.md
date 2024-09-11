# Installation and Setup Guide

This guide outlines the steps to install Docker, set up Zoonavigator, Kafka Manager, and Kafka-Monitor, and configure them to run as SystemD services.

## Install Docker

```bash
sudo yum install -y docker
sudo systemctl start docker.service
sudo usermod -a -G docker ec2-user
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
  
docker-compose -f zoonavigator.yml up -d

echo -e "[Unit]\nDescription=Docker Compose application service\nAfter=network.target\n\n[Service]\nType=oneshot\nRemainAfterExit=yes\nExecStart=/usr/local/bin/docker-compose -f /etc/docker/compose/%I/docker-compose.yml up -d\nExecStop=/usr/local/bin/docker-compose -f /etc/docker/compose/%I/docker-compose.yml down\n\n[Install]\nWantedBy=multi-user.target" | sudo tee /etc/systemd/system/docker-compose@.service

sudo mkdir -p /etc/docker/compose/zoonavigator/
echo -e "version: '3'\nservices:\n  zoonavigator:\n    image: zoonavigator/zoonavigator\n    ports:\n      - \"8080:8080\"" | sudo tee /etc/docker/compose/zoonavigator/docker-compose.yml
sudo systemctl start docker-compose@zoonavigator

docker-compose -f kafka-manager.yml up -d

sudo systemctl enable docker-compose@kafka-manager # automatically start at boot
sudo systemctl start docker-compose@kafka-manager

sudo yum install -y git
git clone https://github.com/linkedin/kafka-monitor.git
cd kafka-monitor
sudo yum install -y java-1.8.0-openjdk-devel
./gradlew jar
./bin/kafka-monitor-start.sh config/kafka-monitor.properties

echo -e "[Unit]\nDescription=Kafka Monitor Service\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/bin/bash -c 'cd /path/to/kafka-monitor && ./bin/kafka-monitor-start.sh config/kafka-monitor.properties'\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target" | sudo tee /etc/systemd/system/kafka-monitor.service

sudo systemctl status docker-compose@zoonavigator
sudo systemctl start docker-compose@kafka-manager
