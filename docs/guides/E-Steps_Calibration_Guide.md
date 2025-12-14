# E-Steps Calibration Guide
## Complete Guide to Perfect Extrusion

---

## 📋 Table of Contents

1. [What are E-Steps?](#what-are-esteps)
2. [Why Calibrate E-Steps?](#why-calibrate)
3. [When to Calibrate](#when-to-calibrate)
4. [Required Tools](#required-tools)
5. [Standard E-Steps Values](#standard-values)
6. [Step-by-Step Calibration](#step-by-step)
7. [Calculator Method](#calculator-method)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced)
11. [Quick Reference](#quick-reference)

---

## 🎯 What are E-Steps?

**E-Steps** (Extruder Steps per Millimeter) tells your printer how many motor steps are needed to push **1mm of filament** through the extruder.

### The Formula:
```
E-Steps = Motor steps needed to extrude 1mm of filament
```

### Why It Matters:
- **Too high:** Over-extrusion (blobs, stringing, elephant foot)
- **Too low:** Under-extrusion (gaps, weak parts, missing layers)
- **Just right:** Perfect extrusion, strong parts, clean prints

### Example Values:
- **Direct Drive Extruders:** 400-430 steps/mm typical
- **Bowden Extruders:** 93-95 steps/mm typical

---

## ⚡ Why Calibrate E-Steps?

### Factory Settings Aren't Accurate Because:
1. **Manufacturing tolerances** - Every extruder is slightly different
2. **Gear diameter variations** - Tiny differences in drive gear size
3. **Spring tension** - Affects grip on filament
4. **Filament diameter** - Nominal 1.75mm varies by ±0.05mm
5. **Wear over time** - Gears wear, changing effective diameter

### Benefits of Correct E-Steps:
- ✅ Accurate extrusion amounts
- ✅ Better layer adhesion
- ✅ Improved surface quality
- ✅ Stronger parts
- ✅ Less stringing and blobbing
- ✅ Consistent prints
- ✅ Predictable filament usage

### Warning Signs You Need Calibration:
- ❌ Under-extrusion (gaps in layers)
- ❌ Over-extrusion (blobs, too much plastic)
- ❌ Inconsistent layer quality
- ❌ Poor bridging
- ❌ Weak layer adhesion
- ❌ Parts fail mid-print
- ❌ Changing flow rate in slicer constantly

---

## 📅 When to Calibrate E-Steps

### ALWAYS Calibrate When:
- ✅ Setting up new printer
- ✅ Changing extruder (different brand/model)
- ✅ Installing new hotend
- ✅ Switching between direct drive and Bowden
- ✅ Changing extruder gear
- ✅ After major extruder maintenance

### MAY Need Re-Calibration:
- ⚠️ After 500+ hours of printing (gear wear)
- ⚠️ If print quality degrades over time
- ⚠️ After firmware updates (may reset EEPROM)
- ⚠️ When switching between very different filaments

### DON'T Need to Re-Calibrate:
- ❌ Changing filament colors (same brand/type)
- ❌ Changing nozzle size
- ❌ Temperature adjustments
- ❌ Speed changes
- ❌ Every print (once calibrated, it stays)

---

## 🧰 Required Tools

### Essential:
- ✅ Permanent marker (Sharpie)
- ✅ Ruler or calipers (measuring to ±0.5mm is fine)
- ✅ Scissors or flush cutters
- ✅ Computer/phone with terminal access
- ✅ Calculator (or use online E-step calculator)

### Recommended:
- 📏 Digital calipers (±0.01mm accuracy)
- 🖥️ OctoPrint, Pronterface, or direct USB connection
- 📝 Notebook to record values

### For Your Printers:
- **Ender 3 Max:** Current E-steps = 425.0
- **Ender 5 Plus:** Current E-steps = 424.09
- Both: Direct drive extruders

---

## 📊 Standard E-Steps Values Reference

### Common Extruder Types:

| Extruder Type | Typical E-Steps | Your Printer |
|---------------|----------------|--------------|
| **Creality Stock (Bowden)** | 93-95 | N/A |
| **BMG Clone (Bowden)** | 415-420 | N/A |
| **BMG Clone (Direct)** | 415-420 | N/A |
| **Orbiter v2.0** | 690 | N/A |
| **Sherpa Mini** | 690 | N/A |
| **Sprite Pro (Direct)** | 420-430 | **425.0** ✅ Ender 3 Max |
| **Micro Swiss NG (Direct)** | 420-430 | **424.09** ✅ Ender 5 Plus |
| **Hemera** | 397-410 | N/A |
| **Titan** | 400-415 | N/A |
| **E3D Revo** | 397-410 | N/A |

**Note:** These are starting points. YOUR printer will be slightly different!

---

## 📝 Step-by-Step Calibration

### 🔷 Preparation Phase

#### Step 1: Check Current E-Steps
```gcode
M503                    ; Show all settings
```

Look for line: `M92 X80.00 Y80.00 Z400.00 E###.##`

**Your current values:**
- Ender 3 Max: E425.0
- Ender 5 Plus: E424.09

Write this down! You'll need it for calculations.

#### Step 2: Heat the Hotend
```gcode
M104 S200               ; Heat to 200°C
M109 S200               ; Wait for temperature
```

**Why heat?** Cold filament won't extrude. Always calibrate at printing temperature.

**Temperature by filament:**
- PLA: 200-210°C
- PETG: 230-240°C
- ABS: 240-250°C
- TPU: 220-230°C

#### Step 3: Load Filament
1. Make sure filament is loaded and extruder is gripping it
2. Extrude 10-20mm to verify flow:
```gcode
G91                     ; Relative positioning
G1 E10 F100             ; Extrude 10mm slowly
G90                     ; Back to absolute
```

3. Watch - filament should come out smoothly

---

### 🔷 Measurement Phase

#### Step 4: Mark Your Filament

1. **Cut filament** flush with extruder entrance (or note position)
2. **Measure UP** from extruder entrance exactly **120mm**
3. **Mark with Sharpie** at the 120mm point
4. **Measure and mark again** at **70mm** (optional second reference)

**Visual Guide:**
```
Filament path:
                         ↑ 120mm mark (Sharpie line) ← MAIN REFERENCE
                         |
                         |
                         ↑ 70mm mark (optional)
                         |
                         |
    Extruder entrance → [===]
                         |
                        \|/
                    Hotend
```

**Pro Tip:** Make mark thick and clear. You'll need to see it from above.

#### Step 5: Extrude Exactly 100mm
```gcode
G91                     ; Relative mode
G1 E100 F100            ; Extrude 100mm at 100mm/min (slow and accurate)
G90                     ; Back to absolute
```

**Important:**
- **Speed: F100** (100mm/min = 1.67mm/s) - SLOW is accurate
- Don't go too fast or motor will skip steps
- Watch extruder - should be smooth, no clicking

**Wait until extrusion completes!** This takes about 60 seconds.

#### Step 6: Measure Remaining Distance

1. **Measure** from extruder entrance to your 120mm mark
2. **Record the number** (example: 23mm remaining)
3. **Calculate extruded amount:**

```
Actual extruded = 120mm - Remaining distance
```

**Example:**
- Started with 120mm mark
- Remaining: 23mm
- Actually extruded: 120 - 23 = **97mm**

**Ideal result:** Remaining should be ~20mm (meaning 100mm was extruded)

---

### 🔷 Calculation Phase

#### Step 7: Calculate New E-Steps

**Formula:**
```
New E-Steps = (Current E-Steps × Target Distance) ÷ Actual Distance
```

**Where:**
- Current E-Steps = Your current value (from M503)
- Target Distance = 100mm (what you commanded)
- Actual Distance = What actually extruded (from measurement)

#### Example Calculation 1: Under-Extrusion
```
Current E-Steps: 425.0
Target: 100mm
Actual: 97mm (only extruded 97mm)

New E-Steps = (425.0 × 100) ÷ 97
New E-Steps = 42,500 ÷ 97
New E-Steps = 438.14
```

**Result:** Need MORE steps (higher number) to extrude correct amount

#### Example Calculation 2: Over-Extrusion
```
Current E-Steps: 425.0
Target: 100mm
Actual: 103mm (extruded too much)

New E-Steps = (425.0 × 100) ÷ 103
New E-Steps = 42,500 ÷ 103
New E-Steps = 412.62
```

**Result:** Need FEWER steps (lower number) to extrude correct amount

---

## 🖩 Calculator Method (TH3D Studio)

### Using Online Calculator

**Website:** https://www.th3dstudio.com/estep-calculator/

#### Step 1: Enter Values
1. **Current E-Steps:** (from M503 command)
2. **Requested Extrusion:** 100mm (what you commanded)
3. **Actual Extrusion:** (what you measured)

#### Step 2: Calculate
Click "Calculate" button

#### Step 3: Get Result
Calculator shows:
- New E-Steps value
- Ready-made G-code command
- Percentage error

#### Step 4: Copy G-code
```gcode
M92 E###.##             ; New E-steps value
M500                    ; Save to EEPROM
```

---

### 🔷 Setting New E-Steps

#### Step 8: Apply New Value

**Method 1: Terminal/OctoPrint**
```gcode
M92 E438.14             ; Set new E-steps (use your calculated value)
M500                    ; Save to EEPROM
```

**Method 2: LCD Menu (if available)**
1. Control → Motion → E-steps
2. Adjust value
3. Store Settings

#### Step 9: Verify Saved
```gcode
M503                    ; Show all settings
```

Look for: `M92 X80.00 Y80.00 Z400.00 E438.14`

Confirm your new value is there!

#### Step 10: Test Extrusion Again
```gcode
M104 S200               ; Heat nozzle
M109 S200               ; Wait
G91                     ; Relative mode
G1 E100 F100            ; Extrude 100mm
G90                     ; Absolute mode
```

Measure again - should be very close to 100mm now!

---

## ✅ Verification Methods

### Method 1: Repeat Extrusion Test
- Mark filament at 120mm again
- Extrude 100mm
- Should measure ~20mm remaining (±1mm acceptable)
- If not, recalculate with new baseline

### Method 2: Print Test Object
**Use:** 20mm Calibration Cube

**Check:**
- Wall thickness (should match slicer setting)
- No gaps in walls
- Smooth top surface
- No over-extrusion blobs

### Method 3: Single Wall Test
**Print:** Hollow cube with 1 perimeter, 0% infill

**Measure wall with calipers:**
- Should be exactly your nozzle size
- 0.4mm nozzle → 0.4mm wall
- If thicker: Over-extrusion
- If thinner: Under-extrusion

---

## 🐛 Troubleshooting

### Issue 1: Inconsistent Results

**Problem:** Each test gives different measurements

**Causes:**
- Extruding too fast (motor skipping)
- Inconsistent filament grip
- Partial clog
- Filament diameter varying

**Solutions:**
1. Reduce extrusion speed to F50 (very slow)
2. Check extruder tension
3. Clean nozzle (cold pull)
4. Use new filament
5. Measure filament diameter

---

### Issue 2: Way Off (>10% error)

**Problem:** Calculated E-steps very different from current

**Example:** Current 425, calculated 500+

**Causes:**
- Wrong current E-steps in firmware
- Measurement error
- Wrong extruder gear installed
- Mechanical issue

**Solutions:**
1. Verify current E-steps with M503
2. Re-measure carefully (do test twice)
3. Check extruder isn't slipping
4. Verify you measured correctly (120mm mark)

---

### Issue 3: E-Steps Reset After Power Cycle

**Problem:** Value reverts to default after restart

**Causes:**
- M500 not sent after M92
- EEPROM disabled in firmware
- Firmware bug

**Solutions:**
```gcode
M92 E###.##             ; Set value
M500                    ; Save to EEPROM
M501                    ; Reload from EEPROM
M503                    ; Verify it stuck
```

If still resetting, add to start gcode:
```gcode
M92 E###.##             ; Force E-steps each print
```

---

### Issue 4: Extruder Clicking During Test

**Problem:** Clicking sound during extrusion test

**Causes:**
- Extruding too fast
- Partial clog
- Temperature too low
- Excessive back-pressure

**Solutions:**
1. Reduce speed to F50
2. Increase temperature +10°C
3. Clean nozzle
4. Check for clogs
5. Verify filament path is clear

---

### Issue 5: Still Under/Over-Extruding After Calibration

**Problem:** E-steps correct but still quality issues

**It's NOT E-steps - Check:**
- Flow rate in slicer (should be 100%)
- Filament diameter in slicer (1.75mm)
- Temperature (too low = under-extrusion)
- Retraction settings
- Partial clog
- Actual filament diameter (measure with calipers)

---

## 🎓 Advanced Topics

### Filament Diameter Compensation

**Filament isn't always 1.75mm exactly!**

#### Measure Your Filament:
1. Use calipers
2. Measure in 3 places
3. Rotate filament, measure again (6 total readings)
4. Calculate average

**Example Measurements:**
- 1.73mm, 1.74mm, 1.75mm, 1.76mm, 1.74mm, 1.75mm
- Average: 1.745mm

#### Set in Slicer:
- Don't change E-steps for this!
- Change filament diameter in slicer settings
- Slicer will compensate automatically

**Note:** Some cheap filament varies ±0.1mm - this affects extrusion more than E-steps!

---

### E-Steps vs Flow Rate

**Two different things:**

**E-Steps (Firmware):**
- Hardware calibration
- "How many steps = 1mm of filament movement"
- Set once, rarely changes
- Affects ALL prints

**Flow Rate (Slicer):**
- Software multiplier
- "Print more or less plastic"
- Can adjust per filament/print
- Compensates for filament variations

**Best Practice:**
1. Calibrate E-steps FIRST (get hardware right)
2. Then adjust flow rate per filament if needed
3. Flow rate should be 95-105% if E-steps correct

---

### Temperature Effects on Extrusion

**Hotter = more fluid = easier to push = slight over-extrusion**

**Guidelines:**
- Calibrate E-steps at mid-range temp for filament
- PLA: Calibrate at 200°C (middle of 190-210°C range)
- PETG: Calibrate at 235°C (middle of 230-240°C range)

**Extreme changes:**
- Printing 40°C hotter than calibration: ~2-3% more flow
- Printing 40°C cooler: ~2-3% less flow
- Adjust flow rate in slicer, not E-steps

---

### Direct Drive vs Bowden

**Different E-steps ranges:**

**Bowden (Ender 3 stock):**
- Typical: 93-95 steps/mm
- Lower because of 3:1 gear reduction
- Long PTFE tube between extruder and hotend

**Direct Drive (Your printers):**
- Typical: 400-430 steps/mm
- Higher because direct gear drive
- No PTFE tube path (short path)

**Converting between them requires recalibration!**

---

### Gear Ratio Math

**Understanding the numbers:**

Most extruders use reduction gears:
- Motor shaft gear: Small (e.g., 10 teeth)
- Drive gear: Large (e.g., 50 teeth)
- Ratio: 5:1

**Full formula:**
```
E-Steps = (Motor steps/rev × Microsteps × Gear ratio) ÷ (Drive gear circumference)
```

**Example (BMG-style):**
- 200 steps/rev (standard stepper)
- 16 microsteps
- 3:1 gear ratio
- 11mm drive gear circumference
- E-Steps = (200 × 16 × 3) ÷ 11 = ~436 steps/mm

**You don't need to calculate this - just use the calibration method!**

---

## 📋 Quick Reference Card

### Print This and Keep at Your Printer!

```
═══════════════════════════════════════════════════
          E-STEPS CALIBRATION QUICK GUIDE
═══════════════════════════════════════════════════

CURRENT E-STEPS:
  Ender 3 Max:    425.0 (Sprite Pro Extruder)
  Ender 5 Plus:   424.09 (Micro Swiss NG)

QUICK CALIBRATION PROCESS:

1. CHECK CURRENT:
   M503                 ; View current E-steps

2. HEAT NOZZLE:
   M104 S200            ; Heat to 200°C
   M109 S200            ; Wait for temp

3. MARK FILAMENT:
   - Mark at exactly 120mm from extruder entrance
   - Use permanent marker

4. EXTRUDE:
   G91                  ; Relative mode
   G1 E100 F100         ; Extrude 100mm slowly
   G90                  ; Absolute mode

5. MEASURE:
   - Measure remaining distance to mark
   - Should be ~20mm if perfect

6. CALCULATE:
   New E-Steps = (Current × 100) ÷ Actual
   
   Example:
   Current: 425.0
   Actual: 97mm
   New: (425 × 100) ÷ 97 = 438.14

7. SET NEW VALUE:
   M92 E438.14          ; Set new E-steps
   M500                 ; Save to EEPROM

8. VERIFY:
   M503                 ; Confirm saved

ONLINE CALCULATOR:
  https://www.th3dstudio.com/estep-calculator/

═══════════════════════════════════════════════════
        REMEMBER: SLOW EXTRUSION = ACCURATE!
              Use F100 or slower!
═══════════════════════════════════════════════════
```

---

## 🔄 Calibration Checklist

### First-Time Setup:
- [ ] Record current E-steps (M503)
- [ ] Heat hotend to print temperature
- [ ] Load filament and verify flow
- [ ] Mark filament at 120mm
- [ ] Extrude 100mm at F100
- [ ] Measure actual extrusion
- [ ] Calculate new E-steps
- [ ] Apply new value (M92)
- [ ] Save to EEPROM (M500)
- [ ] Verify with M503
- [ ] Test again (should be ~100mm)
- [ ] Print test cube
- [ ] Document final value

### Verification Print:
- [ ] 20mm calibration cube
- [ ] Measure wall thickness
- [ ] Check for gaps
- [ ] Verify top surface
- [ ] Compare to expected dimensions

### Periodic Re-Check (Every 6 months):
- [ ] Repeat calibration process
- [ ] Compare to previous value
- [ ] If >5% different, investigate why
- [ ] Update documentation

---

## 🎯 Common E-Steps Values by Extruder

### Your Printers (Reference):

**Ender 3 Max (Sprite Pro Extruder):**
- Type: Direct Drive
- Current: 425.0 steps/mm
- Expected range: 420-430
- Status: ✅ Within normal range

**Ender 5 Plus (Micro Swiss NG):**
- Type: Direct Drive
- Current: 424.09 steps/mm
- Expected range: 420-430
- Status: ✅ Within normal range

**Both values are very close - this is normal for similar extruder designs!**

---

### Community Reference Values:

| Extruder | Type | E-Steps Range | Notes |
|----------|------|---------------|-------|
| Creality Stock | Bowden | 93-95 | Original equipment |
| Creality Metal | Bowden | 93-95 | Upgraded version |
| Sprite Pro | Direct | 420-430 | Your Ender 3 Max |
| Micro Swiss NG | Direct | 420-430 | Your Ender 5 Plus |
| BMG Clone | Either | 415-420 | Popular upgrade |
| Orbiter 1.5 | Direct | 690 | High ratio |
| Orbiter 2.0 | Direct | 690 | High ratio |
| Sherpa Mini | Direct | 690 | Voron design |
| Hemera | Direct | 397-410 | E3D design |
| Titan | Either | 400-415 | E3D design |
| LGX Lite | Direct | 562 | Bondtech |

---

## 📊 Troubleshooting Decision Tree

```
START: Extrusion Issues?
    │
    ├─→ Under-extrusion (gaps)?
    │   ├─→ E-steps too LOW → Calculate and increase
    │   ├─→ Partial clog? → Clean nozzle
    │   └─→ Temp too low? → Increase 5-10°C
    │
    ├─→ Over-extrusion (blobs)?
    │   ├─→ E-steps too HIGH → Calculate and decrease
    │   ├─→ Flow rate >100%? → Reset to 100% in slicer
    │   └─→ Temp too high? → Decrease 5-10°C
    │
    ├─→ Inconsistent extrusion?
    │   ├─→ Filament diameter varies? → Measure and adjust in slicer
    │   ├─→ Extruder slipping? → Adjust tension
    │   └─→ Partial clog? → Cold pull
    │
    └─→ Extruder clicking?
        ├─→ E-steps way too high → Recalibrate from scratch
        ├─→ Temperature too low → Increase temp
        ├─→ Nozzle clogged? → Clean/replace nozzle
        └─→ Print speed too fast? → Reduce speed
```

---

## 💡 Pro Tips

### Tip 1: Slow is Accurate
Always extrude slowly during calibration (F100 or less). Fast extrusion can cause motor to skip steps.

### Tip 2: Use New Filament
Old/wet filament can give inconsistent results. Use fresh, dry filament for calibration.

### Tip 3: Multiple Tests
Do the calibration test 2-3 times and average the results for best accuracy.

### Tip 4: Room Temperature
Calibrate in consistent environment. Cold room = cold filament = different results.

### Tip 5: Document Everything
Keep a log of E-steps values for each extruder configuration. Save yourself time later!

### Tip 6: Don't Over-Adjust
If you're within ±2%, you're good enough. Don't chase perfection to 0.01 steps.

### Tip 7: Verify with Prints
Numbers are great, but real prints are proof. Print a calibration cube to verify.

---

## 📊 Measurement Accuracy Guide

### Acceptable Tolerances:

**E-Steps Calibration:**
- ±1mm on 100mm extrusion = ±1% error
- ±2mm = ±2% error (acceptable)
- ±5mm = ±5% error (needs adjustment)
- ±10mm = ±10% error (serious problem)

**Your Target:**
- Goal: Within ±1mm (99-101mm extruded)
- Acceptable: Within ±2mm (98-102mm)
- Recalibrate if: >±2mm off

**Real-World Impact:**
- 1% error: Barely noticeable
- 2% error: Visible but acceptable
- 5% error: Noticeable quality issues
- 10% error: Serious print problems

---

## 📝 Calibration Log Template

```
═══════════════════════════════════════════════════
                E-STEPS CALIBRATION LOG
═══════════════════════════════════════════════════

Printer: ______________________
Extruder Type: ______________________
Date: __________

BEFORE CALIBRATION:
  Current E-Steps: ________
  Source: [ ] M503  [ ] Firmware  [ ] Documentation

CALIBRATION PROCESS:
  Test 1:
    - Marked at: ______mm
    - Commanded: 100mm
    - Remaining: ______mm
    - Actual extruded: ______mm
    - Calculated E-Steps: ________

  Test 2 (verification):
    - Marked at: ______mm
    - Commanded: 100mm
    - Remaining: ______mm
    - Actual extruded: ______mm
    - Calculated E-Steps: ________

  Average E-Steps: ________

AFTER CALIBRATION:
  New E-Steps Set: ________
  Saved to EEPROM: [ ] Yes  [ ] No
  Verified with M503: [ ] Yes  [ ] No

VERIFICATION PRINT:
  Test object: ______________________
  Result: [ ] Perfect  [ ] Acceptable  [ ] Needs adjustment
  Notes: _________________________________

FINAL E-STEPS: ________

═══════════════════════════════════════════════════
```

---

## ✅ Success Checklist

Your E-steps are correctly calibrated when:
- ✅ 100mm command extrudes 99-101mm actual
- ✅ No gaps in solid infill
- ✅ No over-extrusion blobs
- ✅ Top surfaces smooth and solid
- ✅ Bridges print cleanly
- ✅ Layer lines consistent
- ✅ Perimeters have no gaps
- ✅ Calibration cube measures correctly
- ✅ Flow rate at 100% in slicer
- ✅ No need to adjust flow per print

---

## 🎯 Final Recommendations

### For Your Printers:

**Ender 3 Max (Sprite Pro):**
- Current: 425.0 steps/mm ✅
- If recalibrating: Expect 420-430 range
- Verify with 100mm extrusion test
- Should be within ±2mm

**Ender 5 Plus (Micro Swiss NG):**
- Current: 424.09 steps/mm ✅
- If recalibrating: Expect 420-430 range
- Nearly identical to Sprite Pro (similar design)
- Should be within ±2mm

### When in Doubt:
1. Check current value with M503
2. If within normal range (420-430), test with print first
3. Only recalibrate if actual print quality issues
4. Use slow extrusion speed (F100)
5. Save with M500 after changes

**Both your printers have reasonable E-steps values already!** Only recalibrate if experiencing actual extrusion problems.

---

## 🔗 Useful Resources

### Online Calculators:
- **TH3D Studio:** https://www.th3dstudio.com/estep-calculator/
- **Prusa Calculator:** https://blog.prusaprinters.org/calculator_3416/
- **Teaching Tech:** https://teachingtechyt.github.io/calibration.html

### Video Guides:
- Search YouTube: "E-steps calibration"
- Look for videos specific to your extruder type

### Community Help:
- Reddit: r/3Dprinting, r/ender3, r/ender5
- Forums: Creality forums, RepRap forums

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Reference:** TH3D Studio E-Step Calculator  
**Your Current Values:**
- Ender 3 Max: 425.0 steps/mm (Sprite Pro Extruder)
- Ender 5 Plus: 424.09 steps/mm (Micro Swiss NG Direct Drive)
