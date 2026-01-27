# Tab 1 Implementation Plan

**Date:** December 31, 2025  
**Focus:** Get Tab 1 (Printer Info) fully functional before moving to other tabs

---

## 🎯 Tab 1 Goals

Tab 1 should handle:
1. ✅ Profile name input (DONE)
2. ✅ Firmware type selection (DONE)
3. ✅ Firmware version input (DONE)
4. ✅ Printer database search with autocomplete (DONE)
5. ⏳ Configuration.h file upload (NEEDS IMPLEMENTATION)
6. ⏳ Drag and drop for Configuration.h (NEEDS IMPLEMENTATION)
7. ⏳ M503 paste (STUB - low priority)
8. ⏳ EEPROM backup import (STUB - low priority)

---

## 📋 Implementation Checklist for Tab 1

### Phase 1: Configuration.h Upload (High Priority)
- [ ] Add import methods to Tab1PrinterInfo module
  - [ ] `showConfigUpload()` - display file upload UI
  - [ ] `handleConfigUpload(files)` - process uploaded files
  - [ ] `parseConfigFiles(files)` - call MarlinConfigParser
  - [ ] `applyParsedData(parsed)` - update profile with parsed data

### Phase 2: Drag and Drop (High Priority)
- [ ] Add drag and drop zone to render() HTML
- [ ] Style drop zone in CSS
- [ ] Add event listeners in attachListeners()
  - [ ] dragover - highlight zone
  - [ ] dragleave - unhighlight zone
  - [ ] drop - process files

### Phase 3: Parser Integration
- [ ] Call window.MarlinConfigParser (existing)
- [ ] Handle single file (Marlin)
- [ ] Handle multiple files (TH3D)
- [ ] Show progress/loading indicator
- [ ] Display success message with field count
- [ ] Handle errors gracefully

### Phase 4: Polish (Medium Priority)
- [ ] Add file validation (.h extension only)
- [ ] Show selected file names before parse
- [ ] Add "Clear" button to reset file selection
- [ ] Add help text explaining TH3D vs Marlin differences

### Phase 5: Stubs (Low Priority - Future)
- [ ] Add M503 paste button (stub with "coming soon" alert)
- [ ] Add EEPROM backup button (stub with "coming soon" alert)

---

## 📝 Notes for Other Tabs

### Tab 2 (Hardware)
**Note:** When Configuration.h is imported, hardware data will be in parsed result:
- `parsed.hardware.motherboard` → Tab 2 board dropdown
- `parsed.hardware.thermistors` → Tab 2 thermistor dropdowns
- **Action needed:** Tab 2 should read from profile.hardware on render

### Tab 3 (Hotend)
**Note:** Temperature data from parser:
- `parsed.temperature.hotend.max` → Tab 3 max temp field
- `parsed.hardware.thermistors.hotend` → Tab 3 thermistor dropdown
- **Action needed:** Tab 3 should read from profile.temperature and profile.hardware

### Tab 4 (Bed)
**Note:** Bed data from parser:
- `parsed.bedSize` → Tab 4 bed dimensions
- `parsed.temperature.bed` → Tab 4 bed temp settings
- **Action needed:** Tab 4 should read from profile.bedSize and profile.temperature.bed

### Tab 6 (Motion)
**Note:** Motion data from parser:
- `parsed.motion.steps` → Tab 6 steps/mm fields
- `parsed.motion.maxFeedrates` → Tab 6 feedrate fields
- `parsed.motion.maxAccel` → Tab 6 acceleration fields
- **Action needed:** Tab 6 should read from profile.motion

---

## 🔧 Technical Details

### Context Methods Available to Tab 1

From main orchestrator:
```javascript
context = {
  renderCurrentTab: () => {...},     // Re-render current tab
  switchTab: (tabNum) => {...},      // Navigate to another tab
  onProfileUpdate: () => {...},      // Mark profile modified
  autofillFromPrinterDatabase: (printer) => {...},  // Already working
  databases: {...},                  // Hardware databases
  currentProfile: {...}              // Direct profile access
}
```

### Profile Structure (relevant to Tab 1)

```javascript
profile = {
  // Tab 1 owns these:
  id: 'printer_123',
  name: 'My Printer',
  printerModel: 'ENDER3_V2',
  firmwareType: 'marlin',
  firmwareVersion: '2.1.2.6',
  
  // Tab 1 imports affect these (other tabs own them):
  hardware: { board, drivers, thermistors, display },
  temperature: { hotend, bed },
  motion: { steps, maxFeedrates, maxAccel, jerk },
  bedSize: { x, y, z },
  probe: { type, offsets },
  // etc.
}
```

### Parsing Flow

```
User uploads Configuration.h
    ↓
Tab1.handleConfigUpload(files)
    ↓
window.MarlinConfigParser.parseMultipleFiles(files)
    ↓
Tab1.applyParsedData(parsed)
    ↓
Update profile.hardware, profile.motion, etc.
    ↓
context.onProfileUpdate()  // Mark modified
    ↓
context.renderCurrentTab()  // Refresh Tab 1
    ↓
User navigates to other tabs to see imported data
```

---

## 🎨 UI Mockup

```
┌─────────────────────────────────────────────────┐
│ 📋 Printer Information                          │
├─────────────────────────────────────────────────┤
│ Profile Name: [_My Ender 5 Plus__________]      │
│ Firmware Type: [Marlin ▼]                      │
│ Firmware Version: [2.1.2.6_____________]        │
├─────────────────────────────────────────────────┤
│ 🔍 Printer Database                              │
│ Search: [Start typing printer name...____]      │
├─────────────────────────────────────────────────┤
│ 📥 Import Settings                               │
│                                                  │
│ [📄 Upload Configuration.h] [📋 M503] [💾 EEPROM]│
│                                                  │
│ ┌───────────────────────────────────────────┐   │
│ │  🎯 Or drag Configuration.h files here    │   │
│ │                                           │   │
│ └───────────────────────────────────────────┘   │
│                                                  │
│ Selected files:                                  │
│ ✅ Configuration.h (45.2 KB)                     │
│ ✅ Configuration_adv.h (38.7 KB)                 │
│                                                  │
│          [⚡ Parse and Import]                   │
└─────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria for Tab 1

- [ ] All basic fields work (name, firmware, version)
- [ ] Printer search autocomplete works
- [ ] File upload button works
- [ ] Drag and drop works
- [ ] Files are validated (.h only)
- [ ] Parser is called correctly
- [ ] Profile is updated with parsed data
- [ ] Success message shows field count
- [ ] Errors are handled gracefully
- [ ] Can navigate to other tabs to see imported data
- [ ] No console errors

---

## 🚀 Next Steps

1. Add import methods to tab-1-printer-info.js
2. Add CSS for drop zone
3. Test with example Configuration.h files
4. Verify data appears in other tabs
5. Document any issues for other tabs
6. Mark Tab 1 as ✅ COMPLETE
7. Move to Tab 2

---

**Let's build Tab 1's import functionality now!**
