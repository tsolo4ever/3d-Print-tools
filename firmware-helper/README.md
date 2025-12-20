# Firmware Helper

## Overview
This folder is a placeholder for future Marlin firmware configuration assistance. You can place your Marlin `.h` configuration files here for reference when setting up new printers.

## Purpose
When configuring a new printer or updating firmware, having your configuration files handy helps ensure consistent settings across tools and profiles.

## What Files to Store Here

### From Marlin Firmware
1. **Configuration.h** - Main configuration file
   - Printer dimensions
   - Hotend/thermistor settings
   - Stepper motor configurations
   - Feature enables/disables

2. **Configuration_adv.h** - Advanced configuration
   - Linear Advance settings
   - Input shaping
   - Advanced motion control
   - TMC driver settings

3. **pins.h** (optional) - Custom pin definitions

### Custom Files
- **printer-notes.txt** - Your personal notes about the printer
- **eeprom-backup.txt** - M503 output backups
- **build-notes.md** - Notes about firmware compilation settings

## How to Use

### 1. Export Your Current Configuration
```bash
# If using PlatformIO
cp Marlin/Configuration.h ~/Documents/my-printer-config/

# If using Arduino IDE
# Copy from your Marlin folder to this location
```

### 2. Add to This Folder
Simply drag and drop or copy your `.h` files here for safekeeping.

### 3. Version Control (Optional)
Consider naming files with version/date:
- `Configuration_v2.0.9.3_2024-12-20.h`
- `Configuration_adv_v2.0.9.3_2024-12-20.h`

## Future Features (Planned)

### Configuration Parser
- Automatic extraction of settings from `.h` files
- Pre-populate printer profiles from Configuration.h
- Detect firmware version and features

### Configuration Validator
- Check for common mistakes
- Validate pin assignments
- Ensure feature compatibility

### Profile Generator
- Generate slicer profiles from firmware config
- Suggest optimal settings based on hardware
- Export start/end G-code templates

## ⚠️ SAFETY WARNINGS

### Critical: Bad Firmware Flash Hazards
**REAL-WORLD INCIDENT**: A corrupted or incorrect firmware flash can cause catastrophic failures!

**Known Danger - Runaway Heating:**
- ❌ Bad flash can enable heaters WITHOUT safety limits
- ❌ Bed/hotend may heat continuously without stopping
- ❌ Can reach dangerous temperatures (>150°C bed, >300°C hotend)
- ❌ Fire hazard - can literally burn the control board or worse

### Firmware Flashing Safety Checklist
**BEFORE Flashing:**
- [ ] Backup your current working firmware (.bin file)
- [ ] Backup EEPROM settings (M503 output)
- [ ] Verify firmware file size matches your board's flash capacity
- [ ] Double-check board type in configuration
- [ ] Have fire extinguisher nearby (not joking)

**DURING First Boot After Flash:**
- [ ] **STAY WITH THE PRINTER** for first 10 minutes
- [ ] Watch bed/hotend temperatures in menu
- [ ] Verify thermal runaway protection is enabled
- [ ] Test that heaters turn OFF when target reached
- [ ] Manually trigger thermal runaway test if possible

**If Something Goes Wrong:**
- 🔥 **Heater won't stop?** → Pull power plug immediately
- 🔥 **Smoke or burning smell?** → Pull plug, evacuate, call fire dept if needed
- ⚠️ **Strange behavior?** → Flash known-good firmware immediately

### Size Matters
- Firmware **must fit** in your board's flash memory
- Too large = partial flash = undefined behavior
- Check your board specs:
  - 4.2.7 board: ~512KB flash
  - SKR boards: varies (check specs)
  - Verify compiled .bin size BEFORE flashing

### Lesson Learned (Real Experience)
> "Set one board on fire from flashing firmware that was too big. The bad flash turned the bed heater on and just let it keep heating up more and more. You learn real quick what you did wrong when that happens!" - Real user experience

**Don't make this mistake.** Always verify firmware size and watch the first boot!

## Tips

### Backup Strategy
1. **After Every Firmware Update**: Save a copy of your working configuration
2. **Before Major Changes**: Backup current EEPROM (M503) and configuration files
3. **Document Changes**: Add notes about what you modified and why
4. **Keep Known-Good Firmware**: Always have a backup .bin file that you KNOW works

### Organization
```
firmware-helper/
├── ender5-plus/
│   ├── Configuration.h
│   ├── Configuration_adv.h
│   └── notes.txt
├── ender3-v2/
│   ├── Configuration.h
│   ├── Configuration_adv.h
│   └── notes.txt
└── README.md (this file)
```

## Common Configuration Values

### Thermistor Types
- `1` - Generic 100kΩ (most common)
- `5` - ATC Semitec 104GT-2/104NT-4-R025H42G
- `11` - Generic 100kΩ beta 3950
- `13` - Hisens up to 300°C

### Extruder Steps/mm (Reference)
- Stock Ender 3: **93 steps/mm**
- BMG Clone: **415 steps/mm**
- Micro Swiss NG DD: **~130-140 steps/mm**
- Orbiter v2: **690 steps/mm**

### Hotend Max Temps
- Stock PTFE-lined: **260°C**
- All-metal: **285-300°C**
- High-temp (Mosquito): **450°C**

## Need Help?

### Resources
- [Marlin Documentation](https://marlinfw.org/docs/configuration/configuration.html)
- [Teaching Tech Calibration](https://teachingtechyt.github.io/calibration.html)
- [Reddit r/3Dprinting](https://reddit.com/r/3Dprinting)

### Configuration Generators
- [Marlin Configuration Generator](https://config.marlinfw.org/)
- [Prusa Slicer Profiles](https://github.com/prusa3d/PrusaSlicer-settings)

---

## Examples

### Example: Finding Your E-Steps from Configuration.h
```cpp
// In Configuration.h, look for:
#define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, 400, 93 }
//                                                    ^^
//                                            This is your E-steps
```

### Example: Finding Your Max Feedrate
```cpp
// In Configuration.h, look for:
#define DEFAULT_MAX_FEEDRATE          { 500, 500, 5, 25 }
//                                                     ^^
//                                       E-axis max speed (mm/s)
```

### Example: Finding PID Values
```cpp
// In Configuration.h, look for:
#define DEFAULT_Kp  22.20
#define DEFAULT_Ki   1.08
#define DEFAULT_Kd 114.00
```

---

*This folder structure and helper system will be expanded in future updates to provide automated configuration assistance.*
