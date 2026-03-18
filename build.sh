#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npx tsc

echo ""
echo "Build complete!"
echo ""
echo "To install globally:"
echo "  npm link"
echo ""
echo "To set up shell integration:"
echo "  copilot-hud setup"
