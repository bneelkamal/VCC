#!/bin/bash

# 1. Search the home folders to find exactly where app.py is saved
# This ensures the script finds the app regardless of the exact user directory
APP_FILE=$(find /home -name "app.py" -type f | head -n 1)

# 2. Navigate into that specific directory
cd $(dirname "$APP_FILE")

# 3. Run the existing Flask file in the background
# Output is routed to a log file for debugging purposes
nohup python3 app.py > /var/log/flask_startup.log 2>&1 &
