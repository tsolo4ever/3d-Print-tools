# SharePoint Nozzle Selection Guide - Planning Document

## Project Overview
**Status:** ✅ Phase 1 Complete - Core Infrastructure Built  
**Last Updated:** December 20, 2024  
**Version:** 2.0 (Major Upgrade)

---

## 🎯 Project Goals

Transform the Nozzle Selection Guide into an advanced interactive tool with:
1. **EEPROM Analysis** - Parse M503 and OctoPrint backups
2. **Global Printer Profiles** - Shared across all tools in the suite
3. **Smart Recommendations** - Based on actual hardware capabilities
4. **Profile Generation** - Export optimized slicer profiles
5. **Interactive Calculators** - Flow rates, print times, costs

---

## ✅ Completed Features (Phase 1)

### 1. Global Infrastructure
- ✅ **Enhanced StorageManager** (`assets/js/storage-manager.js`)
  - Extended printer profile schema with EEPROM data
  - Hotend configuration tracking
  - PID tuning status
  - Nozzle inventory management
  - Slicer preference tracking
  - Backward compatible with legacy profiles
  - Auto-migration for existing profiles

- ✅ **EEPROM Parser** (`assets/js/eeprom-parser.js`)
  - Parses M503 command output
  - Parses OctoPrint EEPROM backups (.zip)
  - Extracts all critical settings:
    - Max feedrates (X/Y/Z/E)
    - Max accelerations
    - Jerk settings
    - E-steps
    - PID values (hotend & bed)
    - Linear Advance K factor
    - Z-offset
    - Bed size
    - Bed leveling type
  - Intelligent validation with warnings
  - Detects common calibration issues

### 2. Hotend Database
- ✅ **Hotend Specs** (`SharePoint_Nozzle_Selection_Guide/data/hotends.json`)
  - 15 common hotends included:
    - Stock Creality variants
    - Micro Swiss (All-Metal, NG Direct Drive)
    - E3D (V6, Volcano, Revo series)
    - Dragon (Standard & High Flow)
    - Dragonfly BMS
    - Mosquito & Mosquito Magnum
    - Phaetus Rapido
    - Copperhead
  - Heater type tracking (Cartridge, Ceramic, High-Flow)
  - Max flow rates
  - Temperature limits
  - Retraction recommendations
  - Material compatibility

### 3. Calculator System
- ✅ **Nozzle Calculator** (`SharePoint_Nozzle_Selection_Guide/js/nozzle-calculator.js`)
  - Volumetric flow rate calculations
  - Hotend compatibility checking
  - Layer height range recommendations
  - Print time estimation
  - Material usage calculations
  - Cost analysis (material + energy)
  - Multi-nozzle comparison
  - Retraction calculation (Direct Drive vs Bowden)
  - Strength comparison between nozzles

### 4. Slicer Templates
- ✅ **Profile Templates** (`SharePoint_Nozzle_Selection_Guide/templates/`)
  - Cura profile template
  - PrusaSlicer config bundle template
  - SuperSlicer config bundle template
  - OrcaSlicer profile template (ZIP)
  - Ready for profile generation

### 5. Documentation
- ✅ **Firmware Helper** (`firmware-helper/README.md`)
  - Guide for storing Marlin configuration files
  - Reference for common firmware values
  - Examples for extracting settings
  - Future parser integration planned

---

## 📋 Current Schema: Extended Printer Profile

```javascript
{
  // Legacy Fields (preserved for compatibility)
  id: "printer_12345",
  name: "My Ender 5 Plus",
  esteps: 415,
  extruder: "Micro Swiss NG DD",
  notes: "Custom notes",
  created: "2024-12-20T...",
  modified: "2024-12-20T...",
  
  // New Extended Fields
  printerModel: "Creality Ender 5 Plus",
  firmwareVersion: "Marlin 2.0.9.3",
  
  // Hotend Configuration
  hotend: {
    type: "micro-swiss-ng-dd",        // ID from hotend database
    heaterType: "cartridge",          // cartridge | ceramic | high-flow | custom
    maxFlow: 15,                      // mm³/s
    maxTemp: 300,                     // °C
    pidTuned: true,                   // Has PID been tuned?
    pidValues: { p: 22, i: 1.08, d: 114 }  // PID values if available
  },
  
  // Extruder Type
  extruderType: "direct",             // direct | bowden
  
  // EEPROM Data
  eeprom: {
    maxFeedrate: { x: 500, y: 500, z: 5, e: 25 },
    maxAccel: { x: 500, y: 500, z: 100, e: 5000 },
    jerk: { x: 8, y: 8, z: 0.4, e: 5 },
    esteps: 415,
    pidHotend: { p: 22, i: 1.08, d: 114 },
    pidBed: { p: 54, i: 0.72, d: 948 },
    linearAdvance: 0.1,
    zOffset: -1.67,
    bedSize: { x: 350, y: 350, z: 400 },
    bedLevelingType: "UBL"
  },
  
  // Nozzle Inventory
  nozzles: [
    { size: 0.4, material: "brass", installed: true },
    { size: 0.6, material: "brass", installed: false },
    { size: 0.8, material: "hardened", installed: false }
  ],
  
  // Preferences
  preferredSlicer: "superslicer",      // superslicer | cura | prusaslicer | orcaslicer
  commonMaterials: ["PLA", "PETG", "TPU"]
}
```

---

## 🚧 In Progress (Phase 2)

### Profile Generator System
- [ ] Profile scrubber to sanitize templates
- [ ] Template parser for each slicer format
- [ ] Dynamic value replacement engine
- [ ] Export functionality for all 4 slicers
- [ ] Validation before export

### Interactive UI Components
- [ ] EEPROM upload interface (drag & drop + text paste)
- [ ] Hotend selector with visual specs
- [ ] Nozzle comparison calculator UI
- [ ] Print time/cost calculator UI
- [ ] Smart wizard for nozzle selection
- [ ] Warning/validation display system

### Integration
- [ ] Link to E-Steps Calculator (when suspicious values detected)
- [ ] Link to Flow Calibration (when flow issues found)
- [ ] Link to PID Tuning (when PID not configured)

---

## 📅 Planned Features (Phase 3)

### Advanced Features
- [ ] Visual nozzle size comparison tool
- [ ] Interactive decision tree
- [ ] Material-specific recommendations
- [ ] Abrasive material warnings (brass vs hardened)
- [ ] Print quality predictor
- [ ] Speed optimization calculator

### Profile Management
- [ ] Profile comparison tool
- [ ] Profile sharing (export/import)
- [ ] Cloud sync option (optional)
- [ ] Community profile repository
- [ ] Version control for profiles

### Mobile Support
- [ ] Responsive design optimization
- [ ] Touch-friendly interface
- [ ] Offline functionality
- [ ] Progressive Web App (PWA)

---

## 🏗️ Technical Architecture

### File Structure
```
SharePoint_Nozzle_Selection_Guide/
├── index.html                    # Main guide (existing content)
├── README.md                     # Project overview
├── PLANNING.md                   # This file
├── css/
│   ├── calculator.css           # [TODO] Calculator styles
│   ├── wizard.css               # [TODO] Wizard styles
│   └── profile-manager.css      # [TODO] Profile UI styles
├── js/
│   ├── nozzle-calculator.js     # ✅ Flow/time/cost calculations
│   ├── wizard.js                # [TODO] Interactive wizard
│   ├── profile-generator.js     # [TODO] Slicer export
│   ├── profile-scrubber.js      # [TODO] Template sanitizer
│   └── ui-controller.js         # [TODO] UI management
├── data/
│   └── hotends.json             # ✅ Hotend database
└── templates/
    ├── Cura.curaprofile         # ✅ Cura template
    ├── PrusaSlicer_config_bundle.ini    # ✅ PrusaSlicer template
    ├── SuperSlicer_config_bundle.ini    # ✅ SuperSlicer template
    └── *.orca_printer.zip       # ✅ OrcaSlicer template

assets/ (Global - Root Level)
├── js/
│   ├── storage-manager.js       # ✅ Enhanced with extended schema
│   ├── eeprom-parser.js         # ✅ M503 & OctoPrint parser
│   ├── printer-profiles.js      # Existing UI component
│   └── navigation.js            # Existing navigation
└── css/
    ├── base.css                 # Global theme system
    ├── navigation.css           # Navigation styles
    └── printer-profiles.css     # Profile UI styles

firmware-helper/ (Root Level - Future Tool)
└── README.md                    # ✅ Documentation for future features
```

### Data Flow
```
1. User uploads EEPROM (M503 or OctoPrint backup)
   ↓
2. EEPROMParser extracts all settings
   ↓
3. Validation warnings generated
   ↓
4. User selects hotend from database
   ↓
5. Profile saved to StorageManager (global)
   ↓
6. Calculator uses profile for recommendations
   ↓
7. User selects nozzle size
   ↓
8. Profile Generator creates slicer config
   ↓
9. User downloads optimized profile
```

---

## 🎯 User Workflow (Planned)

### First-Time Setup
1. **Upload EEPROM** → Parse and validate
2. **Review Warnings** → Address critical issues
3. **Select Hotend** → Choose from database or custom
4. **Configure Basics** → Extruder type, nozzles, materials
5. **Save Profile** → Stored globally for all tools

### Using the Tool
1. **Select Active Profile** → Choose printer
2. **Choose Tool**:
   - 🧙 Wizard → Answer questions, get recommendation
   - ⏱️ Time & Cost → Compare nozzle sizes
   - 💧 Flow Rate → Check hotend compatibility
   - 📤 Export Profile → Generate slicer config
   - 📚 Guide → Reference documentation

### Profile Export
1. Select nozzle size
2. Choose quality level (draft/normal/high)
3. Select material type
4. Review generated settings
5. Download for preferred slicer
6. Import into slicer software

---

## ⚠️ Known Considerations

### Template Scrubbing Needed
- Remove machine-specific IDs
- Sanitize printer names
- Clear custom G-code (keep placeholders)
- Remove absolute file paths
- Standardize placeholder values

### Validation Required
- EEPROM value range checking
- Hotend flow vs nozzle size compatibility
- Temperature limits enforcement
- Retraction settings validation
- Bed size constraints

### Browser Compatibility
- LocalStorage for profile persistence
- FileReader API for file uploads
- Blob API for file downloads
- JSZip for OctoPrint backups (external library needed)

---

## 📊 Success Metrics

### Phase 1 (Completed)
- ✅ Global storage system extended
- ✅ EEPROM parser functional
- ✅ Calculator system built
- ✅ Hotend database created
- ✅ Template files collected

### Phase 2 (In Progress)
- [ ] Can parse 95%+ of EEPROM backups
- [ ] Accurate print time predictions (±10%)
- [ ] All 4 slicer exports functional
- [ ] Warnings catch common issues
- [ ] Faster than manual configuration

### Phase 3 (Future)
- [ ] Mobile-responsive interface
- [ ] Tool integration working
- [ ] User feedback positive
- [ ] No data loss (robust storage)
- [ ] Community adoption

---

## 🔄 Migration Path

### Existing Users
1. Existing printer profiles automatically migrated
2. Legacy fields preserved (name, esteps, extruder, notes)
3. New fields initialized with safe defaults
4. User prompted to complete profile (upload EEPROM, select hotend)
5. Old functionality remains unchanged

### New Users
1. Guided setup wizard
2. EEPROM upload encouraged but optional
3. Manual entry fallback available
4. Hotend database simplifies configuration

---

## 💡 Design Principles

1. **Non-Destructive** - Never break existing functionality
2. **Progressive Enhancement** - Basic features work without advanced setup
3. **Data Portability** - Easy export/import of profiles
4. **Privacy First** - All processing client-side
5. **Educational** - Teach users about their printers
6. **Tool Integration** - Seamless connection between calibration tools

---

## 🚀 Next Steps

### Immediate (This Session)
1. ✅ Core infrastructure complete
2. [ ] Create profile scrubber
3. [ ] Create profile generator
4. [ ] Build wizard UI
5. [ ] Update main HTML

### Short Term (Next Session)
1. [ ] Build calculator UIs
2. [ ] Add validation display
3. [ ] Create CSS styling
4. [ ] Browser testing
5. [ ] Documentation updates

### Long Term
1. [ ] Mobile optimization
2. [ ] Tool integrations
3. [ ] Community features
4. [ ] Advanced calculators
5. [ ] Video tutorials

---

## 📚 Resources & References

### APIs & Libraries
- **JSZip** - For OctoPrint backup parsing
- **LocalStorage API** - Profile persistence
- **FileReader API** - File uploads
- **Blob API** - File downloads

### Slicer Documentation
- [Cura Settings Guide](https://github.com/Ultimaker/Cura)
- [PrusaSlicer Documentation](https://help.prusa3d.com/category/prusaslicer_204)
- [SuperSlicer Docs](https://github.com/supermerill/SuperSlicer)
- [OrcaSlicer Wiki](https://github.com/SoftFever/OrcaSlicer)

### Marlin Firmware
- [Marlin Configuration](https://marlinfw.org/docs/configuration/configuration.html)
- [M503 Command Reference](https://marlinfw.org/docs/gcode/M503.html)
- [EEPROM Commands](https://marlinfw.org/docs/gcode/M500-M503.html)

---

## 🤝 Contributing

### How to Add Hotends
1. Edit `data/hotends.json`
2. Follow existing schema
3. Include all required fields
4. Test with calculator

### How to Add Templates
1. Export from slicer with generic settings
2. Scrub personal data
3. Add to `templates/` folder
4. Document format in PLANNING.md

### How to Report Issues
- Use GitHub issues
- Include EEPROM sample (sanitized)
- Describe expected vs actual behavior
- Browser and version info

---

*This planning document is a living document and will be updated as the project evolves.*
