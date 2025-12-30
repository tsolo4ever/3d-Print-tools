# Parser → Core Mapping → UI Field Flow Verification

## Current Flow Analysis

### 1. Parser Output Structure
The parser (`marlin-config-parser.js`) creates this structure:
```javascript
{
  basic: { /* ... */ },
  hardware: { driverX, driverY, driverZ, driverE0, thermistorHotend, thermistorBed, displayType },
  temperature: { hotendMaxTemp, bedMaxTemp, pidHotendP, pidHotendI, pidHotendD, pidBedP, pidBedI, pidBedD, bedType },
  motion: { stepsPerMM: {x, y, z, e}, maxFeedrate: {x, y, z, e}, maxAcceleration: {x, y, z, e}, jerkX, jerkY, jerkZ, jerkE },
  probe: { type, offset: {x, y, z} },
  bedLeveling: { type, gridPointsX, gridPointsY, fadeHeight },
  advanced: { linearAdvance, arcSupport },
  safety: { thermalProtectionHotend, thermalProtectionBed },
  geometry: { /* position limits */ },
  warnings: []
}
```

### 2. Core Mapping Structure
The core mapping file has:
```javascript
{
  "temperature_2": {
    "thermalProtectionHotends": {
      "mapsFrom": ["THERMAL_PROTECTION_HOTENDS"],
      "uiFieldId": "thermalProtectionHotend"
    },
    "xBedSize": {
      "mapsFrom": ["X_BED_SIZE"],
      "uiFieldId": "bedSizeX"
    }
  },
  "geometry": {
    "xMinPos": {
      "mapsFrom": ["X_MIN_POS"],
      "uiFieldId": "xMinPosition"
    }
  }
}
```

### 3. UIFieldMapper Search Logic
Current implementation searches by:
- Category hint (e.g., "temperature", "hardware", "motion")
- Field name from parser output
- **Problem**: Parser field names ≠ Core mapping field names

## Issues Identified

### ❌ Problem 1: Category Mismatch
- Core mapping uses: `temperature_2`, `temperature_3`, `geometry`
- Parser output uses: `temperature`, `motion`, `hardware`
- UIFieldMapper can't find values because category names don't match

### ❌ Problem 2: Field Name Search
UIFieldMapper searches for parser field names, but should search by `mapsFrom` define names:
```javascript
// Current (WRONG):
findValueInParsed(parsedConfig, 'X_BED_SIZE', 'geometry')
// Searches: parsedConfig.geometry['X_BED_SIZE'] ❌

// Should be (CORRECT):
// Search all categories for a field that came from define "X_BED_SIZE"
// Parser stores it as: parsedConfig.geometry.xBedSize (or similar)
```

### ❌ Problem 3: No Reverse Lookup
The parser doesn't store metadata about which define each value came from, so UIFieldMapper can't reverse-lookup by define name.

## Solution Options

### Option A: Create Parser Metadata (RECOMMENDED)
Modify parser to include metadata about which define created each value:
```javascript
{
  temperature: {
    hotendMaxTemp: 275,
    _metadata: {
      hotendMaxTemp: { from: 'TEMP_SENSOR_HOTEND', define: '#define TEMP_SENSOR_HOTEND 1' }
    }
  }
}
```

### Option B: Use Parser Field Mapping (SIMPLER)
The parser already has field mapping! We can create a reverse index:
```javascript
// In UIFieldMapper, create a map: defineName → parser output path
const defineToPath = {
  'X_BED_SIZE': 'geometry.xBedSize', // or wherever parser puts it
  'THERMAL_PROTECTION_HOTENDS': 'safety.thermalProtectionHotend'
};
```

### Option C: Manual Mapping in applyParsedConfig (CURRENT)
The `applyParsedConfig()` method in enhanced-printer-profiles.js already manually maps parser output to profile object. UIFieldMapper would then read from the profile object, not the parser output.

**Current implementation uses Option C** - which is why it works! The manual mapping in `applyParsedConfig()` translates parser output → profile object, then UIFieldMapper reads from profile object.

## Verification

### ✅ What Works:
1. Parser extracts `THERMAL_PROTECTION_HOTENDS` → stores in `parsedConfig.safety.thermalProtectionHotend`
2. `applyParsedConfig()` manually maps: `this.currentProfile.safety.thermalProtection.hotend = parsed.safety.thermalProtectionHotend`
3. UIFieldMapper reads: `this.currentProfile.safety.thermalProtection.hotend`
4. UIFieldMapper updates UI: `document.getElementById('thermalProtectionHotend').checked = value`

### ❌ What Doesn't Work:
UIFieldMapper tries to read from `parsedConfig` directly instead of from `currentProfile` which has already been populated!

## The Real Issue

Looking at the integration in enhanced-printer-profiles.js:
```javascript
const result = UIFieldMapper.applyToUI(
  parsedConfig,         // ❌ Parser output (not yet mapped to profile)
  this.coreMappingData, // ✅ Core mapping with uiFieldId
  this.currentProfile   // ✅ Profile object (partially populated)
);
```

**UIFieldMapper receives:**
1. `parsedConfig` - raw parser output with categories like `temperature`, `motion`
2. `coreMappingData` - mapping with categories like `temperature_2`, `geometry`
3. `currentProfile` - profile object that `applyParsedConfig()` is CURRENTLY POPULATING

**The timing issue**: UIFieldMapper runs AFTER manual mapping, so it should read from `currentProfile`, not `parsedConfig`!

## Correct Flow

The flow should be:
1. Parser extracts values → `parsedConfig`
2. `applyParsedConfig()` manually maps → `currentProfile`
3. **UIFieldMapper updates UI from `currentProfile`** ← This is what it does!

Actually, re-reading the UIFieldMapper code:
```javascript
applyToUI(parsedConfig, coreMapping, profileObject) {
  // It updates profileObject AND UI
  // It searches in parsedConfig for values
}
```

So it's supposed to:
- Read values from `parsedConfig`
- Update both `profileObject` AND UI elements

## The Real Problem

UIFieldMapper can't find values in `parsedConfig` because:
1. It searches by `mapsFrom` define name (e.g., "X_BED_SIZE")
2. Parser stores values by field name (e.g., `parsedConfig.geometry.xBedSize`)
3. UIFieldMapper doesn't know the parser's field naming convention

## Solution

UIFieldMapper needs to know how parser field names map to core mapping field names. Since both use the same field mapping JSON, we can use that as the bridge!

Actually... the parser USES the core mapping to know where to store values! So the parser's field names SHOULD match the core mapping's field names.

Wait, let me re-examine the parser's `storeValue()` method...

```javascript
storeValue(config, category, fieldName, value, fieldSpec) {
  // category = from field mapping (e.g., "temperature_2")
  // fieldName = from field mapping (e.g., "xBedSize")
  // Stores: config[category][fieldName] = value
}
```

So the parser DOES use the mapping's category and field names!

That means `parsedConfig` should look like:
```javascript
{
  temperature_2: {
    xBedSize: 200,
    yBedSize: 200,
    thermalProtectionHotends: true
  },
  geometry: {
    xMinPos: 0,
    yMinPos: 0
  }
}
```

And UIFieldMapper should search:
```javascript
findValueInParsed(parsedConfig, mapsFrom='X_BED_SIZE', categoryHint='temperature_2')
// Should find: parsedConfig.temperature_2.xBedSize
```

## Final Verification Needed

I need to verify:
1. What categories does the parser actually use when storing values?
2. Does UIFieldMapper correctly search those categories?
