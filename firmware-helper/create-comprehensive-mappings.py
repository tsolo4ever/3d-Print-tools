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


def scan_config_directory(base_dir: Path = Path('new configs')) -> List[Tuple[str, str, Path]]:
    """
    Scan the new configs directory structure and find all .h files.
    Returns list of (firmware_type, version, config_file_path) tuples.
    """
    config_files = []
    
    if not base_dir.exists():
        return config_files
    
    # Scan firmware directories (marlin, th3d)
    for firmware_dir in base_dir.iterdir():
        if not firmware_dir.is_dir():
            continue
        
        firmware_type = firmware_dir.name
        
        # Scan version directories (2.0.x, 2.1.x, 3.0.x, etc.)
        for version_dir in firmware_dir.iterdir():
            if not version_dir.is_dir():
                continue
            
            version = version_dir.name
            
            # Find all .h files in this version directory
            for config_file in version_dir.glob('*.h'):
                config_files.append((firmware_type, version, config_file))
    
    return config_files


def process_single_config(config_path: Path, firmware: str, version: str, 
                         output_dir: Path, max_lines: int, skip_organization: bool = False):
    """Process a single configuration file and generate mappings with organized structure"""
    print(f"\n{'='*60}")
    print(f"🔧 Parsing {config_path.name}...")
    print(f"   Firmware: {firmware}")
    print(f"   Version: {version}")
    
    config_parser = ConfigParser(config_path)
    defines = config_parser.parse()
    print(f"✅ Found {len(defines)} #define statements")
    
    print(f"\n📊 Building comprehensive mappings...")
    ui_metadata = load_ui_metadata(Path('assets/js/profile-renderer/TAB_FIELD_ANALYSIS.md'))
    builder = MappingBuilder(config_parser, ui_metadata)
    all_mappings = builder.build_all_mappings()
    
    print(f"✅ Created {len(all_mappings)} category mappings:")
    for category, fields in all_mappings.items():
        print(f"   • {category}: {len(fields)} fields")
    
    print(f"\n✂️  Splitting into parts (<{max_lines} lines each)...")
    parts = builder.split_by_line_count(all_mappings, max_lines)
    
    # Extract source filename for naming
    source_name = config_path.stem.replace('example-', '').replace('example-th3d-ender5plus-', '')
    config_suffix = ''
    if '_adv' in source_name:
        config_suffix = '-adv'
    elif '_backend' in source_name:
        config_suffix = '-backend'
    elif '_speed' in source_name:
        config_suffix = '-speed'
    
    # Metadata for output files
    metadata = {
        '$schema': f'{firmware.capitalize()} Configuration Field Mapping',
        'version': version,
        'firmware': firmware,
        'configFile': config_path.name,
        'generatedFrom': str(config_path),
        'totalDefines': len(defines)
    }
    
    # LEGACY MODE: Save directly to version folder (old behavior)
    if skip_organization:
        output_base = output_dir / firmware / version
        output_base.mkdir(parents=True, exist_ok=True)
        
        print(f"\n💾 Saving {len(parts)} mapping file(s) to {output_base}/...")
        for part_suffix, mapping_data in parts:
            filename = f"{firmware}-config{config_suffix}-mapping{part_suffix}.json"
            output_path = output_base / filename
            
            output_data = {**metadata, **mapping_data}
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2)
            
            lines = len(open(output_path).readlines())
            print(f"   ✅ {filename} ({lines} lines)")
        
        print(f"✨ Complete! Generated mappings for {firmware} {version}")
        print(f"📁 Output location: {output_base}/")
        return
    
    # NEW ORGANIZED MODE: Create full/ and core/ subdirectories
    print(f"\n🗂️  Creating organized structure: full/ and core/...")
    
    # Create directory structure
    output_base = output_dir / firmware / version
    full_dir = output_base / 'full'
    core_dir = output_base / 'core'
    full_dir.mkdir(parents=True, exist_ok=True)
    core_dir.mkdir(parents=True, exist_ok=True)
    
    # Step 1: Save part files to full/ directory
    print(f"\n💾 Step 1: Saving {len(parts)} part file(s) to full/...")
    for part_suffix, mapping_data in parts:
        filename = f"{firmware}-config{config_suffix}-mapping{part_suffix}.json"
        output_path = full_dir / filename
        
        output_data = {**metadata, **mapping_data}
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)
        
        lines = len(open(output_path).readlines())
        print(f"   ✅ {filename} ({lines} lines)")
    
    # Step 2: Create consolidated full mapping
    print(f"\n📦 Step 2: Creating consolidated full mapping...")
    consolidated_full = consolidate_parts(parts, metadata)
    full_filename = f"{firmware}-config{config_suffix}-mapping-full.json"
    full_path = full_dir / full_filename
    
    with open(full_path, 'w', encoding='utf-8') as f:
        json.dump(consolidated_full, f, indent=2)
    
    print(f"   ✅ {full_filename} ({len(consolidated_full.get('totalDefines', 0))} defines)")
    
    # Step 3: Split into core and full versions
    print(f"\n🎯 Step 3: Splitting core fields from full mapping...")
    try:
        core_fields = load_core_fields()
        print(f"   ✅ Loaded {len(core_fields)} core field definitions")
    except Exception as e:
        print(f"   ⚠️  Warning: Could not load CORE_FIELDS: {e}")
        print(f"   ⏭️  Skipping core/full split")
        return
    
    core_mapping, full_mapping = split_into_core_and_full(consolidated_full, core_fields)
    core_count = core_mapping.get('coreDefines', 0)
    print(f"   ✅ Extracted {core_count} core fields")
    
    # Save updated full mapping (with fullDefines count)
    with open(full_path, 'w', encoding='utf-8') as f:
        json.dump(full_mapping, f, indent=2)
    print(f"   ✅ Updated {full_filename} with fullDefines metadata")
    
    # Step 4: Save core mapping
    print(f"\n💎 Step 4: Saving core mapping to core/...")
    core_filename = f"{firmware}-config{config_suffix}-mapping-core.json"
    core_path = core_dir / core_filename
    
    with open(core_path, 'w', encoding='utf-8') as f:
        json.dump(core_mapping, f, indent=2)
    
    print(f"   ✅ {core_filename} ({core_count} core defines)")
    
    # Step 5: Add UI field mappings to core files
    print(f"\n🎨 Step 5: Adding UI field mappings to core file...")
    try:
        ui_mappings = load_ui_mappings()
        print(f"   ✅ Loaded {len(ui_mappings)} UI field mappings")
        
        ui_count = add_ui_mappings_to_core(core_mapping, ui_mappings)
        
        # Save updated core mapping with UI fields
        with open(core_path, 'w', encoding='utf-8') as f:
            json.dump(core_mapping, f, indent=2)
        
        print(f"   ✅ Added {ui_count} UI field mappings to core file")
    except Exception as e:
        print(f"   ⚠️  Warning: Could not add UI mappings: {e}")
        print(f"   ℹ️  Core file saved without UI mappings")
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"✨ Complete! Generated organized mappings for {firmware} {version}")
    print(f"\n📁 Output structure:")
    print(f"   {output_base}/")
    print(f"   ├── full/")
    print(f"   │   ├── {len(parts)} part file(s)")
    print(f"   │   └── {full_filename} ({len(defines)} total defines)")
    print(f"   └── core/")
    print(f"       └── {core_filename} ({core_count} core defines, {ui_count if 'ui_count' in locals() else 0} UI mappings)")
    print(f"{'='*60}")


# Load CORE_FIELDS from split-core-mappings.py
def load_core_fields() -> set:
    """Load CORE_FIELDS set from split-core-mappings.py"""
    from importlib import util
    spec = util.spec_from_file_location("split_core_mappings", 
                                        Path(__file__).parent / "split-core-mappings.py")
    module = util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.CORE_FIELDS


# Load UI_FIELD_MAPPINGS from add-ui-mappings.py
def load_ui_mappings() -> Dict[str, str]:
    """Load UI_FIELD_MAPPINGS from add-ui-mappings.py"""
    from importlib import util
    spec = util.spec_from_file_location("add_ui_mappings",
                                        Path(__file__).parent / "add-ui-mappings.py")
    module = util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.UI_FIELD_MAPPINGS


def split_into_core_and_full(full_mapping: Dict, core_fields: set) -> Tuple[Dict, Dict]:
    """Split mapping into core (essential) and full (complete) versions"""
    core_mapping = {}
    full_mapping_copy = {}
    
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines'}
    
    for key, value in full_mapping.items():
        if key in metadata_keys:
            core_mapping[key] = value
            full_mapping_copy[key] = value
            continue
        
        if not isinstance(value, dict):
            continue
        
        # Check each field in this category
        core_category = {}
        full_category = {}
        
        for field_name, field_data in value.items():
            if not isinstance(field_data, dict):
                continue
            
            # Check if any of the mapsFrom defines are in core fields
            maps_from = field_data.get('mapsFrom', [])
            is_core = any(define in core_fields for define in maps_from)
            
            full_category[field_name] = field_data
            if is_core:
                core_category[field_name] = field_data
        
        if full_category:
            full_mapping_copy[key] = full_category
        if core_category:
            core_mapping[key] = core_category
    
    # Add core field count
    core_count = sum(len(cat) for cat in core_mapping.values() 
                    if isinstance(cat, dict) and not any(k in metadata_keys for k in [cat]))
    core_mapping['coreDefines'] = core_count
    full_mapping_copy['fullDefines'] = full_mapping_copy['totalDefines']
    
    return core_mapping, full_mapping_copy


def add_ui_mappings_to_core(core_mapping: Dict, ui_mappings: Dict[str, str]) -> int:
    """Add uiFieldId properties to core mapping fields"""
    updated_count = 0
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 
                     'totalDefines', 'coreDefines', 'fullDefines'}
    
    for category_name, category_fields in core_mapping.items():
        if category_name in metadata_keys or not isinstance(category_fields, dict):
            continue
        
        for field_name, field_data in category_fields.items():
            if not isinstance(field_data, dict):
                continue
            
            maps_from = field_data.get('mapsFrom', [])
            if not maps_from:
                continue
            
            define_name = maps_from[0]
            if define_name in ui_mappings:
                field_data['uiFieldId'] = ui_mappings[define_name]
                updated_count += 1
    
    return updated_count


def consolidate_parts(parts: List[Tuple[str, Dict]], metadata: Dict) -> Dict:
    """Consolidate part files into single full mapping"""
    consolidated = dict(metadata)
    
    for _, part_data in parts:
        for category, fields in part_data.items():
            if category in consolidated:
                # Merge with existing category
                if isinstance(consolidated[category], dict) and isinstance(fields, dict):
                    consolidated[category].update(fields)
            else:
                consolidated[category] = fields
    
    return consolidated


def main():
    parser = argparse.ArgumentParser(
        description='Create comprehensive Marlin configuration mappings with automated core/full organization',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Auto-scan new configs directory and process all .h files
  python create-comprehensive-mappings.py --scan
  
  # Scan specific firmware/version
  python create-comprehensive-mappings.py --scan --firmware marlin --version 2.1.x
  
  # Process single config file (manual mode)
  python create-comprehensive-mappings.py --config path/to/Configuration.h --version 2.1.x --firmware marlin
  
Automated Workflow:
  - Creates full/ and core/ subdirectories
  - Generates part files in full/
  - Creates consolidated -full.json files
  - Splits core fields into core/ directory
  - Adds UI field mappings to core files
        """
    )
    
    # Mode selection
    parser.add_argument('--scan', action='store_true',
                       help='Scan new configs/ directory structure and process all found .h files')
    parser.add_argument('--scan-dir', type=Path, default=Path('new configs'),
                       help='Directory to scan for config files (default: new configs)')
    
    # Manual mode arguments
    parser.add_argument('--config', type=Path,
                       help='Path to Configuration.h file (manual mode)')
    parser.add_argument('--version', 
                       help='Firmware version (e.g., 2.1.x, 3.0.x). Auto-detected in scan mode.')
    parser.add_argument('--firmware', 
                       help='Firmware type (marlin/th3d). Auto-detected in scan mode.')
    
    # Common arguments
    parser.add_argument('--output-dir', type=Path, default=Path('assets/data/maps'),
                       help='Output directory for mappings')
    parser.add_argument('--max-lines', type=int, default=900,
                       help='Maximum lines per mapping file')
    parser.add_argument('--skip-organization', action='store_true',
                       help='Skip automatic core/full organization (legacy mode)')
    
    args = parser.parse_args()
    
    # SCAN MODE: Auto-discover and process config files
    if args.scan:
        print(f"🔍 Scanning {args.scan_dir}/ for configuration files...")
        config_files = scan_config_directory(args.scan_dir)
        
        if not config_files:
            print(f"❌ No .h files found in {args.scan_dir}/")
            print(f"   Place your Configuration.h files in:")
            print(f"   - {args.scan_dir}/marlin/2.0.x/ or 2.1.x/")
            print(f"   - {args.scan_dir}/th3d/2.0.x/ or 3.0.x/")
            return
        
        # Filter by firmware/version if specified
        if args.firmware:
            config_files = [(f, v, p) for f, v, p in config_files if f == args.firmware]
        if args.version:
            config_files = [(f, v, p) for f, v, p in config_files if v == args.version]
        
        if not config_files:
            print(f"❌ No config files found matching filters:")
            if args.firmware:
                print(f"   Firmware: {args.firmware}")
            if args.version:
                print(f"   Version: {args.version}")
            return
        
        print(f"✅ Found {len(config_files)} configuration file(s):")
        for firmware, version, path in config_files:
            print(f"   • {firmware}/{version}/{path.name}")
        
        # Process each config file
        for firmware, version, config_path in config_files:
            try:
                process_single_config(config_path, firmware, version, 
                                     args.output_dir, args.max_lines, args.skip_organization)
            except Exception as e:
                print(f"\n❌ Error processing {config_path}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"\n{'='*60}")
        print(f"🎉 All done! Processed {len(config_files)} configuration file(s)")
        
    # MANUAL MODE: Process single config file with specified parameters
    else:
        if not args.config:
            print("❌ Error: --config is required in manual mode")
            print("   Use --scan to auto-discover configs, or specify --config path")
            parser.print_help()
            return
        
        if not args.version:
            print("❌ Error: --version is required in manual mode")
            print("   Example: --version 2.1.x")
            return
        
        if not args.firmware:
            print("❌ Error: --firmware is required in manual mode")
            print("   Options: marlin or th3d")
            return
        
        # Process single config file
        process_single_config(args.config, args.firmware, args.version,
                             args.output_dir, args.max_lines, args.skip_organization)


if __name__ == '__main__':
    main()
