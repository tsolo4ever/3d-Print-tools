#!/usr/bin/env python3
"""Test script to verify conditional field detection"""

import json
from pathlib import Path

# Load the first mapping file
mapping_file = Path('assets/data/maps/marlin/2.1.x/marlin-config-mapping-part1.json')

with open(mapping_file, 'r') as f:
    data = json.load(f)

# Count conditional fields
conditional_count = 0
active_count = 0
examples = []

# Skip metadata fields
metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines'}

for category_name, category_fields in data.items():
    if category_name in metadata_keys:
        continue
    
    if not isinstance(category_fields, dict):
        continue
    
    for field_name, field_data in category_fields.items():
        if not isinstance(field_data, dict):
            continue
        
        if field_data.get('isConditional'):
            conditional_count += 1
            if len(examples) < 5:
                examples.append({
                    'category': category_name,
                    'field': field_name,
                    'conditionalOn': field_data.get('conditionalOn', []),
                    'conditionalOnNot': field_data.get('conditionalOnNot', []),
                    'expression': field_data.get('conditionalExpression', [])
                })
        else:
            active_count += 1

print(f"📊 Conditional Field Detection Results:")
print(f"   ✅ Total fields analyzed: {conditional_count + active_count}")
print(f"   🔀 Conditional fields (inside #ifdef blocks): {conditional_count}")
print(f"   ✓  Active fields (always compiled): {active_count}")
print()

if examples:
    print(f"📝 Example conditional fields:")
    for ex in examples:
        print(f"\n   {ex['category']}.{ex['field']}:")
        if ex['conditionalOn']:
            print(f"      conditionalOn: {ex['conditionalOn']}")
        if ex['conditionalOnNot']:
            print(f"      conditionalOnNot: {ex['conditionalOnNot']}")
        if ex['expression']:
            print(f"      expression: {ex['expression'][:1]}")  # Just first expression
