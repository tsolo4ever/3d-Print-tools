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

# Define mapping from configuration defines to UI field IDs (with tab prefixes)
# Format: "tab{N}_{fieldId}" where N is the tab number (1-10)
UI_FIELD_MAPPINGS = {
    # Tab 1: Printer Info
    'CUSTOM_MACHINE_NAME': 'tab1_profileName',
    'USER_PRINTER_NAME': 'tab1_profileName',  # TH3D-specific
    'UNIFIED_VERSION': 'tab1_firmwareVersion',  # TH3D-specific
    'SHORT_BUILD_VERSION': 'tab1_firmwareVersion',
    'STRING_CONFIG_H_AUTHOR': 'tab1_configAuthor',
    
    # Tab 2: Hardware
    'MOTHERBOARD': 'tab2_motherboard',
    'X_DRIVER_TYPE': 'tab2_xDriverType',
    'Y_DRIVER_TYPE': 'tab2_yDriverType',
    'Z_DRIVER_TYPE': 'tab2_zDriverType',
    'E0_DRIVER_TYPE': 'tab2_e0DriverType',
    'X2_DRIVER_TYPE': 'tab2_x2DriverType',
    'Y2_DRIVER_TYPE': 'tab2_y2DriverType',
    'Z2_DRIVER_TYPE': 'tab2_z2DriverType',
    'E1_DRIVER_TYPE': 'tab2_e1DriverType',
    
    # Tab 3: Hotend
    'EXTRUDERS': 'tab3_extruders',
    'TEMP_SENSOR_0': 'tab3_hotendTempSensor',
    'TEMP_SENSOR_1': 'tab3_hotend2TempSensor',
    'HEATER_0_MINTEMP': 'tab3_hotendMinTemp',
    'HEATER_0_MAXTEMP': 'tab3_hotendMaxTemp',
    'PIDTEMP': 'tab3_pidHotendEnabled',
    'DEFAULT_Kp': 'tab3_hotendPidKp',
    'DEFAULT_Ki': 'tab3_hotendPidKi',
    'DEFAULT_Kd': 'tab3_hotendPidKd',
    
    # Tab 4: Bed
    'TEMP_SENSOR_BED': 'tab4_bedTempSensor',
    'TEMP_SENSOR_CHAMBER': 'tab4_chamberTempSensor',
    'BED_MINTEMP': 'tab4_bedMinTemp',
    'BED_MAXTEMP': 'tab4_bedMaxTemp',
    'PIDTEMPBED': 'tab4_pidBedEnabled',
    'DEFAULT_bedKp': 'tab4_bedPidKp',
    'DEFAULT_bedKi': 'tab4_bedPidKi',
    'DEFAULT_bedKd': 'tab4_bedPidKd',
    'X_BED_SIZE': 'tab4_bedSizeX',
    'Y_BED_SIZE': 'tab4_bedSizeY',
    
    # Tab 5: Probe
    'AUTO_BED_LEVELING_BILINEAR': 'tab5_ablBilinear',
    'AUTO_BED_LEVELING_UBL': 'tab5_ablUBL',
    'AUTO_BED_LEVELING_3POINT': 'tab5_abl3Point',
    'MESH_BED_LEVELING': 'tab5_meshBedLeveling',
    'GRID_MAX_POINTS_X': 'tab5_gridPointsX',
    'GRID_MAX_POINTS_Y': 'tab5_gridPointsY',
    'Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN': 'tab5_probeUsesZMinPin',
    'BLTOUCH': 'tab5_probeTypeBLTouch',
    'FIX_MOUNTED_PROBE': 'tab5_probeTypeFixed',
    'NOZZLE_TO_PROBE_OFFSET': 'tab5_probeOffset',
    'PROBING_MARGIN': 'tab5_probingMargin',
    'XY_PROBE_FEEDRATE': 'tab5_probeXYSpeed',
    'Z_PROBE_FEEDRATE_FAST': 'tab5_probeZFastSpeed',
    'Z_PROBE_FEEDRATE_SLOW': 'tab5_probeZSlowSpeed',
    'Z_SAFE_HOMING': 'tab5_zSafeHoming',
    
    # Tab 6: Motion
    'DEFAULT_AXIS_STEPS_PER_UNIT': 'tab6_stepsPerUnit',
    'DEFAULT_MAX_FEEDRATE': 'tab6_maxFeedrate',
    'DEFAULT_MAX_ACCELERATION': 'tab6_maxAcceleration',
    'DEFAULT_ACCELERATION': 'tab6_defaultAcceleration',
    'DEFAULT_RETRACT_ACCELERATION': 'tab6_retractAcceleration',
    'DEFAULT_TRAVEL_ACCELERATION': 'tab6_travelAcceleration',
    'CLASSIC_JERK': 'tab6_classicJerkEnabled',
    'DEFAULT_XJERK': 'tab6_xJerk',
    'DEFAULT_YJERK': 'tab6_yJerk',
    'DEFAULT_ZJERK': 'tab6_zJerk',
    'DEFAULT_EJERK': 'tab6_eJerk',
    'JUNCTION_DEVIATION_MM': 'tab6_junctionDeviation',
    'X_MIN_POS': 'tab6_xMinPosition',
    'Y_MIN_POS': 'tab6_yMinPosition',
    'Z_MIN_POS': 'tab6_zMinPosition',
    'X_MAX_POS': 'tab6_xMaxPosition',
    'Y_MAX_POS': 'tab6_yMaxPosition',
    'Z_MAX_POS': 'tab6_zMaxPosition',
    'X_HOME_DIR': 'tab6_xHomeDirection',
    'Y_HOME_DIR': 'tab6_yHomeDirection',
    'Z_HOME_DIR': 'tab6_zHomeDirection',
    'HOMING_FEEDRATE_MM_M': 'tab6_homingFeedrate',
    
    # Tab 7: Advanced
    'LIN_ADVANCE': 'tab7_linAdvanceEnabled',
    'LIN_ADVANCE_K': 'tab7_linAdvanceK',
    'S_CURVE_ACCELERATION': 'tab7_sCurveAcceleration',
    'ARC_SUPPORT': 'tab7_arcSupport',
    'BABYSTEPPING': 'tab7_babystepping',
    'ADAPTIVE_STEP_SMOOTHING': 'tab7_adaptiveStepSmoothing',
    'FILAMENT_RUNOUT_SENSOR': 'tab7_filamentRunoutEnabled',
    'FIL_RUNOUT_ENABLED_DEFAULT': 'tab7_runoutEnabledDefault',
    'NUM_RUNOUT_SENSORS': 'tab7_numRunoutSensors',
    'FIL_RUNOUT_STATE': 'tab7_runoutTriggerState',
    'POWER_LOSS_RECOVERY': 'tab7_powerLossRecovery',
    'PLR_ENABLED_DEFAULT': 'tab7_plrEnabledDefault',
    'BAUDRATE': 'tab7_baudRate',
    'SERIAL_PORT': 'tab7_serialPort',
    
    # Tab 8: Safety
    'THERMAL_PROTECTION_HOTENDS': 'tab8_thermalProtectionHotend',
    'THERMAL_PROTECTION_BED': 'tab8_thermalProtectionBed',
    'MIN_SOFTWARE_ENDSTOPS': 'tab8_minSoftwareEndstops',
    'MAX_SOFTWARE_ENDSTOPS': 'tab8_maxSoftwareEndstops',
    'SOFTWARE_MIN_ENDSTOPS': 'tab8_softwareMinEndstops',
    'SOFTWARE_MAX_ENDSTOPS': 'tab8_softwareMaxEndstops',
    'USE_XMIN_PLUG': 'tab8_useXMinEndstop',
    'USE_YMIN_PLUG': 'tab8_useYMinEndstop',
    'USE_ZMIN_PLUG': 'tab8_useZMinEndstop',
    'USE_XMAX_PLUG': 'tab8_useXMaxEndstop',
    'USE_YMAX_PLUG': 'tab8_useYMaxEndstop',
    'USE_ZMAX_PLUG': 'tab8_useZMaxEndstop',
    'ENDSTOPPULLUPS': 'tab8_endstopPullups',
    'ENDSTOPPULLDOWNS': 'tab8_endstopPulldowns',
    
    # Tab 9: Nozzles
    'DEFAULT_NOMINAL_FILAMENT_DIA': 'tab9_filamentDiameter',
    
    # Tab 10: Preferences
    'PREHEAT_1_LABEL': 'tab10_preheat1Label',
    'PREHEAT_1_TEMP_HOTEND': 'tab10_preheat1Hotend',
    'PREHEAT_1_TEMP_BED': 'tab10_preheat1Bed',
    'PREHEAT_1_FAN_SPEED': 'tab10_preheat1Fan',
    'PREHEAT_2_LABEL': 'tab10_preheat2Label',
    'PREHEAT_2_TEMP_HOTEND': 'tab10_preheat2Hotend',
    'PREHEAT_2_TEMP_BED': 'tab10_preheat2Bed',
    'PREHEAT_2_FAN_SPEED': 'tab10_preheat2Fan',
    'EEPROM_SETTINGS': 'tab10_eepromEnabled',
    'EEPROM_AUTO_INIT': 'tab10_eepromAutoInit',
    'REPRAP_DISCOUNT_SMART_CONTROLLER': 'tab10_displayRepRapSmart',
    'REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER': 'tab10_displayRepRapFullGraphic',
    'CR10_STOCKDISPLAY': 'tab10_displayCR10Stock',
    'ULTIPANEL': 'tab10_ultipanel',
    'LCD_LANGUAGE': 'tab10_lcdLanguage',
    'SDSUPPORT': 'tab10_sdCardEnabled',
    'SD_CHECK_AND_RETRY': 'tab10_sdCheckAndRetry',
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
