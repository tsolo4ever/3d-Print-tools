# Automated Mapping Workflow

## 🎯 One-Command Mapping Generation

The `create-comprehensive-mappings.py` script now automatically creates organized, production-ready mapping files with a single command!

---

## 🚀 Quick Start

### Auto-Scan Mode (Recommended)

Place your Configuration.h files in `new configs/` directory:

```
new configs/
├── marlin/
│   └── 2.1.x/
│       ├── Configuration.h
│       └── Configuration_adv.h
└── th3d/
    └── TH3D UFW 2.97a/
        ├── Configuration.h
        ├── Configuration_adv.h
        ├── Configuration_backend.h
        └── Configuration_speed.h
```

Then run:

```bash
python firmware-helper/create-comprehensive-mappings.py --scan
```

**That's it!** The script will automatically:
1. ✅ Scan for all .h files
2. ✅ Parse and extract #defines
3. ✅ Create organized full/ and core/ folders
4. ✅ Generate part files + consolidated files
5. ✅ Split into core mappings
6. ✅ Add UI field mappings

---

## 📦 What Gets Created

### Organized Output Structure

```
assets/data/maps/th3d/2.97a/
├── full/                                    # Complete mappings (reference)
│   ├── th3d-config-mapping-part1.json       # Part files (for large configs)
│   ├── th3d-config-mapping-part2.json
│   ├── ...
│   ├── th3d-config-mapping-full.json        # ← Consolidated full mapping
│   ├── th3d-config-adv-mapping-full.json
│   ├── th3d-config-backend-mapping-full.json
│   └── th3d-config-speed-mapping-full.json
│
└── core/                                    # Parser-ready mappings
    ├── th3d-config-mapping-core.json        # ← Core fields only + UI mappings
    ├── th3d-config-adv-mapping-core.json
    ├── th3d-config-backend-mapping-core.json
    └── th3d-config-speed-mapping-core.json
```

---

## 🔧 Advanced Usage

### Scan Specific Firmware

```bash
# Only process TH3D firmware
python firmware-helper/create-comprehensive-mappings.py --scan --firmware th3d

# Only process specific version
python firmware-helper/create-comprehensive-mappings.py --scan --version 2.97a

# Combine filters
python firmware-helper/create-comprehensive-mappings.py --scan --firmware th3d --version 2.97a
```

### Manual Mode (Single File)

```bash
python firmware-helper/create-comprehensive-mappings.py \
  --config "path/to/Configuration.h" \
  --firmware th3d \
  --version 2.97a
```

### Legacy Mode (No Organization)

Skip automatic organization for backward compatibility:

```bash
python firmware-helper/create-comprehensive-mappings.py --scan --skip-organization
```

This creates files directly in the version folder without full/core/ structure.

---

## 🎨 Automated Steps Explained

### Step 1: Parse Configuration Files

```
🔧 Parsing Configuration.h...
   Firmware: th3d
   Version: 2.97a
✅ Found 224 #define statements
```

### Step 2: Build Category Mappings

```
📊 Building comprehensive mappings...
✅ Created 11 category mappings:
   • basic: 12 fields
   • hardware: 35 fields
   • motion: 28 fields
   ...
```

### Step 3: Split Into Parts

```
✂️  Splitting into parts (<900 lines each)...
💾 Step 1: Saving 5 part file(s) to full/...
   ✅ th3d-config-mapping-part1.json (847 lines)
   ✅ th3d-config-mapping-part2.json (823 lines)
   ...
```

### Step 4: Create Consolidated Full Mapping

```
📦 Step 2: Creating consolidated full mapping...
   ✅ th3d-config-mapping-full.json (224 defines)
```

### Step 5: Extract Core Fields

```
🎯 Step 3: Splitting core fields from full mapping...
   ✅ Loaded 140 core field definitions
   ✅ Extracted 70 core fields
   ✅ Updated th3d-config-mapping-full.json with fullDefines metadata
```

### Step 6: Save Core Mappings

```
💎 Step 4: Saving core mapping to core/...
   ✅ th3d-config-mapping-core.json (70 core defines)
```

### Step 7: Add UI Field Mappings

```
🎨 Step 5: Adding UI field mappings to core file...
   ✅ Loaded 80 UI field mappings
   ✅ Added 13 UI field mappings to core file
```

### Final Summary

```
============================================================
✨ Complete! Generated organized mappings for th3d 2.97a

📁 Output structure:
   assets/data/maps/th3d/2.97a/
   ├── full/
   │   ├── 5 part file(s)
   │   └── th3d-config-mapping-full.json (224 total defines)
   └── core/
       └── th3d-config-mapping-core.json (70 core defines, 13 UI mappings)
============================================================
```

---

## 🔄 Updating Workflows

### Adding New Core Fields

1. Edit `firmware-helper/split-core-mappings.py`:
   ```python
   CORE_FIELDS = {
       # ... existing fields ...
       'NEW_FIELD_NAME',  # Add your field
   }
   ```

2. Re-run mapping generation:
   ```bash
   python firmware-helper/create-comprehensive-mappings.py --scan
   ```

   The script automatically uses the updated CORE_FIELDS set!

### Adding New UI Mappings

1. Edit `firmware-helper/add-ui-mappings.py`:
   ```python
   UI_FIELD_MAPPINGS = {
       # ... existing mappings ...
       'NEW_DEFINE': 'newHtmlInputId',
   }
   ```

2. Re-run mapping generation:
   ```bash
   python firmware-helper/create-comprehensive-mappings.py --scan
   ```

   The script automatically applies new UI mappings!

---

## 📊 Benefits Over Manual Workflow

### Before (Manual - 5 Steps)

```bash
# Step 1: Generate mappings
python firmware-helper/create-comprehensive-mappings.py --scan

# Step 2: Create folders
mkdir -p assets/data/maps/th3d/2.97a/{full,core}

# Step 3: Split core fields
python firmware-helper/split-core-mappings.py \
  --input-dir assets/data/maps/th3d/2.97a/full \
  --output-dir assets/data/maps/th3d/2.97a/core

# Step 4: Move files
mv assets/data/maps/th3d/2.97a/*-part*.json assets/data/maps/th3d/2.97a/full/
mv assets/data/maps/th3d/2.97a/*-core.json assets/data/maps/th3d/2.97a/core/

# Step 5: Add UI mappings
python firmware-helper/add-ui-mappings.py \
  --mapping-dir assets/data/maps/th3d/2.97a/core \
  --pattern "*-core.json"
```

### After (Automated - 1 Command)

```bash
python firmware-helper/create-comprehensive-mappings.py --scan
```

**Result:** Same output, 80% less work! 🎉

---

## 🐛 Troubleshooting

### Script Can't Load CORE_FIELDS

**Error:**
```
⚠️  Warning: Could not load CORE_FIELDS: ...
⏭️  Skipping core/full split
```

**Solution:** Ensure `split-core-mappings.py` exists and has CORE_FIELDS defined.

### Script Can't Load UI_FIELD_MAPPINGS

**Error:**
```
⚠️  Warning: Could not add UI mappings: ...
ℹ️  Core file saved without UI mappings
```

**Solution:** Ensure `add-ui-mappings.py` exists and has UI_FIELD_MAPPINGS defined.

### No Config Files Found

**Error:**
```
❌ No .h files found in new configs/
```

**Solution:** Place your Configuration.h files in the expected directory structure:
- `new configs/firmware_name/version/Configuration.h`

---

## 📚 Related Documentation

- **Mapping Structure:** `assets/data/maps/th3d/2.97a/MAPPING_STRUCTURE.md`
- **Parser Integration:** `assets/data/maps/th3d/2.97a/PARSER_INTEGRATION_GUIDE.md`
- **Core Fields Definition:** `firmware-helper/split-core-mappings.py`
- **UI Field Mappings:** `firmware-helper/add-ui-mappings.py`
- **Mapping Schema:** `assets/data/maps/FIELD_MAPPING_SCHEMA.md`

---

## ✨ Summary

**One command. Complete workflow. Production-ready output.**

```bash
python firmware-helper/create-comprehensive-mappings.py --scan
```

That's all you need! 🚀
