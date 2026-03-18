#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npx tsc

echo "Build complete! Run with: node dist/index.js"
