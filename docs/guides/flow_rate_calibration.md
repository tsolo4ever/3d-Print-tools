# Flow Rate Calibration Guide
## Getting Perfect Extrusion for Every Filament

---

## 📋 Table of Contents

1. [What is Flow Rate?](#what-is-flow-rate)
2. [Why Flow Rate Matters](#why-matters)
3. [When to Calibrate](#when-to-calibrate)
4. [Prerequisites](#prerequisites)
5. [Calibration Methods](#calibration-methods)
6. [Step-by-Step Guide](#step-by-step)
7. [Material-Specific Settings](#material-settings)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

---

## 🎯 What is Flow Rate?

**Flow Rate** (also called Extrusion Multiplier) is a percentage adjustment in your slicer that fine-tunes how much plastic is extruded.

### The Relationship:
```
E-Steps (Firmware) → Calibrates the extruder motor
Flow Rate (Slicer) → Fine-tunes for specific filament/settings
```

### Key Differences:

| Setting | Where | Purpose | Frequency |
|---------|-------|---------|-----------|
| **E-Steps** | Firmware (EEPROM) | Motor calibration | Once per extruder setup |
| **Flow Rate** | Slicer Profile | Per-filament adjustment | Every new filament spool |

**Important:** Always calibrate E-steps FIRST, then flow rate!

---

## ⚡ Why Flow Rate Matters

### Too Low Flow (<95%):
- ❌ Under-extrusion
- ❌ Gaps between perimeters
- ❌ Weak layer adhesion
- ❌ Visible gaps in top layers
- ❌ Rough surface finish
- ❌ Poor strength

### Too High Flow (>105%):
- ❌ Over-extrusion
- ❌ Blobs and zits
- ❌ Elephant's foot on first layer
- ❌ Stringing
- ❌ Dimensional inaccuracy
- ❌ Rough top surfaces

### Just Right (95-105%):
- ✅ Perfect surface finish
- ✅ Accurate dimensions
- ✅ Strong layer adhesion
- ✅ No gaps or over-extrusion
- ✅ Clean corners and edges
- ✅ Consistent quality

---

## 📅 When to Calibrate Flow Rate

### ALWAYS Calibrate When:
- ✅ Using new brand of filament
- ✅ Switching filament types (PLA → PETG)
- ✅ Different colors from same manufacturer
- ✅ After changing E-steps
- ✅ After changing nozzle size
- ✅ After hotend replacement

### MAY Need Adjustment:
- ⚠️ Different print temperatures
- ⚠️ Different layer heights
- ⚠️ Very old vs fresh filament
- ⚠️ Humidity changes (PETG/Nylon)

### Regular Checks:
- 📅 Start of each new spool
- 📅 If quality suddenly degrades
- 📅 After 6 months on same filament

---

## ✔️ Prerequisites

### Before Calibrating Flow Rate:

**MUST be done first:**
- ✅ E-steps calibrated correctly
- ✅ Z-offset dialed in
- ✅ Bed properly leveled
- ✅ PID tuning completed
- ✅ Good quality filament (dry, not old)

**If these aren't done, flow calibration won't help!**

### Required Tools:
- ✅ Digital calipers (0.01mm accuracy)
- ✅ Test print STL (single-wall cube)
- ✅ Clean nozzle
- ✅ Known filament diameter

---

## 🎨 Calibration Methods

### Method 1: Single-Wall Cube ⭐ RECOMMENDED
**Difficulty:** Easy  
**Accuracy:** Excellent (±1%)  
**Time:** 15 minutes  
**Best for:** Most accurate results

### Method 2: Two-Wall Cube
**Difficulty:** Medium  
**Accuracy:** Very Good (±2%)  
**Time:** 20 minutes  
**Best for:** Verification

### Method 3: Visual Inspection
**Difficulty:** Easy  
**Accuracy:** Good (±5%)  
**Time:** 30 minutes  
**Best for:** Quick check, experienced users

---

## 📐 Method 1: Single-Wall Cube (Best Method)

### Step 1: Download Test Model
**Search for:** "Single Wall Calibration Cube" on Thingiverse
**Or Create Your Own:**
- 20mm x 20mm x 20mm cube
- 0 infill
- 0 top/bottom layers
- 1 perimeter only

### Step 2: Slicer Setup

**Critical Settings:**
```
Perimeters: 1
Top Layers: 0
Bottom Layers: 1 (for bed adhesion)
Infill: 0%
Flow Rate: 100% (starting point)
Layer Height: 0.2mm (standard)
Print Speed: 50mm/s (moderate)
Temperature: Standard for your filament
```

**SuperSlicer/PrusaSlicer Example:**
```
Print Settings → Layers and Perimeters
  - Perimeters: 1
  - Solid layers top: 0
  - Solid layers bottom: 1

Print Settings → Infill
  - Fill density: 0%

Filament Settings → Filament
  - Extrusion multiplier: 1.00 (100%)
```

### Step 3: Print the Cube
1. Slice the model
2. Verify in preview: should see single outline only
3. Print at least 3 walls high (10+ layers)
4. Let cool completely

### Step 4: Measure Wall Thickness

**Measurement Technique:**
1. Use digital calipers
2. Measure at 3 different heights
3. Measure on all 4 sides
4. Take average of 12 measurements

**Example Measurements:**
```
Side 1: 0.42mm, 0.43mm, 0.42mm
Side 2: 0.43mm, 0.42mm, 0.43mm
Side 3: 0.42mm, 0.41mm, 0.42mm
Side 4: 0.43mm, 0.42mm, 0.42mm

Average: 0.423mm
```

### Step 5: Calculate New Flow Rate

**Formula:**
```
New Flow % = (Target Thickness ÷ Measured Thickness) × Current Flow %
```

**For 0.4mm Nozzle:**
```
Target Thickness = 0.4mm (your nozzle diameter)
Measured Thickness = 0.423mm (from measurements)
Current Flow = 100%

New Flow % = (0.4 ÷ 0.423) × 100 = 94.6%
```

**Round to nearest 1%:** 95%

### Step 6: Verify

1. Set flow rate to new value (95%)
2. Print another single-wall cube
3. Measure again
4. Should now be very close to 0.4mm
5. If not, repeat calculation

**Acceptable Range:** 0.38mm to 0.42mm for 0.4mm nozzle

---

## 📐 Method 2: Two-Wall Cube (Verification Method)

### Step 1: Slicer Setup
```
Perimeters: 2
Top Layers: 0
Bottom Layers: 1
Infill: 0%
Flow Rate: Use value from Method 1
```

### Step 2: Print and Measure

**Expected Thickness:**
- 0.4mm nozzle × 2 walls = 0.8mm target

**Measurement:**
1. Measure wall thickness
2. Should be very close to 0.8mm
3. If 0.78mm to 0.82mm → Flow is good!

### Step 3: Fine-Tune if Needed
```
If measuring 0.85mm:
New Flow = (0.8 ÷ 0.85) × Current Flow
New Flow = 0.941 × 95 = 89.4% → Round to 89%
```

---

## 📐 Method 3: Visual Inspection Method

### Step 1: Print Calibration Part

**Settings:**
```
Perimeters: 2-3
Infill: 20%
Top Layers: 5
Flow: 100% (starting)
```

### Step 2: Visual Checks

**Look For:**

**Good Flow:**
- ✅ Smooth top surface
- ✅ No gaps between perimeters
- ✅ Clean, sharp corners
- ✅ Uniform layer lines
- ✅ Slight shine on top surface

**Under-Extrusion (Flow too low):**
- ❌ Gaps visible between perimeter lines
- ❌ Rough top surface
- ❌ Can see infill through walls
- ❌ Weak, brittle parts

**Over-Extrusion (Flow too high):**
- ❌ Blobs on corners
- ❌ Rough, bumpy surface
- ❌ Dimensions larger than expected
- ❌ Stringing between features

### Step 3: Adjust in 5% Increments

**If Under-Extruding:**
```
Current: 100%
Try: 105%
Still bad? Try: 110%
```

**If Over-Extruding:**
```
Current: 100%
Try: 95%
Still bad? Try: 90%
```

---

## 🧪 Material-Specific Flow Settings

### Your Ender 5 Plus Reference Values:

Based on your setup (Microswiss NG, E-steps: 424.09):

| Material | Starting Flow | Typical Range | Notes |
|----------|--------------|---------------|-------|
| **PLA** | 100% | 95-102% | Most consistent |
| **PETG** | 95% | 92-98% | Often needs reduction |
| **ABS** | 100% | 98-105% | Temperature dependent |
| **TPU** | 95% | 90-100% | Reduce for flexibility |
| **Nylon** | 100% | 95-103% | Moisture sensitive |
| **ASA** | 100% | 98-105% | Similar to ABS |

### Brand Variations:

**Premium Brands (Prusament, Polymaker):**
- Usually closer to 100%
- More consistent diameter
- Less adjustment needed

**Budget Brands (Overture, SUNLU):**
- May need 95-105% range
- Check diameter with calipers
- Can vary spool to spool

**Generic/Unknown:**
- Start at 95%
- Measure actual diameter
- Adjust accordingly

---

## 🔧 Advanced: Temperature-Based Flow

### The Relationship:
Higher temperature = Lower viscosity = Easier flow

**Example Adjustments:**
```
PLA at 200°C: Flow 100%
PLA at 210°C: Flow 98% (flows easier, need less)
PLA at 190°C: Flow 102% (flows harder, need more)
```

### When to Adjust:

**Increase Flow (+2-5%) if:**
- Printing colder than normal
- Fast print speeds
- Thick layers (0.3mm+)

**Decrease Flow (-2-5%) if:**
- Printing hotter than normal
- Slow detailed prints
- Thin layers (0.12mm)

---

## 🛠️ Troubleshooting

### Problem 1: Measurements Inconsistent

**Symptoms:**
- Different values on each wall
- Varies by layer height
- Can't get repeatable results

**Solutions:**

| Cause | Fix |
|-------|-----|
| **Loose belts** | Tighten X/Y belts |
| **Partial clog** | Clean or replace nozzle |
| **Wet filament** | Dry filament in oven/dryer |
| **E-steps not calibrated** | Calibrate E-steps first! |
| **Wobbly Z-axis** | Check lead screw, anti-backlash nut |

---

### Problem 2: Good Single Wall, Bad Two Wall

**Symptom:**
- Single wall measures perfect
- Two walls too thick or thin

**Cause:** Overlap settings in slicer

**Solution:**
```
Check: Perimeter Overlap setting
Should be: 25-30%
Try adjusting ±5%
```

---

### Problem 3: Flow Perfect But Gaps in Top Layer

**Symptom:**
- Perimeters look great
- Top surface has gaps/holes

**Cause:** Not a flow issue!

**Check:**
1. Increase top solid layers (5-7)
2. Reduce top layer speed
3. Enable ironing
4. Increase top infill overlap

---

### Problem 4: Different Flow Needed for Different Colors

**Symptom:**
- Red PLA needs 95%
- White PLA needs 100%
- Same brand, same type

**Cause:** Pigments affect flow

**Solution:**
- This is normal!
- Calibrate each color separately
- Save separate slicer profiles
- White/Natural usually need more flow
- Dark colors usually need less

---

### Problem 5: Flow Changes Over Time

**Symptom:**
- Good at start of spool
- Bad at end of spool

**Causes:**
1. **Filament absorbed moisture** → Dry it
2. **Nozzle wearing out** → Replace nozzle
3. **Temperature drift** → Re-run PID tuning
4. **Partial clog building** → Clean nozzle

---

## 📊 Quick Reference Decision Tree

```
Is E-steps calibrated?
│
├─→ NO → Calibrate E-steps FIRST
│
└─→ YES
    │
    Is Z-offset correct?
    │
    ├─→ NO → Fix Z-offset FIRST
    │
    └─→ YES
        │
        Print single-wall cube at 100% flow
        │
        ├─→ Measures 0.38-0.42mm (0.4mm nozzle)?
        │   │
        │   ├─→ YES → Flow is perfect! ✅
        │   │
        │   └─→ NO → Calculate new flow:
        │       New Flow = (0.4 ÷ Measured) × 100
        │       │
        │       Print again and verify
        │       │
        │       ├─→ Good? → Save to profile! ✅
        │       │
        │       └─→ Still bad? → Check for mechanical issues
        │
        └─→ Can't measure consistently?
            │
            └─→ Fix mechanical issues first!
```

---

## 💡 Pro Tips

### Tip 1: Different Nozzles, Different Flow
When you change nozzle sizes, expect flow to change:
- 0.6mm nozzle may need +2-3% vs 0.4mm
- 0.2mm nozzle may need -2-3% vs 0.4mm

### Tip 2: Save Separate Profiles
Create slicer profiles for each filament:
```
PLA_Hatchbox_Red_95%
PETG_Overture_Clear_92%
ABS_3DJake_Black_100%
```

### Tip 3: Measure Filament Diameter
Use calipers to measure actual filament:
```
If filament measures 1.78mm but slicer set to 1.75mm:
Effective over-extrusion of ~3.4%
Adjust flow to 97%
```

### Tip 4: Temperature Towers First
Run a temperature tower BEFORE flow calibration to find optimal temp for that filament.

### Tip 5: One Variable at a Time
Don't change multiple things at once:
1. Get temperature right
2. Then calibrate flow
3. Then tune other settings

### Tip 6: Document Everything
Keep a spreadsheet:
```
Brand | Type | Color | Temp | Flow | Notes
Hatchbox | PLA | Red | 205 | 95% | Perfect
Overture | PETG | Clear | 235 | 92% | Reduce for stringing
```

### Tip 7: Flow ≠ Fix for Bad Filament
If you need <90% or >110% flow, the problem is likely:
- Bad filament quality
- Wrong diameter setting
- E-steps way off
- Partial clog

---

## ✅ Success Checklist

Your flow rate is perfect when:
- ✅ Single-wall cube measures exactly nozzle diameter (±0.02mm)
- ✅ No gaps visible between perimeters
- ✅ Top surface smooth and consistent
- ✅ Dimensions match CAD model
- ✅ Strong layer adhesion
- ✅ No blobs or zits
- ✅ Clean corners and edges
- ✅ Consistent results print-to-print

---

## 🎯 Final Recommendations

### For Your Ender 5 Plus (Microswiss NG):

**Standard Starting Points:**
```
PLA:     100% → Test → Likely 95-98%
PETG:    95%  → Test → Likely 92-95%
ABS:     100% → Test → Likely 98-102%
TPU:     95%  → Test → Likely 90-95%
```

### Workflow:
1. **Calibrate E-steps** (424.09 currently - verify!)
2. **Run single-wall test** at 100%
3. **Calculate adjustment**
4. **Print verification cube**
5. **Save to profile**
6. **Document for future**

### Quality Checks:
- Run test cube every new spool
- Re-check if quality degrades
- Update notes in profile

**Perfect flow = Perfect prints!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Ender 5 Plus | Microswiss NG Direct Drive  
**Current E-Steps:** 424.09  
**Tested Materials:** PLA, PETG, ABS