# Hole Size Compensation Calibration Guide
## Fixing Undersized Holes in 3D Prints

---

## 🎯 Your Problem

**Designed hole:** 3.5mm  
**Actual printed hole:** 2.33mm  
**Compensation needed:** 1.17mm (33.4% undersized!)

This is a significant dimensional error that needs correction.

---

## 📊 Current Settings Analysis

### EEPROM Settings (Ender 5 Plus):
```
X Steps/mm: 80.0
Y Steps/mm: 80.0
Z Steps/mm: 800.0
E Steps/mm: 424.09
```

### Slicer Settings (0.16mm OPTIMAL profile):
```
hole_size_compensation = 0          ← THIS IS YOUR PROBLEM
xy_size_compensation = 0
xy_inner_size_compensation = 0
first_layer_size_compensation = -0.1
```

---

## 🔧 Root Cause Analysis

Your holes are printing **33.4% undersized**. This is caused by:

1. **No hole compensation** - Currently set to 0
2. **Plastic shrinkage** - Material cools and contracts
3. **Die swell** - Extruded plastic expands slightly
4. **Corner pulling** - Perimeters pull inward on curves

---

## 📐 Calculation for Your Specific Case

### Method 1: Direct Compensation
```
Error = Designed - Actual
Error = 3.5mm - 2.33mm = 1.17mm

Compensation needed = Error / 2 = 0.585mm
(Divide by 2 because radius affects diameter by 2x)
```

### Method 2: Percentage-Based
```
Actual/Designed = 2.33/3.5 = 0.666 (66.6% of desired size)
Scale factor needed = 1.5 (to compensate)
Compensation = 1.17mm / 2 = 0.585mm per side
```

---

## ⚙️ Recommended Settings

### Option A: Aggressive Fix (Start Here)
```
hole_size_compensation = 0.6
xy_inner_size_compensation = 0.6
```

### Option B: Conservative Fix
```
hole_size_compensation = 0.4
xy_inner_size_compensation = 0.4
```

### Option C: Moderate Fix
```
hole_size_compensation = 0.5
xy_inner_size_compensation = 0.5
```

**I recommend starting with Option A (0.6mm)** based on your severe undersizing.

---

## 🎯 Step-by-Step Calibration Process

### Step 1: Update Slicer Settings

Open your SuperSlicer profile and change:

```ini
# In Print Settings > Advanced > Quality
hole_size_compensation = 0.6
xy_inner_size_compensation = 0.6

# Optional: For overall dimensional accuracy
xy_size_compensation = 0.05
```

### Step 2: Print Test Part

Print a calibration part with holes at:
- 2mm
- 3mm
- 4mm
- 5mm
- 8mm

### Step 3: Measure Results

Use digital calipers to measure each hole:
```
Measure in 2 directions (X and Y axis)
Take average of both measurements
Compare to designed size
```

### Step 4: Calculate Adjustment

For each hole size:
```
Error = Designed - Measured
Adjustment = Current Compensation ± (Error / 2)
```

Example for your 3.5mm hole:
```
If hole measures 3.3mm with 0.6mm compensation:
Error = 3.5 - 3.3 = 0.2mm
New compensation = 0.6 + (0.2/2) = 0.7mm
```

### Step 5: Fine-Tune

Repeat with new compensation value until holes are within ±0.05mm tolerance.

---

## 📏 Testing Recommendations

### Quick Test Part (Fusion 360 Code)
```
// Create a test plate with multiple hole sizes
Create rectangle: 50mm x 50mm x 3mm
Add holes:
  - 2mm diameter at (10, 10)
  - 3mm diameter at (25, 10)
  - 4mm diameter at (40, 10)
  - 5mm diameter at (10, 25)
  - 8mm diameter at (25, 25)
  
Label each hole with embossed text
```

### Print Settings for Test:
```
Layer Height: 0.2mm
Perimeters: 3
Infill: 20%
Speed: 50mm/s perimeter, 80mm/s infill
Temperature: Standard for your material
```

---

## 🔍 What Each Setting Does

### `hole_size_compensation`
- **Range:** -2.0 to 2.0mm
- **Effect:** Expands ALL holes and curved internal features
- **Use:** Primary fix for undersized holes
- **Your value:** 0.6mm

### `xy_inner_size_compensation`
- **Range:** -2.0 to 2.0mm
- **Effect:** Expands ALL internal perimeters (holes, slots, pockets)
- **Use:** Works with hole_size_compensation
- **Your value:** 0.6mm

### `xy_size_compensation`
- **Range:** -2.0 to 2.0mm
- **Effect:** Expands/shrinks ENTIRE part outline
- **Use:** For overall dimensional accuracy
- **Recommended:** 0.05mm (only if needed)

### `hole_size_threshold`
- **Range:** 0 to 1000mm
- **Current:** 100mm
- **Effect:** Only applies compensation to holes smaller than this
- **Recommendation:** Leave at 100mm

---

## 🎯 Advanced Calibration

### If Simple Compensation Doesn't Work:

1. **Check Steps/mm Calibration**
   ```
   Print a 100mm x 100mm square
   Measure with calipers
   If not 100mm ± 0.2mm, calibrate X/Y steps
   ```

2. **Check Extrusion Multiplier**
   ```
   Current: 100%
   If over-extruding, holes shrink
   Test: Print single-wall cube, measure wall thickness
   Should match nozzle diameter (0.4mm)
   ```

3. **Check Temperature**
   ```
   Higher temp = more flow = smaller holes
   Lower temp = less flow = larger holes
   Calibrate temp for your filament
   ```

4. **Check Print Speed**
   ```
   Slower perimeters = more accurate
   Your setting: 40mm/s perimeters (good)
   External perimeters: 25mm/s (good)
   ```

---

## 📊 Validation Test

After applying compensation, print this test:

```
Part: Simple bracket with mounting holes
Holes: 3.0mm, 3.5mm, 4.0mm
Tolerance: ± 0.05mm acceptable
          ± 0.1mm good
          ± 0.2mm acceptable for non-critical
```

### Expected Results with 0.6mm Compensation:
```
Designed 3.5mm → Should print 3.45-3.55mm
If still undersized, increase to 0.7mm
If oversized, decrease to 0.5mm
```

---

## 🛠️ Updating Your Profile

### Quick Fix - Command Line (if you have terminal access):
```bash
# Edit the profile file
nano /path/to/0_16mm_OPTIMAL__DD.ini

# Find and change these lines:
hole_size_compensation = 0.6
xy_inner_size_compensation = 0.6

# Save and restart SuperSlicer
```

### GUI Method:
1. Open SuperSlicer
2. Load "0.16mm OPTIMAL" profile
3. Go to: **Print Settings → Advanced → Quality**
4. Find **"Hole size compensation"**
5. Change from `0` to `0.6`
6. Find **"XY inner size compensation"**
7. Change from `0` to `0.6`
8. Click **Save**

---

## 📋 Quick Reference Card

```
╔══════════════════════════════════════════════════╗
║         HOLE COMPENSATION SETTINGS               ║
╠══════════════════════════════════════════════════╣
║ hole_size_compensation       = 0.6mm            ║
║ xy_inner_size_compensation   = 0.6mm            ║
║ xy_size_compensation         = 0.0mm            ║
║ hole_size_threshold          = 100mm            ║
╠══════════════════════════════════════════════════╣
║ Expected 3.5mm hole result: 3.45-3.55mm         ║
║ Tolerance: ±0.1mm acceptable                    ║
╚══════════════════════════════════════════════════╝
```

---

## 🔧 Troubleshooting

### Holes Still Too Small After 0.6mm Compensation?
→ Increase to 0.7mm or 0.8mm
→ Check if over-extruding (flow too high)
→ Verify nozzle size is actually 0.4mm

### Holes Now Too Large?
→ Decrease to 0.5mm or 0.4mm
→ Check if under-extruding (flow too low)

### Different Sizes Need Different Compensation?
→ Use `hole_to_polyhole` feature
→ Creates polygon approximation of circles
→ More accurate for specific sizes

### Only Certain Orientations Wrong?
→ Check belt tension (X and Y)
→ Verify steps/mm calibration
→ Check for mechanical binding

---

## 📖 Additional Resources

### Calibration Test Files
- **XYZ 20mm Calibration Cube**
- **Hole Size Calibration Tower**
- **Tolerance Test Print**

### Settings Files
All settings are in your project:
- Main profile: `0_16mm_OPTIMAL__DD.ini`
- EEPROM backup: `Ender_5_plus_w-BTT_SKR_mini___Microswiss_NG_eeprom_backup__2_.json`

---

## 🎯 Next Steps

1. ✅ **Update hole_size_compensation to 0.6mm**
2. ✅ **Update xy_inner_size_compensation to 0.6mm**
3. 🖨️ **Print test part with multiple hole sizes**
4. 📏 **Measure with digital calipers**
5. 🔧 **Adjust if needed (±0.1mm increments)**
6. ✅ **Save final calibrated profile**

---

## 📝 Notes

- Your current E-steps (424.09) look good for Micro Swiss NG
- Your speeds are conservative and good for accuracy
- Consider printing test part with hole sizes you commonly use
- Different materials may need slight adjustments
- PLA typically needs more compensation than PETG

**Good luck! Start with 0.6mm compensation and measure the results!**