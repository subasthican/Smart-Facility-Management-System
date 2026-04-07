#!/bin/bash

# One-Command Startup Script for Smart Facility Management System
# Starts: Database (PostgreSQL), Backend (Spring Boot), Frontend (React)
# Usage: bash start.sh

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "🚀 Starting Smart Facility Management System..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -9 -f "mvn spring-boot:run" 2>/dev/null || true
pkill -9 -f "java.*smartfacility" 2>/dev/null || true
pkill -9 -f "npm start" 2>/dev/null || true
pkill -9 -f "node.*react" 2>/dev/null || true
sleep 3

# Check PostgreSQL
echo "📊 Checking PostgreSQL..."
if ! nc -z localhost 5432 2>/dev/null; then
    echo "❌ PostgreSQL not running on port 5432"
    echo "   Start it with: brew services start postgresql@15"
    exit 1
fi
echo "✅ PostgreSQL running"
echo ""

# Start Backend
echo "🔙 Starting Backend (Spring Boot on port 8080)..."
cd "$BACKEND_DIR"
rm -f /tmp/backend_startup.log
mvn -q clean compile 2>&1 | grep -v "^\[" || true
mvn spring-boot:run > /tmp/backend_startup.log 2>&1 &
BACKEND_PID=$!
echo "   Starting backend (PID: $BACKEND_PID)..."

# Wait for backend to start
for i in {1..15}; do
    if grep -q "Started SmartFacilityApp" /tmp/backend_startup.log 2>/dev/null; then
        echo "✅ Backend started successfully"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Backend failed to start. Logs:"
        tail -50 /tmp/backend_startup.log
        exit 1
    fi
    sleep 1
done
echo ""

# Build Frontend
echo "🏗️  Building Frontend..."
cd "$FRONTEND_DIR"
npm install -q 2>/dev/null || true
npm run build > /tmp/frontend_build.log 2>&1
echo "✅ Frontend built"
echo ""

# Start Frontend
echo "🎨 Starting Frontend (React on port 3000)..."
cd "$FRONTEND_DIR"
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Starting frontend (PID: $FRONTEND_PID)..."
sleep 6

# Verify frontend started
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start. Check logs:"
    tail -50 /tmp/frontend.log
    exit 1
fi
echo "✅ Frontend started"
echo ""

# Final status
echo "════════════════════════════════════════════════════════════════"
echo "✨ SYSTEM RUNNING"
echo "════════════════════════════════════════════════════════════════"
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:8080"
echo "📊 Database:  localhost:5432"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend_startup.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop: Press Ctrl+C (or kill $BACKEND_PID $FRONTEND_PID)"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Keep script running
wait
