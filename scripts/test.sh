#!/bin/bash
# AI Auto-Generated Test Script for Car Neon City Racer 
echo "=== [AIDLC TEST] Running regression tests ==="
npm test
if [ $? -eq 0 ]; then
  echo "=== [AIDLC TEST] Success ==="
  exit 0
else
  echo "=== [AIDLC TEST] Failed ==="
  exit 1
fi
