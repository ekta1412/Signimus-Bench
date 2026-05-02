#!/bin/sh

# This script starts the Next.js development server.

# Define the path to the Next.js application
NEXT_APP_PATH="signimus-bench-app/signimus-bench-app"

# Check if the -b flag is provided for background execution
if [ "$1" = "-b" ]; then
  echo "Starting Next.js development server in background..."
  # Attempt to start the Next.js server, redirecting output to a log file
  # and running in the background.
  sh -c "cd \"$NEXT_APP_PATH\" && npx next dev > server.log 2>&1 &"
  echo "Server started. Check server.log for output."
else
  echo "Starting Next.js development server..."
  # Attempt to start the Next.js server in the foreground.
  sh -c "cd \"$NEXT_APP_PATH\" && npx next dev"
fi
