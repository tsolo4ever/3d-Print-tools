# Z-Offset Calibration Guide
## The Complete Guide to Perfect First Layers

---

## 📋 Table of Contents

1. [What is Z-Offset?](#what-is-z-offset)
2. [Why Z-Offset Matters](#why-matters)
3. [When to Calibrate](#when-to-calibrate)
4. [Required Tools](#required-tools)
5. [Calibration Methods](#calibration-methods)
6. [Step-by-Step Guide](#step-by-step)
7. [Troubleshooting](#troubleshooting)
8. [Z-Offset by Nozzle Size](#by-nozzle)
9. [Advanced Topics](#advanced)
10. [Quick Reference](#quick-reference)

---

## 🎯 What is Z-Offset?

**Z-offset** is the distance between your Z-endstop trigger point and the actual position where your nozzle touches the bed.

### The Problem:
- Your printer "thinks" Z=0 is when the endstop triggers
- But the nozzle might be too high or too low at that point
- Z-offset corrects this difference

### The Solution:
Z-offset tells the printer: "After you home, move Z down (or up) by X amount to actually be at bed level"

**Example:**
- Z-offset = **-1.67mm** means: "After homing, move nozzle DOWN 1.67mm more to touch the bed"
- Z-offset = **+0.5mm** means: "After homing, move nozzle UP 0.5mm to touch the bed"

---

## ⚡ Why Z-Offset Matters

### Too High (Z-offset not negative enough):
- ❌ Filament doesn't stick to bed
- ❌ First layer is round on top (not squished)
- ❌ Parts detach mid-print
- ❌ Warping and lifting corners
- ❌ Gaps between lines

### Too Low (Z-offset too negative):
- ❌ Nozzle scrapes bed
- ❌ No filament comes out
- ❌ First layer looks transparent/thin
- ❌ Filament builds up on nozzle
- ❌ Damaged PEI/build surface
- ❌ Clicking extruder (too much back-pressure)

### Just Right:
- ✅ Perfect first layer adhesion
- ✅ Smooth, even first layer
- ✅ No gaps between lines
- ✅ Slight "squish" visible
- ✅ Parts stay on bed
- ✅ Clean, professional finish

**The goal:** First layer should be smooth, slightly shiny, and lines should barely touch each other with no gaps.

---

## 📅 When to Calibrate Z-Offset

### ALWAYS Calibrate When:
- ✅ Setting up new printer
- ✅ Changing nozzles (especially different sizes)
- ✅ Replacing hotend
- ✅ Installing new build surface
- ✅ After bed re-leveling
- ✅ Switching between glass/PEI/textured sheets
- ✅ If first layer suddenly fails after working before

### MAY Need Adjustment:
- ⚠️ Seasonal temperature changes (expansion/contraction)
- ⚠️ After firmware updates (sometimes resets EEPROM)
- ⚠️ After major axis maintenance
- ⚠️ If Z-axis components loosened

### Regular Maintenance:
- 📅 Check every 3-6 months
- 📅 After every 500 print hours
- 📅 Anytime prints start failing to stick

---

## 🧰 Required Tools

### Essential:
- ✅ Sheet of standard printer paper (20lb/75gsm)
- ✅ Computer/phone connected to printer
- ✅ Access to printer terminal (OctoPrint, Pronterface, or LCD)

### Optional but Helpful:
- 📏 Feeler gauge (0.1mm or 0.004")
- 📄 Calibration test print (first layer STL)
- 🔦 Flashlight (to see gaps clearly)
- 🧼 Isopropyl alcohol (clean bed first)

### For Your Ender 5 Plus:
- Your current Z-offset: **-1.67mm** (from EEPROM)
- UBL mesh loaded (slot 0)
- Clean steel bed

---

## 🎨 Calibration Methods

### Method 1: Paper Method ⭐ RECOMMENDED FOR BEGINNERS
**Difficulty:** Easy  
**Accuracy:** Good (±0.05mm)  
**Time:** 5 minutes  
**Best for:** Initial setup, quick adjustments

### Method 2: Live Baby-Stepping During Print ⭐ MOST ACCURATE
**Difficulty:** Easy  
**Accuracy:** Excellent (±0.01mm)  
**Time:** 10 minutes  
**Best for:** Fine-tuning, multiple build surfaces

### Method 3: First Layer Test Print
**Difficulty:** Medium  
**Accuracy:** Very Good (±0.02mm)  
**Time:** 15-20 minutes  
**Best for:** Verification, documentation

### Method 4: Feeler Gauge (Advanced)
**Difficulty:** Hard  
**Accuracy:** Excellent (±0.01mm)  
**Time:** 5 minutes  
**Best for:** Professional setups, consistency

---

## 📝 Step-by-Step Calibration

### 🔷 Method 1: Paper Method (Quick Start)

#### Step 1: Prepare Printer
```gcode
G28              ; Home all axes
M420 S1          ; Enable bed leveling if you have UBL/ABL
G1 Z0 F600       ; Move to Z=0
```

**What this does:**
- Homes printer to find zero positions
- Enables your mesh (if you have UBL)
- Moves nozzle to what printer thinks is Z=0

#### Step 2: Heat Everything
```gcode
M104 S200        ; Heat nozzle to 200°C
M140 S60         ; Heat bed to 60°C
M109 S200        ; Wait for nozzle
M190 S60         ; Wait for bed
```

**Why heat?** Thermal expansion changes dimensions. Always calibrate at print temperature!

#### Step 3: Test with Paper
1. **Slide paper** under nozzle
2. **Should feel:** Slight friction, paper can move but drags
3. **Too loose?** Nozzle is too high
4. **Can't move?** Nozzle is too low

#### Step 4: Adjust Z-Offset

**If nozzle is TOO HIGH (paper moves freely):**
```gcode
M851 Z-1.70      ; Try a more negative value
M500             ; Save to EEPROM
```

**If nozzle is TOO LOW (paper won't move):**
```gcode
M851 Z-1.60      ; Try a less negative value
M500             ; Save to EEPROM
```

**Adjust in 0.05mm increments** until perfect

#### Step 5: Test Again
```gcode
G28              ; Re-home
M420 S1          ; Re-enable mesh
G1 Z0 F600       ; Move to Z=0
```
Test with paper again. Repeat until perfect.

#### Step 6: Verify Your Setting
```gcode
M503             ; Show current settings
```
Look for line: `M851 X-44.00 Y-42.00 Z-1.XX`  
Write down your Z value!

---

### 🔷 Method 2: Live Baby-Stepping (Most Accurate) ⭐

This is the BEST method for perfect first layers!

#### Step 1: Start a Test Print
- Use a simple first layer test (100mm x 100mm square)
- Or start any print

#### Step 2: Watch First Layer Start
- As first line prints, observe it carefully
- Don't wait - adjust immediately!

#### Step 3: Adjust On-The-Fly

**Using LCD Menu:**
1. During print, press knob
2. Navigate to: **Tune → Z-Offset**
3. Adjust while watching the extrusion

**Using Terminal:**
```gcode
M290 Z-0.05      ; Move down 0.05mm (if too high)
M290 Z0.05       ; Move up 0.05mm (if too low)
```

#### Step 4: What to Look For

**Too High:**
- Lines are round on top
- You can see gaps between lines
- Filament looks like thin spaghetti
- **Action:** M290 Z-0.02 (go more negative)

**Too Low:**
- Filament is nearly transparent
- Nozzle scraping
- Lines are extremely wide
- Extruder skipping/clicking
- **Action:** M290 Z0.02 (go less negative)

**Perfect:**
- Slight "squish" visible
- Lines just touch each other
- Smooth, even appearance
- No gaps visible
- Slightly shiny surface

#### Step 5: Calculate Total Offset

If you made adjustments:
```
New Z-Offset = Current Z-Offset + Baby-step adjustments
```

**Example:**
- Current offset: -1.67mm
- You adjusted: -0.08mm (4 clicks of -0.02)
- New offset: -1.67 + (-0.08) = **-1.75mm**

#### Step 6: Save New Value
```gcode
M851 Z-1.75      ; Your calculated value
M500             ; Save to EEPROM
```

#### Step 7: Verify
```gcode
M503             ; Check it saved correctly
```

---

### 🔷 Method 3: First Layer Test Print

#### Step 1: Download Test File
Popular first layer test STLs:
- "First Layer Calibration" (search Thingiverse)
- "Bed Level Test" 
- Or use: 100mm x 100mm square, 0.2mm layer height, 1 layer only

#### Step 2: Slice with These Settings
- **First layer height:** 0.2mm
- **First layer speed:** 20mm/s
- **Infill:** 100% (solid first layer)
- **Perimeters:** 2
- **No skirt or brim** (wastes time)

#### Step 3: Print and Observe

**Watch the print carefully:**
- Does it stick immediately?
- Are there gaps between lines?
- Is it smooth or bumpy?
- Can you see through it?

#### Step 4: Measure (Optional)
Use calipers to measure first layer thickness
- **Target:** 0.18-0.22mm for a 0.2mm first layer
- **Too thin (<0.18mm):** Z-offset too negative
- **Too thick (>0.22mm):** Z-offset not negative enough

#### Step 5: Adjust and Retry
Based on observations, adjust Z-offset by 0.05mm and print again

---

### 🔷 Method 4: Feeler Gauge (Professional)

#### Equipment Needed:
- 0.1mm (0.004") feeler gauge
- Clean hands (oil affects reading)

#### Process:
1. Home printer and heat to print temp
2. Move to Z=0
3. Try to slide 0.1mm gauge under nozzle
4. Should have slight resistance
5. Adjust until gauge just barely fits with light drag

**Advantages:**
- Consistent thickness (unlike paper)
- Repeatable measurements
- Professional accuracy

**Your Target:**
- 0.1mm gauge should slide with light resistance
- This gives perfect squish for 0.2mm first layer

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Z-Offset Keeps Resetting
**Causes:**
- M500 not sent after M851
- EEPROM disabled in firmware
- Firmware update wiped EEPROM

**Solution:**
```gcode
M851 Z-1.67      ; Set your value
M500             ; MUST save to EEPROM
M501             ; Reload from EEPROM
M503             ; Verify it stuck
```

If still resetting, add Z-offset to start gcode:
```gcode
M851 Z-1.67      ; Force Z-offset
```

---

### Issue 2: Z-Offset Different in Different Spots
**Cause:** Bed not level

**Solution:**
1. Run bed leveling (UBL mesh)
2. Re-calibrate Z-offset at center
3. Verify corners still good
4. If corners bad, re-level bed mechanically

**For UBL Users:**
```gcode
G29 P1           ; Auto bed leveling
G29 P3           ; Smart fill
G29 S0           ; Save to slot 0
G29 A            ; Activate UBL
M500             ; Save
```

---

### Issue 3: First Layer Good but Second Layer Fails
**Cause:** Not a Z-offset issue!

**Check:**
- Flow rate (extrusion multiplier)
- Temperature too low
- First layer too squished (transparent)
- Part cooling fan kicking in too soon

---

### Issue 4: One Corner Perfect, Others Wrong
**Cause:** Bed not level (mechanical issue)

**Solution:**
1. Turn off printer
2. Manually level bed with knobs/screws
3. Use paper method at all 4 corners + center
4. All should feel same resistance
5. Re-run UBL mesh
6. Re-set Z-offset

---

### Issue 5: Z-Offset Changes Between Prints
**Possible Causes:**
- Loose bed springs (tighten them)
- Loose Z-axis coupler
- Temperature variations (check ambient temp)
- Nozzle wasn't fully tightened
- Build surface not secured properly

---

## 📏 Z-Offset by Nozzle Size

Different nozzle sizes need different Z-offsets!

### Why?
- Nozzles sit at slightly different heights
- Larger nozzles need more squish
- Manufacturing tolerances vary

### Your Ender 5 Plus Reference Values:

| Nozzle Size | Expected Z-Offset Range | Starting Point |
|-------------|------------------------|----------------|
| **0.4mm** | -1.65 to -1.75mm | **-1.67mm** ✅ Current |
| **0.6mm** | -1.60 to -1.70mm | -1.65mm (try first) |
| **0.8mm** | -1.58 to -1.72mm | -1.65mm (try first) |
| **1.0mm** | -1.55 to -1.75mm | -1.65mm (try first) |

### Process When Changing Nozzles:

1. **Physical nozzle change**
2. **Heat to 240°C** and tighten nozzle
3. **Start with old Z-offset** as baseline
4. **Run paper test** or baby-step method
5. **Save new offset** for that nozzle
6. **Document it** (write it down!)

### Pro Tip: Keep a Log

```
Nozzle Size | Z-Offset  | Date Set | Notes
------------|-----------|----------|----------------
0.4mm       | -1.67mm   | 10/14/25 | Steel bed, perfect
0.6mm       | -1.65mm   | 10/15/25 | Slightly less squish
0.8mm       | -1.70mm   | TBD      | Not yet calibrated
1.0mm       | TBD       | TBD      | Not yet calibrated
```

---

## 🎓 Advanced Topics

### Understanding Paper Thickness
- Standard printer paper: ~0.1mm (0.004")
- This gives you a 0.1mm gap
- Perfect for ~0.2mm first layers
- For larger first layers, use thicker paper

### Temperature Effects
Every 10°C change affects offset by ~0.01-0.02mm due to thermal expansion

**Example:**
- Calibrated at 200°C: -1.67mm
- Printing at 240°C: Try -1.69mm
- Printing at 180°C: Try -1.65mm

### First Layer Height vs Z-Offset
They work together:

**Slicer First Layer Height:**
- How thick the layer should be
- Set in slicer (e.g., 0.2mm)

**Z-Offset:**
- Where nozzle actually starts
- Set in firmware/EEPROM

**Together:** They determine squish amount

---

### Build Surface Variations

Different surfaces need different offsets:

| Surface | Typical Adjustment | Notes |
|---------|-------------------|-------|
| **Steel PEI** | Baseline (0) | Your current -1.67mm |
| **Glass** | +0.1 to +0.2mm | Thicker than PEI |
| **Textured PEI** | -0.05mm | Needs more squish |
| **BuildTak** | -0.1mm | Grips better |
| **Blue Tape** | +0.1mm | Compressible |

---

### Mesh Leveling Integration (UBL)

**Important:** Z-offset and mesh work together!

**Sequence:**
1. Level bed mechanically (close as possible)
2. Run UBL mesh (maps bed topology)
3. Set Z-offset (fine-tunes at reference point)
4. Print with both active

**Your Start Gcode Should Have:**
```gcode
G28              ; Home
G29 A            ; Activate UBL
G29 L0           ; Load slot 0
M420 S1 Z10      ; Enable leveling, 10mm fade
```

**Z-offset applies AFTER mesh is loaded**

---

### Probe Offset vs Nozzle Z-Offset

**If you have a probe (BLTouch, CR Touch, etc.):**

You have TWO offsets:
1. **Probe Z-offset (M851):** Distance from nozzle to probe trigger
2. **Global Z-offset:** Additional adjustment for first layer

**Your Ender 5 Plus:**
- Probe offset X: -44mm
- Probe offset Y: -42mm
- Probe offset Z: Your calibrated value (-1.67mm)

---

## 📋 Quick Reference Card

### Print This and Keep at Your Printer!

```
═══════════════════════════════════════════════════
           Z-OFFSET QUICK REFERENCE
═══════════════════════════════════════════════════

CURRENT SETTING: -1.67mm (0.4mm nozzle, steel bed)

PAPER TEST:
  G28           ; Home
  M420 S1       ; Enable mesh
  G1 Z0 F600    ; Move to Z=0
  [Test with paper - slight drag is perfect]

ADJUST OFFSET:
  Too high  (paper loose)  → M851 Z-1.72 (more negative)
  Too low   (paper stuck)  → M851 Z-1.62 (less negative)
  Perfect   (slight drag)  → You're good!

SAVE CHANGES:
  M500          ; Save to EEPROM
  M503          ; Verify saved

BABY-STEPPING (during print):
  M290 Z-0.02   ; Down 0.02mm (if too high)
  M290 Z0.02    ; Up 0.02mm (if too low)

VISUAL GUIDE:
  ❌ TOO HIGH:  Round lines, gaps visible
  ✅ PERFECT:   Smooth, slight squish, no gaps
  ❌ TOO LOW:   Transparent, scraping, clicking

SIGNS OF GOOD FIRST LAYER:
  ✓ Sticks immediately
  ✓ Smooth surface
  ✓ No gaps between lines
  ✓ Slightly shiny
  ✓ Consistent width

═══════════════════════════════════════════════════
           REMEMBER: SAVE WITH M500!
═══════════════════════════════════════════════════
```

---

## 🎯 Decision Tree

```
START: First Layer Problems?
    │
    ├─→ Lines not sticking?
    │   └─→ Z-offset not negative enough → Try -0.05mm more negative
    │
    ├─→ Nozzle scraping bed?
    │   └─→ Z-offset too negative → Try +0.05mm less negative
    │
    ├─→ Gaps between lines?
    │   └─→ Z-offset not negative enough → Try -0.02mm more negative
    │
    ├─→ Lines transparent/thin?
    │   └─→ Z-offset too negative → Try +0.02mm less negative
    │
    ├─→ Extruder clicking?
    │   └─→ Z-offset too negative → Try +0.05mm less negative
    │
    └─→ One corner bad, others good?
        └─→ Not Z-offset! → Re-level bed mechanically
```

---

## 🔄 Workflow Checklist

### New Printer Setup:
- [ ] Mechanically level bed
- [ ] Run UBL mesh
- [ ] Calibrate Z-offset (paper method)
- [ ] Test print first layer calibration
- [ ] Fine-tune with baby-stepping
- [ ] Save final value with M500
- [ ] Document the value

### Changing Nozzles:
- [ ] Remove old nozzle at temp
- [ ] Install new nozzle at temp
- [ ] Tighten at 240°C
- [ ] Cool down
- [ ] Start with old Z-offset ±0.1mm
- [ ] Calibrate with paper method
- [ ] Test print
- [ ] Save new value
- [ ] Label nozzle with offset

### Regular Maintenance:
- [ ] Check Z-offset every 3-6 months
- [ ] Re-check after firmware updates
- [ ] Verify after any Z-axis work
- [ ] Update EEPROM backup

---

## 📊 Troubleshooting Table

| Symptom | Cause | Solution |
|---------|-------|----------|
| Filament not sticking | Too high | More negative offset (-0.05mm) |
| Nozzle scraping | Too low | Less negative offset (+0.05mm) |
| Gaps between lines | Too high | More negative offset (-0.02mm) |
| Transparent layer | Too low | Less negative offset (+0.02mm) |
| Extruder clicking | Way too low | Much less negative (+0.1mm) |
| Warping corners | Too high | More negative offset (-0.05mm) |
| One corner bad | Bed not level | Mechanical leveling needed |
| Offset resets | Not saved | Send M500 after M851 |
| Different each print | Loose hardware | Check bed springs, couplers |

---

## 💾 Backup Your Settings

### Current Configuration (Save This):
```
Printer: Ender 5 Plus
Board: BTT SKR Mini E3
Probe: BLTouch/CR Touch
Nozzle: 0.4mm
Build Surface: Steel PEI
Z-Offset: -1.67mm
Probe Offset X: -44.0mm
Probe Offset Y: -42.0mm
UBL Mesh: Slot 0 active
Date Calibrated: October 14, 2025
```

### Save EEPROM:
```gcode
M503          ; Show all settings
```
Copy the output to a text file!

---

## 🎓 Pro Tips

### Tip 1: Always Heat First
Never calibrate cold. Thermal expansion changes everything. Always heat to printing temperature.

### Tip 2: Clean Bed is Critical
Oil from fingers affects adhesion more than Z-offset. Clean with IPA before calibration.

### Tip 3: Paper Consistency Matters
Use the same type of paper each time. Standard 20lb printer paper works great.

### Tip 4: Baby-Step is Your Friend
The live adjustment during printing is the most accurate method. Don't be afraid to use it!

### Tip 5: Document Everything
Keep a notebook with Z-offset values for each nozzle size and build surface combination.

### Tip 6: Seasonal Adjustments
Temperature and humidity affect offset. In summer you might need -0.02mm adjustment vs winter.

### Tip 7: Trust Your Eyes
If it looks good, it IS good. Don't over-analyze. Perfect first layer = correct offset.

---

## ✅ Success Checklist

Your Z-offset is perfect when:
- ✅ First line sticks immediately
- ✅ No gaps visible between lines
- ✅ Lines are smooth, not round
- ✅ Slight "squish" pattern visible
- ✅ Surface is slightly shiny
- ✅ Can't slide paper under first layer
- ✅ Nozzle doesn't scrape or click
- ✅ Corners stay down (no warping)
- ✅ Parts remove cleanly when cool
- ✅ Consistent across entire bed

---

## 🎯 Final Recommendations

### For Ender 5 Plus with UBL:
1. **Use baby-stepping method** - most accurate for your setup
2. **Keep UBL mesh active** - M420 S1 Z10 in start gcode
3. **Save offset per nozzle** - they're all different
4. **Current baseline:** -1.67mm for 0.4mm nozzle on steel
5. **Adjust ±0.05mm** when changing nozzles

### When in Doubt:
- Start with paper method
- Fine-tune with baby-stepping
- Verify with test print
- Save with M500

**Perfect first layers lead to perfect prints!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Ender 5 Plus | BTT SKR Mini E3 | UBL Mesh Leveling  
**Current Offset:** -1.67mm (0.4mm nozzle, steel PEI bed)
