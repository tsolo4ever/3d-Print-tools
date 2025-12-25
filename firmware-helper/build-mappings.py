#!/usr/bin/env python3
"""
TH3D Configuration Mapping Builder
Interactive tool to create mapping entries for unmapped fields.
"""

import re
import json
from pathlib import Path
from typing import Dict, List, Optional

# Configuration
CONFIG_FILES = [
    "Test files\\Configuration.h",
    "Test files\\Configuration_adv.h",
    "Test files\\Configuration_backend.h",
    "Test files\\Configuration_speed.h"
]

MAPPING_FILES = {
    "config": "assets/data/maps/th3d/th3d-config-mapping.json",
    "config_adv_part1": "assets/data/maps/th3d/th3d-config-adv-mapping-part1.json",
    "config_adv_part2": "assets/data/maps/th3d/th3d-config-adv-mapping-part2.json",
    "config_adv_part3": "assets/data/maps/th3d/th3d-config-adv-mapping-part3.json",
    "config_adv_part4": "assets/data/maps/th3d/th3d-config-adv-mapping-part4.json",
    "config_backend": "assets/data/maps/th3d/th3d-config-backend-mapping.json",
    "config_speed": "assets/data/maps/th3d/th3d-config-speed-mapping.json"
}

# Type inference patterns
TYPE_PATTERNS = {
    'boolean': [
        r'(ENABLE|DISABLE|INVERT|REVERSE)',
        r'(USE_|HAS_|IS_)',
        r'(SHOW_|HIDE_)'
    ],
    'integer': [
        r'(COUNT|SIZE|LENGTH|WIDTH|HEIGHT|DEPTH)',
        r'(TIMEOUT|DELAY|DURATION|TIME)',
        r'(MIN|MAX)$',
        r'(STEPS|POSITION)',
        r'_PORT$',
        r'SENSOR_\d+$'
    ],
    'float': [
        r'(FACTOR|RATIO|COEFFICIENT)',
        r'(FEEDRATE|SPEED|ACCEL)',
        r'(OFFSET|DELTA)',
        r'DEFAULT_(K[pid])',
        r'JERK'
    ],
    'string': [
        r'(NAME|LABEL|TEXT)',
        r'(PIN)$'
    ],
    'array': [
        r'DEFAULT_.*_UNIT',
        r'DEFAULT_MAX_',
        r'NOZZLE_TO_PROBE_OFFSET'
    ]
}

class MappingBuilder:
    def __init__(self):
        self.config_data = {}
        self.mapped_fields = set()
        
    def extract_define_info(self, filepath: str, define_name: str) -> Optional[Dict]:
        """Extract detailed information about a define from config file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find the define and surrounding context
            pattern = rf'^\s*#define\s+{re.escape(define_name)}\s*(.*)$'
            
            for i, line in enumerate(content.split('\n')):
                match = re.search(pattern, line)
                if match:
                    value = match.group(1).strip()
                    
                    # Get comments above the define
                    comments = []
                    for j in range(max(0, i-5), i):
                        prev_line = content.split('\n')[j].strip()
                        if prev_line.startswith('//'):
                            comments.append(prev_line[2:].strip())
                    
                    # Infer type from value
                    inferred_type = self.infer_type(define_name, value)
                    
                    return {
                        'name': define_name,
                        'value': value,
                        'comments': comments,
                        'type': inferred_type,
                        'file': Path(filepath).name
                    }
        except Exception as e:
            print(f"Error extracting info for {define_name}: {e}")
        
        return None
    
    def infer_type(self, define_name: str, value: str) -> str:
        """Infer the type of a define based on name and value."""
        # Check value first
        if not value or value == '':
            # Check name patterns
            for type_name, patterns in TYPE_PATTERNS.items():
                for pattern in patterns:
                    if re.search(pattern, define_name, re.IGNORECASE):
                        return type_name
            return 'boolean'
        
        # Check if it's an array
        if value.startswith('{') and value.endswith('}'):
            return 'array'
        
        # Check if it's a string
        if value.startswith('"') and value.endswith('"'):
            return 'string'
        
        # Check if it's a number
        if re.match(r'^-?\d+$', value):
            return 'integer'
        
        if re.match(r'^-?\d+\.\d+', value):
            return 'float'
        
        # Check name patterns
        for type_name, patterns in TYPE_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, define_name, re.IGNORECASE):
                    return type_name
        
        return 'boolean'
    
    def suggest_category(self, define_name: str, define_info: Dict) -> str:
        """Suggest which mapping file/category this define belongs to."""
        name_lower = define_name.lower()
        
        # Configuration.h categories
        if any(x in name_lower for x in ['temp', 'thermal', 'pid', 'heat']):
            return 'thermistors'
        elif any(x in name_lower for x in ['probe', 'bl', 'ezabl', 'leveling']):
            return 'ablProbe'
        elif any(x in name_lower for x in ['extruder', 'estep', 'filament']):
            return 'extruder'
        elif any(x in name_lower for x in ['bed_size', 'x_bed', 'y_bed', 'z_max']):
            return 'bedSize'
        elif any(x in name_lower for x in ['home', 'endstop']):
            return 'homeOffset'
        
        # Configuration_adv.h categories
        elif any(x in name_lower for x in ['fan', 'cooling']):
            return 'fanControl'
        elif any(x in name_lower for x in ['tmc', 'driver', 'stealth']):
            return 'tmcDrivers'
        elif any(x in name_lower for x in ['lcd', 'display', 'screen']):
            return 'lcdOptions'
        elif any(x in name_lower for x in ['buffer', 'serial', 'baud']):
            return 'buffers'
        elif any(x in name_lower for x in ['babystep']):
            return 'babystepping'
        elif any(x in name_lower for x in ['pause', 'resume']):
            return 'advancedPause'
        
        # Backend categories
        elif any(x in name_lower for x in ['protection', 'safety']):
            return 'thermalProtection'
        
        # Speed categories
        elif any(x in name_lower for x in ['feed', 'accel', 'jerk']):
            return 'motion'
        
        return 'misc'
    
    def generate_mapping_entry(self, define_info: Dict, field_name: str = None) -> Dict:
        """Generate a complete mapping entry for a define."""
        if field_name is None:
            field_name = define_info['name'].lower().replace('_', '')
        
        entry = {
            "mapsFrom": [define_info['name']],
            "type": define_info['type'],
            "required": False
        }
        
        # Add examples if we have a value
        if define_info['value'] and define_info['value'] not in ['', '1', '0']:
            if define_info['type'] in ['integer', 'float']:
                try:
                    if define_info['type'] == 'integer':
                        entry["examples"] = [int(define_info['value'])]
                    else:
                        entry["examples"] = [float(define_info['value'])]
                except:
                    pass
            elif define_info['type'] == 'string':
                entry["examples"] = [define_info['value'].strip('"')]
        
        # Add notes from comments
        if define_info['comments']:
            notes = ' '.join(define_info['comments'][:2])  # First 2 comment lines
            entry["th3dNotes"] = notes[:200]  # Limit to 200 chars
        
        return entry
    
    def build_mapping_interactively(self, define_name: str):
        """Interactively build a mapping for a define."""
        print(f"\n{'='*80}")
        print(f"Building mapping for: {define_name}")
        print('='*80)
        
        # Find the define in config files
        define_info = None
        for config_file in CONFIG_FILES:
            info = self.extract_define_info(config_file, define_name)
            if info:
                define_info = info
                break
        
        if not define_info:
            print(f"❌ Could not find {define_name} in config files")
            return None
        
        # Display information
        print(f"\n📁 File: {define_info['file']}")
        print(f"💎 Value: {define_info['value'] or '(none)'}")
        print(f"🏷️  Inferred Type: {define_info['type']}")
        
        if define_info['comments']:
            print(f"\n💬 Comments:")
            for comment in define_info['comments'][:5]:
                print(f"   {comment}")
        
        # Suggest category
        suggested_category = self.suggest_category(define_name, define_info)
        print(f"\n📦 Suggested Category: {suggested_category}")
        
        # Ask for confirmation or override
        print(f"\n🔧 Mapping Configuration:")
        print(f"   1. Auto-generate with suggestions")
        print(f"   2. Customize interactively")
        print(f"   3. Skip this field")
        
        choice = input("\nChoice (1-3): ").strip()
        
        if choice == '3':
            return None
        
        if choice == '2':
            # Interactive customization
            field_name = input(f"Field name [{define_name.lower()}]: ").strip() or define_name.lower()
            field_type = input(f"Type [{define_info['type']}]: ").strip() or define_info['type']
            category = input(f"Category [{suggested_category}]: ").strip() or suggested_category
            notes = input("Notes: ").strip()
            
            entry = {
                "mapsFrom": [define_name],
                "type": field_type,
                "required": False
            }
            
            if notes:
                entry["th3dNotes"] = notes
        else:
            # Auto-generate
            field_name = define_name.lower().replace('_', '')
            category = suggested_category
            entry = self.generate_mapping_entry(define_info, field_name)
        
        # Generate full mapping structure
        mapping = {
            "category": category,
            "fieldName": field_name,
            "entry": entry,
            "define_info": define_info
        }
        
        # Display generated mapping
        print(f"\n✅ Generated Mapping:")
        print(f"   Category: {category}")
        print(f"   Field: {field_name}")
        print(json.dumps(entry, indent=2))
        
        return mapping
    
    def save_mapping_to_file(self, mapping: Dict, target_file: str = None):
        """Save a mapping entry to the appropriate JSON file."""
        if target_file is None:
            # Determine target file based on source file
            source_file = mapping['define_info']['file']
            if 'Configuration_adv' in source_file:
                target_file = 'config_adv_part1'
            elif 'Configuration_backend' in source_file:
                target_file = 'config_backend'
            elif 'Configuration_speed' in source_file:
                target_file = 'config_speed'
            else:
                target_file = 'config'
        
        filepath = MAPPING_FILES.get(target_file)
        if not filepath:
            print(f"❌ Unknown target file: {target_file}")
            return False
        
        try:
            # Load existing mapping
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add new entry to appropriate category
            category = mapping['category']
            field_name = mapping['fieldName']
            
            if category not in data:
                data[category] = {}
            
            data[category][field_name] = mapping['entry']
            
            # Save back
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            
            print(f"✅ Saved to {filepath}")
            return True
        
        except Exception as e:
            print(f"❌ Error saving mapping: {e}")
            return False
    
    def batch_build_mappings(self, defines: List[str]):
        """Build mappings for a list of defines."""
        results = []
        
        for i, define in enumerate(defines, 1):
            print(f"\n[{i}/{len(defines)}] Processing {define}...")
            mapping = self.build_mapping_interactively(define)
            
            if mapping:
                # Ask to save
                save = input("\n💾 Save this mapping? (y/n): ").strip().lower()
                if save == 'y':
                    if self.save_mapping_to_file(mapping):
                        results.append(mapping)
                else:
                    print("⏭️  Skipped saving")
            
            if i < len(defines):
                cont = input("\nContinue to next? (y/n): ").strip().lower()
                if cont != 'y':
                    break
        
        return results

def main():
    print("="*80)
    print("TH3D Configuration Mapping Builder")
    print("="*80)
    print("\nThis tool helps you create mapping entries for unmapped fields.\n")
    
    builder = MappingBuilder()
    
    print("Options:")
    print("  1. Build mapping for specific field(s)")
    print("  2. Batch build from unmapped report")
    print("  3. Export template for manual editing")
    
    choice = input("\nChoice (1-3): ").strip()
    
    if choice == '1':
        # Single or multiple fields
        fields_input = input("\nEnter field name(s) (comma-separated): ").strip()
        fields = [f.strip() for f in fields_input.split(',')]
        
        builder.batch_build_mappings(fields)
    
    elif choice == '2':
        # Load from report
        try:
            with open('firmware-helper/mapping-coverage-report.txt', 'r') as f:
                content = f.read()
            
            # Extract unmapped defines
            unmapped = []
            in_section = False
            for line in content.split('\n'):
                if line.startswith('-' * 40):
                    in_section = True
                    continue
                if in_section and line.strip():
                    unmapped.append(line.strip())
            
            if unmapped:
                print(f"\n📋 Found {len(unmapped)} unmapped fields")
                count = input(f"How many to process? (1-{len(unmapped)}): ").strip()
                
                try:
                    count = int(count)
                    builder.batch_build_mappings(unmapped[:count])
                except ValueError:
                    print("❌ Invalid number")
            else:
                print("❌ No unmapped fields found in report")
        
        except FileNotFoundError:
            print("❌ Report file not found. Run check-missing-mappings.py first.")
    
    elif choice == '3':
        # Export template
        field_name = input("Enter field name: ").strip()
        
        for config_file in CONFIG_FILES:
            info = builder.extract_define_info(config_file, field_name)
            if info:
                mapping = builder.generate_mapping_entry(info)
                category = builder.suggest_category(field_name, info)
                
                template = {
                    category: {
                        field_name.lower().replace('_', ''): mapping
                    }
                }
                
                print("\n📄 Template (copy to appropriate mapping file):")
                print(json.dumps(template, indent=2))
                break
    
    print("\n✅ Mapping builder complete!")

if __name__ == "__main__":
    main()
