# Parser Improved Approach - Staging JSON with UI Field Mapping

## Overview
Create a temporary "staging JSON" that includes parsed values + UI field metadata from mappings. This staging data is temporary until user saves with a profile name.

---

## New Workflow

```
Configuration.h Upload
        ↓
Parse with mappings (include UI field IDs)
        ↓
Create Staging JSON
  {
    "parsedData": {
      "LINEAR_ADVANCE": {
        "value": true,
        "profilePath": "advanced.linearAdvance",
        "uiFieldId": "tab7_linearAdvanceEnabled",
        "tab": 7,
        "type": "boolean"
      },
      "X_BED_SIZE": {
        "value": 220,
        "profilePath": "bedSize.x",
        "uiFieldId": "tab4_bedSizeX",
        "tab": 4,
        "type": "integer"
      }
    },
    "metadata": {
      "firmwareType": "th3d",
      "firmwareVersion": "2.97a",
      "timestamp": "2024-01-01T00:00:00Z",
      "parseVariant": "th3d-2.97"
    }
  }
        ↓
Store in localStorage (temporary)
        ↓
Tabs pull data from staging JSON
        ↓
User enters profile name + clicks Save
        ↓
Convert staging JSON → Profile Object
        ↓
Save to profiles storage
```

---

## Key Components

### 1. Enhanced Mapping Files
Add UI field metadata to mappings:

```json
{
  "motion": {
    "linAdvance": {
      "mapsFrom": ["LINEAR_ADVANCE"],
      "type": "boolean",
      "profilePath": "advanced.linearAdvance",
      "uiFieldId": "tab7_linearAdvanceEnabled",
      "tab": 7,
      "label": "Linear Advance",
      "category": "motion"
    }
  }
}
```

### 2. Staging JSON Structure
```json
{
  "parsedData": {
    "DEFINE_NAME": {
      "value": <parsed_value>,
      "profilePath": "category.field",
      "uiFieldId": "tab#_fieldId",
      "type": "boolean|string|integer|float|array",
      "label": "Human Readable Name",
      "category": "motion|hardware|probe|etc"
    }
  },
  "metadata": {
    "firmwareType": "th3d",
    "firmwareVersion": "2.97a",
    "timestamp": "2024-01-01T00:00:00Z",
    "parseVariant": "th3d-2.97",
    "fileNames": ["Configuration.h", "Configuration_adv.h"],
    "totalFields": 148
  },
  "temporary": true,
  "profileName": null
}
```

**Note**: Tab number is extracted from `uiFieldId` prefix (e.g., "tab7_..." → tab 7)

### 3. Parser Output Enhancement
Modify parser to include UI metadata:

```javascript
parseDefineLine(line, stagingData) {
  // Extract: #define DEFINE_NAME value
  
  for (category, fields) in fieldMapping:
    for (fieldName, fieldSpec) in fields:
      if (fieldSpec.mapsFrom matches DEFINE_NAME):
        
        // Extract value
        value = extractValue(rawValue, fieldSpec.type)
        
        // Store with full metadata
        stagingData.parsedData[DEFINE_NAME] = {
          value: value,
          profilePath: fieldSpec.profilePath || `${category}.${fieldName}`,
          uiFieldId: fieldSpec.uiFieldId,
          tab: fieldSpec.tab,
          type: fieldSpec.type,
          label: fieldSpec.label || fieldName,
          category: category
        }
        return
}
```

### 4. Temporary Storage Manager
```javascript
const StagingDataManager = {
  
  // Save parsed data to localStorage (temporary)
  saveStagingData(stagingData) {
    localStorage.setItem('config_staging', JSON.stringify(stagingData));
    console.log('💾 Staging data saved temporarily');
  },
  
  // Load staging data
  loadStagingData() {
    const data = localStorage.getItem('config_staging');
    return data ? JSON.parse(data) : null;
  },
  
  // Check if staging data exists
  hasStagingData() {
    return localStorage.getItem('config_staging') !== null;
  },
  
  // Clear staging data
  clearStagingData() {
    localStorage.removeItem('config_staging');
    console.log('🗑️ Staging data cleared');
  },
  
  // Get value by UI field ID
  getValueByUiField(uiFieldId) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.uiFieldId === uiFieldId) {
        return data.value;
      }
    }
    return null;
  },
  
  // Get value by profile path
  getValueByPath(profilePath) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.profilePath === profilePath) {
        return data.value;
      }
    }
    return null;
  },
  
  // Get all fields for a specific tab
  getFieldsForTab(tabNumber) {
    const staging = this.loadStagingData();
    if (!staging) return [];
    
    return Object.entries(staging.parsedData)
      .filter(([_, data]) => data.tab === tabNumber)
      .map(([define, data]) => ({
        define,
        ...data
      }));
  },
  
  // Convert staging data to profile object
  convertToProfile(profileName) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    const profile = {
      id: Date.now().toString(),
      name: profileName,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      firmwareType: staging.metadata.firmwareType,
      firmwareVersion: staging.metadata.firmwareVersion
    };
    
    // Apply parsed values to profile
    for (const [define, data] of Object.entries(staging.parsedData)) {
      const path = data.profilePath.split('.');
      let current = profile;
      
      // Create nested structure
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      // Set value
      current[path[path.length - 1]] = data.value;
    }
    
    return profile;
  }
};
```

---

## Implementation Steps

### Step 1: Enhance Mapping Files
Add UI metadata to existing mappings:

```json
{
  "motion": {
    "linAdvance": {
      "mapsFrom": ["LINEAR_ADVANCE"],
      "type": "boolean",
      "profilePath": "advanced.linearAdvance",
      "uiFieldId": "tab7_linearAdvanceEnabled",
      "tab": 7
    }
  }
}
```

### Step 2: Modify Parser Output
Change parser to create staging JSON instead of config object:

**Before**:
```javascript
config.motion.linAdvance = true
```

**After**:
```javascript
stagingData.parsedData['LINEAR_ADVANCE'] = {
  value: true,
  profilePath: 'advanced.linearAdvance',
  uiFieldId: 'tab7_linearAdvanceEnabled',
  tab: 7,
  type: 'boolean'
}
```

### Step 3: Update parseConfigFiles()
```javascript
async parseConfigFiles(files, profile, context) {
  // ... existing code ...
  
  // Parse files
  const parser = window.MarlinConfigParser.create(variant);
  const stagingData = await parser.parseToStagingData(fileContents);
  
  // Save to temporary storage
  StagingDataManager.saveStagingData(stagingData);
  
  // Show success message
  alert(`✅ Configuration parsed!\n\n${stagingData.metadata.totalFields} fields imported.\n\nData is temporary until you save with a profile name.`);
  
  // Show staging data indicator
  this.showStagingDataBanner();
}
```

### Step 4: Add Staging Data Banner
```javascript
showStagingDataBanner() {
  const banner = document.createElement('div');
  banner.id = 'stagingDataBanner';
  banner.style.cssText = `
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    text-align: center;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  banner.innerHTML = `
    📋 <strong>Configuration Loaded (Temporary)</strong> - 
    Enter a profile name and click Save to keep this configuration.
    <button onclick="StagingDataManager.clearStagingData(); this.parentElement.remove();" 
      style="margin-left: 20px; padding: 4px 12px; border: 1px solid white; background: rgba(255,255,255,0.2); color: white; border-radius: 4px; cursor: pointer;">
      Discard
    </button>
  `;
  document.body.appendChild(banner);
}
```

### Step 5: Tab Data Population
Tabs pull data from staging JSON:

```javascript
// In tab render methods
render(profile, databases) {
  // Check for staging data first
  const stagingData = StagingDataManager.loadStagingData();
  
  if (stagingData) {
    // Get fields for this tab
    const tabFields = StagingDataManager.getFieldsForTab(7);  // Tab 7 example
    
    // Render with staged values
    return this.renderWithStagedData(tabFields);
  } else {
    // Normal render from profile
    return this.renderWithProfile(profile);
  }
}
```

### Step 6: Save Profile with Staging Data
```javascript
saveProfile() {
  const profileName = document.getElementById('profileName').value;
  
  if (!profileName) {
    alert('Please enter a profile name');
    return;
  }
  
  // Check for staging data
  const stagingData = StagingDataManager.loadStagingData();
  
  if (stagingData) {
    // Convert staging to profile
    const profile = StagingDataManager.convertToProfile(profileName);
    
    // Save profile
    StorageManager.saveProfile(profile);
    
    // Clear staging
    StagingDataManager.clearStagingData();
    
    // Remove banner
    document.getElementById('stagingDataBanner')?.remove();
    
    alert(`✅ Profile "${profileName}" saved successfully!`);
  } else {
    // Normal save flow
    // ...
  }
}
```

---

## Benefits

### 1. **Direct UI Integration**
- UI fields know exactly what data to display
- No need for complex applyParsedData translation
- Auto-populate forms directly from staging data

### 2. **Temporary Nature**
- Data doesn't pollute profile storage
- User can discard easily
- Only persists when explicitly saved

### 3. **Better Debugging**
- Can inspect raw parsed data
- Clear what values came from Configuration.h
- Trace field → UI → profile path

### 4. **Flexible Data Access**
```javascript
// Get by UI field ID
const value = StagingDataManager.getValueByUiField('tab7_linearAdvanceEnabled');

// Get by profile path
const value = StagingDataManager.getValueByPath('advanced.linearAdvance');

// Get all fields for tab
const fields = StagingDataManager.getFieldsForTab(7);
```

### 5. **Easy Export/Import**
```javascript
// Export parsed data to file
function exportStagingData() {
  const staging = StagingDataManager.loadStagingData();
  const blob = new Blob([JSON.stringify(staging, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parsed-config.json';
  a.click();
}
```

---

## Example Staging JSON

```json
{
  "parsedData": {
    "LINEAR_ADVANCE": {
      "value": true,
      "profilePath": "advanced.linearAdvance",
      "uiFieldId": "tab7_linearAdvanceEnabled",
      "tab": 7,
      "type": "boolean",
      "label": "Linear Advance",
      "category": "motion"
    },
    "LINEAR_ADVANCE_K": {
      "value": 0.1,
      "profilePath": "advanced.linearAdvanceK",
      "uiFieldId": "tab7_linearAdvanceK",
      "tab": 7,
      "type": "float",
      "label": "Linear Advance K Factor",
      "category": "motion"
    },
    "X_BED_SIZE": {
      "value": 220,
      "profilePath": "bedSize.x",
      "uiFieldId": "tab4_bedSizeX",
      "tab": 4,
      "type": "integer",
      "label": "Bed Width",
      "category": "geometry"
    },
    "BLTOUCH": {
      "value": true,
      "profilePath": "probe.type",
      "uiFieldId": "tab5_probeType",
      "tab": 5,
      "type": "boolean",
      "label": "BLTouch Probe",
      "category": "probe"
    }
  },
  "metadata": {
    "firmwareType": "th3d",
    "firmwareVersion": "2.97a",
    "timestamp": "2024-01-01T00:30:00Z",
    "parseVariant": "th3d-2.97",
    "fileNames": [
      "Configuration.h",
      "Configuration_adv.h",
      "Configuration_backend.h",
      "Configuration_speed.h"
    ],
    "totalFields": 148
  },
  "temporary": true,
  "profileName": null
}
```

---

## Next Steps

1. **Update mapping files** - Add `profilePath`, `uiFieldId`, `tab` fields
2. **Modify parser** - Output staging JSON format
3. **Create StagingDataManager** - Handle temporary storage
4. **Update tabs** - Pull data from staging when available
5. **Add save flow** - Convert staging → profile on save
6. **UI indicators** - Show banner when staging data exists

Would you like me to start implementing this approach?
