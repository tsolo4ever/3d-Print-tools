# Firmware Configuration Backup Guide
## Never Lose Your Printer Settings

*Part of the 3D Print Tools Calibration Suite*

---

## 🎯 Why Backup Firmware Settings?

### Settings Lost When:
- ❌ Firmware update/reflash
- ❌ EEPROM corruption  
- ❌ Power loss during save
- ❌ Factory reset
- ❌ Board replacement

### Regular Backups Mean:
- ✅ Instant restore after updates
- ✅ Compare settings over time
- ✅ Document what works
- ✅ Troubleshoot issues easily

---

## 💾 What Gets Stored?

**EEPROM stores:**
- Steps per mm (X, Y, Z, E)
- Maximum feedrates & accelerations
- Z-offset & probe settings
- PID values (hotend & bed)
- Linear Advance settings
- TMC driver currents

---

## 📅 When to Backup

### Always Backup:
✅ After initial calibration  
✅ Before firmware updates  
✅ After major changes  
✅ When everything prints perfectly  
✅ Before hardware changes

### Regular Schedule:
📅 Monthly backups recommended

---

## 🔧 Backup Method: M503 Command

**Best method - works on all Marlin printers!**

### Process:

1. **Connect to printer**
   - OctoPrint, Pronterface, or USB terminal

2. **Send command:**
```gcode
M503
```

3. **Copy output:**
```gcode
M92 X80.00 Y80.00 Z800.00 E420.00    ; Steps
M203 X500.00 Y500.00 Z10.00 E50.00   ; Feedrates
M201 X500 Y500 Z100 E5000             ; Accelerations
M204 P500.00 R1000.00 T500.00        ; Print accel
M205 X8.00 Y8.00 Z0.40                ; Jerk
M851 Z-1.50                           ; Z-offset
M301 P22.20 I1.08 D114.00            ; Hotend PID
M304 P690.34 I111.47 D1068.83        ; Bed PID
```

4. **Save to file:**
```
Filename: PrinterName_EEPROM_YYYYMMDD.txt
Example: MyPrinter_EEPROM_20241214.txt
```

---

## 📖 Understanding Key Settings

### M92 - Steps per Unit
```gcode
M92 X80.00 Y80.00 Z800.00 E420.00
```
- Controls movement accuracy
- E-steps = extrusion amount
- **Most important setting!**

### M851 - Z-Offset
```gcode
M851 Z-1.50
```
- Nozzle height at Z=0
- Adjust for perfect first layer
- **Most frequently changed!**

### M301 - Hotend PID
```gcode
M301 P22.20 I1.08 D114.00
```
- Temperature control tuning
- Run PID autotune: `M303 E0 S210 C8`

### M900 - Linear Advance
```gcode
M900 K0.10
```
- Reduces blobs/gaps
- K=0.05-0.2 typical

---

## 🔄 Restoring From Backup

### Quick Restore:

1. Open backup file
2. Copy all M-commands
3. Paste into terminal
4. **Send M500** (saves to EEPROM!)
5. Send M503 to verify

**Example restore:**
```gcode
M92 X80.00 Y80.00 Z800.00 E420.00
M203 X500.00 Y500.00 Z10.00 E50.00
M201 X500 Y500 Z100 E5000
M851 Z-1.50
M301 P22.20 I1.08 D114.00
M500                 ; SAVE!
M501                 ; RELOAD
```

---

## 🛠️ Essential Commands

```gcode
M503    ; Display all settings
M500    ; Save to EEPROM
M501    ; Load from EEPROM
M502    ; Factory reset (CAUTION!)
```

**Recovery if corrupted:**
```gcode
M502    ; Reset to defaults
M500    ; Save
M501    ; Reload
; Paste backup commands here
M500    ; Save your settings
```

---

## ✅ Backup Checklist

### After Calibration:
- [ ] Send M503
- [ ] Save to dated file
- [ ] Add notes about changes
- [ ] Test print to verify

### Before Firmware Update:
- [ ] Create M503 backup
- [ ] Note firmware version
- [ ] Keep multiple copies
- [ ] Test restore afterward

---

## 💡 Pro Tips

1. **Keep 3 copies** - Local, cloud, GitHub
2. **Name descriptively** - Include date and reason
3. **Add comments** - Note what changed
4. **Test after restore** - Print calibration cube
5. **Never use M502 casually** - Wipes everything!

---

## 📁 File Organization

```
Backups/
├── Current/
│   └── LATEST_SETTINGS.txt
└── Archive/
    ├── 2024-12/
    │   ├── 20241214_baseline.txt
    │   └── 20241215_after_pid.txt
    └── ...
```

---

## 🔗 Resources

- [Marlin Documentation](https://marlinfw.org/docs/gcode/)
- [M503 Reference](https://marlinfw.org/docs/gcode/M503.html)
- [EEPROM Commands](https://marlinfw.org/docs/gcode/M500-M504.html)

---

**Part of [3D Print Tools Calibration Suite](../../index.html)**  
*Author: Claude (Anthropic AI) | Date: December 2024*
