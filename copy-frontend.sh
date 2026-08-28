#!/bin/sh
set -e
# copy-frontend.sh
# Copies frontend/ contents into repository root for Vercel static output.
# Usage: ./copy-frontend.sh

echo "[copy-frontend] Starting copy of frontend/ to repository root..."

# Temporary staging dir to avoid partial copies
TMP_DIR="./_static_frontend_tmp"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

# Ensure frontend exists
if [ ! -d "frontend" ]; then
  echo "[copy-frontend] ERROR: frontend/ directory not found"
  exit 1
fi

# Copy files to temporary directory (preserve structure)
rsync -a --delete frontend/ "$TMP_DIR/"

# Copy staged files to repo root
rsync -a --delete "$TMP_DIR/" ./

# Clean up
rm -rf "$TMP_DIR"

echo "[copy-frontend] Copy complete. Frontend files are now at project root."
