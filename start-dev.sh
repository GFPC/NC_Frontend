#!/bin/bash

# Start FastAPI backend in background
echo "Starting FastAPI backend..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Wait for FastAPI to start
sleep 2

# Start Node.js server
echo "Starting Node.js server..."
NODE_ENV=development tsx server/index.ts

# Cleanup FastAPI when Node.js exits
kill $FASTAPI_PID 2>/dev/null
