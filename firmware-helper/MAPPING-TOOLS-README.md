# TH3D Configuration Mapping Tools

Two Python tools to help maintain and expand TH3D configuration field mappings.

---

## 🔍 Tool 1: Mapping Coverage Checker

**File:** `check-missing-mappings.py`

### Purpose
Analyzes your TH3D config files and compares them to the mapping JSON files to identify unmapped fields.

### Usage
```bash
python firmware-helper/check-missing-mappings.py
```

### Output
- Console report with statistics and categorized unmapped fields
- Detailed report saved to `firmware-helper/mapping-coverage-report.txt`

### What It Shows
- **Total fields** in config files vs mapped fields
- **Coverage percentage**
- **Critical missing fields** (MOTHERBOARD, thermistors, etc.)
- **Categorized unmapped fields** (thermal, motion, hardware, safety, etc.)

### Example Output
```
📊 Total unique defines: 1125
📊 Total mapped fields: 377
📊 Unmapped defines: 856 (76.1%)

⚠️ CRITICAL MISSING: 2 critical fields not mapped:
   - TEMP_SENSOR_0
   - TEMP_SENSOR_BED

📦 THERMAL (99 unmapped)
📦 MOTION (79 unmapped)
📦 HARDWARE (58 unmapped)
...
```

---

## 🏗️ Tool 2: Interactive Mapping Builder

**File:** `build-mappings.py`

### Purpose
Helps you create mapping entries for unmapped fields with intelligent suggestions.

### Usage
```bash
python firmware-helper/build-mappings.py
```

### Features

#### 1. **Build Specific Field(s)**
- Enter one or more field names (comma-separated)
- Tool extracts field info from config files
- Shows value, type, comments, and suggestions
- Generates mapping entry automatically or with customization

#### 2. **Batch Build from Report**
- Loads unmapped fields from `mapping-coverage-report.txt`
- Process multiple fields sequentially
- Choose how many to process at once

#### 3. **Export Template**
- Generate a template for a specific field
- Copy/paste into appropriate mapping file

### Interactive Workflow

For each field, the tool:

1. **Extracts Info:**
   - Source file
   - Current value
   - Surrounding comments
   - Inferred type

2. **Makes Suggestions:**
   - Type (boolean, integer, float, string, array)
   - Category (thermistors, motion, safety, etc.)
   - Target mapping file

3. **Generates Mapping:**
   ```json
   {
     "mapsFrom": ["TEMP_SENSOR_0"],
     "type": "integer",
     "required": true,
     "examples": [1, 5, 11, 13],
     "th3dNotes": "Hotend thermistor type...",
     "validation": {
       "min": -5,
       "max": 999
     }
   }
   ```

4. **Auto-Saves:**
   - Adds to appropriate mapping file
   - Updates category structure
   - Preserves existing mappings

### Type Inference

The tool automatically infers types based on:

**Boolean:**
- Names containing: ENABLE, DISABLE, INVERT, REVERSE, USE_, HAS_, IS_

**Integer:**
- Names containing: COUNT, SIZE, MIN, MAX, TIMEOUT, DELAY, _PORT
- Numeric values without decimals

**Float:**
- Names containing: FACTOR, RATIO, FEEDRATE, SPEED, ACCEL, JERK
- Numeric values with decimals

**String:**
- Names containing: NAME, LABEL, TEXT, _PIN
- Quoted values

**Array:**
- Names containing: DEFAULT_*_UNIT, DEFAULT_MAX_
- Values in `{ }` braces

### Category Suggestions

**Configuration.h:**
- `thermistors` - temp, thermal, pid, heat
- `ablProbe` - probe, bl, ezabl, leveling
- `extruder` - extruder, estep, filament
- `bedSize` - bed_size, x_bed, y_bed, z_max
- `homeOffset` - home, endstop

**Configuration_adv.h:**
- `fanControl` - fan, cooling
- `tmcDrivers` - tmc, driver, stealth
- `lcdOptions` - lcd, display, screen
- `buffers` - buffer, serial, baud
- `babystepping` - babystep
- `advancedPause` - pause, resume

**Configuration_backend.h:**
- `thermalProtection` - protection, safety

**Configuration_speed.h:**
- `motion` - feed, accel, jerk

---

## 📋 Workflow Example

### Step 1: Check Coverage
```bash
python firmware-helper/check-missing-mappings.py
```

Output shows 856 unmapped fields, including:
- TEMP_SENSOR_0 (critical)
- TEMP_SENSOR_BED (critical)
- Plus many optional fields

### Step 2: Build Critical Mappings
```bash
python firmware-helper/build-mappings.py
```

Choose option 1, enter: `TEMP_SENSOR_0, TEMP_SENSOR_BED`

Tool shows for each field:
```
Building mapping for: TEMP_SENSOR_0

📁 File: Configuration.h
💎 Value: 1
🏷️ Inferred Type: integer
📦 Suggested Category: thermistors

🔧 Mapping Configuration:
   1. Auto-generate with suggestions
   2. Customize interactively
   3. Skip this field

Choice (1-3): 1

✅ Generated Mapping:
   Category: thermistors
   Field: tempsensor0
   {
     "mapsFrom": ["TEMP_SENSOR_0"],
     "type": "integer",
     "required": true,
     "examples": [1],
     "th3dNotes": "Hotend thermistor type..."
   }

💾 Save this mapping? (y/n): y
✅ Saved to assets/data/maps/th3d/th3d-config-mapping.json
```

### Step 3: Verify
```bash
python firmware-helper/check-missing-mappings.py
```

Should now show:
```
✅ TEMP_SENSOR_0 is mapped
✅ TEMP_SENSOR_BED is mapped
```

---

## 🎯 Best Practices

### When to Add Mappings

**High Priority:**
1. Critical fields (motherboard, thermistors, thermal protection)
2. Safety features (endstops, watchdog)
3. Common user-configurable settings (bed size, steps/mm, speeds)

**Medium Priority:**
4. Advanced features (Linear Advance, Input Shaping)
5. Display/LCD settings
6. TMC driver settings

**Low Priority:**
7. Experimental features
8. Printer-specific overrides
9. Debug options

### Mapping Quality Checklist

- [ ] Type is correct (boolean, integer, float, string, array)
- [ ] Examples are realistic and helpful
- [ ] th3dNotes explain what the field does
- [ ] Validation rules are set (min/max for numbers)
- [ ] conditionalOn is used for dependent fields
- [ ] Category is appropriate
- [ ] Required is set correctly (true for critical fields)

---

## 📂 File Structure

```
firmware-helper/
├── check-missing-mappings.py   # Coverage checker
├── build-mappings.py            # Interactive builder
├── mapping-coverage-report.txt  # Generated report
└── MAPPING-TOOLS-README.md      # This file

assets/data/maps/th3d/
├── th3d-config-mapping.json                 # Configuration.h
├── th3d-config-adv-mapping-part1.json       # Configuration_adv.h (part 1)
├── th3d-config-adv-mapping-part2.json       # Configuration_adv.h (part 2)
├── th3d-config-adv-mapping-part3.json       # Configuration_adv.h (part 3)
├── th3d-config-adv-mapping-part4.json       # Configuration_adv.h (part 4)
├── th3d-config-backend-mapping.json         # Configuration_backend.h
└── th3d-config-speed-mapping.json           # Configuration_speed.h
```

---

## 🔧 Configuration

Both tools use these constants (edit if your paths differ):

```python
CONFIG_FILES = [
    "Test files\\Configuration.h",
    "Test files\\Configuration_adv.h",
    "Test files\\Configuration_backend.h",
    "Test files\\Configuration_speed.h"
]

MAPPING_FILES = {
    "config": "assets/data/maps/th3d/th3d-config-mapping.json",
    # ... etc
}
```

---

## 🎓 Tips

1. **Start with critical fields** - Use checker to identify them
2. **Use auto-generate** - It's usually accurate, customize only when needed
3. **Check comments** - The tool extracts comments from config files
4. **Batch process** - Do multiple fields at once to save time
5. **Verify with parser** - After adding mappings, test the parser in the browser

---

## 🐛 Troubleshooting

**"File not found" error:**
- Check CONFIG_FILES paths in the script
- Use `\\` (double backslash) for Windows paths

**"JSON decode error":**
- Mapping file may have syntax error
- Check for trailing commas or missing braces

**Type inference wrong:**
- Choose option 2 (customize) to override
- Or edit the mapping file directly after

**Category suggestion wrong:**
- Override when prompted
- Or move the entry manually in the JSON file

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] GUI version with field preview
- [ ] Automatic validation testing
- [ ] Bulk import from Marlin docs
- [ ] Diff viewer for mapping changes
- [ ] Integration with parser testing

---

Happy mapping! 🎉
