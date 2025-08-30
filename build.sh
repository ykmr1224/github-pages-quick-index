#!/bin/bash

# Simple build script for GitHub Action TypeScript project
# This script helps when npm is not immediately available

echo "🔧 Building GitHub Action TypeScript project..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js 20 or later to continue"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "⚠️  npm not found in PATH"
    echo "Trying to locate npm..."
    
    # Try to find npm in common locations
    NPM_PATH=""
    if [ -f "/Users/$(whoami)/.nvm/versions/node/$(node --version)/bin/npm" ]; then
        NPM_PATH="/Users/$(whoami)/.nvm/versions/node/$(node --version)/bin/npm"
    elif [ -f "$(dirname $(which node))/npm" ]; then
        NPM_PATH="$(dirname $(which node))/npm"
    fi
    
    if [ -n "$NPM_PATH" ] && [ -f "$NPM_PATH" ]; then
        echo "✅ Found npm at: $NPM_PATH"
        alias npm="$NPM_PATH"
    else
        echo "❌ Could not locate npm"
        echo "Please ensure npm is installed and accessible"
        exit 1
    fi
else
    echo "✅ npm found: $(npm --version)"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️  Building TypeScript..."
npm run build

# Package the action
echo "📦 Packaging action..."
npm run package

echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Customize src/index.ts with your action logic"
echo "2. Update action.yml with your inputs/outputs"
echo "3. Run tests with: npm test"
echo "4. Commit your changes including the dist/ directory"
