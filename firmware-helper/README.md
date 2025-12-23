# Firmware Helper - TH3D Configuration Parser

**Version:** 1.0.0  
**Last Updated:** 2025-12-23

This directory contains comprehensive mapping templates and documentation for parsing TH3D Unified Firmware configuration files. The templates serve as the **source of truth** for parser development.

---

## 📁 Files Overview

### **Documentation & Mapping**

1. **`TH3D-PARSER-REFERENCE.md`** - Complete human-readable reference
   - Field-by-field mapping documentation
   - Examples and typical values
   - Troubleshooting guide
   - Update workflow instructions

2. **`th3d-field-mapping.json`** - Machine-readable mapping metadata
   - Complete field definitions with metadata
   - Validation rules
   - File location information
   - TH3D-specific notes

3. **`th3d-template-annotated.json`** - Quick reference template
   - Inline comments for each field
   - Configuration.h define mappings
   - Typical value ranges
   - Quick lookup during development

4. **`templete for TH3D.json`** - Base template structure
   - Empty structure showing all possible fields
   - Used as baseline for exports

### **Example Files**

5. **`example-th3d-ender5plus-config.h`** - TH3D Configuration.h example
6. **`example-th3d-ender5plus-config_adv.h`** - TH3D Configuration_adv.h example
7. **`example-th3d-ender5plus-config_backend.h`** - Backend processing file
8. **`example-th3d-ender5plus-config.h`** - Standard Marlin example (for comparison)

---

## 🎯 Template-First Development Workflow

**Core Principle:** Templates are the source of truth. Update templates BEFORE changing parser code!

```
1. UPDATE TEMPLATE → 2. UPDATE PARSER → 3. TEST → 4. VALIDATE
        ↓                    ↓               ↓          ↓
  Source of Truth    Implement Mapping   Verify    Check Against
   (this folder)      (parser code)      Output     Templates
```

### **Step-by-Step Process:**

#### 1. **Need to Add a New Field?**
   - ✅ Update `TH3D-PARSER-REFERENCE.md` first
   - ✅ Add field to `th3d-field-mapping.json` with complete metadata
   - ✅ Add inline comment to `th3d-template-annotated.json`
   - ✅ Update base template `templete for TH3D.json`

#### 2. **Update Parser Code**
   - Open `assets/js/th3d-config-parser.js`
   - Reference the mapping template
   - Add parsing logic for the new field
   - Follow the documented structure

#### 3. **Test Extraction**
   - Use example config files in this directory
   - Verify field extracts correctly
   - Check value types and ranges

#### 4. **Validate**
   - Use templates as checklist
   - Verify all documented fields are parsed
   - Check warnings are appropriate

---

## 🔧 TH3D-Specific Features

### **Key Differences from Standard Marlin:**

| Feature | Standard Marlin | TH3D Unified Firmware |
|---------|----------------|----------------------|
| **Machine Name** | `CUSTOM_MACHINE_NAME` | `USER_PRINTER_NAME` |
| **Version** | `SHORT_BUILD_VERSION` | `UNIFIED_VERSION` |
| **Build Date** | - | `STRING_DISTRIBUTION_DATE` |
| **Probe** | Various | `EZABL_ENABLE` / `EZABL_POINTS` |
| **RGB Lighting** | - | `TH3D_RGB_ENABLE` |

### **Multi-File Structure:**

TH3D uses **4 configuration files**:
1. **Configuration.h** - Main settings
2. **Configuration_adv.h** - Advanced features
3. **Configuration_backend.h** - Backend processing (contains variable references!)
4. **Configuration_speed.h** - Speed/motion profiles

### **Variable Reference Challenge:**

**Problem:** Configuration_backend.h may contain:
```c
#define CUSTOM_MACHINE_NAME USER_PRINTER_NAME
```
This is a **variable reference**, not a string!

**Solution:** Parser must:
1. Store value from `USER_PRINTER_NAME` in Configuration.h
2. Detect variable references (no quotes)
3. Use stored value instead of variable name
4. Preserve across file merges

---

## 📖 Using the Templates

### **For Developers:**

**Adding a new field:**
```
1. Open TH3D-PARSER-REFERENCE.md
2. Find appropriate section (Basic, Hardware, Motion, etc.)
3. Add new field to table with:
   - Configuration.h define name
   - Type (string, integer, float, boolean)
   - Typical values
   - Notes
4. Update th3d-field-mapping.json with validation rules
5. Add inline comment to th3d-template-annotated.json
6. Update parser code to match
```

**Troubleshooting parsing issues:**
```
1. Check TH3D-PARSER-REFERENCE.md for expected behavior
2. Verify field is in th3d-field-mapping.json
3. Check if Configuration.h define name matches template
4. Look for TH3D-specific notes in mapping
```

### **For Users:**

**Understanding extracted data:**
```
1. Open th3d-template-annotated.json
2. Find the field you're interested in
3. Read the inline comment for:
   - Which Configuration.h define it comes from
   - What typical values look like
   - Any special notes or warnings
```

---

## 🗂️ Field Categories

### **basic** (14 fields)
Printer identification, communication settings, build volume

### **hardware** (17 fields)
Drivers, thermistors, endstops, display

### **temperature** (12 fields)
Temperature limits, PID tuning for hotend and bed

### **motion** (19 fields)
Steps/mm, feedrates, acceleration, jerk/junction deviation

### **probe** (5 fields)
Probe type, offsets, configuration

### **bedLeveling** (5 fields)
Leveling type, mesh configuration, fade height

### **advanced** (7 fields)
Linear advance, arc support, TH3D-specific features

### **safety** (4 fields)
Thermal protection, filament sensor

### **warnings** (array)
Validation warnings and errors

**Total:** 83+ configurable fields

---

## ⚠️ Critical Safety Fields

These fields should **ALWAYS** be enabled:

```json
{
  "safety": {
    "thermalProtectionHotend": true,  // REQUIRED!
    "thermalProtectionBed": true      // REQUIRED!
  }
}
```

**Warning:** Disabling thermal protection is **EXTREMELY DANGEROUS** and can cause fires!

---

## 🔍 Validation Rules

Templates include comprehensive validation:

### **Type Checking**
- String fields must be strings
- Integer fields must be whole numbers
- Float fields can have decimals
- Boolean fields are true/false

### **Range Validation**
```json
{
  "bedSizeX": {
    "validation": {
      "min": 100,
      "max": 500
    }
  }
}
```

### **Pattern Matching**
```json
{
  "motherboard": {
    "validation": {
      "pattern": "BOARD_.*"
    }
  }
}
```

### **Allowed Values**
```json
{
  "baudRate": {
    "validation": {
      "allowedValues": [9600, 19200, 38400, 57600, 115200, 250000]
    }
  }
}
```

---

## 📚 Additional Resources

### **TH3D Resources**
- TH3D Unified Firmware: https://www.th3dstudio.com/knowledgebase/th3d-unified-firmware-package/
- TH3D Support: https://www.th3dstudio.com/contact/

### **Marlin Resources**
- Marlin Documentation: https://marlinfw.org/docs/configuration/configuration.html
- Marlin GitHub: https://github.com/MarlinFirmware/Marlin

### **Related Tools in Toolbox**
- E-Steps Calculator - Calibrate extruder steps
- Z-Offset Calibration - Calibrate probe offset
- Pressure Advance Calibration - Tune Linear Advance K factor
- PID Tuning - Auto-tune hotend/bed PID values

---

## 🐛 Troubleshooting

### **Issue: Field Not Extracting**

**Check:**
1. Is field in `th3d-field-mapping.json`?
2. Is Configuration.h define name correct?
3. Is value in correct format (string, number, etc.)?
4. Is define commented out in config file?

**Solution:** Consult `TH3D-PARSER-REFERENCE.md` for correct define name and format

### **Issue: Wrong Value Extracted**

**Check:**
1. Is parser using correct extraction method?
   - `extractString()` for quoted values
   - `extractArray()` for `{ x, y, z }` format
   - Direct parse for numbers
2. Is value being overwritten by later file?
3. Is variable reference being handled correctly?

**Solution:** Add debug logging to parser, verify against template

### **Issue: Duplicate Warnings**

**Cause:** Warnings generated per-file instead of once on merged config

**Solution:** Only validate final merged configuration, not individual files

---

## 📊 Template Maintenance

### **When to Update Templates:**

✅ **Always update when:**
- Adding support for new Configuration.h define
- TH3D releases new firmware version with new features
- Validation rules change
- Field types or ranges change

✅ **Version Bump When:**
- Major field additions (new categories)
- Breaking changes to structure
- Significant documentation updates

### **Versioning:**

Templates use **Semantic Versioning**:
- **Major** (1.x.x) - Breaking changes, restructuring
- **Minor** (x.1.x) - New fields, non-breaking additions
- **Patch** (x.x.1) - Documentation updates, fixes

---

## 🤝 Contributing

When contributing parser updates:

1. **Template First:** Update templates before code
2. **Document Everything:** Add examples, notes, validation rules
3. **Test Thoroughly:** Use example config files
4. **Validate Output:** Check against templates
5. **Update Version:** Bump version in templates and parser

---

## 📝 Version History

### **v1.0.0** (2025-12-23)
- ✅ Initial release
- ✅ Complete TH3D field mapping
- ✅ Comprehensive documentation
- ✅ Template-first workflow established
- ✅ 83+ fields documented
- ✅ Multi-file parsing support
- ✅ Variable reference handling

---

## 📧 Support

For issues or questions:
1. Check `TH3D-PARSER-REFERENCE.md` first
2. Review example config files
3. Consult inline comments in `th3d-template-annotated.json`
4. Submit issue with parser logs and example config

---

**Remember:** These templates are the source of truth. Always consult them when working with the parser!
