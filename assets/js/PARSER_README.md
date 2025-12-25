# Universal Marlin Configuration Parser

**Parse ANY Marlin-based firmware configuration files**

---

## 🎯 Overview

The Universal Marlin Parser (`marlin-config-parser.js`) is a flexible, data-driven parser that can work with any Marlin firmware variant by using different mapping file sets.

### **Supported Firmware:**
- ✅ TH3D Unified Firmware (fully mapped)
- 🔜 Vanilla Marlin (mapping files needed)
- 🔜 Custom variants (create your own mappings)

---

## 🚀 Quick Start

### **Basic Usage (TH3D)**

```javascript
// Create a TH3D parser instance
const parser = MarlinConfigParser.create('th3d');

// Parse single file
const config = await parser.parseConfigFile(configContent);

// Parse multiple files
const config = await parser.parseMultipleFiles({
    config: configHContent,
    configAdv: configAdvContent,
    configBackend: configBackendContent,
    configSpeed: configSpeedContent
});

console.log(config);
```

### **Using Vanilla Marlin**

```javascript
// Create a vanilla Marlin parser
const parser = MarlinConfigParser.create('marlin');

// Parse files (same API)
const config = await parser.parseMultipleFiles(files);
```

### **Custom Firmware Variant**

```javascript
// Define custom mapping configuration
const customConfig = {
    name: 'My Custom Firmware',
    basePath: 'assets/data/maps/mycustom/',
    files: [
        'config-mapping.json',
        'advanced-mapping.json'
    ]
};

// Create parser with custom config
const parser = MarlinConfigParser.create('custom', customConfig);
const config = await parser.parseMultipleFiles(files);
```

---

## 📁 Directory Structure

```
assets/data/maps/
├── th3d/                          # TH3D Unified Firmware mappings
│   ├── th3d-config-mapping.json
│   ├── th3d-config-adv-mapping-part1.json
│   ├── th3d-config-adv-mapping-part2.json
│   ├── th3d-config-adv-mapping-part3.json
│   ├── th3d-config-adv-mapping-part4.json
│   ├── th3d-config-backend-mapping.json
│   ├── th3d-config-speed-mapping.json
│   └── MAPPING_GUIDE.md
│
├── marlin/                        # Vanilla Marlin mappings (TODO)
│   ├── marlin-config-mapping.json
│   └── marlin-config-adv-mapping.json
│
└── custom/                        # Your custom mappings
    └── (your mapping files)
```

---

## 🔧 Features

### **1. Multi-Variant Support**

Switch between firmware variants easily:

```javascript
// TH3D
const th3dParser = MarlinConfigParser.create('th3d');

// Vanilla Marlin
const marlinParser = MarlinConfigParser.create('marlin');

// Custom
const customParser = MarlinConfigParser.create('custom', customConfig);
```

### **2. Full Preprocessor Support**

Handles all C preprocessor directives:
- `#define` - Field definitions
- `#if` / `#elif` / `#else` - Conditional compilation
- `#ifndef` / `#ifdef` - Guard clauses
- `ENABLED()` / `DISABLED()` - Feature checks

### **3. Variable Resolution**

Automatically resolves variable references:

```c
#define X_BED_SIZE 220
#define DEFAULT_XJERK 8.0
#define DEFAULT_YJERK DEFAULT_XJERK  // ✅ Resolves to 8.0
```

### **4. Array Field Mapping**

Maps C arrays to individual fields:

```c
#define DEFAULT_AXIS_STEPS_PER_UNIT { 80, 80, 400, 93 }
```

Becomes:

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

### **5. Conditional Fields**

Only parses fields when parent features are active:

```json
"linearAdvanceK": {
  "conditionalOn": ["LINEAR_ADVANCE"],
  ...
}
```

### **6. Wildcard Matching**

Match multiple similar defines:

```json
"displayType": {
  "mapsFrom": ["LCD_*", "DISPLAY_*", "DGUS_*"]
}
```

### **7. Debug Mode**

Control logging verbosity:

```javascript
// Enable verbose logging
MarlinConfigParser.DEBUG = true;

// Silent mode
MarlinConfigParser.DEBUG = false;
```

---

## 📋 API Reference

### **MarlinConfigParser.create(variant, customConfig)**

Create a parser instance for a specific firmware variant.

**Parameters:**
- `variant` (string) - 'th3d', 'marlin', or 'custom'
- `customConfig` (object, optional) - Custom mapping configuration

**Returns:** Parser instance

**Example:**
```javascript
const parser = MarlinConfigParser.create('th3d');
```

---

### **parser.parseConfigFile(content)**

Parse a single configuration file.

**Parameters:**
- `content` (string) - File content as text

**Returns:** Promise<object> - Parsed configuration

**Example:**
```javascript
const config = await parser.parseConfigFile(fileContent);
```

---

### **parser.parseMultipleFiles(files)**

Parse and merge multiple configuration files.

**Parameters:**
- `files` (object) - Object with file contents:
  ```javascript
  {
    config: configHContent,        // Configuration.h
    configAdv: configAdvContent,   // Configuration_adv.h
    configBackend: backendContent, // Configuration_backend.h (optional)
    configSpeed: speedContent      // Configuration_speed.h (optional)
  }
  ```

**Returns:** Promise<object> - Merged parsed configuration

**Example:**
```javascript
const config = await parser.parseMultipleFiles({
    config: await readFile('Configuration.h'),
    configAdv: await readFile('Configuration_adv.h')
});
```

---

### **parser.loadFieldMapping()**

Load and merge all mapping files for the current variant.

**Returns:** Promise<object> - Merged field mapping

**Note:** Called automatically by parse methods

---

## 🎓 Creating Custom Mappings

### **1. Create Mapping Directory**

```bash
mkdir assets/data/maps/mycustom
```

### **2. Create Mapping Files**

Follow the TH3D mapping structure. See `assets/data/maps/th3d/MAPPING_GUIDE.md` for complete documentation.

**Basic mapping file:**

```json
{
  "$schema": "Marlin Configuration Field Mapping",
  "version": "1.0.0",
  "description": "My custom firmware mappings",
  
  "basic": {
    "machineName": {
      "mapsFrom": ["CUSTOM_MACHINE_NAME"],
      "type": "string",
      "required": false,
      "fileLocation": "Configuration.h",
      "examples": ["My Printer"],
      "validation": {
        "maxLength": 50
      }
    }
  }
}
```

### **3. Register Variant**

Add to `mappingSets` in `marlin-config-parser.js`:

```javascript
'mycustom': {
    name: 'My Custom Firmware',
    basePath: 'assets/data/maps/mycustom/',
    files: [
        'config-mapping.json',
        'advanced-mapping.json'
    ]
}
```

### **4. Use Custom Parser**

```javascript
const parser = MarlinConfigParser.create('mycustom');
const config = await parser.parseMultipleFiles(files);
```

---

## 🔍 Output Structure

```javascript
{
  "basic": {
    "machineName": "Ender 3",
    "baudRate": 115200,
    "bedSizeX": 220,
    "bedSizeY": 220,
    ...
  },
  "hardware": {
    "driverX": "TMC2209",
    "thermistorHotend": 1,
    ...
  },
  "temperature": {
    "hotendMaxTemp": 275,
    "pidHotendP": 28.72,
    ...
  },
  "motion": {
    "stepsPerMM": {
      "x": 80,
      "y": 80,
      "z": 400,
      "e": 425
    },
    "maxFeedrate": {...},
    "maxAcceleration": {...},
    "jerkX": 8,
    ...
  },
  "probe": {
    "type": "BLTouch",
    "offset": { "x": -44, "y": -10, "z": 0 }
  },
  "bedLeveling": {
    "type": "BILINEAR",
    "gridPointsX": 5,
    ...
  },
  "advanced": {
    "linearAdvanceK": 0.05,
    ...
  },
  "safety": {
    "thermalProtectionHotend": true,
    ...
  },
  "warnings": [
    {
      "level": "warning",
      "message": "..."
    }
  ]
}
```

---

## 🆚 Comparison: TH3D Parser vs Universal Parser

### **Old: TH3D-Specific**

```javascript
// Only works with TH3D
const parser = TH3DConfigParser;
const config = await parser.parseConfigFile(content);
```

### **New: Universal**

```javascript
// Works with any firmware
const parser = MarlinConfigParser.create('th3d');  // or 'marlin', 'custom'
const config = await parser.parseMultipleFiles(files);
```

### **Backward Compatibility**

The universal parser maintains backward compatibility:

```javascript
// Still works!
const config = await TH3DConfigParser.parseConfigFile(content);
// TH3DConfigParser is automatically created as MarlinConfigParser.create('th3d')
```

---

## 🐛 Troubleshooting

### **Mapping Files Not Loading**

**Error:** `Could not load mapping files from assets/data/maps/...`

**Solution:**
1. Check file paths in `mappingSets` configuration
2. Verify mapping files exist in correct directory
3. Check browser console for HTTP errors
4. Ensure server is serving JSON files correctly

### **Fields Not Parsing**

**Enable debug mode:**

```javascript
const parser = MarlinConfigParser.create('th3d');
parser.DEBUG = true;
const config = await parser.parseConfigFile(content);
```

**Check console for:**
- ✅ "Mapped DEFINE_NAME → category.field = value"
- ⏭️ "Skipped DEFINE_NAME (conditionalOn: ...)"
- ⚠️ "Unmapped define: DEFINE_NAME"

### **Wrong Values Parsed**

**Check:**
1. Variable resolution: Is variable defined before use?
2. Conditional blocks: Is field inside false conditional?
3. Type conversion: Is field type correct (integer vs float)?
4. Array indexing: Is array index notation correct?

---

## 📚 Related Documentation

- **Mapping Guide:** `assets/data/maps/th3d/MAPPING_GUIDE.md`
- **TH3D Reference:** `firmware-helper/TH3D-PARSER-REFERENCE.md`
- **Test Page:** `firmware-helper/test-parser.html`

---

## 🎯 Roadmap

### **Completed ✅**
- [x] TH3D Unified Firmware support
- [x] Multi-variant architecture
- [x] Full preprocessor support
- [x] Variable resolution
- [x] Array field mapping
- [x] Conditional fields
- [x] Wildcard matching
- [x] Debug mode control

### **In Progress 🚧**
- [ ] Vanilla Marlin mapping files
- [ ] Marlin 2.1.x support
- [ ] UI integration

### **Planned 📋**
- [ ] Klipper config parser
- [ ] RepRap firmware support
- [ ] Auto-detect firmware variant
- [ ] Config file generator (reverse parser)

---

## 💡 Tips

### **1. Start with TH3D**

TH3D mappings are complete and battle-tested:

```javascript
const parser = MarlinConfigParser.create('th3d');
```

### **2. Use Debug Mode During Development**

```javascript
parser.DEBUG = true;  // See what's happening
```

### **3. Create Mapping Files First**

Follow template-first development:
1. Update mapping files
2. Test with parser
3. Verify output

### **4. Reuse TH3D Mappings**

Many TH3D mappings work for vanilla Marlin with minor changes.

### **5. Contribute Back**

Share your custom mappings to help others!

---

## 🤝 Contributing

Want to add support for a new firmware variant?

1. Create mapping files following the guide
2. Test thoroughly
3. Submit PR with mappings + tests
4. Update documentation

---

## 📄 License

Same as project license.

---

## 🆘 Support

1. Check this README
2. Review MAPPING_GUIDE.md
3. Enable DEBUG mode
4. Check browser console
5. Open an issue with debug logs

---

**Happy Parsing!** 🎉
