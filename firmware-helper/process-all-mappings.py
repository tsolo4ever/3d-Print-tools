#!/usr/bin/env python3
"""
Complete Mapping Processor - Runs all three passes automatically
Pass 1: Create basic mappings
Pass 2: Add conditional dependencies
Pass 3: Add validation rules

Usage:
    # Scan mode (auto-discover configs)
    python process-all-mappings.py --scan
    
    # Manual mode (single config)
    python process-all-mappings.py --config path/to/Configuration.h --version 2.1.x --firmware marlin
"""

import sys
import argparse
import subprocess
from pathlib import Path
from typing import List, Tuple

def run_command(cmd: List[str], description: str) -> bool:
    """Run a command and return success status"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=False, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        return False


def process_config_file(config_path: Path, firmware: str, version: str, 
                       output_dir: Path, scan_dir: Path) -> bool:
    """Process a single config file through all three passes"""
    
    print(f"\n{'#'*60}")
    print(f"# Processing: {config_path.name}")
    print(f"# Firmware: {firmware} | Version: {version}")
    print(f"{'#'*60}")
    
    # Determine mapping directory
    mapping_dir = output_dir / firmware / version
    
    # PASS 1: Create comprehensive mappings
    cmd_pass1 = [
        sys.executable, 
        'firmware-helper/create-comprehensive-mappings.py',
        '--config', str(config_path),
        '--version', version,
        '--firmware', firmware,
        '--output-dir', str(output_dir)
    ]
    
    if not run_command(cmd_pass1, f"PASS 1: Creating mappings from {config_path.name}"):
        return False
    
    # PASS 2: Analyze conditionals
    cmd_pass2 = [
        sys.executable,
        'firmware-helper/analyze-conditionals.py',
        '--mapping-dir', str(mapping_dir),
        '--config', str(config_path)
    ]
    
    if not run_command(cmd_pass2, f"PASS 2: Analyzing conditional dependencies"):
        print("⚠️  Warning: Conditional analysis failed, continuing...")
    
    # PASS 3: Analyze validation rules
    cmd_pass3 = [
        sys.executable,
        'firmware-helper/analyze-validation.py',
        '--mapping-dir', str(mapping_dir),
        '--config', str(config_path)
    ]
    
    if not run_command(cmd_pass3, f"PASS 3: Extracting validation rules"):
        print("⚠️  Warning: Validation analysis failed, continuing...")
    
    # PASS 4: Split into core and full mappings
    cmd_pass4 = [
        sys.executable,
        'firmware-helper/split-core-mappings.py',
        '--mapping-dir', str(mapping_dir)
    ]
    
    if not run_command(cmd_pass4, f"PASS 4: Splitting core/full mappings"):
        print("⚠️  Warning: Mapping split failed, continuing...")
    
    # PASS 5: Add UI field mappings to core files
    mapping_dir_core = mapping_dir / 'core'
    cmd_pass5 = [
        sys.executable,
        'firmware-helper/add-ui-mappings.py',
        '--mapping-dir', str(mapping_dir_core)
    ]
    
    if not run_command(cmd_pass5, f"PASS 5: Adding UI field mappings"):
        print("⚠️  Warning: UI mapping failed, continuing...")
    
    print(f"\n✅ Complete: {config_path.name} → {mapping_dir}")
    return True


def scan_config_directory(base_dir: Path) -> List[Tuple[str, str, Path]]:
    """Scan directory for config files (same as in create-comprehensive-mappings.py)"""
    config_files = []
    
    if not base_dir.exists():
        return config_files
    
    for firmware_dir in base_dir.iterdir():
        if not firmware_dir.is_dir():
            continue
        
        firmware_type = firmware_dir.name
        
        for version_dir in firmware_dir.iterdir():
            if not version_dir.is_dir():
                continue
            
            version = version_dir.name
            
            for config_file in version_dir.glob('*.h'):
                config_files.append((firmware_type, version, config_file))
    
    return config_files


def main():
    parser = argparse.ArgumentParser(
        description='Process configuration files through all three mapping passes',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Scan mode - process all configs in new configs/
  python process-all-mappings.py --scan
  
  # Scan specific firmware/version
  python process-all-mappings.py --scan --firmware marlin --version 2.1.x
  
  # Manual mode - process single config
  python process-all-mappings.py --config path/to/Configuration.h --version 2.1.x --firmware marlin

Five-Pass Workflow:
  Pass 1: Create basic mapping structure (field names, types, line numbers)
  Pass 2: Add conditional dependencies (#ifdef, #ifndef, #if)
  Pass 3: Add validation rules (ranges, units, allowed values)
  Pass 4: Split into core (for parsing) and full (reference) files
  Pass 5: Add UI field IDs to core files for automatic UI population
        """
    )
    
    # Mode selection
    parser.add_argument('--scan', action='store_true',
                       help='Scan new configs/ directory and process all .h files')
    parser.add_argument('--scan-dir', type=Path, default=Path('new configs'),
                       help='Directory to scan (default: new configs)')
    
    # Manual mode
    parser.add_argument('--config', type=Path,
                       help='Path to Configuration.h file (manual mode)')
    parser.add_argument('--version',
                       help='Firmware version (e.g., 2.1.x)')
    parser.add_argument('--firmware',
                       help='Firmware type (marlin/th3d)')
    
    # Common arguments
    parser.add_argument('--output-dir', type=Path, default=Path('assets/data/maps'),
                       help='Output directory for mappings')
    
    args = parser.parse_args()
    
    print("🚀 Complete Mapping Processor - Three-Pass System")
    print("=" * 60)
    
    # SCAN MODE
    if args.scan:
        print(f"🔍 Scanning {args.scan_dir}/ for configuration files...")
        config_files = scan_config_directory(args.scan_dir)
        
        if not config_files:
            print(f"❌ No .h files found in {args.scan_dir}/")
            print(f"   Place Configuration.h files in:")
            print(f"   - {args.scan_dir}/marlin/{{version}}/")
            print(f"   - {args.scan_dir}/th3d/{{version}}/")
            return 1
        
        # Filter by firmware/version if specified
        if args.firmware:
            config_files = [(f, v, p) for f, v, p in config_files if f == args.firmware]
        if args.version:
            config_files = [(f, v, p) for f, v, p in config_files if v == args.version]
        
        if not config_files:
            print("❌ No config files found matching filters")
            return 1
        
        print(f"✅ Found {len(config_files)} configuration file(s)")
        
        # Process each config
        success_count = 0
        for firmware, version, config_path in config_files:
            if process_config_file(config_path, firmware, version, 
                                  args.output_dir, args.scan_dir):
                success_count += 1
        
        print(f"\n{'='*60}")
        print(f"🎉 Processing Complete!")
        print(f"   Processed: {success_count}/{len(config_files)} config files")
        print(f"   Output: {args.output_dir}/")
        print(f"{'='*60}")
        
        return 0 if success_count == len(config_files) else 1
    
    # MANUAL MODE
    else:
        if not args.config:
            print("❌ Error: --config required in manual mode")
            parser.print_help()
            return 1
        
        if not args.version or not args.firmware:
            print("❌ Error: --version and --firmware required in manual mode")
            return 1
        
        if not args.config.exists():
            print(f"❌ Error: Config file not found: {args.config}")
            return 1
        
        success = process_config_file(args.config, args.firmware, args.version,
                                     args.output_dir, args.scan_dir)
        
        return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
