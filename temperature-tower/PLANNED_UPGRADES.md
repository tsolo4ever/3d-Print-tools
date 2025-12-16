# Temperature Tower Generator - Planned Upgrades

**Created:** December 16, 2025  
**Status:** In Progress  
**Priority Order:** Safety → Bugs → UX → Features

---

## 🔒 PHASE 1: SAFETY & VALIDATION (CRITICAL)

### Temperature Safety
- [x] ~~**Material-specific temperature validation**~~ ✅
  - [x] ~~Define safe temp ranges per material type~~
  - [x] ~~PLA: 180-250°C~~
  - [x] ~~PETG: 220-270°C~~
  - [x] ~~ABS: 220-270°C~~
  - [x] ~~TPU: 200-250°C~~
  - [x] ~~Nylon: 240-290°C~~
  - [x] ~~Show warning icon when temps outside recommended range~~

- [x] ~~**Hard temperature limits**~~ ✅
  - [x] ~~Absolute minimum: 150°C (safety floor)~~
  - [x] ~~Absolute maximum: 300°C (safety ceiling)~~
  - [x] ~~Block generation if temps exceed hard limits~~
  - [x] ~~Show error message explaining why blocked~~

- [x] ~~**Temperature logic validation**~~ ✅
  - [x] ~~Already checks: Start temp > End temp~~ ✅
  - [x] ~~Check: Temperature steps are reasonable (1-20°C)~~
  - [x] ~~Check: Resulting sections aren't too many (>20 sections = warning)~~
  - [x] ~~Check: Resulting sections aren't too few (<2 sections = error)~~

### File Upload Safety
- [x] ~~**File validation before processing**~~ ✅
  - [x] ~~Verify file extension (.gcode, .g, .gco, .nc)~~
  - [x] ~~Check file size (warn if >50MB, block if >100MB)~~
  - [x] ~~Validate file contains G-code (check for G0/G1 commands)~~
  - [x] ~~Detect if file is binary/corrupt~~

- [x] ~~**G-code parsing safety**~~ ✅
  - [x] ~~Try-catch around file reading~~
  - [x] ~~Handle malformed G-code gracefully~~
  - [x] ~~Detect if G-code has no Z movements~~
  - [x] ~~Warn if G-code appears to be incomplete~~

---

## 🐛 PHASE 2: BUG FIXES

### Critical Bugs
- [x] ~~**Start Layer Configuration**~~ ✅
  - [x] ~~**Start Layer Input** - User specifies which layer the tower begins~~
    - [x] ~~Add "Start Layer" field (default: 1, recommended: 3-5)~~
    - [x] ~~Add "Initial Layer Height" field (e.g., 0.3mm for better adhesion)~~
    - [x] ~~Calculate proper Z-offset: `startZ = initialLayerHeight + ((startLayer - 1) × layerHeight)`~~
    - [x] ~~Ensure section Z-heights use offset-based calculation: `startZ + (sectionNum × sectionHeight)`~~
    - [x] ~~Prevents section misalignment when initial layer height differs from normal layers~~
  - [x] ~~**Temperature Fade-In Option**~~ ✅
    - [x] ~~Add checkbox: "Fade from first layer temperature"~~
    - [x] ~~Input: "Fade Length" (default: 4 layers)~~
    - [x] ~~Gradually increase from slicer's first layer temp to tower starting temp~~
    - [x] ~~Example: 220°C (first layer) → fade over 4 layers → 230°C (tower start)~~
    - [x] ~~Prevents thermal shock and improves adhesion~~

- [x] ~~**M104 vs M109 command choice**~~ ✅
  - [x] ~~Add option to use M109 (set & wait) instead of M104~~
  - [x] ~~Explain difference in UI~~
  - [x] ~~Default to M104 but allow user choice~~

- [x] ~~**Floating point Z-height precision**~~ ✅
  - [x] ~~Use tolerance for Z comparisons (±0.01mm)~~
  - [x] ~~Handle layer height variations better~~
  - [x] ~~Tested with various layer heights (0.12mm, 0.16mm, 0.28mm)~~

### Medium Priority Bugs
- [ ] **Multi-extruder support**
  - [ ] Detect if G-code uses T0/T1 commands
  - [ ] Ask which extruder to modify
  - [ ] Use M104 T0 or M104 T1 accordingly

---

## ⚠️ PHASE 3: USER EXPERIENCE IMPROVEMENTS

### Feedback & Visibility
- [ ] **Enhanced modification preview** 1
  - [ ] Show exactly where temps will be inserted
  - [ ] Display Z-heights for each section
  - [ ] Show before/after comparison

- [ ] **Progress indicators** 5
  - [ ] Loading spinner during file processing
  - [ ] Progress bar for large files
  - [ ] Estimated time remaining

- [ ] **Better error messages** 2
  - [ ] Specific error codes and explanations
  - [ ] Suggestions for fixing issues
  - [ ] Link to troubleshooting guide

### Workflow Improvements
- [ ] **Manual Modification Trigger** - Stop auto-modifying on upload
  - [ ] Remove automatic G-code modification on file upload
  - [ ] Add "Modify G-Code" button (user clicks when ready)
  - [ ] Allows users to adjust settings after uploading file
  - [ ] Prevents accidental modification with wrong settings
  - [ ] Better UX: Upload → Review Settings → Click "Modify" → Download

- [ ] **Auto-Detect Material from G-Code** - Smart material detection
  - [ ] Parse uploaded G-code for bed temp and hotend temp commands
  - [ ] Compare temps to known material profiles:
    - PLA: ~60°C bed, ~200-220°C hotend
    - PETG: ~70-80°C bed, ~230-250°C hotend
    - ABS: ~90-110°C bed, ~230-250°C hotend
    - TPU: ~40-60°C bed, ~220-230°C hotend
  - [ ] Auto-select material dropdown based on detected temps
  - [ ] Show confidence indicator: "Detected: PLA (High Confidence)"
  - [ ] User can override if detection is wrong
  - [ ] Helps prefill appropriate temp ranges

- [ ] **Undo/Reset functionality**
  - [ ] Keep original file in memory
  - [ ] "Reset" button to start over
  - [ ] "Modify Again" with different settings

- [ ] **Results visualization**
  - [ ] Highlight modified lines in G-code preview
  - [ ] Show statistics (lines modified, sections created)
  - [ ] Visual tower diagram with temp labels

---

## 🚀 PHASE 4: FEATURE ENHANCEMENTS

### Core Features
- [ ] **Max Sections Limiter** - Control tower height by limiting sections
  - [ ] Add optional "Max Sections" input field
  - [ ] Auto-truncate generated temperature array to specified limit
  - [ ] Example: 230°C → 200°C (step 5°C) = 7 sections, limit to 3 = only generates 230°C, 225°C, 220°C
  - [ ] Show info message: "Tower truncated from X sections to Y sections"
  - [ ] Use case: Quick tests without printing entire tall tower
  - [ ] Helps save time and filament when you just need to test a few temps

- [ ] **Save/Load settings** 1
  - [ ] Remember last used temperatures
  - [ ] Save material presets to localStorage
  - [ ] Quick "Use Last Settings" button

- [ ] **Reverse tower option** 2
  - [ ] Checkbox to reverse direction (low→high)
  - [ ] Useful for testing lower temps first

- [ ] **Label generation** 3 Webp or pdf user choice if pdf maybe add a Guide in the pdf for checking the finished model i will supply the image of the finished tower if needed
  - [ ] Generate printable labels for each section
  - [ ] Export as PDF or image
  - [ ] Include temp, material, section number

### Advanced Features
- [ ] **Printer profile integration** maybe use eprom dump if they have one? to add to the profile.js that saves to local
  - [ ] Use existing printer-profiles.js system
  - [ ] Load max temps from printer profile
  - [ ] Auto-validate against printer capabilities

- [ ] **Visual tower preview** - Use NC Viewer (https://ncviewer.com/)
  - [ ] Add "Preview in NC Viewer" button after G-code generation
  - [ ] Opens ncviewer.com in new tab for G-code visualization
  - [ ] User can load generated G-code file in NC Viewer
  - [ ] 3D visualization of tower sections
  - [ ] Interactive section selection and preview
  - [ ] **Attribution & Credits:**
    - [ ] Add "Powered by NC Viewer" text with link
    - [ ] Include in footer or credits section
    - [ ] Optional: Send courtesy email to NC Viewer team
  - [ ] Future: Explore direct API integration if available

- [ ] **Export test report**
  - [ ] Document which section performed best
  - [ ] Save notes per temperature
  - [ ] Generate PDF report with photos

---

## 📱 PHASE 5: MOBILE & ACCESSIBILITY

- [ ] **Mobile optimization**
  - [ ] Better touch targets for file upload
  - [ ] Responsive number inputs
  - [ ] Simplified mobile layout

- [ ] **Accessibility improvements**
  - [ ] ARIA labels for screen readers
  - [ ] Keyboard navigation support
  - [ ] High contrast mode compatibility

---

## 🧪 PHASE 6: ADVANCED FEATURES

- [ ] **Dual-tower support**
  - [ ] Modify temperature AND another parameter
  - [ ] Examples: temp + flow, temp + speed
  - [ ] Matrix testing mode

- [ ] **Custom section comments**
  - [ ] Add custom G-code per section
  - [ ] Useful for changing fan speed, etc.

- [ ] **API/Automation mode**
  - [ ] Command-line parameters
  - [ ] Batch processing multiple files

---

## 📊 Testing Checklist

### Test Cases to Verify
- [ ] PLA at recommended temps (190-220°C)
- [ ] PETG at edge of range (250-270°C)
- [ ] Extreme temps (150°C and 300°C)
- [ ] Invalid inputs (negative, non-numeric, etc.)
- [ ] Large G-code files (>10MB)
- [ ] G-code with no Z movements
- [ ] Multi-extruder G-code
- [ ] Various layer heights (0.12, 0.2, 0.28mm)
- [ ] Mobile device uploads
- [ ] Different browsers (Chrome, Firefox, Edge)

---

## 🎯 Current Focus

**NOW WORKING ON:** Phase 1 - Safety & Validation ✅ COMPLETE

**RECENTLY COMPLETED:**
1. ✅ Material-specific temperature validation with safe ranges
2. ✅ Hard temperature limits (150-300°C)
3. ✅ Temperature logic validation (steps, sections count)
4. ✅ Visual error/warning feedback system
5. ✅ Tested and verified all safety features

**NEXT UP - Phase 2:**
1. Start Layer Configuration (initial layer height, Z-offset calculation)
2. Temperature Fade-In option (gradual transition over X layers)
3. M104 vs M109 command choice
4. File upload validation & G-code parsing safety

**NEW FEATURES ADDED TO ROADMAP:**
- Max Sections Limiter (Phase 4) - Control tower height
- Start Layer with proper Z-offset calculations (Phase 2)
- Temperature Fade-In for smooth transitions (Phase 2)

---

## Notes & Decisions

- **M104 vs M109:** Default to M104 for faster transitions, but offer M109 option
- **First Layer Temp:** Need to detect and preserve slicer's first layer settings
- **File Size:** 100MB seems reasonable for browser processing
- **Validation Level:** Warn for unusual values, only block for dangerous ones
- **Bed Temperature:** REMOVED - Changing bed temp adds unnecessary variables to hotend temp testing. Temperature tower should ONLY test hotend temps. Bed temp calibration should be a separate tool (e.g., first layer calibration grid with different bed temps per box).
- **Auto-Modification:** REMOVED - Stop auto-modifying G-code on upload. Add "Modify G-Code" button so users can adjust settings first. Prevents accidental modification with wrong settings.
- **Material Detection:** Auto-detect material by comparing bed/hotend temps in uploaded G-code. Helps prefill appropriate temp ranges but user can override.
- **Priority Numbers:** Features marked with numbers (1, 2, 3, etc.) indicate implementation priority within each phase. Lower number = higher priority.

## Future Tool Ideas

- **Bed Temperature Calibration Tool** (Separate from Temperature Tower)
  - Grid of test boxes, each printed at slightly different bed temp
  - Evaluates first layer adhesion at various bed temps
  - Keeps hotend temp constant to isolate bed temp variable
  - Better approach than mixing bed + hotend temp tests

---

## 📝 Credits & Attributions

### STL Model
- **Temperature Tower STL:** "All-in-One Temperature Bridging Tower"
  - **Creator:** Tronnic on Printables.com
  - **Profile:** https://www.printables.com/@Tronnic
  - **Model Link:** https://www.printables.com/model/4667-all-in-one-temperature-bridging-tower-pla-petg-gco
  - **License:** [To be confirmed - check Printables listing]
  - **Attribution Required:** Yes - include link to creator and model
  - **Implementation:**
    - [ ] Add attribution on download button area
    - [ ] Add to footer: "STL Model by Tronnic"
    - [ ] Link directly to Printables model page
    - [ ] Consider adding creator's avatar/badge if available

### Third-Party Tools
- **G-code Visualization:** NC Viewer (https://ncviewer.com/)
  - **Attribution:** "G-code preview powered by NC Viewer"
  - **Link:** Include link to ncviewer.com
  - **Usage:** Direct linking (opens in new tab)

### Planned Credits Section on Page
- [ ] Add "Credits" or "About" section to temperature-tower page
- [ ] Include both STL creator and NC Viewer attributions
- [ ] Make links prominent and clickable
- [ ] Optional: Add "Support the creators" section

---

**Last Updated:** December 16, 2025
