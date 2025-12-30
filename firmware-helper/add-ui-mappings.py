#!/usr/bin/env python3
"""
Add UI field mappings to core mapping files.
Maps configuration defines to UI field IDs for automatic population.

Usage:
    python add-ui-mappings.py --mapping-dir assets/data/maps/marlin/2.1.x
"""

import json
import argparse
from pathlib import Path
from typing import Dict, Optional

# Define mapping from configuration defines to UI field IDs
UI_FIELD_MAPPINGS = {
    # Basic Information
    'CUSTOM_MACHINE_NAME': 'profileName',
    'MOTHERBOARD': 'motherboard',
    'EXTRUDERS': 'extruders',
    'DEFAULT_NOMINAL_FILAMENT_DIA': 'filamentDiameter',
    
    # Serial/Communication
    'SERIAL_PORT': 'serialPort',
    'BAUDRATE': 'baudRate',
    'SERIAL_PORT_2': 'serialPort2',
    'BAUDRATE_2': 'baudRate2',
    
    # Temperature Sensors
    'TEMP_SENSOR_0': 'hotendTempSensor',
    'TEMP_SENSOR_1': 'hotend2TempSensor',
    'TEMP_SENSOR_BED': 'bedTempSensor',
    'TEMP_SENSOR_CHAMBER': 'chamberTempSensor',
    
    # Temperature Limits
    'HEATER_0_MINTEMP': 'hotendMinTemp',
    'HEATER_0_MAXTEMP': 'hotendMaxTemp',
    'BED_MINTEMP': 'bedMinTemp',
    'BED_MAXTEMP': 'bedMaxTemp',
    
    # PID Settings - Hotend
    'PIDTEMP': 'pidHotendEnabled',
    'DEFAULT_Kp': 'hotendPidKp',
    'DEFAULT_Ki': 'hotendPidKi',
    'DEFAULT_Kd': 'hotendPidKd',
    
    # PID Settings - Bed
    'PIDTEMPBED': 'pidBedEnabled',
    'DEFAULT_bedKp': 'bedPidKp',
    'DEFAULT_bedKi': 'bedPidKi',
    'DEFAULT_bedKd': 'bedPidKd',
    
    # Endstops
    'USE_XMIN_PLUG': 'useXMinEndstop',
    'USE_YMIN_PLUG': 'useYMinEndstop',
    'USE_ZMIN_PLUG': 'useZMinEndstop',
    'USE_XMAX_PLUG': 'useXMaxEndstop',
    'USE_YMAX_PLUG': 'useYMaxEndstop',
    'USE_ZMAX_PLUG': 'useZMaxEndstop',
    'ENDSTOPPULLUPS': 'endstopPullups',
    'ENDSTOPPULLDOWNS': 'endstopPulldowns',
    
    # Probe Settings
    'Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN': 'probeUsesZMinPin',
    'BLTOUCH': 'probeTypeBLTouch',
    'FIX_MOUNTED_PROBE': 'probeTypeFixed',
    'NOZZLE_TO_PROBE_OFFSET': 'probeOffset',
    'PROBING_MARGIN': 'probingMargin',
    'XY_PROBE_FEEDRATE': 'probeXYSpeed',
    'Z_PROBE_FEEDRATE_FAST': 'probeZFastSpeed',
    'Z_PROBE_FEEDRATE_SLOW': 'probeZSlowSpeed',
    
    # Stepper Drivers
    'X_DRIVER_TYPE': 'xDriverType',
    'Y_DRIVER_TYPE': 'yDriverType',
    'Z_DRIVER_TYPE': 'zDriverType',
    'E0_DRIVER_TYPE': 'e0DriverType',
    'X2_DRIVER_TYPE': 'x2DriverType',
    'Y2_DRIVER_TYPE': 'y2DriverType',
    'Z2_DRIVER_TYPE': 'z2DriverType',
    'E1_DRIVER_TYPE': 'e1DriverType',
    
    # Movement - Steps
    'DEFAULT_AXIS_STEPS_PER_UNIT': 'stepsPerUnit',
    
    # Movement - Speed
    'DEFAULT_MAX_FEEDRATE': 'maxFeedrate',
    
    # Movement - Acceleration
    'DEFAULT_MAX_ACCELERATION': 'maxAcceleration',
    'DEFAULT_ACCELERATION': 'defaultAcceleration',
    'DEFAULT_RETRACT_ACCELERATION': 'retractAcceleration',
    'DEFAULT_TRAVEL_ACCELERATION': 'travelAcceleration',
    
    # Jerk
    'CLASSIC_JERK': 'classicJerkEnabled',
    'DEFAULT_XJERK': 'xJerk',
    'DEFAULT_YJERK': 'yJerk',
    'DEFAULT_ZJERK': 'zJerk',
    'DEFAULT_EJERK': 'eJerk',
    'JUNCTION_DEVIATION_MM': 'junctionDeviation',
    
    # Build Volume
    'X_BED_SIZE': 'bedSizeX',
    'Y_BED_SIZE': 'bedSizeY',
    'X_MIN_POS': 'xMinPosition',
    'Y_MIN_POS': 'yMinPosition',
    'Z_MIN_POS': 'zMinPosition',
    'X_MAX_POS': 'xMaxPosition',
    'Y_MAX_POS': 'yMaxPosition',
    'Z_MAX_POS': 'zMaxPosition',
    
    # Homing
    'X_HOME_DIR': 'xHomeDirection',
    'Y_HOME_DIR': 'yHomeDirection',
    'Z_HOME_DIR': 'zHomeDirection',
    'HOMING_FEEDRATE_MM_M': 'homingFeedrate',
    
    # Bed Leveling
    'AUTO_BED_LEVELING_BILINEAR': 'ablBilinear',
    'AUTO_BED_LEVELING_UBL': 'ablUBL',
    'AUTO_BED_LEVELING_3POINT': 'abl3Point',
    'MESH_BED_LEVELING': 'meshBedLeveling',
    'GRID_MAX_POINTS_X': 'gridPointsX',
    'GRID_MAX_POINTS_Y': 'gridPointsY',
    'Z_SAFE_HOMING': 'zSafeHoming',
    
    # Filament Runout
    'FILAMENT_RUNOUT_SENSOR': 'filamentRunoutEnabled',
    'FIL_RUNOUT_ENABLED_DEFAULT': 'runoutEnabledDefault',
    'NUM_RUNOUT_SENSORS': 'numRunoutSensors',
    'FIL_RUNOUT_STATE': 'runoutTriggerState',
    
    # Power Loss Recovery
    'POWER_LOSS_RECOVERY': 'powerLossRecovery',
    'PLR_ENABLED_DEFAULT': 'plrEnabledDefault',
    
    # EEPROM
    'EEPROM_SETTINGS': 'eepromEnabled',
    'EEPROM_AUTO_INIT': 'eepromAutoInit',
    
    # Display
    'REPRAP_DISCOUNT_SMART_CONTROLLER': 'displayRepRapSmart',
    'REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER': 'displayRepRapFullGraphic',
    'CR10_STOCKDISPLAY': 'displayCR10Stock',
    'ULTIPANEL': 'ultipanel',
    'LCD_LANGUAGE': 'lcdLanguage',
    
    # SD Card
    'SDSUPPORT': 'sdCardEnabled',
    'SD_CHECK_AND_RETRY': 'sdCheckAndRetry',
    
    # Safety Features
    'THERMAL_PROTECTION_HOTENDS': 'thermalProtectionHotend',
    'THERMAL_PROTECTION_BED': 'thermalProtectionBed',
    'MIN_SOFTWARE_ENDSTOPS': 'minSoftwareEndstops',
    'MAX_SOFTWARE_ENDSTOPS': 'maxSoftwareEndstops',
    'SOFTWARE_MIN_ENDSTOPS': 'softwareMinEndstops',
    'SOFTWARE_MAX_ENDSTOPS': 'softwareMaxEndstops',
    
    # Advanced Features
    'LIN_ADVANCE': 'linAdvanceEnabled',
    'LIN_ADVANCE_K': 'linAdvanceK',
    'S_CURVE_ACCELERATION': 'sCurveAcceleration',
    'ARC_SUPPORT': 'arcSupport',
    'BABYSTEPPING': 'babystepping',
    'ADAPTIVE_STEP_SMOOTHING': 'adaptiveStepSmoothing',
    
    # Preheat Presets
    'PREHEAT_1_LABEL': 'preheat1Label',
    'PREHEAT_1_TEMP_HOTEND': 'preheat1Hotend',
    'PREHEAT_1_TEMP_BED': 'preheat1Bed',
    'PREHEAT_1_FAN_SPEED': 'preheat1Fan',
    'PREHEAT_2_LABEL': 'preheat2Label',
    'PREHEAT_2_TEMP_HOTEND': 'preheat2Hotend',
    'PREHEAT_2_TEMP_BED': 'preheat2Bed',
    'PREHEAT_2_FAN_SPEED': 'preheat2Fan',
}


def add_ui_mapping(field_data: Dict, define_name: str) -> Dict:
    """Add UI field mapping to a field definition"""
    if define_name in UI_FIELD_MAPPINGS:
        field_data['uiFieldId'] = UI_FIELD_MAPPINGS[define_name]
    return field_data


def process_mapping_file(mapping_file: Path):
    """Add UI mappings to a core mapping file"""
    print(f"Processing {mapping_file.name}...")
    
    with open(mapping_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    metadata_keys = {'$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines', 'coreDefines', 'fullDefines'}
    
    # Process each category
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
            
            # Add UI mapping if available
            if define_name in UI_FIELD_MAPPINGS:
                field_data['uiFieldId'] = UI_FIELD_MAPPINGS[define_name]
                updated_count += 1
    
    # Write updated file
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"  ✅ Added {updated_count} UI field mappings")
    return updated_count


def main():
    parser = argparse.ArgumentParser(description='Add UI field mappings to core mapping files')
    parser.add_argument('--mapping-dir', type=Path, required=True,
                       help='Directory containing mapping files')
    parser.add_argument('--pattern', default='*-core.json',
                       help='Glob pattern for core mapping files')
    
    args = parser.parse_args()
    
    if not args.mapping_dir.exists():
        print(f"❌ Directory not found: {args.mapping_dir}")
        return 1
    
    print(f"🔍 Scanning {args.mapping_dir}/ for core mappings...")
    mapping_files = sorted(args.mapping_dir.glob(args.pattern))
    
    if not mapping_files:
        print(f"❌ No core mapping files found")
        return 1
    
    print(f"✅ Found {len(mapping_files)} core mapping file(s)\n")
    
    total_updated = 0
    for mapping_file in mapping_files:
        count = process_mapping_file(mapping_file)
        total_updated += count
    
    print(f"\n{'='*60}")
    print(f"✨ Complete!")
    print(f"   Added {total_updated} UI field mappings")
    print(f"   Files updated: {len(mapping_files)}")
    print(f"{'='*60}")
    
    print(f"\n💡 Usage in Parser:")
    print(f"   Each field now has 'uiFieldId' property")
    print(f"   Use it to map parsed values to UI inputs")
    print(f"   Example: document.getElementById(field.uiFieldId).value = parsedValue")
    
    return 0


if __name__ == '__main__':
    exit(main())
