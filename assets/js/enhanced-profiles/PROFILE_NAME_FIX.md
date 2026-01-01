# Profile Name Field Fix

## Problem
User reported: "Custom name field is still not pulling into the field"

The profile name field (`tab1_profileName`) was not being populated when importing TH3D Configuration.h files.

## Root Cause
TH3D firmware uses **`USER_PRINTER_NAME`** as the primary define for custom printer names (not `CUSTOM_MACHINE_NAME` like standard Marlin).

The core mapping file had:
- ✅ `CUSTOM_MACHINE_NAME` → `tab1_profileName` (in Configuration_backend.h)
- ❌ `USER_PRINTER_NAME` → **NO UI MAPPING** (in Configuration.h)

## Solution
Added missing UI field mapping to `USER_PRINTER_NAME`:

**File:** `assets/data/maps/th3d/TH3D UFW 2.97a/core/th3d-config-mapping-core.json`

```json
"userPrinterName": {
  "mapsFrom": ["USER_PRINTER_NAME"],
  "type": "string",
  "required": true,
  "fileLocation": "Configuration.h",
  "lineNumber": 282,
  "examples": ["\"Maxy\""],
  "uiFieldId": "tab1_profileName"  // ← ADDED THIS LINE
}
```

## TH3D Firmware Behavior
TH3D has TWO ways to define custom printer names:

1. **Configuration.h:** `#define USER_PRINTER_NAME "Maxy"`
   - Primary method, user-friendly name
   - Now maps to: `tab1_profileName` ✅

2. **Configuration_backend.h:** `#define CUSTOM_MACHINE_NAME USER_PRINTER_NAME`
   - References the USER_PRINTER_NAME variable
   - Already mapped to: `tab1_profileName` ✅

## Parser Behavior
The parser will now:
1. Extract `USER_PRINTER_NAME` from Configuration.h
2. Store metadata with `uiFieldId: "tab1_profileName"`
3. Make it available in staging data for UI population

## Testing
To verify the fix works:

1. Import a TH3D Configuration.h file that contains:
   ```c
   #define USER_PRINTER_NAME "Maxy"
   ```

2. Check staging data in localStorage:
   ```javascript
   // Should now include:
   {
     "other_2.userPrinterName": {
       "defineName": "USER_PRINTER_NAME",
       "uiFieldId": "tab1_profileName",
       "value": "Maxy"
     }
   }
   ```

3. The profile name field should be ready for auto-population (Phase 2)

## Related Files
- **Core Mapping:** `assets/data/maps/th3d/TH3D UFW 2.97a/core/th3d-config-mapping-core.json`
- **Backend Mapping:** `assets/data/maps/th3d/TH3D UFW 2.97a/core/th3d-config-backend-mapping-core.json`
- **Parser:** `assets/js/marlin-config-parser.js`
- **UI Tab:** `assets/js/enhanced-profiles/tabs/tab-1-printer-info.js`

## Status
✅ **Fixed:** USER_PRINTER_NAME now has UI field mapping
✅ **Both paths mapped:** USER_PRINTER_NAME and CUSTOM_MACHINE_NAME → tab1_profileName
⏳ **Next:** Implement Phase 2 (automatic UI field population from staging data)

## Field Count Issue
Also fixed in previous commit:
- ❌ Was showing ~1,174 fields (counting all nested properties)
- ✅ Now shows accurate count (~19 staging fields with metadata)
