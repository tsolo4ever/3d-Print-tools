# Modular UI Organization Rule

**MANDATORY:** Complex UI code MUST use JSON-driven, modular architecture to prevent code bloat.

---

## 🔒 When This Rule Applies

**RULE:** Any UI component with multiple tabs/sections or >500 lines MUST use modular, data-driven architecture.

### **Triggers:**
- ✅ File exceeds 500 lines
- ✅ Contains 3+ similar render methods (e.g., `renderTab1()`, `renderTab2()`, etc.)
- ✅ Hardcoded HTML string concatenation for forms
- ✅ Duplicate field definitions across files
- ✅ Adding a field requires editing multiple files

---

## ✅ ALWAYS Do This:

✅ **ALWAYS** define fields in JSON, not hardcoded HTML  
✅ **ALWAYS** create generic renderers for reusable components  
✅ **ALWAYS** separate concerns: data, rendering, logic  
✅ **ALWAYS** map parser output to UI fields via JSON paths  
✅ **ALWAYS** use single source of truth for field definitions  

---

## 🚫 NEVER Do This:

❌ **DO NOT** hardcode HTML strings for repetitive forms  
❌ **DO NOT** create separate render methods for similar tabs  
❌ **DO NOT** duplicate field definitions across files  
❌ **DO NOT** let UI files exceed 500 lines without refactoring  
❌ **DO NOT** ignore the separation of concerns  

---

## 🏗️ Required Architecture

### **1. JSON Field Definitions**

**File:** `[component]-field-definitions.json`

All form fields defined in JSON:

```json
{
  "tabs": {
    "tab1_basic": {
      "title": "Basic Info",
      "icon": "📋",
      "sections": [
        {
          "title": "Section Name",
          "fields": [
            {
              "id": "fieldName",
              "label": "Field Label",
              "type": "text",
              "required": true,
              "placeholder": "Enter value...",
              "profilePath": "object.path.to.value",
              "parserPath": "parser.output.path",
              "helpText": "Help text here"
            }
          ]
        }
      ]
    }
  }
}
```

### **2. Generic Field Renderer**

**File:** `[component]-renderer/field-renderer.js`

Render fields dynamically from JSON:

```javascript
const FieldRenderer = {
  render(fieldDef, value) {
    switch(fieldDef.type) {
      case 'text': return this.renderText(fieldDef, value);
      case 'select': return this.renderSelect(fieldDef, value);
      case 'checkbox': return this.renderCheckbox(fieldDef, value);
      // ... other types
    }
  },
  
  renderText(fieldDef, value) {
    return `
      <div class="form-group">
        <label>${fieldDef.label}${fieldDef.required ? ' *' : ''}</label>
        <input type="text" id="${fieldDef.id}" value="${value || ''}" 
          placeholder="${fieldDef.placeholder || ''}"
          ${fieldDef.required ? 'required' : ''}>
        ${fieldDef.helpText ? `<p class="field-help">${fieldDef.helpText}</p>` : ''}
      </div>
    `;
  }
};
```

### **3. Tab/Section Renderer**

**File:** `[component]-renderer/tab-renderer.js`

Render tabs/sections from field definitions:

```javascript
const TabRenderer = {
  render(tabDef, data) {
    return tabDef.sections.map(section => `
      <div class="section">
        <h4>${section.title}</h4>
        ${section.fields.map(field => 
          FieldRenderer.render(field, this.getValue(data, field.profilePath))
        ).join('')}
      </div>
    `).join('');
  },
  
  getValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
};
```

### **4. Main Component (Orchestrator)**

**File:** `[component].js` - Should be **≤500 lines**

Only orchestration logic:

```javascript
class Component {
  constructor() {
    this.fieldDefinitions = null;
    this.currentData = {};
  }
  
  async init() {
    this.fieldDefinitions = await this.loadFieldDefinitions();
    this.render();
  }
  
  render() {
    // Use TabRenderer to generate HTML
    const html = TabRenderer.render(
      this.fieldDefinitions.tabs[this.currentTab],
      this.currentData
    );
    this.container.innerHTML = html;
    this.attachListeners();
  }
  
  attachListeners() {
    // Generic event delegation
    this.container.addEventListener('input', (e) => {
      const field = this.findFieldById(e.target.id);
      this.updateValue(field.profilePath, e.target.value);
    });
  }
}
```

---

## 📋 Supported Field Types

| Type | Use Case | Example |
|------|---------|---------|
| `text` | Single-line text | Name, version |
| `number` | Numeric input | Temperature, speed |
| `select` | Dropdown list | Firmware type |
| `database-select` | Dropdown from JSON | Motherboard list |
| `checkbox` | Boolean toggle | Enable feature |
| `textarea` | Multi-line text | Notes, description |
| `array` | Multiple values | XYZ coordinates |
| `autocomplete` | Search + select | Printer model |
| `radio-group` | Single choice | Bed type |

---

## 🔗 Parser Integration

### **Mapping Parser Output to Fields**

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
  "id": "boardSelect",
  "profilePath": "hardware.board",
  "parserPath": "basic.motherboard"
}
```

**Automatic Mapping:**
```javascript
function applyParsedConfig(parsedData, fieldDefs) {
  for (const field of getAllFields(fieldDefs)) {
    if (field.parserPath) {
      const parsedValue = getValueByPath(parsedData, field.parserPath);
      if (parsedValue !== undefined) {
        setValueByPath(profileData, field.profilePath, parsedValue);
      }
    }
  }
}
```

---

## 📊 File Size Limits

| File Type | Max Lines | Action if Exceeded |
|-----------|-----------|-------------------|
| Main component | 500 | Refactor to modular |
| Field renderer | 300 | Split by field type |
| Tab renderer | 200 | Extract helper methods |
| Field definitions JSON | ∞ | No limit (data file) |

---

## 🎯 Benefits

### **Before (Violates Rule):**
```javascript
// enhanced-printer-profiles.js - 1,641 lines

renderTab1() {
  return `
    <div class="form-group">
      <label>Profile Name</label>
      <input type="text" id="profileName" value="${this.profile.name}">
    </div>
    <div class="form-group">
      <label>Firmware Type</label>
      <select id="firmwareType">
        <option value="marlin">Marlin</option>
        <option value="th3d">TH3D</option>
      </select>
    </div>
    <!-- 50+ more fields... -->
  `;
}

renderTab2() {
  return `
    <div class="form-group">
      <label>Motherboard</label>
      <select id="board">
        <!-- 100+ boards hardcoded... -->
      </select>
    </div>
    <!-- 40+ more fields... -->
  `;
}

// ... renderTab3() through renderTab10() ...
```

❌ **Problems:**
- 1,641 lines
- 10 nearly-identical render methods
- Hardcoded HTML everywhere
- Adding field = editing multiple places

---

### **After (Follows Rule):**

**field-definitions.json** (data file):
```json
{
  "tabs": {
    "tab1": {
      "fields": [
        {"id": "profileName", "type": "text", "label": "Profile Name"},
        {"id": "firmwareType", "type": "select", "options": [...]}
      ]
    },
    "tab2": {
      "fields": [
        {"id": "board", "type": "database-select", "database": "boards"}
      ]
    }
  }
}
```

**enhanced-printer-profiles.js** (280 lines):
```javascript
class EnhancedProfiles {
  async init() {
    this.fieldDefs = await fetch('field-definitions.json').then(r => r.json());
    this.render();
  }
  
  render() {
    const tabDef = this.fieldDefs.tabs[this.currentTab];
    const html = TabRenderer.render(tabDef, this.profileData);
    this.container.innerHTML = html;
  }
}
```

✅ **Benefits:**
- ~300 lines (orchestration only)
- Generic renderer (works for all tabs)
- Add field = add JSON entry only
- Single source of truth

---

## 💡 Real-World Example

### **Before Refactor:**
**File:** `enhanced-printer-profiles.js`  
**Lines:** 1,641  
**Tabs:** 10  
**Render methods:** 10 (renderTab1-10)  
**Adding a field:** Edit 3-5 files

### **After Refactor:**
**File:** `enhanced-printer-profiles.js`  
**Lines:** ~300  
**Tabs:** 10  
**Render methods:** 1 (generic)  
**Adding a field:** Add 1 JSON object

**Field Addition Example:**
```json
{
  "id": "newFeature",
  "label": "New Feature",
  "type": "checkbox",
  "profilePath": "advanced.newFeature",
  "parserPath": "advanced.newFeature"
}
```

Done. No code changes needed.

---

## 🔄 Migration Strategy

### **Step 1: Identify Violation**
Check if file violates rule:
- [ ] >500 lines?
- [ ] 3+ similar render methods?
- [ ] Hardcoded HTML forms?

### **Step 2: Extract Field Definitions**
Create JSON file with all fields:
```json
{
  "tabs": {...},
  "fieldTypes": {...}
}
```

### **Step 3: Create Renderers**
Build generic renderer:
- `field-renderer.js`
- `tab-renderer.js`

### **Step 4: Refactor Main File**
Remove render methods, use generic renderer:
```javascript
render() {
  return TabRenderer.render(
    this.fieldDefs.tabs[this.currentTab],
    this.data
  );
}
```

### **Step 5: Test & Cleanup**
- Test all tabs/fields work
- Remove old hardcoded methods
- Update documentation

---

## ⚠️ Exceptions

The ONLY acceptable exceptions to this rule:

1. **Simple forms** (<3 fields, <100 lines total)
2. **One-off UIs** that will never be extended
3. **Prototype/demo code** (temporary only)
4. **Performance-critical** sections (profile first!)

If you think you have an exception, document why and get approval.

---

## 📝 Implementation Checklist

Before committing complex UI code:

- [ ] Field definitions in JSON, not hardcoded
- [ ] Generic renderer created
- [ ] Main file ≤500 lines
- [ ] No duplicate render methods
- [ ] Parser integration via JSON paths
- [ ] Single source of truth for fields
- [ ] Documentation updated

---

## 🚨 Code Review Checklist

When reviewing UI PRs:

- [ ] Are there 3+ similar render methods? → Reject
- [ ] Is main file >500 lines? → Request refactor
- [ ] Are fields hardcoded? → Request JSON extraction
- [ ] Are there duplicate definitions? → Consolidate
- [ ] Is there a generic renderer? → If not, add one

---

## 📚 Reference Implementation

**See:** `assets/js/ENHANCED_PROFILES_REFACTOR_PLAN.md`

This file contains:
- Complete refactoring strategy
- JSON schema examples
- Renderer implementations
- Migration guide
- Before/after comparisons

---

**REMEMBER:** Modular, data-driven UI code is maintainable UI code. If you're writing repetitive HTML, you're doing it wrong.
