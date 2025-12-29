# Enhanced Profiles Refactor Plan
## JSON-Driven UI Architecture

**Status:** Planning Phase  
**Created:** 2025-12-28  
**Goal:** Reduce `enhanced-printer-profiles.js` from 1,641 lines to ~300 lines by using JSON-driven field rendering

---

## 🎯 Problem Statement

### Current Issues:
1. **1,641 lines** of mostly hardcoded HTML in `enhanced-printer-profiles.js`
2. **10 tabs** each with `renderTabX()` methods containing manual HTML string concatenation
3. **Duplicate field definitions** - fields defined in both:
   - Parser mapping JSON (`th3d-config-mapping.json`, etc.)
   - Enhanced profiles UI (hardcoded)
4. **Difficult to maintain** - adding a field requires touching multiple places
5. **No single source of truth** for field definitions

### What We Have:
- ✅ Parser with JSON field mappings (`marlin-config-parser.js`)
- ✅ Field mapping JSONs in `assets/data/maps/th3d/` and `assets/data/maps/marlin/`
- ✅ Working parser that outputs structured config object
- ✅ Field metadata: `type`, `required`, `validation`, `default`, `mapsFrom`

---

## 🏗️ Proposed Architecture

### 1. Single Source of Truth: JSON Field Definitions

**File:** `assets/js/profile-field-definitions.json`

This file will define ALL form fields for all 10 tabs:

```json
{
  "$schema": "Profile Field Definitions v1.0",
  "tabs": {
    "tab1_printerInfo": {
      "title": "Printer Information",
      "icon": "📋",
      "order": 1,
      "sections": [
        {
          "title": "Basic Information",
          "fields": [
            {
              "id": "profileName",
              "label": "Profile Name",
              "type": "text",
              "required": true,
              "placeholder": "e.g., My Ender 5 Plus",
              "profilePath": "name",
              "parserPath": "basic.machineName",
              "helpText": "Friendly name for this printer profile"
            },
            {
              "id": "firmwareType",
              "label": "Firmware Type",
              "type": "select",
              "required": true,
              "profilePath": "firmwareType",
              "parserPath": "basic.firmwareType",
              "options": [
                {"value": "marlin", "label": "Marlin"},
                {"value": "th3d", "label": "TH3D (Marlin Fork)"},
                {"value": "klipper", "label": "Klipper"}
              ]
            }
          ]
        }
      ]
    },
    "tab2_hardware": {
      "title": "Hardware Configuration",
      "icon": "⚙️",
      "order": 2,
      "sections": [
        {
          "title": "Motherboard",
          "fields": [
            {
              "id": "hardwareBoard",
              "label": "Motherboard",
              "type": "database-select",
              "required": true,
              "profilePath": "hardware.board",
              "parserPath": "basic.motherboard",
              "database": "marlin-boards",
              "displayFormat": "{name} ({mcu})",
              "allowCustom": true
            }
          ]
        }
      ]
    }
  }
}
```

### 2. Modular File Structure

```
assets/js/
├── enhanced-printer-profiles.js       (Main orchestrator - 300 lines)
│   └── Handles: modal creation, tab switching, save/close
│
├── profile-renderer/
│   ├── field-renderer.js             (Generic field renderer)
│   ├── tab-renderer.js               (Tab HTML generator)
│   ├── database-loader.js            (Hardware database loader)
│   └── validation-engine.js          (Field validation)
│
├── profile-field-definitions.json    (All field definitions)
└── marlin-config-parser.js           (Existing parser - unchanged)
```

### 3. Field Type System

**Supported field types:**

| Type | Renders As | Example |
|------|-----------|---------|
| `text` | `<input type="text">` | Profile name |
| `number` | `<input type="number">` | Temperature |
| `select` | `<select>` with options | Firmware type |
| `database-select` | `<select>` from JSON database | Motherboard |
| `checkbox` | `<input type="checkbox">` | Enable feature |
| `textarea` | `<textarea>` | Notes |
| `array` | Multiple inputs | XYZ coordinates |
| `autocomplete` | Search input + results | Printer model |
| `radio-group` | Radio buttons | Bed type |

### 4. Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. User uploads Configuration.h files                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. Parser reads field mappings from JSON               │
│     (th3d-config-mapping.json, etc.)                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. Parser outputs structured config:                   │
│     { basic: {...}, hardware: {...}, motion: {...} }    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. Enhanced Profiles loads field definitions           │
│     from profile-field-definitions.json                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. Field Renderer maps parser output to fields:        │
│     parserPath: "basic.machineName" → profilePath: "name"│
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  6. Tab Renderer generates HTML for each tab            │
│     using field definitions (not hardcoded)             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  7. User edits fields → values saved to profile object  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Implementation Phases

### Phase 1: Extract Field Definitions ✅ (Planning)
- [ ] Create `profile-field-definitions.json`
- [ ] Map existing 10 tabs to JSON structure
- [ ] Define field types for each input
- [ ] Map `profilePath` to profile object structure
- [ ] Map `parserPath` to parser output structure

### Phase 2: Generic Field Renderer
- [ ] Create `field-renderer.js`
- [ ] Implement `renderField(fieldDef, value)` for each type
- [ ] Handle custom dropdowns (e.g., "__custom__" option)
- [ ] Add event listeners dynamically
- [ ] Implement value extraction (form → profile object)

### Phase 3: Tab Renderer
- [ ] Create `tab-renderer.js`
- [ ] Implement `renderTab(tabDef, profileData)`
- [ ] Generate sections and field groups
- [ ] Add tab navigation logic
- [ ] Handle conditional fields (show/hide based on other values)

### Phase 4: Parser Integration
- [ ] Create `applyParsedConfig(parsedConfig, fieldDefs)`
- [ ] Map parser output to profile using `parserPath`
- [ ] Handle nested object paths (`basic.machineName` → `name`)
- [ ] Handle array indexing (`motion.steps[0]` → `stepsX`)
- [ ] Auto-fill form fields after parsing

### Phase 5: Refactor Enhanced Profiles
- [ ] Slim down `enhanced-printer-profiles.js` to ~300 lines
- [ ] Remove all `renderTabX()` methods
- [ ] Replace with `renderCurrentTab()` using tab renderer
- [ ] Update `attachInputListeners()` to use field renderer
- [ ] Keep orchestration logic (modal, navigation, save/close)

### Phase 6: Testing & Validation
- [ ] Test all 10 tabs render correctly
- [ ] Test Configuration.h import → auto-fill
- [ ] Test manual editing → save → load
- [ ] Test database dropdowns (boards, drivers, etc.)
- [ ] Test conditional fields
- [ ] Test validation rules

### Phase 7: Documentation
- [ ] Update `ENHANCED_PROFILES_INTEGRATION.md`
- [ ] Add field definition schema documentation
- [ ] Add developer guide for adding new fields
- [ ] Add examples for each field type

---

## 🔗 Field Path Mapping

### Example: Motherboard Field

**Parser Output:**
```json
{
  "basic": {
    "motherboard": "BOARD_CREALITY_V427"
  }
}
```

**Field Definition:**
```json
{
  "id": "hardwareBoard",
  "profilePath": "hardware.board",
  "parserPath": "basic.motherboard"
}
```

**Profile Object:**
```json
{
  "hardware": {
    "board": "BOARD_CREALITY_V427"
  }
}
```

**Mapping Logic:**
1. Parser outputs `basic.motherboard = "BOARD_CREALITY_V427"`
2. Field renderer reads `parserPath: "basic.motherboard"`
3. Field renderer maps to `profilePath: "hardware.board"`
4. Value stored in `profile.hardware.board`
5. Form field `#hardwareBoard` populated with value

---

## 🎨 Field Renderer Examples

### Text Input
```javascript
renderField(fieldDef, value) {
  return `
    <div class="form-group">
      <label for="${fieldDef.id}">${fieldDef.label}${fieldDef.required ? ' *' : ''}</label>
      <input 
        type="text" 
        id="${fieldDef.id}" 
        value="${value || ''}" 
        placeholder="${fieldDef.placeholder || ''}"
        ${fieldDef.required ? 'required' : ''}
      >
      ${fieldDef.helpText ? `<p class="field-help">${fieldDef.helpText}</p>` : ''}
    </div>
  `;
}
```

### Database Select (with custom option)
```javascript
renderDatabaseSelect(fieldDef, value, databases) {
  const dbData = databases[fieldDef.database];
  const options = dbData.map(item => {
    const label = this.formatDisplay(item, fieldDef.displayFormat);
    const selected = value === item.id ? 'selected' : '';
    return `<option value="${item.id}" ${selected}>${label}</option>`;
  }).join('');
  
  return `
    <div class="form-group">
      <label>${fieldDef.label}</label>
      <select id="${fieldDef.id}" class="form-control">
        <option value="">Select ${fieldDef.label.toLowerCase()}...</option>
        ${options}
        ${fieldDef.allowCustom ? '<option value="__custom__">🔧 Custom / Other...</option>' : ''}
      </select>
      ${fieldDef.allowCustom ? `
        <input type="text" id="${fieldDef.id}Custom" class="form-control" 
          placeholder="Enter custom ${fieldDef.label.toLowerCase()}"
          style="display: none; margin-top: 10px;">
      ` : ''}
    </div>
  `;
}
```

---

## 🔄 Migration Strategy

### Step 1: Keep Both Systems Running
- Add new renderer alongside existing code
- Add feature flag: `USE_JSON_RENDERER = false`
- Test new renderer without breaking existing

### Step 2: Migrate Tab by Tab
- Start with simplest tab (Tab 10: Preferences)
- Switch to `USE_JSON_RENDERER = true` for that tab
- Test thoroughly
- Repeat for each tab

### Step 3: Remove Old Code
- Once all tabs migrated, remove old `renderTabX()` methods
- Clean up unused helper methods
- Update documentation

### Step 4: Extend
- Add new field types as needed
- Add advanced features (conditional visibility, computed fields)
- Optimize performance

---

## 📊 Benefits

### Before Refactor:
- ❌ 1,641 lines of code
- ❌ 10 hardcoded render methods
- ❌ Duplicate field definitions
- ❌ Difficult to add new fields
- ❌ Parser and UI disconnected

### After Refactor:
- ✅ ~300 lines of orchestration code
- ✅ Generic renderer (works for all tabs)
- ✅ Single source of truth (JSON)
- ✅ Add field = edit JSON only
- ✅ Parser output → auto-fills form

### Maintenance Impact:
**Adding a new field:**
- **Before:** Edit 3-5 files, write HTML, add listeners, update parser mapping
- **After:** Add 1 JSON object to field definitions

**Example:**
```json
{
  "id": "newFeature",
  "label": "New Feature",
  "type": "checkbox",
  "profilePath": "advanced.newFeature",
  "parserPath": "advanced.newFeature",
  "helpText": "Enable this cool new feature"
}
```

---

## 🚀 Next Steps

1. **Create `.clinerules/modular-ui-organization.md`** - coding rule
2. **Create `profile-field-definitions.json`** - start with Tab 1
3. **Create `field-renderer.js`** - implement basic field types
4. **Test with Tab 1** - prove concept works
5. **Expand to all 10 tabs** - complete migration
6. **Remove old code** - clean up

---

## 📝 Notes

- Parser mappings (`th3d-config-mapping.json`) remain unchanged
- Parser code (`marlin-config-parser.js`) remains unchanged
- Only UI layer refactored
- Backward compatible (can load old profiles)
- Progressive enhancement approach

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking existing profiles | Keep data format same, only change UI rendering |
| Performance issues | Lazy render tabs (only render when switched to) |
| Complex field types | Start simple, add complexity incrementally |
| Database loading slow | Pre-load all databases on modal open (already done) |
| Parser output mismatch | Add validation layer to warn about mismatches |

---

**Status:** Ready for implementation  
**Estimated Lines Saved:** ~1,300 lines  
**Estimated Development Time:** 2-3 sessions  
**Priority:** High (maintainability improvement)
