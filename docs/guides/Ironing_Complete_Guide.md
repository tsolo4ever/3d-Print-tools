# 3D Print Ironing Guide
## Complete Guide to Perfect Top Surfaces

---

## 📋 Table of Contents

1. [What is Ironing?](#what-is-ironing)
2. [Why Use Ironing?](#why-use-ironing)
3. [When to Use Ironing](#when-to-use)
4. [When NOT to Use Ironing](#when-not-to-use)
5. [How Ironing Works](#how-it-works)
6. [Settings Explained](#settings-explained)
7. [Recommended Settings](#recommended-settings)
8. [Step-by-Step Setup](#step-by-step-setup)
9. [Advanced Techniques](#advanced-techniques)
10. [Troubleshooting](#troubleshooting)
11. [Before/After Examples](#examples)
12. [Quick Reference](#quick-reference)

---

## 🎯 What is Ironing?

**Ironing** is a 3D printing technique where the nozzle makes an extra pass over the top surface of your print, **melting and smoothing** the surface to create a glass-like finish.

### **The Concept:**

Think of it like ironing clothes, but for 3D prints:
- Heated nozzle passes over top layers
- Slightly melts the surface
- Fills in gaps between lines
- Creates smooth, glossy finish
- Minimal or no extrusion (just smoothing)

### **Visual Comparison:**

```
WITHOUT IRONING:
████████████████
████████████████  ← Visible layer lines
████████████████     Rough texture
████████████████     Matte finish

WITH IRONING:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Smooth surface
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     No visible lines
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     Glossy finish
```

---

## ⚡ Why Use Ironing?

### **Benefits:**

1. **✅ Smooth Top Surfaces**
   - Eliminates visible layer lines on top
   - Creates glass-like finish
   - Professional appearance

2. **✅ Better Aesthetics**
   - Text and logos look cleaner
   - Flat surfaces appear polished
   - Color appears more uniform

3. **✅ Improved Functionality**
   - Smoother surface for sliding parts
   - Better for writing surfaces
   - Easier to clean

4. **✅ Hides Imperfections**
   - Fills small gaps between lines
   - Smooths over minor artifacts
   - Conceals slight under-extrusion

5. **✅ Professional Look**
   - Retail-quality appearance
   - Looks machine-finished
   - Impressive results

### **Drawbacks:**

1. **❌ Increased Print Time**
   - Adds 10-30% to total time
   - Depends on surface area
   - Extra passes take time

2. **❌ More Filament Used**
   - Small amount (5-10%)
   - Mostly just melting existing plastic
   - Minor extrusion during ironing

3. **❌ Potential Artifacts**
   - Can create lines if settings wrong
   - May show "ironing pattern"
   - Requires tuning

4. **❌ Not for All Materials**
   - Works best with PLA
   - Can be tricky with PETG
   - May not work with flexible filaments

---

## 🎨 When to Use Ironing

### **Perfect Use Cases:**

#### ✅ **1. Decorative Items**
- Figurines and statues
- Display pieces
- Awards and trophies
- Ornaments

**Why:** Appearance is everything, smooth finish looks professional

---

#### ✅ **2. Parts with Text or Logos**
- Nameplates
- Badges
- Signage
- Branded items

**Why:** Makes text more readable, looks engraved rather than printed

---

#### ✅ **3. Flat-Topped Objects**
- Coasters
- Trays
- Boxes with lids
- Desk organizers

**Why:** Large flat surfaces benefit most from smoothing

---

#### ✅ **4. Gifts and Presentation Items**
- Presents for others
- Items for display
- Show pieces
- Portfolio samples

**Why:** First impressions matter, smooth finish looks premium

---

#### ✅ **5. Functional Parts with Sliding Surfaces**
- Drawer fronts
- Sliding lids
- Moving components
- Parts that touch other surfaces

**Why:** Smooth surface reduces friction, improves function

---

#### ✅ **6. Parts to be Painted**
- Pre-finishing for painting
- Models for painting
- Prototypes

**Why:** Smooth base = better paint finish

---

#### ✅ **7. Writing Surfaces**
- Desk accessories
- Pen holders with flat tops
- Whiteboard-style surfaces
- Labels

**Why:** Smoother surface for markers/labels

---

## 🚫 When NOT to Use Ironing

### **Don't Use Ironing For:**

#### ❌ **1. Mechanical/Functional Parts**
- Gears
- Brackets
- Mounting hardware
- Load-bearing parts

**Why:** 
- Wastes time (appearance doesn't matter)
- Slightly weakens top layer
- No functional benefit

---

#### ❌ **2. Parts Without Top Surfaces**
- Vase mode prints
- Hollow objects
- Parts printed vertically
- Items with no horizontal top layers

**Why:** Nothing to iron!

---

#### ❌ **3. Prototype/Draft Prints**
- Quick tests
- Dimensional checks
- Fit tests
- Rough drafts

**Why:** Wastes time, appearance doesn't matter yet

---

#### ❌ **4. Flexible Filaments (TPU)**
- Flexible parts
- Soft grips
- Rubber-like prints

**Why:** 
- Nozzle drags too much
- Can deform part
- Results are poor

---

#### ❌ **5. Large Industrial Parts**
- Big utilitarian items
- Parts that will be hidden
- One-off shop fixtures

**Why:** Time cost not worth it

---

#### ❌ **6. Parts with Complex Top Geometry**
- Lots of holes on top
- Complex support structures on top
- Intricate patterns

**Why:** 
- Nozzle gets caught
- May damage features
- Poor results

---

#### ❌ **7. Speed-Critical Prints**
- Rush jobs
- Quick replacements
- Time-sensitive prints

**Why:** Adds significant time (10-30%)

---

## 🔧 How Ironing Works

### **The Process:**

```
NORMAL TOP LAYER:
Step 1: Print final top layer
Step 2: Done!

Result:
████ ████ ████ ████
████ ████ ████ ████  ← Visible gaps
████ ████ ████ ████     between lines

WITH IRONING:
Step 1: Print final top layer
Step 2: Nozzle returns to start
Step 3: Makes EXTRA passes at lower Z
Step 4: Melts surface with minimal extrusion
Step 5: Smooths everything

Result:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Gaps filled
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     Smooth surface
```

### **What Happens:**

1. **Top Solid Layers Print Normally**
   - Regular infill pattern
   - Normal extrusion
   - Standard spacing

2. **Ironing Pass Begins**
   - Nozzle returns to starting corner
   - Moves in tight zigzag pattern
   - Stays at same Z height (or slightly lower)

3. **Minimal Extrusion**
   - Only 10-20% of normal flow
   - Just enough to help smoothing
   - Mostly melting existing plastic

4. **Heat Transfer**
   - Hot nozzle melts top layer
   - Plastic flows into gaps
   - Surface becomes uniform

5. **Result**
   - Glossy, smooth finish
   - No visible layer lines
   - Professional appearance

---

## ⚙️ Settings Explained

### **In SuperSlicer:**

**Location:** `Print Settings` → `Infill` → `Ironing`

---

### **1. Enable Ironing**

```
Ironing: ☐ Disabled
         ☑ Top surfaces only
         ☐ All solid surfaces
```

**Options:**

- **Disabled:** No ironing (default)
- **Top surfaces only:** ⭐ Recommended - Only irons horizontal top surfaces
- **All solid surfaces:** Irons all solid infill (too much, rarely needed)

**Recommendation:** **Top surfaces only**

---

### **2. Ironing Type**

```
Ironing type: ☐ Top
              ☑ All solid layers
```

**Options:**

- **Top:** Only the very top layer
- **All solid layers:** All top solid infill

**Recommendation:** **Top** (faster, usually sufficient)

---

### **3. Flow Rate (Most Important!)**

```
Ironing flowrate: 15%
```

**What it does:**
- Controls how much plastic is extruded during ironing
- Lower = less plastic, more smoothing
- Higher = more plastic, can create texture

**Range:**
- **10-12%:** Very smooth, risk of gaps
- **15%:** ⭐ Recommended starting point
- **20%:** More plastic, slight texture
- **25%+:** Too much, defeats purpose

**Your Current:** 15% ✅ Perfect!

---

### **4. Ironing Speed**

```
Ironing speed: 50% (of normal print speed)
```

**What it does:**
- Speed of ironing passes
- Slower = more heat transfer, smoother
- Faster = less time, may be rougher

**Range:**
- **30-40%:** Very slow, maximum smoothness
- **50%:** ⭐ Recommended balance
- **60-70%:** Faster, still decent
- **80%+:** Too fast, poor results

**Recommendation:** **50%** of your normal top solid infill speed

---

### **5. Ironing Spacing**

```
Ironing spacing: 0.1mm
```

**What it does:**
- Distance between ironing passes
- Smaller = more passes = smoother (slower)
- Larger = fewer passes = faster (rougher)

**Range:**
- **0.05mm:** Maximum smoothness, very slow
- **0.1mm:** ⭐ Recommended balance
- **0.15mm:** Faster, slight lines may show
- **0.2mm+:** Too wide, visible pattern

**Recommendation:** **0.1mm** (quarter of nozzle diameter)

**Rule of Thumb:** Spacing = Nozzle Diameter ÷ 4
- 0.4mm nozzle → 0.1mm spacing
- 0.6mm nozzle → 0.15mm spacing
- 0.8mm nozzle → 0.2mm spacing

---

### **6. Ironing Angle**

```
Ironing angle: -1 (automatic)
           or: 45° (manual)
```

**What it does:**
- Direction of ironing pattern
- -1 = automatic (perpendicular to top layer)
- Manual angle = specific direction

**Options:**
- **-1 (Auto):** ⭐ Recommended - Slicer chooses best angle
- **0°:** Horizontal passes
- **45°:** Diagonal passes
- **90°:** Vertical passes

**Recommendation:** **-1** (automatic)

---

### **7. Ironing Acceleration (Advanced)**

```
Ironing acceleration: 0 (use default)
                  or: Custom value
```

**What it does:**
- How quickly nozzle speeds up during ironing
- 0 = uses default print acceleration

**Recommendation:** **0** (use default)

---

## 📊 Recommended Settings

### **🌟 Universal Starting Settings (All Printers):**

```
╔══════════════════════════════════════════════╗
║           RECOMMENDED IRONING SETTINGS       ║
╚══════════════════════════════════════════════╝

Ironing: Top surfaces only ✅
Ironing type: Top
Ironing flowrate: 15%
Ironing speed: 50%
Ironing spacing: 0.1mm
Ironing angle: -1 (automatic)
Ironing acceleration: 0
```

**These work for 90% of prints!**

---

### **⚙️ Settings by Material:**

#### **PLA (Best Results)**
```
Flowrate: 15%
Speed: 50%
Spacing: 0.1mm
Notes: Works perfectly, easiest material
```

#### **PETG (Tricky)**
```
Flowrate: 10-12% ⚠️ Lower!
Speed: 40-50%
Spacing: 0.1mm
Notes: 
  - Flows more than PLA
  - Reduce flowrate or it's too shiny/messy
  - May string more
  - Consider disabling for PETG
```

#### **ABS**
```
Flowrate: 15%
Speed: 50%
Spacing: 0.1mm
Notes: Works well, keep enclosure closed
```

#### **TPU (Not Recommended)**
```
Don't use ironing with flexible filaments!
Results are poor and can damage print.
```

---

### **⚙️ Settings by Nozzle Size:**

#### **0.4mm Nozzle** ⭐ Your Standard
```
Flowrate: 15%
Speed: 50%
Spacing: 0.1mm
Notes: Perfect for detailed work
```

#### **0.6mm Nozzle**
```
Flowrate: 15%
Speed: 50%
Spacing: 0.15mm (larger spacing)
Notes: Slightly faster than 0.4mm
```

#### **0.8mm Nozzle**
```
Flowrate: 15-20%
Speed: 50%
Spacing: 0.2mm (larger spacing)
Notes: 
  - Larger contact area
  - Can go slightly faster
  - May need more flow
```

#### **1.0mm Nozzle**
```
Flowrate: 20%
Speed: 50-60%
Spacing: 0.25mm
Notes: Fast but less detailed ironing
```

---

### **⚙️ Settings by Print Quality:**

#### **Maximum Quality (Show Pieces)**
```
Flowrate: 12-15%
Speed: 40%
Spacing: 0.08mm
Notes: 
  - Slowest but smoothest
  - For presentation items
  - May add 30%+ print time
```

#### **Balanced (Recommended)**
```
Flowrate: 15%
Speed: 50%
Spacing: 0.1mm
Notes: 
  - Best time/quality ratio
  - Use this for 90% of prints
  - Adds ~15% print time
```

#### **Fast (Good Enough)**
```
Flowrate: 18%
Speed: 60%
Spacing: 0.15mm
Notes: 
  - Still much better than no ironing
  - Faster results
  - Adds ~10% print time
```

---

## 📝 Step-by-Step Setup in SuperSlicer

### **Method 1: Enable for Specific Print**

#### **Step 1: Open Print Settings**
1. Select your print profile
2. Go to `Print Settings` tab

#### **Step 2: Navigate to Ironing**
```
Print Settings → Infill → Ironing (section)
```

#### **Step 3: Enable Ironing**
```
☑ Ironing: Top surfaces only
```

#### **Step 4: Set Parameters**
```
Ironing type: Top
Ironing flowrate: 15%
Ironing speed: 50%
Ironing spacing: 0.1mm
Ironing angle: -1
Ironing acceleration: 0
```

#### **Step 5: Slice and Preview**
- Slice your model
- Use layer slider to see top layers
- Ironing passes show as different color
- Check time estimate increase

#### **Step 6: Print!**

---

### **Method 2: Create "Ironing" Profile**

**Better approach for frequent use!**

#### **Step 1: Duplicate Existing Profile**
1. Right-click current print profile
2. Select "Duplicate"
3. Rename to: "0.20mm NORMAL - WITH IRONING"

#### **Step 2: Enable Ironing in New Profile**
Follow steps from Method 1

#### **Step 3: Save Profile**
- Profile is saved automatically
- Now available in dropdown

#### **Step 4: Use When Needed**
- Select ironing profile for show pieces
- Select normal profile for functional parts
- Easy toggle!

---

### **Method 3: Per-Object Ironing (Advanced)**

**Enable ironing for specific objects only!**

#### **Step 1: Right-Click Object**
In the 3D view:
1. Right-click object
2. Select "Add Settings" → "Ironing"

#### **Step 2: Enable for This Object**
```
Object-specific settings panel appears
☑ Ironing: Top surfaces only
```

#### **Step 3: Set Parameters**
Same settings as before, but ONLY for this object

**Use Case:**
- Multi-object print
- Only some objects need ironing
- Saves time!

---

## 🎓 Advanced Techniques

### **Technique 1: Variable Ironing Speed**

**Problem:** Some areas need more smoothing than others

**Solution:** Use different speeds

```
Main surfaces: 50% speed
Detailed areas: 40% speed
Large flat areas: 60% speed
```

**How:** 
- Use per-object settings
- Or create multiple profiles

---

### **Technique 2: Ironing Only Top Layer**

**Default** irons all top solid layers.

**Optimization:** Only iron the very top layer

```
Ironing type: Top (not "All solid layers")
```

**Benefit:** Faster, nearly identical results

---

### **Technique 3: Post-Ironing Pass**

**Problem:** Minor imperfections remain

**Solution:** Manual post-process

**Steps:**
1. Heat nozzle to print temp
2. Move nozzle over surface manually
3. Let it hover and melt surface
4. Move slowly by hand

**Use:** For small touch-ups only

---

### **Technique 4: Ironing Pattern Direction**

**Problem:** Visible ironing lines at certain angles

**Solution:** Change ironing angle

```
For text: 45° diagonal
For logos: 0° horizontal
For circles: -1 automatic
```

**Test different angles** to see what looks best!

---

### **Technique 5: Combine with Modifier Meshes**

**Advanced:** Iron only specific regions

**Steps:**
1. Add modifier mesh (cube/cylinder)
2. Position over area to iron
3. Right-click modifier
4. Enable ironing for modifier only

**Use Case:** 
- Logo on larger part
- Specific flat area
- Saves time!

---

## 🐛 Troubleshooting

### **Problem 1: Visible Ironing Lines**

**Symptoms:**
- Can see the ironing pattern
- Looks striped or ribbed
- Not actually smooth

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Spacing too wide** | Reduce to 0.08mm or 0.1mm |
| **Flowrate too high** | Reduce to 12-15% |
| **Speed too fast** | Reduce to 40-50% |
| **Angle poor for geometry** | Try different angle (45° or 0°) |

---

### **Problem 2: Gaps/Holes in Surface**

**Symptoms:**
- Small holes in ironed surface
- Under-extruded appearance
- Not filling in properly

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Flowrate too low** | Increase to 18-20% |
| **Top layers insufficient** | Increase top solid layers to 5-7 |
| **Speed too fast** | Reduce speed to 40% |
| **Temperature too low** | Increase temp 5-10°C |

---

### **Problem 3: Too Glossy/Wet Look**

**Symptoms:**
- Surface looks melted
- Too shiny
- Slightly blobby

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Flowrate too high** | Reduce to 10-12% |
| **Temperature too high** | Reduce temp 5°C |
| **Speed too slow** | Increase to 60% |
| **PETG material** | PETG is naturally glossy, reduce flow to 10% |

---

### **Problem 4: Stringing During Ironing**

**Symptoms:**
- Strings between ironed areas
- Wisps on surface
- Not clean

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Retraction disabled** | Enable retraction for ironing |
| **PETG material** | Reduce temperature 5-10°C |
| **Flowrate too high** | Reduce to 12% |

---

### **Problem 5: Nozzle Drags/Catches**

**Symptoms:**
- Nozzle scrapes surface
- Makes clicking sounds
- Damages print

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Z too low** | Increase Z-offset slightly |
| **Part warped** | Better bed adhesion, adjust first layer |
| **Nozzle too close** | Check Z-offset calibration |

---

### **Problem 6: Takes Forever**

**Symptoms:**
- Ironing adds 40%+ to print time
- Too slow

**Solutions:**
- Increase speed to 60-70%
- Increase spacing to 0.15mm
- Only iron top layer (not all solid layers)
- Use "Fast" preset

---

### **Problem 7: No Visible Improvement**

**Symptoms:**
- Looks the same as without ironing
- Waste of time

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| **Top layers already smooth** | Already good quality, skip ironing |
| **Flowrate too low** | Increase to 15-18% |
| **Spacing too wide** | Reduce to 0.1mm |
| **Part cooling too high** | Reduce cooling for top layers |

---

## 📸 Before/After Examples

### **Example 1: Calibration Cube**

```
WITHOUT IRONING:
┌──────────────┐
│  ▓▒▓▒▓▒▓▒▓▒  │  ← Visible line texture
│              │     Matte finish
│     TEST     │     Rough to touch
│              │
└──────────────┘

WITH IRONING:
┌──────────────┐
│  ░░░░░░░░░░  │  ← Smooth glass-like
│              │     Glossy finish
│     TEST     │     Smooth to touch
│              │
└──────────────┘
```

**Time Difference:** +3 minutes (15% longer)
**Worth It?** ✅ Yes for display, ❌ No for testing

---

### **Example 2: Nameplate**

```
WITHOUT IRONING:
╔════════════════════╗
║ ▓▒▓ JOHN ▓▒▓▒     ║  ← Text hard to read
║ ▓▒▓▒▓▒▓▒▓▒▓▒      ║     Lines visible
╚════════════════════╝     Looks 3D printed

WITH IRONING:
╔════════════════════╗
║ ░░░ JOHN ░░░░     ║  ← Text crisp & clear
║ ░░░░░░░░░░░░░     ║     Smooth surface
╚════════════════════╝     Looks professional
```

**Time Difference:** +5 minutes (20% longer)
**Worth It?** ✅ Definitely yes!

---

### **Example 3: Coaster**

```
WITHOUT IRONING:
    ┌─────────┐
    │▓▒▓▒▓▒▓▒▓│  ← Rough texture
    │▓▒▓▒▓▒▓▒▓│     Catches spills
    │▓▒▓▒▓▒▓▒▓│     Hard to clean
    └─────────┘

WITH IRONING:
    ┌─────────┐
    │░░░░░░░░░│  ← Smooth surface
    │░░░░░░░░░│     Easy to wipe
    │░░░░░░░░░│     Looks premium
    └─────────┘
```

**Time Difference:** +8 minutes (25% longer)
**Worth It?** ✅ Yes - functional AND aesthetic benefit!

---

## 📋 Quick Reference Card

### **Print This and Keep at Your Printer!**

```
╔═══════════════════════════════════════════════════════════╗
║              IRONING QUICK REFERENCE                      ║
╚═══════════════════════════════════════════════════════════╝

WHEN TO USE:
  ✅ Display/decorative items
  ✅ Text and logos
  ✅ Gifts and presentation pieces
  ✅ Flat-topped objects
  ❌ Mechanical/functional parts
  ❌ Prototypes and drafts
  ❌ Flexible filaments

STANDARD SETTINGS (Start Here):
  Ironing: Top surfaces only
  Type: Top
  Flowrate: 15%
  Speed: 50%
  Spacing: 0.1mm
  Angle: -1 (auto)

BY MATERIAL:
  PLA:  15% flow, 50% speed ✅ Best results
  PETG: 10% flow, 40% speed ⚠️ Tricky
  ABS:  15% flow, 50% speed ✅ Works well
  TPU:  Don't use! ❌

BY NOZZLE:
  0.4mm: 0.10mm spacing
  0.6mm: 0.15mm spacing
  0.8mm: 0.20mm spacing
  1.0mm: 0.25mm spacing

QUALITY PRESETS:
  Maximum:  12% flow, 40% speed, 0.08mm space
  Balanced: 15% flow, 50% speed, 0.10mm space ⭐
  Fast:     18% flow, 60% speed, 0.15mm space

TROUBLESHOOTING:
  Lines visible → Reduce spacing to 0.08mm
  Gaps/holes → Increase flow to 18-20%
  Too glossy → Reduce flow to 10-12%
  Stringing → Reduce temp 5°C, flow to 12%
  Too slow → Increase speed to 60%, space to 0.15mm

TIME IMPACT:
  Adds 10-30% to print time
  Depends on top surface area
  Worth it for display items!

LOCATION IN SUPERSLICER:
  Print Settings → Infill → Ironing

═══════════════════════════════════════════════════════════
             REMEMBER: START WITH DEFAULTS!
              Test on small object first
═══════════════════════════════════════════════════════════
```

---

## 🎯 Decision Tree

```
START: Should I use ironing?
    │
    ├─→ Is it decorative/display? 
    │   └─→ YES → ✅ Use ironing
    │   └─→ NO → Continue
    │
    ├─→ Does it have text/logos?
    │   └─→ YES → ✅ Use ironing
    │   └─→ NO → Continue
    │
    ├─→ Is appearance important?
    │   └─→ YES → ✅ Use ironing
    │   └─→ NO → Continue
    │
    ├─→ Is it a gift/presentation item?
    │   └─→ YES → ✅ Use ironing
    │   └─→ NO → Continue
    │
    ├─→ Is it mechanical/functional?
    │   └─→ YES → ❌ Skip ironing
    │   └─→ NO → Continue
    │
    ├─→ Is it a prototype/draft?
    │   └─→ YES → ❌ Skip ironing
    │   └─→ NO → Continue
    │
    ├─→ Am I in a rush?
    │   └─→ YES → ❌ Skip ironing (adds 10-30% time)
    │   └─→ NO → ✅ Consider ironing
    │
    └─→ Is it flexible filament (TPU)?
        └─→ YES → ❌ Never use ironing
        └─→ NO → ✅ Safe to use ironing
```

---

## 💡 Pro Tips

### **Tip 1: Test on Small Object First**
Before ironing a large print, test settings on a small calibration cube. This saves time if settings need adjustment.

### **Tip 2: Increase Top Layers**
For best ironing results, use **5-7 top solid layers** instead of default 4. This gives ironing more material to work with and prevents gaps.

### **Tip 3: Disable Part Cooling for Top Layers**
Reduce or disable part cooling fan for final 2-3 layers before ironing. This helps ironing melt surface better.

**In SuperSlicer:**
```
Filament Settings → Cooling → Advanced
Slow down if layer time < 15s
Disable fan for layers: 2-3 from top
```

### **Tip 4: Material-Specific Temps**
For ironing, consider increasing temp 5°C above normal:
- PLA: 200°C → 205°C
- PETG: 235°C → 240°C (but reduce flow!)
- ABS: 240°C → 245°C

### **Tip 5: Combine with Vase Mode**
For vase mode prints, ironing the top rim makes it look amazing! Enable ironing with vase mode for professional-looking vases.

### **Tip 6: Post-Process with Heat Gun**
For ultimate smoothness, lightly pass heat gun over ironed surface from 6-8 inches away. Only for PLA! Don't melt your print.

### **Tip 7: Multiple Ironing Passes**
For ultra-smooth finish, you can modify G-code to iron twice. Advanced technique but yields incredible results.

### **Tip 8: Ironing + Vapor Smoothing**
For ABS prints, iron first, then vapor smooth. Best of both worlds - mechanical smoothness + chemical smoothness.

### **Tip 9: Document Your Settings**
Keep notes of successful ironing settings per material/nozzle combo. Saves trial-and-error later.

### **Tip 10: Preview Carefully**
Always use layer preview in slicer to verify ironing is applied where expected. Sometimes settings don't apply as intended.

---

## 📊 Settings Comparison Chart

### **Time vs Quality Trade-offs:**

| Setting | Time Added | Quality | Best For |
|---------|------------|---------|----------|
| **Disabled** | 0% | Base quality | Functional parts |
| **Fast** | +10% | Good | Quick improvements |
| **Balanced** ⭐ | +15-20% | Excellent | Most prints |
| **Maximum** | +30-40% | Perfect | Show pieces |

### **Material Compatibility:**

| Material | Works? | Difficulty | Flowrate | Notes |
|----------|--------|------------|----------|-------|
| **PLA** | ✅✅✅ | Easy | 15% | Best results |
| **PLA+** | ✅✅✅ | Easy | 15% | Excellent |
| **PETG** | ✅⚠️ | Tricky | 10-12% | Reduce flow! |
| **ABS** | ✅✅ | Moderate | 15% | Keep enclosure closed |
| **ASA** | ✅✅ | Moderate | 15% | Similar to ABS |
| **Nylon** | ✅ | Hard | 12-15% | Test carefully |
| **TPU** | ❌ | Impossible | N/A | Don't use |
| **PETG CF** | ✅ | Moderate | 12% | Like PETG |
| **Wood Fill** | ✅✅ | Easy | 15-18% | Looks great! |

---

## ✅ Checklist for Perfect Ironing

### **Before Enabling Ironing:**

- [ ] Print actually needs smooth top surface
- [ ] Not a functional/mechanical part
- [ ] Using PLA, ABS, or PETG (not TPU)
- [ ] Have extra 10-30% print time available
- [ ] Top solid layers set to 5-7
- [ ] Normal print settings working well

### **Settings to Configure:**

- [ ] Ironing enabled: "Top surfaces only"
- [ ] Ironing type: "Top"
- [ ] Flowrate: 15% (adjust per material)
- [ ] Speed: 50% (of normal print speed)
- [ ] Spacing: 0.1mm (or nozzle ÷ 4)
- [ ] Angle: -1 (automatic)

### **First Print with Ironing:**

- [ ] Test on small object first
- [ ] Monitor first few layers with ironing
- [ ] Check for stringing
- [ ] Check for nozzle dragging
- [ ] Inspect surface quality
- [ ] Adjust settings if needed

### **After Print:**

- [ ] Compare to non-ironed version
- [ ] Document successful settings
- [ ] Note time increase
- [ ] Decide if worth it for this print type

---

## 🎓 University-Level Explanation

### **The Physics of Ironing:**

**Heat Transfer:**
- Nozzle at 200°C+ contacts top surface
- Heat conducts into plastic
- Plastic reaches glass transition temperature (Tg)
- Becomes malleable without fully melting

**Surface Tension:**
- Molten plastic has surface tension
- Wants to minimize surface area
- Flows into gaps between lines
- Creates smooth, continuous surface

**Minimal Material Addition:**
- 10-15% flow adds just enough material
- Helps bridge small gaps
- Prevents creating excess material
- Acts as "filler" for tiny voids

**Solidification:**
- Nozzle moves away
- Plastic cools below Tg
- Solidifies in smooth configuration
- Retains glossy finish

### **Why It Works Better Than Post-Processing:**

- **Controlled temperature:** Nozzle temp is precise
- **Even application:** Consistent pressure and speed
- **No chemicals:** Unlike vapor smoothing
- **No sanding:** Mechanical smoothing without abrasives
- **Integrated process:** Happens during print

---

## 🎯 Final Recommendations

### **For Your Ender 5 Plus:**

**Standard Ironing Profile:**
```
═══════════════════════════════════════
ENDER 5 PLUS - IRONING SETTINGS
═══════════════════════════════════════

Material: PLA
Nozzle: 0.4mm

Ironing: Top surfaces only ✅
Type: Top
Flowrate: 15%
Speed: 50% (of 40mm/s = 20mm/s actual)
Spacing: 0.1mm
Angle: -1
Acceleration: 0

Top Solid Layers: 5-7
Temperature: 205°C (5° higher than normal)

Expected Time Add: +15-20%
═══════════════════════════════════════
```

### **When to Use:**
- ✅ Display pieces
- ✅ Gifts
- ✅ Items with text
- ✅ Flat-topped objects

### **When to Skip:**
- ❌ Functional brackets
- ❌ Prototypes
- ❌ Hidden parts
- ❌ Speed-critical prints

---

**Remember:** Ironing is a finishing technique, not a fix for poor print quality. Get your basics right first (E-steps, Z-offset, temp, flow) before adding ironing!

---

**Guide Version:** 1.0  
**Created:** October 2025  
**Printer:** Ender 5 Plus | Micro Swiss NG Direct Drive  
**Tested Materials:** PLA, PETG, ABS  
**Your Current Settings:** Disabled (ready to enable when needed!)
