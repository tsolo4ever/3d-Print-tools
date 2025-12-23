# TH3D Parser Development Rules

**MANDATORY:** These rules MUST be followed when working with TH3D configuration parsing.

---

## 🔒 Template-First Development (REQUIRED)

**RULE:** Always update mapping templates BEFORE modifying parser code.

### **Step 1: Update Templates FIRST**
Before touching ANY parser code, update these files IN ORDER:

1. **`firmware-helper/TH3D-PARSER-REFERENCE.md`**
   - Add field to appropriate section table
   - Document Configuration.h define name
   - Add type, examples, and notes
   - Include validation rules

2. **`firmware-helper/th3d-field-mapping.json`**
   - Add complete field metadata
   - Include `mapsFrom`, `type`, `required`, `fileLocation`
   - Add `examples` array
   - Document `validation` rules
   - Add `th3dNotes` if TH3D-specific

3. **`firmware-helper/th3d-template-annotated.json`**
   - Add field with empty/default value
   - Add `_comment_fieldName` with inline documentation
   - Include Configuration.h define and typical values

4. **`firmware-helper/templete for TH3D.json`**
   - Add field to base template structure
   - Use appropriate default value (empty string, 0, false, etc.)

### **Step 2: Update Parser Code**
ONLY after templates are complete:

1. Open `assets/js/th3d-config-parser.js`
2. Reference the mapping template
3. Add parsing logic in `parseDefineLine()` method
4. Use appropriate extraction method:
   - `this.extractString()` for quoted values
   - `this.extractArray()` for `{ x, y, z }` format
   - Direct `parseInt()` or `parseFloat()` for numbers
   - Boolean for defines (present = true)

### **Step 3: Test**
1. Use example files in `firmware-helper/` directory
2. Verify field extracts correctly
3. Check value types match template
4. Validate ranges if specified

### **Step 4: Update Template Versions**
If significant changes, bump version in:
- `th3d-field-mapping.json` → `"version": "1.x.x"`
- `TH3D-PARSER-REFERENCE.md` → Version History section
- `th3d-template-annotated.json` → `"_meta.version"`

---

## 🚫 NEVER Do This:

❌ **DO NOT** add parsing logic without documenting in templates first  
❌ **DO NOT** change field names without updating ALL templates  
❌ **DO NOT** modify validation rules without updating mapping  
❌ **DO NOT** skip template updates "because it's a small change"  
❌ **DO NOT** assume a field works like standard Marlin without checking TH3D docs

---

## ✅ ALWAYS Do This:

✅ **ALWAYS** check `TH3D-PARSER-REFERENCE.md` before adding fields  
✅ **ALWAYS** update templates before code  
✅ **ALWAYS** document TH3D-specific behavior in `th3dNotes`  
✅ **ALWAYS** add validation rules to mapping  
✅ **ALWAYS** test with actual TH3D config files  
✅ **ALWAYS** preserve `userPrinterNameValue` across merges  
✅ **ALWAYS** handle variable references (e.g., `CUSTOM_MACHINE_NAME USER_PRINTER_NAME`)

---

## 🎯 TH3D-Specific Rules

### **Variable Reference Handling**
When parsing `CUSTOM_MACHINE_NAME`:
1. Check if value has quotes → string value
2. No quotes + value = "USER_PRINTER_NAME" → variable reference
3. Use stored `userPrinterNameValue` instead of variable name
4. NEVER overwrite with variable name

### **Multi-File Parsing**
TH3D uses 4 files that must be merged:
1. Configuration.h (main)
2. Configuration_adv.h (advanced)
3. Configuration_backend.h (backend - contains variable references!)
4. Configuration_speed.h (speed profiles)

**RULE:** Preserve critical values across merges:
- Store `USER_PRINTER_NAME` value in `basic.userPrinterNameValue`
- Check for placeholder names (`SHORT_BUILD_VERSION`, `Marlin`, etc.)
- Replace placeholders with stored values

### **TH3D-Specific Fields Priority**
ALWAYS check TH3D fields BEFORE standard Marlin:
```javascript
// ✅ CORRECT ORDER:
if (name === 'UNIFIED_VERSION') { ... }           // TH3D first
else if (name === 'SHORT_BUILD_VERSION') { ... }  // Marlin fallback

if (name === 'USER_PRINTER_NAME') { ... }         // TH3D first
else if (name === 'CUSTOM_MACHINE_NAME') { ... }  // Marlin fallback

if (name === 'EZABL_ENABLE') { ... }              // TH3D probe first
else if (name === 'BLTOUCH') { ... }              // Standard probe
```

---

## 📋 Pre-Commit Checklist

Before committing parser changes:

- [ ] Templates updated BEFORE parser code
- [ ] All 4 template files updated
- [ ] Field documented in `TH3D-PARSER-REFERENCE.md`
- [ ] Metadata complete in `th3d-field-mapping.json`
- [ ] Inline comment added to `th3d-template-annotated.json`
- [ ] Base template updated
- [ ] Parser code references template
- [ ] Tested with TH3D example files
- [ ] Validation rules working
- [ ] Version bumped if needed

---

## 🔍 Review Checklist

When reviewing parser PRs:

- [ ] Templates were updated first (check commit history)
- [ ] All 4 templates include the new field
- [ ] Documentation is complete and accurate
- [ ] Parser code matches template specification
- [ ] TH3D-specific behavior documented
- [ ] Variable references handled correctly
- [ ] Tests pass with example files
- [ ] No breaking changes without version bump

---

## 🆘 Emergency: Template Out of Sync

If parser and templates don't match:

1. **STOP** - Do not make more changes
2. **AUDIT** - Compare parser code to templates
3. **UPDATE TEMPLATES** - Bring templates up to date with parser
4. **VERIFY** - Test that templates accurately document parser behavior
5. **DOCUMENT** - Update version history
6. **RESUME** - Continue with template-first workflow

---

## 📚 Required Reading

Before modifying TH3D parser:

1. **`firmware-helper/README.md`** - Overview and workflow
2. **`firmware-helper/TH3D-PARSER-REFERENCE.md`** - Complete field reference
3. **This file** - Development rules

---

## 💡 Quick Reference

**Adding a new field:**
```
Templates → Parser → Test → Commit
```

**Modifying existing field:**
```
Update Templates → Update Parser → Test → Version Bump → Commit
```

**Fixing a bug:**
```
Check Templates → Fix Parser → Test → Update Template if needed → Commit
```

---

## ⚠️ Consequences of Ignoring Rules

❌ **Parser and templates diverge** → Confusion, maintenance nightmare  
❌ **Missing documentation** → Future developers don't know what fields do  
❌ **No validation rules** → Bad data gets through  
❌ **TH3D-specific behavior undocumented** → Bugs, incompatibility  
❌ **Variable references not handled** → Profile name extraction fails

---

## ✨ Benefits of Following Rules

✅ **Single source of truth** → Templates document everything  
✅ **Easy to add fields** → Template shows exactly what to do  
✅ **Bug-free parsing** → Validation catches issues  
✅ **Maintainable code** → Future developers understand intent  
✅ **TH3D compatibility** → Properly handles firmware quirks

---

**REMEMBER:** Templates are the source of truth. Update them FIRST, always.
