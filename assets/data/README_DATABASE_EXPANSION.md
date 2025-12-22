# 📊 Hardware Database Expansion Guide

## 🎯 How to Add More Hardware to Databases

This guide shows you how to expand each database with accurate, real-world hardware data.

---

## 📁 Current Databases

### **1. marlin-boards.json** (Currently: 19 boards)
### **2. stepper-drivers.json** (Currently: 14 drivers)
### **3. thermistors.json** (Currently: 15 types)
### **4. displays.json** (Currently: 28 displays)

---

## 🔧 How to Add: Motherboards

**File:** `assets/data/marlin-boards.json`

### **Template:**
```json
{
    "id": "BOARD_MANUFACTURER_MODEL",
    "name": "Friendly Display Name",
    "manufacturer": "Manufacturer Name",
    "mcu": "Microcontroller Model",
    "voltage": 12,
    "flashSize": "128KB",
    "supportsTMC": true,
    "commonOn": ["Printer Model 1", "Printer Model 2"],
    "notes": "Any special notes or features"
}
```

### **Where to Find Info:**
- **Marlin Boards.h:** [github.com/MarlinFirmware/Marlin/blob/2.1.x/Marlin/src/core/boards.h](https://github.com/MarlinFirmware/Marlin/blob/2.1.x/Marlin/src/core/boards.h)
- **Manufacturer Specs:** Look up board on manufacturer website
- **Community Info:** Check Reddit, Facebook groups, forums

### **Example - Adding Fysetc Spider:**
```json
{
    "id": "BOARD_FYSETC_SPIDER",
    "name": "Fysetc Spider",
    "manufacturer": "Fysetc",
    "mcu": "STM32F446VET6",
    "voltage": 24,
    "flashSize": "512KB",
    "supportsTMC": true,
    "commonOn": ["Voron 2.4", "Custom CoreXY"],
    "notes": "8 stepper drivers, 32-bit ARM board"
}
```

### **Common Boards to Add:**
- ☐ Fysetc Spider
- ☐ Duet 2 WiFi
- ☐ Duet 3 6HC
- ☐ MKS SGEN_L V2
- ☐ Smoothieboard 5X
- ☐ Azteeg X5 Mini
- ☐ Re-ARM for RAMPS
- ☐ BTT Octopus
- ☐ BTT Manta M8P
- ☐ Creality V4.5.2
- ☐ Creality V4.5.3

---

## 🚗 How to Add: Stepper Drivers

**File:** `assets/data/stepper-drivers.json`

### **Template:**
```json
{
    "id": "DRIVER_NAME_MODE",
    "name": "Display Name",
    "mode": "Communication Mode",
    "microstepping": "1/256",
    "current": "3.0A",
    "features": ["Feature 1", "Feature 2"],
    "notes": "Usage notes"
}
```

### **Where to Find Info:**
- **TMC Drivers:** [github.com/trinamic](https://github.com/trinamic)
- **Datasheets:** Google "[driver name] datasheet PDF"
- **Marlin Config:** Check Configuration_adv.h for settings

### **Example - Adding TMC5160 SPI:**
```json
{
    "id": "DRIVER_TMC5160_SPI",
    "name": "TMC5160 (SPI)",
    "mode": "SPI",
    "microstepping": "1/256",
    "current": "3.0A",
    "features": ["StealthChop2", "SpreadCycle", "High current", "External MOSFET"],
    "notes": "High power driver for large motors, requires SPI connection"
}
```

### **Common Drivers to Add:**
- ☐ TMC2160
- ☐ TMC2130 SPI
- ☐ TMC2660
- ☐ TB6600
- ☐ TB6560
- ☐ ST820
- ☐ L6470
- ☐ L6474

---

## 🌡️ How to Add: Thermistors

**File:** `assets/data/thermistors.json`

### **Template:**
```json
{
    "id": "THERM_ID",
    "name": "Display Name",
    "marlinTable": 1,
    "type": "Category",
    "notes": "Common usage"
}
```

### **Where to Find Info:**
- **Marlin Thermistors:** [github.com/MarlinFirmware/Marlin/blob/2.1.x/Marlin/src/module/thermistor/](https://github.com/MarlinFirmware/Marlin/blob/2.1.x/Marlin/src/module/thermistor/)
- **Thermistor Tables:** Look at thermistor_XXX.h files
- **Manufacturer Specs:** Hotend/printer documentation

### **Example - Adding Type 20:**
```json
{
    "id": "THERM_20",
    "name": "PT100 with INA826",
    "marlinTable": 20,
    "type": "PT100",
    "notes": "High precision, requires amplifier board"
}
```

### **Common Thermistors to Add:**
- ☐ Type 2 (200k - ATC Semitec 204GT-2)
- ☐ Type 3 (Mendel-parts)
- ☐ Type 4 (10k - Generic)
- ☐ Type 6 (100k - Honeywell)
- ☐ Type 7 (100k - Honeywell with 4.7k)
- ☐ Type 8 (100k - ATC Semitec 104GT-2)
- ☐ Type 9 (100k - GE Sensing)
- ☐ Type 10 (100k - RS)
- ☐ Type 12 (100k - Beta)
- ☐ Type 20 (PT100 INA826)
- ☐ Type 147 (PT100 with 4k7)
- ☐ Type 1047 (PT1000 with 4k7)

---

## 🖥️ How to Add: Displays

**File:** `assets/data/displays.json`

### **Template:**
```json
{
    "id": "DISPLAY_TYPE",
    "name": "Display Name",
    "type": "Category",
    "connection": "Connection Type",
    "resolution": "Resolution or Size",
    "notes": "Usage info"
}
```

### **Where to Find Info:**
- **Marlin Configs:** Check Configuration.h for display defines
- **Manufacturer Sites:** BTT, MKS, Creality product pages
- **GitHub:** Search "marlin [display name]"

### **Example - Adding BTT TFT35 E3:**
```json
{
    "id": "DISPLAY_TFT35_E3",
    "name": "BTT TFT35 E3 V3.0",
    "type": "TFT Touchscreen",
    "connection": "Serial + SD Card",
    "resolution": "480x320",
    "notes": "Dual mode - Touch or 12864 emulation, Ender 3 mounting"
}
```

### **Common Displays to Add:**
- ☐ MKS TFT32/35/70
- ☐ BTT TFT24/28/35/43/50/70
- ☐ Creality CR-10 Stock
- ☐ Anycubic i3 Mega
- ☐ Mini 12864 RGB
- ☐ UC1701 displays
- ☐ ST7920 based displays
- ☐ ILI9341 displays

---

## 🔍 Research Tips

### **Finding Board IDs:**
1. Go to Marlin's `boards.h` file
2. Search for board name
3. Copy the `BOARD_XXXX` define
4. That's your ID!

### **Finding Printer Specs:**
1. **Manufacturer Website** - Official specs
2. **Marlin Configurations** - Example configs repository
3. **Reddit/Facebook** - User communities
4. **GitHub Issues** - Real-world troubleshooting
5. **YouTube Reviews** - Teardowns show internals

### **Verifying Information:**
- ✅ Cross-reference multiple sources
- ✅ Check Marlin example configs
- ✅ Look at actual boards if possible
- ✅ Verify with community if unsure

---

## 📝 Best Practices

### **DO:**
✅ Use official Marlin board IDs when available
✅ Include accurate technical specs (MCU, voltage, etc.)
✅ Add helpful notes for users
✅ Test that JSON is valid (use a validator)
✅ Keep formatting consistent with existing entries
✅ Add "commonOn" for boards (helps users identify)

### **DON'T:**
❌ Guess at specifications - research first
❌ Mix up board versions (V2 vs V3 are different!)
❌ Forget commas between entries
❌ Leave trailing commas on last entry
❌ Add duplicate entries

---

## 🧪 Testing Your Changes

### **1. Validate JSON:**
- Use [jsonlint.com](https://jsonlint.com)
- Or VS Code's built-in JSON validator
- No syntax errors = good to go!

### **2. Test in Browser:**
```javascript
// Open browser console on _template-tool.html
fetch('assets/data/marlin-boards.json')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error('Error:', e));
```

### **3. Verify in Profile Editor:**
- Open Enhanced Profiles
- Go to Hardware tab
- Check your new entries appear in dropdowns
- Verify auto-fill works (for boards)

---

## 🎯 Priority Additions

### **Most Requested Boards:**
1. **Fysetc Spider** - Voron builds
2. **BTT Octopus** - Large printers
3. **Duet boards** - RRF users migrating
4. **MKS boards** - Budget builds
5. **Creality newer versions** - V4.5.x series

### **Most Needed Drivers:**
1. **TMC5160** - High current
2. **TMC2160** - External MOSFET
3. **TB6600** - Cheap Chinese drivers

### **Common Thermistors:**
1. **Types 2-12** - Cover most cases
2. **PT100 variants** - High-end hotends
3. **Generic 100k** - Common in kits

---

## 💾 Commit Message Template

When you add entries, use this format:

```
data: Add [X] new [hardware type]

Added:
- Item 1 (used on Printer A)
- Item 2 (used on Printer B)
- Item 3 (feature notes)

Brings total to [N] entries
```

**Example:**
```
data: Add 5 new motherboards

Added:
- Fysetc Spider (Voron 2.4)
- BTT Octopus (Large CoreXY)
- Duet 2 WiFi (RRF firmware)
- MKS SGEN_L V2 (Budget 32-bit)
- BTT Manta M8P (Klipper builds)

Brings total to 24 motherboards
```

---

## 🤝 Contributing

### **Want to Share Your Additions?**
1. Fork the repo
2. Add your entries following this guide
3. Test thoroughly
4. Submit a Pull Request
5. Include sources for verification

### **Or Submit an Issue:**
- Go to GitHub Issues
- Title: "Database Addition: [Board/Driver/etc name]"
- Include all specs and sources
- Community or I can add it!

---

## 📚 Useful Resources

### **Official Marlin:**
- Main Repo: [github.com/MarlinFirmware/Marlin](https://github.com/MarlinFirmware/Marlin)
- Example Configs: [github.com/MarlinFirmware/Configurations](https://github.com/MarlinFirmware/Configurations)
- Documentation: [marlinfw.org](https://marlinfw.org)

### **Hardware Databases:**
- RepRap Wiki: [reprap.org/wiki/](https://reprap.org/wiki/)
- BTT GitHub: [github.com/bigtreetech](https://github.com/bigtreetech)
- Trinamic: [www.trinamic.com](https://www.trinamic.com)

### **Community:**
- r/3Dprinting
- r/ender3
- r/CR10
- Marlin Discord
- Facebook Groups

---

## 🎉 Your Contributions Matter!

Every board, driver, or thermistor you add helps:
- ✅ Future users find their hardware faster
- ✅ Auto-fill work for more printers
- ✅ Community database grow stronger
- ✅ Tool become more useful

**Thank you for contributing!** 🙏

---

*Last Updated: December 21, 2025*
*Database Expansion Guide v1.0*
