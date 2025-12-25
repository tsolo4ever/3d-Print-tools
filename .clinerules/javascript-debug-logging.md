# JavaScript Debug Logging Convention

**MANDATORY:** All JavaScript modules with significant console output MUST implement controllable debug logging.

---

## 🔒 Required Pattern (MUST Follow)

### **Step 1: Add DEBUG Flag & Log Method**

Every JavaScript object/module with logging MUST include:

```javascript
const MyModule = {
    
    // Debug mode - set to false to suppress all console logging
    DEBUG: true,
    
    /**
     * Debug logger - only logs if DEBUG is true
     * @param {...any} args - Arguments to log
     */
    log(...args) {
        if (this.DEBUG) {
            console.log(...args);
        }
    },
    
    // ... rest of module
};
```

### **Step 2: Replace All console.log**

Replace ALL informational/debug `console.log()` calls with `this.log()`:

```javascript
// ❌ WRONG - Direct console.log
console.log('Processing item:', item);

// ✅ CORRECT - Use this.log()
this.log('Processing item:', item);
```

### **Step 3: Keep console.error for Errors**

ALWAYS keep `console.error()` for actual errors that need visibility:

```javascript
// ✅ CORRECT - Errors always visible
try {
    // ... code
} catch (error) {
    console.error('❌ Critical failure:', error);
    throw error;
}
```

### **Step 4: Keep console.warn for Warnings**

OPTIONALLY keep `console.warn()` for important warnings:

```javascript
// ✅ OPTIONAL - Warnings can stay visible
if (deprecatedFeature) {
    console.warn('⚠️ Feature X is deprecated');
}
```

---

## ✅ ALWAYS Do This:

✅ **ALWAYS** add `DEBUG` flag to modules with console output  
✅ **ALWAYS** implement `log()` method that checks DEBUG  
✅ **ALWAYS** replace `console.log` with `this.log`  
✅ **ALWAYS** keep `console.error` for errors  
✅ **ALWAYS** default DEBUG to `true` for development  
✅ **ALWAYS** document how to disable debug in comments  

---

## 🚫 NEVER Do This:

❌ **DO NOT** use `console.log` directly in production code  
❌ **DO NOT** remove error logging (`console.error`)  
❌ **DO NOT** make debug logging hard to toggle  
❌ **DO NOT** forget to update all console.log calls  
❌ **DO NOT** use different patterns in different files  

---

## 📋 Usage Documentation

Document this at the top of files:

```javascript
/**
 * Module Name
 * 
 * DEBUG MODE:
 * Set MyModule.DEBUG = false to disable console logging
 * Errors (console.error) are always shown
 * 
 * Example:
 *   MyModule.DEBUG = false;  // Silent mode
 *   MyModule.DEBUG = true;   // Verbose mode (default)
 */
```

---

## 🎯 Benefits of This Pattern

1. **Single Toggle** - One flag controls all logging
2. **Zero Code Changes** - Toggle debug without modifying code
3. **Performance** - No function calls when DEBUG=false
4. **Errors Preserved** - Critical messages always visible
5. **Consistent** - Same pattern across all modules

---

## 📊 Example: Before & After

### **Before (Non-Compliant):**
```javascript
const Parser = {
    parse(data) {
        console.log('Starting parse...');  // ❌ Always logs
        console.log('Found:', data);       // ❌ Always logs
        console.error('Error:', err);      // ✅ OK
        return result;
    }
};
```

### **After (Compliant):**
```javascript
const Parser = {
    DEBUG: true,  // ✅ Debug flag
    
    log(...args) {  // ✅ Wrapper method
        if (this.DEBUG) {
            console.log(...args);
        }
    },
    
    parse(data) {
        this.log('Starting parse...');  // ✅ Controllable
        this.log('Found:', data);       // ✅ Controllable
        console.error('Error:', err);   // ✅ Always visible
        return result;
    }
};

// Usage:
Parser.DEBUG = false;  // Silent mode - no logs
```

---

## 🔍 Implementation Checklist

When adding/updating a JavaScript module:

- [ ] Module has `DEBUG` flag
- [ ] Module has `log()` method
- [ ] All `console.log` replaced with `this.log`
- [ ] `console.error` preserved for errors
- [ ] `console.warn` preserved or removed as needed
- [ ] Usage documented in file header
- [ ] Tested with `DEBUG = true`
- [ ] Tested with `DEBUG = false`

---

## 💡 Real-World Example

See `assets/js/th3d-config-parser.js` for reference implementation:

```javascript
const TH3DConfigParser = {
    DEBUG: true,
    
    log(...args) {
        if (this.DEBUG) {
            console.log(...args);
        }
    },
    
    async loadFieldMapping() {
        this.log('📂 Loading mappings...');  // Controllable
        // ... code
    }
};

// Production use:
TH3DConfigParser.DEBUG = false;  // Silent
```

---

## ⚠️ Exceptions

The ONLY acceptable exceptions to this rule:

1. **Tiny utility functions** with 1-2 console.log calls
2. **Development-only scripts** not shipped to production
3. **Error handlers** that MUST log (`console.error`)
4. **CLI tools** where output IS the feature

---

## 🆘 Migrating Existing Code

To migrate non-compliant code:

1. Add `DEBUG: true` flag to module
2. Add `log(...args)` method
3. Find all: `console.log` → Replace: `this.log`
4. Keep all: `console.error` as-is
5. Test with DEBUG true/false
6. Update documentation

---

**REMEMBER:** This pattern makes code production-ready by default while preserving debugging capability when needed.
