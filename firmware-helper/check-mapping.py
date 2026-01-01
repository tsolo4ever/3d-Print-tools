#!/usr/bin/env python3
"""Check if USER_PRINTER_NAME has conditional mapping"""
import json
from pathlib import Path

mapping_file = Path('test-output/th3d/test/core/th3d-config-mapping-core.json')

with open(mapping_file) as f:
    data = json.load(f)

print("\n=== Searching for USER_PRINTER_NAME ===\n")

found = False
for category, fields in data.items():
    if not isinstance(fields, dict):
        continue
    
    for field_name, field_data in fields.items():
        if not isinstance(field_data, dict):
            continue
        
        maps_from = field_data.get('mapsFrom', [])
        if 'USER_PRINTER_NAME' in maps_from:
            found = True
            print(f"✅ FOUND in category: {category}")
            print(f"   Field name: {field_name}")
            print(f"   mapsFrom: {maps_from}")
            print(f"   conditionalOn: {field_data.get('conditionalOn', 'NOT SET')}")
            print(f"   conditionalOnNot: {field_data.get('conditionalOnNot', 'NOT SET')}")
            print(f"   isConditional: {field_data.get('isConditional', False)}")
            print(f"   uiFieldId: {field_data.get('uiFieldId', 'NOT SET')}")
            print(f"\n   Full field data:")
            print(f"   {json.dumps(field_data, indent=6)}")

if not found:
    print("❌ USER_PRINTER_NAME not found in core mapping")
