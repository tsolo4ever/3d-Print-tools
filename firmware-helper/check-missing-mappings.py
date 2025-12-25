#!/usr/bin/env python3
"""
TH3D Configuration Field Mapping Checker
Analyzes TH3D config files and compares to mapping files to find missing mappings.
"""

import re
import json
from pathlib import Path
from collections import defaultdict

# Configuration
CONFIG_FILES = [
    "Test files\\th3d\\Configuration.h",
    "Test files\\th3d\\Configuration_adv.h",
    "Test files\\th3d\\Configuration_backend.h",
    "Test files\\th3d\\Configuration_speed.h"
]

MAPPING_FILES = [
    "assets/data/maps/th3d/th3d-config-mapping.json",
    "assets/data/maps/th3d/th3d-config-adv-mapping-part1.json",
    "assets/data/maps/th3d/th3d-config-adv-mapping-part2.json",
    "assets/data/maps/th3d/th3d-config-adv-mapping-part3.json",
    "assets/data/maps/th3d/th3d-config-adv-mapping-part4.json",
    "assets/data/maps/th3d/th3d-config-backend-mapping.json",
    "assets/data/maps/th3d/th3d-config-speed-mapping.json"
]

# Critical defines that must be mapped (for validation)
CRITICAL_DEFINES = [
    "MOTHERBOARD",
    "DEFAULT_AXIS_STEPS_PER_UNIT",
    "THERMAL_PROTECTION_HOTENDS",
    "THERMAL_PROTECTION_BED",
    "BAUDRATE",
    "TEMP_SENSOR_0",
    "TEMP_SENSOR_BED",
    "DEFAULT_MAX_FEEDRATE",
    "DEFAULT_MAX_ACCELERATION"
]

def extract_defines_from_config(filepath):
    """Extract all #define statements from a config file."""
    defines = set()
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Match #define statements (not inside comments)
        # Pattern: #define NAME [value]
        pattern = r'^\s*#define\s+([A-Z_][A-Z0-9_]*)'
        
        for line in content.split('\n'):
            # Skip commented lines
            if line.strip().startswith('//'):
                continue
                
            match = re.search(pattern, line)
            if match:
                define_name = match.group(1)
                # Skip internal Marlin macros and include guards
                if not define_name.startswith('_') and not define_name.endswith('_H'):
                    defines.add(define_name)
    
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
    
    return defines

def extract_mapsFrom_fields(mapping_data, parent_key=''):
    """Recursively extract all 'mapsFrom' fields from mapping JSON."""
    mapped_fields = set()
    
    if isinstance(mapping_data, dict):
        for key, value in mapping_data.items():
            if key == 'mapsFrom' and isinstance(value, list):
                for field in value:
                    # Remove array indexing [0], [1], etc.
                    clean_field = re.sub(r'\[\d+\]', '', field)
                    mapped_fields.add(clean_field)
            else:
                mapped_fields.update(extract_mapsFrom_fields(value, parent_key + '.' + key if parent_key else key))
    
    return mapped_fields

def load_mapped_fields():
    """Load all mapped fields from mapping JSON files."""
    all_mapped = set()
    
    for mapping_file in MAPPING_FILES:
        try:
            with open(mapping_file, 'r', encoding='utf-8') as f:
                mapping_data = json.load(f)
                mapped = extract_mapsFrom_fields(mapping_data)
                all_mapped.update(mapped)
                print(f"✅ Loaded {len(mapped)} mappings from {Path(mapping_file).name}")
        except FileNotFoundError:
            print(f"⚠️  Mapping file not found: {mapping_file}")
        except json.JSONDecodeError as e:
            print(f"❌ JSON error in {mapping_file}: {e}")
        except Exception as e:
            print(f"❌ Error loading {mapping_file}: {e}")
    
    return all_mapped

def categorize_unmapped(defines, mapped_fields):
    """Categorize unmapped defines by type."""
    categories = {
        'thermal': [],
        'motion': [],
        'hardware': [],
        'safety': [],
        'features': [],
        'display': [],
        'communication': [],
        'other': []
    }
    
    for define in defines:
        if define in mapped_fields:
            continue
            
        define_lower = define.lower()
        
        if any(x in define_lower for x in ['temp', 'thermal', 'pid', 'heat', 'cool']):
            categories['thermal'].append(define)
        elif any(x in define_lower for x in ['feed', 'accel', 'jerk', 'step', 'max_pos', 'min_pos']):
            categories['motion'].append(define)
        elif any(x in define_lower for x in ['board', 'pin', 'driver', 'motor', 'serial']):
            categories['hardware'].append(define)
        elif any(x in define_lower for x in ['protection', 'safety', 'endstop', 'watchdog']):
            categories['safety'].append(define)
        elif any(x in define_lower for x in ['enable', 'disable', 'support', 'feature']):
            categories['features'].append(define)
        elif any(x in define_lower for x in ['lcd', 'display', 'screen', 'menu']):
            categories['display'].append(define)
        elif any(x in define_lower for x in ['baud', 'serial', 'usb', 'buffer']):
            categories['communication'].append(define)
        else:
            categories['other'].append(define)
    
    return categories

def main():
    print("=" * 80)
    print("TH3D Configuration Field Mapping Checker")
    print("=" * 80)
    print()
    
    # Step 1: Extract defines from config files
    print("📂 Step 1: Extracting #define statements from config files...")
    print()
    all_defines = set()
    defines_by_file = {}
    
    for config_file in CONFIG_FILES:
        defines = extract_defines_from_config(config_file)
        defines_by_file[config_file] = defines
        all_defines.update(defines)
        print(f"  ✅ {Path(config_file).name}: {len(defines)} defines found")
    
    print(f"\n  📊 Total unique defines: {len(all_defines)}")
    print()
    
    # Step 2: Load mapped fields
    print("🗺️  Step 2: Loading mapped fields from JSON files...")
    print()
    mapped_fields = load_mapped_fields()
    print(f"\n  📊 Total mapped fields: {len(mapped_fields)}")
    print()
    
    # Step 3: Find unmapped defines
    print("🔍 Step 3: Finding unmapped defines...")
    print()
    unmapped = all_defines - mapped_fields
    if len(all_defines) > 0:
        print(f"  📊 Unmapped defines: {len(unmapped)} / {len(all_defines)} ({len(unmapped)/len(all_defines)*100:.1f}%)")
    else:
        print(f"  📊 Unmapped defines: {len(unmapped)} (no defines found in config files)")
    print()
    
    # Step 4: Check critical defines
    print("⚠️  Step 4: Checking critical defines...")
    print()
    missing_critical = []
    for critical in CRITICAL_DEFINES:
        if critical not in mapped_fields:
            missing_critical.append(critical)
            print(f"  ❌ CRITICAL: {critical} is NOT mapped!")
        else:
            print(f"  ✅ {critical} is mapped")
    print()
    
    # Step 5: Categorize unmapped defines
    if unmapped:
        print("📋 Step 5: Categorizing unmapped defines...")
        print()
        categories = categorize_unmapped(unmapped, mapped_fields)
        
        for category, defines in categories.items():
            if defines:
                print(f"\n  📦 {category.upper()} ({len(defines)}):")
                for define in sorted(defines)[:10]:  # Show first 10
                    print(f"     - {define}")
                if len(defines) > 10:
                    print(f"     ... and {len(defines) - 10} more")
    
    # Step 6: Generate report
    print("\n" + "=" * 80)
    print("📊 SUMMARY REPORT")
    print("=" * 80)
    print(f"Total defines in config files: {len(all_defines)}")
    print(f"Total mapped in JSON files: {len(mapped_fields)}")
    print(f"Unmapped defines: {len(unmapped)}")
    if len(all_defines) > 0:
        print(f"Mapping coverage: {(len(mapped_fields)/len(all_defines)*100):.1f}%")
    else:
        print(f"Mapping coverage: N/A (no defines found in config files)")
    
    if missing_critical:
        print(f"\n⚠️  CRITICAL MISSING: {len(missing_critical)} critical fields not mapped:")
        for field in missing_critical:
            print(f"   - {field}")
    else:
        print("\n✅ All critical fields are mapped!")
    
    # Save detailed report
    report_file = "firmware-helper/mapping-coverage-report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("TH3D Configuration Field Mapping Coverage Report\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Total defines: {len(all_defines)}\n")
        f.write(f"Mapped: {len(mapped_fields)}\n")
        f.write(f"Unmapped: {len(unmapped)}\n")
        f.write(f"Coverage: {(len(mapped_fields)/len(all_defines)*100):.1f}%\n\n")
        
        f.write("UNMAPPED DEFINES:\n")
        f.write("-" * 80 + "\n")
        for define in sorted(unmapped):
            f.write(f"{define}\n")
    
    print(f"\n💾 Detailed report saved to: {report_file}")
    print()

if __name__ == "__main__":
    main()
