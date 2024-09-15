#!/bin/bash

# Function to kill processes by name
kill_process() {
    process_name=$1
    pids=$(pgrep -f "$process_name")
    if [ ! -z "$pids" ]; then
        echo "Terminating existing $process_name processes..."
        kill $pids
    fi
}

# Function to kill all child processes
cleanup() {
    echo "Terminating all processes..."
    kill $(jobs -p)
    exit
}

# Set up trap to call cleanup function on script termination
trap cleanup SIGINT SIGTERM

# Kill any existing npm processes
kill_process "npm start"
kill_process "npm run dev"

echo "Starting frontend..."
cd skillsync-frontend
npm start &

echo "Starting backend..."
cd ../skillsync-backend
npm run dev &

wait