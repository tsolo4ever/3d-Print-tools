# Temperature Tuning Guide
## Finding the Perfect Temperature for Every Filament

---

## 📋 Table of Contents

1. [Why Temperature Matters](#why-matters)
2. [Temperature Basics](#temperature-basics)
3. [When to Tune Temperature](#when-to-tune)
4. [Required Tools](#required-tools)
5. [Temperature Tower Test](#temperature-tower)
6. [Bridging Test](#bridging-test)
7. [Stringing Test](#stringing-test)
8. [Overhang Test](#overhang-test)
9. [Material-Specific Temps](#material-temps)
10. [Troubleshooting](#troubleshooting)
11. [Quick Reference](#quick-reference)

---

## ⚡ Why Temperature Matters

Temperature affects EVERYTHING about your print quality:

### Too Cold:
- ❌ Poor layer adhesion (weak parts)
- ❌ Under-extrusion
- ❌ Extruder skipping/clicking
- ❌ Rough surface finish
- ❌ Failed bridging
- ❌ Clogging

### Too Hot:
- ❌ Stringing and oozing
- ❌ Blobs and zits
- ❌ Sagging overhangs
- ❌ Poor detail on small features
- ❌ Warping (heat creep)
- ❌ Burnt filament smell

### Just Right:
- ✅ Strong layer adhesion
- ✅ Clean, smooth surface
- ✅ Good bridging
- ✅ Minimal stringing
- ✅ Accurate details
- ✅ Consistent extrusion
- ✅ Good overhangs

---

## 🎯 Temperature Basics

### The Two Temperatures:

**1. Hotend/Nozzle Temperature:**
- Where the magic happens
- Melts the filament
- THIS is what we're tuning

**2. Bed Temperature:**
- Keeps first layer stuck
- Prevents warping
- Usually fixed per material

### Manufacturer Ranges Are Just Suggestions!

**Example: PLA says "190-220°C"**
- This is a RANGE, not a target
- Your printer may be different
- Ambient temperature matters
- Filament brand/color varies
- Print speed affects optimal temp

**Your goal:** Find the sweet spot for YOUR setup!

---

## 📅 When to Tune Temperature

### ALWAYS Tune When:
- ✅ New brand of filament
- ✅ Different color (even same brand)
- ✅ Switching material types
- ✅ After hotend replacement
- ✅ Different nozzle size
- ✅ Changing print speeds significantly

### MAY Need Adjustment:
- ⚠️ Seasonal temperature changes
- ⚠️ Different layer heights
- ⚠️ Switching between detail/speed profiles
- ⚠️ Print quality suddenly degrades

---

## 🧰 Required Tools

### Essential:
- ✅ Temperature tower STL file
- ✅ Slicer with custom G-code support
- ✅ Good lighting for inspection
- ✅ Magnifying glass (optional but helpful)

### Test Files Needed:
1. **Temperature Tower** (primary test)
2. **Bridging Test** (optional verification)
3. **Stringing Test** (retraction tuning)
4. **Overhang Test** (cooling verification)

**Download from:** Thingiverse, Printables, or Teaching Tech website

---

## 🌡️ Method 1: Temperature Tower Test ⭐ PRIMARY METHOD

### Step 1: Download Temperature Tower

**Search for:** "Temperature Calibration Tower"

**Features to look for:**
- Multiple sections (5-10 levels)
- 5°C increments
- Text showing temperatures
- Bridging features
- Overhangs
- Details/small features

### Step 2: Determine Temperature Range

**Check your filament:**
```
Manufacturer range: 200-220°C
Your test range: 195-225°C
(Start 5° below, end 5° above recommended)

Tower sections needed: 7
Temperature steps: 5°C
Starting temp: 225°C (top)
Ending temp: 195°C (bottom)
```

### Step 3: Slice the Tower

**Basic Settings:**
```
Layer Height: 0.2mm
Infill: 20%
Perimeters: 2-3
Print Speed: Your normal speed (40-60mm/s)
Fan: Normal cooling (50-100% for PLA)
```

### Step 4: Add Temperature Change G-Code

**Find layer heights for temp changes:**

If tower is 70mm tall with 7 sections:
```
Section 1 (225°C): 0-10mm
Section 2 (220°C): 10-20mm
Section 3 (215°C): 20-30mm
Section 4 (210°C): 30-40mm
Section 5 (205°C): 40-50mm
Section 6 (200°C): 50-60mm
Section 7 (195°C): 60-70mm
```

**SuperSlicer/PrusaSlicer Method:**

Add to **Before Layer Change G-code:**
```gcode
{if layer_z == 10}M104 S220{endif}
{if layer_z == 20}M104 S215{endif}
{if layer_z == 30}M104 S210{endif}
{if layer_z == 40}M104 S205{endif}
{if layer_z == 50}M104 S200{endif}
{if layer_z == 60}M104 S195{endif}
```

**Cura Method:**

Install "Change at Z" plugin:
1. Extensions → Post Processing → Modify G-Code
2. Add script "Change at Z"
3. Enter layer heights and temperatures

**Manual Method (Advanced):**
1. Slice normally at starting temp
2. Open G-code in text editor
3. Find layers at height transitions
4. Insert `M104 S[temp]` before layer

### Step 5: Print the Tower

**What to watch:**
- First section prints at highest temp
- Temp drops every section
- Listen for changes in extrusion sound
- Watch for stringing between sections

### Step 6: Evaluate Results

**Inspection Checklist:**

For each section, rate 1-10:

**Layer Adhesion:**
- Flex the tower gently
- Which section feels strongest?

**Surface Quality:**
- Which is smoothest?
- Any over-extrusion blobs?
- Clean corners?

**Bridging:**
- Do bridges sag?
- Clean underneath?

**Overhangs:**
- Do they curl up?
- Rough or smooth?

**Details:**
- Text readable?
- Features sharp?

**Stringing:**
- Strings between features?
- Zits on surface?

### Step 7: Choose Optimal Temperature

**Decision Matrix:**

| Priority | Best Temperature |
|----------|------------------|
| **Strength** | Highest temp with good quality |
| **Detail** | Lowest temp with good adhesion |
| **Balance** | Middle temp with best all-around |
| **Speed** | Higher temp (flows easier) |

**Example Results:**
```
225°C: Too hot - stringing, oozing
220°C: Good, slight stringing
215°C: PERFECT - strong, clean, good detail ⭐
210°C: Good, but bridging starting to sag
205°C: Layer adhesion getting weak
200°C: Too cold - rough surface
195°C: Way too cold - clicking extruder
```

**Winner: 215°C**

---

## 🌉 Method 2: Bridging Test

### Purpose:
Verify temperature for bridging performance

### Setup:
```
Temperature: Use result from tower test
Layer Height: 0.2mm
Cooling: 100% (PLA) or 50% (PETG)
Speed: Bridging speed (50% of normal)
```

### Test File:
Download "Bridging Test" from Thingiverse

**Features:**
- Multiple bridge lengths (10mm, 20mm, 30mm, 40mm)
- Different orientations

### Evaluation:

**Perfect Bridges:**
- ✅ Minimal sagging
- ✅ Clean bottom surface
- ✅ Consistent line thickness
- ✅ No drooping

**Bad Bridges:**
- ❌ Severe sagging
- ❌ Stringy bottom
- ❌ Inconsistent lines

**If bridges fail:** Try -5°C and test again

---

## 🕷️ Method 3: Stringing Test

### Purpose:
Find temperature that minimizes stringing

### Setup:
```
Temperature: Tower test result
Retraction: Your current settings
Speed: Normal
Cooling: Full (for PLA)
```

### Test Files:
- "Retraction Test Tower"
- "Stringing Test"
- "Comb Test"

**Look for:**
- Strings between pillars
- Amount of wisps
- Cleanup difficulty

### Evaluation:

**Minimal Stringing:**
- Use this temp ✅

**Excessive Stringing:**
- Try -5°C
- Also check retraction settings

**Note:** Some materials (PETG) always string more!

---

## 🏔️ Method 4: Overhang Test

### Purpose:
Verify cooling and temperature for overhangs

### Test File:
"Overhang Test" or "All-in-One Test"

**Features:**
- 30°, 45°, 60°, 70° overhangs
- Tests cooling effectiveness

### Setup:
```
Temperature: Tower test result
Cooling: Progressive (start 50%, ramp to 100%)
Layer Height: 0.2mm
Speed: Normal
```

### Evaluation:

**Good Overhangs (up to 45°):**
- ✅ Smooth surface
- ✅ No curling
- ✅ Clean layers

**Bad Overhangs:**
- ❌ Curling upward
- ❌ Drooping
- ❌ Rough/messy surface

**If failing:** Temperature might be too high OR cooling insufficient

---

## 🧪 Material-Specific Temperature Ranges

### PLA (Polylactic Acid)

**Manufacturer Range:** 180-220°C  
**Sweet Spot Range:** 200-215°C

**Starting Points:**
```
Fast Prints (60mm/s+):    215°C
Standard (40-60mm/s):     210°C
Detail Prints (<40mm/s):  205°C
Miniatures/Fine Detail:   200°C
```

**Your Ender 5 Plus:**
- Start: 210°C
- Test: 200-220°C in 5°C steps
- Bed: 60°C

---

### PETG (Polyethylene Terephthalate Glycol)

**Manufacturer Range:** 220-250°C  
**Sweet Spot Range:** 230-245°C

**Starting Points:**
```
Fast Prints:     245°C
Standard:        240°C
Detail:          235°C
First Layer:     +5°C (better adhesion)
```

**Your Ender 5 Plus:**
- Start: 240°C
- Test: 230-250°C in 5°C steps
- Bed: 75-80°C

**PETG Notes:**
- Strings more than PLA
- Lower temp helps stringing
- Higher temp for strength
- Use higher first layer temp

---

### ABS (Acrylonitrile Butadiene Styrene)

**Manufacturer Range:** 220-250°C  
**Sweet Spot Range:** 235-245°C

**Starting Points:**
```
Enclosure (recommended): 245°C
No Enclosure:           240°C
Detail Work:            235°C
```

**Your Ender 5 Plus:**
- Start: 240°C
- Test: 230-250°C in 5°C steps
- Bed: 90-100°C

**ABS Notes:**
- Benefits from enclosure
- Higher temps = better layer adhesion
- Warps easily - keep warm

---

### TPU/Flexible (Thermoplastic Polyurethane)

**Manufacturer Range:** 210-240°C  
**Sweet Spot Range:** 220-230°C

**Starting Points:**
```
Soft TPU (85A):     225°C
Medium TPU (95A):   230°C
Print Speed:        20-30mm/s (SLOW!)
```

**Your Ender 5 Plus (Microswiss NG):**
- Start: 225°C
- Test: 220-235°C in 5°C steps
- Bed: 50-60°C

**TPU Notes:**
- Direct drive handles better
- Lower temps reduce stringing
- SLOW speeds crucial

---

### Material Comparison Table

| Material | Nozzle Temp | Bed Temp | Speed | Cooling |
|----------|------------|----------|-------|---------|
| **PLA** | 200-215°C | 60°C | 60mm/s | 100% |
| **PLA+** | 205-220°C | 60°C | 60mm/s | 100% |
| **PETG** | 230-245°C | 75°C | 40mm/s | 30-50% |
| **ABS** | 235-245°C | 95°C | 50mm/s | 0-30% |
| **ASA** | 240-250°C | 95°C | 50mm/s | 0-30% |
| **TPU** | 220-230°C | 50°C | 25mm/s | 0-20% |
| **Nylon** | 240-260°C | 80°C | 40mm/s | 20-40% |
| **PC** | 260-280°C | 110°C | 40mm/s | 0-20% |

---

## 🔧 Advanced: Temperature vs Speed Relationship

### The Rule:
**Faster speed = Need higher temperature**

### Why?
- Less time for heat transfer
- Filament moves through hotend quicker
- Need hotter melt for smooth flow

### Adjustment Guidelines:

**Speed Increase:**
```
+20mm/s speed → +5°C temperature
+40mm/s speed → +10°C temperature
```

**Example:**
```
Normal PLA: 50mm/s at 210°C
Speed PLA:  90mm/s at 220°C
```

### Layer Height Factor:

**Thicker layers need higher temp:**
```
0.12mm layer: 205°C
0.20mm layer: 210°C (baseline)
0.28mm layer: 215°C
```

**More material/second = more heat needed**

---

## 🛠️ Troubleshooting

### Problem 1: Inconsistent Results

**Symptoms:**
- Same temp gives different results
- Quality varies print to print
- Can't determine best temp

**Solutions:**

| Cause | Fix |
|-------|-----|
| **PID not tuned** | Run PID autotune! |
| **Thermistor loose** | Check/tighten connections |
| **Drafts/airflow** | Enclose printer or block wind |
| **Ambient temp varies** | Print in climate-controlled room |
| **Wet filament** | Dry filament before testing |

---

### Problem 2: All Temperatures Look Bad

**Symptom:**
- Every section of tower has issues
- No clear winner

**Check:**

1. **E-steps calibrated?** Do this FIRST
2. **Flow rate correct?** Calibrate flow
3. **Retraction tuned?** May need adjustment
4. **Cooling fan working?** Check fan operation
5. **Filament quality?** Try known-good brand
6. **Partial clog?** Clean/replace nozzle

---

### Problem 3: Best Temp Outside Filament Range

**Symptom:**
- Sweet spot at 190°C (filament says 200-220°C)
- Or needs 230°C (filament says 200-220°C)

**This is NORMAL!**

**Reasons:**
- Your thermistor reads differently
- Ambient temperature affects it
- Printer-to-printer variation
- Filament manufacturer conservative

**Solution:**
- Use what works for YOUR printer
- If way off (±20°C), check thermistor
- Document the working temp

---

### Problem 4: Temperature Dropping During Print

**Symptoms:**
- Starts good, gets worse
- Extruder clicks after a while
- Inconsistent extrusion

**Causes:**

1. **Hotend fan failing**
   - Check fan spins freely
   - Replace if needed

2. **PID needs tuning**
   - Temperature oscillating
   - Run PID autotune

3. **Power supply weak**
   - Check voltage under load
   - Upgrade if needed

4. **Loose thermistor**
   - Check connections
   - Replace if damaged

---

### Problem 5: First Layer vs Rest of Print

**Symptom:**
- First layer needs different temp
- Settings that work for first layer fail on rest

**Solution - Use First Layer Temp Offset:**

**In Slicer:**
```
First Layer Temp: 215°C
Other Layers Temp: 210°C

Offset: +5°C for first layer
```

**This is especially common with:**
- PETG (first layer hotter)
- ABS (first layer hotter)
- Glass beds (need more heat)

---

## 📊 Quick Decision Tree

```
Start Temperature Tower Test
│
Print at range: [Mfg Min - 5°C] to [Mfg Max + 5°C]
│
Evaluate Results:
│
├─→ All sections bad?
│   └─→ Check E-steps, flow, mechanical issues
│
├─→ High temps good (strength)?
│   └─→ Use for functional parts, speed prints
│
├─→ Low temps good (detail)?
│   └─→ Use for miniatures, detailed models
│
├─→ Middle temp best overall?
│   └─→ Use as default for this filament
│
└─→ Run verification tests:
    ├─→ Bridging Test
    ├─→ Stringing Test
    └─→ Overhang Test
    │
    All pass?
    │
    ├─→ YES → Save to profile! ✅
    │
    └─→ NO → Adjust temp ±5°C and retest
```

---

## 💡 Pro Tips

### Tip 1: PID Tune After Temp Changes
If you're consistently printing at a new temp, re-run PID:
```gcode
M303 E0 S210 C8   ; PID tune at 210°C
M500              ; Save results
```

### Tip 2: Different Temps for Different Features
Use variable temperature during print:
- First layers: Higher temp
- Overhangs: Lower temp
- Bridges: Medium-low temp
- Top surfaces: Lower temp

**In SuperSlicer:** Use "Temperature - auto-override" feature

### Tip 3: Seasonal Adjustments
```
Winter (cold room):  +5°C
Summer (hot room):   -5°C
```

### Tip 4: Color Matters
Same brand, same type, different color:
```
White/Natural PLA:  Often needs +5°C
Black/Dark PLA:     Often needs -5°C
Translucent:        Usually standard temp
Metallic/Sparkle:   May need +5-10°C
```

### Tip 5: Document Everything
Create a temperature reference sheet:
```
Brand: Hatchbox
Material: PLA
Color: Red
Optimal Temp: 210°C
Bed Temp: 60°C
First Layer: +5°C (215°C)
Notes: Good bridges, minimal stringing
Date Tested: Oct 2025
```

### Tip 6: Multi-Material Prints
When changing materials mid-print:
```
PLA → PETG: Purge 50mm at new temp
PETG → PLA: Purge 100mm, clean nozzle
```

### Tip 7: Quick Temp Test Without Tower
Print a simple cube at 3 different temps:
- Low end of range
- Middle
- High end

Pick the best one, then fine-tune ±5°C

---

## ✅ Success Checklist

Your temperature is perfect when:
- ✅ Smooth, consistent surface finish
- ✅ Strong layer adhesion (can't separate layers)
- ✅ Good bridging (minimal sag)
- ✅ Minimal stringing
- ✅ Clean overhangs (up to 45°)
- ✅ No under-extrusion
- ✅ No clicking/grinding
- ✅ Consistent extrusion throughout print
- ✅ Good detail on small features
- ✅ No burnt smell or discoloration

---

## 🎯 Final Recommendations

### For Your Ender 5 Plus (Microswiss NG):

**PLA Starting Points:**
```
Brand New Filament:     Test 205-220°C
Hatchbox/Quality:       210°C typical
Budget Brands:          205-215°C typical
Fast Prints (60mm/s+):  215°C
Detail (<40mm/s):       205°C
First Layer:            +5°C
```

**PETG Starting Points:**
```
Standard:               240°C
First Layer:            245°C
Detail Work:            235°C
Speed Prints:           245°C
```

**ABS Starting Points:**
```
With Enclosure:         245°C
Open Air:               240°C
First Layer:            250°C
```

### Recommended Workflow:

1. **Run PID autotune** for your target temp range
2. **Print temperature tower** (5°C steps)
3. **Pick best section** (balance strength/quality)
4. **Run verification tests:**
   - Bridging test
   - Stringing test (if needed)
5. **Fine-tune ±2-3°C** if needed
6. **Save to slicer profile** with filament name
7. **Document** in your filament log

### Quality Checks:
- Re-test every new spool (even same brand/color)
- Quick verification print before important jobs
- Re-tune if switching layer heights significantly
- Check temperature if quality suddenly changes

**Perfect temp = Perfect prints!** 🎉

---

## 📚 Appendix: G-Code Reference

### PID Autotune Commands:
```gcode
M303 E0 S210 C8   ; Tune hotend at 210°C, 8 cycles
M303 E-1 S60 C8   ; Tune bed at 60°C, 8 cycles
M500              ; Save PID values to EEPROM
M503              ; Display current settings
```

### Manual Temperature Commands:
```gcode
M104 S210         ; Set hotend temp (don't wait)
M109 S210         ; Set hotend temp and wait
M140 S60          ; Set bed temp (don't wait)
M190 S60          ; Set bed temp and wait
```

### Temperature Monitoring:
```gcode
M105              ; Report temperatures
M155 S2           ; Auto-report temp every 2 seconds
```

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Ender 5 Plus | Microswiss NG Direct Drive | BTT SKR Mini E3  
**Tested Materials:** PLA, PETG, ABS, TPU  
**Recommended Test Files:** Teaching Tech Calibration, All-in-One Calibration Cube