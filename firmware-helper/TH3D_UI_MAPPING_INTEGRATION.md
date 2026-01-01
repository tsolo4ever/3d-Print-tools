# TH3D UI Field Mapping Integration

## Overview
The mapping generator now automatically adds TH3D-specific UI field mappings when creating core mapping files.

## What Changed

### 1. Updated `add-ui-mappings.py`
Added TH3D-specific field mappings to `UI_FIELD_MAPPINGS` dictionary:

```python
UI_FIELD_MAPPINGS = {
    # Tab 1: Printer Info
    'CUSTOM_MACHINE_NAME': 'tab1_profileName',      # Standard Marlin
    'USER_PRINTER_NAME': 'tab1_profileName',        # ✨ TH3D-specific
    'UNIFIED_VERSION': 'tab1_firmwareVersion',      # ✨ TH3D-specific
    'SHORT_BUILD_VERSION': 'tab1_firmwareVersion',  # Standard Marlin
    # ... rest of mappings
}
```

## How It Works

### Generator Workflow
When you run `create-comprehensive-mappings.py --scan`, it:

1. **Parses Configuration.h** files from `new configs/th3d/` directory
2. **Extracts all #defines** and categorizes them
3. **Creates full mappings** with all fields
4. **Splits into core mappings** (essential fields only)
5. **🆕 Automatically adds UI field IDs** by:
   - Loading `UI_FIELD_MAPPINGS` from `add-ui-mappings.py`
   - Matching each define name against the mappings
   - Adding `"uiFieldId": "tabN_fieldName"` property

### Example Output
For TH3D Configuration.h with `#define USER_PRINTER_NAME "Maxy"`:

**Generated core mapping:**
```json
{
  "other_2": {
    "userPrinterName": {
      "mapsFrom": ["USER_PRINTER_NAME"],
      "type": "string",
      "required": true,
      "fileLocation": "Configuration.h",
      "lineNumber": 282,
      "examples": ["\"Maxy\""],
      "uiFieldId": "tab1_profileName"  // ✨ Automatically added
    }
  }
}
```

## TH3D-Specific Mappings

### Currently Mapped
| TH3D Define | UI Field ID | Tab | Description |
|-------------|-------------|-----|-------------|
| `USER_PRINTER_NAME` | `tab1_profileName` | 1 | Custom printer name |
| `UNIFIED_VERSION` | `tab1_firmwareVersion` | 1 | TH3D firmware version |

### Standard Marlin Equivalents
| Marlin Define | TH3D Define | Maps To |
|---------------|-------------|---------|
| `CUSTOM_MACHINE_NAME` | `USER_PRINTER_NAME` | `tab1_profileName` |
| `SHORT_BUILD_VERSION` | `UNIFIED_VERSION` | `tab1_firmwareVersion` |

## Regenerating Mappings

To update TH3D mappings with the new UI field IDs:

### Option 1: Regenerate All TH3D Mappings
```bash
cd firmware-helper
python create-comprehensive-mappings.py --scan --firmware th3d
```

### Option 2: Regenerate Specific Version
```bash
python create-comprehensive-mappings.py --scan --firmware th3d --version "TH3D UFW 2.97a"
```

### Option 3: Add UI Mappings to Existing Core Files
```bash
python add-ui-mappings.py --mapping-dir "assets/data/maps/th3d/TH3D UFW 2.97a/core"
```

## Verification

After regeneration, verify UI mappings:

```bash
python validate-ui-mappings.py --version th3d
```

Expected output:
```
✅ Tab 1: 2/2 fields mapped (100%)
   USER_PRINTER_NAME → tab1_profileName ✅
   UNIFIED_VERSION → tab1_firmwareVersion ✅
```

## Adding New TH3D Fields

To add more TH3D-specific UI mappings:

1. **Edit `add-ui-mappings.py`:**
   ```python
   UI_FIELD_MAPPINGS = {
       # ... existing mappings
       'NEW_TH3D_DEFINE': 'tabN_newField',  # Add your mapping
   }
   ```

2. **Regenerate mappings:**
   ```bash
   python create-comprehensive-mappings.py --scan --firmware th3d
   ```

3. **Verify:**
   ```bash
   python validate-ui-mappings.py --version th3d
   ```

## Integration with Parser

The parser automatically uses these mappings:

```javascript
// Parser extracts define and includes UI field ID in metadata
{
  "_metadata": {
    "other_2.userPrinterName": {
      "defineName": "USER_PRINTER_NAME",
      "uiFieldId": "tab1_profileName",  // From mapping
      "type": "string",
      "value": "Maxy"
    }
  }
}

// Later, UI can populate field automatically
const uiFieldId = metadata.uiFieldId;  // "tab1_profileName"
document.getElementById(uiFieldId).value = parsedValue;  // Auto-populate!
```

## Benefits

✅ **No Manual Editing** - UI mappings added automatically during generation  
✅ **TH3D-Aware** - Recognizes TH3D-specific defines  
✅ **Consistent** - Same mapping logic for Marlin and TH3D  
✅ **Maintainable** - Single source of truth in `add-ui-mappings.py`  
✅ **Backward Compatible** - Existing mappings still work  

## Status

- ✅ `USER_PRINTER_NAME` → `tab1_profileName` mapping added
- ✅ `UNIFIED_VERSION` → `tab1_firmwareVersion` mapping added
- ✅ Generator integrates UI mappings automatically
- ⏳ Need to regenerate TH3D mappings to apply changes
- ⏳ Need to add more TH3D-specific mappings as needed

## Next Steps

1. **Regenerate TH3D mappings** with updated UI mappings:
   ```bash
   python create-comprehensive-mappings.py --scan --firmware th3d
   ```

2. **Validate** the updated mappings:
   ```bash
   python validate-ui-mappings.py --version th3d
   ```

3. **Test** with actual TH3D config import in UI

4. **Add more mappings** as needed for other TH3D-specific defines
