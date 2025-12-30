#!/bin/bash
# Simple wrapper to generate firmware mappings
# Run: bash generate-mappings.sh or ./generate-mappings.sh

echo ""
echo "==============================================="
echo "  Firmware Mapping Generator"
echo "==============================================="
echo ""
echo "This will scan 'new configs/' for .h files"
echo "and generate complete mappings automatically."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "Starting mapping generation..."
echo ""

python3 firmware-helper/process-all-mappings.py --scan

echo ""
echo "==============================================="
echo "  Done!"
echo "==============================================="
echo ""
echo "Generated mappings are in: assets/data/maps/"
echo ""
read -p "Press Enter to exit..."
