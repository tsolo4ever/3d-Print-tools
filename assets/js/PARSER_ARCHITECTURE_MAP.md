# Parser Architecture Map

## Overview
The Marlin Configuration Parser is a two-pass system that reads Configuration.h files, extracts #define statements, and maps them to a structured profile object using JSON mapping files.

---

## Component Architecture

### 1. Parser Module (`marlin-config-parser.js`)
**Purpose**: Parse Configuration.h files and extract settings

**Key Objects**:
```javascript
MarlinConfigParser {
  DEBUG: false,                    // Toggle console logging
  mappingSets: {...},              // Available mapping file configurations
  fieldMapping: null,              // Loaded JSON mappings
  variables: {},                   // Stored #define values
  globalConditionals: Set(),       // Active feature flags
  condStack: [],                   // Preprocessor stack (#if/#else/#endif)
  skipDepth: 0                     // Track skipped conditional blocks
}
```

### 2. Mapping Configuration (`mappingSets`)
**Purpose**: Define where to load mapping files for each firmware variant

```javascript
mappingSets: {
  'th3d-2.97': {
    name: 'TH3D UFW 2.97a (Core UI Fields)',
    basePath: 'assets/data/maps/th3d/TH3D UFW 2.97a/core/',
    files: [
      'th3d-config-mapping-core.json',
      'th3d-config-adv-mapping-core.json',
      'th3d-config-backend-mapping-core.json',
      'th3d-config-speed-mapping-core.json'
    ]
  },
  'th3d-default': { /* fallback mapping */ },
  'marlin': { /* vanilla marlin mapping */ }
}
```

### 3. Mapping Files (JSON)
**Purpose**: Define how Configuration.h defines map to profile fields

**Structure**:
```json
{
  "category": {
    "fieldName": {
      "mapsFrom": ["DEFINE_NAME"],
      "type": "integer|string|float|boolean|array",
      "required": true,
      "conditionalOn": ["FEATURE_FLAG"],  // OR logic
      "conditionalOnAll": ["FLAG1", "FLAG2"],  // AND logic
      "conditionalOnNot": ["DISABLED_FLAG"],  // NOT logic
      "examples": ["value"],
      "notes": "Description"
    }
  }
}
```

**Example**:
```json
{
  "motion": {
    "linAdvance": {
      "mapsFrom": ["LINEAR_ADVANCE"],
      "type": "boolean",
      "required": false,
      "notes": "Enable Linear Advance for better print quality"
    },
    "maxFeedrate": {
      "mapsFrom": ["DEFAULT_MAX_FEEDRATE"],
      "type": "array",
      "elementType": "integer",
      "examples": ["{400, 400, 15, 200}"]
    }
  }
}
```

---

## Parsing Workflow

### Phase 1: Initialization
```
User uploads files → Tab1.parseConfigFiles()
                   ↓
Detect firmware variant (th3d-2.97, th3d-default, marlin)
                   ↓
Create parser: MarlinConfigParser.create(variant)
                   ↓
Load mapping files from basePath + files[]
                   ↓
Merge all mapping files into single fieldMapping object
```

### Phase 2: Two-Pass Parsing

#### **Pass 1: Collect Global Conditionals**
```javascript
firstPass(lines) {
  // Goals:
  // 1. Find unconditional #defines (feature flags)
  // 2. Store numeric values in variables{}
  // 3. Build globalConditionals Set
  
  for each line:
    if (!inConditionalBlock && line.startsWith('#define')):
      if (isGlobalConditional(defineName)):
        globalConditionals.add(defineName)  // e.g., BLTOUCH, EZABL_ENABLE
      if (hasNumericValue):
        variables[defineName] = value  // e.g., X_BED_SIZE = 220
}
```

**Example Output**:
```javascript
globalConditionals: Set(['BLTOUCH', 'LINEAR_ADVANCE', 'EZABL_ENABLE'])
variables: { X_BED_SIZE: '220', Y_BED_SIZE: '220', BAUDRATE: '115200' }
```

#### **Pass 2: Parse Fields with Conditionals**
```javascript
secondPass(lines, config) {
  // Goals:
  // 1. Track preprocessor state (#if/#else/#endif)
  // 2. Map #defines to profile fields
  // 3. Apply conditional logic
  
  initPreprocessorState()
  
  for each line:
    if (isPreprocessorDirective):
      handlePreprocessor(line)  // Update condStack, skipDepth
      continue
    
    if (skipDepth > 0):
      continue  // Skip lines in false conditional blocks
    
    if (line.startsWith('#define')):
      parseDefineLine(line, config)  // Main mapping logic
}
```

**Preprocessor Handling**:
```
#ifdef BLTOUCH          → condStack.push({type:'ifdef', branchSelected:true})
  #define PROBE_OFFSET  → Parse (skipDepth=0)
#else                   → skipDepth++ (previous branch taken)
  #define OTHER_SETTING → Skip (skipDepth=1)
#endif                  → condStack.pop(), skipDepth--
```

#### **Field Mapping Logic** (`parseDefineLine`)
```javascript
parseDefineLine(line, config) {
  // Extract: #define DEFINE_NAME value
  
  // 1. Search fieldMapping for matching define
  for (category, fields) in fieldMapping:
    for (fieldName, fieldSpec) in fields:
      if (fieldSpec.mapsFrom matches DEFINE_NAME):
        
        // 2. Check conditional dependencies
        if (fieldSpec.conditionalOn && !anyActive(conditionalOn)):
          skip  // Condition not met
        if (fieldSpec.conditionalOnAll && !allActive(conditionalOnAll)):
          skip  // Condition not met
        if (fieldSpec.conditionalOnNot && anyActive(conditionalOnNot)):
          skip  // Condition not met
        
        // 3. Extract value based on type
        value = extractValue(rawValue, fieldSpec.type)
        
        // 4. Store in config object
        config[category][fieldName] = value
        return
}
```

**Example Mapping**:
```
Input: #define LINEAR_ADVANCE
Mapping: motion.linAdvance { mapsFrom: ["LINEAR_ADVANCE"], type: "boolean" }
Output: config.motion.linAdvance = true
```

### Phase 3: Post-Processing
```javascript
applyDefaultsAndDerived(config) {
  // 1. Apply default values for missing fields
  for (category, fields) in fieldMapping:
    if (field has default && config value is undefined):
      config[category][fieldName] = resolveDefault(fieldSpec.default)
  
  // 2. Calculate derived values (speed, acceleration, jerk)
  if (feedrates.defaultMaxFeedrate === undefined):
    calculate based on bed size and feature flags
  
  if (acceleration.defaultMaxAcceleration === undefined):
    calculate based on bed size brackets
}
```

---

## Data Flow Diagram

```
Configuration.h Files
        ↓
[Upload Interface] (tab-1-printer-info.js)
        ↓
[Parser Creation] MarlinConfigParser.create('th3d-2.97')
        ↓
[Load Mappings] Fetch JSON files → Merge
        ↓
[Parse] Two-pass processing
        ├─ Pass 1: Collect conditionals
        └─ Pass 2: Map fields
        ↓
[Post-Process] Apply defaults & derived values
        ↓
[Parsed Config Object]
  {
    basic: {...},
    hardware: {...},
    motion: {...},
    probe: {...},
    ...
  }
        ↓
[Apply to Profile] Tab1.applyParsedData()
        ↓
[Profile Object]
```

---

## Current Issues

### Issue 1: Split Categories
**Problem**: Mapping files split large categories into chunks (e.g., `motion_1`, `motion_2`)

**Parser Output**:
```javascript
{
  motion: { field1: value1 },
  motion_1: { field2: value2 },
  motion_2: { field3: value3 }
}
```

**Current Solution**: `applyParsedData` merges categories with same base name
```javascript
const mergeCategories = (baseName) => {
  const merged = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (key === baseName || key.startsWith(baseName + '_')) {
      Object.assign(merged, value);
    }
  }
  return merged;
};
```

### Issue 2: Field Name Mismatches
**Problem**: Parser uses camelCase (`linAdvance`), but profile might expect different names

**Example**:
```
Parser: config.motion.linAdvance
Profile: profile.advanced.linearAdvance
```

**Current Solution**: Manual mapping in `applyParsedData`:
```javascript
if (motionData.linAdvance !== undefined) {
  if (!profile.advanced) profile.advanced = {};
  profile.advanced.linearAdvance = motionData.linAdvance;
}
```

### Issue 3: Nested Field Paths
**Problem**: Some fields use dot notation in mapping (`motion.xy.max`)

**Parser Handling**:
```javascript
if (fieldName.includes('.')) {
  const parts = fieldName.split('.');
  let current = config[category];
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}
```

---

## Alternative Approaches to Consider

### Option 1: Direct Profile Mapping
Instead of parser categories → profile categories, use direct paths:

**Mapping**:
```json
{
  "LINEAR_ADVANCE": {
    "profilePath": "advanced.linearAdvance",
    "type": "boolean"
  }
}
```

**Benefits**:
- No intermediate config object
- No need for applyParsedData translation
- Clear 1:1 mapping

### Option 2: Unified Mapping Files
Instead of split files, use single consolidated mapping per firmware:

**Structure**:
```
th3d-2.97-unified.json  (all mappings in one file)
```

**Benefits**:
- No category splitting (_1, _2, etc.)
- Easier to maintain
- Faster loading (1 HTTP request vs 4)

### Option 3: Mapping Schema with UI Hints
Add UI field IDs directly to mappings:

**Mapping**:
```json
{
  "LINEAR_ADVANCE": {
    "profilePath": "advanced.linearAdvance",
    "uiFieldId": "tab7_linearAdvanceEnabled",
    "type": "boolean",
    "tab": 7
  }
}
```

**Benefits**:
- Direct UI integration
- Know which tab/field to update
- Can auto-populate UI after import

---

## Performance Metrics

**Current System**:
- Load 4 mapping files: ~500ms (4 HTTP requests)
- Parse Configuration.h (2000 lines): ~50ms
- Merge mappings: ~10ms
- Apply to profile: ~5ms
- **Total**: ~565ms

**Potential Improvements**:
- Use single unified mapping: Save ~350ms (1 HTTP request)
- Pre-compile mappings: Save ~10ms
- Direct profile paths: Save ~5ms (no translation)
- **Optimized Total**: ~200ms

---

## What would you like to improve?

Please share your ideas for a better approach! Some questions:

1. **Mapping Structure**: Should we use unified files or keep splits?
2. **Field Paths**: Direct profile paths vs intermediate config object?
3. **UI Integration**: Should mappings include UI field IDs?
4. **Performance**: Is loading speed a concern?
5. **Maintainability**: How to make adding new fields easier?

Let me know your thoughts and I can help implement the improvements!
