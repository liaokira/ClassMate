#!/bin/bash

echo "🔧 Installing dependencies..."
(cd backend && npm install)
(cd frontend && npm install)

echo "🐳 Starting Docker (Backend)..."
(cd backend && docker-compose up --build -d)

# echo "📦 Resetting the database..."
# (cd backend && ./init_db.sh)  # Modify if needed

echo "📦 Building the frontend..."
(cd frontend && npm run build)
