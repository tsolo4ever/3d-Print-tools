# Firmware Configuration Backup Guide
## Never Lose Your Printer Settings Again

---

## 📋 Table of Contents

1. [Why Backup Firmware?](#why-backup)
2. [What Gets Stored in EEPROM](#whats-stored)
3. [When to Backup](#when-to-backup)
4. [Backup Methods](#backup-methods)
5. [Reading EEPROM Settings](#reading-settings)
6. [Understanding the Settings](#understanding-settings)
7. [Restoring From Backup](#restoring)
8. [Version Control Strategy](#version-control)
9. [Troubleshooting](#troubleshooting)
10. [Quick Reference](#quick-reference)

---

## 🎯 Why Backup Your Firmware Configuration?

### The Problem:

**Settings can be lost when:**
- ❌ Firmware update/reflash
- ❌ EEPROM corruption
- ❌ Power loss during save
- ❌ Factory reset
- ❌ Board replacement
- ❌ Accidental changes

**Hours of calibration work = GONE!**

### The Solution:

**Regular backups mean:**
- ✅ Instant restore after firmware update
- ✅ Compare settings before/after changes
- ✅ Share perfect settings between printers
- ✅ Document what works
- ✅ Troubleshoot issues
- ✅ Peace of mind

---

## 💾 What Gets Stored in EEPROM?

**EEPROM (Electrically Erasable Programmable Read-Only Memory)** stores your printer's configuration permanently.

### Critical Settings Stored:

**Motion Settings:**
- Steps per mm (X, Y, Z, E)
- Maximum feedrates
- Maximum accelerations
- Jerk values
- Print/travel acceleration

**Probe/Leveling:**
- Z-offset
- Probe offset (X, Y, Z)
- Bed leveling mesh data
- UBL/ABL settings

**Temperature Control:**
- PID values (hotend)
- PID values (bed)
- MPC values (if using Model Predictive Control)

**Advanced Features:**
- Linear Advance (K-factor)
- Input Shaping (frequency, damping)
- Filament runout settings
- TMC driver currents
- Hybrid threshold values

**Presets:**
- Material presets (PLA, PETG, ABS temps)
- Home offsets
- Filament change settings

---

## 📅 When to Backup Your Settings

### ALWAYS Backup:

✅ **After initial calibration**
- E-steps dialed in
- Z-offset perfect
- PID tuned
- Everything working

✅ **Before firmware updates**
- Settings may be wiped
- Easy restore after

✅ **After any major changes**
- New PID values
- Adjusted steps/mm
- Changed acceleration
- Modified Z-offset

✅ **When everything is printing perfectly**
- Document the "golden" configuration
- Reference for future

✅ **Before hardware changes**
- Nozzle swap
- Hotend replacement
- Board upgrade
- Any mechanical work

### Regular Schedule:

📅 **Monthly backups** - Even if nothing changed
📅 **After every major print session** - If you made tweaks
📅 **Before experimenting** - Easy to revert

---

## 🔧 Backup Methods

### Method 1: M503 Command (Terminal/OctoPrint) ⭐ BEST

**What it does:** Displays all EEPROM settings in human-readable G-code

**Requirements:**
- Serial terminal (OctoPrint, Pronterface, Repetier Host)
- OR printer with USB connected to PC
- OR printer with web interface

**Process:**

**Step 1: Connect to Printer**
```
- Open OctoPrint web interface
OR
- Connect via USB with Pronterface/Repetier
OR
- Use printer's built-in terminal (if available)
```

**Step 2: Send Command**
```gcode
M503
```

**Step 3: Copy Output**
```
Output will look like:
echo:  G21    ; Units in mm (mm)
echo:; Linear Units:
echo:  M92 X80.00 Y80.00 Z800.00 E424.09
echo:; Maximum feedrates (units/s):
echo:  M203 X500.00 Y500.00 Z10.00 E50.00
echo:; Maximum Acceleration (units/s2):
echo:  M201 X500.00 Y500.00 Z100.00 E5000.00
... (continues for many lines)
```

**Step 4: Save to File**
```
- Copy all output
- Paste into text editor
- Save as: EEPROM_Backup_YYYYMMDD.txt
- Example: EEPROM_Backup_20251019.txt
```

**Pros:**
- ✅ Complete settings dump
- ✅ Human readable
- ✅ Easy to compare versions
- ✅ Can restore by pasting commands
- ✅ Works on any Marlin firmware

**Cons:**
- ❌ Requires connection to printer
- ❌ Manual process

---

### Method 2: Pronterface Built-in EEPROM Tool

**What it does:** GUI for viewing/editing EEPROM

**Process:**

1. **Connect Pronterface** to printer via USB
2. **Click "Settings"** tab
3. **Load current settings** from printer
4. **View all values** in organized table
5. **Export to file** (if supported)
6. **Edit values** directly (advanced)
7. **Upload to printer**

**Pros:**
- ✅ User-friendly interface
- ✅ Organized by category
- ✅ Can edit before uploading
- ✅ Built-in validation

**Cons:**
- ❌ Requires Pronterface installed
- ❌ USB connection needed
- ❌ Not all values may be shown

---

### Method 3: OctoPrint EEPROM Plugin

**Plugin:** "EEPROM Marlin Editor" or similar

**Process:**

1. **Install plugin** from OctoPrint Plugin Manager
2. **Navigate to plugin tab**
3. **Load settings** from printer
4. **View/edit** in web interface
5. **Export backup** (JSON or text)
6. **Save file** to computer

**Pros:**
- ✅ Web-based (access anywhere)
- ✅ Visual interface
- ✅ Compare backups
- ✅ Easy to use
- ✅ Can schedule automatic backups

**Cons:**
- ❌ Requires OctoPrint setup
- ❌ Plugin may not support all settings

---

### Method 4: JSON Backup Tool (Your Current Method)

**What it is:** Export EEPROM as structured JSON file

**Your backup files:**
```
Ender 5 Plus: eeprom_backup-20251014-014752.json
Ender 3 Max:  eeprom_backup-20251014-031807.json
```

**Structure:**
```json
{
  "name": "eeprom_backup-20251014-014752",
  "time": "2025-10-14 01:47:52",
  "version": 1,
  "data": {
    "steps": {
      "command": "M92",
      "params": {"X": 80.0, "Y": 80.0, "Z": 800.0, "E": 424.09}
    },
    ...
  }
}
```

**Pros:**
- ✅ Machine-readable format
- ✅ Easy to parse programmatically
- ✅ Version tracking built-in
- ✅ Organized structure

**Cons:**
- ❌ Requires specific tool/script
- ❌ Not human-friendly to read

**Recommendation:** Keep these PLUS M503 text backups!

---

### Method 5: Manual Documentation

**Old school but effective!**

**Create spreadsheet/document:**
```
Printer: Ender 5 Plus
Board: BTT SKR Mini E3
Date: October 14, 2025

Steps/mm:
  X: 80
  Y: 80
  Z: 800
  E: 424.09

Max Feedrate:
  X: 500 mm/s
  Y: 500 mm/s
  Z: 10 mm/s
  E: 50 mm/s

... (continue for all settings)
```

**Pros:**
- ✅ Always accessible
- ✅ Can add notes/explanations
- ✅ No tools required
- ✅ Easy to print out

**Cons:**
- ❌ Tedious to create
- ❌ Easy to miss settings
- ❌ Must manually restore

---

## 📖 Reading EEPROM Settings (M503 Output)

### Understanding the Output:

**When you send M503, you get:**
```gcode
echo:  M92 X80.00 Y80.00 Z800.00 E424.09  ; Steps per unit
echo:  M203 X500.00 Y500.00 Z10.00 E50.00 ; Max feedrates
echo:  M201 X500 Y500 Z100 E5000           ; Max accelerations
echo:  M204 P500.00 R1000.00 T500.00      ; Accel: Print/Retract/Travel
echo:  M205 B20000 S0.00 T0.00 X8.00 Y8.00 Z0.40 ; Jerk settings
echo:  M851 X-44.00 Y-10.00 Z-1.67        ; Probe offset
echo:  M206 X0.00 Y0.00 Z0.00             ; Home offset
echo:  M301 P27.98 I5.30 D36.94           ; Hotend PID
echo:  M304 P79.37 I9.27 D452.96          ; Bed PID
echo:  M900 K0.10                         ; Linear Advance
echo:  M593 F40.00 D0.15                  ; Input Shaping
```

**These are the actual commands to restore your settings!**

---

## 🔍 Understanding Key Settings

### M92 - Steps per Unit (Most Important!)

```gcode
M92 X80.00 Y80.00 Z800.00 E424.09
```

**What it means:**
- X/Y: 80 steps = 1mm of movement
- Z: 800 steps = 1mm of movement
- E: 424.09 steps = 1mm of filament

**Why it matters:**
- Defines dimensional accuracy
- E-steps controls extrusion amount
- NEVER change without re-calibrating!

**Your Settings:**
- Ender 5 Plus: X/Y: 80, Z: 800, E: 424.09
- Ender 3 Max: X/Y: 80, Z: 400, E: 425.00

---

### M203 - Maximum Feedrates

```gcode
M203 X500.00 Y500.00 Z10.00 E50.00
```

**What it means:**
- Maximum speed each axis can move (mm/s)
- X/Y: 500mm/s max
- Z: 10mm/s max
- E: 50mm/s max

**Safety limits:**
- Prevents commands that exceed capabilities
- Protects motors and mechanics

---

### M201 - Maximum Accelerations

```gcode
M201 X500 Y500 Z100 E5000
```

**What it means:**
- How fast axis can change speed (mm/s²)
- Higher = faster direction changes
- Lower = smoother, less ringing

**Tuning:**
- Affects print quality vs speed
- Too high = ringing/ghosting
- Too low = slow prints

---

### M204 - Printing Accelerations

```gcode
M204 P500.00 R1000.00 T500.00
```

**What it means:**
- P: Print acceleration (500 mm/s²)
- R: Retract acceleration (1000 mm/s²)
- T: Travel acceleration (500 mm/s²)

**Most important for print quality!**

---

### M205 - Jerk Settings

```gcode
M205 X8.00 Y8.00 Z0.40
```

**What it means:**
- Instant speed change allowed without acceleration
- Higher = sharper corners, more vibration
- Lower = smoother, rounded corners

**Modern Marlin:** Junction Deviation replaces jerk

---

### M851 - Probe Z-Offset (CRITICAL!)

```gcode
M851 X-44.00 Y-10.00 Z-1.67
```

**What it means:**
- Probe position relative to nozzle
- Z-offset: How far nozzle is from bed at Z=0
- **This is your most frequently adjusted setting!**

**Your Current Settings:**
- Ender 5 Plus: Z-1.67mm
- Ender 3 Max: Z-0.82mm

---

### M301 - Hotend PID

```gcode
M301 P27.98 I5.30 D36.94
```

**What it means:**
- Temperature control tuning
- P: Proportional
- I: Integral
- D: Derivative

**When to change:**
- After hotend replacement
- If temp oscillates
- Different target temps

**Run PID autotune:** `M303 E0 S210 C8`

---

### M304 - Bed PID

```gcode
M304 P79.37 I9.27 D452.96
```

**Same as hotend but for heated bed**

**Run PID autotune:** `M303 E-1 S60 C8`

---

### M900 - Linear Advance

```gcode
M900 K0.10
```

**What it means:**
- Pressure advance compensation
- Reduces blobs/gaps at direction changes
- K-factor: 0.0 = disabled, 0.05-0.2 typical

**Your Ender 5 Plus:** K=0.1 ✅

---

### M593 - Input Shaping

```gcode
M593 F40.00 D0.15
```

**What it means:**
- Reduces ringing/ghosting
- F: Frequency (Hz)
- D: Damping ratio

**Advanced feature** for better quality at high speeds

---

## 💾 Creating a Good Backup File

### Recommended File Structure:

**Filename Convention:**
```
[PrinterName]_EEPROM_[Date]_[Description].txt

Examples:
Ender5Plus_EEPROM_20251019_GoldenConfig.txt
Ender5Plus_EEPROM_20251019_BeforeFirmwareUpdate.txt
Ender5Plus_EEPROM_20251019_AfterE-StepsCalib.txt
```

**File Contents:**
```
===========================================
EEPROM BACKUP - ENDER 5 PLUS
===========================================
Date: October 19, 2025
Firmware: Marlin 2.1.2.4
Board: BTT SKR Mini E3 V3
Extruder: Microswiss NG Direct Drive
Nozzle: 0.4mm
Reason: Monthly backup - all calibrations perfect
===========================================

[M503 OUTPUT BELOW]
echo:  G21    ; Units in mm (mm)
echo:; Linear Units:
echo:  M92 X80.00 Y80.00 Z800.00 E424.09
echo:; Maximum feedrates (units/s):
echo:  M203 X500.00 Y500.00 Z10.00 E50.00
... (full M503 output)

===========================================
NOTES:
- E-steps calibrated with 100mm test
- Z-offset perfect for PEI spring steel
- PID tuned at 210°C
- Linear Advance K=0.1 tested with PLA
- Input shaping enabled, reduces ringing
===========================================
```

---

## 🔄 Restoring From Backup

### Method 1: Copy-Paste Commands (Quick Restore)

**Process:**

1. **Open backup file**
2. **Copy ALL M-commands** (M92, M203, M201, etc.)
3. **Connect to printer** (OctoPrint, Pronterface, etc.)
4. **Paste commands** into terminal
5. **Send M500** to save to EEPROM
6. **Send M501** to reload from EEPROM
7. **Verify with M503**

**Commands to restore:**
```gcode
M92 X80.00 Y80.00 Z800.00 E424.09      ; Steps
M203 X500.00 Y500.00 Z10.00 E50.00    ; Feedrates
M201 X500 Y500 Z100 E5000              ; Accelerations
M204 P500.00 R1000.00 T500.00         ; Print accel
M205 B20000 S0.00 T0.00 X8.00 Y8.00 Z0.40  ; Jerk
M851 X-44.00 Y-10.00 Z-1.67           ; Probe offset
M301 P27.98 I5.30 D36.94              ; Hotend PID
M304 P79.37 I9.27 D452.96             ; Bed PID
M900 K0.10                             ; Linear Advance
M593 F40.00 D0.15                     ; Input Shaping
M500                                   ; SAVE TO EEPROM!
M501                                   ; RELOAD FROM EEPROM
```

**CRITICAL:** Always end with M500 to save!

---

### Method 2: Manual Entry via LCD

**If no computer access:**

1. **Navigate to printer LCD**
2. **Configuration → Advanced Settings**
3. **Enter each value manually**
4. **Store Settings** when done

**Tedious but works in emergency!**

---

### Method 3: SD Card G-Code File

**Create restore script:**

**File: RESTORE_EEPROM.gcode**
```gcode
; EEPROM Restore Script
; Ender 5 Plus - October 2025
M117 Restoring EEPROM...
M92 X80.00 Y80.00 Z800.00 E424.09
M203 X500.00 Y500.00 Z10.00 E50.00
M201 X500 Y500 Z100 E5000
M204 P500.00 R1000.00 T500.00
M205 B20000 S0.00 T0.00 X8.00 Y8.00 Z0.40
M851 X-44.00 Y-10.00 Z-1.67
M301 P27.98 I5.30 D36.94
M304 P79.37 I9.27 D452.96
M900 K0.10
M593 F40.00 D0.15
M500                    ; Save to EEPROM
M117 EEPROM Restored!
```

**Usage:**
1. Copy file to SD card
2. "Print" the file
3. Settings restored!

---

## 📊 Version Control Strategy

### Why Version Control?

**Track changes over time:**
- Compare before/after adjustments
- Revert bad changes
- Document evolution
- Share successful configs

### GitHub Strategy (Your Approach):

**Folder Structure:**
```
3D-Printer-Settings/
├── Ender5Plus/
│   ├── EEPROM/
│   │   ├── 2025-10-14_baseline.json
│   │   ├── 2025-10-14_baseline.txt
│   │   ├── 2025-10-19_after-pid-tune.txt
│   │   └── CURRENT_SETTINGS.txt (always latest)
│   ├── Slicer-Profiles/
│   └── Notes/
└── Ender3Max/
    ├── EEPROM/
    └── ...
```

**Git Commit Messages:**
```
✅ Good:
"Update E-steps after calibration: 424.09 → 425.00"
"Add PID values after autotune at 215°C"
"Adjust Z-offset for new nozzle: -1.67 → -1.72"

❌ Bad:
"Update settings"
"Changed stuff"
"Backup"
```

---

### Comparison Strategy:

**Use diff tools to compare:**

**Linux/Mac:**
```bash
diff old_backup.txt new_backup.txt
```

**Windows:**
```
fc old_backup.txt new_backup.txt
```

**Online tools:**
- diffchecker.com
- text-compare.com

**What to look for:**
- E-steps changed? (calibration)
- Z-offset changed? (bed adjustment)
- PID values changed? (temperature tuning)
- Acceleration changed? (speed/quality tuning)

---

## 🛠️ Troubleshooting

### Problem 1: M500 Says "EEPROM Disabled"

**Cause:** EEPROM support not enabled in firmware

**Solution:**
1. Reflash firmware with EEPROM enabled
2. OR store settings in start G-code
3. OR set via LCD each time (annoying)

**Workaround:**
Add all M-commands to your start G-code in slicer

---

### Problem 2: Settings Reset After Power Loss

**Cause:** 
- EEPROM corrupted
- Power loss during save
- Hardware failure

**Solution:**
1. Restore from backup (M-commands)
2. Send M500 to save
3. Test by power cycling
4. If repeats, check EEPROM chip/board

---

### Problem 3: Some Settings Not in M503 Output

**Cause:** Different Marlin versions show different settings

**Solution:**
- Check specific M-commands manually
- M420 S1 (bed leveling state)
- M145 (material presets)
- M603 (filament change)
- Document these separately

---

### Problem 4: Backup Restores But Prints Wrong

**Symptoms:**
- Dimensions off
- Under/over extrusion
- Strange behavior

**Cause:** Mismatch between backup and current hardware

**Check:**
1. **Is hardware same?**
   - Same board?
   - Same extruder?
   - Same nozzle size?

2. **Verify critical settings:**
   - E-steps match extruder type
   - Z-steps match lead screw
   - Probe offsets correct

3. **Re-calibrate if needed:**
   - E-steps first!
   - Then flow rate
   - Then Z-offset

**Don't blindly restore backups from different setups!**

---

### Problem 5: JSON Backup Can't Be Restored

**Cause:** JSON format needs conversion to G-code

**Solution:**

**Manual conversion:**
```json
"steps": {
  "params": {"X": 80.0, "Y": 80.0, "Z": 800.0, "E": 424.09}
}
```

**Becomes:**
```gcode
M92 X80.00 Y80.00 Z800.00 E424.09
```

**Or:** Keep parallel M503 text backups!

---

## ✅ Backup Checklist

### After Calibration:

- [ ] Send M503 command
- [ ] Copy full output
- [ ] Save to dated file
- [ ] Add notes about changes
- [ ] Commit to GitHub (if using)
- [ ] Test print to verify
- [ ] Update "CURRENT" backup

### Before Firmware Update:

- [ ] Create backup with M503
- [ ] Note current firmware version
- [ ] Save to clearly labeled file
- [ ] Keep multiple copies (local + cloud)
- [ ] Document reason for update

### Monthly Maintenance:

- [ ] Create monthly backup
- [ ] Compare to previous month
- [ ] Note any drift/changes
- [ ] Update documentation
- [ ] Verify settings still optimal

---

## 🎯 Final Recommendations

### Your Workflow (Recommended):

**1. Regular Backups:**
```
Every Month:
- Send M503
- Save as: Ender5Plus_EEPROM_YYYYMM_Monthly.txt
- Commit to GitHub

After Calibration:
- Send M503
- Save as: Ender5Plus_EEPROM_YYYYMMDD_[What Changed].txt
- Commit to GitHub with descriptive message

Before Major Changes:
- Send M503
- Save as: Ender5Plus_EEPROM_YYYYMMDD_Before[Change].txt
```

**2. File Organization:**
```
Keep in GitHub repo:
├── Current/
│   └── CURRENT_SETTINGS.txt (always latest)
├── Archive/
│   ├── 2025-10/
│   │   ├── 2025-10-14_baseline.txt
│   │   └── 2025-10-19_after-pid.txt
│   └── ...
└── JSON-Backups/
    ├── ender5plus_latest.json
    └── ender3max_latest.json
```

**3. Quick Restore Process:**
```
1. Open latest backup
2. Copy all M-commands
3. Paste into OctoPrint terminal
4. Send M500
5. Verify with M503
6. Test print
```

---

### Essential Commands Reference:

```gcode
M503        ; Display all settings
M500        ; Save settings to EEPROM
M501        ; Load settings from EEPROM
M502        ; Load factory defaults (CAUTION!)
M504        ; Validate EEPROM contents
```

**Recovery sequence if corrupted:**
```gcode
M502        ; Load defaults
M500        ; Save defaults
M501        ; Reload
; Now restore your backup by pasting M-commands
M500        ; Save your settings
```

---

### Pro Tips:

**Tip 1:** Keep 3 copies
- Local computer
- GitHub
- Cloud backup (Dropbox, Google Drive)

**Tip 2:** Name files descriptively
- Include date, printer, reason
- Easy to find the right one

**Tip 3:** Add comments
- Note what changed
- Why it changed
- What to watch for

**Tip 4:** Test after restore
- Print calibration cube
- Verify dimensions
- Check first layer
- Confirm extrusion

**Tip 5:** Never use M502 casually!
- M502 = Factory reset
- All calibration lost
- Only use if EEPROM corrupted

---

**Backup your settings = Backup your sanity!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Universal (Examples from Ender 5 Plus & Ender 3 Max)  
**Your Backups:** JSON + M503 text format  
**Storage:** GitHub repository