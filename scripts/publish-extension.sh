#!/bin/bash

# Tezz Extension Publishing Script
# This script handles automated bundling and dual-publishing to Microsoft and Open VSX.

set -e

echo "⚡ Starting Tezz VS Code Extension Publish Pipeline ⚡"

# Ensure we are in the right directory
if [ ! -d "tezz-vscode" ]; then
  echo "Error: tezz-vscode directory not found. Please run this script from the root of the repository."
  exit 1
fi

cd tezz-vscode

# 1. Clean old VSIX files
echo "🧹 Cleaning up old builds..."
rm -f *.vsix

# 2. Package the universal extension
echo "📦 Building unified VSIX package..."
npx @vscode/vsce package

# 3. Publish to Microsoft Marketplace
if [ -z "$VSCE_PAT" ]; then
  echo "⚠️ Warning: VSCE_PAT is not set. Skipping Microsoft Marketplace publish."
else
  echo "🚀 Publishing to Microsoft Marketplace..."
  npx @vscode/vsce publish -p "$VSCE_PAT"
fi

# 4. Publish to Open VSX
if [ -z "$OVSX_PAT" ]; then
  echo "⚠️ Warning: OVSX_PAT is not set. Skipping Open VSX publish."
else
  echo "🚀 Publishing to Open VSX..."
  npx ovsx publish -p "$OVSX_PAT"
fi

echo "✅ Publishing pipeline completed!"
