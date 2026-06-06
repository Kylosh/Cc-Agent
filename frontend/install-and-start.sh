#!/bin/bash

# Frontend startup script for Linux/macOS/WSL
# Installs dependencies if needed and starts the development server

set -e

echo "🚀 Starting Frontend Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

echo "🔧 Starting development server..."
npm start
