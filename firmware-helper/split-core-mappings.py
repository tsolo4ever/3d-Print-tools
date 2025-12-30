#!/usr/bin/env python3
"""
Split mappings into core (for parsing) and full (reference) files.

Usage:
    python split-core-mappings.py --mapping-dir assets/data/maps/marlin/2.1.x
"""

import json
import argparse
from pathlib import Path
from typing import Dict, Set

# Define core fields that parsers should use
CORE_FIELDS = {
    # Basic printer identification
    'CUSTOM_MACHINE_NAME', 'MOTHERBOARD', 'EXTRUDERS', 'DEFAULT_NOMINAL_FILAMENT_DIA',
    'USER_PRINTER_NAME', 'SHORT_BUILD_VERSION', 'UNIFIED_VERSION',
    
    # Serial communication
    'SERIAL_PORT', 'BAUDRATE', 'SERIAL_PORT_2', 'BAUDRATE_2',
    
    # Temperature sensors
    'TEMP_SENSOR_0', 'TEMP_SENSOR_1', 'TEMP_SENSOR_2', 'TEMP_SENSOR_BED', 'TEMP_SENSOR_CHAMBER',
    
    # Heating limits
    'HEATER_0_MINTEMP', 'HEATER_0_MAXTEMP', 'BED_MINTEMP', 'BED_MAXTEMP',
    
    # PID tuning
    'PIDTEMP', 'DEFAULT_Kp', 'DEFAULT_Ki', 'DEFAULT_Kd',
    'PIDTEMPBED', 'DEFAULT_bedKp', 'DEFAULT_bedKi', 'DEFAULT_bedKd',
    
    # Endstops
    'USE_XMIN_PLUG', 'USE_YMIN_PLUG', 'USE_ZMIN_PLUG',
    'USE_XMAX_PLUG', 'USE_YMAX_PLUG', 'USE_ZMAX_PLUG',
    'ENDSTOPPULLUPS', 'ENDSTOPPULLDOWNS',
    'X_MIN_ENDSTOP_INVERTING', 'Y_MIN_ENDSTOP_INVERTING', 'Z_MIN_ENDSTOP_INVERTING',
    'X_MAX_ENDSTOP_INVERTING', 'Y_MAX_ENDSTOP_INVERTING', 'Z_MAX_ENDSTOP_INVERTING',
    
    # Bed leveling probe - Standard
    'Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN', 'BLTOUCH', 'FIX_MOUNTED_PROBE',
    'NOZZLE_TO_PROBE_OFFSET', 'PROBING_MARGIN', 'XY_PROBE_FEEDRATE',
    'Z_PROBE_FEEDRATE_FAST', 'Z_PROBE_FEEDRATE_SLOW', 'MULTIPLE_PROBING',
    
    # TH3D EZABL Probe System
    'EZABL_ENABLE', 'EZABL_PROBE_EDGE', 'EZABL_FASTPROBE', 'EZABL_POINTS',
    'EZABL_PROBE_MOUNT', 'CUSTOM_PROBE', 'HEATERS_ON_DURING_PROBING',
    
    # Stepper drivers
    'X_DRIVER_TYPE', 'Y_DRIVER_TYPE', 'Z_DRIVER_TYPE', 'E0_DRIVER_TYPE',
    'X2_DRIVER_TYPE', 'Y2_DRIVER_TYPE', 'Z2_DRIVER_TYPE', 'E1_DRIVER_TYPE',
    
    # TMC Driver Settings (TH3D specific)
    'STEALTHCHOP_XY', 'STEALTHCHOP_Z', 'STEALTHCHOP_E',
    'HYBRID_THRESHOLD', 'SENSORLESS_HOMING',
    
    # Movement
    'DEFAULT_AXIS_STEPS_PER_UNIT', 'DEFAULT_MAX_FEEDRATE',
    'DEFAULT_MAX_ACCELERATION', 'DEFAULT_ACCELERATION',
    'DEFAULT_RETRACT_ACCELERATION', 'DEFAULT_TRAVEL_ACCELERATION',
    
    # Jerk / Junction Deviation
    'CLASSIC_JERK', 'DEFAULT_XJERK', 'DEFAULT_YJERK', 'DEFAULT_ZJERK', 'DEFAULT_EJERK',
    'JUNCTION_DEVIATION_MM',
    
    # Build volume
    'X_BED_SIZE', 'Y_BED_SIZE', 'X_MIN_POS', 'Y_MIN_POS', 'Z_MIN_POS',
    'X_MAX_POS', 'Y_MAX_POS', 'Z_MAX_POS',
    
    # Homing
    'X_HOME_DIR', 'Y_HOME_DIR', 'Z_HOME_DIR',
    'HOMING_FEEDRATE_MM_M', 'HOMING_FEEDRATE_Z',
    
    # Bed leveling
    'AUTO_BED_LEVELING_BILINEAR', 'AUTO_BED_LEVELING_UBL', 'AUTO_BED_LEVELING_3POINT',
    'MESH_BED_LEVELING', 'GRID_MAX_POINTS_X', 'GRID_MAX_POINTS_Y',
    'Z_SAFE_HOMING', 'RESTORE_LEVELING_AFTER_G28',
    'MANUAL_MESH_LEVELING', 'MESH_EDIT_MENU',
    
    # Filament runout - Standard & TH3D
    'FILAMENT_RUNOUT_SENSOR', 'FIL_RUNOUT_ENABLED_DEFAULT',
    'NUM_RUNOUT_SENSORS', 'FIL_RUNOUT_STATE',
    'EZOUT_ENABLE',
    
    # Power loss recovery
    'POWER_LOSS_RECOVERY', 'PLR_ENABLED_DEFAULT',
    
    # EEPROM
    'EEPROM_SETTINGS', 'EEPROM_AUTO_INIT',
    
    # Display - Standard
    'REPRAP_DISCOUNT_SMART_CONTROLLER', 'REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER',
    'CR10_STOCKDISPLAY', 'ULTIPANEL', 'LCD_LANGUAGE',
    
    # Display - TH3D specific
    'CR10_STOCKDISPLAY_V2', 'ENDER2_STOCKDISPLAY', 
    'TH3D_EZBOARD_V1', 'TH3D_EZBOARD_V2',
    
    # SD Card
    'SDSUPPORT', 'SD_CHECK_AND_RETRY',
    
    # Safety features
    'THERMAL_PROTECTION_HOTENDS', 'THERMAL_PROTECTION_BED',
    'MIN_SOFTWARE_ENDSTOPS', 'MAX_SOFTWARE_ENDSTOPS',
    'SOFTWARE_MIN_ENDSTOPS', 'SOFTWARE_MAX_ENDSTOPS',
    'PREVENT_COLD_EXTRUSION', 'PREVENT_LENGTHY_EXTRUDE', 'EXTRUDE_MAXLENGTH',
    
    # Advanced features - Standard
    'LIN_ADVANCE', 'LIN_ADVANCE_K', 'S_CURVE_ACCELERATION',
    'ARC_SUPPORT', 'BABYSTEPPING', 'ADAPTIVE_STEP_SMOOTHING',
    
    # Advanced features - TH3D
    'LINEAR_ADVANCE', 'LINEAR_ADVANCE_K',
    'MANUAL_MESH_LEVELING', 'PROBE_MANUALLY',
    
    # TH3D Extruder features
    'DIRECT_DRIVE_PRINTER', 'SPRITE_EXTRUDER', 'CUSTOM_ESTEPS',
    
    # TH3D Printer Models
    'ENDER3', 'ENDER3_V2', 'ENDER3_MAX', 'ENDER5', 'ENDER5_PLUS', 'ENDER5_PRO',
    'CR10', 'CR10_V2', 'CR10_V3', 'CR10_MAX', 'CR10_S4', 'CR10_S5',
    'CR20', 'CR20_PRO',
    
    # TH3D LED Control
    'EZNEO', 'EZNEO_COLOR',
    
    # Preheat presets
    'PREHEAT_1_LABEL', 'PREHEAT_1_TEMP_HOTEND', 'PREHEAT_1_TEMP_BED', 'PREHEAT_1_FAN_SPEED',
    'PREHEAT_2_LABEL', 'PREHEAT_2_TEMP_HOTEND', 'PREHEAT_2_TEMP_BED', 'PREHEAT_2_FAN_SPEED',
    
    # TH3D Firmware Version Tracking
    'CONFIGURATION_H_VERSION', 'CONFIGURATION_ADV_H_VERSION',
}

def is_core_field(define_name: str) -> bool:
    """Check if a define is in the core set"""
    return define_name in CORE_FIELDS


def split_mapping_file(mapping_file: Path, output_dir: Path):
    """Split a mapping file into core and full versions"""
    print(f"Processing {mapping_file.name}...")
    
    with open(mapping_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Preserve metadata
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines'}
    metadata = {k: v for k, v in data.items() if k in metadata_keys}
    
    core_data = dict(metadata)
    full_data = dict(metadata)
    
    core_count = 0
    full_count = 0
    
    # Split categories
    for category_name, category_fields in data.items():
        if category_name in metadata_keys or not isinstance(category_fields, dict):
            continue
        
        core_category = {}
        full_category = {}
        
        for field_name, field_data in category_fields.items():
            if not isinstance(field_data, dict):
                continue
            
            # Check if this field is core
            maps_from = field_data.get('mapsFrom', [])
            if maps_from and is_core_field(maps_from[0]):
                core_category[field_name] = field_data
                core_count += 1
            
            # Always add to full
            full_category[field_name] = field_data
            full_count += 1
        
        # Add categories if they have content
        if core_category:
            core_data[category_name] = core_category
        if full_category:
            full_data[category_name] = full_category
    
    # Add counts to metadata
    core_data['coreDefines'] = core_count
    full_data['fullDefines'] = full_count
    
    # Generate output filenames
    base_name = mapping_file.stem  # e.g., "marlin-config-mapping-part1"
    
    # Remove "-partN" if present for cleaner names
    if '-part' in base_name:
        base_name = base_name[:base_name.rindex('-part')]
    
    core_file = output_dir / f"{base_name}-core.json"
    full_file = output_dir / f"{base_name}-full.json"
    
    # Write core mapping (for parser use)
    with open(core_file, 'w', encoding='utf-8') as f:
        json.dump(core_data, f, indent=2)
    
    # Write full mapping (for reference)
    with open(full_file, 'w', encoding='utf-8') as f:
        json.dump(full_data, f, indent=2)
    
    print(f"  ✅ Core: {core_count} fields → {core_file.name}")
    print(f"  📚 Full: {full_count} fields → {full_file.name}")
    
    return core_count, full_count


def main():
    parser = argparse.ArgumentParser(description='Split mappings into core and full versions')
    parser.add_argument('--mapping-dir', type=Path, required=True,
                       help='Directory containing mapping files')
    parser.add_argument('--pattern', default='*-mapping-part*.json',
                       help='Glob pattern for mapping files')
    
    args = parser.parse_args()
    
    if not args.mapping_dir.exists():
        print(f"❌ Directory not found: {args.mapping_dir}")
        return 1
    
    print(f"🔍 Scanning {args.mapping_dir}/...")
    mapping_files = sorted(args.mapping_dir.glob(args.pattern))
    
    if not mapping_files:
        print(f"❌ No mapping files found matching: {args.pattern}")
        return 1
    
    print(f"✅ Found {len(mapping_files)} mapping file(s)\n")
    
    total_core = 0
    total_full = 0
    
    for mapping_file in mapping_files:
        core_count, full_count = split_mapping_file(mapping_file, args.mapping_dir)
        total_core += core_count
        total_full += full_count
    
    print(f"\n{'='*60}")
    print(f"✨ Complete!")
    print(f"   Core fields (for parsing): {total_core}")
    print(f"   Full fields (reference): {total_full}")
    print(f"   Output: {args.mapping_dir}/")
    print(f"{'='*60}")
    
    print(f"\n💡 Parser Usage:")
    print(f"   Load *-core.json files for active parsing")
    print(f"   Keep *-full.json files for documentation/future use")
    
    return 0


if __name__ == '__main__':
    exit(main())
