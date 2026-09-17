#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "[1/3] Paketler kuruluyor..."
npm install
echo "[2/3] Expo hesabına giriş..."
npx eas-cli@latest login
echo "[3/3] APK bulutta derleniyor..."
npx eas-cli@latest build -p android --profile preview
