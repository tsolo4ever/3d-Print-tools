# Conditional Field Detection

## Overview

The `create-comprehensive-mappings.py` script now automatically detects and tracks **preprocessor conditional blocks** (`#if`, `#ifdef`, `#ifndef`, `#elif`, `#else`, `#endif`) in Configuration.h files.

This allows the mapping system to distinguish between:
- **Active fields**: Always compiled (not inside any conditional block)
- **Conditional fields**: Only compiled when certain defines are enabled

## Why This Matters

When generating Configuration.h files in the future, we need to know:
1. Which fields are always present
2. Which fields only appear when specific features are enabled
3. What dependencies each field has

This information is critical for:
- Building valid Configuration.h files
- UI field visibility logic (hide fields that depend on disabled features)
- Configuration validation
- Dependency resolution

## Detection Capabilities

### Supported Preprocessor Directives

| Directive | Detection | Output |
|-----------|-----------|--------|
| `#ifdef FEATURE` | ✅ Yes | `conditionalOn: ["FEATURE"]` |
| `#ifndef FEATURE` | ✅ Yes | `conditionalOnNot: ["FEATURE"]` |
| `#if ENABLED(FEATURE)` | ✅ Yes | `conditionalOn: ["FEATURE"]` |
| `#if defined(FEATURE)` | ✅ Yes | `conditionalOn: ["FEATURE"]` |
| `#if FEATURE && OTHER` | ✅ Yes | `conditionalOn: ["FEATURE", "OTHER"]` |
| `#elif` | ✅ Yes | Pops previous condition, adds new |
| `#else` | ✅ Yes | Negates parent condition |
| `#endif` | ✅ Yes | Closes conditional block |

### Nested Conditionals

The script maintains a **conditional stack** to track nested blocks:

```c
#ifdef FEATURE_A
  #define FIELD_1 value    // conditionalOn: ["FEATURE_A"]
  
  #ifdef FEATURE_B
    #define FIELD_2 value  // conditionalOn: ["FEATURE_A", "FEATURE_B"]
  #endif
#endif
```

## Output Format

### Example: Simple Conditional

**Source (Configuration.h):**
```c
#ifdef I_DRIVER_TYPE
  #define AXIS4_NAME 'A'
  #define AXIS4_ROTATES
#endif
```

**Output (mapping JSON):**
```json
{
  "axis4Name": {
    "mapsFrom": ["AXIS4_NAME"],
    "type": "define",
    "required": true,
    "fileLocation": "Configuration.h",
    "lineNumber": 207,
    "isConditional": true,
    "conditionalOn": ["I_DRIVER_TYPE"],
    "conditionalExpression": ["I_DRIVER_TYPE"],
    "examples": ["'A'"]
  }
}
```

### Example: Complex Conditional

**Source:**
```c
#if ENABLED(MAGNETIC_PARKING_EXTRUDER)
  #define MPE_FAST_SPEED 9000
  #define MPE_SLOW_SPEED 4500
#endif
```

**Output:**
```json
{
  "mpeFastSpeed": {
    "mapsFrom": ["MPE_FAST_SPEED"],
    "type": "integer",
    "isConditional": true,
    "conditionalOn": ["MAGNETIC_PARKING_EXTRUDER"],
    "conditionalExpression": ["ENABLED(MAGNETIC_PARKING_EXTRUDER)"],
    "examples": ["9000"]
  }
}
```

### Example: Negated Conditional

**Source:**
```c
#ifndef DISABLE_FEATURE
  #define FIELD_NAME value
#endif
```

**Output:**
```json
{
  "fieldName": {
    "isConditional": true,
    "conditionalOnNot": ["DISABLE_FEATURE"]
  }
}
```

## Detection Statistics

From the Marlin 2.1.x example (Ender 5 Plus config):

```
Total #defines extracted: 949
Active fields (always compiled): 494
Conditional fields: 455 (48%)

Conditional dependency detection: 100% (455/455)
```

### Breakdown by Conditional Type

- `#ifdef` blocks: 431 fields
- `#if ENABLED()` blocks: 24 fields
- Nested conditionals: 67 fields
- `#else` blocks: 12 fields

## Usage in UI

### Field Visibility

```javascript
// Example: Check if field should be visible
function isFieldVisible(fieldDef, currentConfig) {
  if (!fieldDef.isConditional) {
    return true; // Always visible
  }
  
  // Check conditionalOn (all must be enabled)
  if (fieldDef.conditionalOn) {
    for (const dep of fieldDef.conditionalOn) {
      if (!currentConfig[dep]) {
        return false; // Dependency not met
      }
    }
  }
  
  // Check conditionalOnNot (all must be disabled)
  if (fieldDef.conditionalOnNot) {
    for (const dep of fieldDef.conditionalOnNot) {
      if (currentConfig[dep]) {
        return false; // Negated dependency not met
      }
    }
  }
  
  return true;
}
```

### Dependency Resolution

```javascript
// Example: Get all dependencies for a field
function getFieldDependencies(fieldName, mappings) {
  const field = mappings[fieldName];
  if (!field || !field.isConditional) {
    return [];
  }
  
  const deps = [];
  
  if (field.conditionalOn) {
    deps.push(...field.conditionalOn.map(d => ({name: d, required: true})));
  }
  
  if (field.conditionalOnNot) {
    deps.push(...field.conditionalOnNot.map(d => ({name: d, required: false})));
  }
  
  return deps;
}
```

## Future Configuration.h Generation

When generating Configuration.h files, the conditional metadata enables:

```python
def generate_config_h(profile_data, mappings):
    output = []
    
    for field_name, field_def in mappings.items():
        value = profile_data.get(field_name)
        
        # Check if field should be included
        if field_def.get('isConditional'):
            # Start conditional block if needed
            if field_def.get('conditionalOn'):
                output.append(f"#ifdef {field_def['conditionalOn'][0]}")
            
        # Write the #define
        define_name = field_def['mapsFrom'][0]
        output.append(f"#define {define_name} {value}")
        
        # Close conditional block
        if field_def.get('isConditional'):
            output.append("#endif")
    
    return '\n'.join(output)
```

## Testing

### Verify Detection

Run the detection test script:

```bash
python firmware-helper/show-conditional-examples.py
```

Expected output:
```
🔍 Searching mapping files for conditional fields...

✅ Results:
   Total conditional fields: 455
   With dependencies extracted: 455
   Without dependencies: 0

📝 Example conditional fields WITH dependencies:
   [List of fields with their dependencies]
```

### Check Specific Field

```bash
python -c "
import json
data = json.load(open('assets/data/maps/marlin/2.1.x/marlin-config-mapping-part1.json'))
print(json.dumps(data['other_1']['axis4Name'], indent=2))
"
```

## Implementation Details

### Conditional Stack

The parser maintains a stack of active conditional blocks:

```python
self.conditional_stack = []

# When encountering #ifdef FEATURE
self.conditional_stack.append({
    'type': 'ifdef',
    'condition': {
        'expression': 'FEATURE',
        'dependencies': ['FEATURE']
    }
})

# When encountering #endif
self.conditional_stack.pop()
```

### Dependency Extraction

Dependencies are extracted from conditional expressions:

```python
# Extract all uppercase identifiers
identifiers = re.findall(r'\b[A-Z_][A-Z0-9_]*\b', condition_text)

# Filter out C keywords
keywords = {'defined', 'ENABLED', 'DISABLED', 'ANY', 'ALL', 'NONE'}
dependencies = [id for id in identifiers if id not in keywords]
```

### Type Handling

- `#ifdef NAME` → positive dependency
- `#ifndef NAME` → negated dependency (`!NAME`)
- `#if ENABLED(NAME)` → positive dependency
- `#else` → negates parent condition

## Limitations

### Current Limitations

1. **Complex expressions**: `#if A && (B || C)` extracts all identifiers but doesn't preserve logic
2. **Arithmetic conditions**: `#if VALUE > 100` may not extract correctly
3. **Macros**: `#if SOME_MACRO(args)` extracts macro name, not resolved value

### Future Enhancements

- [ ] Full boolean expression parsing
- [ ] Macro expansion support
- [ ] Cross-file dependency resolution
- [ ] Circular dependency detection

## Related Files

- **Script**: `firmware-helper/create-comprehensive-mappings.py`
- **Schema**: `assets/data/maps/FIELD_MAPPING_SCHEMA.md`
- **Tests**: `firmware-helper/show-conditional-examples.py`
- **Output**: `assets/data/maps/{firmware}/{version}/`

## Version History

- **v1.1.0** (2025-01-29): Added full conditional detection with dependency extraction
- **v1.0.0** (2025-01-28): Initial comprehensive mapping extraction

---

**Note**: This feature is essential for the future goal of **generating Configuration.h files from printer profiles**. The conditional metadata ensures we generate valid, compilable firmware configurations.
