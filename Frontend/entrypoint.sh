#!/bin/sh

echo "=== Starting Frontend Container ==="
echo "VITE_API_URL environment variable: $VITE_API_URL"

# Check if VITE_API_URL is provided
if [ -z "$VITE_API_URL" ]; then
    echo "Warning: VITE_API_URL environment variable is not set"
    echo "The application may not work correctly"
else
    echo "Replacing placeholder with actual API URL: $VITE_API_URL"
    
    # Replace placeholder in all JavaScript files
    find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.mjs" \) -exec sed -i "s|__RUNTIME_API_URL__|$VITE_API_URL|g" {} \;
    
    # Also check and replace in any JSON config files (if you have any)
    find /usr/share/nginx/html -type f -name "*.json" -exec sed -i "s|__RUNTIME_API_URL__|$VITE_API_URL|g" {} \;
    
    echo "Replacement completed"
fi

echo "Starting Nginx..."
nginx -g "daemon off;"