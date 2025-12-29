# Field Mapping Schema Documentation
## Complete Reference for Parser & UI Field Definitions

**Version:** 2.0.0  
**Last Updated:** 2025-12-28  
**Applies To:** Marlin & TH3D configuration mapping files

---

## 📋 Purpose

This document defines ALL available fields that can be used in configuration mapping JSONs. Use this as a reference when adding new fields to ensure consistency.

---

## 🏗️ Field Structure

Every field in a mapping JSON can have these properties:

```json
{
  "categoryName": {
    "fieldName": {
      // === REQUIRED FIELDS ===
      "mapsFrom": ["DEFINE_NAME"],
      "type": "string",
      
      // === PARSING OPTIONS ===
      "required": false,
      "default": null,
      "elementType": "float",
      "arrayFormat": "{ X, Y, Z }",
      
      // === UI RENDERING OPTIONS ===
      "uiWidget": "database-select",
      "uiDatabase": "marlin-boards",
      "uiDisplayFormat": "{name} ({mcu})",
      "uiOrder": 1,
      "uiSection": "Basic Hardware",
      "uiTab": 2,
      
      // === CONDITIONAL LOGIC ===
      "conditionalOn": ["FEATURE_NAME"],
      "conditionalOnAll": ["FEATURE_A", "FEATURE_B"],
      "conditionalOnNot": ["DISABLED_FEATURE"],
      
      // === VALIDATION ===
      "validation": {
        "min": 0,
        "max": 500,
        "mustBeOdd": true,
        "mustBeTrue": false,
        "errorLevel": "error",
        "pattern": "^[A-Z_]+$"
      },
      
      // === DOCUMENTATION ===
      "examples": ["value1", "value2"],
      "th3dNotes": "TH3D-specific behavior notes",
      "marlinNotes": "Vanilla Marlin notes",
      "helpText": "User-facing help text for UI",
      "description": "Internal description",
      
      // === TRANSFORMATION ===
      "transform": "normalizePrinterId",
      "defaultFrom": "otherField.path",
      "target": "output.path.in.config"
    }
  }
}
```

---

## 📚 Field Properties Reference

### **1. Core Identification**

#### `mapsFrom` (REQUIRED)
**Type:** `string` or `string[]`  
**Purpose:** Configuration.h `#define` name(s) this field maps from  
**Examples:**
```json
"mapsFrom": "TEMP_SENSOR_0"
"mapsFrom": ["TEMP_SENSOR_0", "HOTEND_THERMISTOR"]
"mapsFrom": ["ENDER*", "CR10*"]  // Wildcards supported
"mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT[0]"]  // Array indexing
```

#### `type` (REQUIRED)
**Type:** `string`  
**Purpose:** Data type for parsing and validation  
**Options:**
- `"string"` - Text value
- `"integer"` - Whole number
- `"float"` - Decimal number
- `"boolean"` - true/false
- `"array"` - Multiple values `{ x, y, z }`
- `"enum"` - One of predefined values

**Examples:**
```json
"type": "integer"
"type": "array"
"type": "boolean"
```

---

### **2. Parsing Options**

#### `required`
**Type:** `boolean`  
**Default:** `false`  
**Purpose:** Is this field mandatory?  
**Examples:**
```json
"required": true   // Must be present
"required": false  // Optional field
```

#### `default`
**Type:** Any (matches field type)  
**Purpose:** Default value if not defined in Configuration.h  
**Examples:**
```json
"default": 5
"default": "marlin"
"default": true
"default": null  // No default
```

#### `elementType`
**Type:** `string`  
**Purpose:** Type coercion for array elements  
**Used With:** `"type": "array"`  
**Options:** `"integer"`, `"float"`, `"boolean"`, `"string"`  
**Examples:**
```json
{
  "type": "array",
  "elementType": "float",
  "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT"]
}
// Parses: { 80.0, 80.0, 400.0, 93.0 } → [80.0, 80.0, 400.0, 93.0]
```

#### `arrayFormat`
**Type:** `string`  
**Purpose:** Expected array syntax documentation  
**Used With:** `"type": "array"`  
**Examples:**
```json
"arrayFormat": "{ X, Y, Z }"
"arrayFormat": "{ x, y, z, e }"
```

---

### **3. UI Rendering Options**

#### `uiWidget`
**Type:** `string`  
**Purpose:** Override default widget for this field type  
**Options:**
- `"text"` - Single-line text input
- `"number"` - Numeric input with +/- buttons
- `"select"` - Dropdown list
- `"database-select"` - Dropdown from JSON database
- `"checkbox"` - Boolean toggle
- `"textarea"` - Multi-line text
- `"array"` - Multiple coordinated inputs
- `"autocomplete"` - Search + dropdown
- `"radio-group"` - Radio button group

**Examples:**
```json
"uiWidget": "database-select"  // Use database dropdown instead of text
"uiWidget": "checkbox"         // Render as checkbox
```

#### `uiDatabase`
**Type:** `string`  
**Purpose:** Which JSON database to load for dropdown options  
**Used With:** `"uiWidget": "database-select"`  
**Options:**
- `"marlin-boards"` - Motherboards
- `"stepper-drivers"` - Driver types
- `"thermistors"` - Thermistor types
- `"displays"` - LCD/display types
- `"Hotends"` - Hotend models
- `"bed-probes"` - Probe types
- `"printer-profiles"` - Printer models

**Examples:**
```json
{
  "uiWidget": "database-select",
  "uiDatabase": "marlin-boards"
}
```

#### `uiDisplayFormat`
**Type:** `string`  
**Purpose:** Template for displaying database items  
**Used With:** `"uiWidget": "database-select"`  
**Syntax:** `{fieldName}` placeholders  
**Examples:**
```json
"uiDisplayFormat": "{name} ({mcu})"
// Renders: "BOARD_CREALITY_V427 (STM32F103)"

"uiDisplayFormat": "{name} - {wattage}W {voltage}V"
// Renders: "Standard Heater - 40W 24V"
```

#### `uiOrder`
**Type:** `integer`  
**Purpose:** Display order within section (lower = first)  
**Examples:**
```json
"uiOrder": 1   // First field
"uiOrder": 10  // Later field
```

#### `uiSection`
**Type:** `string`  
**Purpose:** Group fields into UI sections  
**Examples:**
```json
"uiSection": "Basic Hardware"
"uiSection": "Temperature Settings"
"uiSection": "Motion Control"
```

#### `uiTab`
**Type:** `integer`  
**Purpose:** Which tab (1-10) this field belongs to  
**Range:** 1-10  
**Examples:**
```json
"uiTab": 1  // Tab 1: Printer Info
"uiTab": 2  // Tab 2: Hardware
"uiTab": 3  // Tab 3: Hotend
```

---

### **4. Conditional Logic**

#### `conditionalOn`
**Type:** `string` or `string[]`  
**Purpose:** Field only active if ANY of these features are enabled (OR logic)  
**Examples:**
```json
"conditionalOn": "EZABL_ENABLE"
"conditionalOn": ["BLTOUCH", "EZABL_ENABLE"]  // Either one
```

#### `conditionalOnAll`
**Type:** `string` or `string[]`  
**Purpose:** Field only active if ALL of these features are enabled (AND logic)  
**Examples:**
```json
"conditionalOnAll": ["EZABL_ENABLE", "ABL_UBL"]  // Both required
```

#### `conditionalOnNot`
**Type:** `string` or `string[]`  
**Purpose:** Field only active if NONE of these features are enabled (NOT logic)  
**Examples:**
```json
"conditionalOnNot": "JUNCTION_DEVIATION"  // Only if NOT using JD
"conditionalOnNot": ["MANUAL_MESH_LEVELING", "NO_ABL"]  // Neither
```

**Combined Example:**
```json
{
  "ezablProbeEdge": {
    "mapsFrom": ["EZABL_PROBE_EDGE"],
    "type": "integer",
    "conditionalOn": ["EZABL_ENABLE", "BLTOUCH"],  // EZABL OR BLTouch
    "conditionalOnNot": "MANUAL_MESH_LEVELING",    // NOT manual leveling
    "th3dNotes": "Only shown if probe enabled"
  }
}
```

---

### **5. Validation**

#### `validation` (Object)
**Type:** `object`  
**Purpose:** Rules for validating field values  

**Available Rules:**

##### `min` / `max`
**Type:** `number`  
**Purpose:** Numeric range validation  
```json
"validation": {
  "min": 0,
  "max": 500
}
```

##### `mustBeOdd` / `mustBeEven`
**Type:** `boolean`  
**Purpose:** Integer parity check  
```json
"validation": {
  "mustBeOdd": true  // Grid points must be odd (3, 5, 7...)
}
```

##### `mustBeTrue`
**Type:** `boolean`  
**Purpose:** Safety check - field must be enabled  
```json
"validation": {
  "mustBeTrue": true  // Safety feature must be enabled
}
```

##### `errorLevel`
**Type:** `string`  
**Options:** `"error"`, `"warning"`, `"info"`  
**Purpose:** Severity of validation failure  
```json
"validation": {
  "mustBeTrue": true,
  "errorLevel": "error"  // Critical safety feature
}
```

##### `pattern`
**Type:** `string` (regex)  
**Purpose:** String format validation  
```json
"validation": {
  "pattern": "^[A-Z_][A-Z0-9_]*$"  // Valid C identifier
}
```

##### `maxLength` / `minLength`
**Type:** `integer`  
**Purpose:** String length validation  
```json
"validation": {
  "maxLength": 50  // Max 50 characters
}
```

**Complete Example:**
```json
{
  "ezablPoints": {
    "mapsFrom": ["EZABL_POINTS"],
    "type": "integer",
    "validation": {
      "min": 3,
      "max": 15,
      "mustBeOdd": true,
      "errorLevel": "warning"
    },
    "th3dNotes": "Must be odd number between 3-15"
  }
}
```

---

### **6. Documentation**

#### `examples`
**Type:** `array`  
**Purpose:** Sample values for documentation/testing  
```json
"examples": [93, 95, 130, 400, 415, 425, 690]
"examples": ["TH3D UFW 2.97a", "TH3D UFW 2.96"]
"examples": [{ "x": 80, "y": 80, "z": 400 }]
```

#### `th3dNotes`
**Type:** `string`  
**Purpose:** TH3D Unified Firmware specific notes  
```json
"th3dNotes": "TH3D EZOut filament sensor - LCD header connection"
```

#### `marlinNotes`
**Type:** `string`  
**Purpose:** Vanilla Marlin firmware specific notes  
```json
"marlinNotes": "Standard Marlin feature, enabled by default"
```

#### `helpText`
**Type:** `string`  
**Purpose:** User-facing help text shown in UI  
```json
"helpText": "Distance from bed edge to probe. Use 30 for binder clips."
```

#### `description`
**Type:** `string`  
**Purpose:** Internal developer description  
```json
"description": "Controls bed temperature PID tuning behavior"
```

---

### **7. Transformation & Derived Values**

#### `transform`
**Type:** `string`  
**Purpose:** Function name for value transformation  
**Available Transforms:**
- `"normalizePrinterId"` - Convert printer macro to canonical ID
- `"normalizeMountId"` - Convert mount macro to canonical ID
- `"normalizeAblType"` - Convert ABL type to standard format

```json
{
  "printerModel": {
    "mapsFrom": ["ENDER5_PLUS"],
    "type": "string",
    "transform": "normalizePrinterId",
    "target": "basic.printerModel"
  }
}
// ENDER5_PLUS → "ender5_plus"
```

#### `defaultFrom`
**Type:** `string` (path)  
**Purpose:** Get default value from another field  
```json
{
  "travelAcceleration": {
    "type": "integer",
    "defaultFrom": "acceleration.defaultAcceleration"
  }
}
```

#### `target`
**Type:** `string` (path)  
**Purpose:** Output path in parsed config object  
```json
{
  "unifiedVersion": {
    "mapsFrom": ["UNIFIED_VERSION"],
    "type": "string",
    "target": "basic.firmwareVersion"
  }
}
```

---

## 📖 Complete Field Example

Here's a field using many properties:

```json
{
  "ablProbe": {
    "ezablPoints": {
      // === CORE ===
      "mapsFrom": ["EZABL_POINTS"],
      "type": "integer",
      "required": false,
      "default": 5,
      
      // === UI ===
      "uiWidget": "number",
      "uiOrder": 1,
      "uiSection": "Mesh Settings",
      "uiTab": 5,
      
      // === CONDITIONAL ===
      "conditionalOn": ["EZABL_ENABLE", "BLTOUCH"],
      "conditionalOnNot": "MANUAL_MESH_LEVELING",
      
      // === VALIDATION ===
      "validation": {
        "min": 3,
        "max": 15,
        "mustBeOdd": true,
        "errorLevel": "warning"
      },
      
      // === DOCUMENTATION ===
      "examples": [3, 5, 7, 9, 11],
      "th3dNotes": "Grid points (odd). Total points = N x N",
      "helpText": "3-5 typical, 7+ for UBL. More points = finer mesh but slower probing.",
      "description": "Number of probe points along each axis for bed leveling mesh"
    }
  }
}
```

---

## 🎯 Field Type Quick Reference

| Type | UI Widget | Examples | Notes |
|------|-----------|----------|-------|
| `string` | text | `"Marlin"`, `"BOARD_NAME"` | Text values |
| `integer` | number | `5`, `400`, `93` | Whole numbers |
| `float` | number | `0.15`, `80.0`, `2.5` | Decimals |
| `boolean` | checkbox | `true`, `false` | On/off toggles |
| `array` | array-input | `[80, 80, 400, 93]` | Multiple values |
| `enum` | select | `"marlin"`, `"th3d"` | Predefined options |

---

## 🚨 Common Patterns

### **Safety Feature (Must Be Enabled)**
```json
{
  "thermalProtectionHotend": {
    "mapsFrom": ["THERMAL_PROTECTION_HOTENDS"],
    "type": "boolean",
    "required": true,
    "validation": {
      "mustBeTrue": true,
      "errorLevel": "error"
    },
    "th3dNotes": "CRITICAL: Prevents fire if heater fails"
  }
}
```

### **Conditional Feature**
```json
{
  "linearAdvanceK": {
    "mapsFrom": ["LINEAR_ADVANCE_K"],
    "type": "float",
    "conditionalOn": "LINEAR_ADVANCE",
    "default": 0.0,
    "validation": {
      "min": 0,
      "max": 2
    }
  }
}
```

### **Database Dropdown**
```json
{
  "motherboard": {
    "mapsFrom": ["MOTHERBOARD"],
    "type": "string",
    "required": true,
    "uiWidget": "database-select",
    "uiDatabase": "marlin-boards",
    "uiDisplayFormat": "{name} ({mcu})"
  }
}
```

### **Array Field**
```json
{
  "stepsPerMM": {
    "mapsFrom": ["DEFAULT_AXIS_STEPS_PER_UNIT"],
    "type": "array",
    "elementType": "float",
    "arrayFormat": "{ X, Y, Z, E }",
    "examples": [[80.0, 80.0, 400.0, 93.0]]
  }
}
```

---

## 📝 Best Practices

1. **Always provide `examples`** - Helps users understand expected values
2. **Use `helpText` for user-facing info** - Shown in UI
3. **Use `th3dNotes` or `marlinNotes` for developer info** - Not shown to users
4. **Set appropriate `validation`** - Catch errors early
5. **Use `conditionalOn` for dependent features** - Keep UI clean
6. **Provide `default` values** - Make profiles easier to create
7. **Use `uiWidget` to improve UX** - Better than raw text inputs
8. **Group with `uiSection`** - Organize related fields

---

**Reference this document when adding new fields to maintain consistency!**
