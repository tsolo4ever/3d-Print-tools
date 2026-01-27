# Parser Debug Guide

## How to Debug Parsing Issues

### Step 1: Upload Configuration Files

1. Open the Printer Profiles tool
2. Click "Import from Configuration.h"
3. Upload your Configuration.h files

### Step 2: Download Debug Log

After parsing completes, open the browser console and run:

```javascript
// Get the parsed configuration from staging data
const stagingData = window.StagingDataManager?.loadStagingData();
const parsedConfig = stagingData.parsedConfig; // This has the _debugLog

// Download the debug log
window.downloadDebugLog(parsedConfig);
```

This will download a JSON file with all parsing activity.

### Step 3: Analyze Debug Log

The debug log contains these entry types:

#### Entry Types

- **INFO**: General information (file count, mapping variant)
- **DEFINE_FOUND**: Every `#define` statement found in the file
- **MAPPING_MATCH**: When a define matches a field in the mapping
- **EXTRACTED**: When a value is successfully extracted and stored
- **CONDITIONAL_SKIP**: When a field is skipped due to conditional requirements
- **NOT_IN_MAPPING**: When a define is not found in the mapping file
- **SUMMARY**: Final parsing summary

### Step 4: Search for Your Field

Look for USER_PRINTER_NAME in the debug log:

#### Scenario 1: DEFINE_FOUND but NOT_IN_MAPPING
```json
{
  "level": "DEFINE_FOUND",
  "message": "Found: #define USER_PRINTER_NAME \"Maxy\""
}
{
  "level": "NOT_IN_MAPPING",
  "message": "USER_PRINTER_NAME not found in mapping"
}
```
**Solution**: The field is not in the core mapping file. Need to add it.

#### Scenario 2: MAPPING_MATCH but CONDITIONAL_SKIP
```json
{
  "level": "MAPPING_MATCH",
  "message": "USER_PRINTER_NAME matches other_2.userPrinterName"
}
{
  "level": "CONDITIONAL_SKIP",
  "message": "USER_PRINTER_NAME skipped: conditionalOn: CUSTOM_PRINTER_NAME",
  "data": {
    "conditionalOn": ["CUSTOM_PRINTER_NAME"]
  }
}
```
**Solution**: The field has a conditional requirement that isn't met. Check if CUSTOM_PRINTER_NAME is defined.

#### Scenario 3: No DEFINE_FOUND entry
The define wasn't encountered during parsing. Possible causes:
- It's inside a false conditional block (#if that evaluated to false)
- It's commented out
- It's in a different file that wasn't parsed

### Step 5: Common Issues

#### Issue: Field Has conditionalOn Requirements

Many TH3D fields have `conditionalOn` properties like:

```json
{
  "conditionalOn": ["ENDER3_V2", "CUSTOM_PRINTER_NAME"]
}
```

This means at least one of these must be a global conditional (defined outside any #if block) or the parser will skip the field.

**Fix**: Either:
1. Remove the conditional from the mapping (if not needed)
2. Ensure the required conditional is defined

#### Issue: Field Inside False Conditional Block

Example from your Configuration.h:
```c
#if ENABLED(CUSTOM_PRINTER_NAME)
  #define USER_PRINTER_NAME "Maxy"
#endif
```

If `CUSTOM_PRINTER_NAME` is not defined or is inside a conditional, the parser will skip everything inside that block.

**Fix**: Check your Configuration.h to see if the field is inside conditionals and ensure those conditionals are true.

### Step 6: Verify Mapping File

Check the core mapping file at:
`assets/data/maps/th3d/TH3D UFW 2.97a/core/th3d-config-mapping-core.json`

Search for your field:
```json
"userPrinterName": {
  "mapsFrom": ["USER_PRINTER_NAME"],
  "type": "string",
  "required": true,
  "fileLocation": "Configuration.h",
  "lineNumber": 282,
  "examples": ["\"Maxy\""],
  "uiFieldId": "tab1_profileName"
}
```

Check:
- ✅ `mapsFrom` matches the #define name
- ✅ `type` is correct
- ✅ `uiFieldId` is set correctly
- ⚠️ Check if there are any `conditionalOn`, `conditionalOnAll`, or `conditionalOnNot` properties

## Quick Debug Commands

### In Browser Console:

```javascript
// Load staging data
const staging = window.StagingDataManager?.loadStagingData();

// See how many fields were parsed
console.log('Parsed fields:', Object.keys(staging.parsedConfig._metadata).length);

// See which fields have UI mappings
Object.entries(staging.parsedConfig._metadata)
  .filter(([k,v]) => v.uiFieldId)
  .forEach(([k,v]) => console.log(`${v.defineName} → ${v.uiFieldId}`));

// Search debug log for specific define
staging.parsedConfig._debugLog
  .filter(e => e.message.includes('USER_PRINTER_NAME'))
  .forEach(e => console.log(e.level, e.message, e.data));

// Download full debug log
window.downloadDebugLog(staging.parsedConfig);
```

## Expected Output

For USER_PRINTER_NAME to work, you should see this sequence in the debug log:

1. **DEFINE_FOUND**: `Found: #define USER_PRINTER_NAME "Maxy"`
2. **MAPPING_MATCH**: `USER_PRINTER_NAME matches other_2.userPrinterName`
3. **EXTRACTED**: `USER_PRINTER_NAME → other_2.userPrinterName` with `uiFieldId: "tab1_profileName"`

If any step is missing, that's where the problem is.

## Next Steps

Based on the debug log analysis:

1. If NOT_IN_MAPPING: Add the field to the core mapping file
2. If CONDITIONAL_SKIP: Fix the conditional requirements
3. If no DEFINE_FOUND: Check if it's inside a false conditional block
4. If EXTRACTED but UI not populating: Check UI field ID matches the HTML element ID

## Test with Example File

Use the files in `test files/` directory which contain:
- `USER_PRINTER_NAME "Maxy"` 
- `UNIFIED_VERSION "TH3D UFW 2.97a"`

Both should be extracted and the debug log should show EXTRACTED entries for both.
