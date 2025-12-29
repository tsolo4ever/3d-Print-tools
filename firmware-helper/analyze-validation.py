#!/usr/bin/env python3
"""
Validation Analyzer - Pass 3
Analyzes Configuration.h files for validation rules and adds them to mappings.

Extracts from comments:
- Allowed values: // :['A', 'B', 'C'] or // :[0, 1, 2]
- Units: // (mm), // (°C), // (mm/s)
- Ranges: // 0-255, // 1.0-10.0
- Descriptions

Usage:
    python analyze-validation.py --mapping-dir assets/data/maps/marlin/2.1.x --config assets/data/marlin-configs/config/default/Configuration.h
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

class ValidationAnalyzer:
    """Extract validation rules from Configuration.h comments"""
    
    def __init__(self, config_path: Path):
        self.config_path = config_path
        self.validation_map = {}  # Maps define name to validation info
        
    def analyze(self):
        """Parse config file and extract validation rules"""
        with open(self.config_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, 1):
            # Parse #define statements with inline comments
            define_match = re.match(r'^\s*#define\s+(\w+)(?:\s+[^/]+)?\s*//\s*(.+)$', line)
            if define_match:
                define_name = define_match.group(1)
                comment = define_match.group(2).strip()
                validation = self._extract_validation(comment)
                if validation:
                    self.validation_map[define_name] = validation
            
            # Also check disabled defines
            disabled_match = re.match(r'^\s*//\s*#define\s+(\w+)(?:\s+[^/]+)?\s*//\s*(.+)$', line)
            if disabled_match:
                define_name = disabled_match.group(1)
                comment = disabled_match.group(2).strip()
                validation = self._extract_validation(comment)
                if validation:
                    self.validation_map[define_name] = validation
    
    def _extract_validation(self, comment: str) -> Optional[Dict[str, Any]]:
        """Extract validation info from a comment"""
        validation = {}
        
        # Extract allowed values: :['A', 'B', 'C'] or :[0, 1, 2, 3]
        allowed_match = re.search(r':\s*\[([^\]]+)\]', comment)
        if allowed_match:
            allowed_str = allowed_match.group(1)
            # Parse the list
            allowed_values = []
            # Handle quoted strings
            for match in re.finditer(r"'([^']*)'|\"([^\"]*)\"|(-?\d+\.?\d*)", allowed_str):
                if match.group(1):  # Single quote
                    allowed_values.append(match.group(1))
                elif match.group(2):  # Double quote
                    allowed_values.append(match.group(2))
                elif match.group(3):  # Number
                    num_str = match.group(3)
                    if '.' in num_str:
                        allowed_values.append(float(num_str))
                    else:
                        allowed_values.append(int(num_str))
            
            if allowed_values:
                validation['allowedValues'] = allowed_values
        
        # Extract unit: (mm), (°C), (mm/s), etc.
        unit_match = re.search(r'\(([^)]+)\)', comment)
        if unit_match:
            unit = unit_match.group(1)
            # Expanded unit detection - any reasonable unit pattern
            unit_patterns = [
                r'^[a-zA-Z°µ]+(/[a-zA-Z]+)?[²³]?$',  # mm, mm/s, mm/s², °C, µs
                r'^\d+\s*[a-zA-Z]+$',  # 16bit, 8-bit
                r'^%$',  # percentage
                r'^steps/mm$',  # steps per mm
            ]
            if any(re.match(pattern, unit) for pattern in unit_patterns):
                validation['unit'] = unit
        
        # Extract range: 0-255, 1.0-10.0, -100 to 100
        range_match = re.search(r'(-?\d+\.?\d*)\s*[-–to]+\s*(-?\d+\.?\d*)', comment)
        if range_match:
            min_val = range_match.group(1)
            max_val = range_match.group(2)
            
            if '.' in min_val or '.' in max_val:
                validation['min'] = float(min_val)
                validation['max'] = float(max_val)
            else:
                validation['min'] = int(min_val)
                validation['max'] = int(max_val)
        else:
            # Check for "minimum X" or "at least X"
            min_match = re.search(r'(?:minimum|min|at least|>=?)\s+(-?\d+\.?\d*)', comment, re.IGNORECASE)
            if min_match:
                min_val = min_match.group(1)
                validation['min'] = float(min_val) if '.' in min_val else int(min_val)
            
            # Check for "maximum X" or "up to X"
            max_match = re.search(r'(?:maximum|max|up to|<=?)\s+(-?\d+\.?\d*)', comment, re.IGNORECASE)
            if max_match:
                max_val = max_match.group(1)
                validation['max'] = float(max_val) if '.' in max_val else int(max_val)
        
        # Check for deprecation warning
        if re.search(r'\b(deprecated|obsolete|legacy)\b', comment, re.IGNORECASE):
            validation['deprecated'] = True
        
        # Check for "requires" or "needs" dependencies
        requires_match = re.search(r'(?:requires?|needs?)\s+(\w+)', comment, re.IGNORECASE)
        if requires_match:
            validation['requires'] = [requires_match.group(1)]
        
        # Extract description (everything before special markers)
        description = comment
        # Remove allowed values
        description = re.sub(r':\s*\[[^\]]+\]', '', description)
        # Remove units
        description = re.sub(r'\([^)]+\)', '', description)
        # Remove ranges
        description = re.sub(r'-?\d+\.?\d*\s*[-–to]+\s*-?\d+\.?\d*', '', description)
        # Remove deprecation markers
        description = re.sub(r'\b(deprecated|obsolete|legacy)\b', '', description, flags=re.IGNORECASE)
        # Clean up
        description = description.strip()
        description = re.sub(r'\s+', ' ', description)  # Collapse whitespace
        
        if description and len(description) > 5:
            validation['description'] = description
        
        return validation if validation else None
    
    def get_validation_info(self, define_name: str) -> Optional[Dict[str, Any]]:
        """Get validation information for a define"""
        return self.validation_map.get(define_name)


def update_mapping_file(mapping_file: Path, analyzer: ValidationAnalyzer):
    """Update a single mapping file with validation information"""
    print(f"   Processing {mapping_file.name}...")
    
    with open(mapping_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines'}
    
    for category_name, category_fields in data.items():
        if category_name in metadata_keys or not isinstance(category_fields, dict):
            continue
        
        for field_name, field_data in category_fields.items():
            if not isinstance(field_data, dict):
                continue
            
            # Get the define name
            maps_from = field_data.get('mapsFrom', [])
            if not maps_from:
                continue
            
            define_name = maps_from[0]
            
            # Get validation info
            validation = analyzer.get_validation_info(define_name)
            
            if validation:
                # Add validation fields
                if 'allowedValues' in validation:
                    field_data['allowedValues'] = validation['allowedValues']
                
                if 'min' in validation:
                    field_data['min'] = validation['min']
                
                if 'max' in validation:
                    field_data['max'] = validation['max']
                
                if 'unit' in validation:
                    field_data['unit'] = validation['unit']
                
                if 'deprecated' in validation:
                    field_data['deprecated'] = validation['deprecated']
                
                if 'requires' in validation:
                    # Merge with existing requires if present
                    existing_requires = field_data.get('requires', [])
                    combined = list(set(existing_requires + validation['requires']))
                    field_data['requires'] = combined
                
                if 'description' in validation:
                    # Add to notes if not already present
                    if 'notes' in field_data:
                        field_data['notes'] = f"{validation['description']}. {field_data['notes']}"
                    else:
                        field_data['notes'] = validation['description']
                
                updated_count += 1
    
    # Write updated file
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"      ✅ Updated {updated_count} fields with validation")


def main():
    parser = argparse.ArgumentParser(description='Analyze validation rules and update mapping files')
    parser.add_argument('--mapping-dir', type=Path, required=True,
                       help='Directory containing mapping files')
    parser.add_argument('--config', type=Path, required=True,
                       help='Configuration.h file to analyze')
    parser.add_argument('--pattern', default='*-mapping-part*.json',
                       help='Glob pattern for mapping files')
    
    args = parser.parse_args()
    
    print(f"🔍 Analyzing validation rules in {args.config}...")
    analyzer = ValidationAnalyzer(args.config)
    analyzer.analyze()
    
    validation_count = len(analyzer.validation_map)
    print(f"✅ Found validation rules for {validation_count} defines")
    
    # Find mapping files
    mapping_files = sorted(args.mapping_dir.glob(args.pattern))
    print(f"\n📝 Updating {len(mapping_files)} mapping files...")
    
    for mapping_file in mapping_files:
        update_mapping_file(mapping_file, analyzer)
    
    print(f"\n✨ Complete! Added validation metadata to {len(mapping_files)} files")
    print(f"\n💡 Three-Pass Workflow Complete:")
    print(f"   Pass 1: create-comprehensive-mappings.py (basic structure)")
    print(f"   Pass 2: analyze-conditionals.py (conditional dependencies)")
    print(f"   Pass 3: analyze-validation.py (validation rules)")


if __name__ == '__main__':
    main()
