# JSON Validation Report
**Date:** 12/22/2025, 6:36 AM

## Summary
- **Total JSON files:** 33
- **✓ Valid files:** 30
- **❌ Invalid/Empty files:** 2
- **⚠️ Files that caused freezing:** 1

---

## ✓ Valid Files (30)

| File Name | Status | Keys/Items |
|-----------|--------|------------|
| bed-probes.json | ✓ OK | 6 keys |
| build-surfaces.json | ✓ OK | 5 keys |
| calibration-procedures.json | ✓ OK | 5 keys |
| communication-settings.json | ✓ OK | 10 keys |
| displays.json | ✓ OK | 1 keys |
| eeprom-settings.json | ✓ OK | 9 keys |
| endstops.json | ✓ OK | 5 keys |
| error-codes.json | ✓ OK | 4 keys |
| extruder-types.json | ✓ OK | 7 keys |
| fans.json | ✓ OK | 5 keys |
| features.json | ✓ OK | 5 keys |
| filaments.json | ✓ OK | 5 keys |
| heaters.json | ✓ OK | 6 keys |
| Hotends.json | ✓ OK | 1 keys |
| input-shaping.json | ✓ OK | 9 keys |
| kinematics.json | ✓ OK | 6 keys |
| leveling-types.json | ✓ OK | 8 keys |
| linear-advance.json | ✓ OK | 9 keys |
| marlin-boards-V2.json | ✓ OK | 1 keys |
| marlin-boards.json | ✓ OK | 1 keys |
| memory-estimation.json | ✓ OK | 8 keys |
| motors-steppers.json | ✓ OK | 4 keys |
| pin-mappings.json | ✓ OK | 7 keys |
| printer-profiles.json | ✓ OK | 2 keys |
| safety-features.json | ✓ OK | 12 keys |
| slicer-profiles.json | ✓ OK | 9 keys |
| stepper-drivers.json | ✓ OK | 1 keys |
| thermistors-V2.json | ✓ OK | 4 keys |
| thermistors.json | ✓ OK | 1 keys |
| validation-rules.json | ✓ OK | 6 keys |

---

## ❌ Invalid/Empty Files (2)

1. **Split me up please.json**
   - Error: Expecting value: line 1 column 1 (char 0)
   - Status: EMPTY FILE

2. **stepper-drivers-V2.json**
   - Error: Expecting value: line 1 column 1 (char 0)
   - Status: EMPTY FILE

---

## ⚠️ Files That Caused Freezing (1)

1. **gcode-reference.json**
   - Issue: File appears to be too large and caused the validation process to freeze
   - Recommendation: Manually inspect this file or use a JSON validator with better performance for large files

---

## Recommendations

1. **Fix or remove empty files:**
   - `Split me up please.json`
   - `stepper-drivers-V2.json`

2. **Investigate gcode-reference.json:**
   - This file may be corrupted or too large
   - Consider splitting it into smaller files if it's a valid JSON
   - Use a different tool to validate (e.g., online JSON validator, VS Code JSON formatter)

3. **Validation tool created:**
   - `validate_single.py` - Use this to validate individual JSON files without freezing
   - Usage: `python validate_single.py <filename.json>`
