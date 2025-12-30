# Enhanced Profiles Modular Refactor Plan

**Goal:** Split the monolithic `enhanced-printer-profiles.js` (1,600+ lines) into modular, maintainable tab files that work independently without requiring mapping files.

## 🎯 Architecture Overview

### **Before (Current)**
```
enhanced-printer-profiles.js (1,641 lines)
├─ Loads mapping files from assets/data/maps/
├─ 10 tab render methods (renderTab1_PrinterInfo through renderTab10_Preferences)
├─ Hardcoded HTML strings in each method
└─ "Loading mapping data..." issue when files missing
```

### **After (Target)**
```
enhanced-profiles/
├─ main.js (orchestrator, ~300 lines)
├─ tabs/
│   ├─ tab-1-printer-info.js
│   ├─ tab-2-hardware.js
│   ├─ tab-3-hotend.js
│   ├─ tab-4-bed.js
│   ├─ tab-5-probe.js
│   ├─ tab-6-motion.js
│   ├─ tab-7-advanced.js
│   ├─ tab-8-safety.js
│   ├─ tab-9-nozzles.js
│   └─ tab-10-preferences.js
└─ shared/
    ├─ database-loader.js (loads hardware databases)
    └─ ui-helpers.js (shared rendering utilities)
```

## 📋 Implementation Phases

### **Phase 1: Create Modular Tab Structure** ✅ IN PROGRESS
- [x] Create `assets/js/enhanced-profiles/` directory
- [x] Create `assets/js/enhanced-profiles/tabs/` subdirectory
- [ ] Extract Tab 1 (Printer Info) as standalone module
- [ ] Extract Tab 2 (Hardware) as standalone module
- [ ] Extract remaining 8 tabs
- [ ] Create shared utilities

### **Phase 2: Remove Mapping File Dependency**
- [ ] Remove `initRenderers()` method from main
- [ ] Remove `this.mappingData` property
- [ ] Remove mapping file fetch calls
- [ ] UI renders from hardcoded HTML only
- [ ] Store/retrieve JSON from localStorage directly

### **Phase 3: Create Optional UI Field Map**
- [ ] Document all UI element IDs
- [ ] Create `ui-field-map.json` (maps JSON paths → element IDs)
- [ ] Parser can optionally use for auto-fill
- [ ] UI doesn't depend on this file

### **Phase 4: Document JSON Schema**
- [ ] Create `profile-schema.json`
- [ ] Document all profile properties
- [ ] Add JSDoc comments to profile structure
- [ ] Enable other tools to read profile data

## 📝 Tab Module Template

Each tab file exports a module with this structure:

```javascript
/**
 * Tab [N]: [Tab Name]
 * Renders and manages [description]
 */
export const Tab[N][Name] = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (boards, drivers, etc.)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    // Return HTML string with form fields
  },
  
  /**
   * Attach event listeners for this tab
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases
   */
  attachListeners(profile, updateCallback, databases) {
    // Attach input listeners
    // Update profile object on changes
    // Call updateCallback() to trigger save/re-render
  }
};
```

## 🗂️ JSON Profile Structure

```json
{
  "id": "printer_123456",
  "name": "My Ender 5 Plus",
  "printerModel": "ender5plus",
  "firmwareType": "marlin",
  "firmwareVersion": "2.1.2.6",
  "hardware": {
    "board": "BOARD_CREALITY_V427",
    "drivers": { "x": "TMC2208", "y": "TMC2208", "z": "TMC2208", "e": "TMC2208" },
    "thermistors": { "hotend": "1", "bed": "1" },
    "display": "CR10_STOCKDISPLAY"
  },
  "temperature": {
    "hotend": { "max": 275, "pid": { "p": 22.2, "i": 1.08, "d": 114 } },
    "bed": { "max": 110, "pid": { "p": 54.0, "i": 0.72, "d": 305 } },
    "bedType": "aluminum"
  },
  "motion": {
    "steps": { "x": 80, "y": 80, "z": 400, "e": 93 },
    "maxFeedrates": { "x": 500, "y": 500, "z": 5, "e": 25 },
    "maxAccel": { "x": 500, "y": 500, "z": 100, "e": 5000 },
    "jerk": { "x": 8, "y": 8, "z": 0.4, "e": 5 }
  },
  "probe": {
    "type": "bltouch",
    "offsets": { "x": -44, "y": -6, "z": -2.5 }
  },
  "bedLeveling": {
    "type": "abl",
    "gridPoints": { "x": 5, "y": 5 },
    "fadeHeight": 10
  },
  "advanced": {
    "linearAdvance": { "enabled": true, "k": 0.08, "type": "marlin" },
    "arcSupport": true,
    "junctionDeviation": { "enabled": false, "value": 0.005 }
  },
  "safety": {
    "thermalProtection": { "hotend": true, "bed": true },
    "runaway": { "enabled": true, "period": 40, "hysteresis": 4 }
  },
  "nozzles": [],
  "preferences": {
    "slicer": "orcaslicer",
    "materials": ["PLA", "PETG", "ABS"]
  },
  "notes": "",
  "created": "2025-12-30T03:00:00.000Z",
  "modified": "2025-12-30T03:00:00.000Z"
}
```

## 🔗 Cross-Tool Data Access

Other tools can access profile data via StorageManager:

```javascript
// Get all printers
const printers = StorageManager.getPrinters();

// Get specific printer
const printer = StorageManager.getPrinter('printer_123');

// Access specific values
const esteps = printer.motion.steps.e;
const hotendMaxTemp = printer.temperature.hotend.max;
const probeType = printer.probe.type;
```

## 📦 Benefits

✅ **Maintainability**: Each tab = ~100-200 lines (vs 1,600)  
✅ **No mapping files needed**: UI works standalone  
✅ **Fast loading**: No file fetches, instant render  
✅ **Reusable data**: Other tools read same JSON  
✅ **Parser independence**: Parser outputs JSON, UI reads JSON  
✅ **Easy debugging**: Each tab isolated  

## 🚀 Migration Steps

1. ✅ Create directory structure
2. ⏳ Extract Tab 1 as proof of concept
3. Extract remaining tabs one by one
4. Update main orchestrator to import tabs
5. Remove mapping file loading code
6. Test all functionality
7. Update documentation

## 📊 Current Status

- **Phase 1**: In Progress - Creating tab modules
- **Lines Refactored**: 0 / 1,641
- **Tabs Completed**: 0 / 10

---

**Last Updated**: 2025-12-30 03:12 AM
