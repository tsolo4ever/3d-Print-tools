#!/usr/bin/env python3
"""Show examples of conditional field detection"""

import json
from pathlib import Path

# Find all mapping files
mapping_dir = Path('assets/data/maps/marlin/2.1.x')
mapping_files = sorted(mapping_dir.glob('marlin-config-mapping-part*.json'))

print(f"🔍 Searching {len(mapping_files)} mapping files for conditional fields...\n")

conditional_with_deps = []
conditional_without_deps = []

for mapping_file in mapping_files:
    with open(mapping_file, 'r') as f:
        data = json.load(f)
    
    # Skip metadata
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines'}
    
    for category_name, category_fields in data.items():
        if category_name in metadata_keys or not isinstance(category_fields, dict):
            continue
        
        for field_name, field_data in category_fields.items():
            if not isinstance(field_data, dict):
                continue
            
            if field_data.get('isConditional'):
                if field_data.get('conditionalOn') or field_data.get('conditionalOnNot'):
                    conditional_with_deps.append({
                        'file': mapping_file.name,
                        'category': category_name,
                        'field': field_name,
                        'mapsFrom': field_data.get('mapsFrom', []),
                        'conditionalOn': field_data.get('conditionalOn', []),
                        'conditionalOnNot': field_data.get('conditionalOnNot', []),
                        'expression': field_data.get('conditionalExpression', [])
                    })
                else:
                    conditional_without_deps.append({
                        'field': field_name,
                        'mapsFrom': field_data.get('mapsFrom', [])
                    })

print(f"✅ Results:")
print(f"   Total conditional fields: {len(conditional_with_deps) + len(conditional_without_deps)}")
print(f"   With dependencies extracted: {len(conditional_with_deps)}")
print(f"   Without dependencies (empty #ifdef?): {len(conditional_without_deps)}")
print()

if conditional_with_deps:
    print(f"📝 Example conditional fields WITH dependencies:\n")
    for ex in conditional_with_deps[:10]:
        print(f"   {ex['category']}.{ex['field']}")
        print(f"      mapsFrom: {ex['mapsFrom']}")
        if ex['conditionalOn']:
            print(f"      ✓ conditionalOn: {ex['conditionalOn']}")
        if ex['conditionalOnNot']:
            print(f"      ✗ conditionalOnNot: {ex['conditionalOnNot']}")
        if ex['expression']:
            print(f"      📄 expression: {ex['expression'][0]}")
        print()

if conditional_without_deps:
    print(f"\n⚠️  Sample fields WITHOUT dependencies (may need investigation):")
    for ex in conditional_without_deps[:5]:
        print(f"   {ex['field']} (mapsFrom: {ex['mapsFrom']})")
