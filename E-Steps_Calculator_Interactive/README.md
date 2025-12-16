# E-Steps Calculator Interactive v2.0 ✅

An interactive web-based calculator for calibrating 3D printer extruder steps (E-steps) with session persistence, safety warnings, and historical tracking.

## Purpose
This tool helps 3D printer users accurately calibrate their extruder steps per millimeter (steps/mm) to ensure proper filament extrusion. V2.0 adds intelligent safety features, persistent storage, and comprehensive test history tracking.

## Status
✅ **V2.0 COMPLETE** - Production Ready

### Version History
- **v2.0** ✅ - Full feature implementation (current)
  - Session persistence with auto-save
  - Enhanced safety warnings
  - Test history & statistics tracking
  - Real-time input validation
  
- **v1.0** ✅ - Base calculator
  - Interactive calculation
  - Quick presets
  - Comprehensive guide
  - Troubleshooting

## Features

### Session Persistence ⭐⭐⭐⭐⭐
- Auto-saves input values as you type
- Restores previous session on page load
- "Clear Saved Data" button for fresh start
- Tracks session timestamp

### Enhanced Safety Warnings ⭐⭐⭐⭐⭐
- Detects extreme E-steps changes (>100%, >50%)
- Alerts for high extrusion errors (>15%)
- Validates unrealistic ranges (<50, >2000)
- Confirmation dialogs with guidance
- Safety check before copying G-code

### Test History Tracking ⭐⭐⭐⭐⭐
- Stores last 10 calibration attempts
- Live statistics: Average, Tests, Consistency, Std Deviation
- "Use Average Value" button
- Delete individual tests or clear all history
- Date/time tracking for each test

### Enhanced Input Validation ⭐⭐⭐⭐
- Real-time validation as you type
- Color-coded feedback (green/orange/red)
- Field-specific validation messages
- Visual indicators for valid, warning, and invalid states

## Files
- `index.html` - Complete V2.0 implementation (all features integrated)
- `Estepscals V2.0 Detailed.md` - Detailed implementation guide
- `ROADMAP.md` - Future roadmap for V2.5+
- `README.md` - This file

## Usage
1. Open `index.html` in a web browser
2. Enter your printer's current E-steps
3. Perform calibration test (100mm extrusion)
4. Enter actual extrusion measured
5. Calculator shows new E-steps with safety checks
6. Copy G-code commands to your printer
7. Previous values and history are saved automatically!

## Key Improvements in V2.0

### Data Persistence
```javascript
localStorage automatically saves:
- Current E-steps input
- Requested extrusion value
- Actual extrusion value
- Session timestamp
```

### Safety Mechanisms
```javascript
Warnings for:
✓ Extreme changes (2x or 50% of current)
✓ High error percentages (>15%)
✓ Unrealistic E-steps values
✓ Large G-code changes (>20%)
```

### Historical Tracking
```javascript
Stores last 10 tests with:
✓ Date & time
✓ Old E-steps value
✓ Actual extrusion (mm)
✓ New E-steps calculated
✓ Error percentage
✓ Individual delete or clear all
```

### Input Validation
```javascript
Real-time feedback:
✓ Green checkmark ✅ for valid values
✓ Orange warning ⚠️ for unusual values
✓ Red error ❌ for invalid input
✓ Helpful messages beneath each field
```

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Features Roadmap

### Coming in V2.5 (Visual Feedback)
- Visual gauges and progress bars
- Step-by-step wizard mode
- Results visualization

### Coming in V3.0 (Multi-Printer)
- Multi-printer profile management
- Filament database
- Export/import functionality
- Multi-firmware support

### Coming in V3.5+ (Mobile & Integration)
- PWA offline support
- Mobile optimization
- OctoPrint integration
- Multi-language support

See `ROADMAP.md` for complete future plans.

## Technical Details

### No External Dependencies
- Pure HTML/CSS/JavaScript
- Works offline
- No build process required
- Single file deployment

### Storage
```javascript
// Session Storage
localStorage key: 'esteps_calculator_v2'
{
  currentEsteps: "425.0",
  requestedExtrusion: "100",
  actualExtrusion: "97",
  timestamp: 1702728000000
}

// History Storage
localStorage key: 'esteps_history_v2'
Array of last 10 tests with full data
```

### Real-Time Validation
```javascript
// Input validation rules
currentEsteps: 50-2000 range (yellow warning outside)
requestedExtrusion: 100mm standard (yellow warning for others)
actualExtrusion: Compares to requested, flags >15% error
```

## Support & Contributing
- Report issues via GitHub
- Suggestions welcome
- V2.0 is production-ready, stable

## Version v2.0 Features Checklist
- ✅ Session persistence (localStorage)
- ✅ Auto-save on input changes
- ✅ Page load restoration
- ✅ Clear saved data button
- ✅ Safety warnings (extreme changes, high errors, unrealistic ranges)
- ✅ Confirmation dialogs with guidance
- ✅ Test history storage (last 10)
- ✅ History statistics display
- ✅ Average calculation & std deviation
- ✅ "Use Average Value" button
- ✅ Delete individual tests
- ✅ Clear all history
- ✅ Real-time validation
- ✅ Color-coded input feedback
- ✅ Field-specific validation messages

---

**Status:** ✅ Production Ready  
**Last Updated:** December 2025  
**Current Version:** 2.0  
**Next Version:** 2.5 (Visual Feedback)
