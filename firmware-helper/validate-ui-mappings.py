#!/usr/bin/env python3
"""
Validate UI field mappings between core mapping files and tab JavaScript files.
Checks that all uiFieldId values in mappings correspond to actual input IDs in tabs.

Usage:
    python validate-ui-mappings.py
"""

import json
import re
from pathlib import Path
from collections import defaultdict

# Paths
MAPPING_DIR = Path('assets/data/maps/th3d/TH3D UFW 2.97a/core')
TABS_DIR = Path('assets/js/enhanced-profiles/tabs')

def extract_ui_fields_from_mappings():
    """Extract all uiFieldId values from core mapping files"""
    ui_fields = {}  # uiFieldId -> {defineName, category, file}
    
    for mapping_file in MAPPING_DIR.glob('*-core.json'):
        with open(mapping_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for category, fields in data.items():
            if category.startswith('$') or category in ['version', 'firmware', 'configFile', 
                                                         'generatedFrom', 'totalDefines', 
                                                         'coreDefines']:
                continue
            
            if not isinstance(fields, dict):
                continue
            
            for field_name, field_data in fields.items():
                if not isinstance(field_data, dict):
                    continue
                
                ui_field_id = field_data.get('uiFieldId')
                if ui_field_id:
                    define_name = field_data.get('mapsFrom', ['UNKNOWN'])[0]
                    ui_fields[ui_field_id] = {
                        'defineName': define_name,
                        'category': category,
                        'fieldName': field_name,
                        'file': mapping_file.name
                    }
    
    return ui_fields

def extract_input_ids_from_tabs():
    """Extract all input/select/textarea IDs from tab files"""
    input_ids = {}  # id -> {tab, file, line}
    
    # Pattern to match id="..." in HTML strings
    id_pattern = re.compile(r'id=["\']([^"\']+)["\']')
    
    for tab_file in TABS_DIR.glob('tab-*.js'):
        # Extract tab number from filename
        tab_match = re.search(r'tab-(\d+)', tab_file.name)
        if not tab_match:
            continue
        tab_num = int(tab_match.group(1))
        
        with open(tab_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, 1):
            # Find all id attributes
            for match in id_pattern.finditer(line):
                input_id = match.group(1)
                # Skip non-field IDs (buttons, containers, etc.)
                if input_id.startswith('tab') and '_' in input_id:
                    input_ids[input_id] = {
                        'tab': tab_num,
                        'file': tab_file.name,
                        'line': line_num
                    }
    
    return input_ids

def validate_mappings():
    """Validate that all uiFieldId values have corresponding inputs in tabs"""
    print('🔍 Validating UI Field Mappings...\n')
    
    # Extract data
    print('📂 Loading mapping files...')
    ui_fields = extract_ui_fields_from_mappings()
    print(f'   Found {len(ui_fields)} fields with uiFieldId')
    
    print('📂 Scanning tab files for input IDs...')
    input_ids = extract_input_ids_from_tabs()
    print(f'   Found {len(input_ids)} input fields in tabs\n')
    
    # Validate
    errors = []
    warnings = []
    success = []
    
    # Group by tab
    by_tab = defaultdict(list)
    for ui_field_id, field_info in ui_fields.items():
        # Extract tab number from uiFieldId (format: tab{N}_fieldName)
        tab_match = re.match(r'tab(\d+)_', ui_field_id)
        if tab_match:
            tab_num = int(tab_match.group(1))
            by_tab[tab_num].append((ui_field_id, field_info))
    
    print('='*70)
    print('VALIDATION RESULTS')
    print('='*70)
    
    for tab_num in sorted(by_tab.keys()):
        fields = by_tab[tab_num]
        print(f'\n📋 Tab {tab_num}: {len(fields)} mapped fields')
        print('-'*70)
        
        tab_errors = 0
        tab_success = 0
        
        for ui_field_id, field_info in sorted(fields):
            if ui_field_id in input_ids:
                # Success
                input_info = input_ids[ui_field_id]
                if input_info['tab'] != tab_num:
                    # Warning: field mapped to wrong tab
                    warning = f"  ⚠️  {ui_field_id}: Mapped to tab{tab_num} but found in {input_info['file']}"
                    warnings.append(warning)
                    print(warning)
                else:
                    success.append(ui_field_id)
                    tab_success += 1
                    print(f'  ✅ {ui_field_id} → {field_info["defineName"]}')
            else:
                # Error: field not found
                error = f"  ❌ {ui_field_id}: Not found in tab-{tab_num}-*.js (maps {field_info['defineName']})"
                errors.append(error)
                print(error)
                tab_errors += 1
        
        print(f'\n  Summary: {tab_success} valid, {tab_errors} missing')
    
    # Check for unmapped inputs
    print('\n' + '='*70)
    print('UNMAPPED INPUT FIELDS')
    print('='*70)
    
    mapped_ids = set(ui_fields.keys())
    unmapped = {id: info for id, info in input_ids.items() if id not in mapped_ids}
    
    if unmapped:
        by_tab_unmapped = defaultdict(list)
        for input_id, info in unmapped.items():
            by_tab_unmapped[info['tab']].append((input_id, info))
        
        for tab_num in sorted(by_tab_unmapped.keys()):
            print(f'\n📋 Tab {tab_num}: {len(by_tab_unmapped[tab_num])} unmapped inputs')
            for input_id, info in sorted(by_tab_unmapped[tab_num]):
                print(f'  💡 {input_id} (no mapping defined)')
    else:
        print('\n✅ All input fields have mappings!')
    
    # Final summary
    print('\n' + '='*70)
    print('SUMMARY')
    print('='*70)
    print(f'Total mapped fields:     {len(ui_fields)}')
    print(f'Total input fields:      {len(input_ids)}')
    print(f'✅ Valid mappings:       {len(success)}')
    print(f'⚠️  Warnings (wrong tab): {len(warnings)}')
    print(f'❌ Errors (missing):     {len(errors)}')
    print(f'💡 Unmapped inputs:      {len(unmapped)}')
    print('='*70)
    
    if errors:
        print('\n❌ VALIDATION FAILED')
        print('\nMissing field details:')
        for error in errors[:10]:  # Show first 10
            print(error)
        if len(errors) > 10:
            print(f'   ... and {len(errors) - 10} more')
        return 1
    elif warnings:
        print('\n⚠️  VALIDATION PASSED WITH WARNINGS')
        return 0
    else:
        print('\n✅ VALIDATION PASSED - All mappings are correct!')
        return 0

if __name__ == '__main__':
    exit(validate_mappings())
