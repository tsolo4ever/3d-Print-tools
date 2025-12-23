# TH3D Unified Firmware - Configuration Parser Reference

**Version:** 1.0.0  
**Last Updated:** 2025-12-23  
**Target Firmware:** TH3D Unified Firmware v2.97+

---

## Table of Contents

1. [Overview](#overview)
2. [TH3D-Specific Fields](#th3d-specific-fields)
3. [Basic Settings](#basic-settings)
4. [Hardware Configuration](#hardware-configuration)
5. [Temperature Settings](#temperature-settings)
6. [Motion Settings](#motion-settings)
7. [Probe Configuration](#probe-configuration)
8. [Bed Leveling](#bed-leveling)
9. [Advanced Features](#advanced-features)
10. [Safety Features](#safety-features)
11. [File Locations](#file-locations)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This document maps TH3D Unified Firmware Configuration.h defines to the JSON structure used by the parser. Use this as a reference when:
- Updating the parser to support new fields
- Understanding what gets extracted from config files
- Troubleshooting parsing issues

**Template-First Development:** Always update this reference BEFORE modifying the parser code!

---

## TH3D-Specific Fields

These fields are unique to TH3D Unified Firmware and differ from standard Marlin:

| Field | Configuration.h Define | Notes |
|-------|----------------------|-------|
| `basic.firmwareVersion` | `UNIFIED_VERSION` | TH3D version (e.g., "TH3D UFW 2.97a") |
| `basic.distributionDate` | `STRING_DISTRIBUTION_DATE` | Build date (e.g., "2025-08-26") |
| `basic.machineName` | `USER_PRINTER_NAME` | **TH3D uses this instead of CUSTOM_MACHINE_NAME** |
| `probe.type` | `EZABL_ENABLE`, `EZABL_POINTS` | TH3D's EZABL probe system |
| `advanced.th3dRGB` | `TH3D_RGB_ENABLE` | TH3D RGB lighting feature |

### Important: USER_PRINTER_NAME Handling

TH3D firmware uses a unique pattern:
- **Configuration.h**: `#define USER_PRINTER_NAME "Maxy"`
- **Configuration_backend.h**: `#define CUSTOM_MACHINE_NAME USER_PRINTER_NAME` (variable reference!)

The parser must:
1. Store the VALUE from `USER_PRINTER_NAME` in `basic.userPrinterNameValue`
2. Detect when `CUSTOM_MACHINE_NAME` is a variable reference (not a string)
3. Use the stored value instead of the variable name

---

## Basic Settings

### Printer Identification

| JSON Field | Configuration.h Define | Type | Required | File Location | Examples |
|------------|----------------------|------|----------|---------------|----------|
| `basic.machineName` | `USER_PRINTER_NAME` | string | No | Configuration.h | "Maxy", "POS Unit" |
| `basic.firmwareVersion` | `UNIFIED_VERSION` | string | No | Configuration.h | "TH3D UFW 2.97a" |
| `basic.distributionDate` | `STRING_DISTRIBUTION_DATE` | string | No | Configuration.h | "2025-08-26" |
| `basic.uuid` | `MACHINE_UUID` | string | No | Configuration.h | UUID format |
| `basic.author` | `STRING_CONFIG_H_AUTHOR` | string | No | Configuration.h | "TH3D Studio" |

### Communication

| JSON Field | Configuration.h Define | Type | Required | Examples | Notes |
|------------|----------------------|------|----------|----------|-------|
| `basic.motherboard` | `MOTHERBOARD` | string | **Yes** | `BOARD_CREALITY_V422` | Must start with `BOARD_` |
| `basic.serialPort` | `SERIAL_PORT` | integer | No | 0, 1, -1 | -1 = USB |
| `basic.baudRate` | `BAUDRATE` | integer | No | 115200, 250000 | Standard baud rates |

### Build Volume

| JSON Field | Configuration.h Define | Type | Examples | Typical Range |
|------------|----------------------|------|----------|---------------|
| `basic.bedSizeX` | `X_BED_SIZE` | integer | 220, 235, 350 | 100-500mm |
| `basic.bedSizeY` | `Y_BED_SIZE` | integer | 220, 235, 350 | 100-500mm |
| `basic.xMaxPos` | `X_MAX_POS` | integer | 220, 235 | Usually = bedSize |
| `basic.yMaxPos` | `Y_MAX_POS` | integer | 220, 235 | Usually = bedSize |
| `basic.zMaxPos` | `Z_MAX_POS` | integer | 250, 300, 400 | 100-600mm |

---

## Hardware Configuration

### Stepper Drivers

| JSON Field | Configuration.h Define | Examples |
|------------|----------------------|----------|
| `hardware.driverX` | `X_DRIVER_TYPE` | A4988, TMC2208, TMC2209 |
| `hardware.driverY` | `Y_DRIVER_TYPE` | A4988, TMC2208, TMC2209 |
| `hardware.driverZ` | `Z_DRIVER_TYPE` | A4988, TMC2208, TMC2209 |
| `hardware.driverE0` | `E0_DRIVER_TYPE` | A4988, TMC2208, TMC2209 |
| `hardware.driverE1` | `E1_DRIVER_TYPE` | (Dual extruder only) |

**Common TH3D Boards:**
- Creality V4.2.2: TMC2208 (silent)
- Creality V4.2.7: TMC2208/TMC2209
- BTT SKR Mini E3: TMC2209

### Thermistors

| JSON Field | Configuration.h Define | Examples | Common Types |
|------------|----------------------|----------|--------------|
| `hardware.thermistorHotend` | `TEMP_SENSOR_0` | 1, 5, 11, 13 | 1=Generic 100k |
| `hardware.thermistorBed` | `TEMP_SENSOR_BED` | 1, 3, 11 | 3=Mendel |
| `hardware.thermistorChamber` | `TEMP_SENSOR_CHAMBER` | 1, 11 | Rare |

**TH3D Thermistor Notes:**
- `1` = 100k thermistor (most common)
- `5` = 100k ATC Semitec 104GT-2/104NT-4-R025H42G
- `11` = 100k beta 3950 1%
- `13` = 100k Hisens 3950 1% up to 300°C

### Endstops

| JSON Field | Configuration.h Define | Notes |
|------------|----------------------|-------|
| `hardware.endstopXMin` | `USE_XMIN_PLUG` | Define present = true |
| `hardware.endstopYMin` | `USE_YMIN_PLUG` | Most common |
| `hardware.endstopZMin` | `USE_ZMIN_PLUG` | Or probe |
| `hardware.endstopXMax` | `USE_XMAX_PLUG` | Rarely used |
| `hardware.endstopYMax` | `USE_YMAX_PLUG` | Rarely used |
| `hardware.endstopZMax` | `USE_ZMAX_PLUG` | For max homing |

### Display

| JSON Field | Configuration.h Define | Notes |
|------------|----------------------|-------|
| `hardware.displayType` | Any `LCD_*`, `DISPLAY_*`, `DGUS_*`, `TFT_*` | Parser detects any display-related define |

**Common TH3D Displays:**
- `LCD_BED_LEVELING` - Standard 12864 LCD
- `DGUS_LCD_UI_CREALITY` - Creality touchscreen
- `TFT_GENERIC` - Generic TFT

---

## Temperature Settings

### Limits

| JSON Field | Configuration.h Define | Type | Typical Range | Notes |
|------------|----------------------|------|---------------|-------|
| `temperature.hotendMinTemp` | `HEATER_0_MINTEMP` | integer | 5-10°C | Safety minimum |
| `temperature.hotendMaxTemp` | `HEATER_0_MAXTEMP` | integer | 275-300°C | All-metal = 300°C+ |
| `temperature.bedMinTemp` | `BED_MINTEMP` | integer | 5-10°C | Safety minimum |
| `temperature.bedMaxTemp` | `BED_MAXTEMP` | integer | 110-120°C | AC beds = 150°C+ |

### PID Tuning

#### Hotend PID

| JSON Field | Configuration.h Define | Type | Notes |
|------------|----------------------|------|-------|
| `temperature.pidHotendEnabled` | `PIDTEMP` | boolean | Define present = enabled |
| `temperature.pidHotendP` | `DEFAULT_Kp` | float | Proportional gain |
| `temperature.pidHotendI` | `DEFAULT_Ki` | float | Integral gain |
| `temperature.pidHotendD` | `DEFAULT_Kd` | float | Derivative gain |

**Calibration Command:** `M303 E0 S220 C8 U1`

#### Bed PID

| JSON Field | Configuration.h Define | Type | Notes |
|------------|----------------------|------|-------|
| `temperature.pidBedEnabled` | `PIDTEMPBED` | boolean | Define present = enabled |
| `temperature.pidBedP` | `DEFAULT_bedKp` | float | Proportional gain |
| `temperature.pidBedI` | `DEFAULT_bedKi` | float | Integral gain |
| `temperature.pidBedD` | `DEFAULT_bedKd` | float | Derivative gain |

**Calibration Command:** `M303 E-1 S60 C8 U1`

---

## Motion Settings

### Steps Per Millimeter

**Array:** `DEFAULT_AXIS_STEPS_PER_UNIT { X, Y, Z, E }`

| JSON Field | Array Index | Typical Values | Notes |
|------------|-------------|----------------|-------|
| `motion.stepsPerMM.x` | [0] | 80, 160 | Belt-driven |
| `motion.stepsPerMM.y` | [1] | 80, 160 | Belt-driven |
| `motion.stepsPerMM.z` | [2] | 400, 800, 1600 | Leadscrew dependent |
| `motion.stepsPerMM.e` | [3] | 93, 415, 760 | **Use E-Steps Calculator!** |

**Warning:** E-steps outside 50-1000 range is unusual!

### Maximum Feedrates (mm/s)

**Array:** `DEFAULT_MAX_FEEDRATE { X, Y, Z, E }`

| JSON Field | Array Index | Typical Values |
|------------|-------------|----------------|
| `motion.maxFeedrate.x` | [0] | 300-600 |
| `motion.maxFeedrate.y` | [1] | 300-600 |
| `motion.maxFeedrate.z` | [2] | 5-20 |
| `motion.maxFeedrate.e` | [3] | 25-100 |

### Maximum Acceleration (mm/s²)

**Array:** `DEFAULT_MAX_ACCELERATION { X, Y, Z, E }`

| JSON Field | Array Index | Typical Values |
|------------|-------------|----------------|
| `motion.maxAccel.x` | [0] | 500-3000 |
| `motion.maxAccel.y` | [1] | 500-3000 |
| `motion.maxAccel.z` | [2] | 100-500 |
| `motion.maxAccel.e` | [3] | 5000-10000 |

### Other Accelerations

| JSON Field | Configuration.h Define | Typical Values | Purpose |
|------------|----------------------|----------------|---------|
| `motion.defaultAcceleration` | `DEFAULT_ACCELERATION` | 500-1500 | Printing moves |
| `motion.retractAcceleration` | `DEFAULT_RETRACT_ACCELERATION` | 1000-3000 | Retraction speed |
| `motion.travelAcceleration` | `DEFAULT_TRAVEL_ACCELERATION` | 1000-3000 | Non-printing moves |

### Jerk Settings

**Note:** Only used if `CLASSIC_JERK` is defined. Otherwise uses Junction Deviation.

| JSON Field | Configuration.h Define | Typical Values |
|------------|----------------------|----------------|
| `motion.classicJerk` | `CLASSIC_JERK` | boolean (define present) |
| `motion.jerkX` | `DEFAULT_XJERK` | 8-15 mm/s |
| `motion.jerkY` | `DEFAULT_YJERK` | 8-15 mm/s |
| `motion.jerkZ` | `DEFAULT_ZJERK` | 0.3-0.5 mm/s |
| `motion.jerkE` | `DEFAULT_EJERK` | 5-15 mm/s |

### Junction Deviation (Alternative to Jerk)

| JSON Field | Configuration.h Define | Typical Values | Notes |
|------------|----------------------|----------------|-------|
| `motion.junctionDeviation` | `JUNCTION_DEVIATION_MM` | 0.005-0.020 | Only if CLASSIC_JERK undefined |

### S-Curve Acceleration

| JSON Field | Configuration.h Define | Notes |
|------------|----------------------|-------|
| `motion.sCurveAcceleration` | `S_CURVE_ACCELERATION` | Smoother acceleration curves |

---

## Probe Configuration

### Probe Type Detection

**Priority Order (first match wins):**

| JSON Value | Configuration.h Defines | Notes |
|------------|------------------------|-------|
| `EZABL` | `EZABL_ENABLE` or `EZABL_POINTS` | **TH3D-specific** |
| `BLTouch` | `BLTOUCH` | Most common |
| `Fixed` | `FIX_MOUNTED_PROBE` | Inductive, capacitive, etc. |
| `Nozzle` | `NOZZLE_AS_PROBE` | Nozzle contact |

### Probe Offsets

**Array:** `NOZZLE_TO_PROBE_OFFSET { X, Y, Z }`

| JSON Field | Array Index | Typical Range | Sign Convention |
|------------|-------------|---------------|-----------------|
| `probe.offset.x` | [0] | -50 to +50 | Negative = left of nozzle |
| `probe.offset.y` | [1] | -50 to +50 | Negative = in front of nozzle |
| `probe.offset.z` | [2] | -3 to 0 | Use Z-Offset Cal tool |

**Calibration:** Use the Z-Offset Calibration tool in the toolbox!

### Probe Pin Configuration

| JSON Field | Configuration.h Define | Notes |
|------------|----------------------|-------|
| `probe.usesZMinPin` | `Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN` | Shares Z endstop pin |

---

## Bed Leveling

### Leveling Type Detection

**Priority Order (first match wins):**

| JSON Value | Configuration.h Define | Description |
|------------|----------------------|-------------|
| `UBL` | `AUTO_BED_LEVELING_UBL` | Unified Bed Leveling (most advanced) |
| `BILINEAR` | `AUTO_BED_LEVELING_BILINEAR` | Bilinear interpolation (common) |
| `LINEAR` | `AUTO_BED_LEVELING_LINEAR` | Planar compensation |
| `3POINT` | `AUTO_BED_LEVELING_3POINT` | 3-point leveling |
| `MESH` | `MESH_BED_LEVELING` | Manual mesh |

### Mesh Configuration

| JSON Field | Configuration.h Define | Typical Values | Notes |
|------------|----------------------|----------------|-------|
| `bedLeveling.gridPointsX` | `GRID_MAX_POINTS_X` | 3, 5, 7, 10 | More = better detail |
| `bedLeveling.gridPointsY` | `GRID_MAX_POINTS_Y` | 3, 5, 7, 10 | Usually same as X |
| `bedLeveling.fadeHeight` | `DEFAULT_LEVELING_FADE_HEIGHT` | 0, 10, 20 | 0 = disabled |
| `bedLeveling.restoreAfterG28` | `RESTORE_LEVELING_AFTER_G28` | boolean | Re-enable after homing |

**Recommendations:**
- Standard printers: 3x3 or 5x5
- Large printers: 7x7 or higher
- UBL: 10x10 or 15x15 (stores in EEPROM)

---

## Advanced Features

### Linear Advance

| JSON Field | Configuration.h Define | File Location | Notes |
|------------|----------------------|---------------|-------|
| `advanced.linearAdvance` | `LIN_ADVANCE` | Configuration_adv.h | Pressure compensation |
| `advanced.linearAdvanceK` | `LIN_ADVANCE_K` | Configuration_adv.h | K factor (0.05-0.15 typical) |

**Calibration:** Use Pressure Advance Calibration tool!

### Arc Support

| JSON Field | Configuration.h Define | File Location | Notes |
|------------|----------------------|---------------|-------|
| `advanced.arcSupport` | `ARC_SUPPORT` | Configuration_adv.h | G2/G3 commands |

**Benefits:** Smoother curves, smaller gcode files (with Arc Welder)

### Other Features

| JSON Field | Configuration.h Define | File Location | Notes |
|------------|----------------------|---------------|-------|
| `advanced.nozzlePark` | `NOZZLE_PARK_FEATURE` | Configuration.h | Park nozzle on pause |
| `advanced.powerLossRecovery` | `POWER_LOSS_RECOVERY` | Configuration_adv.h | Resume after power failure |
| `advanced.babystepping` | `BABYSTEPPING` | Configuration_adv.h | Live Z adjustment |
| `advanced.th3dRGB` | `TH3D_RGB_ENABLE` | Configuration.h | **TH3D RGB lighting** |

---

## Safety Features

### Thermal Runaway Protection

**CRITICAL:** These should ALWAYS be enabled!

| JSON Field | Configuration.h Define | Required | Error Level |
|------------|----------------------|----------|-------------|
| `safety.thermalProtectionHotend` | `THERMAL_PROTECTION_HOTENDS` | **Yes** | Critical |
| `safety.thermalProtectionBed` | `THERMAL_PROTECTION_BED` | **Yes** | Critical |
| `safety.thermalProtectionChamber` | `THERMAL_PROTECTION_CHAMBER` | No | Warning |

**Warning:** Disabling thermal protection is EXTREMELY DANGEROUS and can cause fires!

### Filament Sensor

| JSON Field | Configuration.h Define | Notes |
|------------|----------------------|-------|
| `safety.filamentSensor` | `FILAMENT_RUNOUT_SENSOR` | Pause on filament runout |

---

## File Locations

TH3D Unified Firmware uses 4 configuration files:

### 1. Configuration.h (Main Config)
**Contains:**
- Basic printer info
- Hardware configuration
- Temperature settings
- Motion settings
- Probe configuration
- Bed leveling
- Safety features

### 2. Configuration_adv.h (Advanced Features)
**Contains:**
- Linear Advance
- Arc Support
- Power Loss Recovery
- Babystepping
- Advanced motion features

### 3. Configuration_backend.h (Backend Processing)
**Contains:**
- Variable references
- Conditional logic
- Derived settings

**Important:** May contain `CUSTOM_MACHINE_NAME USER_PRINTER_NAME` (variable reference!)

### 4. Configuration_speed.h (Speed Profiles)
**Contains:**
- Pre-defined speed/acceleration profiles
- Motion overrides
- TH3D speed presets

---

## Troubleshooting

### Issue: Profile Name Not Extracting

**Symptoms:** Name shows as "SHORT_BUILD_VERSION" or "TH3D Studio"

**Causes:**
1. `USER_PRINTER_NAME` is commented out or missing
2. Value is a placeholder (e.g., `SHORT_BUILD_VERSION`)
3. Parser not storing value before merge
4. Backend file overwrites with variable reference

**Solutions:**
1. Check if `USER_PRINTER_NAME "YourName"` exists in Configuration.h
2. Ensure parser stores value in `basic.userPrinterNameValue`
3. Verify merge logic preserves stored value
4. Check backend file doesn't overwrite with variable name

### Issue: EZABL Probe Not Detected

**Check:**
- `EZABL_ENABLE` or `EZABL_POINTS` is defined
- Parser checks TH3D-specific probe defines first
- File is being parsed with TH3D parser (not generic Marlin)

### Issue: Missing Motion Settings

**Check:**
- Arrays are being parsed correctly (e.g., `{ 80, 80, 400, 93 }`)
- Parser extracts all 4 values from array
- Values are within valid ranges

### Issue: Warnings Duplicating

**Cause:** Warnings generated per-file instead of once on merged config

**Solution:** Only validate merged configuration, not individual files

---

## Parser Update Workflow

**Template-First Development:**

1. **Update this document first**
   - Add new field to appropriate section
   - Document the Configuration.h define
   - Add examples and notes

2. **Update th3d-field-mapping.json**
   - Add complete field metadata
   - Include validation rules
   - Document file location

3. **Update th3d-config-parser.js**
   - Add parsing logic for new field
   - Reference mapping template
   - Test extraction

4. **Test & Validate**
   - Use mapping as checklist
   - Verify all fields extract correctly
   - Check warnings are appropriate

---

## Version History

- **v1.0.0** (2025-12-23) - Initial comprehensive reference
  - Complete field mapping
  - TH3D-specific fields documented
  - Multi-file structure explained

---

## Additional Resources

- **TH3D Unified Firmware:** https://www.th3dstudio.com/knowledgebase/th3d-unified-firmware-package/
- **Marlin Documentation:** https://marlinfw.org/docs/configuration/configuration.html
- **E-Steps Calculator:** Use the integrated tool in the toolbox
- **Z-Offset Calibration:** Use the integrated tool in the toolbox
- **Pressure Advance Cal:** Use the integrated tool in the toolbox

---

**Remember:** This document is the source of truth! Update it BEFORE changing parser code.
