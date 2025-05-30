#!/bin/sh
set -e

# Validate environment variable
if [ -z "${BACKEND_ALB_URL}" ]; then
  echo "ERROR: BACKEND_ALB_URL environment variable not set!"
  exit 1
fi

# Replace placeholder in Nginx config
echo "Configuring backend ALB URL: ${BACKEND_ALB_URL}"
envsubst '${BACKEND_ALB_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
echo "Starting Nginx..."
exec nginx -g "daemon off;"