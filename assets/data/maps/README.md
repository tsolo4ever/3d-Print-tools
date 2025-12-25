# Marlin Configuration Field Mapping System

## Overview

This directory contains comprehensive field mapping definitions for Marlin firmware configurations. The mappings define how fields in Marlin's Configuration.h and Configuration_adv.h files are parsed, validated, and transformed into a standardized JSON format.

## Directory Structure

```
assets/data/maps/
├── README.md                           # This file
├── marlin/                             # Vanilla Marlin mappings
│   ├── marlin-config-mapping.json      # Configuration.h mappings
│   ├── marlin-config-adv-mapping-part1.json  # Thermal & Fans
│   ├── marlin-config-adv-mapping-part2.json  # Motion & Homing
│   ├── marlin-config-adv-mapping-part3.json  # Advanced Features
│   └── marlin-config-adv-mapping-part4.json  # LCD & Interface
└── th3d/                               # TH3D firmware mappings
    └── (see firmware-helper/ directory)
```

## Mapping File Structure

Each mapping JSON file follows this structure:

```json
{
  "$schema": "Marlin Configuration Field Mapping",
  "version": "1.0.0",
  "description": "Description of this mapping file",
  "firmware": "Marlin",
  "configFile": "Configuration.h",
  
  "category": {
    "fieldName": {
      "mapsFrom": ["DEFINE_NAME"],
      "type": "string|integer|float|boolean|array",
      "arrayFields": ["x", "y", "z"],  // For array types
      "required": true|false,
      "conditionalOn": ["OTHER_DEFINE"],  // Optional dependency
      "fileLocation": "Configuration.h",
      "examples": [example1, example2],
      "validation": {
        "min": 0,
        "max": 100,
        "enum": [value1, value2]
      },
      "notes": "Detailed explanation"
    }
  }
}
```

### Field Properties

- **mapsFrom**: Array of C define names that map to this field (allows for aliases)
- **type**: Data type (string, integer, float, boolean, array)
- **arrayFields**: For array types, names of array elements
- **required**: Whether this field must be present
- **conditionalOn**: Other defines that must be enabled for this field to apply
- **fileLocation**: Which configuration file contains this define
- **examples**: Sample values
- **validation**: Constraints on valid values
- **notes**: Human-readable explanation

## Vanilla Marlin vs TH3D

### Key Differences

#### 1. **File Structure**
- **Vanilla Marlin**: 2 files (Configuration.h, Configuration_adv.h)
- **TH3D**: 4 files (Configuration.h, Configuration_adv.h, Configuration_backend.h, Configuration_speed.h)

#### 2. **Field Names**
| Feature | Vanilla Marlin | TH3D |
|---------|---------------|------|
| Firmware Version | `SHORT_BUILD_VERSION` | `UNIFIED_VERSION` |
| Printer Name | `CUSTOM_MACHINE_NAME` | `USER_PRINTER_NAME` |
| Bed Leveling | `AUTO_BED_LEVELING_*` | `EZABL_ENABLE` |
| Probe | `BLTOUCH`, `FIX_MOUNTED_PROBE` | `EZABL_PROBE_EDGE`, `EZABL_FASTPROBE` |

#### 3. **Variable References**
- **TH3D**: Uses variable references in Configuration_backend.h
  ```c
  // Configuration_backend.h
  #define USER_PRINTER_NAME "My Ender 5 Plus"
  
  // Configuration.h
  #define CUSTOM_MACHINE_NAME USER_PRINTER_NAME  // Variable reference!
  ```
- **Vanilla Marlin**: Direct string values only
  ```c
  #define CUSTOM_MACHINE_NAME "3D Printer"
  ```

#### 4. **Simplified Settings**
- **TH3D**: Provides printer-specific presets and simplified menu options
- **Vanilla Marlin**: Full configuration access, more complex

### TH3D-Specific Fields

These fields exist ONLY in TH3D firmware:

- `UNIFIED_VERSION` - TH3D firmware version
- `USER_PRINTER_NAME` - Simplified printer name
- `EZABL_ENABLE` - TH3D's bed leveling system
- `EZABL_PROBE_EDGE` - Probe edge margin
- `EZABL_FASTPROBE` - Fast probing mode
- `MANUAL_MESH_LEVELING` - TH3D's manual mesh option
- `POWER_LOSS_RECOVERY` - TH3D-specific power loss handling
- `LINEAR_ADVANCE` - Enabled by default in TH3D
- Speed profiles in Configuration_speed.h

## Usage Examples

### Example 1: Parsing Configuration.h

```javascript
// Load the mapping
const mapping = await fetch('assets/data/maps/marlin/marlin-config-mapping.json');
const fieldMap = await mapping.json();

// Parse a line from Configuration.h
const line = "#define BAUDRATE 250000";
const match = line.match(/#define\s+(\w+)\s+(.+)/);

if (match) {
  const [_, defineName, value] = match;
  
  // Find field in mapping
  for (const category in fieldMap) {
    if (category.startsWith('$') || category.startsWith('_')) continue;
    
    for (const fieldName in fieldMap[category]) {
      const field = fieldMap[category][fieldName];
      
      if (field.mapsFrom.includes(defineName)) {
        console.log(`Found field: ${fieldName}`);
        console.log(`Category: ${category}`);
        console.log(`Type: ${field.type}`);
        console.log(`Value: ${value}`);
        
        // Validate
        if (field.validation) {
          if (field.validation.min && parseInt(value) < field.validation.min) {
            console.error(`Value below minimum: ${field.validation.min}`);
          }
        }
      }
    }
  }
}
```

### Example 2: Finding Required Fields

```javascript
function getRequiredFields(mapping) {
  const required = [];
  
  for (const category in mapping) {
    if (category.startsWith('$') || category.startsWith('_')) continue;
    
    for (const fieldName in mapping[category]) {
      const field = mapping[category][fieldName];
      
      if (field.required) {
        required.push({
          name: fieldName,
          mapsFrom: field.mapsFrom,
          type: field.type,
          examples: field.examples
        });
      }
    }
  }
  
  return required;
}
```

### Example 3: Handling Conditional Fields

```javascript
function isFieldEnabled(field, enabledDefines) {
  if (!field.conditionalOn) return true;
  
  // Check if all conditions are met
  return field.conditionalOn.every(condition => {
    if (condition.startsWith('!')) {
      // Negated condition
      return !enabledDefines.includes(condition.substring(1));
    } else {
      return enabledDefines.includes(condition);
    }
  });
}

// Usage
const enabledDefines = ['PIDTEMP', 'EEPROM_SETTINGS'];
const field = {
  "mapsFrom": ["DEFAULT_KP"],
  "conditionalOn": ["PIDTEMP"]
};

if (isFieldEnabled(field, enabledDefines)) {
  console.log("Field is enabled");
}
```

### Example 4: Extracting Array Values

```javascript
function parseArrayField(value, field) {
  // Input: "{ 80, 80, 400, 500 }"
  const matches = value.match(/\{([^}]+)\}/);
  
  if (!matches) return null;
  
  const values = matches[1].split(',').map(v => v.trim());
  const result = {};
  
  if (field.arrayFields) {
    field.arrayFields.forEach((name, index) => {
      result[name] = parseFloat(values[index]);
    });
  }
  
  return result;
}

// Usage
const line = "#define DEFAULT_AXIS_STEPS_PER_UNIT { 80, 80, 400, 500 }";
const value = line.split(/\s+/).slice(2).join(' ');
const field = {
  "type": "array",
  "arrayFields": ["x", "y", "z", "e"]
};

const parsed = parseArrayField(value, field);
// Result: { x: 80, y: 80, z: 400, e: 500 }
```

## Integration with Parser

### Current Parser (TH3D-specific)

The current parser at `assets/js/th3d-config-parser.js` is designed for TH3D firmware. It:

1. Loads `firmware-helper/th3d-field-mapping.json`
2. Parses 4 TH3D configuration files
3. Handles variable references
4. Merges results preserving critical values

### Adding Vanilla Marlin Support

To add vanilla Marlin support to the parser:

```javascript
// In th3d-config-parser.js or new marlin-config-parser.js

const MarlinConfigParser = {
  async init() {
    // Load vanilla Marlin mappings
    this.configMapping = await this.loadMapping(
      'assets/data/maps/marlin/marlin-config-mapping.json'
    );
    this.configAdvMapping = await this.loadMapping(
      'assets/data/maps/marlin/marlin-config-adv-mapping-part1.json'
    );
    // Load other parts...
  },
  
  async parseMarlinConfig(configFile, advConfigFile) {
    const config = await this.parseFile(configFile, this.configMapping);
    const configAdv = await this.parseFile(advConfigFile, this.configAdvMapping);
    
    return this.mergeConfigs(config, configAdv);
  },
  
  detectFirmwareType(content) {
    if (content.includes('UNIFIED_VERSION')) {
      return 'TH3D';
    } else if (content.includes('SHORT_BUILD_VERSION')) {
      return 'Marlin';
    }
    return 'Unknown';
  }
};
```

## Validation Rules

### Type Validation

```javascript
function validateField(value, field) {
  const errors = [];
  
  // Type check
  switch (field.type) {
    case 'integer':
      if (!Number.isInteger(value)) {
        errors.push(`Expected integer, got ${typeof value}`);
      }
      break;
      
    case 'float':
      if (typeof value !== 'number') {
        errors.push(`Expected number, got ${typeof value}`);
      }
      break;
      
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push(`Expected boolean, got ${typeof value}`);
      }
      break;
      
    case 'string':
      if (typeof value !== 'string') {
        errors.push(`Expected string, got ${typeof value}`);
      }
      break;
  }
  
  // Range validation
  if (field.validation) {
    if (field.validation.min !== undefined && value < field.validation.min) {
      errors.push(`Value ${value} below minimum ${field.validation.min}`);
    }
    
    if (field.validation.max !== undefined && value > field.validation.max) {
      errors.push(`Value ${value} above maximum ${field.validation.max}`);
    }
    
    if (field.validation.enum && !field.validation.enum.includes(value)) {
      errors.push(`Value ${value} not in allowed values: ${field.validation.enum}`);
    }
  }
  
  return errors;
}
```

## Field Categories

### Configuration.h Categories

1. **basic** - Firmware version, machine name, serial settings
2. **hardware** - Stepper drivers, thermistors
3. **temperature** - Temperature limits, PID values, preheat settings
4. **geometry** - Bed size, build volume
5. **motion** - Steps/mm, feedrates, acceleration, jerk
6. **endstops** - Endstop configuration, homing
7. **probe** - Bed probe settings
8. **bedLeveling** - Auto bed leveling configuration
9. **safety** - Thermal protection, software endstops
10. **storage** - EEPROM, SD card
11. **lcd** - Display settings

### Configuration_adv.h Categories

1. **advanced** - Buffer sizes, arc support
2. **fans** - Cooling fan control
3. **extruder** - Extruder-specific settings
4. **homing** - Advanced homing options
5. **motion** - Advanced motion settings
6. **stepper** - Stepper motor control
7. **communication** - Serial buffers, host commands
8. **linearAdvance** - Pressure advance
9. **inputShaping** - Input shaping / resonance compensation
10. **babystepping** - Live Z offset
11. **filamentSensor** - Runout detection
12. **advancedPause** - M600 filament change
13. **tmc** - TMC stepper driver settings
14. **powerLoss** - Power loss recovery
15. **lcd** - Advanced LCD features
16. **sdCard** - Advanced SD card features
17. **encoderSettings** - Rotary encoder config
18. **bootScreen** - Startup screen
19. **safety** - Watchdog timer
20. **debug** - Debugging features

## Best Practices

### 1. Template-First Development

Always update mapping files BEFORE modifying parser code:

```
1. Update mapping JSON with new field
2. Document field properties completely
3. Add examples and validation rules
4. Update parser to use mapping
5. Test with real config files
```

### 2. Version Control

Increment version numbers when making changes:

- **Patch** (1.0.x): Bug fixes, clarifications
- **Minor** (1.x.0): New fields, backward compatible
- **Major** (x.0.0): Breaking changes, restructure

### 3. Documentation

Each field should have:
- Clear, concise notes
- Real-world examples
- Validation constraints
- Dependencies (conditionalOn)

### 4. Testing

Test mappings with:
- Stock configurations from Marlin releases
- Popular printer configs (Ender 3, Prusa, etc.)
- Edge cases (multi-extruder, CoreXY, etc.)

## Contributing

When adding new fields:

1. Research the field in Marlin source code
2. Check Marlin documentation
3. Add to appropriate category in mapping
4. Include complete metadata
5. Test with example configurations
6. Update this README if needed

## Resources

- **Marlin Documentation**: https://marlinfw.org/docs/
- **Marlin GitHub**: https://github.com/MarlinFirmware/Marlin
- **TH3D Documentation**: https://www.th3dstudio.com/knowledgebase/
- **Configuration Examples**: https://github.com/MarlinFirmware/Configurations

## License

These mapping files are part of the 3D Print Tools project and follow the same license as the main project.

---

**Last Updated**: 2024-12-25  
**Mapping Version**: 1.0.0  
**Marlin Version Tested**: 2.1.3  
**TH3D Version Tested**: U2.R1.7b
