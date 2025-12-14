# First Layer Adhesion Guide
## The Foundation of Every Successful Print

---

## 📋 Table of Contents

1. [Why First Layer is Critical](#why-critical)
2. [The Perfect First Layer](#perfect-first-layer)
3. [Prerequisites](#prerequisites)
4. [Build Surface Types](#build-surfaces)
5. [Bed Preparation](#bed-prep)
6. [Adhesion Methods](#adhesion-methods)
7. [First Layer Settings](#first-layer-settings)
8. [Troubleshooting](#troubleshooting)
9. [Material-Specific Tips](#material-tips)
10. [Advanced Techniques](#advanced)
11. [Quick Reference](#quick-reference)

---

## 🎯 Why First Layer is Critical

**The first layer is the foundation of your entire print!**

### A Good First Layer Means:
- ✅ Print stays stuck to bed
- ✅ No warping or lifting
- ✅ Accurate dimensions
- ✅ Strong part overall
- ✅ Good surface finish
- ✅ Predictable print success

### A Bad First Layer Causes:
- ❌ Print detaches mid-print (wasted time/filament)
- ❌ Warping and curling
- ❌ Shifted layers (if part moves)
- ❌ Spaghetti disasters
- ❌ Nozzle crashes
- ❌ Frustration!

**Golden Rule:** If the first layer fails, the entire print fails. Master this, and your success rate skyrockets!

---

## 🌟 The Perfect First Layer Checklist

### Visual Inspection:

**Look for these signs:**

✅ **Smooth, even surface**
- Lines are flat on top (not round)
- Slight shine/glossy appearance
- Uniform texture across entire layer

✅ **No gaps between lines**
- Lines touch each other
- Can't see through to bed
- Creates solid, continuous surface

✅ **Proper squish**
- Lines are slightly wider than nozzle
- Not round like spaghetti
- Not transparent/too thin

✅ **Good corner adhesion**
- All four corners stuck down
- No lifting or curling
- Flat against bed

✅ **Consistent across bed**
- Center looks same as edges
- No low/high spots
- Even coverage

### Physical Test:

**Try to remove with fingernail:**
- Should require effort
- Doesn't peel up easily
- Stays firmly attached

---

## ✔️ Prerequisites (Do These First!)

Before working on adhesion, these MUST be correct:

### 1. Bed Must Be Level ⭐ CRITICAL
**Symptoms of unlevel bed:**
- One corner good, others bad
- Nozzle too close in some spots
- Filament not sticking in other spots

**Solution:** Manually level bed with paper test, then run mesh leveling (UBL/ABL)

### 2. Z-Offset Calibrated ⭐ CRITICAL
**This is THE most important setting!**
- Too high → No adhesion
- Too low → Nozzle scrapes, elephants foot
- Just right → Perfect squish

**See your Z-Offset Calibration Guide for details**

### 3. Bed Temperature Correct
**Material-specific temps:**
- PLA: 60°C
- PETG: 75-80°C
- ABS: 90-100°C
- TPU: 50-60°C

### 4. Clean Bed Surface
**Oils, dust, and residue prevent adhesion!**
- Fingerprints are the enemy
- Old adhesive buildup
- Dust and particles

**Clean before EVERY print!**

### 5. First Layer Speed Slow
**Recommended: 20-30mm/s**
- Gives time for plastic to bond
- Reduces vibration
- More accurate placement

---

## 🛏️ Build Surface Types

Different surfaces have different characteristics:

### Glass Bed

**Pros:**
- ✅ Perfectly flat
- ✅ Smooth bottom finish
- ✅ Easy to clean
- ✅ Durable
- ✅ Inexpensive

**Cons:**
- ❌ Requires adhesive (glue stick/hairspray)
- ❌ Poor adhesion when cold
- ❌ Can be too smooth
- ❌ Parts hard to remove when hot

**Best For:** PLA with glue stick, ABS with hairspray

**Cleaning:** IPA (isopropyl alcohol) or glass cleaner

---

### PEI Sheet (Smooth)

**Pros:**
- ✅ Excellent adhesion (PLA, PETG, ABS)
- ✅ No adhesives needed
- ✅ Easy part removal when cool
- ✅ Durable
- ✅ Smooth finish

**Cons:**
- ❌ Can be TOO sticky (PETG)
- ❌ Wears over time
- ❌ Scratches easily
- ❌ More expensive

**Best For:** PLA (perfect), PETG (use glue stick), ABS

**Cleaning:** IPA when cool, soap and water periodically

---

### PEI Sheet (Textured/Powder-Coated)

**Pros:**
- ✅ Great for PETG (won't bond too much)
- ✅ Textured bottom finish
- ✅ Easy part removal
- ✅ Less scratching than smooth
- ✅ Works for most materials

**Cons:**
- ❌ Textured surface (not always desired)
- ❌ Can wear over time
- ❌ More expensive

**Best For:** PETG (excellent!), PLA, ABS

**Cleaning:** IPA, occasionally acetone (careful!)

---

### BuildTak / Removable Magnetic Surfaces

**Pros:**
- ✅ Flexible - bend to remove parts
- ✅ Easy part removal
- ✅ Magnetic (easy on/off)
- ✅ Decent adhesion
- ✅ Textured finish

**Cons:**
- ❌ Wears out faster
- ❌ Can't use high temps (100°C+ damages it)
- ❌ More expensive long-term
- ❌ Cuts/gouges easily

**Best For:** PLA, PETG (lower temps)

**Cleaning:** IPA, gentle - don't scratch!

---

### Spring Steel Sheet (Your Ender 5 Plus)

**Pros:**
- ✅ Flexible - pop parts off
- ✅ Magnetic - swap surfaces
- ✅ Durable steel base
- ✅ Can have different coatings (PEI, powder coat)
- ✅ Easy to clean

**Cons:**
- ❌ Coating can wear
- ❌ Initial cost
- ❌ Needs proper cleaning

**Your Setup:** Steel sheet with PEI coating

**Best For:** All materials

**Cleaning:** IPA regularly, soap/water monthly

---

### Material Comparison:

| Surface | PLA | PETG | ABS | TPU | Cost | Durability |
|---------|-----|------|-----|-----|------|------------|
| **Glass** | Good* | Fair* | Good* | Fair | $ | ⭐⭐⭐⭐⭐ |
| **PEI Smooth** | Excellent | Too sticky** | Good | Good | $$$ | ⭐⭐⭐⭐ |
| **PEI Textured** | Good | Excellent | Good | Good | $$$ | ⭐⭐⭐⭐ |
| **BuildTak** | Good | Good | Fair | Good | $$ | ⭐⭐⭐ |
| **Spring Steel** | Excellent | Excellent | Good | Good | $$$ | ⭐⭐⭐⭐⭐ |

*Requires adhesive  
**Use glue stick to prevent bonding too hard

---

## 🧼 Bed Preparation & Cleaning

### Daily Cleaning (Before Each Print):

**Method 1: IPA (Isopropyl Alcohol) - Quick Clean**
```
1. Heat bed to 60°C (helps clean better)
2. Spray 90%+ IPA on surface
3. Wipe with clean microfiber cloth
4. Repeat if still dirty
5. Let dry completely (evaporates fast)
6. Don't touch surface after cleaning!
```

**Why:** Removes oils, light dust, previous adhesive

**Frequency:** Before every print

---

**Method 2: Soap and Water - Deep Clean**
```
1. Remove build surface (if removable)
2. Wash with dish soap and warm water
3. Scrub gently with soft sponge
4. Rinse thoroughly
5. Dry completely with clean towel
6. Wipe once more with IPA
7. Let air dry 5 minutes
```

**Why:** Removes stubborn residue, old adhesives, built-up oils

**Frequency:** Weekly or when IPA not enough

---

**Method 3: Acetone - Heavy Duty (PEI Only)**
```
1. Remove surface from printer
2. In well-ventilated area, apply acetone
3. Wipe with cloth
4. Rinse with water
5. Dry completely
6. Final wipe with IPA
```

**⚠️ WARNING:**
- ONLY for PEI surfaces
- NOT for BuildTak or coated surfaces
- Use in ventilated area
- Don't use too often (can damage coating)

**Why:** Restores PEI adhesion when soap/IPA fail

**Frequency:** Monthly or when adhesion degrading

---

### What NOT To Do:

❌ **Don't touch surface with bare hands** after cleaning
- Skin oils ruin adhesion instantly
- Use gloves or handle edges only

❌ **Don't use abrasive cleaners**
- No scouring pads
- No abrasive powders
- Scratches reduce adhesion

❌ **Don't use wrong solvents**
- Acetone on non-PEI = damage
- Bleach = damage
- Harsh chemicals = damage

❌ **Don't scrape with metal**
- Damages coating
- Use plastic scrapers only

---

## 🎨 Adhesion Methods & Products

### Method 1: Clean Bare Surface (Preferred)

**Best For:** PEI, Spring Steel, properly prepared surfaces

**Process:**
```
1. Clean with IPA
2. Print directly on surface
3. No additives needed
```

**Pros:**
- ✅ Cleanest method
- ✅ No residue
- ✅ Easy cleanup
- ✅ Best for PLA on PEI

**Cons:**
- ❌ Doesn't work on all surfaces
- ❌ Some materials need help (PETG)

---

### Method 2: Glue Stick ⭐ MOST POPULAR

**Recommended:** Purple Elmer's washable glue stick

**Application:**
```
1. Clean bed with IPA
2. Heat bed to print temp
3. Apply thin, even layer of glue
4. Spread with finger or damp cloth
5. Let dry 1-2 minutes
6. Print!
```

**Best For:**
- PLA on glass
- PETG on PEI (prevents too-strong bond)
- ABS on glass
- Large prints
- Prints with small footprint

**Pros:**
- ✅ Cheap
- ✅ Easy to apply
- ✅ Easy to clean (water)
- ✅ Prevents PETG from bonding too hard
- ✅ Fills micro-scratches in bed

**Cons:**
- ❌ Needs reapplication
- ❌ Can build up over time
- ❌ Slight texture on bottom

**Cleaning:** Warm water and cloth

**Frequency:** Reapply every 3-5 prints

---

### Method 3: Hairspray

**Recommended:** Unscented, cheap hairspray (Aqua Net)

**Application:**
```
1. Remove bed from printer (spray gets everywhere!)
2. Hold can 6-8 inches away
3. Spray thin, even coat
4. Let dry 30 seconds
5. Reinstall bed
6. Print
```

**Best For:**
- ABS (excellent!)
- Large PLA prints
- Glass beds
- Nylon

**Pros:**
- ✅ Very strong hold
- ✅ Works great for ABS
- ✅ Lasts multiple prints
- ✅ Cheap

**Cons:**
- ❌ Messy (spray gets everywhere)
- ❌ Smell
- ❌ Sticky buildup
- ❌ Harder to clean than glue

**Cleaning:** IPA or warm soapy water

**Frequency:** Reapply every 5-10 prints

---

### Method 4: Painter's Tape (Blue Tape)

**Recommended:** 3M ScotchBlue or similar

**Application:**
```
1. Apply strips of tape to bed
2. Overlap slightly
3. Smooth out bubbles
4. Trim edges
5. Print directly on tape
```

**Best For:**
- PLA (works great!)
- Quick/temporary setup
- Protecting bed surface
- Learning/testing

**Pros:**
- ✅ Cheap
- ✅ Easy application
- ✅ Protects bed
- ✅ Easy part removal
- ✅ Good for PLA

**Cons:**
- ❌ Wears out quickly
- ❌ Can leave residue
- ❌ Not ideal for high temps (60°C max)
- ❌ Seams between tape strips
- ❌ Textured bottom finish

**Replacement:** Every 5-10 prints or when worn

---

### Method 5: Magigoo / 3D Printing Adhesives

**Commercial adhesive sticks designed for 3D printing**

**Application:**
```
1. Apply to heated bed
2. Spread thin layer
3. Let dry
4. Print
```

**Best For:**
- Difficult materials (Nylon, PC, ASA)
- Professional environments
- When nothing else works

**Pros:**
- ✅ Very strong
- ✅ Material-specific formulas
- ✅ Works for difficult materials
- ✅ Long-lasting

**Cons:**
- ❌ Expensive
- ❌ Overkill for PLA/PETG
- ❌ Can be TOO strong

**Cost:** $15-25 per stick

---

### Method 6: Brims and Rafts (Slicer Settings)

**Not a surface treatment - but helps adhesion!**

**Brim:**
```
Single layer outline around part
Width: 5-10mm typical
Increases contact area
Easy to remove
```

**Best for:**
- Small footprint parts
- Parts with pointy corners
- Tall thin prints
- When adhesion marginal

**Raft:**
```
Thick platform under part
Multiple layers
Large contact area
Part sits on top
```

**Best for:**
- Warping-prone materials (ABS)
- Uneven beds
- Parts with very small footprint
- When all else fails

**Cons of Raft:**
- Uses more material
- Ugly bottom surface
- Takes longer
- Wastes filament

---

### Adhesion Method Decision Tree:

```
What material?
│
├─→ PLA
│   ├─→ On PEI/Spring Steel → Clean bed only ✅
│   ├─→ On Glass → Glue stick
│   └─→ Small footprint → Add brim
│
├─→ PETG
│   ├─→ On PEI Smooth → Glue stick (prevents too-strong bond!) ✅
│   ├─→ On PEI Textured → Clean bed only ✅
│   ├─→ On Glass → Glue stick
│   └─→ Large/flat → Textured PEI ideal
│
├─→ ABS
│   ├─→ On any surface → Hairspray ✅
│   ├─→ Warping issues → Add brim or raft
│   └─→ Enclosure highly recommended
│
├─→ TPU
│   ├─→ On PEI → Clean bed only
│   ├─→ On Glass → Light glue stick
│   └─→ Slow first layer (15mm/s)
│
└─→ Nylon/PC/Advanced
    └─→ Magigoo or specific adhesive
```

---

## ⚙️ First Layer Slicer Settings

### Critical First Layer Settings:

**Layer Height:**
```
Standard: 0.2mm
First Layer: 0.2mm (same) OR 0.24mm (120% of normal)

Rule: 75-120% of normal layer height
```

**Why bigger first layer:**
- More squish = better adhesion
- Forgives minor bed leveling issues
- Stronger bond to bed

---

**Print Speed:**
```
Normal Speed: 50mm/s
First Layer Speed: 20mm/s (40% of normal)

Recommended: 15-30mm/s for first layer
```

**Why slower:**
- Gives time to bond
- More accurate placement
- Reduces vibration
- Better corner adhesion

---

**Temperature:**
```
PLA Normal: 210°C
PLA First Layer: 215°C (+5°C)

PETG Normal: 240°C
PETG First Layer: 245°C (+5°C)
```

**Why hotter:**
- Better flow
- Stronger bond to bed
- Compensates for heat loss to cold bed

---

**Line Width:**
```
Normal: 0.4mm (for 0.4mm nozzle)
First Layer: 0.48mm (120% of nozzle)

Can go up to 150-200% for extra adhesion!
```

**Why wider:**
- More contact area
- Better adhesion
- Hides minor leveling issues

---

**Fan Speed:**
```
First Layer: 0% (fan OFF)
Second Layer: Ramp up gradually
Normal Layers: 100% (PLA)

PETG: Max 50% even on normal layers
ABS: 0-30% max
```

**Why fan off:**
- Part cooling too fast = warping
- Need heat to bond to bed
- Turn on after first layer

---

### Example First Layer Profile (PLA):

```
Layer Height: 0.2mm
First Layer Height: 0.24mm (120%)
First Layer Speed: 20mm/s
First Layer Temp: 215°C (normal 210°C)
Bed Temp: 60°C
First Layer Line Width: 0.48mm (120%)
Fan Speed: 0% first layer
Brim: 5mm (if needed)
```

---

## 🛠️ Troubleshooting First Layer Problems

### Problem 1: Filament Not Sticking At All

**Symptoms:**
- Filament gets pushed around by nozzle
- Doesn't stick anywhere
- Curls up behind nozzle

**Solutions (in order):**

1. **Z-offset too high** ⭐ MOST COMMON
   - Lower Z-offset by 0.05mm
   - Should see squish

2. **Bed too cold**
   - Increase bed temp +5-10°C
   - Wait for full heat-up

3. **Bed dirty**
   - Clean with IPA
   - Deep clean with soap/water

4. **Wrong material selected**
   - Check bed temp in slicer
   - PLA needs 60°C, not 0°C!

5. **Bed not level**
   - Re-level manually
   - Run mesh leveling

---

### Problem 2: Filament Sticks But Warps/Lifts Later

**Symptoms:**
- First layer looks good initially
- Corners lift after a few layers
- Part detaches mid-print

**Solutions:**

1. **Cooling too aggressive**
   - Disable fan for first 3-5 layers
   - Reduce max fan speed

2. **Bed temp too low**
   - Increase +5-10°C
   - Keep bed hot entire print

3. **Drafts/airflow**
   - Enclose printer
   - Block vents/windows
   - Close door to room

4. **Part design (sharp corners)**
   - Add brim (8-10mm)
   - Add "mouse ears" in corners
   - Round sharp corners in CAD

5. **Material-specific** (ABS especially)
   - Needs enclosure
   - Higher bed temp (100°C)
   - Hairspray adhesive

---

### Problem 3: Nozzle Too Close (Scraping/Clicking)

**Symptoms:**
- Nozzle scrapes bed
- Extruder clicking/skipping
- No filament coming out
- Transparent first layer

**Solutions:**

1. **Z-offset too negative**
   - Raise Z-offset by +0.05mm
   - Should see filament flowing

2. **Bed not level**
   - One spot too close
   - Re-level bed

3. **First layer too thin**
   - Increase first layer height
   - Try 0.28mm or 0.32mm

---

### Problem 4: Gaps Between Lines

**Symptoms:**
- Can see through first layer
- Lines don't touch
- Weak adhesion

**Solutions:**

1. **Z-offset too high**
   - Lower by 0.02-0.05mm
   - Need more squish

2. **Under-extrusion**
   - Check E-steps calibrated
   - Check flow rate
   - Increase flow +5%

3. **First layer line width too narrow**
   - Increase to 120-150% of nozzle
   - More coverage

---

### Problem 5: "Elephants Foot" (Bottom Bulging)

**Symptoms:**
- First layer wider than rest
- Bottom edge has bulge
- Dimensional inaccuracy

**Causes & Solutions:**

1. **Z-offset too low (too much squish)**
   - Raise Z-offset +0.05mm

2. **First layer too hot**
   - Reduce first layer temp -5°C

3. **Bed too hot**
   - Reduce bed temp -5°C
   - Plastic stays soft, squishes out

4. **Enable Elephant's Foot Compensation**
   - In slicer advanced settings
   - Shrinks first layer slightly (0.1-0.2mm)

---

### Problem 6: One Corner Good, Others Bad

**Symptom:**
- Adhesion perfect in one area
- Poor in other areas
- Inconsistent first layer

**Cause:** Bed not level (mechanical issue)

**Solution:**
1. Turn off printer
2. Manually level bed with paper
3. Check all 4 corners + center
4. All should have same resistance
5. Run UBL/ABL mesh
6. Re-check Z-offset at center

**This is NOT an adhesion problem - it's leveling!**

---

### Problem 7: PETG Bonds TOO Well (Can't Remove Part)

**Symptoms:**
- Part stuck like glue
- Damages bed surface trying to remove
- Takes chunks of PEI off

**Solutions:**

1. **Use glue stick!** ⭐ BEST SOLUTION
   - Creates release layer
   - Part still sticks well
   - Removes easily

2. **Wait for bed to cool completely**
   - PETG releases when cold
   - Don't try to remove hot!

3. **Use textured PEI instead of smooth**
   - Less bonding
   - Easier release

4. **Reduce bed temp**
   - Try 70°C instead of 80°C

5. **Increase Z-offset slightly**
   - Less squish = easier removal
   - But don't compromise adhesion

---

## 🧪 Material-Specific First Layer Tips

### PLA - Easy Mode

**Bed Temp:** 60°C  
**First Layer Temp:** 210-215°C  
**Surface:** PEI (perfect), Glass + glue stick

**Tips:**
- Easiest material for adhesion
- Clean PEI works great
- Fan off first layer only
- Minimal warping

**Common Issues:**
- Usually Z-offset related
- Clean bed if not sticking

---

### PETG - The Sticky One

**Bed Temp:** 75-80°C  
**First Layer Temp:** 240-245°C  
**Surface:** Textured PEI (best), Smooth PEI + glue stick

**Tips:**
- Bonds VERY strong to PEI
- **Always use glue stick on smooth PEI!**
- Wait for bed to cool before removing
- Textured PEI is ideal (no glue needed)
- Fan max 50% even after first layer

**Common Issues:**
- Sticks too well - use glue stick!
- Stringing - reduce temp
- Warping less common than PLA

---

### ABS - The Challenging One

**Bed Temp:** 90-100°C  
**First Layer Temp:** 245-250°C  
**Surface:** Glass + hairspray, PEI + hairspray

**Tips:**
- Warps easily - needs enclosure!
- Hairspray works best
- Keep bed hot entire print
- NO fan first 10+ layers
- Block all drafts
- Consider ABS juice (ABS dissolved in acetone)

**Common Issues:**
- Warping - increase bed temp, add enclosure
- Corner lifting - add brim, use hairspray
- Smells - ventilate area

---

### TPU/Flexible - The Floppy One

**Bed Temp:** 50-60°C  
**First Layer Temp:** 225-230°C  
**Surface:** Clean PEI, Glass + light glue

**Tips:**
- Print SLOW (15-20mm/s first layer)
- Direct drive much easier
- Clean bed usually enough
- Light glue stick if needed
- No fan at all

**Common Issues:**
- Under-extrusion - slow down!
- Stringing - reduce temp, minimal retraction
- Not sticking - increase bed temp

---

## 🔬 Advanced Techniques

### Technique 1: Bed Mesh Visualization

**Check your mesh quality:**
```gcode
G29 P0    ; Zero mesh
G29 P1    ; Auto probe
G29 T     ; Display mesh in terminal
```

**Look for:**
- Variation < 0.3mm = good bed
- Variation > 0.5mm = mechanical issues
- Consistent tilt = adjust tramming screws

---

### Technique 2: Live Z-Adjust During First Layer

**Most printers support baby-stepping:**
- Watch first layer print
- Adjust Z on the fly
- See results immediately
- Save when perfect

**Your Ender 5 Plus:** Use LCD to adjust Z-offset during print

---

### Technique 3: First Layer Calibration Print

**Print specifically designed test:**
- Large square with multiple sections
- Tests entire bed
- Shows problem areas
- Quick feedback

**Download:** "First Layer Calibration" on Thingiverse

---

### Technique 4: Temperature Profiling

**Different areas of bed may be different temps!**

**Test:**
1. Place thermometer on bed
2. Check temp in center
3. Check all 4 corners
4. Note differences

**Solutions if inconsistent:**
- Upgrade to AC-powered bed heater
- Add insulation under bed
- Adjust PID tuning
- Compensate with mesh leveling

---

### Technique 5: Textured Beds for PETG

**If printing lots of PETG:**
- Get textured/powder-coated PEI sheet
- No glue stick needed!
- Easy part removal
- Great adhesion
- Worth the investment

---

## ✅ Success Checklist

Perfect first layer achieved when:
- ✅ Smooth, flat appearance
- ✅ Lines touch with no gaps
- ✅ Slight squish visible (not round)
- ✅ All corners stuck down
- ✅ No lifting or curling
- ✅ Can't easily peel with fingernail
- ✅ Consistent across entire bed
- ✅ Proper layer height achieved
- ✅ No elephants foot
- ✅ Print completes successfully

---

## 🎯 Final Recommendations

### For Your Ender 5 Plus (Spring Steel + PEI):

**PLA Recipe:**
```
Surface Prep: Clean with IPA only
Bed Temp: 60°C
First Layer Temp: 215°C
First Layer Speed: 20mm/s
First Layer Height: 0.24mm (120%)
Fan: 0% first layer
Z-Offset: -1.67mm (your current)
Adhesive: None needed
```

**PETG Recipe:**
```
Surface Prep: Thin layer of glue stick
Bed Temp: 75°C
First Layer Temp: 245°C
First Layer Speed: 20mm/s
First Layer Height: 0.24mm
Fan: 0% first 3 layers
Z-Offset: -1.67mm
Adhesive: Glue stick (purple Elmer's)
```

**ABS Recipe:**
```
Surface Prep: Hairspray
Bed Temp: 95°C
First Layer Temp: 250°C
First Layer Speed: 25mm/s
First Layer Height: 0.28mm
Fan: 0% first 10 layers
Z-Offset: -1.65mm (slightly less squish)
Adhesive: Hairspray
Enclosure: Highly recommended
```

### Quick Start Workflow:

1. **Clean bed** (IPA or soap/water)
2. **Apply adhesive if needed** (glue/hairspray)
3. **Heat bed** to temp
4. **Load filament and purge** nozzle
5. **Start print**
6. **Watch first layer closely!**
7. **Adjust Z if needed** (baby-stepping)
8. **Let complete or stop if bad**

### Maintenance Schedule:

**Daily:**
- Clean bed with IPA before each print

**Weekly:**
- Deep clean with soap and water
- Check Z-offset calibration
- Verify bed level

**Monthly:**
- Check for bed surface wear
- Re-run full bed mesh
- Clean with acetone (PEI only)
- Inspect for damage

**As Needed:**
- Replace worn build surface
- Re-calibrate after maintenance
- Adjust for new materials

---

**Master the first layer, master 3D printing!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Universal (Examples from Ender 5 Plus with Spring Steel PEI)  
**Build Surface:** Steel + PEI Coating  
**Current Z-Offset:** -1.67mm  
**Tested Materials:** PLA, PETG, ABS, TPU