#!/bin/bash

# One-command startup for Smart Facility Management System.
# Default mode is non-blocking. Use --attach to keep this script attached.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_LOG="/tmp/backend_startup.log"
FRONTEND_LOG="/tmp/frontend.log"
PID_FILE="/tmp/smartfacility.pids"
ATTACH_MODE=0

if [[ "${1:-}" == "--attach" ]]; then
    ATTACH_MODE=1
fi

load_env_file() {
    local env_file="$1"
    if [[ -f "$env_file" ]]; then
        echo "🔐 Loading env from $env_file"
        # shellcheck disable=SC1090
        set -a
        source "$env_file"
        set +a
    fi
}

echo "🚀 Starting Smart Facility Management System..."
echo ""

# Load local env first so OAuth/DB settings are always available when backend starts.
load_env_file "$PROJECT_DIR/.env.local"
load_env_file "$BACKEND_DIR/.env.local"

echo "🧹 Cleaning up old processes..."
pkill -9 -f "mvn spring-boot:run" 2>/dev/null || true
pkill -9 -f "java.*smartfacility" 2>/dev/null || true
pkill -9 -f "react-scripts start" 2>/dev/null || true
pkill -9 -f "npm start" 2>/dev/null || true
sleep 2

echo "📊 Checking PostgreSQL..."
if ! nc -z localhost 5432 2>/dev/null; then
    echo "❌ PostgreSQL not running on port 5432"
    echo "   Start it with: brew services start postgresql@15"
    exit 1
fi
echo "✅ PostgreSQL running"
echo ""

echo "🔙 Starting Backend (Spring Boot on port 8080)..."
cd "$BACKEND_DIR"
rm -f "$BACKEND_LOG"
mvn -q clean compile >/dev/null 2>&1 || true
mvn spring-boot:run > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

for i in {1..25}; do
    if grep -q "Started SmartFacilityApp" "$BACKEND_LOG" 2>/dev/null; then
        echo "✅ Backend started successfully"
        break
    fi
    if [[ $i -eq 25 ]]; then
        echo "❌ Backend failed to start. Recent logs:"
        tail -50 "$BACKEND_LOG"
        exit 1
    fi
    sleep 1
done
echo ""

# Show OAuth readiness immediately so failures are obvious during startup.
if [[ -n "${GOOGLE_CLIENT_ID:-}" && -n "${GOOGLE_CLIENT_SECRET:-}" ]]; then
    echo "✅ OAuth secrets detected in environment"
else
    echo "⚠️  OAuth secrets missing. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local"
fi
echo ""

echo "🏗️  Preparing Frontend..."
cd "$FRONTEND_DIR"
if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    echo "   Installing dependencies (first run)..."
    npm install >/dev/null 2>&1
fi

echo "🎨 Starting Frontend (React on port 3000)..."
rm -f "$FRONTEND_LOG"
npm start > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

for i in {1..30}; do
    if nc -z localhost 3000 2>/dev/null; then
        echo "✅ Frontend started successfully"
        break
    fi
    if [[ $i -eq 30 ]]; then
        echo "❌ Frontend failed to start. Recent logs:"
        tail -50 "$FRONTEND_LOG"
        exit 1
    fi
    sleep 1
done
echo ""

echo "$BACKEND_PID $FRONTEND_PID" > "$PID_FILE"

echo "════════════════════════════════════════════════════════════════"
echo "✨ SYSTEM RUNNING"
echo "════════════════════════════════════════════════════════════════"
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:8080"
echo "📊 Database:  localhost:5432"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f $BACKEND_LOG"
echo "   Frontend: tail -f $FRONTEND_LOG"
echo ""
echo "🛑 Stop command: kill \$(cat $PID_FILE)"
echo "════════════════════════════════════════════════════════════════"

if [[ $ATTACH_MODE -eq 1 ]]; then
    wait
fi
