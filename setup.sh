#!/bin/bash
# =============================================================
# CAFI Demo Project — Setup Script
# Run this ONCE on your machine to prepare the demo branches
# =============================================================

set -e

echo "🚀 Setting up CAFI Demo Project..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Initialize database
echo "🗄️  Setting up database..."
cp .env.example .env
npx prisma migrate dev --name init

# Step 3: Seed demo data
echo "🌱 Seeding demo data..."
npx prisma db seed

# Step 4: Run tests to verify everything works
echo "🧪 Running tests..."
npm test

echo ""
echo "✅ Project setup complete!"
echo ""
echo "Now run the branch setup script:"
echo "  bash setup-demo-branches.sh"
