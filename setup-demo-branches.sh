#!/bin/bash
# =============================================================
# CAFI Demo Project — Branch Setup for Live Demo
# Creates two branches: demo-round1 (no CLAUDE.md) and demo-round2 (with CLAUDE.md)
# =============================================================

set -e

echo "🔀 Setting up demo branches..."

# Make sure we're on main and everything is committed
git checkout main 2>/dev/null || git checkout -b main
git add -A
git commit -m "Initial project setup" --allow-empty 2>/dev/null || true

# ---- ROUND 1 BRANCH (The Wrong Way — no CLAUDE.md) ----
echo ""
echo "🔴 Creating demo-round1 branch (no CLAUDE.md)..."
git checkout -b demo-round1

# Remove CLAUDE.md for Round 1
rm -f CLAUDE.md

# Clean up any leftover demo artifacts
rm -f research.md plan.md
rm -f src/routes/bookmarks.js src/schemas/bookmarks.js
rm -f __tests__/bookmarks.test.js

# Remove bookmarks migration if it exists
# (in case you practice and need to reset)

git add -A
git commit -m "Round 1 starting point — no CLAUDE.md, no bookmarks"

# ---- ROUND 2 BRANCH (The Right Way — with CLAUDE.md) ----
echo ""
echo "🟢 Creating demo-round2 branch (with CLAUDE.md)..."
git checkout main
git checkout -b demo-round2

# Clean up any leftover demo artifacts
rm -f research.md plan.md
rm -f src/routes/bookmarks.js src/schemas/bookmarks.js
rm -f __tests__/bookmarks.test.js

git add -A
git commit -m "Round 2 starting point — with CLAUDE.md, no bookmarks"

# Go back to main
git checkout main

echo ""
echo "✅ Demo branches created!"
echo ""
echo "Before the meetup, practice both rounds:"
echo ""
echo "  ROUND 1 (The Wrong Way):"
echo "    git checkout demo-round1"
echo "    claude"
echo "    > Build me a bookmarks API with CRUD and pagination"
echo ""
echo "  ROUND 2 (The Right Way):"
echo "    git checkout demo-round2"
echo "    claude"
echo "    > (use Plan Mode, research first, specific prompt)"
echo ""
echo "  RESET after practice:"
echo "    git checkout demo-round1 && git reset --hard HEAD"
echo "    git checkout demo-round2 && git reset --hard HEAD"
echo ""
echo "  IMPORTANT: Reset both branches before the live meetup!"
