# Next Steps for Tab 1 Testing

## Current Status
- ✅ Tab 1 UI complete with Configuration.h upload
- ✅ Parser configured to use TH3D 2.97a core mappings
- ⏳ **WAITING**: Core mapping files need to be generated

## Missing Files (Being Fixed)
The parser is looking for these files in `assets/data/maps/th3d/TH3D UFW 2.97a/core/`:
- `th3d-config-mapping-core.json`
- `th3d-config-adv-mapping-core.json`
- `th3d-config-backend-mapping-core.json`
- `th3d-config-speed-mapping-core.json`

## How to Generate Core Files
Run the Python script from the `firmware-helper/` directory:

```bash
# For TH3D UFW 2.97a Configuration.h
python split-core-mappings.py --mapping-dir "../assets/data/maps/th3d/TH3D UFW 2.97a/full" --pattern "*-mapping-part*.json"
```

This will:
1. Read all the `-part*.json` files from the `full/` directory
2. Filter to only the ~148 core UI-relevant fields
3. Generate `-core.json` files in the same directory
4. Move the core files to the `core/` directory

## Testing Checklist (After Files Generated)

### Test 1: TH3D 2.97a with Version Specified
- [ ] Open Enhanced Profiles in browser
- [ ] Create new profile
- [ ] Set Firmware Type: TH3D Unified
- [ ] Set Firmware Version: 2.97a
- [ ] Click "Upload Configuration.h"
- [ ] Upload TH3D 2.97a files:
  - `Configuration.h`
  - `Configuration_adv.h`
  - `Configuration_backend.h`
  - `Configuration_speed.h`
- [ ] Click "Parse and Import"
- [ ] Verify:
  - ✅ No 404 errors in console
  - ✅ Success message shows field count (~148 fields expected)
  - ✅ Profile name populated
  - ✅ Basic settings appear in tabs

### Test 2: TH3D without Version (Fallback)
- [ ] Create new profile
- [ ] Set Firmware Type: TH3D Unified
- [ ] Leave Firmware Version blank
- [ ] Click "Upload Configuration.h"
- [ ] Should show confirmation dialog about using fallback
- [ ] Click OK to continue with generic mapping
- [ ] Upload files
- [ ] Verify fallback mapping works (uses default/ directory files)

### Test 3: Marlin (Standard)
- [ ] Create new profile
- [ ] Set Firmware Type: Marlin
- [ ] Upload standard Marlin Configuration.h files
- [ ] Verify marlin variant mapping works

## Expected Results

### Core Files (148 fields)
Should include only UI-relevant fields like:
- Basic info (machine name, board, etc.)
- Temperature sensors and limits
- PID settings
- Endstops and homing
- Probe configuration (including EZABL)
- Stepper drivers
- Movement (steps, feedrate, acceleration, jerk)
- Build volume
- Bed leveling
- Safety features
- Display settings

### Full Files (1,833 fields)
Contain everything including:
- All core fields
- Advanced TMC settings
- Detailed thermal protection
- Comprehensive feature flags
- Low-level hardware configuration
- Debug options
- Experimental features

## Parser Behavior

### Version Detection Logic (tab-1-printer-info.js)
```javascript
if (profile.firmwareType === 'th3d') {
  const version = profile.firmwareVersion.toLowerCase();
  if (version.includes('2.97') || version.startsWith('2.97')) {
    variant = 'th3d-2.97';  // Uses core UI fields
  } else {
    variant = 'th3d-default';  // Fallback
  }
}
```

### Parser Configuration (marlin-config-parser.js)
```javascript
'th3d-2.97': {
  name: 'TH3D UFW 2.97a (Core UI Fields)',
  basePath: 'assets/data/maps/th3d/TH3D UFW 2.97a/core/',
  files: [
    'th3d-config-mapping-core.json',
    'th3d-config-adv-mapping-core.json',
    'th3d-config-backend-mapping-core.json',
    'th3d-config-speed-mapping-core.json'
  ]
}
```

## Debugging Tips

### Console Logging
Enable parser debug mode:
```javascript
window.MarlinConfigParser.DEBUG = true;
```

### Common Issues
1. **404 errors**: Core files not generated or in wrong location
2. **0 settings imported**: File name mapping issue (config vs configAdv)
3. **Parser not a constructor**: Use factory pattern `.create(variant)`
4. **Wrong mapping used**: Check firmware type and version detection

## Success Criteria
- ✅ No console errors
- ✅ ~148 fields imported for TH3D 2.97a core
- ✅ Profile populated with basic hardware settings
- ✅ UI responsive and themed correctly
- ✅ Fallback mapping works when version not specified
- ✅ All 4 TH3D config files processed correctly

---

**Note**: Once core files are generated, we can proceed with full end-to-end testing of the Configuration.h import feature.
