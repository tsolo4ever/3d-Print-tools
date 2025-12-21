# ⚠️ CRITICAL SAFETY DISCLAIMER ⚠️

## READ THIS BEFORE USING PRINTER PROFILES OR FIRMWARE TOOLS

---

## 🚨 FIRMWARE CONFIGURATION WARNING

**INCORRECT SETTINGS CAN PERMANENTLY DAMAGE YOUR PRINTER!**

### Critical Risks:

1. **Wrong Board/MCU Selection**
   - Compiling firmware >256KB for a 256KB MCU = **BRICKED BOARD**
   - Wrong pin mappings = **DAMAGED COMPONENTS**
   - Incorrect drivers = **DESTROYED STEPPER DRIVERS**

2. **Temperature Settings**
   - Wrong thermistor type = **FIRE HAZARD**
   - Disabled thermal protection = **FIRE HAZARD**
   - Incorrect max temps = **MELTED HOTEND/BED**

3. **Motion Settings**
   - Wrong steps/mm = **CRASHED AXES**
   - Excessive acceleration = **MECHANICAL DAMAGE**
   - Wrong endstop config = **CRUSHED COMPONENTS**

---

## ✅ MANDATORY VERIFICATION STEPS

### Before Compiling Firmware:

#### 1. **VERIFY YOUR MOTHERBOARD**

**DO NOT TRUST THE DATABASE - VERIFY MANUALLY!**

**How to Check:**
- Power off printer
- Open control box
- Read the text printed on the motherboard PCB
- Compare with: https://github.com/MarlinFirmware/Marlin/tree/2.1.x/Marlin/src/pins

**Common Boards:**
```
Creality V4.2.2:  STM32F103RCT6 (256KB) ← SMALLER FLASH!
Creality V4.2.7:  STM32F103RET6 (512KB) ← MORE FLASH!
BTT SKR Mini E3:  STM32F103RCT6 (256KB)
BTT SKR E3 V3:    STM32G0B1RET6 (512KB)
```

**How to Verify in Configuration.h:**
```cpp
// Line ~72-74 in Configuration.h
#ifndef MOTHERBOARD
  #define MOTHERBOARD BOARD_CREALITY_V427  // ← CHECK THIS!
#endif
```

**Cross-Reference:**
- Look at: `Marlin/src/core/boards.h`
- Find your BOARD_ definition
- Verify it matches your physical board

#### 2. **VERIFY THERMISTOR TYPES**

**WRONG THERMISTOR = FIRE RISK!**

**How to Check:**
- Look at thermistor that came with your hotend
- Check manufacturer specs
- Common: Type 1 (100kΩ EPCOS) or Type 5 (ATC Semitec)

**In Configuration.h (~580-590):**
```cpp
#define TEMP_SENSOR_0 1        // ← Hotend thermistor
#define TEMP_SENSOR_BED 1      // ← Bed thermistor
```

**NEVER guess! Wrong value = wrong temperature reading = fire!**

#### 3. **VERIFY THERMAL PROTECTION IS ENABLED**

**In Configuration.h (~650-655):**
```cpp
#define THERMAL_PROTECTION_HOTENDS  // ← MUST BE ENABLED!
#define THERMAL_PROTECTION_BED      // ← MUST BE ENABLED!
```

**If these are commented out (//), ENABLE THEM!**

#### 4. **VERIFY STEPPER DRIVERS**

**Wrong driver = destroyed driver chips!**

**How to Check:**
- Look at driver chips on motherboard
- Read text on chip (may need magnifying glass)
- Common: TMC2208, TMC2209, A4988

**In Configuration.h (~230-240):**
```cpp
#define X_DRIVER_TYPE TMC2208_STANDALONE  // ← Verify!
#define Y_DRIVER_TYPE TMC2208_STANDALONE
#define Z_DRIVER_TYPE TMC2208_STANDALONE
#define E0_DRIVER_TYPE TMC2208_STANDALONE
```

#### 5. **VERIFY ENDSTOP CONFIGURATION**

**Wrong endstops = crashed printer!**

**In Configuration.h (~540-560):**
```cpp
//#define USE_XMIN_PLUG     // Commented = not used
#define USE_XMAX_PLUG       // Uncommented = used
#define USE_YMAX_PLUG
#define USE_ZMIN_PLUG       // Usually probe
```

**Match this to your actual wiring!**

---

## 🔍 BEFORE YOU CLICK "COMPILE"

### Checklist:

- [ ] I physically opened my printer and verified the board model
- [ ] I confirmed the MCU chip number (RCT6 vs RET6)
- [ ] I checked the flash size matches (256KB vs 512KB)
- [ ] I verified thermistor types match my actual hardware
- [ ] I confirmed thermal protection is ENABLED
- [ ] I verified stepper driver types
- [ ] I checked endstop configuration matches my wiring
- [ ] I have a backup of my working firmware
- [ ] I know how to recover from a bricked board

### If ANY checkbox is unchecked → STOP! DO NOT COMPILE!

---

## 📐 FLASH SIZE VERIFICATION

### Check Compiled Firmware Size:

**After compiling, look for output like:**
```
RAM:   [====      ]  39.2% (used 25728 bytes from 65536 bytes)
Flash: [========= ]  89.4% (used 234567 bytes from 262144 bytes)
```

**CRITICAL:**
- If Flash > 95% → **TOO BIG! DON'T FLASH!**
- If Flash > 100% → **WILL BRICK BOARD!**
- 262144 bytes = 256KB
- 524288 bytes = 512KB

**Your board's flash:**
```
RCT6 boards: MAX 256KB (262,144 bytes)
RET6 boards: MAX 512KB (524,288 bytes)
```

---

## 🆘 RECOVERY INFORMATION

### If You Brick Your Board:

**STM32 Boards (Creality, BTT):**
1. Enter DFU mode (usually hold boot button, power on)
2. Use STM32CubeProgrammer to reflash bootloader
3. Reflash working firmware

**Arduino Boards (RAMPS):**
1. Reflash bootloader via ISP
2. Use Arduino IDE to upload firmware

**Links:**
- STM32CubeProgrammer: https://www.st.com/en/development-tools/stm32cubeprog.html
- Recovery Guide: https://github.com/MarlinFirmware/Marlin/wiki/Flashing-Marlin

---

## ⚖️ LEGAL DISCLAIMER

**THIS TOOL PROVIDES CONFIGURATION ASSISTANCE ONLY!**

- We are NOT responsible for damaged printers
- We are NOT responsible for fires, injuries, or property damage
- We are NOT responsible for lost data or bricked boards
- YOU are responsible for verifying ALL settings
- YOU assume ALL risks when modifying firmware
- NO WARRANTY is provided, express or implied

**Use at your own risk. When in doubt, consult your printer manufacturer!**

---

## ✅ BEST PRACTICES

1. **Start Small:** Test with minimal changes first
2. **One Change at a Time:** Don't change everything at once
3. **Keep Backups:** Save working configurations
4. **Test Thoroughly:** Test each feature after flashing
5. **Have Recovery Plan:** Know how to restore if things go wrong
6. **Ask for Help:** Community forums before making risky changes
7. **Read Documentation:** Official Marlin docs are your friend

---

## 📚 OFFICIAL RESOURCES

**Marlin Documentation:**
- https://marlinfw.org/docs/configuration/configuration.html
- https://marlinfw.org/docs/hardware/boards.html

**Board-Specific Guides:**
- Creality: https://github.com/MarlinFirmware/Configurations/tree/import-2.1.x/config/examples/Creality
- BTT: https://github.com/bigtreetech
- Prusa: https://help.prusa3d.com/category/firmware_248

**Community Support:**
- r/3Dprinting
- r/ender3
- Marlin Discord
- RepRap Forums

---

## 🎯 WHEN TO USE THIS TOOL

**Good Uses:**
- ✅ Documenting your current configuration
- ✅ Comparing settings between printers
- ✅ Planning upgrades
- ✅ Learning about firmware options
- ✅ Backing up configuration data

**BAD Uses:**
- ❌ Blindly trusting auto-generated settings
- ❌ Skipping manual verification
- ❌ Compiling without understanding changes
- ❌ Using profiles from unknown sources
- ❌ Making changes you don't understand

---

**REMEMBER: This tool helps organize information. YOU are responsible for verifying accuracy!**

**When in doubt, consult official documentation and your printer's manufacturer!**

---

*Last Updated: December 21, 2024*
*Always check for updated safety information before use*
