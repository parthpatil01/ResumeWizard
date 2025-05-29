#!/bin/bash
yum update -y

# Install Docker
amazon-linux-extras install docker -y
service docker start
usermod -a -G docker ec2-user
systemctl enable docker

# Pull and run your frontend Docker image
docker run -d \
  -p 80:80 \
  -e VITE_API_URL=${backend_alb_url} \
  --restart always \
  ${docker_image}

# Install CloudWatch agent for monitoring
yum install -y amazon-cloudwatch-agent