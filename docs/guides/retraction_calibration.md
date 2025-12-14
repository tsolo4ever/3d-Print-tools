# Retraction Calibration Guide
## Eliminate Stringing and Blobs for Clean Prints

---

## 📋 Table of Contents

1. [What is Retraction?](#what-is-retraction)
2. [Why Retraction Matters](#why-matters)
3. [When to Calibrate](#when-to-calibrate)
4. [Bowden vs Direct Drive](#bowden-vs-direct)
5. [Required Tools](#required-tools)
6. [Retraction Distance](#retraction-distance)
7. [Retraction Speed](#retraction-speed)
8. [Advanced Settings](#advanced-settings)
9. [Material-Specific Settings](#material-settings)
10. [Troubleshooting](#troubleshooting)
11. [Quick Reference](#quick-reference)

---

## 🎯 What is Retraction?

**Retraction** is when the extruder motor reverses, pulling filament back up into the hotend to prevent oozing during travel moves.

### The Process:

**Without Retraction:**
```
Nozzle moving → Filament keeps oozing → Strings everywhere
```

**With Retraction:**
```
1. Stop printing
2. Pull filament back (retract)
3. Move to new location
4. Push filament forward (un-retract)
5. Continue printing
```

### Key Parameters:

**Retraction Distance:**
- How far to pull filament back (mm)
- Bowden: 4-7mm typical
- Direct Drive: 0.5-2mm typical

**Retraction Speed:**
- How fast to pull filament (mm/s)
- Bowden: 40-60mm/s typical
- Direct Drive: 30-50mm/s typical

---

## ⚡ Why Retraction Matters

### Poor Retraction (Too Little):
- ❌ Stringing between features
- ❌ Blobs and zits on surface
- ❌ Oozing on travel moves
- ❌ Messy overhangs
- ❌ Hairy prints
- ❌ Poor surface quality

### Over-Retraction (Too Much):
- ❌ Gaps after travel moves
- ❌ Under-extrusion
- ❌ Clogging
- ❌ Grinding filament
- ❌ Heat creep issues
- ❌ Weak layer adhesion

### Just Right:
- ✅ Clean travel moves
- ✅ No stringing
- ✅ Smooth surface
- ✅ Consistent extrusion
- ✅ Good detail
- ✅ Professional finish

---

## 📅 When to Calibrate Retraction

### ALWAYS Calibrate When:
- ✅ New printer setup
- ✅ Switching between Bowden and Direct Drive
- ✅ Changing hotend type
- ✅ New filament type (PLA → PETG)
- ✅ Changing nozzle size
- ✅ After changing print speed significantly

### MAY Need Adjustment:
- ⚠️ Different filament brands
- ⚠️ Different colors (same type)
- ⚠️ Temperature changes
- ⚠️ Seasonal humidity changes (PETG/Nylon)

### Signs You Need to Re-Calibrate:
- Sudden increase in stringing
- Blobs appearing on prints
- Gaps after travel moves
- Clicking/grinding during retraction

---

## 🔧 Bowden vs Direct Drive

### Your Ender 5 Plus (Microswiss NG = Direct Drive):

**Key Differences:**

| Feature | Bowden (Ender 3 Max) | Direct Drive (Ender 5 Plus) |
|---------|---------------------|----------------------------|
| **Filament Path** | Long tube (~40-50cm) | Very short (~5cm) |
| **Retraction Distance** | 4-7mm | 0.5-2mm |
| **Retraction Speed** | 40-60mm/s | 30-50mm/s |
| **Pressure Build-up** | High | Low |
| **Flexible Filament** | Difficult | Easy |
| **Weight on X-axis** | Light | Heavier |
| **Response Time** | Slower | Faster |

### Why Direct Drive Needs Less Retraction:

**Bowden:**
- Long tube = filament compression
- More distance to reverse pressure
- Needs 4-7mm to relieve pressure

**Direct Drive:**
- Short path = minimal compression
- Quick pressure relief
- Only 0.5-2mm needed
- Over-retracting causes clogs!

---

## 🧰 Required Tools

### Essential:
- ✅ Retraction test model (tower or multiple pillars)
- ✅ Calipers (optional, for verification)
- ✅ Good lighting
- ✅ Patience!

### Test Files:
1. **Retraction Tower** (primary - tests distance)
2. **Dual Pillars Test** (simple stringing check)
3. **Comb Test** (multiple towers)
4. **Speed Tower** (tests retraction speed)

**Download from:** Teaching Tech, Thingiverse, or Printables

---

## 📏 Step 1: Calibrating Retraction Distance

### For Your Ender 5 Plus (Direct Drive):

**Starting Point:** 1.0mm

### Method: Retraction Tower Test

#### Step 1: Download Test Model
**Search:** "Retraction Calibration Tower"

**Look for:**
- Multiple sections (5-10 levels)
- 0.5mm or 1mm increments
- Two pillars/towers that require travel moves

#### Step 2: Determine Test Range

**For Direct Drive (Microswiss NG):**
```
Start: 0.5mm (minimum)
End: 3.0mm (maximum safe)
Increment: 0.5mm

Test range: 0.5, 1.0, 1.5, 2.0, 2.5, 3.0mm
```

**For Bowden (Ender 3 Max):**
```
Start: 3.0mm (minimum)
End: 8.0mm (maximum)
Increment: 1.0mm

Test range: 3, 4, 5, 6, 7, 8mm
```

#### Step 3: Slice the Tower

**Settings:**
```
Layer Height: 0.2mm
Infill: 10-20%
Perimeters: 2
Print Speed: Normal (40-60mm/s)
Temperature: Optimal for filament (from temp tower)
Retraction Speed: 45mm/s (will tune separately)
Initial Retraction: 0.5mm (Direct) or 3mm (Bowden)
```

#### Step 4: Add G-Code for Distance Changes

**Find layer heights for changes:**

If tower is 60mm tall with 6 sections:
```
Section 1 (0.5mm): 0-10mm
Section 2 (1.0mm): 10-20mm
Section 3 (1.5mm): 20-30mm
Section 4 (2.0mm): 30-40mm
Section 5 (2.5mm): 40-50mm
Section 6 (3.0mm): 50-60mm
```

**SuperSlicer/PrusaSlicer:**

Add to **Before Layer Change G-code:**
```gcode
{if layer_z == 10}M207 S1.0{endif}  ; 1.0mm retraction
{if layer_z == 20}M207 S1.5{endif}  ; 1.5mm retraction
{if layer_z == 30}M207 S2.0{endif}  ; 2.0mm retraction
{if layer_z == 40}M207 S2.5{endif}  ; 2.5mm retraction
{if layer_z == 50}M207 S3.0{endif}  ; 3.0mm retraction
```

**Note:** M207 sets firmware retraction. If not using firmware retraction, you'll need to use slicer post-processing scripts.

#### Step 5: Print and Evaluate

**What to look for:**

**Too Little Retraction:**
- Strings between towers/pillars
- Blobs on surface
- Oozing visible

**Too Much Retraction:**
- Gaps after travel
- Under-extrusion
- Grinding noise
- Clogs (extreme)

**Just Right:**
- Minimal or no strings
- Clean travel paths
- Consistent extrusion

#### Step 6: Choose Optimal Distance

**Evaluation:**
```
0.5mm: Lots of strings
1.0mm: Some strings
1.5mm: Very few strings ⭐ WINNER
2.0mm: No strings, but slight gaps appearing
2.5mm: Definite under-extrusion after travels
3.0mm: Too much - gaps everywhere
```

**Pick:** 1.5mm

**Rule:** Choose the MINIMUM distance that eliminates most stringing

---

## ⚡ Step 2: Calibrating Retraction Speed

### For Your Ender 5 Plus (Direct Drive):

**Starting Point:** 40-45mm/s

### Method: Speed Tower or Manual Adjustment

#### Option A: Speed Tower Test

**Test Range:**
```
Start: 30mm/s
End: 70mm/s
Increment: 10mm/s

Sections: 30, 40, 50, 60, 70mm/s
```

**G-Code Changes:**
```gcode
{if layer_z == 10}M207 F2400{endif}  ; 40mm/s (2400mm/min)
{if layer_z == 20}M207 F3000{endif}  ; 50mm/s
{if layer_z == 30}M207 F3600{endif}  ; 60mm/s
{if layer_z == 40}M207 F4200{endif}  ; 70mm/s
```

**Note:** Speed in firmware is in mm/min, so multiply by 60!

#### Option B: Manual Iteration

**Starting Settings:**
```
Distance: 1.5mm (from previous test)
Speed: 45mm/s
```

**Print dual pillars test:**
1. Check for stringing
2. Listen for grinding/clicking
3. Check for consistent extrusion

**Adjust:**

**If grinding/clicking:**
- Reduce speed by 5mm/s
- Try 40mm/s

**If clean but want faster:**
- Increase by 5mm/s
- Try 50mm/s

**If strings increase:**
- Speed might be too fast
- Reduce by 5mm/s

#### Typical Results:

```
Too Slow (20mm/s):
- Works but wastes time
- May cause oozing (nozzle dwells longer)

Good Range (40-50mm/s):
- Fast enough
- No grinding
- Clean retractions ⭐

Too Fast (70mm/s+):
- Extruder grinding
- Skipped steps
- Inconsistent retraction
```

**Winner:** 45mm/s

---

## 🔬 Advanced Settings

### Setting 1: Minimum Travel Distance

**What it does:** Only retract if travel is longer than X mm

**Recommended:**
```
Direct Drive: 1.5-2mm
Bowden: 2-3mm
```

**Why:** Tiny moves don't need retraction, saves time

### Setting 2: Z-Hop on Retraction

**What it does:** Lifts nozzle slightly during travel

**Settings:**
```
Z-Hop Height: 0.2-0.4mm
Enable for: All travel moves OR only when over printed parts
```

**Benefits:**
- Prevents nozzle dragging
- Helps with tall/thin features
- Reduces scarring

**Drawbacks:**
- Slower prints
- More Z-axis wear
- Can cause blobs if too high

**Recommendation for Ender 5 Plus:**
```
Z-Hop: 0.2mm
Enable: Only when crossing perimeters
```

### Setting 3: Retract on Layer Change

**What it does:** Always retract when moving to next layer

**Recommended:** ENABLE

**Why:** Prevents blob/zit at layer change seam

### Setting 4: Wipe While Retracting

**What it does:** Wipe nozzle on last printed part while retracting

**Settings:**
```
Wipe Distance: 1-2mm
Enable: Yes (for most materials)
```

**Benefits:**
- Cleans nozzle
- Reduces blobs
- Better surface quality

### Setting 5: Extra Length on Restart (Prime Amount)

**What it does:** Extrude a bit extra after un-retract to compensate for ooze

**Settings:**
```
Direct Drive: 0mm (usually not needed)
Bowden: 0-0.2mm
PETG: +0.1mm (oozier material)
```

### Setting 6: Retract Before Wipe

**What it does:** Order of operations

**Options:**
- Retract first, then wipe
- Wipe while retracting (recommended)

---

## 🧪 Material-Specific Retraction Settings

### Your Printer Settings:

#### Ender 5 Plus (Microswiss NG - Direct Drive)

**PLA:**
```
Retraction Distance: 1.0-1.5mm
Retraction Speed: 40-50mm/s
Z-Hop: 0.2mm (optional)
Minimum Travel: 2mm
Wipe Distance: 1mm
Extra Prime: 0mm
```

**PETG:**
```
Retraction Distance: 1.0-1.5mm (same as PLA)
Retraction Speed: 35-45mm/s (slightly slower)
Temperature: -5°C from optimal (reduces ooze)
Z-Hop: 0.3mm (PETG sticky - helps prevent scarring)
Minimum Travel: 2mm
Wipe Distance: 2mm
Extra Prime: 0.1mm
```

**TPU/Flexible:**
```
Retraction Distance: 0.5-1.0mm (minimal!)
Retraction Speed: 25-35mm/s (slow!)
Z-Hop: 0mm (disabled - can cause jams)
Minimum Travel: 5mm (retract less often)
Print Speed: 20-30mm/s
```

**ABS:**
```
Retraction Distance: 1.0-2.0mm
Retraction Speed: 40-50mm/s
Z-Hop: 0.2mm
Minimum Travel: 2mm
Wipe Distance: 1mm
```

---

#### Ender 3 Max (Sprite Pro - Direct Drive)

**PLA:**
```
Retraction Distance: 0.8-1.5mm
Retraction Speed: 40-50mm/s
Z-Hop: 0.2mm
Minimum Travel: 2mm
```

**PETG:**
```
Retraction Distance: 1.0-1.5mm
Retraction Speed: 35-45mm/s
Z-Hop: 0.3mm
Minimum Travel: 2mm
Extra Prime: 0.1mm
```

---

### Material Comparison Table:

| Material | Distance (Direct) | Speed | Notes |
|----------|------------------|-------|-------|
| **PLA** | 1.0-1.5mm | 40-50mm/s | Easy, forgiving |
| **PLA+** | 1.0-1.5mm | 40-50mm/s | Same as PLA |
| **PETG** | 1.0-1.5mm | 35-45mm/s | Reduce temp, use Z-hop |
| **ABS** | 1.0-2.0mm | 40-50mm/s | Similar to PLA |
| **TPU** | 0.5-1.0mm | 25-35mm/s | MINIMAL retraction! |
| **Nylon** | 1.5-2.5mm | 35-45mm/s | Moisture sensitive |

---

## 🛠️ Troubleshooting

### Problem 1: Excessive Stringing

**Symptoms:**
- Strings everywhere between features
- Hairy print surface
- Cobwebs

**Solutions (in order):**

1. **Increase retraction distance** (+0.5mm)
2. **Lower print temperature** (-5°C)
3. **Increase retraction speed** (+5mm/s)
4. **Enable Z-hop** (0.2-0.3mm)
5. **Dry filament** (PETG especially)
6. **Reduce travel speed** (less time for ooze)

---

### Problem 2: Blobs and Zits

**Symptoms:**
- Small blobs on surface
- Zits at random locations
- Usually at start/end of travel

**Solutions:**

1. **Enable "Retract on layer change"**
2. **Enable "Wipe while retracting"**
3. **Adjust seam position** (aligned or random)
4. **Lower temperature** (-5°C)
5. **Increase retraction distance** (+0.5mm)
6. **Enable coasting** (advanced - reduces pressure)

---

### Problem 3: Gaps After Travel Moves

**Symptoms:**
- Small gaps/under-extrusion after travels
- Weak spots where nozzle resumed printing
- First few mm after travel look thin

**Solutions:**

1. **Reduce retraction distance** (-0.5mm)
2. **Add extra restart prime** (+0.1-0.2mm)
3. **Slow down retraction speed** (-5mm/s)
4. **Check for partial clog**
5. **Verify E-steps calibrated**

---

### Problem 4: Grinding/Clicking During Retraction

**Symptoms:**
- Extruder motor clicking
- Grinding sound
- Stripped filament

**Solutions:**

1. **Reduce retraction speed** (-10mm/s)
2. **Reduce retraction distance** (-0.5mm)
3. **Check extruder tension** (may be too tight)
4. **Increase temperature** (+5°C - easier to pull)
5. **Check for clogs** (too much retraction can jam)

---

### Problem 5: Clogs After Retraction

**Symptoms:**
- Frequent clogs
- Under-extrusion after retracts
- Nozzle jams

**Causes - Direct Drive Specific:**

**Over-retracting pulls molten plastic into cold zone:**
```
Retraction too long → Filament pulls above melt zone →
Solidifies in cold zone → Jam!
```

**Solutions:**

1. **Reduce retraction distance** (Try 0.5-1mm max)
2. **Disable retraction for TPU** (major cause of jams)
3. **Increase hotend temp** (+5°C)
4. **Check hotend fan** (needs cooling to prevent heat creep)
5. **Upgrade to all-metal hotend** (if using PTFE-lined)

---

### Problem 6: Stringing Only on PETG

**Symptom:**
- PETG strings like crazy
- PLA is clean with same settings

**This is NORMAL - PETG is stringy!**

**Solutions:**

1. **Lower temp** (-5-10°C from optimal)
2. **Increase retraction** (+0.5mm over PLA setting)
3. **Slow down retraction** (-5mm/s)
4. **Enable Z-hop** (0.3-0.4mm)
5. **Dry filament** (moisture makes it worse!)
6. **Increase minimum travel distance** (retract less often)
7. **Accept some stringing** (easy to clean with heat gun)

---

## 📊 Quick Decision Tree

```
Stringing Issues?
│
├─→ YES
│   │
│   Temperature optimized?
│   ├─→ NO → Run temp tower first!
│   └─→ YES
│       │
│       Retraction enabled?
│       ├─→ NO → Enable it!
│       └─→ YES
│           │
│           What's your setup?
│           │
│           ├─→ Direct Drive
│           │   │
│           │   Current distance: 1.5mm?
│           │   ├─→ Too low → Increase to 2mm
│           │   ├─→ Too high (3mm+) → Reduce to 1.5mm
│           │   └─→ Still stringing → Lower temp 5°C
│           │
│           └─→ Bowden
│               │
│               Current distance: 5mm?
│               ├─→ Too low → Increase to 6mm
│               ├─→ Good range → Optimize speed
│               └─→ Too high (8mm+) → Check for clogs
│
└─→ NO (No Strings)
    │
    Gaps after travel?
    │
    ├─→ YES → Reduce retraction 0.5mm OR add prime
    └─→ NO → Settings are perfect! ✅
```

---

## 💡 Pro Tips

### Tip 1: Temperature Matters Most
Before diving deep into retraction:
1. Optimize temperature FIRST
2. Too hot = stringing no matter what
3. 5°C drop can eliminate 80% of stringing
4. Then fine-tune retraction for the rest

### Tip 2: Less is More for Direct Drive
**Direct Drive Golden Rule:**
- Start LOW (0.5-1mm)
- Increase slowly (+0.5mm at a time)
- NEVER go above 3mm
- Over-retraction = clogs!

### Tip 3: Bowden Needs Distance
**Bowden systems:**
- Start at 4-5mm minimum
- Work up to 6-7mm if needed
- PTFE tube quality matters
- Worn/kinked tube = worse retraction

### Tip 4: Speed Isn't Everything
**Common mistake:** Cranking speed to max
- Faster isn't always better
- Can cause grinding
- Can strip filament
- Sweet spot: 40-50mm/s for most setups

### Tip 5: Some Stringing is Normal
**Acceptable stringing:**
- Few thin, easily removable strings = OK
- Perfect zero strings = might be over-retracting
- Don't chase perfection and cause other issues

**Use a heat gun or lighter to quickly clean strings!**

### Tip 6: Linear Advance Interaction
**If using Linear Advance (M900):**
- Can REDUCE need for retraction
- Try K-factor of 0.05-0.15
- May allow lower retraction distance
- Test LA AFTER basic retraction tuning

**Your Ender 5 Plus EEPROM shows:** K: 0.1 ✅

### Tip 7: Combing Mode
**Enable "Combing" in slicer:**
- Avoids crossing perimeters when possible
- Reduces visible travel scars
- Can reduce retraction frequency
- Set to "Not in Skin" or "Within Infill"

### Tip 8: Material-Specific Profiles
Save separate profiles:
```
Ender5Plus_PLA_Retract_1-5mm_45mms
Ender5Plus_PETG_Retract_1-5mm_40mms_ZHop
Ender5Plus_TPU_Retract_0-8mm_30mms_NoZHop
```

### Tip 9: Seasonal Adjustments
**Humidity affects retraction:**
- Summer (humid): May need -0.5mm, -5°C
- Winter (dry): Standard settings work
- **PETG/Nylon especially sensitive!**

### Tip 10: Clean Nozzle Regularly
Buildup on nozzle exterior causes:
- False stringing (drags old plastic)
- Blobs
- Poor retraction performance

**Clean with brass brush while hot!**

---

## ✅ Success Checklist

Your retraction is perfectly tuned when:
- ✅ Minimal stringing (few thin strings acceptable)
- ✅ No blobs or zits on surface
- ✅ Clean travel moves
- ✅ No gaps after travels
- ✅ No grinding or clicking sounds
- ✅ Consistent extrusion throughout print
- ✅ Sharp corners and details
- ✅ Professional surface finish
- ✅ No clogs or jams
- ✅ Settings work consistently across prints

---

## 🎯 Final Recommendations

### For Your Ender 5 Plus (Microswiss NG Direct Drive):

**PLA - Recommended Settings:**
```
Retraction Distance: 1.5mm
Retraction Speed: 45mm/s
Z-Hop: 0.2mm (when crossing perimeters)
Minimum Travel: 2mm
Wipe While Retracting: Enabled
Wipe Distance: 1mm
Extra Prime Amount: 0mm
Retract on Layer Change: Enabled
Print Temperature: 210°C (adjust per filament)
```

**PETG - Recommended Settings:**
```
Retraction Distance: 1.5mm
Retraction Speed: 40mm/s
Z-Hop: 0.3mm (PETG is sticky!)
Minimum Travel: 2mm
Wipe While Retracting: Enabled
Wipe Distance: 2mm
Extra Prime Amount: 0.1mm
Retract on Layer Change: Enabled
Print Temperature: 235°C (-5°C from optimal to reduce ooze)
```

**TPU - Recommended Settings:**
```
Retraction Distance: 0.8mm (MINIMAL!)
Retraction Speed: 30mm/s (SLOW!)
Z-Hop: 0mm (DISABLED - prevents jams)
Minimum Travel: 5mm (retract rarely)
Wipe While Retracting: Enabled
Print Speed: 25mm/s (overall slow for TPU)
Temperature: 225°C
```

---

### For Your Ender 3 Max (Sprite Pro Extruder Direct Drive):

**PLA - Recommended Settings:**
```
Retraction Distance: 1.2mm
Retraction Speed: 45mm/s
Z-Hop: 0.2mm
Minimum Travel: 2mm
Wipe Distance: 1mm
Temperature: 205°C
```

**PETG - Recommended Settings:**
```
Retraction Distance: 1.5mm
Retraction Speed: 40mm/s
Z-Hop: 0.3mm
Minimum Travel: 2mm
Extra Prime: 0.1mm
Temperature: 235°C
```

---

### Recommended Calibration Workflow:

**Step-by-Step Process:**

1. **Prepare:**
   - ✅ E-steps calibrated
   - ✅ Temperature optimized (run temp tower first!)
   - ✅ Flow rate calibrated
   - ✅ Clean nozzle

2. **Start with defaults:**
   - Direct Drive: 1.0mm @ 45mm/s
   - Bowden: 5.0mm @ 45mm/s

3. **Print dual pillars test:**
   - Evaluate stringing
   - Check for gaps
   - Listen for grinding

4. **Adjust distance:**
   - Strings? Increase +0.5mm
   - Gaps? Decrease -0.5mm
   - Repeat until optimal

5. **Fine-tune speed:**
   - Grinding? Reduce -5mm/s
   - Want faster? Increase +5mm/s

6. **Add refinements:**
   - Enable Z-hop if needed
   - Set minimum travel
   - Enable wipe

7. **Verify with real print:**
   - Print actual model
   - Check quality
   - Adjust if needed

8. **Save profile:**
   - Document settings
   - Name profile clearly
   - Test on next spool

---

## 📚 Appendix: Retraction G-Code Commands

### Firmware Retraction (M207/M208):
```gcode
M207 S1.5 F2700 Z0.2   ; Set retraction: 1.5mm, 45mm/s, 0.2mm Z-hop
M208 S0.0 F2700        ; Set un-retract: 0mm extra, 45mm/s
M500                   ; Save to EEPROM
```

**Parameters:**
- `S` = Distance (mm)
- `F` = Speed (mm/min, so multiply mm/s × 60)
- `Z` = Z-hop height (mm)

### Manual Retraction in G-Code:
```gcode
G1 E-1.5 F2700         ; Retract 1.5mm at 45mm/s
G1 X100 Y100 F3000     ; Travel move
G1 E1.5 F2700          ; Un-retract (prime)
```

### Check Current Settings:
```gcode
M503                   ; Display all settings
```
Look for M207/M208 lines

---

## 📖 Common Retraction Myths Debunked

### Myth 1: "More retraction is always better"
**FALSE!** Over-retraction causes:
- Clogs (especially direct drive)
- Gaps after travel
- Filament grinding
- Heat creep

### Myth 2: "Faster retraction is always better"
**FALSE!** Too fast causes:
- Extruder motor skipping
- Grinding filament
- Inconsistent retraction
- Stripped filament

### Myth 3: "Same settings work for all materials"
**FALSE!** Each material needs tuning:
- PETG needs different settings than PLA
- TPU needs minimal retraction
- Temperature affects retraction needs

### Myth 4: "Z-hop solves all stringing"
**FALSE!** Z-hop helps with:
- Nozzle dragging
- Scarring on top surfaces
- Does NOT fix oozing/stringing!

### Myth 5: "Bowden can't print clean"
**FALSE!** Properly tuned Bowden:
- Can print very clean
- Just needs higher retraction (5-7mm)
- Good PTFE tube essential

---

## 🔬 Advanced: Pressure Advance / Linear Advance

### What is Linear Advance?

**Reduces pressure in nozzle during deceleration:**
- Less oozing at corners
- Sharper corners
- Can reduce retraction needs

### Your Ender 5 Plus Setting:
```
Current K-factor: 0.1 (from EEPROM)
```

### How it Affects Retraction:

**With LA enabled (K=0.1):**
- May allow slightly less retraction distance
- Helps reduce blobs at corners
- Try reducing retraction by 0.2-0.3mm

**Testing LA:**
```gcode
M900 K0.0     ; Disable LA
; Print test
M900 K0.05    ; Low LA
; Print test
M900 K0.1     ; Medium LA
; Print test
M900 K0.15    ; High LA
; Print test
```

**Find sweet spot, then:**
```gcode
M900 K0.1     ; Set value
M500          ; Save to EEPROM
```

---

## 🎓 Understanding the Science

### Why Retraction Works:

**Physics:**
1. Molten plastic in nozzle has pressure
2. Retracting pulls plastic up
3. Creates negative pressure
4. Prevents oozing during travel

**The Challenge:**
- Pull too little → Still oozes
- Pull too much → Creates gap when resuming
- Pull too fast → Strips filament
- Pull too slow → Plastic oozes anyway

### Temperature's Role:

**Hotter Plastic:**
- Lower viscosity
- Flows easier
- Oozes more
- Needs MORE retraction or LOWER temp

**Cooler Plastic:**
- Higher viscosity
- Thicker
- Oozes less
- Needs LESS retraction

**This is why temperature calibration comes FIRST!**

---

## 📝 Retraction Log Template

Keep track of your settings:

```
=================================
RETRACTION SETTINGS LOG
=================================

Printer: Ender 5 Plus
Extruder: Microswiss NG Direct Drive
Date: October 2025

Material: PLA (Hatchbox Red)
Temperature: 210°C
Retraction Distance: 1.5mm
Retraction Speed: 45mm/s
Z-Hop: 0.2mm
Minimum Travel: 2mm
Wipe Distance: 1mm
Extra Prime: 0mm

Results: ✅ Clean prints, minimal stringing
Notes: Perfect for this brand/color

---

Material: PETG (Overture Clear)
Temperature: 235°C
Retraction Distance: 1.5mm
Retraction Speed: 40mm/s
Z-Hop: 0.3mm
Minimum Travel: 2mm
Wipe Distance: 2mm
Extra Prime: 0.1mm

Results: ✅ Good, some minor stringing (acceptable)
Notes: Dried filament first, lower temp helped

---

Material: TPU (NinjaFlex 85A)
Temperature: 225°C
Retraction Distance: 0.8mm
Retraction Speed: 30mm/s
Z-Hop: 0mm (DISABLED)
Print Speed: 25mm/s

Results: ✅ No jams, minimal stringing
Notes: SLOW speeds critical, minimal retraction

=================================
```

---

**Perfect retraction = Clean, professional prints!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Ender 5 Plus (Microswiss NG), Ender 3 Max (Sprite Pro)  
**Both are Direct Drive systems**  
**Tested Materials:** PLA, PETG, ABS, TPU  
**Linear Advance:** Enabled (K=0.1 on Ender 5 Plus)