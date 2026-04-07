#!/bin/bash
# Quick system status checker

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          SMART FACILITY SYSTEM STATUS CHECK              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Database
echo "📊 DATABASE:"
DB_RESULT=$(psql -U subasthican -d smart_facility -c "SELECT COUNT(*) FROM users;" 2>&1)
if echo "$DB_RESULT" | grep -q "^[0-9]"; then
    USERS=$(echo "$DB_RESULT" | grep "^[0-9]" | head -1)
    echo "   ✅ PostgreSQL: Connected ($USERS users)"
else
    echo "   ❌ PostgreSQL: Not accessible"
fi

# Backend
echo ""
echo "🚀 BACKEND:"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -Pi :8080 -sTCP:LISTEN -t)
    echo "   ✅ Running on port 8080 (PID: $PID)"
else
    echo "   ❌ Not running on port 8080"
fi

# OAuth
echo ""
echo "🔐 OAuth:"
if [ -n "$GOOGLE_CLIENT_ID" ] && [ "$GOOGLE_CLIENT_ID" != "local-dev-client-id" ]; then
    echo "   ✅ Configured"
else
    echo "   ⚠️  Not configured (set env vars to enable)"
fi

# Frontend
echo ""
echo "🎨 FRONTEND:"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    echo "   ✅ Running on port 3000 (PID: $PID)"
    echo "   📱 URL: http://localhost:3000"
else
    echo "   ❌ Not running on port 3000"
fi

echo ""
