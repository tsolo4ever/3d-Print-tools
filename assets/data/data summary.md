# Stepper drivers

## Summary

| Category | Count |
|----------|-------|
| **Stock Drivers** | 12 |
| **Aftermarket Drivers** | 18 |
| **Legacy/CNC Drivers** | 8 |
| **Total** | 38 |

### Key Features Added:
- **`stockOnBoards`**: Array of board IDs that ship with this driver
- **`stockOnPrinters`**: Printers that have this driver stock
- **`aftermarketFor`**: Compatible boards/printers for upgrades
- **`marlinDefine`**: Exact Marlin define to use
- **`rmsCurrent`**: Real-world continuous current
- **`microstepping`**: Array of supported values
- **`sensorlessHoming`**: Boolean for quick filtering

### Manufacturers Covered:
- Trinamic (TMC series)
- Allegro (A4988, A4982)
- Texas Instruments (DRV8825)
- OnSemi (LV8729)
- STMicroelectronics (ST820)
- Toshiba (TB6560, TB6600, THB6128)
- Various CNC (DM542, DM860)

# Board Summary

## Summary

| Statistic | Count |
|-----------|-------|
| **Total Boards** | 137 |
| **Manufacturers** | 25+ |
| **8-bit (AVR)** | ~25 |
| **32-bit (ARM/Others)** | ~112 |
| **WiFi Capable** | ~30 |

### Manufacturers Covered:
- RepRap/Open Source
- Ultimachine
- Creality
- BigTreeTech (BTT)
- Makerbase (MKS)
- FYSETC
- Duet3D
- Panucatt (Azteeg)
- Geeetech
- Anycubic
- Anet
- Artillery
- Tronxy
- Lerdge
- FLSUN
- Zonestar
- Voxelab
- Elegoo
- Sovol
- Longer
- Cohesion3D
- Printrbot
- PJRC (Teensy)
- BIQU

### Notes:
- Added `driverSlots` field to all entries
- Corrected Artillery Ruby MCU to STM32F401RCT6
- Included CAN bus toolhead boards (EBB series)
- Included ESP32-based boards
- Included legacy boards for completeness
- Added safety warning for Anet 1.0 board

# Hotend Summary

## Summary

| Category | Count |
|----------|-------|
| **Stock Hotends** | 33 |
| **Aftermarket Hotends** | 42 |
| **Total** | 75 |

### Key Features:
- **Auto-populate thermistor**: Each hotend has `thermistor` (ID) and `thermistorType` (name) for auto-filling
- **`compatibleMachines`**: Lists printers that use this hotend stock or are common upgrades
- **Voltage/Wattage**: Important for firmware heater config
- **Nozzle types**: Helps with spare parts selection
- **Heatbreak info**: Critical for max temp settings

### Manufacturers Covered:
- **Stock**: Creality, Prusa, Anycubic, Artillery, Elegoo, Voxelab, Sovol, Tronxy, Anet, Geeetech, FLSUN, Wanhao, Longer, Zonestar, BIQU, Bambu Lab
- **Aftermarket**: E3D, Slice Engineering, Phaetus, TriangleLab, Mellow, Micro Swiss, Bondtech, Dyze Design, DropEffect

### Important Notes in Data:
- ⚠️ Clone thermistor warnings (EPCOS vs Semitec)
- ⚠️ PT1000/PT100 thermistor requirements for Revo/Rapido
- ⚠️ Special thermistors for Slice/Dyze high-temp
- ⚠️ PTFE temp limits noted
- ⚠️ Fire hazard warning on Anet A8



# Thermistor Summary

## Summary

| Category | Count |
|----------|-------|
| **Stock NTC** | 22 |
| **Specialty/Legacy NTC** | 15 |
| **High-Temp NTC** | 4 |
| **PT100/PT1000 RTD** | 8 |
| **Thermocouple** | 5 |
| **Testing/Virtual** | 2 |
| **Total** | 56 |

### Key Features Added:
- **`stockOnBoards`**: Board IDs that commonly ship with this thermistor
- **`stockOnPrinters`**: Printers that use this thermistor stock
- **`stockOnHotends`**: Hotend IDs that use this thermistor
- **`marlinDefine`**: Exact value for TEMP_SENSOR_X
- **`pullupResistor`**: Required pullup resistance
- **`recommendedMaxTemp`**: Safe operating maximum
- **`category`**: For filtering (Stock, High-Temp, Bed, Testing, etc.)

### Important Matching Notes:
- **Type 1 (EPCOS)**: Most Chinese printers (Creality, Anycubic, Elegoo, etc.)
- **Type 5 (Semitec)**: Genuine E3D, Prusa, Phaetus Dragon
- **Type 11 (3950)**: Wanhao, Monoprice, Keenovo heaters
- **Type 67**: Slice Engineering Mosquito/Copperhead
- **Type 66**: Dyze high-temp hotends
- **Type 1047 (PT1000)**: E3D Revo, Phaetus Rapido, Bambu Lab

# Display Summary

## Summary

| Category | Count |
|----------|-------|
| **Character LCD** | 4 |
| **Graphic LCD 128x64** | 12 |
| **OLED** | 2 |
| **DWIN (Creality)** | 5 |
| **DGUS Touch** | 4 |
| **BTT TFT** | 2 |
| **MKS TFT** | 6 |
| **Generic TFT** | 6 |
| **Manufacturer Stock** | 8 |
| **Specialty** | 5 |
| **Special Options** | 4 |
| **Total** | 58 |

### Key Features Added:
- **`stockOnBoards`**: Board IDs that ship with this display
- **`stockOnPrinters`**: Printers using this display stock
- **`compatibleBoards`**: All boards that support this display
- **`marlinDefine`**: Exact Marlin Configuration.h define
- **`connectorType`**: Physical connector type (EXP1+EXP2, ribbon, UART, etc.)
- **`controller`**: Display controller chip (ST7920, ILI9488, etc.)
- **`encoderSteps`**: Steps per detent for rotary encoder
- **`sdCardSlot`**: Where SD card is located (LCD, Board, None)
- **`voltage`**: Operating voltage
- **`category`**: For filtering (Stock, Touch, Compact, etc.)

### Important Matching Notes:
- **CR10_STOCKDISPLAY**: Works with BTT SKR Mini E3 boards
- **DWIN_CREALITY_LCD**: Ender 3 V2/S1 series
- **FYSETC_MINI_12864_2_1**: Popular Voron choice
- **MKS_TS35_V2_0**: MKS Robin Nano boards
- **TOUCH_UI_FTDI_EVE**: LulzBot printers


## Summary of Recommended Additions

| Dataset | Purpose | Priority |
|---------|---------|----------|
| **bed-probes.json** | ABL probe types | High |
| **leveling-types.json** | ABL methods | High |
| **extruder-types.json** | Extruder configs + steps | Medium |
| **kinematics.json** | Motion systems | Medium |
| **eeprom-settings.json** | EEPROM<->Gcode<->Config mapping | **Critical** |
| **features.json** | Marlin feature flags | High |
| **printer-profiles.json** | Complete printer presets | Medium |

---

## For EEPROM/Config.h Parsing

The **most critical** addition is `eeprom-settings.json` because it maps:

1. **G-code command** (M92, M203, etc.)
2. **EEPROM key** (internal storage name)
3. **Configuration.h define** (compile-time default)
4. **Data type** (for parsing)
5. **Unit** (for display)

This allows your tool to:
- Parse `M503` output and know what each value means
- Parse Configuration.h and extract defaults
- Compare EEPROM to config defaults
- Generate proper M-codes to restore settings



---

## Summary of Communication/Memory Datasets

| Dataset | Purpose | Priority |
|---------|---------|----------|
| **memory-estimation.json** | Flash/RAM per feature | High |
| **communication-settings.json** | Baud rates, buffers, use cases | High |
| **memory-calculator.js** | Calculator logic | High |

### Key Features:

1. **Memory Estimation**
   - Base memory per MCU
   - Per-feature flash/RAM costs
   - MCU limits and specs
   - Mesh memory calculation
   - Multi-extruder costs

2. **Communication Settings**
   - Baud rate recommendations by use case
   - Buffer profiles (minimal → extreme)
   - RAM usage per buffer config
   - Print mode recommendations
   - Troubleshooting guide

3. **Calculator Logic**
   - Total usage calculation
   - Warning generation
   - Buffer recommendations
   - Feature disable suggestions

Would you like me to expand any of these further or add more datasets?



## Summary - Complete Dataset List

### Already Created:
| # | File | Purpose |
|---|------|---------|
| 1 | marlin-boards.json | Board definitions |
| 2 | stepper-drivers.json | Driver configurations |
| 3 | thermistors.json | Temperature sensors |
| 4 | displays.json | LCD/TFT screens |
| 5 | hotends.json | Hotend definitions |
| 6 | memory-estimation.json | Flash/RAM calculator |
| 7 | communication-settings.json | Serial/buffers |

### Newly Recommended:
| # | File | Purpose |
|---|------|---------|
| 8 | endstops.json | Endstop types & config |
| 9 | motors-steppers.json | Motor specs & step calc |
| 10 | heaters.json | Heater cartridges & beds |
| 11 | fans.json | Fan configuration |
| 12 | build-surfaces.json | Bed surfaces |
| 13 | filaments.json | Material profiles |
| 14 | linear-advance.json | LA calibration |
| 15 | input-shaping.json | IS configuration |
| 16 | safety-features.json | Safety settings |

### Previously Recommended:
| # | File | Purpose |
|---|------|---------|
| 17 | bed-probes.json | ABL probe types |
| 18 | leveling-types.json | ABL methods |
| 19 | extruder-types.json | Extruder configs |
| 20 | kinematics.json | Motion systems |
| 21 | eeprom-settings.json | EEPROM mapping |
| 22 | features.json | Feature flags |
| 23 | printer-profiles.json | Complete presets |




## Summary - Complete Dataset Collection

Here's the complete list of all datasets created:

| # | File | Description | Status |
|---|------|-------------|--------|
| 1 | marlin-boards.json | Board definitions | ✅ Created earlier |
| 2 | stepper-drivers.json | Driver configurations | ✅ Created earlier |
| 3 | thermistors.json | Temperature sensors | ✅ Created earlier |
| 4 | displays.json | LCD/TFT screens | ✅ Created earlier |
| 5 | hotends.json | Hotend definitions | ✅ Created earlier |
| 6 | memory-estimation.json | Flash/RAM calculator | ✅ Created earlier |
| 7 | communication-settings.json | Serial/buffers | ✅ Created earlier |
| 8 | endstops.json | Endstop types & config | ✅ Created earlier |
| 9 | motors-steppers.json | Motor specs & step calc | ✅ Created earlier |
| 10 | heaters.json | Heater cartridges & beds | ✅ Created earlier |
| 11 | fans.json | Fan configuration | ✅ Created earlier |
| 12 | build-surfaces.json | Bed surfaces | ✅ Created earlier |
| 13 | filaments.json | Material profiles | ✅ Created earlier |
| 14 | linear-advance.json | LA calibration | ✅ Created earlier |
| 15 | input-shaping.json | IS configuration | ✅ Created earlier |
| 16 | safety-features.json | Safety settings | ✅ Created earlier |
| 17 | bed-probes.json | ABL probe types | ✅ Complete |
| 18 | leveling-types.json | ABL methods | ✅ Complete |
| 19 | extruder-types.json | Extruder configs | ✅ Complete |
| 20 | kinematics.json | Motion systems | ✅ Complete |
| 21 | eeprom-settings.json | EEPROM mapping | ✅ Complete |
| 22 | features.json | Feature flags | ✅ Complete |
| 23 | printer-profiles.json | Complete presets | ✅ Complete |
| 24 | gcode-reference.json | G-code commands | ✅ Complete |
| 25 | pin-mappings.json | Board pinouts | ✅ Complete |
| 26 | error-codes.json | Error troubleshooting | ✅ Complete |
| 27 | upgrade-paths.json | Upgrade recommendations | ✅ Complete |