# E-Steps Calibration Guide
## Complete Guide to Perfect Extrusion

*Part of the 3D Print Tools Calibration Suite*

---

## 📋 Quick Navigation
- [What are E-Steps?](#what-are-esteps)
- [Why Calibrate?](#why-calibrate)
- [Step-by-Step Process](#step-by-step)
- [Calculator Method](#calculator)
- [Troubleshooting](#troubleshooting)

---

## 🎯 What are E-Steps?

**E-Steps** (Extruder Steps per Millimeter) tells your printer how many motor steps push 1mm of filament through the extruder.

### Why It Matters:
- **Too high:** Over-extrusion (blobs, stringing)
- **Too low:** Under-extrusion (gaps, weak parts)
- **Just right:** Perfect prints!

### Typical Values:
- **Direct Drive:** 400-430 steps/mm
- **Bowden:** 93-95 steps/mm

---

## ⚡ Why Calibrate E-Steps?

### Factory settings aren't accurate because:
1. Manufacturing tolerances vary
2. Gear diameter differences
3. Spring tension affects grip
4. Filament varies ±0.05mm
5. Gears wear over time

### Signs you need calibration:
- ❌ Gaps in layers
- ❌ Blobs and stringing
- ❌ Inconsistent quality
- ❌ Weak layer adhesion

---

## 📝 Step-by-Step Calibration

### 1. Check Current E-Steps
```gcode
M503
```
Look for: `M92 ... E###.##` - Write this down!

### 2. Heat the Hotend
```gcode
M104 S200    ; PLA temp
M109 S200    ; Wait
```

### 3. Mark Filament
- Mark exactly **120mm** above extruder entrance
- Use permanent marker

### 4. Extrude 100mm
```gcode
G91          ; Relative mode
G1 E100 F100 ; Extrude slowly
G90          ; Absolute mode
```
**Wait 60 seconds!**

### 5. Measure
- Measure remaining distance to mark
- Calculate: `Actual = 120 - Remaining`
- Example: 120 - 23 = 97mm extruded

### 6. Calculate New E-Steps
```
New E-Steps = (Current × 100) ÷ Actual

Example:
Current: 420
Actual: 97mm
New: (420 × 100) ÷ 97 = 432.99
```

### 7. Apply New Value
```gcode
M92 E432.99  ; Your calculated value
M500         ; SAVE TO EEPROM!
M503         ; Verify
```

### 8. Test Again
Repeat test - should get ~100mm

---

## 🖩 Calculator Method

**Use Online Calculator:**  
https://www.th3dstudio.com/estep-calculator/

1. Enter current E-steps
2. Enter commanded (100mm)
3. Enter actual measured
4. Copy G-code commands

---

## 🐛 Troubleshooting

### Inconsistent Results
- Extrude slower (F50)
- Check extruder tension
- Use fresh filament

### Way Off (>10% error)
- Verify M503 value
- Re-measure carefully
- Check for mechanical issues

### E-Steps Reset
```gcode
M92 E###.##
M500         ; Must save!
M503         ; Verify
```

### Extruder Clicking
- Reduce speed to F50
- Increase temperature
- Check for clogs

---

## 📊 Common E-Steps Values

| Extruder Type | E-Steps Range |
|---------------|---------------|
| Creality Stock (Bowden) | 93-95 |
| BMG Clone | 415-420 |
| Orbiter 2.0 | 690 |
| Sprite Pro | 420-430 |
| Micro Swiss | 420-430 |
| Hemera | 397-410 |

---

## ✅ Success Checklist

- ✅ 100mm command = 99-101mm actual
- ✅ No gaps in solid infill
- ✅ Smooth top surfaces
- ✅ Calibration cube measures correctly
- ✅ Flow rate at 100% in slicer

---

## 💡 Pro Tips

1. **Slow is Accurate** - Use F100 or slower
2. **Fresh Filament** - Old filament gives bad results
3. **Multiple Tests** - Average 2-3 tests
4. **Document** - Keep a log of values
5. **Don't Over-Adjust** - ±2% is fine!

---

## 🔗 Resources

- [TH3D Calculator](https://www.th3dstudio.com/estep-calculator/)
- [Teaching Tech Calibration](https://teachingtechyt.github.io/calibration.html)
- [Prusa Calculator](https://blog.prusaprinters.org/calculator_3416/)

---

**Part of [3D Print Tools Calibration Suite](../../index.html)**  
*Author: Claude (Anthropic AI) | Date: December 2024*
