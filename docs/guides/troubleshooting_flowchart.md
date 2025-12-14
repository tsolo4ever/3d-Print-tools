# Quick Troubleshooting Flowchart
## Fast Solutions to Common 3D Printing Problems

---

## 📋 Table of Contents

1. [How to Use This Guide](#how-to-use)
2. [First Layer Problems](#first-layer)
3. [Extrusion Issues](#extrusion)
4. [Surface Quality Problems](#surface-quality)
5. [Dimensional Accuracy](#dimensions)
6. [Stringing and Oozing](#stringing)
7. [Layer Adhesion Issues](#layer-adhesion)
8. [Support Problems](#supports)
9. [Warping and Lifting](#warping)
10. [Print Defects Reference](#defects)
11. [Emergency Troubleshooting](#emergency)

---

## 🎯 How to Use This Guide

### Quick Start:

1. **Identify your problem** from the sections below
2. **Follow the flowchart** for your issue
3. **Try solutions in order** (easiest/most likely first)
4. **Check related guides** for detailed instructions
5. **Document what worked** for future reference

### Problem Categories:

Each section has:
- **Visual symptoms** - What it looks like
- **Decision tree** - Step-by-step diagnosis
- **Quick fixes** - Solutions in priority order
- **Related guides** - Links to detailed guides

---

## 🔧 First Layer Problems

### Flowchart:

```
First Layer Issue?
│
├─→ Filament not sticking at all
│   │
│   Z-offset correct? (paper test)
│   ├─→ NO → Adjust Z-offset (lower by 0.05mm)
│   │       See: Z-Offset Calibration Guide
│   │
│   └─→ YES
│       │
│       Bed clean?
│       ├─→ NO → Clean with IPA, try again
│       │
│       └─→ YES
│           │
│           Bed temp correct?
│           ├─→ NO → PLA:60°C, PETG:75°C, ABS:95°C
│           │
│           └─→ YES
│               │
│               First layer speed slow? (20mm/s)
│               ├─→ NO → Reduce speed
│               │
│               └─→ YES → Add adhesion aid (glue stick)
│
├─→ Nozzle scraping bed / clicking sounds
│   │
│   Z-offset too low!
│   └─→ Raise Z-offset (+0.05mm)
│       See: Z-Offset Calibration Guide
│
├─→ Gaps between lines
│   │
│   Z-offset too high?
│   ├─→ YES → Lower Z-offset (-0.02mm)
│   │
│   └─→ NO
│       │
│       Flow rate correct?
│       └─→ Check with single-wall test
│           See: Flow Rate Calibration Guide
│
├─→ One corner good, others bad
│   │
│   Bed not level (mechanical issue)
│   └─→ Re-level bed manually
│       Then run mesh leveling (UBL/ABL)
│
└─→ Parts lift/warp after a few layers
    │
    See: Warping section below
```

---

### Quick Fixes Priority:

**#1 - Z-Offset (90% of first layer issues)**
```
Too high → Lower by 0.05mm
Too low → Raise by 0.05mm
Test print single layer
```

**#2 - Clean Bed**
```
1. IPA wipe
2. If still bad: soap and water
3. If PETG on PEI: add glue stick
```

**#3 - Temperature**
```
Verify correct bed temp for material
Wait for full heat soak (2-3 minutes)
```

**#4 - Speed**
```
First layer: 20mm/s or slower
Allows time to bond
```

**#5 - Adhesion Aid**
```
Glass: Glue stick
PETG on PEI: Glue stick (prevents damage)
ABS: Hairspray
```

**Related Guides:**
- Z-Offset Calibration Guide
- First Layer Adhesion Guide

---

## 📤 Extrusion Issues

### Flowchart:

```
Extrusion Problem?
│
├─→ No filament coming out / clicking extruder
│   │
│   Nozzle clogged?
│   ├─→ Try cold pull
│   ├─→ Try atomic pull
│   └─→ Replace nozzle if can't clear
│   │
│   Temperature too low?
│   ├─→ Increase by 10°C
│   │
│   Z-offset way too low?
│   └─→ Raise Z-offset
│
├─→ Under-extrusion (gaps, weak prints)
│   │
│   E-steps calibrated?
│   ├─→ NO → Calibrate E-steps FIRST!
│   │       See: Flow Rate Guide (E-steps section)
│   │
│   └─→ YES
│       │
│       Flow rate correct?
│       ├─→ Test with single-wall cube
│       │   See: Flow Rate Calibration Guide
│       │
│       Partial clog?
│       ├─→ Check with extrusion test
│       ├─→ Increase temperature +5°C
│       └─→ Clean or replace nozzle
│       │
│       Filament quality?
│       └─→ Try known-good filament
│
├─→ Over-extrusion (blobs, rough surface)
│   │
│   E-steps too high?
│   ├─→ Re-calibrate E-steps
│   │
│   Flow rate too high?
│   ├─→ Test with single-wall cube
│   │   Should measure exactly nozzle diameter
│   │   See: Flow Rate Calibration Guide
│   │
│   Temperature too high?
│   └─→ Lower by 5°C
│       See: Temperature Tuning Guide
│
└─→ Inconsistent extrusion
    │
    Filament wet?
    ├─→ Listen for popping/crackling
    ├─→ Check for brittleness
    └─→ Dry filament
        See: Filament Storage & Drying Guide
    │
    Extruder tension?
    ├─→ Check drive gear pressure
    ├─→ Clean drive gear
    │
    Bowden tube issues? (if Bowden)
    └─→ Check for gaps at hotend
        Replace PTFE tube if worn
```

---

### Quick Fixes Priority:

**#1 - Check E-Steps**
```
MUST be calibrated before anything else!
100mm test - measure actual extrusion
Calculate new value
See: Flow Rate Guide
```

**#2 - Flow Rate**
```
Single-wall cube test
Target: exactly nozzle diameter
Adjust flow % in slicer
```

**#3 - Temperature**
```
Too cold = under-extrusion + clicking
Too hot = over-extrusion + oozing
Run temp tower test
```

**#4 - Check for Clogs**
```
Cold pull method
Atomic pull method
Replace nozzle if persistent
```

**#5 - Filament Condition**
```
Wet filament = inconsistent extrusion
Popping sounds = definitely wet
Dry filament properly
```

**Related Guides:**
- Flow Rate Calibration Guide
- Temperature Tuning Guide
- Filament Storage & Drying Guide

---

## 🎨 Surface Quality Problems

### Flowchart:

```
Surface Quality Issue?
│
├─→ Layer lines very visible / rough
│   │
│   Layer height too high?
│   ├─→ Reduce to 0.2mm or 0.12mm
│   │
│   Temperature optimized?
│   └─→ Run temp tower
│       See: Temperature Tuning Guide
│
├─→ Blobs and zits on surface
│   │
│   Retraction tuned?
│   ├─→ NO → Calibrate retraction
│   │       See: Retraction Calibration Guide
│   │
│   Over-extrusion?
│   ├─→ Check flow rate
│   │
│   Wet filament?
│   └─→ Dry filament
│
├─→ Stringing between features
│   │
│   Temperature too high?
│   ├─→ YES → Lower by 5°C
│   │       See: Temperature Tuning Guide
│   │
│   └─→ NO
│       │
│       Retraction settings?
│       └─→ Increase distance +0.5mm
│           Increase speed +5mm/s
│           See: Retraction Calibration Guide
│       │
│       Wet filament? (especially PETG)
│       └─→ Dry filament
│
├─→ Ringing/ghosting (ripples on surface)
│   │
│   Acceleration too high?
│   ├─→ Reduce print acceleration
│   │   Try: 500mm/s² for quality
│   │
│   Printer loose/wobbly?
│   ├─→ Tighten belts
│   ├─→ Check frame screws
│   └─→ Stabilize printer on solid surface
│   │
│   Speed too high for acceleration?
│   └─→ Reduce print speed 20%
│
├─→ Layer shifting (misaligned layers)
│   │
│   Belts loose?
│   ├─→ Tighten X and Y belts
│   │
│   Speed too high?
│   ├─→ Reduce speed 20%
│   │
│   Acceleration too high?
│   ├─→ Reduce to 500mm/s²
│   │
│   Stepper drivers overheating?
│   ├─→ Check cooling
│   └─→ Reduce current if possible
│   │
│   Part came loose and shifted?
│   └─→ Check first layer adhesion
│
└─→ Z-seam visible (line on surface)
    │
    Seam placement set?
    ├─→ User specified (hide in corner)
    ├─→ Random (distributed around)
    │
    Retraction on layer change?
    └─→ Enable in slicer
```

---

### Quick Fixes Priority:

**#1 - Temperature**
```
Run temp tower to find sweet spot
Too hot = strings, blobs
Too cold = rough surface
```

**#2 - Retraction**
```
Direct Drive: 1-2mm at 40-50mm/s
Bowden: 5-7mm at 40-60mm/s
See: Retraction Guide
```

**#3 - Flow Rate**
```
Over-extrusion = blobs, rough
Under-extrusion = gaps, weak
Single-wall test to verify
```

**#4 - Mechanical Issues**
```
Tighten belts (should "twang" when plucked)
Check all screws/bolts
Stabilize printer
```

**#5 - Speed/Acceleration**
```
Quality prints: 40-50mm/s, 500mm/s² accel
Reduce both for better quality
```

**Related Guides:**
- Temperature Tuning Guide
- Retraction Calibration Guide
- Flow Rate Calibration Guide

---

## 📏 Dimensional Accuracy

### Flowchart:

```
Part Dimensions Wrong?
│
├─→ All dimensions too large
│   │
│   Over-extrusion?
│   └─→ Calibrate flow rate
│       Single-wall test
│       See: Flow Rate Guide
│
├─→ All dimensions too small
│   │
│   Under-extrusion?
│   ├─→ Calibrate E-steps
│   └─→ Calibrate flow rate
│
├─→ Only horizontal (XY) dimensions wrong
│   │
│   XY compensation needed?
│   ├─→ Measure error
│   ├─→ Add XY compensation in slicer
│   │   (typically -0.1 to -0.2mm)
│   │
│   Belt tension?
│   └─→ Check X and Y belts tight
│
├─→ Only vertical (Z) dimension wrong
│   │
│   Z-steps incorrect?
│   ├─→ Verify Z-steps value (M503)
│   │   Should match lead screw pitch
│   │   Your Ender 5 Plus: 800 steps/mm
│   │   Your Ender 3 Max: 400 steps/mm
│   │
│   Z-binding?
│   └─→ Check Z-axis moves smoothly
│       Clean/lube lead screw
│
├─→ Holes too small
│   │
│   Use horizontal hole compensation
│   ├─→ Slicer setting
│   ├─→ +0.1 to +0.2mm typical
│   │
│   OR design with teardrop holes
│   └─→ Prevents overhangs in holes
│
└─→ First layer larger (elephant's foot)
    │
    Z-offset too low?
    ├─→ Raise Z-offset +0.05mm
    │
    First layer temp too high?
    ├─→ Reduce by 5°C
    │
    Elephant's foot compensation?
    └─→ Enable in slicer (0.1-0.2mm)
```

---

### Quick Fixes Priority:

**#1 - E-Steps & Flow**
```
E-steps FIRST (firmware)
Then flow rate (slicer)
These affect ALL dimensions
```

**#2 - Steps/mm Verification**
```
Check with M503
X/Y: Usually 80 or 100
Z: Depends on lead screw (400 or 800)
E: Calibrated value (420-430 typical)
```

**#3 - XY Compensation**
```
Measure 20mm cube
If measures 20.2mm → Set XY comp to -0.1mm
Available in most slicers
```

**#4 - Hole Compensation**
```
Holes print smaller due to material squish
Add 0.1-0.2mm hole compensation
Or design oversized in CAD
```

**#5 - Elephants Foot**
```
Z-offset slightly too low
Enable compensation in slicer
Reduce first layer temp
```

**Related Guides:**
- Flow Rate Calibration Guide
- Firmware Configuration Backup Guide

---

## 🕷️ Stringing and Oozing

### Flowchart:

```
Stringing Problem?
│
Temperature optimized?
├─→ NO → Run temp tower FIRST!
│       Lower temp usually helps
│       See: Temperature Tuning Guide
│
└─→ YES
    │
    Retraction calibrated?
    ├─→ NO → Calibrate retraction
    │       See: Retraction Guide
    │       │
    │       Direct Drive: Start 1mm
    │       Bowden: Start 5mm
    │
    └─→ YES, but still stringing
        │
        What material?
        │
        ├─→ PLA
        │   ├─→ Lower temp -5°C
        │   ├─→ Increase retraction +0.5mm
        │   └─→ Increase retraction speed +5mm/s
        │
        ├─→ PETG (strings more than PLA!)
        │   ├─→ Lower temp -10°C from optimal
        │   ├─→ Dry filament! (wet = worse stringing)
        │   ├─→ Increase retraction slightly
        │   ├─→ Enable Z-hop 0.3mm
        │   └─→ Accept some stringing (normal for PETG)
        │
        ├─→ TPU
        │   ├─→ Minimal retraction! (0.5-1mm max)
        │   ├─→ Lower temp -5°C
        │   └─→ Slow speeds (25mm/s)
        │
        └─→ Other
            │
            Filament dry?
            ├─→ NO → Dry filament!
            │       Wet = more oozing
            │
            Travel distance settings?
            ├─→ Minimum travel: 2mm
            ├─→ Combing mode: Within infill
            │
            Wiping enabled?
            └─→ Enable wipe on retract
                1-2mm wipe distance
```

---

### Quick Fixes Priority:

**#1 - Temperature (MOST IMPORTANT)**
```
Lower by 5-10°C from current
Run temp tower to find sweet spot
Hotter = more oozing/stringing
```

**#2 - Retraction Distance**
```
Direct Drive:
  Start: 1mm
  Increase: +0.5mm if still stringing
  Max: 3mm (don't exceed!)

Bowden:
  Start: 5mm
  Increase: +1mm if needed
  Max: 8mm
```

**#3 - Retraction Speed**
```
Start: 40-45mm/s
Increase: +5mm/s if needed
Too fast = grinding
```

**#4 - Dry Filament**
```
Wet filament = worse stringing
Especially PETG and Nylon
Listen for popping = definitely wet
```

**#5 - Z-Hop**
```
Enable Z-hop: 0.2-0.3mm
Helps prevent dragging through strings
Especially useful for PETG
```

**Related Guides:**
- Temperature Tuning Guide
- Retraction Calibration Guide
- Filament Storage & Drying Guide

---

## 🔗 Layer Adhesion Issues

### Flowchart:

```
Layers Separating/Weak?
│
Temperature too low?
├─→ YES → Increase by 5-10°C
│       Run temp tower
│       See: Temperature Tuning Guide
│
└─→ NO
    │
    Cooling too aggressive?
    ├─→ Reduce fan speed 10-20%
    │   PLA: Can use 100%
    │   PETG: Max 50%
    │   ABS: 0-30%
    │
    Part cooling fan on first layers?
    └─→ Disable for first 3-5 layers
    │
    Under-extrusion?
    ├─→ Check flow rate
    │   See: Flow Rate Guide
    │
    Filament wet?
    ├─→ Dry filament
    │   Moisture = weak layers
    │   See: Filament Storage Guide
    │
    Layer height too thick?
    ├─→ Max 80% of nozzle diameter
    │   0.4mm nozzle → 0.32mm max layer
    │
    Print speed too fast?
    └─→ Reduce by 20%
        Allows better layer bonding
```

---

### Quick Fixes Priority:

**#1 - Temperature**
```
Too cold = weak layer bonds
Test by increasing 5-10°C
Should be at higher end of range for strength
```

**#2 - Cooling**
```
Too much cooling = weak layers
Reduce fan speed
Disable for first layers
```

**#3 - Extrusion**
```
Under-extrusion = weak bonds
Check E-steps
Check flow rate
Ensure consistent extrusion
```

**#4 - Filament Quality**
```
Wet filament = brittle, weak
Old filament = degraded
Cheap filament = inconsistent
```

**#5 - Speed**
```
Too fast = insufficient bonding time
Reduce speed 20%
Especially for functional parts
```

**Related Guides:**
- Temperature Tuning Guide
- Flow Rate Calibration Guide
- Filament Storage & Drying Guide

---

## 🏗️ Support Problems

### Flowchart:

```
Support Issue?
│
├─→ Supports not sticking to bed
│   │
│   Add support brim?
│   ├─→ Enable in slicer
│   │   3-5mm brim on supports
│   │
│   Support base too narrow?
│   └─→ Increase base width
│       Tree supports: increase trunk diameter
│
├─→ Supports fuse to model (can't remove)
│   │
│   Z-distance too small?
│   ├─→ Increase from 0.2mm to 0.3mm
│   │   Or even 0.4mm for PETG
│   │
│   Support interface enabled?
│   ├─→ Enable support roof
│   │   Creates clean separation
│   │
│   PETG sticking too well?
│   └─→ This is normal for PETG!
│       Use tree supports
│       Increase Z-distance to 0.4mm
│
├─→ Overhang still sagging
│   │
│   Support density too low?
│   ├─→ Increase from 15% to 20%
│   │
│   Z-distance too large?
│   ├─→ Reduce from 0.3mm to 0.2mm
│   │
│   Support pattern wrong?
│   └─→ Try different pattern (grid vs lines)
│
├─→ Supports using too much material
│   │
│   Use tree supports!
│   ├─→ 30-50% less material
│   │   Much easier removal
│   │
│   Support density too high?
│   ├─→ Reduce to 10-15%
│   │
│   Overhang angle too conservative?
│   └─→ Increase from 45° to 50-55°
│       Generate less support
│
└─→ Support marks on surface
    │
    This is somewhat normal
    │
    Minimize by:
    ├─→ Using tree supports
    ├─→ Increasing Z-distance
    ├─→ Enabling support interface
    ├─→ Designing to hide support areas
    │
    Post-process:
    └─→ Sand marks smooth
        Filler primer if needed
```

---

### Quick Fixes Priority:

**#1 - Use Tree Supports**
```
Much better than normal supports
Easier removal
Less material
Fewer contact points
Available in Cura, PrusaSlicer
```

**#2 - Z-Distance**
```
Too close = fuses to model
Too far = poor support
Start: 0.2mm (1 layer)
PETG: 0.3-0.4mm
```

**#3 - Support Interface**
```
Enable support roof
Dense layer between support and model
Much cleaner separation
```

**#4 - Support Density**
```
Start: 15%
Increase if sagging: 20%
Decrease if too hard to remove: 10%
```

**#5 - Placement**
```
"Touching build plate" usually sufficient
Don't use "Everywhere" unless needed
Less support = easier removal
```

**Related Guides:**
- Support Material Guide

---

## 📐 Warping and Lifting

### Flowchart:

```
Warping/Lifting Problem?
│
First layer adhesion good initially?
│
├─→ NO → Fix first layer first!
│       See: First Layer section above
│
└─→ YES (lifts after initial layers)
    │
    What material?
    │
    ├─→ ABS (warps easily!)
    │   │
    │   Do you have enclosure?
    │   ├─→ NO → Need enclosure!
    │   │       Or switch to PLA/PETG
    │   │
    │   └─→ YES
    │       ├─→ Bed temp: 100°C
    │       ├─→ No part cooling fan
    │       ├─→ Use hairspray
    │       ├─→ Add brim (10mm)
    │       └─→ Avoid drafts
    │
    ├─→ PLA (shouldn't warp much)
    │   │
    │   Part cooling too aggressive?
    │   ├─→ Disable fan first 5 layers
    │   ├─→ Reduce max fan to 80%
    │   │
    │   Drafts hitting print?
    │   ├─→ Block airflow
    │   │   Close windows
    │   │   Move printer away from vents
    │   │
    │   Sharp corners on part?
    │   └─→ Add "mouse ears" (circles in corners)
    │       Add 10mm brim
    │       Round sharp corners in design
    │
    └─→ PETG (moderate warping)
        │
        Bed temp adequate?
        ├─→ Increase to 80°C
        │
        Part cooling on too early?
        ├─→ Disable first 5-10 layers
        │   Max 50% fan after
        │
        Large flat surface?
        └─→ Add brim (8-10mm)
            Use textured PEI
            Glue stick on smooth PEI
```

---

### Quick Fixes Priority:

**#1 - Bed Temperature**
```
Keep bed hot entire print!
PLA: 60°C
PETG: 75-80°C
ABS: 95-100°C
```

**#2 - Cooling Control**
```
Disable fan first layers (5-10)
Reduce max fan speed
ABS: 0% cooling entire print
```

**#3 - Environmental Control**
```
Block all drafts
Close windows/doors
Move away from AC vents
Consider enclosure (ABS required)
```

**#4 - Adhesion Enhancement**
```
Add brim (8-10mm)
Use hairspray (ABS)
Use glue stick (PETG)
Mouse ears in sharp corners
```

**#5 - Design Modifications**
```
Round sharp corners (CAD)
Add "mouse ears" (small circles at corners)
Split large flat parts
Orient differently
```

**Related Guides:**
- First Layer Adhesion Guide

---

## 🔍 Print Defects Reference

### Visual Defect Guide:

**Stringing:**
```
Symptom: Thin strings between features
Cause: Oozing during travel
Fix: Lower temp, increase retraction
```

**Blobs/Zits:**
```
Symptom: Small blobs on surface
Cause: Over-extrusion, retraction issues
Fix: Tune retraction, check flow rate
```

**Layer Shifting:**
```
Symptom: Layers misaligned (shifted)
Cause: Belts loose, speed too high
Fix: Tighten belts, reduce speed/accel
```

**Ringing/Ghosting:**
```
Symptom: Ripples after sharp corners
Cause: Vibration, high acceleration
Fix: Reduce speed/accel, tighten frame
```

**Under-Extrusion:**
```
Symptom: Gaps in walls, weak prints
Cause: Low E-steps, low flow, clog
Fix: Calibrate E-steps, check flow
```

**Over-Extrusion:**
```
Symptom: Blobs, rough surface, too wide
Cause: High E-steps, high flow
Fix: Calibrate E-steps, reduce flow
```

**Warping:**
```
Symptom: Corners lift from bed
Cause: Cooling too fast, poor adhesion
Fix: Control cooling, increase bed temp
```

**Poor Bridging:**
```
Symptom: Sagging bridges, droopy
Cause: Temp too high, cooling low
Fix: Lower temp, increase cooling
```

**Pillowing (bad top surface):**
```
Symptom: Holes/gaps in top layers
Cause: Not enough top layers, low cooling
Fix: 5-7 top layers, 100% cooling (PLA)
```

**Elephants Foot:**
```
Symptom: First layer bulges outward
Cause: Z-offset too low, temp too high
Fix: Raise Z-offset, reduce temps
```

---

## 🚨 Emergency Troubleshooting

### Print Failing Right Now?

**Check in this order:**

**1. First Layer (0-5 layers)**
```
Not sticking?
→ Pause print
→ Adjust Z-offset with baby-stepping
→ Resume if fixed, restart if too bad
```

**2. Mid-Print Issues (5+ layers)**
```
Spaghetti mess?
→ Part came loose
→ Stop immediately
→ Check bed adhesion
→ Clean bed, increase temp, add brim

Clicking/grinding?
→ Clog or Z too low
→ Stop print
→ Check nozzle clear
→ Verify Z-offset not too aggressive

Stringing badly?
→ Wet filament or temp too high
→ May be salvageable
→ Note for next print: dry filament
```

**3. Layer Shifts**
```
Shifted mid-print?
→ Stop immediately
→ Check belts (too loose)
→ Reduce speed for retry
→ Check nothing hit printhead
```

---

### Smoke/Burning Smell?

**STOP IMMEDIATELY!**

```
1. Power off printer
2. Unplug from wall
3. Check for:
   - Hotend heater connections
   - Bed heater connections
   - Stepper driver heat
   - Burned wiring
4. Do NOT restart until issue found
5. Check with multimeter if experienced
6. Seek help if unsure
```

---

### "Everything Was Working, Now Nothing Prints!"

**Recent Change Checklist:**

```
Did you:
□ Update firmware?
  → Restore EEPROM backup
  → See: Firmware Backup Guide

□ Change nozzle?
  → Re-calibrate Z-offset
  → Run first layer test

□ Change filament brand/type?
  → Dry filament
  → Adjust temperature
  → Check flow rate

□ Move printer?
  → Re-level bed
  → Check all connections
  → Verify stable surface

□ Change any slicer settings?
  → Revert to known-good profile
  → Check start G-code intact

□ Nothing changed?
  → Filament wet (common for PETG)
  → Nozzle partial clog (do cold pull)
  → Bed dirty (clean thoroughly)
```

---

## 📊 Diagnostic Priority Matrix

### When Multiple Issues Present:

**Fix in this order:**

```
1. SAFETY (smoke, burning)
   → Stop immediately

2. MECHANICAL (loose belts, wobbles)
   → Fix before any settings

3. CALIBRATION (E-steps, Z-offset)
   → Foundation for everything else

4. MATERIAL (wet filament, wrong temp)
   → Affects all print quality

5. FINE-TUNING (retraction, flow)
   → Only after basics are correct
```

---

## ✅ Systematic Troubleshooting Checklist

### When Nothing Seems to Work:

**Start from scratch:**

```
□ Mechanical Check
  □ All screws/bolts tight?
  □ Belts tensioned properly?
  □ Bed moves smoothly?
  □ No binding on any axis?
  □ Stable surface?

□ Bed Leveling
  □ Manual level with paper
  □ Run mesh leveling (UBL/ABL)
  □ Verify mesh active (M420 S1)

□ Basic Calibration
  □ PID tune hotend (M303 E0 S210 C8)
  □ PID tune bed (M303 E-1 S60 C8)
  □ Calibrate E-steps (100mm test)
  □ Calibrate Z-offset (paper method)
  □ Save settings (M500)

□ Material Check
  □ Filament dry? (especially PETG/Nylon)
  □ Correct temperature? (temp tower)
  □ Good quality filament?
  □ Proper storage?

□ Slicer Settings
  □ Correct material profile?
  □ Flow rate: 100% (starting point)
  □ Retraction: defaults for your setup
  □ First layer speed: 20mm/s
  □ Bed temp correct for material?

□ Test Print
  □ Print calibration cube
  □ Measure dimensions
  □ Check surface quality
  □ Verify layer adhesion

□ Document
  □ What worked
  □ What settings used
  □ Save profile
  □ Update backups
```

---

## 🎯 Quick Reference Card

### "My Print Failed - What Do I Check?"

**Top 5 Most Common Issues:**

```
1. Z-Offset Wrong (50% of problems)
   → First layer not sticking
   → Fix: Adjust Z-offset
   
2. Bed Not Level (20% of problems)
   → One area good, others bad
   → Fix: Re-level bed manually + mesh

3. Wet Filament (15% of problems)
   → Popping sounds, rough surface
   → Fix: Dry filament

4. Wrong Temperature (10% of problems)
   → Stringing OR under-extrusion
   → Fix: Run temp tower

5. Flow Rate Wrong (5% of problems)
   → Dimensions off, weak prints
   → Fix: Calibrate E-steps + flow
```

---

### Speed Reference Guide:

```
First Layer:     20 mm/s  (always slow!)
Quality Print:   40-50 mm/s
Standard Print:  60 mm/s
Speed Print:     80-100 mm/s (quality suffers)

Acceleration:
Quality:         500 mm/s²
Standard:        1000 mm/s²
Speed:           1500 mm/s²
```

---

### Temperature Quick Reference:

```
Material | Nozzle      | Bed    | Fan
---------|-------------|--------|--------
PLA      | 200-215°C   | 60°C   | 100%
PLA+     | 205-220°C   | 60°C   | 100%
PETG     | 230-245°C   | 75°C   | 30-50%
ABS      | 235-245°C   | 95°C   | 0-30%
ASA      | 240-250°C   | 95°C   | 0-30%
TPU      | 220-230°C   | 50°C   | 0-20%
Nylon    | 240-260°C   | 80°C   | 20-40%
```

---

### Retraction Quick Reference:

```
Direct Drive (Your Ender 5 Plus, Ender 3 Max):
  Distance: 1.0-2.0mm
  Speed: 40-50mm/s
  
Bowden:
  Distance: 5-7mm
  Speed: 40-60mm/s

Never exceed:
  Direct Drive: 3mm
  Bowden: 8mm
```

---

## 💡 Pro Troubleshooting Tips

### Tip 1: Change ONE Variable at a Time

**Bad approach:**
```
❌ Change temp + retraction + flow + speed all at once
Result: Don't know what fixed it (or made it worse)
```

**Good approach:**
```
✅ Change temperature, test print
✅ If not fixed, change retraction, test print
✅ Document what worked
```

---

### Tip 2: Keep Known-Good Profiles

**Save working settings:**
```
✅ When everything prints perfectly
✅ Save slicer profile with descriptive name
✅ Backup EEPROM settings
✅ Note filament brand/batch that worked

Result: Easy to revert when experiments fail
```

---

### Tip 3: Use Test Prints, Not Real Parts

**For troubleshooting:**
```
✅ Print small test objects (calibration cube)
✅ Fast feedback (minutes not hours)
✅ Less filament waste
✅ Easier to compare results

❌ Don't troubleshoot on important 8-hour prints!
```

---

### Tip 4: Take Photos/Videos

**Document issues:**
```
✅ Photo of failed print
✅ Video of printing (show the issue)
✅ Screenshot of slicer settings
✅ Easier to ask for help online
✅ Compare before/after changes
```

---

### Tip 5: Search Online

**Resources:**
```
✅ Reddit: r/3Dprinting, r/FixMyPrint
✅ Forums: Prusa, Ultimaker communities
✅ YouTube: Teaching Tech, CHEP, others
✅ Search: "[printer name] [problem]"

Include:
- Printer model
- Material type
- Photo of issue
- What you've tried
```

---

### Tip 6: Check The Obvious First

**Before deep troubleshooting:**
```
□ Is filament actually loaded?
□ Is nozzle actually hot?
□ Is bed actually hot?
□ Is bed clean?
□ Did you save settings? (M500)
□ Is slicer set to correct printer?
□ Did you actually send the right file?

"Works" 20% of the time!
```

---

### Tip 7: Revert to Defaults

**When lost:**
```
1. Export current settings (M503)
2. Load firmware defaults (M502)
3. Manually enter ONLY critical settings:
   - Steps/mm
   - Probe offset
   - Basic PID
4. Save (M500)
5. Test print
6. Add back features one at a time
```

---

### Tip 8: Verify Firmware Match

**Settings depend on firmware:**
```
Your Ender 5 Plus:
- Marlin 2.x
- BTT SKR Mini E3
- Check firmware version: M115

Your Ender 3 Max:
- Marlin 2.x
- Creality 4.2.2 board
- Check firmware version: M115

Wrong firmware = wrong settings!
```

---

## 🔗 Guide Cross-Reference

### When This Guide Says "See [Guide Name]":

**Available Guides in Your Repo:**

1. **Flow Rate Calibration Guide**
   - E-steps calibration
   - Single-wall cube test
   - Extrusion multiplier tuning

2. **Temperature Tuning Guide**
   - Temperature tower tests
   - Material-specific temps
   - Bridging tests

3. **Retraction Calibration Guide**
   - Distance and speed tuning
   - Direct drive vs Bowden
   - Material-specific retraction

4. **First Layer Adhesion Guide**
   - Build surface types
   - Cleaning methods
   - Adhesion aids

5. **Support Material Guide**
   - Normal vs tree supports
   - Support settings optimization
   - Removal techniques

6. **Firmware Configuration Backup Guide**
   - EEPROM backup with M503
   - Restoring settings
   - Version control

7. **Filament Storage & Drying Guide**
   - Moisture sensitivity
   - Drying methods
   - Storage solutions

---

## 📞 When to Ask for Help

### You've Done Your Part If:

```
✅ Checked all mechanical issues
✅ Verified basic calibration (E-steps, Z-offset)
✅ Tried known-good filament
✅ Reverted to default slicer profile
✅ Cleaned bed thoroughly
✅ Changed ONE thing at a time
✅ Documented what you tried
✅ Taken clear photos

Now you can confidently ask for help online!
```

---

### How to Ask for Help Online:

**Include this information:**

```
Printer: [Ender 5 Plus with Microswiss NG]
Material: [PLA, brand, color]
Slicer: [Cura 5.x / PrusaSlicer 2.x]
Temperature: [Nozzle 210°C, Bed 60°C]

Problem: [Clear description]

What I've tried:
1. [Action taken]
2. [Action taken]
3. [Action taken]

Photos: [Links to images]
G-code: [Link if relevant]

Settings (relevant ones):
- Layer height: 0.2mm
- Speed: 50mm/s
- Retraction: 1.5mm at 45mm/s
- [Other relevant settings]
```

**Better questions = Better answers!**

---

## 🎓 Troubleshooting Mindset

### Think Like a Scientist:

**1. Observe**
```
What exactly is wrong?
When does it happen?
Is it consistent or random?
```

**2. Hypothesize**
```
What could cause this?
What's the most likely cause?
Check common issues first
```

**3. Test**
```
Change one variable
Print test object
Observe results
```

**4. Document**
```
What changed?
Did it help?
What's next?
```

**5. Iterate**
```
Keep testing until solved
Learn from failures
Build knowledge base
```

---

## ✅ Final Troubleshooting Checklist

### Before Declaring Defeat:

```
□ Mechanical Issues
  □ Belts tight
  □ Frame solid
  □ Bed level
  □ Smooth movement

□ Calibration Basics
  □ E-steps: [____] (verified)
  □ Z-offset: [____] (tested)
  □ PID tuned (hotend + bed)
  □ Settings saved (M500)

□ Material Quality
  □ Filament dry
  □ Good quality brand
  □ Correct temperature
  □ Proper storage

□ Slicer Settings
  □ Correct printer profile
  □ Appropriate speeds
  □ Flow rate 95-105%
  □ Retraction tuned

□ Test Prints
  □ Calibration cube printed
  □ Dimensions measured
  □ Surface inspected
  □ Strength tested

□ Documentation
  □ Photos taken
  □ Settings recorded
  □ Changes documented
  □ Backup created
```

---

## 🎯 The Ultimate Question

### "Which Guide Should I Start With?"

**If you're setting up a new printer:**
```
1. First Layer Adhesion Guide (bed prep, Z-offset)
2. Flow Rate Calibration Guide (E-steps, flow)
3. Temperature Tuning Guide (temp tower)
4. Retraction Calibration Guide (stringing)
5. Firmware Backup Guide (save everything!)
```

**If your printer was working but now isn't:**
```
1. Check filament moisture (Storage & Drying Guide)
2. Clean bed (First Layer Adhesion Guide)
3. Verify Z-offset (Z-Offset Guide)
4. Check for firmware reset (Firmware Backup Guide)
5. Test with known-good settings
```

**If you're having specific issues:**
```
Stringing → Temperature + Retraction Guides
Weak prints → Flow Rate + Temperature Guides
Won't stick → First Layer Adhesion Guide
Warping → First Layer Adhesion Guide
Bad overhangs → Support Material Guide
Inconsistent → Storage & Drying Guide
```

---

## 🚀 Success Path

### From Beginner to Expert:

**Week 1: Basics**
```
✅ Get first successful print
✅ Master bed leveling
✅ Nail first layer adhesion
✅ Learn your printer
```

**Week 2-3: Calibration**
```
✅ Calibrate E-steps
✅ Tune flow rate
✅ Find optimal temperatures
✅ Dial in retraction
```

**Month 2: Refinement**
```
✅ Optimize for quality
✅ Optimize for speed
✅ Master support material
✅ Try new materials
```

**Month 3+: Mastery**
```
✅ Predict issues before they happen
✅ Troubleshoot quickly
✅ Help others
✅ Push limits of printer
```

---

## 💪 Troubleshooting Philosophy

### Remember:

```
"Every failed print is a learning opportunity"
- Not a waste if you learned something
- Document what went wrong
- Understand why
- Apply knowledge to next print

"Perfect prints come from perfect fundamentals"
- Master the basics first
- Don't skip calibration
- One step at a time
- Build solid foundation

"When in doubt, start simple"
- Check obvious things first
- One variable at a time
- Test with known-good materials
- Eliminate unknowns

"The printer is rarely lying"
- Symptoms point to real causes
- Trust the diagnostics
- Don't fight the machine
- Work with the physics
```

---

**Happy Troubleshooting! You've got this!** 🎉

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Hardware:** Universal (Examples from Ender 5 Plus & Ender 3 Max)  
**Covers:** All common 3D printing problems  
**Cross-References:** All 7 detailed calibration guides