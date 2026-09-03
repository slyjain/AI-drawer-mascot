#!/bin/bash

SHOW_LOGS=true
if [[ "$1" == "--no-logs" ]]; then
    SHOW_LOGS=false
fi

echo "========================================"
echo "🚀 Starting Tesseract Local Environment"
echo "========================================"

START_TOTAL=$(date +%s)

time_step() {
    local step_name=$1
    shift
    echo "⏳ Starting: $step_name..."
    local start_time=$(date +%s)
    
    # Run the command
    "$@"
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    echo "✅ Finished: $step_name in $duration seconds."
    echo "------------------------------------------------"
}

# 1. Start Frontend
cd app-frontend || exit
if [ ! -d "node_modules" ]; then
    time_step "Frontend: npm install" npm install
fi

echo "⏳ Starting: Frontend server (background)..."
start_time=$(date +%s)
npm run dev > frontend.log 2>&1 &
PID=$!
echo $PID > ../.frontend.pid
end_time=$(date +%s)
duration=$((end_time - start_time))
echo "✅ Finished: Frontend server (background) in $duration seconds. (PID: $PID)"
echo "------------------------------------------------"
cd .. || exit

# 2. Start Backend
time_step "Backend: Docker Compose Build & Up" docker compose -f docker-compose.local.yml up --build -d

END_TOTAL=$(date +%s)
TOTAL_DURATION=$((END_TOTAL - START_TOTAL))

echo "🎉 All services started in $TOTAL_DURATION seconds!"
echo "🌐 Frontend URL: http://localhost:5173"
echo "🔌 Backend API URL: http://localhost:8080/api"
echo "========================================"

# 3. Handle Logs
if [ "$SHOW_LOGS" = true ]; then
    echo "📺 Streaming backend logs (Press Ctrl+C to stop viewing logs)."
    echo "   Note: To fully stop the services, run ./stop-local.sh in another terminal."
    echo "========================================"
    docker compose -f docker-compose.local.yml logs -f
else
    echo "ℹ️ Logs are hidden. Run 'docker compose -f docker-compose.local.yml logs -f' to view them."
fi
