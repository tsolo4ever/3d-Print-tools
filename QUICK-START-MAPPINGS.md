# 🚀 Quick Start: Generate Firmware Mappings

Super simple guide to generate firmware configuration mappings!

## 📝 Step 1: Add Your Config Files

Place your firmware `.h` files in the appropriate folder:

```
new configs/
├── marlin/
│   ├── 2.0.x/    ← Put Marlin 2.0.x files here
│   └── 2.1.x/    ← Put Marlin 2.1.x files here
└── th3d/
    ├── 2.0.x/    ← Put TH3D 2.0.x files here
    └── 3.0.x/    ← Put TH3D 3.0.x files here
```

**Example:**
- `new configs/marlin/2.1.x/Configuration.h`
- `new configs/marlin/2.1.x/Configuration_adv.h`
- `new configs/th3d/3.0.x/Configuration.h`

## ⚡ Step 2: Generate Mappings

### Windows (Pick One):

**Option 1 - Batch File (Easiest):**
Just **double-click** this file:
```
generate-mappings.bat
```

**Option 2 - PowerShell (Pretty Colors):**
Right-click and "Run with PowerShell" or run:
```powershell
.\generate-mappings.ps1
```

### Mac/Linux:
Run this in terminal:
```bash
bash generate-mappings.sh
```

### Command Line (Any OS):
```bash
python firmware-helper/process-all-mappings.py --scan
```

## ✅ Step 3: Done!

Generated mappings will be in:
```
assets/data/maps/
├── marlin/
│   ├── 2.0.x/
│   └── 2.1.x/
└── th3d/
    ├── 2.0.x/
    └── 3.0.x/
```

That's it! The script automatically:
- ✅ Finds all your config files
- ✅ Detects firmware type (marlin/th3d)
- ✅ Detects version (from folder name)
- ✅ Runs 4 passes to create complete mappings
- ✅ Splits into core (for parsing) and full (reference)
- ✅ Saves everything in the right place

---

## 🔧 Advanced Options

### Process Only Marlin Files
```bash
python firmware-helper/process-all-mappings.py --scan --firmware marlin
```

### Process Only Specific Version
```bash
python firmware-helper/process-all-mappings.py --scan --version 2.1.x
```

### Process Single File Manually
```bash
python firmware-helper/process-all-mappings.py \
  --config "path/to/Configuration.h" \
  --version 2.1.x \
  --firmware marlin
```

---

## ❓ Troubleshooting

**"No .h files found"**
- Make sure you placed files in the correct folders under `new configs/`
- Check that files have `.h` extension

**"Python not found"**
- Install Python 3.7+ from python.org
- Make sure Python is in your PATH

**"Script fails"**
- Check that your .h files are valid Marlin/TH3D configuration files
- Look at the error message for specific file causing issues

---

## 📚 What Are These Mappings For?

These mapping files help the web-based configuration parser understand:
- What each `#define` does
- What values are valid
- Which settings depend on others
- Units and ranges for numeric values

The JavaScript parsers (`marlin-config-parser.js` and `th3d-config-parser.js`) use these mappings to parse user-uploaded configuration files in the browser.

---

## 🎯 Need Help?

See the detailed documentation:
- `new configs/README.md` - Complete usage guide
- `firmware-helper/README.md` - Technical details
- `firmware-helper/TH3D-PARSER-REFERENCE.md` - TH3D-specific info
