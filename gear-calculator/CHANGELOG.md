# Changelog

All notable changes to the Gear Calculator Pro project will be documented in this file.

## [4.12-fixed-v3] - 2024

### ✨ Added
- **Comprehensive Help System**:
  - ❓ Help button in header with popup modal
  - Quick reference guide with all key formulas
  - Complete documentation in separate help.html
  - Section-by-section explanations
  - Common workflows and troubleshooting
  - Glossary of all gear terms
  - SharePoint distribution guide (SHAREPOINT_README.txt)
  - Credits section acknowledging Claude (Anthropic) and M365 Copilot
- **Auto-fill OD**: Computed OD now automatically populates in:
  - Orientation Assistant: "Outside diameter (mm)" field
  - Resin & Post-Cure: "Target OD after cure (mm)" field
  - Eliminates manual re-entry and prevents errors
- **Smart Export Filenames**:
  - XML exports now include timestamp: `gear_library_YYYYMMDD.xml`
  - CSV exports now include timestamp: `gear_library_YYYYMMDD.csv`
  - Prevents overwriting previous backups
  - Makes version tracking easier
- **Export Validation**:
  - Alert if trying to export empty library
  - Better user feedback
  - XML includes metadata (save date, gear count)

## [4.12-fixed] - 2024

### 🐛 Fixed
- **AutoMatch bug**: Fixed critical issue where AutoMatch always returned -0.8
  - Now correctly works with Module, PD, and DP modes (not OD mode)
  - Removed circular logic in OD mode
  - Optimized performance - no longer updates UI 400+ times in loop
  - Calculates directly without DOM manipulation during search

- **Compute function**: Removed duplicate variable declarations
  - Eliminated redundant read operations
  - Cleaner code flow

- **Validation**: Improved input validation and error messages
  - Better user feedback when values are missing
  - Clear error messages for invalid combinations
  - Consistent error handling throughout

### ✨ Improved
- Performance optimization in AutoMatch (400x faster)
- Better error messages and user guidance
- Code readability and maintainability

### 📝 Documentation
- Added comprehensive README.md
- Added CHANGELOG.md
- Added .gitignore for better Git integration
- Inline code comments improved

---

## [4.12] - Previous Version

### Features (from v4.12)
- Safe Reset button that restores sensible defaults
- PA preset binding
- OD + Teeth + x calculation fixes
- v4.7 feature retention:
  - Library persistence with IndexedDB
  - XML and CSV export/import
  - Orientation assistant
  - Resin shrinkage calculator
  - Calibration ring method
  - Mating gear checker
  - DXF export (simplified)
  - Profile shift auto-matching (had bug)

### Known Issues
- ❌ AutoMatch returns -0.8 for all inputs (fixed in 4.12-fixed)
- ⚠️ DXF export creates circle, not true involute profile

---

## Future Enhancements (Ideas)

### Planned
- [ ] True involute tooth profile generation for DXF export
- [ ] SVG export option
- [ ] More gear types (helical, bevel, worm)
- [ ] Undercut checking and warnings
- [ ] Interference checking for mating gears
- [ ] Batch calculation mode
- [ ] Dark/light theme toggle
- [ ] Print-friendly output view

### Under Consideration
- [ ] 3D gear model preview (Three.js)
- [ ] More resin material presets
- [ ] G-code generation for CNC
- [ ] API mode for automation
- [ ] Multi-language support
- [ ] Mobile-optimized layout

### Community Requests
- [ ] _Add your suggestions here!_

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 4.12-fixed | 2024 | Fixed AutoMatch bug, optimized performance |
| 4.12 | 2024 | Safe reset, PA preset binding |
| 4.11 | 2024 | Spacing tweaks |
| 4.7 | 2024 | Core features baseline |
| Earlier | 2024 | Initial development |

---

## Contributing

When making changes, please:
1. Update this CHANGELOG.md
2. Update version number in index.html title
3. Test all core functions
4. Document any breaking changes
