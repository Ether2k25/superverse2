#!/bin/bash

echo "🚀 Starting ICE SUPER Blog in production mode..."
echo

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo

# Initialize data
echo "📁 Setting up data files..."
npm run setup
echo

# Start the server
echo "🌐 Starting production server..."
npm start
