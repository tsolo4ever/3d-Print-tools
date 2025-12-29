#!/usr/bin/env python3
"""
Create Comprehensive Marlin Configuration Mappings
Extracts ALL #defines from Configuration.h files and creates versioned, split mapping files.

Usage:
    python create-comprehensive-mappings.py [--marlin-version 2.1.x] [--config-path path/to/config.h]
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict

class ConfigParser:
    """Parse Marlin Configuration.h files and extract all #defines"""
    
    def __init__(self, config_path: Path):
        self.config_path = config_path
        self.defines = {}
        self.comments = {}
        self.line_numbers = {}
        self.conditionals = {}  # Track conditional dependencies
        self.conditional_stack = []  # Stack of active conditional blocks
        
    def parse(self) -> Dict[str, Any]:
        """Parse the configuration file and extract all defines"""
        with open(self.config_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        current_comment = []
        
        for line_num, line in enumerate(lines, 1):
            line = line.rstrip()
            stripped = line.strip()
            
            # Track preprocessor conditionals
            if self._is_conditional_directive(stripped):
                self._handle_conditional(stripped, line_num)
            
            # Collect comments
            if stripped.startswith('//') and not stripped.startswith('//#'):
                current_comment.append(stripped[2:].strip())
                continue
            
            # Parse #define statements
            define_match = re.match(r'^\s*#define\s+(\w+)(?:\s+(.+?))?(?:\s*//.*)?$', line)
            if define_match:
                name = define_match.group(1)
                value = define_match.group(2).strip() if define_match.group(2) else None
                
                self.defines[name] = value
                self.line_numbers[name] = line_num
                if current_comment:
                    self.comments[name] = ' '.join(current_comment)
                
                # Track conditional dependencies
                if self.conditional_stack:
                    self.conditionals[name] = [cond for cond in self.conditional_stack]
                
                current_comment = []
                continue
            
            # Parse //#define (disabled) statements
            disabled_match = re.match(r'^\s*//\s*#define\s+(\w+)(?:\s+(.+?))?(?:\s*//.*)?$', line)
            if disabled_match:
                name = disabled_match.group(1)
                value = disabled_match.group(2).strip() if disabled_match.group(2) else None
                
                self.defines[name] = {
                    'value': value,
                    'disabled': True
                }
                self.line_numbers[name] = line_num
                if current_comment:
                    self.comments[name] = ' '.join(current_comment)
                
                # Track conditional dependencies for disabled defines too
                if self.conditional_stack:
                    self.conditionals[name] = [cond for cond in self.conditional_stack]
                
                current_comment = []
                continue
            
            # Clear comments if not a define
            if stripped and not stripped.startswith('//'):
                current_comment = []
        
        return self.defines
    
    def _is_conditional_directive(self, line: str) -> bool:
        """Check if line is a preprocessor conditional directive"""
        return line.startswith(('#if ', '#ifdef ', '#ifndef ', '#elif ', '#else', '#endif'))
    
    def _handle_conditional(self, line: str, line_num: int):
        """Handle preprocessor conditional directives"""
        # #endif - pop from stack
        if line.startswith('#endif'):
            if self.conditional_stack:
                self.conditional_stack.pop()
            return
        
        # #else - replace top of stack with negated condition
        if line.startswith('#else'):
            if self.conditional_stack:
                last_cond = self.conditional_stack.pop()
                # Mark as inverted/else block
                self.conditional_stack.append({'type': 'else', 'parent': last_cond})
            return
        
        # #elif - pop and push new condition
        if line.startswith('#elif '):
            if self.conditional_stack:
                self.conditional_stack.pop()
            condition = self._extract_condition(line[6:])
            if condition:
                self.conditional_stack.append(condition)
            return
        
        # #if, #ifdef, #ifndef - push to stack
        if line.startswith('#ifdef '):
            condition = self._extract_condition(line[7:])
            if condition:
                self.conditional_stack.append({'type': 'ifdef', 'condition': condition})
        elif line.startswith('#ifndef '):
            condition = self._extract_condition(line[8:])
            if condition:
                self.conditional_stack.append({'type': 'ifndef', 'condition': condition})
        elif line.startswith('#if '):
            condition = self._extract_condition(line[4:])
            if condition:
                self.conditional_stack.append({'type': 'if', 'condition': condition})
    
    def _extract_condition(self, condition_text: str) -> Optional[Dict[str, Any]]:
        """Extract the condition from preprocessor directive"""
        condition_text = condition_text.strip()
        
        # Remove comments
        if '//' in condition_text:
            condition_text = condition_text[:condition_text.index('//')].strip()
        
        if not condition_text:
            return None
        
        # Parse complex conditions (defined(), &&, ||, !)
        # For now, extract all identifiers as potential dependencies
        identifiers = re.findall(r'\b[A-Z_][A-Z0-9_]*\b', condition_text)
        
        # Filter out common C keywords
        keywords = {'defined', 'ENABLED', 'DISABLED', 'ANY', 'ALL', 'NONE'}
        dependencies = [id for id in identifiers if id not in keywords]
        
        return {
            'expression': condition_text,
            'dependencies': dependencies
        }
    
    def get_define_info(self, name: str) -> Dict[str, Any]:
        """Get complete information about a define"""
        info = {
            'name': name,
            'value': self.defines.get(name),
            'lineNumber': self.line_numbers.get(name),
            'comment': self.comments.get(name),
            'type': self._infer_type(self.defines.get(name)),
            'isConditional': name in self.conditionals
        }
        
        # Check if disabled
        if isinstance(info['value'], dict) and info['value'].get('disabled'):
            info['disabled'] = True
            info['value'] = info['value'].get('value')
        
        # Add conditional information
        if name in self.conditionals:
            conditionals_list = self.conditionals[name]
            info['conditionalBlocks'] = conditionals_list
            
            # Extract simple dependency list
            dependencies = []
            for cond in conditionals_list:
                if isinstance(cond, dict):
                    if cond.get('type') == 'else':
                        # Handle else blocks
                        parent = cond.get('parent', {})
                        if isinstance(parent, dict):
                            # Check if parent has dependencies directly
                            if 'dependencies' in parent:
                                dependencies.extend([f"!{dep}" for dep in parent['dependencies']])
                            # Or if parent has a nested condition dict
                            elif 'condition' in parent and isinstance(parent['condition'], dict):
                                if 'dependencies' in parent['condition']:
                                    dependencies.extend([f"!{dep}" for dep in parent['condition']['dependencies']])
                    # Check for dependencies at top level
                    elif 'dependencies' in cond:
                        dependencies.extend(cond['dependencies'])
                    # Check for nested condition dict (from #ifdef, #ifndef, #if)
                    elif 'condition' in cond and isinstance(cond['condition'], dict):
                        if 'dependencies' in cond['condition']:
                            # For #ifndef, negate the dependencies
                            if cond.get('type') == 'ifndef':
                                dependencies.extend([f"!{dep}" for dep in cond['condition']['dependencies']])
                            else:
                                dependencies.extend(cond['condition']['dependencies'])
            
            info['conditionalDependencies'] = list(set(dependencies))  # Remove duplicates
        
        return info
    
    def _infer_type(self, value: Any) -> str:
        """Infer the type of a define value"""
        if value is None:
            return 'boolean'
        
        if isinstance(value, dict):
            value = value.get('value')
        
        if value is None:
            return 'boolean'
        
        # Check for string (double or single quoted)
        if (value.startswith('"') and value.endswith('"')) or \
           (value.startswith("'") and value.endswith("'")):
            return 'string'
        
        # Check for array
        if value.startswith('{') and value.endswith('}'):
            return 'array'
        
        # Check for integer
        try:
            int(value)
            return 'integer'
        except ValueError:
            pass
        
        # Check for float
        try:
            float(value)
            return 'float'
        except ValueError:
            pass
        
        # Default to string/define reference
        return 'define'


class MappingBuilder:
    """Build comprehensive mapping files from parsed configuration"""
    
    def __init__(self, parser: ConfigParser, ui_metadata: Optional[Dict] = None):
        self.parser = parser
        self.ui_metadata = ui_metadata or {}
        self.categories = self._categorize_defines()
        
    def _categorize_defines(self) -> Dict[str, List[str]]:
        """Categorize defines into logical groups"""
        categories = defaultdict(list)
        
        # Define category patterns (order matters!)
        patterns = {
            'basic': [
                'CONFIGURATION_H_VERSION', 'CUSTOM_MACHINE_NAME', 'MACHINE_UUID',
                'STRING_CONFIG_H_AUTHOR', 'SHOW_BOOTSCREEN', 'SHOW_CUSTOM_BOOTSCREEN',
                'BAUDRATE', 'SERIAL_PORT', 'MOTHERBOARD', 'EXTRUDERS',
                'DEFAULT_NOMINAL_FILAMENT_DIA'
            ],
            'hardware': [
                'DRIVER_TYPE', 'BOARD_', 'TEMP_SENSOR', 'HEATER_',
                'DISPLAY', 'LCD', 'CONTROLLER'
            ],
            'temperature': [
                'TEMP', 'PID', 'HEATER', 'THERMAL_PROTECTION',
                'PREHEAT', 'EXTRUDE_MINTEMP', 'BED_'
            ],
            'geometry': [
                'BED_SIZE', 'MIN_POS', 'MAX_POS', 'TRAVEL_LIMITS',
                'BED_CENTER', 'MANUAL_'
            ],
            'motion': [
                'AXIS_STEPS', 'FEEDRATE', 'ACCELERATION', 'JERK',
                'JUNCTION_DEVIATION', 'S_CURVE', 'LIN_ADVANCE'
            ],
            'endstops': [
                'ENDSTOP', 'HOME_', 'USE_XMIN', 'USE_XMAX',
                'HOMING_FEEDRATE', 'VALIDATE_HOMING'
            ],
            'probe': [
                'PROBE', 'BLTOUCH', 'FIX_MOUNTED', 'NOZZLE_TO_PROBE',
                'PROBE_OFFSET', 'Z_MIN_PROBE', 'MULTIPLE_PROBING'
            ],
            'bedLeveling': [
                'BED_LEVELING', 'MESH_', 'AUTO_BED_LEVELING', 'GRID_MAX_POINTS',
                'RESTORE_LEVELING', 'ENABLE_LEVELING_FADE', 'Z_SAFE_HOMING'
            ],
            'safety': [
                'THERMAL_PROTECTION', 'PREVENT_', 'EXTRUDE_MAXLENGTH',
                'SOFTWARE_ENDSTOPS', 'MIN_SOFTWARE', 'MAX_SOFTWARE',
                'POWER_LOSS_RECOVERY'
            ],
            'features': [
                'EEPROM', 'SDSUPPORT', 'SD_', 'EMERGENCY_PARSER',
                'HOST_ACTION', 'PRINTCOUNTER', 'NOZZLE_PARK'
            ],
            'advanced': [
                'ARC_SUPPORT', 'BEZIER', 'JUNCTION', 'INPUT_SHAPING',
                'ADAPTIVE_', 'FILAMENT_RUNOUT', 'ADVANCED_PAUSE'
            ]
        }
        
        # Categorize each define
        for define_name in self.parser.defines.keys():
            categorized = False
            
            for category, keywords in patterns.items():
                for keyword in keywords:
                    if keyword in define_name:
                        categories[category].append(define_name)
                        categorized = True
                        break
                if categorized:
                    break
            
            # Uncategorized goes to 'other'
            if not categorized:
                categories['other'].append(define_name)
        
        return dict(categories)
    
    def build_mapping(self, category: str) -> Dict[str, Any]:
        """Build mapping for a specific category"""
        mapping = {}
        
        for define_name in self.categories.get(category, []):
            info = self.parser.get_define_info(define_name)
            
            # Create field key (convert DEFINE_NAME to defineN ame format)
            field_key = self._define_to_field_key(define_name)
            
            # Build mapping entry
            entry = {
                'mapsFrom': [define_name],
                'type': info['type'],
                'required': not info.get('disabled', False),
                'fileLocation': 'Configuration.h',
                'lineNumber': info['lineNumber']
            }
            
            # Add conditional information
            if info.get('isConditional'):
                entry['isConditional'] = True
                
                # Add conditional dependencies (simplified list)
                if info.get('conditionalDependencies'):
                    deps = info['conditionalDependencies']
                    
                    # Separate positive and negative dependencies
                    positive_deps = [d for d in deps if not d.startswith('!')]
                    negative_deps = [d[1:] for d in deps if d.startswith('!')]
                    
                    if positive_deps:
                        entry['conditionalOn'] = positive_deps
                    if negative_deps:
                        entry['conditionalOnNot'] = negative_deps
                
                # Add full conditional block information for reference
                if info.get('conditionalBlocks'):
                    conditional_expressions = []
                    for block in info['conditionalBlocks']:
                        if isinstance(block, dict):
                            if block.get('type') == 'else':
                                conditional_expressions.append('else block')
                            elif 'expression' in block:
                                conditional_expressions.append(block['expression'])
                    
                    if conditional_expressions:
                        entry['conditionalExpression'] = conditional_expressions
            
            # Add value as example if present
            if info['value']:
                entry['examples'] = [info['value']]
            
            # Add comment/notes
            if info.get('comment'):
                entry['notes'] = info['comment']
            
            # Add UI metadata if available
            ui_key = f"{category}.{field_key}"
            if ui_key in self.ui_metadata:
                entry.update(self.ui_metadata[ui_key])
            
            mapping[field_key] = entry
        
        return mapping
    
    def _define_to_field_key(self, define_name: str) -> str:
        """Convert DEFINE_NAME to camelCase field key"""
        # Remove common prefixes
        name = define_name
        for prefix in ['DEFAULT_', 'ENABLE_', 'USE_', 'HAS_']:
            if name.startswith(prefix):
                name = name[len(prefix):]
                break
        
        # Convert to camelCase
        parts = name.split('_')
        if len(parts) == 1:
            return parts[0].lower()
        
        return parts[0].lower() + ''.join(p.capitalize() for p in parts[1:])
    
    def build_all_mappings(self) -> Dict[str, Dict[str, Any]]:
        """Build mappings for all categories"""
        all_mappings = {}
        
        for category in self.categories.keys():
            category_mapping = self.build_mapping(category)
            if category_mapping:
                all_mappings[category] = category_mapping
        
        return all_mappings
    
    def split_by_line_count(self, mapping: Dict, max_lines: int = 900) -> List[Tuple[str, Dict]]:
        """Split mapping into multiple parts if too large"""
        parts = []
        current_part = {}
        current_lines = 50  # Header overhead
        part_num = 1
        
        for category, fields in mapping.items():
            # If category has too many fields, split it
            if len(fields) > 50:  # Large category
                # Split large category into chunks
                field_items = list(fields.items())
                chunk_size = 30
                for i in range(0, len(field_items), chunk_size):
                    chunk = dict(field_items[i:i+chunk_size])
                    chunk_json = json.dumps({f"{category}_{i//chunk_size + 1}": chunk}, indent=2)
                    chunk_lines = len(chunk_json.split('\n'))
                    
                    if current_lines + chunk_lines > max_lines and current_part:
                        parts.append((f'-part{part_num}', dict(current_part)))
                        current_part = {}
                        current_lines = 50
                        part_num += 1
                    
                    current_part[f"{category}_{i//chunk_size + 1}"] = chunk
                    current_lines += chunk_lines
            else:
                # Small category - add as-is
                category_json = json.dumps({category: fields}, indent=2)
                category_lines = len(category_json.split('\n'))
                
                if current_lines + category_lines > max_lines and current_part:
                    parts.append((f'-part{part_num}', dict(current_part)))
                    current_part = {}
                    current_lines = 50
                    part_num += 1
                
                current_part[category] = fields
                current_lines += category_lines
        
        # Add final part
        if current_part:
            parts.append((f'-part{part_num}', current_part))
        
        return parts if parts else [('', mapping)]


def load_ui_metadata(analysis_file: Path) -> Dict[str, Dict[str, Any]]:
    """Load UI metadata from TAB_FIELD_ANALYSIS.md"""
    # TODO: Implement parsing of TAB_FIELD_ANALYSIS.md
    # For now, return empty dict
    return {}


def main():
    parser = argparse.ArgumentParser(description='Create comprehensive Marlin configuration mappings')
    parser.add_argument('--config', type=Path, default=Path('firmware-helper/example-ender5plus-config.h'),
                       help='Path to Configuration.h file')
    parser.add_argument('--version', default='2.1.x', help='Marlin version')
    parser.add_argument('--firmware', default='marlin', help='Firmware type (marlin/th3d)')
    parser.add_argument('--output-dir', type=Path, default=Path('assets/data/maps'),
                       help='Output directory for mappings')
    parser.add_argument('--max-lines', type=int, default=900,
                       help='Maximum lines per mapping file')
    
    args = parser.parse_args()
    
    print(f"🔧 Parsing {args.config}...")
    config_parser = ConfigParser(args.config)
    defines = config_parser.parse()
    print(f"✅ Found {len(defines)} #define statements")
    
    print(f"\n📊 Building comprehensive mappings...")
    ui_metadata = load_ui_metadata(Path('assets/js/profile-renderer/TAB_FIELD_ANALYSIS.md'))
    builder = MappingBuilder(config_parser, ui_metadata)
    all_mappings = builder.build_all_mappings()
    
    print(f"✅ Created {len(all_mappings)} category mappings:")
    for category, fields in all_mappings.items():
        print(f"   • {category}: {len(fields)} fields")
    
    print(f"\n✂️  Splitting into parts (<{args.max_lines} lines each)...")
    parts = builder.split_by_line_count(all_mappings, args.max_lines)
    
    # Create versioned output directory
    output_base = args.output_dir / args.firmware / args.version
    output_base.mkdir(parents=True, exist_ok=True)
    
    # Extract source filename for naming
    source_name = args.config.stem.replace('example-', '').replace('example-th3d-ender5plus-', '')
    config_suffix = ''
    if '_adv' in source_name:
        config_suffix = '-adv'
    elif '_backend' in source_name:
        config_suffix = '-backend'
    elif '_speed' in source_name:
        config_suffix = '-speed'
    
    print(f"\n💾 Saving {len(parts)} mapping file(s) to {output_base}/...")
    for part_suffix, mapping_data in parts:
        filename = f"{args.firmware}-config{config_suffix}-mapping{part_suffix}.json"
        output_path = output_base / filename
        
        # Add metadata
        output_data = {
            '$schema': f'{args.firmware.capitalize()} Configuration Field Mapping',
            'version': args.version,
            'firmware': args.firmware,
            'configFile': 'Configuration.h',
            'generatedFrom': str(args.config),
            'totalDefines': len(defines),
            **mapping_data
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)
        
        lines = len(open(output_path).readlines())
        print(f"   ✅ {filename} ({lines} lines)")
    
    print(f"\n✨ Complete! Generated comprehensive mappings for {args.firmware} {args.version}")
    print(f"📁 Output location: {output_base}/")


if __name__ == '__main__':
    main()
