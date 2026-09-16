#!/bin/bash
# AI Auto-Generated Lint Script for Car Neon City Racer 
echo "=== [AIDLC LINT] Verifying syntax formatting ==="
npm run lint
if [ $? -eq 0 ]; then
  echo "=== [AIDLC LINT] Success ==="
  exit 0
else
  echo "=== [AIDLC LINT] Failed ==="
  exit 1
fi
