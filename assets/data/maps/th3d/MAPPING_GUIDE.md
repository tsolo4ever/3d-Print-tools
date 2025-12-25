# TH3D Field Mapping Guide

**Complete Guide to Working with TH3D Configuration Mapping Files**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Field Specification Format](#field-specification-format)
4. [Adding New Fields](#adding-new-fields)
5. [Conditional Logic](#conditional-logic)
6. [Array Field Mapping](#array-field-mapping)
7. [Wildcard Matching](#wildcard-matching)
8. [Best Practices](#best-practices)
9. [Examples](#examples)
10. [Validation Rules](#validation-rules)

---

## Overview

### What Are Mapping Files?

The TH3D mapping files are JSON documents that define how `#define` statements in TH3D firmware configuration files map to structured JSON output. They act as a "translation layer" between C preprocessor syntax and usable configuration data.

### Why Multiple Files?

Configuration is split across 7 mapping files for organization:

1. **th3d-config-mapping.json** - Basic settings (Configuration.h)
2. **th3d-config-adv-mapping-part1.json** - Advanced thermal settings
3. **th3d-config-adv-mapping-part2.json** - Advanced motion/fans
4. **th3d-config-adv-mapping-part3.json** - Advanced features
5. **th3d-config-adv-mapping-part4.json** - Advanced TMC/serial
6. **th3d-config-backend-mapping.json** - Backend calculations
7. **th3d-config-speed-mapping.json** - Motion profiles

The parser **automatically merges** all files at load time.

---

## File Structure

### Basic Structure

```json
{
  "$schema": "TH3D Configuration Field Mapping",
  "version": "1.0.0",
  "part": "1 of 4",
  "sourceFile": "Configuration_adv.h",
  "description": "Advanced thermal settings",
  
  "categoryName": {
    "fieldName": {
      "mapsFrom": ["DEFINE_NAME"],
      "type": "integer|float|string|boolean|array",
      "required": true|false,
      "fileLocation": "Configuration.h|Configuration_adv.h|etc",
      "examples": [value1, value2],
      "th3dNotes": "Notes specific to TH3D firmware",
      "validation": {
        "min": 0,
        "max": 100
      }
    }
  }
}
```

### Metadata Fields

- **$schema** - Schema identifier
- **version** - Mapping version (semantic versioning)
- **part** - Which part (for multi-part files)
- **sourceFile** - Source C header file
- **description** - Human-readable description

---

## Field Specification Format

### Required Properties

#### `mapsFrom`
```json
"mapsFrom": ["DEFINE_NAME"]
```
- Array of C `#define` names that map to this field
- Can be single value: `"mapsFrom": "DEFINE_NAME"`
- Supports wildcards: `"LCD_*"` matches `LCD_BED_LEVELING`, `LCD_INFO_MENU`, etc.
- Supports array indexing: `"DEFAULT_AXIS_STEPS_PER_UNIT[0]"` extracts first element

#### `type`
```json
"type": "integer"
```
Supported types:
- **`integer`** - Whole numbers (e.g., 220, 60)
- **`float`** - Decimal numbers (e.g., 28.72, 0.3)
- **`string`** - Text values (e.g., "PLA", "Ender 3")
- **`boolean`** - True/false (define present = true)
- **`array`** - Array of values (e.g., `{ 80, 80, 400, 93 }`)

### Optional Properties

#### `required`
```json
"required": true
```
- Whether this field must be present in valid configuration
- Parser will add warning if missing

#### `fileLocation`
```json
"fileLocation": "Configuration.h"
```
- Which config file normally contains this define
- Options: `Configuration.h`, `Configuration_adv.h`, `Configuration_backend.h`, `Configuration_speed.h`
- For documentation only (parser checks all files)

#### `alsoFoundIn`
```json
"alsoFoundIn": ["Configuration_backend.h"]
```
- Additional files where this define may appear
- Useful when a define is referenced across multiple files

#### `examples`
```json
"examples": [220, 235, 300]
```
- Example values users might use
- Helps others understand typical values

#### `th3dNotes`
```json
"th3dNotes": "TH3D uses USER_PRINTER_NAME instead of CUSTOM_MACHINE_NAME"
```
- Notes about TH3D-specific behavior
- Important for understanding firmware quirks

#### `validation`
```json
"validation": {
  "min": 0,
  "max": 500,
  "maxLength": 50,
  "pattern": "BOARD_.*",
  "allowedValues": [115200, 250000],
  "mustBeTrue": true,
  "errorLevel": "critical",
  "warningIfOutside": true
}
```

Validation options:
- **`min`** - Minimum numeric value
- **`max`** - Maximum numeric value
- **`maxLength`** - Maximum string length
- **`pattern`** - Regex pattern for validation
- **`allowedValues`** - Whitelist of acceptable values
- **`mustBeTrue`** - Field must be enabled (for safety features)
- **`errorLevel`** - "error", "warning", or "critical"
- **`warningIfOutside`** - Warn if outside range but don't error

#### `conditionalOn`
```json
"conditionalOn": ["ABL_ENABLE", "EZABL"]
```
- Fields that must be active for this field to be included
- Parser skips field if parent not active
- Supports OR logic: any one condition can be true
- **56 fields** use conditional logic in current mappings

---

## Adding New Fields

### Step-by-Step Process

#### 1. Identify the Define
Look in TH3D config files for the `#define`:
```c
#define CUSTOM_ESTEPS_VALUE 425
```

#### 2. Determine Category
Choose appropriate category:
- `basic` - Core printer settings
- `hardware` - Physical components
- `temperature` - Thermal settings
- `motion` - Movement parameters
- `probe` - Bed probe settings
- `bedLeveling` - Mesh leveling
- `advanced` - Advanced features
- `safety` - Protection features
- `communication` - Serial/buffers
- `serial` - Serial port settings
- `tmc` - TMC driver settings
- `thermal` - Thermal protection
- `lcd` - Display options
- `speed` - Motion profiles
- `backend` - Backend calculations

#### 3. Choose Field Name
Use camelCase, descriptive names:
```json
"customEstepsValue"  // ✅ Good
"custom_esteps"      // ❌ Avoid underscores
"e"                  // ❌ Too vague
```

#### 4. Add to Appropriate File
Add to correct mapping file based on source:
- Configuration.h → `th3d-config-mapping.json`
- Configuration_adv.h → `th3d-config-adv-mapping-part*.json`
- Configuration_backend.h → `th3d-config-backend-mapping.json`
- Configuration_speed.h → `th3d-config-speed-mapping.json`

#### 5. Write Field Specification
```json
"extruder": {
  "customEstepsValue": {
    "mapsFrom": ["CUSTOM_ESTEPS_VALUE"],
    "type": "integer",
    "required": false,
    "fileLocation": "Configuration.h",
    "examples": [93, 415, 425, 760],
    "th3dNotes": "User-defined E-steps per mm for extruder calibration",
    "validation": {
      "min": 50,
      "max": 1000,
      "warningIfOutside": true
    }
  }
}
```

#### 6. Test with Parser
```javascript
// Load config and check output
const config = await TH3DConfigParser.parseConfigFile(fileContent);
console.log(config.extruder.customEstepsValue);
```

---

## Conditional Logic

### What Are Conditionals?

Some fields only make sense when parent features are enabled. For example:
- `linearAdvanceK` only matters if `LINEAR_ADVANCE` is enabled
- `ezablPoints` only matters if `EZABL` is enabled
- `blTouchDelay` only matters if `BLTOUCH` is enabled

### Using `conditionalOn`

```json
"linearAdvance": {
  "k": {
    "mapsFrom": ["LIN_ADVANCE_K"],
    "type": "float",
    "conditionalOn": ["LINEAR_ADVANCE"],
    "examples": [0, 0.05, 0.10],
    "validation": {
      "min": 0,
      "max": 2
    }
  }
}
```

### Multiple Parent Conditions (OR Logic)

```json
"machineName": {
  "mapsFrom": ["USER_PRINTER_NAME", "CUSTOM_MACHINE_NAME"],
  "type": "string",
  "conditionalOn": ["CUSTOM_PRINTER_NAME", "ENDER3_V2", "CR10"],
  "th3dNotes": "Enabled if ANY parent condition is active"
}
```

### How It Works

1. Parser detects global conditionals during Pass 1 (printer models, major features)
2. Global conditionals persist across all 4 config files
3. During Pass 2, parser checks `conditionalOn` before storing field
4. If no parent condition is active, field is skipped with log message

### Current Conditional Fields

**56 fields** use conditional logic across all mapping files:

#### ABL-Dependent (8 fields)
- `ezablPoints`, `ezablProbeEdge`, `gridPointsX/Y`, `fadeHeight`, etc.

#### BLTouch-Dependent (7 fields)
- `blTouchDelay`, `blTouchSetOdDelay`, `blTouchHsMode`, etc.

#### Feature-Dependent (41 fields)
- Linear Advance (5 fields)
- Input Shaping (6 fields)
- TMC Drivers (15 fields)
- Advanced Pause (8 fields)
- LCD Options (7 fields)

---

## Array Field Mapping

### The Problem

C arrays like this:
```c
#define DEFAULT_AXIS_STEPS_PER_UNIT { 80, 80, 400, 93 }
```

Need to map to individual fields:
```json
{
  "stepsPerMM": {
    "x": 80,
    "y": 80,
    "z": 400,
    "e": 93
  }
}
```

### Solution: Array Index Notation

```json
"motion": {
  "stepsPerMM": {
    "x": {
      "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT[0]"],
      "type": "float",
      "examples": [80, 160, 200]
    },
    "y": {
      "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT[1]"],
      "type": "float"
    },
    "z": {
      "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT[2]"],
      "type": "float"
    },
    "e": {
      "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT[3]"],
      "type": "float"
    }
  }
}
```

### How It Works

1. Parser encounters `#define DEFAULT_AXIS_STEPS_PER_UNIT { 80, 80, 400, 93 }`
2. Extracts array: `[80, 80, 400, 93]`
3. Finds field with `mapsFrom: ["DEFAULT_AXIS_STEPS_PER_UNIT[0]"]`
4. Extracts element at index 0: `80`
5. Stores in `config.motion.stepsPerMM.x = 80`
6. Repeats for indices [1], [2], [3]

### Arrays Currently Mapped

- **Motion Settings:**
  - `DEFAULT_AXIS_STEPS_PER_UNIT` → stepsPerMM.{x,y,z,e}
  - `DEFAULT_MAX_FEEDRATE` → maxFeedrate.{x,y,z,e}
  - `DEFAULT_MAX_ACCELERATION` → maxAcceleration.{x,y,z,e}

- **Probe Offsets:**
  - `NOZZLE_TO_PROBE_OFFSET` → probe.offset.{x,y,z}

---

## Wildcard Matching

### Purpose

Match multiple similar defines without listing each one:

```c
#define LCD_BED_LEVELING
#define LCD_INFO_MENU
#define DISPLAY_CHARSET_HD44780
#define DGUS_LCD_UI_CREALITY
```

### Syntax

Use asterisk (*) as wildcard:
```json
"displayType": {
  "mapsFrom": ["LCD_*", "DISPLAY_*", "DGUS_*", "TFT_*"],
  "type": "string",
  "examples": ["LCD_BED_LEVELING", "DGUS_LCD_UI_CREALITY"],
  "th3dNotes": "Matches any define containing LCD, DISPLAY, DGUS, or TFT"
}
```

### How It Works

Parser converts wildcards to regex:
- `LCD_*` → `/^LCD_.*$/`
- `DISPLAY_*` → `/^DISPLAY_.*$/`

Then tests each define name against all patterns.

### Current Wildcard Fields

- **Display Types:** `LCD_*`, `DISPLAY_*`, `DGUS_*`, `TFT_*`
- Could extend to other categories with many variants

---

## Best Practices

### ✅ DO

1. **Use Descriptive Names**
   ```json
   "linearAdvanceK"  // ✅ Clear what it is
   "lak"             // ❌ Too cryptic
   ```

2. **Add Examples**
   ```json
   "examples": [0.05, 0.10, 0.15]  // ✅ Shows typical values
   ```

3. **Include TH3D Notes**
   ```json
   "th3dNotes": "TH3D uses different default than vanilla Marlin"
   ```

4. **Set Appropriate Types**
   ```json
   "type": "float"     // ✅ For 28.72
   "type": "integer"   // ❌ Would truncate to 28
   ```

5. **Use Validation**
   ```json
   "validation": {
     "min": 0,
     "max": 500,
     "warningIfOutside": true
   }
   ```

6. **Group Related Fields**
   ```json
   "pid": {
     "p": {...},
     "i": {...},
     "d": {...}
   }
   ```

7. **Document File Locations**
   ```json
   "fileLocation": "Configuration_adv.h",
   "alsoFoundIn": ["Configuration_backend.h"]
   ```

### ❌ DON'T

1. **Don't Duplicate Fields Across Files**
   - Parser merges all files; duplicates cause confusion
   - If field appears in multiple configs, use `alsoFoundIn`

2. **Don't Use Underscores in Field Names**
   ```json
   "linear_advance_k"  // ❌ Use camelCase
   "linearAdvanceK"    // ✅
   ```

3. **Don't Omit Required Fields**
   - Every field needs `mapsFrom` and `type`

4. **Don't Forget Conditionals**
   ```json
   // ❌ Missing conditional - field always parsed
   "ezablPoints": {
     "mapsFrom": ["EZABL_POINTS"],
     "type": "integer"
   }
   
   // ✅ Only parsed when EZABL enabled
   "ezablPoints": {
     "mapsFrom": ["EZABL_POINTS"],
     "type": "integer",
     "conditionalOn": ["EZABL", "ABL_ENABLE"]
   }
   ```

5. **Don't Use Wrong Types**
   ```json
   // ❌ Boolean for numeric value
   "bedTemp": { "type": "boolean" }
   
   // ✅ Integer for temperature
   "bedTemp": { "type": "integer" }
   ```

---

## Examples

### Example 1: Simple Field

```json
"basic": {
  "baudRate": {
    "mapsFrom": ["BAUDRATE"],
    "type": "integer",
    "required": false,
    "fileLocation": "Configuration.h",
    "examples": [115200, 250000],
    "validation": {
      "allowedValues": [9600, 19200, 38400, 57600, 115200, 250000]
    }
  }
}
```

### Example 2: Conditional Field

```json
"advanced": {
  "linearAdvanceK": {
    "mapsFrom": ["LIN_ADVANCE_K"],
    "type": "float",
    "required": false,
    "fileLocation": "Configuration_adv.h",
    "conditionalOn": ["LINEAR_ADVANCE"],
    "examples": [0, 0.05, 0.10, 0.15],
    "th3dNotes": "Only active if LINEAR_ADVANCE is enabled",
    "validation": {
      "min": 0,
      "max": 2
    }
  }
}
```

### Example 3: Array Field

```json
"motion": {
  "maxFeedrate": {
    "x": {
      "mapsFrom": ["DEFAULT_MAX_FEEDRATE[0]"],
      "type": "float",
      "required": false,
      "fileLocation": "Configuration_speed.h",
      "examples": [300, 500, 600],
      "validation": {
        "min": 1,
        "max": 1000
      }
    },
    "y": {
      "mapsFrom": ["DEFAULT_MAX_FEEDRATE[1]"],
      "type": "float"
    }
  }
}
```

### Example 4: Multiple Defines → One Field

```json
"basic": {
  "machineName": {
    "mapsFrom": ["USER_PRINTER_NAME", "CUSTOM_MACHINE_NAME"],
    "type": "string",
    "required": false,
    "fileLocation": "Configuration.h",
    "alsoFoundIn": ["Configuration_backend.h"],
    "examples": ["Ender 3", "CR-10", "My Printer"],
    "th3dNotes": "TH3D uses USER_PRINTER_NAME; Marlin uses CUSTOM_MACHINE_NAME",
    "validation": {
      "maxLength": 50
    }
  }
}
```

### Example 5: Wildcard Matching

```json
"hardware": {
  "displayType": {
    "mapsFrom": ["LCD_*", "DISPLAY_*", "DGUS_*", "TFT_*"],
    "type": "string",
    "required": false,
    "fileLocation": "Configuration.h",
    "examples": ["LCD_BED_LEVELING", "DGUS_LCD_UI_CREALITY", "TFT_GENERIC"],
    "th3dNotes": "Matches any LCD, DISPLAY, DGUS, or TFT define"
  }
}
```

### Example 6: Boolean Field

```json
"safety": {
  "thermalProtectionHotend": {
    "mapsFrom": ["THERMAL_PROTECTION_HOTENDS"],
    "type": "boolean",
    "required": true,
    "fileLocation": "Configuration.h",
    "th3dNotes": "CRITICAL SAFETY FEATURE - should always be enabled!",
    "validation": {
      "mustBeTrue": true,
      "errorLevel": "critical"
    }
  }
}
```

---

## Validation Rules

### Numeric Validation

```json
"validation": {
  "min": 0,
  "max": 500,
  "warningIfOutside": true
}
```

- **`min`** - Error if value < min
- **`max`** - Error if value > max
- **`warningIfOutside`** - Warning instead of error

### String Validation

```json
"validation": {
  "maxLength": 50,
  "pattern": "BOARD_.*"
}
```

- **`maxLength`** - Maximum string length
- **`pattern`** - Regex pattern (e.g., "BOARD_.*" for board names)

### Whitelist Validation

```json
"validation": {
  "allowedValues": [115200, 250000]
}
```

- **`allowedValues`** - Only these values allowed
- Parser will warn if value not in list

### Safety Validation

```json
"validation": {
  "mustBeTrue": true,
  "errorLevel": "critical"
}
```

- **`mustBeTrue`** - Field must be enabled
- **`errorLevel`** - "error", "warning", or "critical"
- Used for safety features like `THERMAL_PROTECTION`

### Required Field Validation

```json
"motherboard": {
  "mapsFrom": ["MOTHERBOARD"],
  "type": "string",
  "required": true
}
```

- **`required: true`** - Field must be present
- Parser adds warning if missing

---

## Quick Reference

### Field Template

Copy and modify for new fields:

```json
"category": {
  "fieldName": {
    "mapsFrom": ["DEFINE_NAME"],
    "type": "integer|float|string|boolean|array",
    "required": false,
    "fileLocation": "Configuration.h",
    "examples": [value1, value2],
    "th3dNotes": "TH3D-specific notes",
    "conditionalOn": ["PARENT_FEATURE"],
    "validation": {
      "min": 0,
      "max": 100
    }
  }
}
```

### Checklist for Adding Fields

- [ ] Identified `#define` name in config file
- [ ] Chosen appropriate category
- [ ] Used camelCase field name
- [ ] Set correct type (integer/float/string/boolean/array)
- [ ] Added to correct mapping file
- [ ] Included `mapsFrom` array
- [ ] Added examples
- [ ] Added TH3D notes if applicable
- [ ] Set `conditionalOn` if field requires parent feature
- [ ] Added validation rules
- [ ] Tested with parser
- [ ] Verified output in console

---

## Troubleshooting

### Field Not Parsing

**Check:**
1. Is `mapsFrom` spelled correctly?
2. Is define actually in the config file?
3. Is field inside conditional block that's being skipped?
4. Does field have required parent (`conditionalOn`)?

**Debug:**
```javascript
TH3DConfigParser.DEBUG = true;  // Enable verbose logging
const config = await TH3DConfigParser.parseConfigFile(content);
```

### Wrong Value Parsed

**Check:**
1. Is type correct (integer vs float)?
2. Is array index correct ([0] vs [1])?
3. Is variable reference being resolved correctly?
4. Is conditional block logic wrong?

### Conditional Not Working

**Check:**
1. Is parent feature in global conditionals list?
2. Check `isGlobalConditional()` patterns in parser
3. Is parent actually defined in config?

**Debug:**
```javascript
console.log(Array.from(TH3DConfigParser.globalConditionals));
```

---

## Version History

### v2.1.0 (Current)
- Added full preprocessor conditional support (#if/#elif/#else)
- Added variable storage and resolution
- Fixed conditional block parsing
- Added 56 conditional fields

### v2.0.0
- Split into 7 mapping files
- Added array field mapping with index notation
- Added wildcard matching support
- Added 56 runtime conditionals

### v1.0.0
- Initial single-file mapping
- Basic field specifications
- No conditional support

---

## Related Documentation

- **Parser:** `assets/js/th3d-config-parser.js`
- **Test Page:** `firmware-helper/test-parser.html`
- **Reference:** `firmware-helper/TH3D-PARSER-REFERENCE.md`
- **Examples:** `firmware-helper/EXAMPLES.md`

---

## Support

For questions or issues:
1. Check existing mapping files for similar fields
2. Review examples in this guide
3. Enable DEBUG mode and check console output
4. Verify with test-parser.html

**Remember:** Template-first development! Update mapping files BEFORE modifying parser code.
