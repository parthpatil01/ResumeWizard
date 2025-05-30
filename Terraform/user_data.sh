#!/bin/bash
yum update -y

# Docker setup
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Pull and run Ollama
sudo docker pull ollama/ollama:latest
CONTAINER_ID=$(sudo docker run -d -p 11434:11434 ollama/ollama:latest)

# Wait for container to start
sleep 10

# Pull llama model
sudo docker exec $CONTAINER_ID ollama pull llama3.2:1b

# Install Python
yum install -y python3 python3-pip

# Create app.py from template variable
cat > /home/ec2-user/app.py << 'EOL'
${app_py_content}
EOL

# Create requirements.txt from template variable
cat > /home/ec2-user/requirements.txt << 'EOL'
${requirements_content}
EOL

# Set ownership
chown ec2-user:ec2-user /home/ec2-user/app.py
chown ec2-user:ec2-user /home/ec2-user/requirements.txt

# Install requirements and start app as ec2-user
su - ec2-user -c "pip3 install -r /home/ec2-user/requirements.txt"
su - ec2-user -c "cd /home/ec2-user && nohup uvicorn app:app --host 0.0.0.0 --port 8000 --log-level debug --reload > app.log 2>&1 &"