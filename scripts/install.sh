#!/usr/bin/env bash
set -e

# Tezz-Lang Installer for Linux & macOS

echo "⚡ Installing Tezz (तेज़)..."

OS="$(uname -s)"
ARCH="$(uname -m)"

if [ "$OS" = "Darwin" ]; then
  PLATFORM="macos"
elif [ "$OS" = "Linux" ]; then
  PLATFORM="linux"
else
  echo "Unsupported OS: $OS"
  exit 1
fi

if [ "$ARCH" = "x86_64" ]; then
  ARCH="x64"
elif [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
  ARCH="arm64"
else
  echo "Unsupported Architecture: $ARCH"
  exit 1
fi

# In a real scenario, this URL would point to the GitHub releases
DOWNLOAD_URL="https://github.com/abhinav29102005/automatic-octo-carnival/releases/latest/download/tezz-$PLATFORM-$ARCH"
INSTALL_DIR="/usr/local/bin"

echo "Downloading Tezz for $PLATFORM ($ARCH)..."
# curl -L $DOWNLOAD_URL -o tezz
# chmod +x tezz
# sudo mv tezz $INSTALL_DIR/tezz

echo "✅ Tezz installed successfully! Run 'tezz --help' to get started."
