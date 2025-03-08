#!/bin/bash

echo "🔧 Installing dependencies..."
(cd backend && npm install)
(cd frontend && npm install)

echo "🐳 Starting Docker (Backend)..."
(cd backend && docker-compose up --build -d)

echo "📦 Resetting the database..."
(cd backend && ./init_db.sh)  # Modify if needed

echo "🚀 Starting Frontend..."
(cd frontend && npm run dev)
