#!/usr/bin/env python3
"""
Conditional Analyzer - Pass 2
Analyzes existing mapping files and adds conditional dependency metadata.

Usage:
    python analyze-conditionals.py --mapping-dir assets/data/maps/marlin/2.1.x --config firmware-helper/example-ender5plus-config.h
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional

class ConditionalAnalyzer:
    """Analyze Configuration.h for conditional blocks and update mappings"""
    
    def __init__(self, config_path: Path):
        self.config_path = config_path
        self.conditional_map = {}  # Maps define name to conditional info
        self.conditional_stack = []
        
    def analyze(self):
        """Parse config file and build conditional map"""
        with open(self.config_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, 1):
            stripped = line.strip()
            
            # Track preprocessor conditionals
            if self._is_conditional_directive(stripped):
                self._handle_conditional(stripped, line_num)
            
            # Track #define statements
            define_match = re.match(r'^\s*#define\s+(\w+)', line)
            if define_match:
                define_name = define_match.group(1)
                if self.conditional_stack:
                    self.conditional_map[define_name] = [c for c in self.conditional_stack]
            
            # Track //#define (disabled) too
            disabled_match = re.match(r'^\s*//\s*#define\s+(\w+)', line)
            if disabled_match:
                define_name = disabled_match.group(1)
                if self.conditional_stack:
                    self.conditional_map[define_name] = [c for c in self.conditional_stack]
    
    def _is_conditional_directive(self, line: str) -> bool:
        """Check if line is a preprocessor conditional"""
        return line.startswith(('#if ', '#ifdef ', '#ifndef ', '#elif ', '#else', '#endif'))
    
    def _handle_conditional(self, line: str, line_num: int):
        """Handle preprocessor conditional directives"""
        if line.startswith('#endif'):
            if self.conditional_stack:
                self.conditional_stack.pop()
            return
        
        if line.startswith('#else'):
            if self.conditional_stack:
                last_cond = self.conditional_stack.pop()
                self.conditional_stack.append({'type': 'else', 'parent': last_cond})
            return
        
        if line.startswith('#elif '):
            if self.conditional_stack:
                self.conditional_stack.pop()
            condition = self._extract_condition(line[6:])
            if condition:
                self.conditional_stack.append(condition)
            return
        
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
        """Extract condition from preprocessor directive"""
        condition_text = condition_text.strip()
        
        if '//' in condition_text:
            condition_text = condition_text[:condition_text.index('//')].strip()
        
        if not condition_text:
            return None
        
        # Extract all uppercase identifiers
        identifiers = re.findall(r'\b[A-Z_][A-Z0-9_]*\b', condition_text)
        
        # Filter out C keywords
        keywords = {'defined', 'ENABLED', 'DISABLED', 'ANY', 'ALL', 'NONE'}
        dependencies = [id for id in identifiers if id not in keywords]
        
        return {
            'expression': condition_text,
            'dependencies': dependencies
        }
    
    def get_conditional_info(self, define_name: str) -> Optional[Dict[str, Any]]:
        """Get conditional information for a define"""
        if define_name not in self.conditional_map:
            return None
        
        conditionals_list = self.conditional_map[define_name]
        
        # Extract dependencies
        dependencies = []
        expressions = []
        
        for cond in conditionals_list:
            if isinstance(cond, dict):
                if cond.get('type') == 'else':
                    expressions.append('else block')
                    # Handle else block
                    parent = cond.get('parent', {})
                    if isinstance(parent, dict):
                        if 'dependencies' in parent:
                            dependencies.extend([f"!{dep}" for dep in parent['dependencies']])
                        elif 'condition' in parent and isinstance(parent['condition'], dict):
                            if 'dependencies' in parent['condition']:
                                dependencies.extend([f"!{dep}" for dep in parent['condition']['dependencies']])
                elif 'dependencies' in cond:
                    dependencies.extend(cond['dependencies'])
                elif 'condition' in cond and isinstance(cond['condition'], dict):
                    if 'expression' in cond['condition']:
                        expressions.append(cond['condition']['expression'])
                    if 'dependencies' in cond['condition']:
                        if cond.get('type') == 'ifndef':
                            dependencies.extend([f"!{dep}" for dep in cond['condition']['dependencies']])
                        else:
                            dependencies.extend(cond['condition']['dependencies'])
        
        # Build result
        result = {
            'isConditional': True,
            'conditionalDependencies': list(set(dependencies))
        }
        
        if expressions:
            result['conditionalExpressions'] = expressions
        
        return result


def update_mapping_file(mapping_file: Path, analyzer: ConditionalAnalyzer):
    """Update a single mapping file with conditional information"""
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
            
            # Get conditional info
            cond_info = analyzer.get_conditional_info(define_name)
            
            if cond_info:
                # Update field with conditional info
                field_data['isConditional'] = True
                
                deps = cond_info.get('conditionalDependencies', [])
                positive_deps = [d for d in deps if not d.startswith('!')]
                negative_deps = [d[1:] for d in deps if d.startswith('!')]
                
                if positive_deps:
                    field_data['conditionalOn'] = positive_deps
                else:
                    field_data['conditionalOn'] = []
                
                if negative_deps:
                    field_data['conditionalOnNot'] = negative_deps
                else:
                    field_data['conditionalOnNot'] = []
                
                field_data['conditionalOnAll'] = []  # For complex AND conditions
                
                if cond_info.get('conditionalExpressions'):
                    field_data['conditionalExpression'] = cond_info['conditionalExpressions']
                else:
                    field_data['conditionalExpression'] = []
                
                updated_count += 1
            else:
                # Not conditional - ensure fields are present but empty
                field_data['isConditional'] = False
                field_data['conditionalOn'] = []
                field_data['conditionalOnNot'] = []
                field_data['conditionalOnAll'] = []
                field_data['conditionalExpression'] = []
    
    # Write updated file
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"      ✅ Updated {updated_count} fields")


def main():
    parser = argparse.ArgumentParser(description='Analyze conditionals and update mapping files')
    parser.add_argument('--mapping-dir', type=Path, required=True,
                       help='Directory containing mapping files')
    parser.add_argument('--config', type=Path, required=True,
                       help='Configuration.h file to analyze')
    parser.add_argument('--pattern', default='*-mapping-part*.json',
                       help='Glob pattern for mapping files')
    
    args = parser.parse_args()
    
    print(f"🔍 Analyzing conditionals in {args.config}...")
    analyzer = ConditionalAnalyzer(args.config)
    analyzer.analyze()
    
    conditional_count = len(analyzer.conditional_map)
    print(f"✅ Found {conditional_count} defines in conditional blocks")
    
    # Find mapping files
    mapping_files = sorted(args.mapping_dir.glob(args.pattern))
    print(f"\n📝 Updating {len(mapping_files)} mapping files...")
    
    for mapping_file in mapping_files:
        update_mapping_file(mapping_file, analyzer)
    
    print(f"\n✨ Complete! Updated conditional metadata in {len(mapping_files)} files")


if __name__ == '__main__':
    main()
