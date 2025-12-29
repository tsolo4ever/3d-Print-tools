# Comprehensive Configuration Mappings

## 📁 Directory Structure

The mapping files are now organized by firmware type and version to support:
- **Complete #define extraction** from Configuration.h files
- **Version-specific mappings** for different firmware releases
- **Split files** to keep each file under 1000 lines for maintainability
- **Future .h file generation** from profile data

```
assets/data/maps/
├── marlin/
│   ├── marlin-config-mapping.json           # Legacy single file (deprecated)
│   ├── marlin-config-adv-mapping-part*.json # Advanced config mappings
│   └── 2.1.2/                               # Versioned comprehensive mappings
│       ├── marlin-config-mapping-part1.json (719 lines)
│       ├── marlin-config-mapping-part2.json (744 lines)
│       ├── marlin-config-mapping-part3.json (738 lines)
│       ├── marlin-config-mapping-part4.json (390 lines)
│       ├── marlin-config-mapping-part5.json (555 lines)
│       ├── marlin-config-mapping-part6.json (772 lines)
│       ├── marlin-config-mapping-part7.json (594 lines)
│       ├── marlin-config-mapping-part8.json (761 lines)
│       └── marlin-config-mapping-part9.json (114 lines)
└── th3d/
    └── th3d-config-mapping.json
```

---

## 🎯 Purpose

These comprehensive mappings serve multiple purposes:

### 1. **Complete Define Extraction**
- Captures **EVERY** `#define` statement from Configuration.h
- Includes enabled defines (`#define FEATURE`)
- Includes disabled defines (`//#define FEATURE`)
- Preserves line numbers for reference
- Extracts inline comments and documentation

### 2. **Firmware Configuration Generation**
- Future feature: Generate new .h files from profile data
- Reverse mapping from profile → Configuration.h
- Enables automated firmware configuration creation

### 3. **UI Field Mapping**
- Links configuration defines to UI form fields
- Supports JSON-driven form rendering
- Maintains single source of truth

### 4. **Version Management**
- Track firmware version-specific fields
- Support multiple Marlin versions (2.0.x, 2.1.x, etc.)
- Handle TH3D firmware variations

---

## 📊 Mapping Statistics

**Marlin 2.1.2 Comprehensive Mappings:**
- **Total #defines extracted:** 447
- **Categories:** 12
- **Files:** 9 parts (all <900 lines)

### Category Breakdown:
- `other`: 201 fields (uncategorized)
- `hardware`: 46 fields (drivers, thermistors, displays)
- `temperature`: 52 fields (PID, temps, thermal protection)
- `endstops`: 47 fields (homing, endstop configuration)
- `motion`: 33 fields (steps, feedrates, acceleration)
- `probe`: 24 fields (bed probes, offsets)
- `bedLeveling`: 12 fields (ABL, UBL, mesh)
- `basic`: 11 fields (machine name, motherboard, serial)
- `features`: 9 fields (EEPROM, SD card)
- `geometry`: 7 fields (bed size, positions)
- `safety`: 3 fields (thermal protection)
- `advanced`: 2 fields (arc support, etc.)

---

## 📝 Field Structure

Each field in the mapping contains:

```json
{
  "fieldKey": {
    "mapsFrom": ["DEFINE_NAME"],
    "type": "integer|float|string|boolean|array|define",
    "required": true,
    "fileLocation": "Configuration.h",
    "lineNumber": 123,
    "examples": ["value1", "value2"],
    "notes": "Description from inline comments",
    "uiId": "formFieldId",
    "uiTab": 1,
    "uiSection": "Section Name",
    "uiOrder": 10,
    "uiWidget": "text|number|select|checkbox|database-select",
    "uiDatabase": "database-name",
    "helpText": "User-friendly help text"
  }
}
```

### Field Types:
- **`integer`**: Numeric values without decimals
- **`float`**: Decimal numbers
- **`string`**: Text values (usually quoted in .h file)
- **`boolean`**: Presence/absence of #define
- **`array`**: Values like `{ 100, 200, 300 }`
- **`define`**: Reference to another #define

---

## 🛠️ Generating Mappings

### Automated Script: `create-comprehensive-mappings.py`

**Location:** `firmware-helper/create-comprehensive-mappings.py`

### Usage:

```bash
# Generate Marlin 2.1.2 mappings
python firmware-helper/create-comprehensive-mappings.py \
  --config firmware-helper/example-ender5plus-config.h \
  --version 2.1.2 \
  --firmware marlin \
  --max-lines 900

# Generate TH3D mappings
python firmware-helper/create-comprehensive-mappings.py \
  --config firmware-helper/example-th3d-ender5plus-config.h \
  --version unified-2.61 \
  --firmware th3d \
  --max-lines 900
```

### What It Does:

1. **Parses Configuration.h** - Extracts all #define statements
2. **Categorizes defines** - Groups by function (hardware, temperature, etc.)
3. **Infers types** - Determines data type from value format
4. **Extracts comments** - Captures inline documentation
5. **Splits into parts** - Keeps each file under line limit
6. **Creates versioned folders** - Organizes by firmware/version
7. **Outputs JSON** - Structured mapping files

### Output Example:

```
🔧 Parsing example-ender5plus-config.h...
✅ Found 447 #define statements

📊 Building comprehensive mappings...
✅ Created 12 category mappings:
   • other: 201 fields
   • basic: 11 fields
   • hardware: 46 fields
   ...

✂️  Splitting into parts (<900 lines each)...

💾 Saving 9 mapping file(s) to assets\data\maps\marlin\2.1.2/...
   ✅ marlin-config-mapping-part1.json (719 lines)
   ✅ marlin-config-mapping-part2.json (744 lines)
   ...

✨ Complete!
```

---

## 🔄 Loading Mappings in Code

### Option 1: Load All Parts

```javascript
async function loadComprehensiveMappings(firmware, version) {
  const basePath = `assets/data/maps/${firmware}/${version}`;
  const parts = [];
  
  // Load all parts
  for (let i = 1; i <= 9; i++) {
    try {
      const response = await fetch(`${basePath}/${firmware}-config-mapping-part${i}.json`);
      if (response.ok) {
        const data = await response.json();
        parts.push(data);
      }
    } catch (error) {
      break; // No more parts
    }
  }
  
  // Merge all parts
  const merged = parts.reduce((acc, part) => {
    Object.keys(part).forEach(key => {
      if (key.startsWith('$') || key === 'version' || key === 'firmware') {
        return; // Skip metadata
      }
      acc[key] = { ...acc[key], ...part[key] };
    });
    return acc;
  }, {});
  
  return merged;
}
```

### Option 2: Load Specific Categories

```javascript
// Load only hardware and temperature categories
const part1 = await fetch('assets/data/maps/marlin/2.1.2/marlin-config-mapping-part1.json')
  .then(r => r.json());

// Access specific categories
const hardware = part1.hardware_1; // First chunk of hardware fields
const temperature = part1.temperature_1;
```

---

## 📐 Categorization Patterns

The script uses keyword matching to categorize fields:

| Category | Keywords |
|----------|----------|
| `basic` | MOTHERBOARD, BAUDRATE, SERIAL_PORT, EXTRUDERS, MACHINE_NAME |
| `hardware` | DRIVER_TYPE, BOARD_, TEMP_SENSOR, DISPLAY, LCD |
| `temperature` | TEMP, PID, HEATER, THERMAL_PROTECTION, PREHEAT |
| `geometry` | BED_SIZE, MIN_POS, MAX_POS, TRAVEL_LIMITS |
| `motion` | AXIS_STEPS, FEEDRATE, ACCELERATION, JERK |
| `endstops` | ENDSTOP, HOME_, HOMING_FEEDRATE |
| `probe` | PROBE, BLTOUCH, NOZZLE_TO_PROBE, Z_MIN_PROBE |
| `bedLeveling` | BED_LEVELING, MESH_, AUTO_BED_LEVELING, GRID_MAX_POINTS |
| `safety` | THERMAL_PROTECTION, PREVENT_, SOFTWARE_ENDSTOPS |
| `features` | EEPROM, SDSUPPORT, SD_, EMERGENCY_PARSER |
| `advanced` | ARC_SUPPORT, JUNCTION, INPUT_SHAPING, FILAMENT_RUNOUT |

**Uncategorized fields** go to `other` category for manual review.

---

## 🎨 UI Integration

### Field Renderer Integration

The `field-renderer.js` can load and render these mappings:

```javascript
// In field-renderer.js
async init() {
  // Load versioned mappings
  this.mappingData = await loadComprehensiveMappings('marlin', '2.1.2');
  console.log(`Loaded ${Object.keys(this.mappingData).length} categories`);
}

render(category, fieldName, value) {
  const fieldDef = this.mappingData[category]?.[fieldName];
  if (!fieldDef) return '';
  
  // Use uiWidget to determine render method
  switch (fieldDef.uiWidget) {
    case 'text': return this.renderText(fieldDef, value);
    case 'number': return this.renderNumber(fieldDef, value);
    case 'select': return this.renderSelect(fieldDef, value);
    case 'database-select': return this.renderDatabaseSelect(fieldDef, value);
    case 'checkbox': return this.renderCheckbox(fieldDef, value);
    default: return this.renderText(fieldDef, value);
  }
}
```

---

## 🔮 Future: Configuration.h Generation

With comprehensive mappings, we can reverse the process:

```javascript
async function generateConfigurationH(profile, firmware, version) {
  const mappings = await loadComprehensiveMappings(firmware, version);
  const lines = [];
  
  // Header
  lines.push('/**');
  lines.push(` * Marlin 3D Printer Firmware`);
  lines.push(` * Generated from profile: ${profile.name}`);
  lines.push(' */');
  lines.push('');
  
  // Process each category
  for (const [category, fields] of Object.entries(mappings)) {
    lines.push(`// ===== ${category.toUpperCase()} =====`);
    
    for (const [fieldKey, fieldDef] of Object.entries(fields)) {
      const profilePath = fieldDef.profilePath || `${category}.${fieldKey}`;
      const value = getValueByPath(profile, profilePath);
      
      if (value !== undefined && value !== null) {
        const defineName = fieldDef.mapsFrom[0];
        const formattedValue = formatValueForH(value, fieldDef.type);
        
        lines.push(`#define ${defineName} ${formattedValue}`);
      } else if (fieldDef.required) {
        lines.push(`//#define ${fieldDef.mapsFrom[0]} // Not configured`);
      }
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}
```

---

## 🔧 Maintenance

### Adding New Firmware Versions

1. Get Configuration.h for new version
2. Run script with new version number
3. Review categorization
4. Add UI metadata if needed

```bash
python firmware-helper/create-comprehensive-mappings.py \
  --config path/to/Configuration.h \
  --version 2.1.3 \
  --firmware marlin
```

### Improving Categorization

Edit `_categorize_defines()` method in script:

```python
patterns = {
    'mynewcategory': [
        'KEYWORD1', 'KEYWORD2', 'PATTERN_*'
    ],
    # ... existing categories
}
```

### Adding UI Metadata

Update `TAB_FIELD_ANALYSIS.md` with field mappings, then enhance script's `load_ui_metadata()` function to parse it.

---

## 📚 Related Files

- **Generator Script:** `firmware-helper/create-comprehensive-mappings.py`
- **Field Renderer:** `assets/js/profile-renderer/field-renderer.js`
- **Tab Renderer:** `assets/js/profile-renderer/tab-renderer.js`
- **UI Analysis:** `assets/js/profile-renderer/TAB_FIELD_ANALYSIS.md`
- **Legacy Mapping:** `assets/data/maps/marlin/marlin-config-mapping.json`
- **Schema Docs:** `assets/data/maps/FIELD_MAPPING_SCHEMA.md`

---

## 🎯 Benefits

### For Development:
- ✅ Complete field coverage (447 defines vs previous ~80)
- ✅ Version-specific mappings
- ✅ Automated generation from source
- ✅ Maintainable file sizes (<900 lines)
- ✅ Structured categorization

### For Users:
- ✅ Comprehensive firmware configuration
- ✅ Every available option exposed
- ✅ Future: Generate custom firmware configs
- ✅ Version-aware compatibility

### For Future Features:
- ✅ Configuration.h generation
- ✅ Profile import/export to .h files
- ✅ Firmware upgrade migration
- ✅ Diff comparison between versions

---

## 📝 Notes

- **Large "other" category:** 201 fields need manual categorization review
- **Disabled defines:** Captured as `"required": false` 
- **Line numbers:** Preserved for reference back to source
- **Comments:** Extracted from inline documentation
- **Type inference:** Automatic based on value format

---

**Generated:** 2025-12-29  
**Marlin Version:** 2.1.2  
**Total Defines:** 447  
**Script:** `create-comprehensive-mappings.py`
