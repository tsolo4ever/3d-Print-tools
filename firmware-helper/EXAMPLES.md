the 8bit ones that you ca# Firmware Configuration Examples

## Example Files Included

### Stock Marlin - Ender 5 Plus (V4.2.7 Board)
Real-world examples from a working Ender 5 Plus with stock Marlin:

**1. example-ender5plus-config.h**
- Main Marlin configuration file
- Ender 5 Plus with V4.2.7 board
- Marlin 2.1.2.1 firmware
- Contains: printer dimensions, thermistor settings, steppers, features

**2. example-ender5plus-config_adv.h**
- Advanced configuration file
- Linear Advance, Input Shaping, TMC drivers
- Advanced motion control settings
- Includes all the fine-tuning options

### TH3D Unified Firmware - Ender 5 Plus (SKR E3 Mini V3) - CUSTOM UBL
TH3D Unified Firmware examples for Ender 5 Plus with upgraded board and custom modifications:

**3. example-th3d-ender5plus-config.h**
- TH3D Unified 2 firmware (CUSTOM MODIFIED)
- Ender 5 Plus with SKR E3 Mini V3 board
- **⚠️ Backend modified for UBL support** (stock TH3D uses bilinear)
- Unified Bed Leveling (UBL) enabled
- Simplified configuration approach with advanced leveling

**4. example-th3d-ender5plus-config_adv.h**
- TH3D advanced configuration (CUSTOM MODIFIED)
- TMC2209 stepper driver settings
- Optimized for SKR board features
- **UBL-specific enhancements**
- Includes TH3D-specific features

**5. example-th3d-ender5plus-config_backend.h** ⭐ IMPORTANT
- **TH3D backend configuration file (WHERE UBL MODIFICATIONS ARE)**
- This is the key file showing the custom UBL implementation
- Stock TH3D doesn't expose this file for UBL
- Contains the actual bed leveling system modifications
- Shows exactly how UBL was enabled in TH3D framework

## How to Use These Examples

### Extract E-Steps
```cpp
// From Configuration.h, find:
#define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, 400, 424.09 }
//                                                    ^^^^^^
//                                            Your E-steps value
```

### Extract Max Feedrates
```cpp
// From Configuration.h, find:
#define DEFAULT_MAX_FEEDRATE          { 500, 500, 5, 25 }
//                                      X    Y    Z  E (mm/s)
```

### Extract Max Accelerations
```cpp
// From Configuration.h, find:
#define DEFAULT_MAX_ACCELERATION      { 500, 500, 100, 5000 }
//                                      X    Y    Z    E (mm/s²)
```

### Extract Jerk Settings
```cpp
// From Configuration.h, find:
#define DEFAULT_XJERK  8.0
#define DEFAULT_YJERK  8.0
#define DEFAULT_ZJERK  0.4
#define DEFAULT_EJERK  5.0
```

### Extract PID Values
```cpp
// From Configuration.h, find:
#define DEFAULT_Kp  22.20
#define DEFAULT_Ki   1.08
#define DEFAULT_Kd 114.00
```

### Extract Bed Size
```cpp
// From Configuration.h, find:
#define X_BED_SIZE 350
#define Y_BED_SIZE 350
#define Z_MAX_POS 400
```

### Extract Linear Advance
```cpp
// From Configuration_adv.h, find:
#define LIN_ADVANCE
#define LIN_ADVANCE_K 0.1  // Default K value
```

### Extract Input Shaping
```cpp
// From Configuration_adv.h, find:
#define INPUT_SHAPING_X
#define INPUT_SHAPING_Y
#define SHAPING_FREQ_X 40.0  // Hz
#define SHAPING_FREQ_Y 40.0  // Hz
```

## Differences: Stock Marlin vs TH3D Unified

### Stock Marlin:
- ✅ More customization options
- ✅ Latest Marlin features first
- ⚠️ More complex configuration
- ⚠️ Requires deeper firmware knowledge
- Best for: Advanced users, custom builds

### TH3D Unified (Custom UBL Version):
- ✅ Simplified configuration
- ✅ Pre-configured for common printers
- ✅ User-friendly structure
- ✅ Includes helpful comments
- ✅ **Custom modified for UBL support** (stock TH3D only supports bilinear)
- ✅ Better bed leveling with mesh editing capabilities
- ⚠️ May lag behind latest Marlin features
- Best for: Users wanting TH3D simplicity + advanced UBL leveling

### Which Configuration to Use?

**Use Stock Marlin examples when:**
- You want latest Marlin features
- You're comfortable with firmware
- You need maximum customization
- You're building from scratch

**Use TH3D examples when:**
- You prefer simplified setup
- You have a common printer model
- You want tested configurations
- You need UBL bed leveling (custom modification)
- You want TH3D ease + advanced leveling features

**Note:** The TH3D example has been **custom modified** to support UBL (Unified Bed Leveling). Stock TH3D firmware only includes bilinear leveling, but this version includes backend modifications for better UBL handling.

## Future Integration

These example files demonstrate:
1. **What values to extract** for printer profiles
2. **Where to find settings** in Marlin configuration
3. **How settings are structured** in firmware
4. **Differences between firmware variants**

### Planned Features:
- [ ] Automatic configuration parser (JavaScript)
- [ ] Extract all settings from .h files
- [ ] Pre-populate printer profiles from config
- [ ] Validate firmware settings
- [ ] Suggest optimizations
- [ ] Support both Marlin and TH3D parsing

## Related Files

Your complete collection in `3D-Printer-setting` folder includes:

**Firmware Configurations:**
- ✅ Stock Marlin 2.1.2.1 (V4.2.7 board) - Copied
- ✅ TH3D Unified 2 (SKR E3 Mini V3) - **Custom UBL Modified** - Copied
- TH3D Unified (Ender 3 Max) - Stock in collection
- Multiple printer variants

**Important Note:** The TH3D configuration files have been **custom modified** to support UBL (Unified Bed Leveling). Stock TH3D firmware defaults to bilinear leveling, but these examples include backend modifications for enhanced UBL support.

**EEPROM Backups:**
- ✅ Ender 5+ JSON backup - Copied to templates (from OctoPrint EEPROM Editor plugin)
- Ender 3 Max JSON backup (from OctoPrint EEPROM Editor plugin)
- OctoPrint full backups (.zip)

**Note:** The JSON EEPROM backups are from the **OctoPrint EEPROM Editor plugin**, which provides a clean JSON format that's easier to parse than raw M503 output.

**Slicer Profiles:**
- OrcaSlicer profiles (0.4, 0.6, 0.8mm nozzles)
- PrusaSlicer profiles (multiple materials)
- Multiple quality presets

All of these can be used as references for building and testing printer profiles!

## File Summary

```
firmware-helper/
├── README.md                                # Main guide
├── EXAMPLES.md                              # This file
├── example-ender5plus-config.h             # ✅ Stock Marlin
├── example-ender5plus-config_adv.h         # ✅ Stock Marlin Advanced
├── example-th3d-ender5plus-config.h        # ✅ TH3D Unified
├── example-th3d-ender5plus-config_adv.h    # ✅ TH3D Unified Advanced
└── example-th3d-ender5plus-config_backend.h # ⭐ TH3D Backend (UBL MODS HERE)
```

**5 configuration files including the critical backend:**
- 2 firmware types (Stock Marlin, TH3D Unified Custom)
- 2 board types (V4.2.7, SKR E3 Mini V3)
- 2 bed leveling approaches (UBL in both)
- Standard, advanced, AND backend configurations
- Real-world tested settings
- **Configuration_backend.h shows the actual UBL modifications!**

---

*These examples help bridge the gap between firmware configuration and printer profiles in our tools.*
