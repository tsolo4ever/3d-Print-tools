/**
 * ============================================
 * Universal Configuration Parser
 * ============================================
 * 
 * A generic, template-driven parser that can parse ANY
 * firmware configuration file using ANY mapping template.
 * 
 * Features:
 * - 100% mapping-driven (no hardcoded logic)
 * - Robust preprocessor handling (#if, #ifdef, #elif, #else, #endif)
 * - Conditional field mapping support
 * - Debug logging for troubleshooting
 * - Clean, maintainable architecture
 * 
 * Usage:
 *   const parser = UniversalParser.create();
 *   await parser.loadMapping('path/to/mapping.json');
 *   const config = await parser.parse(fileContent);
 */

const UniversalParser = {

  /**
   * Debug mode - set to false to suppress logging
   */
  DEBUG: true,

  /**
   * Debug logger
   */
  log(...args) {
    if (this.DEBUG) {
      console.log('[UniversalParser]', ...args);
    }
  },

  /**
   * Create a new parser instance
   */
  create() {
    const instance = Object.create(this);
    instance.mapping = null;
    instance.defines = new Set();           // Active #defines (just names)
    instance.variables = new Map();         // Variable values (name -> value)
    instance.conditionalStack = [];         // Preprocessor state
    instance.skipDepth = 0;                 // Skip inactive blocks
    instance.debugLog = [];                 // Debug entries
    return instance;
  },

  /**
   * Load mapping file(s)
   * Can load single file or array of files
   */
  async loadMapping(mappingPath) {
    if (Array.isArray(mappingPath)) {
      // Load multiple mapping files and merge
      this.log(`📂 Loading ${mappingPath.length} mapping files...`);
      const promises = mappingPath.map(path => fetch(path).then(r => r.json()));
      const mappings = await Promise.all(promises);
      this.mapping = this.mergeMappings(mappings);
      this.log('✅ Mappings merged');
    } else {
      // Load single mapping file
      this.log(`📂 Loading mapping: ${mappingPath}`);
      const response = await fetch(mappingPath);
      this.mapping = await response.json();
      this.log('✅ Mapping loaded');
    }

    // Index mapping by define name for fast lookup
    this.indexMapping();
    return this.mapping;
  },

  /**
   * Merge multiple mapping files
   */
  mergeMappings(mappings) {
    const merged = {
      version: 'merged',
      firmware: 'universal',
      categories: {}
    };

    for (const mapping of mappings) {
      for (const [category, fields] of Object.entries(mapping)) {
        // Skip metadata
        if (['$schema', 'version', 'firmware', 'description', 'configFile', 
             'generatedFrom', 'totalDefines', 'coreDefines'].includes(category)) {
          continue;
        }

        if (!merged.categories[category]) {
          merged.categories[category] = {};
        }
        Object.assign(merged.categories[category], fields);
      }
    }

    return merged;
  },

  /**
   * Index mapping for fast lookups
   * Creates defineIndex: Map<defineName, {category, fieldKey, spec}>
   */
  indexMapping() {
    this.defineIndex = new Map();
    
    const categories = this.mapping.categories || this.mapping;
    for (const [category, fields] of Object.entries(categories)) {
      // Skip metadata
      if (['$schema', 'version', 'firmware', 'description'].includes(category)) {
        continue;
      }

      for (const [fieldKey, spec] of Object.entries(fields)) {
        if (!spec || typeof spec !== 'object' || !spec.mapsFrom) {
          continue;
        }

        // Handle both single string and array
        const mapsFrom = Array.isArray(spec.mapsFrom) ? spec.mapsFrom : [spec.mapsFrom];
        
        for (const defineName of mapsFrom) {
          if (!this.defineIndex.has(defineName)) {
            this.defineIndex.set(defineName, []);
          }
          this.defineIndex.get(defineName).push({
            category,
            fieldKey,
            spec
          });
        }
      }
    }

    this.log(`📇 Indexed ${this.defineIndex.size} define mappings`);
  },

  /**
   * Add debug log entry
   */
  addDebug(level, message, data = null) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString()
    };
    if (data) entry.data = data;
    this.debugLog.push(entry);
  },

  /**
   * Parse configuration file content
   */
  async parse(content, fileName = 'Configuration.h') {
    if (!this.mapping) {
      throw new Error('No mapping loaded. Call loadMapping() first.');
    }

    this.log(`\n🔍 Parsing ${fileName}...`);
    this.addDebug('INFO', `Starting parse: ${fileName}`);

    // Initialize result object
    const result = {
      _metadata: {
        fileName,
        parseDate: new Date().toISOString(),
        parserVersion: '1.0.0'
      },
      _debugLog: this.debugLog
    };

    // Reset parser state
    this.defines.clear();
    this.variables.clear();
    this.conditionalStack = [];
    this.skipDepth = 0;

    // Strip block comments
    const cleaned = this.stripBlockComments(content);
    const lines = cleaned.split('\n');

    this.log(`📄 Processing ${lines.length} lines`);
    this.addDebug('INFO', `Total lines: ${lines.length}`);

    // Parse line by line
    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const line = lines[i].trim();

      // Skip empty lines and single-line comments
      if (!line || line.startsWith('//')) continue;

      // Handle preprocessor directives
      if (line.startsWith('#')) {
        this.handlePreprocessor(line, lineNum, result);
        continue;
      }

      // Skip if in inactive conditional block
      if (this.skipDepth > 0) continue;
    }

    // Apply defaults
    this.applyDefaults(result);

    // Summary
    const fieldCount = this.countFields(result);
    this.log(`✅ Parse complete: ${fieldCount} fields extracted`);
    this.addDebug('SUMMARY', `Extracted ${fieldCount} fields`);

    return result;
  },

  /**
   * Strip block comments
   */
  stripBlockComments(text) {
    return text.replace(/\/\*[\s\S]*?\*\//g, '');
  },

  /**
   * Handle preprocessor directive
   */
  handlePreprocessor(line, lineNum, result) {
    // #define
    if (line.startsWith('#define')) {
      if (this.skipDepth === 0) {
        // Only process defines in active blocks - now mapping to result!
        this.parseDefine(line, lineNum, result);
      }
      return;
    }

    // #undef
    if (line.startsWith('#undef')) {
      const match = line.match(/#undef\s+(\w+)/);
      if (match) {
        const name = match[1];
        this.defines.delete(name);
        this.variables.delete(name);
        this.log(`  ♻️  Undefined: ${name}`);
      }
      return;
    }

    // #ifdef NAME
    if (line.startsWith('#ifdef')) {
      const match = line.match(/#ifdef\s+(\w+)/);
      if (match) {
        const name = match[1];
        const isDefined = this.defines.has(name);
        this.conditionalStack.push({ type: 'ifdef', taken: isDefined });
        if (!isDefined) {
          this.skipDepth++;
          this.log(`  ⏭️  Skipping #ifdef ${name} (not defined)`);
        } else {
          this.log(`  ✅ Entering #ifdef ${name}`);
        }
      }
      return;
    }

    // #ifndef NAME
    if (line.startsWith('#ifndef')) {
      const match = line.match(/#ifndef\s+(\w+)/);
      if (match) {
        const name = match[1];
        const isNotDefined = !this.defines.has(name);
        this.conditionalStack.push({ type: 'ifndef', taken: isNotDefined });
        if (!isNotDefined) {
          this.skipDepth++;
          this.log(`  ⏭️  Skipping #ifndef ${name} (is defined)`);
        } else {
          this.log(`  ✅ Entering #ifndef ${name}`);
        }
      }
      return;
    }

    // #if EXPRESSION
    if (line.startsWith('#if ') && !line.startsWith('#ifdef') && !line.startsWith('#ifndef')) {
      const match = line.match(/#if\s+(.+)/);
      if (match) {
        const expr = match[1];
        const result = this.evaluateExpression(expr);
        this.conditionalStack.push({ type: 'if', taken: result });
        if (!result) {
          this.skipDepth++;
          this.log(`  ⏭️  Skipping #if ${expr} (false)`);
        } else {
          this.log(`  ✅ Entering #if ${expr} (true)`);
        }
      }
      return;
    }

    // #elif EXPRESSION
    if (line.startsWith('#elif')) {
      if (this.conditionalStack.length === 0) return;
      
      const top = this.conditionalStack[this.conditionalStack.length - 1];
      const match = line.match(/#elif\s+(.+)/);
      
      if (top.taken) {
        // Previous branch taken, skip this one
        if (this.skipDepth === 0) this.skipDepth++;
        this.log(`  ⏭️  Skipping #elif (previous taken)`);
      } else if (match) {
        // Evaluate this branch
        const expr = match[1];
        const result = this.evaluateExpression(expr);
        if (result) {
          if (this.skipDepth > 0) this.skipDepth--;
          top.taken = true;
          this.log(`  ✅ Entering #elif ${expr} (true)`);
        } else {
          if (this.skipDepth === 0) this.skipDepth++;
          this.log(`  ⏭️  Skipping #elif ${expr} (false)`);
        }
      }
      return;
    }

    // #else
    if (line.startsWith('#else')) {
      if (this.conditionalStack.length === 0) return;
      
      const top = this.conditionalStack[this.conditionalStack.length - 1];
      if (top.taken) {
        // Previous branch taken, skip else
        if (this.skipDepth === 0) this.skipDepth++;
        this.log(`  ⏭️  Skipping #else (previous taken)`);
      } else {
        // Enter else branch
        if (this.skipDepth > 0) this.skipDepth--;
        top.taken = true;
        this.log(`  ✅ Entering #else`);
      }
      return;
    }

    // #endif
    if (line.startsWith('#endif')) {
      if (this.conditionalStack.length > 0) {
        const top = this.conditionalStack.pop();
        if (!top.taken && this.skipDepth > 0) {
          this.skipDepth--;
        }
        this.log(`  🔚 Exiting ${top.type} block`);
      }
      return;
    }
  },

  /**
   * Evaluate preprocessor expression
   */
  evaluateExpression(expr) {
    let s = expr.trim();

    // Handle ENABLED(NAME)
    s = s.replace(/ENABLED\((\w+)\)/g, (_, name) => {
      return this.defines.has(name) ? '1' : '0';
    });

    // Handle DISABLED(NAME)
    s = s.replace(/DISABLED\((\w+)\)/g, (_, name) => {
      return this.defines.has(name) ? '0' : '1';
    });

    // Handle defined(NAME)
    s = s.replace(/defined\((\w+)\)/g, (_, name) => {
      return this.defines.has(name) ? '1' : '0';
    });

    // Handle ANY(A, B, C) - true if any are defined
    s = s.replace(/ANY\(([^)]+)\)/g, (_, names) => {
      const list = names.split(',').map(n => n.trim());
      const anyDefined = list.some(n => this.defines.has(n));
      return anyDefined ? '1' : '0';
    });

    // Handle BOTH(A, B) - true if both are defined
    s = s.replace(/BOTH\(([^)]+)\)/g, (_, names) => {
      const list = names.split(',').map(n => n.trim());
      const bothDefined = list.every(n => this.defines.has(n));
      return bothDefined ? '1' : '0';
    });

    // Replace variable references
    s = s.replace(/\b([A-Z_][A-Z0-9_]*)\b/g, (_, name) => {
      if (this.variables.has(name)) {
        return this.variables.get(name);
      }
      return '0';
    });

    // Safe evaluation
    try {
      // Only allow safe characters
      if (!/^[\s()!&|<>=+\-*\/\d.]+$/.test(s)) {
        this.log(`  ⚠️  Unsafe expression: ${expr}`);
        return false;
      }
      // eslint-disable-next-line no-eval
      return !!eval(s);
    } catch (e) {
      this.log(`  ⚠️  Expression eval error: ${expr} -> ${s}`, e.message);
      return false;
    }
  },

  /**
   * Parse #define statement
   */
  parseDefine(line, lineNum, result) {
    const match = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
    if (!match) return;

    const [, name, valueRaw] = match;
    const value = valueRaw ? valueRaw.split('//')[0].trim() : true;

    // Store in defines set
    this.defines.add(name);

    // Store value if it's a variable (numeric or string)
    if (typeof value === 'string' && value !== 'true') {
      this.variables.set(name, value);
    }

    this.addDebug('DEFINE_FOUND', `#define ${name} ${value}`, { lineNum });

    // If result object provided, try to map this define
    if (result) {
      this.mapDefine(name, value, lineNum, result);
    }
  },

  /**
   * Map a define to the result object
   */
  mapDefine(defineName, value, lineNum, result) {
    // Look up in index
    const mappings = this.defineIndex.get(defineName);
    if (!mappings) {
      this.addDebug('NOT_IN_MAPPING', `${defineName} not in mapping`);
      return;
    }

    // Process each mapping (can map to multiple fields)
    for (const { category, fieldKey, spec } of mappings) {
      this.addDebug('MAPPING_MATCH', `${defineName} -> ${category}.${fieldKey}`, {
        type: spec.type,
        uiFieldId: spec.uiFieldId
      });

      // Check conditionals
      if (!this.checkConditionals(spec)) {
        this.addDebug('CONDITIONAL_SKIP', `${defineName} conditional not met`, {
          conditionalOn: spec.conditionalOn,
          conditionalOnAll: spec.conditionalOnAll,
          conditionalOnNot: spec.conditionalOnNot
        });
        continue;
      }

      // Extract value
      const extractedValue = this.extractValue(value, spec);
      
      // Store in result
      if (!result[category]) result[category] = {};
      result[category][fieldKey] = extractedValue;

      // Store metadata
      if (!result._metadata[category]) result._metadata[category] = {};
      result._metadata[category][fieldKey] = {
        defineName,
        lineNumber: lineNum,
        type: spec.type,
        uiFieldId: spec.uiFieldId || null
      };

      this.log(`  ✅ ${defineName} -> ${category}.${fieldKey} = ${JSON.stringify(extractedValue)}`);
      this.addDebug('EXTRACTED', `${defineName} -> ${category}.${fieldKey}`, {
        value: extractedValue
      });
    }
  },

  /**
   * Check if conditional requirements are met
   */
  checkConditionals(spec) {
    // Check conditionalOn (OR logic - any must be defined)
    if (spec.conditionalOn) {
      const list = Array.isArray(spec.conditionalOn) ? spec.conditionalOn : [spec.conditionalOn];
      const anyDefined = list.some(name => this.defines.has(name));
      if (!anyDefined) return false;
    }

    // Check conditionalOnAll (AND logic - all must be defined)
    if (spec.conditionalOnAll) {
      const list = Array.isArray(spec.conditionalOnAll) ? spec.conditionalOnAll : [spec.conditionalOnAll];
      const allDefined = list.every(name => this.defines.has(name));
      if (!allDefined) return false;
    }

    // Check conditionalOnNot (NOT logic - none may be defined)
    if (spec.conditionalOnNot) {
      const list = Array.isArray(spec.conditionalOnNot) ? spec.conditionalOnNot : [spec.conditionalOnNot];
      const noneDefined = list.every(name => !this.defines.has(name));
      if (!noneDefined) return false;
    }

    return true;
  },

  /**
   * Extract and convert value based on type
   */
  extractValue(raw, spec) {
    const type = spec.type || 'string';

    // Handle boolean (bare #define)
    if (raw === true) {
      return type === 'boolean' ? true : 'enabled';
    }

    const value = String(raw);

    // Resolve variable references
    if (/^[A-Z_][A-Z0-9_]*$/.test(value) && this.variables.has(value)) {
      return this.extractValue(this.variables.get(value), spec);
    }

    switch (type) {
      case 'string':
        return this.extractString(value);
      
      case 'integer':
        return this.extractInteger(value);
      
      case 'float':
        return this.extractFloat(value);
      
      case 'boolean':
        return this.extractBoolean(value);
      
      case 'array':
        return this.extractArray(value, spec);
      
      default:
        return value;
    }
  },

  /**
   * Extract string value (remove quotes)
   */
  extractString(value) {
    const match = value.match(/["'](.*)["']/);
    return match ? match[1] : value;
  },

  /**
   * Extract integer value
   */
  extractInteger(value) {
    if (value.startsWith('0x')) {
      return parseInt(value, 16);
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num;
  },

  /**
   * Extract float value
   */
  extractFloat(value) {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  },

  /**
   * Extract boolean value
   */
  extractBoolean(value) {
    if (value === true) return true;
    const v = String(value).toLowerCase();
    return v === 'true' || v === '1' || v === 'enabled';
  },

  /**
   * Extract array value { x, y, z }
   */
  extractArray(value, spec) {
    const match = value.match(/\{([^}]+)\}/);
    if (!match) return [];

    const elements = match[1].split(',').map(e => e.trim());
    const elementType = spec.elementType || 'string';

    return elements.map(e => {
      // Resolve variables
      if (this.variables.has(e)) {
        e = this.variables.get(e);
      }

      // Convert based on element type
      switch (elementType) {
        case 'integer':
          return this.extractInteger(e);
        case 'float':
          return this.extractFloat(e);
        case 'boolean':
          return this.extractBoolean(e);
        default:
          return this.extractString(e);
      }
    });
  },

  /**
   * Apply default values from mapping
   */
  applyDefaults(result) {
    const categories = this.mapping.categories || this.mapping;
    
    for (const [category, fields] of Object.entries(categories)) {
      if (['$schema', 'version', 'firmware', 'description'].includes(category)) {
        continue;
      }

      for (const [fieldKey, spec] of Object.entries(fields)) {
        if (!spec || typeof spec !== 'object') continue;

        // Check if field has a default and isn't already set
        if (spec.default !== undefined && 
            (!result[category] || result[category][fieldKey] === undefined)) {
          
          if (!result[category]) result[category] = {};
          result[category][fieldKey] = spec.default;
          this.log(`  🔧 Default applied: ${category}.${fieldKey} = ${spec.default}`);
        }
      }
    }
  },

  /**
   * Count total fields extracted
   */
  countFields(result) {
    let count = 0;
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith('_')) continue;
      if (typeof value === 'object') {
        count += Object.keys(value).length;
      }
    }
    return count;
  },

  /**
   * Parse multiple files and merge
   */
  async parseMultiple(files) {
    if (!this.mapping) {
      throw new Error('No mapping loaded. Call loadMapping() first.');
    }

    this.log('\n📚 Parsing multiple files...');
    const results = [];

    for (const [fileName, content] of Object.entries(files)) {
      if (content) {
        this.log(`\n--- ${fileName} ---`);
        const parsed = await this.parse(content, fileName);
        results.push(parsed);
      }
    }

    // Merge all results
    const merged = this.mergeResults(results);
    this.log('\n✅ All files merged');
    return merged;
  },

  /**
   * Merge multiple parse results
   */
  mergeResults(results) {
    const merged = {
      _metadata: {
        parseDate: new Date().toISOString(),
        files: results.map(r => r._metadata.fileName),
        parserVersion: '1.0.0'
      },
      _debugLog: []
    };

    for (const result of results) {
      for (const [key, value] of Object.entries(result)) {
        if (key === '_metadata') continue;
        
        if (key === '_debugLog') {
          merged._debugLog.push(...value);
          continue;
        }

        if (!merged[key]) {
          merged[key] = {};
        }

        Object.assign(merged[key], value);
      }
    }

    return merged;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.UniversalParser = UniversalParser;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UniversalParser };
}
