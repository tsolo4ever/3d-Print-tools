# New Configuration Files Directory

This directory contains Marlin and TH3D firmware configuration files organized by firmware type and version.

## 📁 Directory Structure

```
new configs/
├── marlin/
│   ├── 2.0.x/          # Marlin 2.0.x configuration files
│   └── 2.1.x/          # Marlin 2.1.x configuration files
└── th3d/
    ├── 2.0.x/          # TH3D 2.0.x configuration files
    └── 3.0.x/          # TH3D 3.0.x configuration files
```

## 📥 Adding Configuration Files

Place your firmware configuration files in the appropriate directory:

1. **Marlin Firmware:**
   - `Configuration.h` → `new configs/marlin/{version}/`
   - `Configuration_adv.h` → `new configs/marlin/{version}/`

2. **TH3D Firmware:**
   - `Configuration.h` → `new configs/th3d/{version}/`
   - `Configuration_adv.h` → `new configs/th3d/{version}/`
   - `Configuration_backend.h` → `new configs/th3d/{version}/`
   - `Configuration_speed.h` → `new configs/th3d/{version}/`

## 🔧 Using with Mapping Scripts

### **RECOMMENDED: Complete Three-Pass Processor**

Use `process-all-mappings.py` to automatically run all three passes:

```bash
# Auto-scan and process ALL config files
python firmware-helper/process-all-mappings.py --scan

# Process specific firmware
python firmware-helper/process-all-mappings.py --scan --firmware marlin

# Process specific version
python firmware-helper/process-all-mappings.py --scan --version 2.1.x

# Manual mode (single file)
python firmware-helper/process-all-mappings.py \
  --config "new configs/marlin/2.1.x/Configuration.h" \
  --version 2.1.x \
  --firmware marlin
```

**What it does:**
- **Pass 1:** Creates basic mapping structure (field names, types, line numbers)
- **Pass 2:** Adds conditional dependencies (#ifdef, #ifndef, #if)
- **Pass 3:** Adds validation rules (ranges, units, allowed values)

### **Individual Scripts (Advanced Use)**

Run passes separately if needed:

```bash
# Pass 1 only: Basic mappings
python firmware-helper/create-comprehensive-mappings.py --scan

# Pass 2 only: Conditionals
python firmware-helper/analyze-conditionals.py \
  --mapping-dir assets/data/maps/marlin/2.1.x \
  --config "new configs/marlin/2.1.x/Configuration.h"

# Pass 3 only: Validation
python firmware-helper/analyze-validation.py \
  --mapping-dir assets/data/maps/marlin/2.1.x \
  --config "new configs/marlin/2.1.x/Configuration.h"
```

## 📤 Output Location

The script automatically creates versioned mapping files in:
- `assets/data/maps/{firmware}/{version}/`

## 🎯 Workflow

1. **Add config files** to the appropriate version directory
2. **Run the script** pointing to your config file
3. **Mappings are generated** in `assets/data/maps/`
4. **Review and commit** the generated mapping files

## 📝 Naming Convention

Config files should be named clearly to indicate their source:
- `Configuration.h` (standard name)
- `Configuration_adv.h` (advanced settings)
- `ender5plus-Configuration.h` (specific printer)
- `th3d-unified-Configuration.h` (TH3D unified firmware)

The script will automatically detect and handle different file types.

## 🚀 Benefits

✅ **No Git Submodules** - Direct file access without submodule complexity  
✅ **Version Organization** - Easy to maintain multiple firmware versions  
✅ **Flexible Workflow** - Add configs as needed without git dependencies  
✅ **Automated Mapping** - Script generates mappings automatically  

## ⚠️ Note

This directory is meant for **local configuration files** that you want to parse for mapping generation. These files are typically not committed to the repository (add to `.gitignore` if needed).
