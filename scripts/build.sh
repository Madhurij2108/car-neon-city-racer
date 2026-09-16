#!/bin/bash
# AI Auto-Generated Build Script for Car Neon City Racer 
echo "=== [AIDLC BUILD] Starting local build ==="
npm run build
if [ $? -eq 0 ]; then
  echo "=== [AIDLC BUILD] Success ==="
  exit 0
else
  echo "=== [AIDLC BUILD] Failed ==="
  exit 1
fi
