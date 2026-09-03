#!/bin/bash

echo "========================================"
echo "🛑 Stopping Tesseract Local Environment"
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

# 1. Stop Frontend
if [ -f ".frontend.pid" ]; then
    PID=$(cat .frontend.pid)
    # Check if process is actually running before killing
    if ps -p $PID > /dev/null; then
        time_step "Frontend: Killing process $PID" kill $PID
    else
        echo "✅ Frontend: Process $PID already dead."
    fi
    rm .frontend.pid
else
    echo "✅ Frontend: No .frontend.pid file found, assuming it's not running."
    echo "------------------------------------------------"
fi

# 2. Stop Backend
time_step "Backend: Docker Compose Down" docker compose -f docker-compose.local.yml down

END_TOTAL=$(date +%s)
TOTAL_DURATION=$((END_TOTAL - START_TOTAL))

echo "🎉 All services stopped cleanly in $TOTAL_DURATION seconds!"
echo "========================================"
