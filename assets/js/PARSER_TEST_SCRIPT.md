# Parser Test Script - USER_PRINTER_NAME Diagnosis

## Quick Diagnostic Test

Open browser console after loading `index.html` and run these commands step by step:

### Step 1: Verify Parser Setup
```javascript
// Check which parser variant is loaded
console.log('Parser variant:', TH3DConfigParser.mappingConfig.name);

// Should show: "TH3D Unified Firmware (Fallback)"
// We need to use the 2.97a core mappings instead!
```

### Step 2: Create Correct Parser Instance
```javascript
// Create parser with correct mapping set
const parser = MarlinConfigParser.create('th3d-2.97');
console.log('✅ Created parser:', parser.mappingConfig.name);
```

### Step 3: Test with Configuration.h Content
```javascript
// Paste this in console (simulates the test file content)
const testConfig = `
#define UNIFIED_VERSION "TH3D UFW 2.97a"
#define ENDER3_MAX
#define CUSTOM_ESTEPS
#define CUSTOM_ESTEPS_VALUE 425
#define DIRECT_DRIVE_PRINTER
#define CUSTOM_PRINTER_NAME
#define USER_PRINTER_NAME "Maxy"
#define BLTOUCH
#define EZABL_POINTS 11
#define EZABL_PROBE_EDGE 15
#define LINEAR_ADVANCE
#define LINEAR_ADVANCE_K 0.10
`;

// Parse it
parser.parseConfigFile(testConfig).then(config => {
  window.testConfig = config;
  console.log('✅ Parsing complete');
  console.log('📊 Fields extracted:', Object.keys(config._metadata).length);
  console.log('👤 USER_PRINTER_NAME value:', config.other_2?.userPrinterName);
  console.log('🔍 Field metadata:', config._metadata['other_2.userPrinterName']);
});
```

### Step 4: Check Debug Log for USER_PRINTER_NAME
```javascript
// Search debug log for USER_PRINTER_NAME
const userNameLogs = window.testConfig._debugLog.filter(entry => 
  entry.message.includes('USER_PRINTER_NAME')
);
console.log('📝 USER_PRINTER_NAME debug entries:', userNameLogs);

// Download full debug log
downloadDebugLog(window.testConfig);
```

### Step 5: Check UI Field Population
```javascript
// See which fields have uiFieldId
const fieldsWithUI = Object.entries(window.testConfig._metadata)
  .filter(([key, meta]) => meta.uiFieldId)
  .map(([key, meta]) => ({
    field: key,
    uiFieldId: meta.uiFieldId,
    value: key.split('.').reduce((obj, prop) => obj?.[prop], window.testConfig)
  }));

console.table(fieldsWithUI);
```

## Expected Results

If everything works correctly, you should see:

```javascript
// Step 3 output:
✅ Parsing complete
📊 Fields extracted: 15-20
👤 USER_PRINTER_NAME value: "Maxy"
🔍 Field metadata: {
  defineName: "USER_PRINTER_NAME",
  category: "other_2",
  fieldName: "userPrinterName",
  type: "string",
  uiFieldId: "tab1_profileName",
  profilePath: "other_2.userPrinterName"
}

// Step 5 output (partial):
field: "other_2.userPrinterName"
uiFieldId: "tab1_profileName"
value: "Maxy"
```

## Common Issues & Solutions

### Issue 1: Parser using wrong mapping set
**Symptom:** `parser.mappingConfig.name` shows "TH3D Unified Firmware (Fallback)"
**Solution:** Use `MarlinConfigParser.create('th3d-2.97')` instead of default `TH3DConfigParser`

### Issue 2: USER_PRINTER_NAME shows "CONDITIONAL_SKIP" in debug log
**Symptom:** Debug log shows field was skipped due to conditionals
**Solution:** Check which conditionals are active:
```javascript
console.log('Active conditionals:', Array.from(parser.globalConditionals));
```

### Issue 3: USER_PRINTER_NAME shows "NOT_IN_MAPPING"
**Symptom:** Debug log shows field not found in mapping
**Solution:** Verify mapping file loaded:
```javascript
parser.loadFieldMapping().then(mapping => {
  console.log('Mapping categories:', Object.keys(mapping));
  console.log('other_2 fields:', Object.keys(mapping.other_2));
});
```

### Issue 4: Field extracts but UI doesn't populate
**Symptom:** Field in config but `tab1_profileName` input is empty
**Solution:** Check staging data population:
```javascript
// After file upload, check staging data
const staging = StagingDataManager.loadStagingData();
console.log('Staging data exists:', !!staging);
console.log('Profile name in staging:', staging?.parsedConfig?.other_2?.userPrinterName);

// Check if UI population was attempted
console.log('UI population function exists:', typeof EnhancedPrinterProfiles?.populateUIFromStagingData);
```

## Root Cause Analysis

Based on the mapping file structure, `USER_PRINTER_NAME` is in the `other_2` category:

```json
"other_2": {
  "userPrinterName": {
    "mapsFrom": ["USER_PRINTER_NAME"],
    "type": "string",
    "required": true,
    "fileLocation": "Configuration.h",
    "lineNumber": 282,
    "examples": ["\"Maxy\""],
    "uiFieldId": "tab1_profileName"
  }
}
```

This field has:
- ✅ Correct mapsFrom
- ✅ Correct type (string)
- ✅ Correct uiFieldId
- ✅ NO conditional requirements (should always parse if found)

If it's not parsing, the issue is likely:
1. Wrong parser variant being used (need 'th3d-2.97' not 'th3d-default')
2. File content not reaching the parser
3. UI population logic not using the correct mapping

## Next Steps

1. Run the diagnostic tests above
2. Share the output of Step 4 (debug log entries for USER_PRINTER_NAME)
3. Share the output of Step 5 (fields with uiFieldId)
4. If debug log shows "CONDITIONAL_SKIP", share the active conditionals
5. If debug log shows "NOT_IN_MAPPING", check which mapping files loaded
