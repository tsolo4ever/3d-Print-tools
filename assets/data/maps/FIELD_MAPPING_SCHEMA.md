# Field Mapping Schema - Complete Specification

This document defines the **complete field mapping structure** for firmware configuration fields. Every field can have as many or as few of these properties as needed.

## 📋 Complete Field Structure

```json
{
  "categoryName": {
    "fieldName": {
      // === REQUIRED FIELDS ===
      "mapsFrom": ["DEFINE_NAME"],              // Array of #define names that map to this field
      "type": "string",                         // Data type: string, integer, float, boolean, array, define
      
      // === PARSING OPTIONS ===
      "required": false,                        // Whether field must be present
      "default": null,                          // Default value if not present
      "elementType": "float",                   // Type of array elements (for array types)
      "arrayFormat": "{ X, Y, Z }",            // Expected format of array in .h file
      "fileLocation": "Configuration.h",        // Which config file contains this
      "lineNumber": 123,                        // Line number in source file
      
      // === UI RENDERING OPTIONS ===
      "uiWidget": "database-select",            // Widget type: text, number, select, database-select, checkbox, textarea, autocomplete, radio-group
      "uiDatabase": "marlin-boards",            // Database file for database-select widgets
      "uiDisplayFormat": "{name} ({mcu})",      // How to display database items
      "uiOrder": 1,                             // Display order within section
      "uiSection": "Basic Hardware",            // Section grouping
      "uiTab": 2,                               // Tab number
      "uiId": "fieldId",                        // HTML form field ID
      "helpText": "User-facing help text",      // Tooltip/help text for UI
      
      // === CONDITIONAL LOGIC ===
      "conditionalOn": ["FEATURE_NAME"],        // Field only applies if ANY of these features enabled
      "conditionalOnAll": ["FEAT_A", "FEAT_B"], // Field only applies if ALL of these features enabled
      "conditionalOnNot": ["DISABLED_FEAT"],    // Field only applies if NONE of these features enabled
      "dependsOn": ["other.field"],             // Field depends on value of other fields
      
      // === VALIDATION ===
      "validation": {
        "min": 0,                               // Minimum value (numbers)
        "max": 500,                             // Maximum value (numbers)
        "minLength": 1,                         // Minimum string length
        "maxLength": 50,                        // Maximum string length
        "enum": [1, 2, 3],                      // Must be one of these values
        "mustBeOdd": true,                      // Must be odd number
        "mustBeEven": false,                    // Must be even number
        "mustBeTrue": false,                    // For booleans - validation expectation
        "errorLevel": "error",                  // error | warning | info
        "pattern": "^[A-Z_]+$",                 // Regex pattern validation
        "customValidator": "validateBoardType"  // Custom validation function name
      },
      
      // === DOCUMENTATION ===
      "examples": ["value1", "value2"],         // Example values
      "th3dNotes": "TH3D-specific behavior",    // TH3D firmware notes
      "marlinNotes": "Vanilla Marlin notes",    // Marlin firmware notes
      "notes": "General notes",                 // General notes (auto-extracted from comments)
      "description": "Internal description",    // Internal description for developers
      "warnings": ["Warning text"],             // Important warnings
      "relatedFields": ["field1", "field2"],    // Related configuration fields
      
      // === TRANSFORMATION ===
      "transform": "normalizePrinterId",        // Transform function to apply
      "defaultFrom": "otherField.path",         // Get default from another field
      "target": "output.path.in.config",        // Where this value goes in output
      "profilePath": "basic.motherboard",       // Path in profile data structure
      "parserPath": "basic.motherboard",        // Path in parsed data structure
      
      // === VERSION TRACKING ===
      "since": "2.0.0",                         // First firmware version with this field
      "deprecated": "2.1.0",                    // Version where field was deprecated
      "replacedBy": "newField",                 // Field that replaces this one
      "removedIn": "3.0.0",                     // Version where field was removed
      
      // === ADVANCED OPTIONS ===
      "readOnly": false,                        // UI should not allow editing
      "hidden": false,                          // Hide from UI
      "advanced": true,                         // Show only in advanced mode
      "experimental": false,                    // Experimental feature flag
      "units": "mm",                            // Display units (mm, °C, mm/s, etc.)
      "step": 0.1,                              // Step increment for number inputs
      "placeholder": "Enter value...",          // Placeholder text
      "autoComplete": ["option1", "option2"]    // Autocomplete suggestions
    }
  }
}
```

---

## 📚 Field Property Reference

### REQUIRED FIELDS

#### `mapsFrom` (array, required)
**Array of #define names** that map to this profile field.
```json
"mapsFrom": ["MOTHERBOARD"]
"mapsFrom": ["TEMP_SENSOR_0", "TEMP_SENSOR"]  // Multiple possible names
```

#### `type` (string, required)
**Data type** of the field value.

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"Marlin"` |
| `integer` | Whole number | `250000` |
| `float` | Decimal number | `22.5` |
| `boolean` | True/false | `true` |
| `array` | Multiple values | `[80, 80, 400]` |
| `define` | Reference to another define | `BOARD_RAMPS_14` |

---

### PARSING OPTIONS

#### `required` (boolean, default: true)
Whether the field **must be present** in the configuration.
```json
"required": true   // Must be defined
"required": false  // Optional
```

#### `default` (any)
**Default value** if field is not present or undefined.
```json
"default": null
"default": 250000
"default": "Custom Board"
"default": [80, 80, 400, 500]
```

#### `elementType` (string)
For **array types**, specifies the type of elements.
```json
"type": "array",
"elementType": "float",
"arrayFormat": "{ X, Y, Z, E }"
```

#### `arrayFormat` (string)
Expected **format of array** in Configuration.h file.
```json
"arrayFormat": "{ X, Y, Z }"
"arrayFormat": "[a, b, c]"
```

#### `fileLocation` (string)
Which **configuration file** contains this define.
```json
"fileLocation": "Configuration.h"
"fileLocation": "Configuration_adv.h"
"fileLocation": "Configuration_backend.h"
```

#### `lineNumber` (integer)
**Line number** where define appears in source file (auto-generated).
```json
"lineNumber": 145
```

---

### UI RENDERING OPTIONS

#### `uiWidget` (string)
**Widget type** for rendering in UI forms.

| Widget | Use Case | Example |
|--------|----------|---------|
| `text` | Single-line text input | Profile name |
| `number` | Numeric input | Steps/mm, temperature |
| `select` | Dropdown list | Baud rate options |
| `database-select` | Dropdown from database JSON | Motherboards, drivers |
| `checkbox` | Boolean toggle | Enable feature |
| `textarea` | Multi-line text | Notes, description |
| `autocomplete` | Search + select | Printer model |
| `radio-group` | Single choice from options | Bed type |
| `array` | Multiple value inputs | XYZ coordinates |

```json
"uiWidget": "database-select"
```

#### `uiDatabase` (string)
**Database file name** for `database-select` widgets (without `.json`).
```json
"uiDatabase": "marlin-boards-V2"
"uiDatabase": "stepper-drivers-V2"
"uiDatabase": "thermistors-V2"
```

#### `uiDisplayFormat` (string)
**Template string** for displaying database items. Use `{fieldName}` placeholders.
```json
"uiDisplayFormat": "{name} ({mcu})"
"uiDisplayFormat": "{id}: {name}"
"uiDisplayFormat": "{name}"
```

#### `uiOrder` (integer)
**Display order** within the section (lower numbers first).
```json
"uiOrder": 1   // First
"uiOrder": 10  // Later
```

#### `uiSection` (string)
**Section grouping** within the tab.
```json
"uiSection": "Basic Hardware"
"uiSection": "Temperature Sensors"
"uiSection": "Stepper Drivers"
```

#### `uiTab` (integer)
**Tab number** where field appears.
```json
"uiTab": 1   // Tab 1: Basic Info
"uiTab": 2   // Tab 2: Hardware
"uiTab": 3   // Tab 3: Hotend & Extruder
```

#### `uiId` (string)
**HTML form field ID** for the input element.
```json
"uiId": "motherboardSelect"
"uiId": "stepsPerMMX"
```

#### `helpText` (string)
**User-facing help text** displayed as tooltip or help icon.
```json
"helpText": "Select your motherboard or choose Custom"
"helpText": "Temperature limit for hotend (200-500°C typical)"
```

---

### CONDITIONAL LOGIC

#### `conditionalOn` (array)
Field **only applies if ANY** of these features are enabled.
```json
"conditionalOn": ["PIDTEMP"]                    // If PID enabled
"conditionalOn": ["BLTOUCH", "FIX_MOUNTED_PROBE"] // If either probe type
```

#### `conditionalOnAll` (array)
Field **only applies if ALL** of these features are enabled.
```json
"conditionalOnAll": ["AUTO_BED_LEVELING_BILINEAR", "PROBE_MANUALLY"]
```

#### `conditionalOnNot` (array)
Field **only applies if NONE** of these features are enabled.
```json
"conditionalOnNot": ["CLASSIC_JERK"]  // Only if junction deviation mode
```

#### `dependsOn` (array)
Field **depends on values** of other fields.
```json
"dependsOn": ["basic.extruders"]  // Only relevant if extruders > 1
```

---

### VALIDATION

#### `validation` (object)
Validation rules for the field value.

```json
"validation": {
  "min": 0,
  "max": 500,
  "minLength": 1,
  "maxLength": 50,
  "enum": [115200, 250000, 500000],
  "mustBeOdd": false,
  "mustBeEven": false,
  "mustBeTrue": true,
  "errorLevel": "error",
  "pattern": "^BOARD_[A-Z_]+$",
  "customValidator": "validateMotherboard"
}
```

| Property | Type | Description |
|----------|------|-------------|
| `min` | number | Minimum numeric value |
| `max` | number | Maximum numeric value |
| `minLength` | number | Minimum string length |
| `maxLength` | number | Maximum string length |
| `enum` | array | Must be one of these values |
| `mustBeOdd` | boolean | Must be odd number |
| `mustBeEven` | boolean | Must be even number |
| `mustBeTrue` | boolean | For booleans - validation expectation |
| `errorLevel` | string | `error`, `warning`, or `info` |
| `pattern` | string | Regex pattern to match |
| `customValidator` | string | Name of custom validation function |

---

### DOCUMENTATION

#### `examples` (array)
**Example values** for this field.
```json
"examples": ["BOARD_RAMPS_14_EFB", "BOARD_BTT_SKR_V1_4"]
"examples": [250000, 115200]
"examples": [[80, 80, 400, 500]]
```

#### `th3dNotes` (string)
**TH3D-specific** behavior or notes.
```json
"th3dNotes": "TH3D uses EZBOARD_V1 define instead of standard board names"
```

#### `marlinNotes` (string)
**Vanilla Marlin** behavior or notes.
```json
"marlinNotes": "Marlin 2.1.x changed this from BOARD_RAMPS to BOARD_RAMPS_14"
```

#### `notes` (string)
**General notes** (often auto-extracted from inline comments).
```json
"notes": "Board type from boards.h - see documentation for full list"
```

#### `description` (string)
**Internal description** for developers.
```json
"description": "Motherboard/controller board identifier from boards.h"
```

#### `warnings` (array)
**Important warnings** about this field.
```json
"warnings": [
  "Changing this requires recompiling firmware",
  "Incorrect value may prevent board from booting"
]
```

#### `relatedFields` (array)
**Related configuration fields** that should be reviewed together.
```json
"relatedFields": ["hardware.driverX", "hardware.driverY", "hardware.thermistorHotend"]
```

---

### TRANSFORMATION

#### `transform` (string)
**Transform function** to apply to value.
```json
"transform": "normalizePrinterId"
"transform": "convertTemperature"
"transform": "parseArray"
```

#### `defaultFrom` (string)
**Get default value** from another field path.
```json
"defaultFrom": "basic.motherboard"
"defaultFrom": "hardware.thermistorHotend"
```

#### `target` (string)
**Output path** where this value should be written.
```json
"target": "hardware.board.type"
"target": "motion.steps.x"
```

#### `profilePath` (string)
**Path in profile data structure** (JSON profile format).
```json
"profilePath": "basic.motherboard"
"profilePath": "hardware.drivers.x"
```

#### `parserPath` (string)
**Path in parsed data structure** (parser output format).
```json
"parserPath": "basic.motherboard"
"parserPath": "hardware.driverX"
```

---

### VERSION TRACKING

#### `since` (string)
**First firmware version** that introduced this field.
```json
"since": "2.0.0"
"since": "unified-2.60"
```

#### `deprecated` (string)
**Version where field was deprecated** (but still works).
```json
"deprecated": "2.1.0"
```

#### `replacedBy` (string)
**Field that replaces** this deprecated field.
```json
"replacedBy": "newFieldName"
"replacedBy": "hardware.newDriverFormat"
```

#### `removedIn` (string)
**Version where field was removed** completely.
```json
"removedIn": "3.0.0"
```

---

### ADVANCED OPTIONS

#### `readOnly` (boolean, default: false)
**UI should not allow editing** this field.
```json
"readOnly": true   // Display only, no editing
"readOnly": false  // Normal editable field
```

#### `hidden` (boolean, default: false)
**Hide from UI** completely.
```json
"hidden": true   // Don't show in UI
"hidden": false  // Normal visibility
```

#### `advanced` (boolean, default: false)
**Show only in advanced mode**.
```json
"advanced": true   // Only in advanced UI mode
"advanced": false  // Always visible
```

#### `experimental` (boolean, default: false)
**Experimental feature flag**.
```json
"experimental": true  // Warn user this is experimental
```

#### `units` (string)
**Display units** for numeric values.
```json
"units": "mm"
"units": "°C"
"units": "mm/s"
"units": "mm/s²"
```

#### `step` (number)
**Step increment** for number inputs.
```json
"step": 0.1     // Increment by 0.1
"step": 1       // Increment by 1
"step": 10      // Increment by 10
```

#### `placeholder` (string)
**Placeholder text** for input fields.
```json
"placeholder": "Enter value..."
"placeholder": "Select motherboard..."
```

#### `autoComplete` (array)
**Autocomplete suggestions** for text inputs.
```json
"autoComplete": ["BOARD_RAMPS_14", "BOARD_BTT_SKR_V1_4", "BOARD_MKS_GEN_L"]
```

---

## 🎯 Complete Example

Here's a complete field with many properties:

```json
{
  "hardware": {
    "motherboard": {
      // Required
      "mapsFrom": ["MOTHERBOARD"],
      "type": "string",
      
      // Parsing
      "required": true,
      "fileLocation": "Configuration.h",
      "lineNumber": 145,
      
      // UI Rendering
      "uiWidget": "database-select",
      "uiDatabase": "marlin-boards-V2",
      "uiDisplayFormat": "{name} ({mcu})",
      "uiOrder": 1,
      "uiSection": "Basic Hardware",
      "uiTab": 2,
      "uiId": "motherboardSelect",
      "helpText": "Select your motherboard or choose Custom",
      
      // Validation
      "validation": {
        "pattern": "^BOARD_[A-Z_0-9]+$",
        "errorLevel": "error"
      },
      
      // Documentation
      "examples": ["BOARD_RAMPS_14_EFB", "BOARD_BTT_SKR_V1_4"],
      "marlinNotes": "Board type from boards.h",
      "th3dNotes": "TH3D uses EZBOARD defines",
      "warnings": ["Changing requires firmware recompile"],
      "relatedFields": ["hardware.driverX", "hardware.driverY"],
      
      // Transformation
      "profilePath": "hardware.board",
      "parserPath": "basic.motherboard",
      
      // Version
      "since": "1.0.0"
    }
  }
}
```

---

## 📝 Usage Notes

### Minimal Field
At minimum, a field needs:
```json
{
  "mapsFrom": ["DEFINE_NAME"],
  "type": "integer"
}
```

### Recommended for UI Fields
For fields that appear in UI:
```json
{
  "mapsFrom": ["DEFINE_NAME"],
  "type": "integer",
  "uiWidget": "number",
  "uiTab": 1,
  "uiSection": "Section Name",
  "uiOrder": 10,
  "helpText": "User help text"
}
```

### Complex Conditional Field
For fields that depend on other settings:
```json
{
  "mapsFrom": ["DEFAULT_KP"],
  "type": "float",
  "conditionalOn": ["PIDTEMP"],
  "validation": {
    "min": 0,
    "max": 1000
  },
  "uiWidget": "number",
  "helpText": "PID P value (only if PID enabled)"
}
```

---

**Version:** 2.0.0  
**Last Updated:** 2025-12-29  
**Schema Status:** Complete specification with all optional fields
