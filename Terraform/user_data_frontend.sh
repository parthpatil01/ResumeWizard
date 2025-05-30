#!/bin/bash
yum update -y

# Install Docker
amazon-linux-extras install docker -y
service docker start
usermod -a -G docker ec2-user
systemctl enable docker

# Install envsubst (part of gettext)
yum install -y gettext

# Pull and run your frontend Docker image
docker run -d \
  -p 80:80 \
  -e BACKEND_ALB_URL="${backend_alb_url}" \
  --restart always \
  ${docker_image}

# Install CloudWatch agent for monitoring
yum install -y amazon-cloudwatch-agent