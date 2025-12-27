
/* ============================================
   Universal Marlin Configuration Parser (Updated)
   - Safe condition eval (no new Function)
   - Robust preprocessor (#if/#elif/#else/#endif, #ifdef/#ifndef, #undef)
   - Block comment stripping
   - Negative/hex numeric parsing
   - Feature flags tracked inside active branches
   - Array coercion via elementType
   - Default resolution by define name
   - Derived calculations for Configuration_speed.h
   - Conditional mapping: conditionalOn / conditionalOnAll / conditionalOnNot
   ============================================ */

const MarlinConfigParser = {

  // Debug mode - set to false to suppress all console logging
  DEBUG: false,

  /**
   * Debug logger - only logs if DEBUG is true
   */
  log(...args) {
    if (this.DEBUG) console.log(...args);
  },

  /**
   * Mapping file set configurations
   * Add new firmware variants here
   */
  mappingSets: {
    th3d: {
      name: 'TH3D Unified Firmware',
      basePath: 'assets/data/maps/th3d/',
      files: [
        'th3d-config-mapping.json',
        'th3d-config-adv-mapping-part1.json',
        'th3d-config-adv-mapping-part2.json',
        'th3d-config-adv-mapping-part3.json',
        'th3d-config-adv-mapping-part4.json',
        'th3d-config-backend-mapping.json',
        'th3d-config-speed-mapping.json' // includes the speed mapping you shared
      ]
    },
    marlin: {
      name: 'Vanilla Marlin',
      basePath: 'assets/data/maps/marlin/',
      files: [
        'marlin-config-mapping.json',
        'marlin-config-adv-mapping.json'
      ]
    },
    custom: {
      name: 'Custom Mapping',
      basePath: 'assets/data/maps/custom/',
      files: [] // Set dynamically
    }
  },

  /**
   * Create a parser instance for a specific firmware variant
   */
  create(variant = 'th3d', customConfig = null) {
    const instance = Object.create(this);
    if (customConfig) {
      instance.mappingConfig = customConfig;
    } else if (this.mappingSets[variant]) {
      instance.mappingConfig = this.mappingSets[variant];
    } else {
      throw new Error(`Unknown firmware variant: ${variant}. Available: ${Object.keys(this.mappingSets).join(', ')}`);
    }
    instance.log(`📦 Created parser for: ${instance.mappingConfig.name}`);

    // Initialize state
    instance.fieldMapping = null;
    instance.variables = {};
    instance.globalConditionals = new Set();

    // Preprocessor state
    instance.condStack = [];
    instance.skipDepth = 0;

    return instance;
  },

  /**
   * Load and merge all field mapping files
   */
  async loadFieldMapping() {
    if (this.fieldMapping) return this.fieldMapping;
    const { basePath, files } = this.mappingConfig;

    try {
      this.log(`📂 Loading ${files.length} mapping files from ${basePath}...`);
      const promises = files.map(file =>
        fetch(basePath + file)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}: ${file}`);
            return r.json();
          })
          .catch(err => {
            console.warn(`⚠️  Could not load ${file}:`, err.message);
            return null;
          })
      );

      const mappings = await Promise.all(promises);
      const validMappings = mappings.filter(m => m !== null);
      if (validMappings.length === 0) throw new Error('No mapping files could be loaded');

      this.fieldMapping = this.mergeMappings(validMappings);
      this.log('✅ Field Mappings loaded and merged');
      this.log(
        '   Categories:',
        Object.keys(this.fieldMapping)
          .filter(k => !k.startsWith('$') && !['description', 'lastUpdated', 'version'].includes(k))
          .join(', ')
      );

      return this.fieldMapping;
    } catch (error) {
      console.error('❌ Failed to load field mappings:', error);
      throw new Error(`Could not load mapping files from ${basePath}`);
    }
  },

  /**
   * Merge multiple mapping files into one
   * Later files override earlier files for the same fields
   */
  mergeMappings(mappings) {
    const merged = {
      $schema: 'Marlin Configuration Field Mapping - Merged',
      version: '2.0.0',
      description: 'Merged from multiple mapping files',
      firmwareVariant: this.mappingConfig.name
    };

    for (const mapping of mappings) {
      for (const [category, fields] of Object.entries(mapping)) {
        // Skip metadata
        if (
          category.startsWith('$') ||
          ['description', 'lastUpdated', 'version', 'part', 'sourceFile', 'th3dNotes'].includes(category)
        ) {
          continue;
        }
        if (!merged[category]) merged[category] = {};
        Object.assign(merged[category], fields);
      }
    }
    return merged;
  },

  /**
   * Strip block comments (/* ... */) before parsing
   */
  stripBlockComments(text) {
    return text.replace(/\/\*[\s\S]*?\*\//g, '');
  },

  /**
   * Parse configuration file content
   */
  async parseConfigFile(content) {
    await this.loadFieldMapping();

    const config = {
      basic: {},
      hardware: {},
      temperature: {},
      motion: {},
      probe: {},
      bedLeveling: {},
      advanced: {},
      safety: {},
      communication: {},
      serial: {},
      tmc: {},
      thermal: {},
      lcd: {},
      feedrates: {},
      acceleration: {},
      jerk: {},
      speed: {},       // for any mapping sets that still use "speed" category
      backend: {},
      warnings: []
    };

    const cleaned = this.stripBlockComments(content);
    const lines = cleaned.split('\n').map(l => l.trimEnd());

    this.log(`🔍 ${this.mappingConfig.name} Parser: Starting parse of ${lines.length} lines`);

    // Two-pass parsing strategy
    this.firstPass(lines);
    this.secondPass(lines, config);

    // Post-processing: defaults and derived calculations (esp. Configuration_speed.h)
    this.applyDefaultsAndDerived(config);

    // Validate and add warnings
    this.validateConfig(config);

    return config;
  },

  /**
   * First Pass: Collect global conditionals and unconditional variables
   */
  firstPass(lines) {
    this.log('🎯 Pass 1: Detecting global conditionals...');
    let inConditionalBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('//') || line.length === 0) continue;

      if (line.startsWith('#if') || line.startsWith('#ifndef') || line.startsWith('#ifdef')) {
        inConditionalBlock = true;
        continue;
      }
      if (line.startsWith('#endif')) {
        inConditionalBlock = false;
        continue;
      }

      if (!inConditionalBlock && line.startsWith('#define')) {
        const mName = line.match(/#define\s+(\w+)/);
        if (mName) {
          const defineName = mName[1];
          if (this.isGlobalConditional(defineName)) {
            this.globalConditionals.add(defineName);
            this.log('   ✅ Global conditional active:', defineName);
          }

          // Numeric support: negative, float, hex
          const mVal = line.match(/#define\s+(\w+)\s+(-?(?:\d+(?:\.\d+)?|0x[0-9A-Fa-f]+))\b/);
          if (mVal) {
            this.variables[mVal[1]] = mVal[2];
            this.log('   📦 Variable stored:', mVal[1], '=', mVal[2]);
          }
        }
      }
    }

    this.log('🎯 Active conditionals:', Array.from(this.globalConditionals).join(', '));
    this.log('🔍 Variables collected:', Object.keys(this.variables).length);
  },

  /**
   * Initialize preprocessor state
   */
  initPreprocessorState() {
    this.condStack = [];
    this.skipDepth = 0;
  },

  /**
   * Safe boolean evaluation (sanitized)
   */
  safeEvalBooleanExpr(expr) {
    // Allow only safe characters/operators
    const allowed = /^[\s()!&|<>=.,A-Za-z0-9_+\-/*]+$/;
    if (!allowed.test(expr)) {
      this.log(`   ⚠️  Disallowed characters in condition: ${expr}`);
      return false;
    }

    let s = expr.trim();

    // Replace ENABLED/DISABLED
    s = s.replace(/ENABLED\((\w+)\)/g, (_, name) => (this.globalConditionals.has(name) ? '1' : '0'));
    s = s.replace(/DISABLED\((\w+)\)/g, (_, name) => (this.globalConditionals.has(name) ? '0' : '1'));

    // Support defined(NAME)
    s = s.replace(/defined\((\w+)\)/g, (_, name) =>
      this.variables[name] !== undefined || this.globalConditionals.has(name) ? '1' : '0'
    );

    // Replace variables with numeric values (fallback 0)
    s = s.replace(/\b([A-Z_][A-Z0-9_]*)\b/g, (_, name) => {
      const v = this.variables?.[name];
      if (typeof v === 'string' && /^-?(?:\d+(?:\.\d+)?|0x[0-9A-Fa-f]+)$/.test(v)) return v;
      if (typeof v === 'number') return v.toString();
      return '0';
    });

    try {
      // eslint-disable-next-line no-eval
      const res = eval(s);
      return !!res;
    } catch (e) {
      this.log(`   ⚠️  Condition eval failed for "${expr}" -> "${s}":`, e.message);
      return false;
    }
  },

  /**
   * Handle preprocessor directives (#if, #elif, #else, #endif, #ifdef, #ifndef, #undef)
   * Returns true if line was a directive.
   */
  handlePreprocessor(line) {
    const L = line.trim();

    // #undef NAME
    if (L.startsWith('#undef')) {
      const m = L.match(/^#undef\s+(\w+)/);
      if (m) {
        const name = m[1];
        delete this.variables[name];
        if (this.globalConditionals.has(name)) this.globalConditionals.delete(name);
        this.log(`   ♻️  Undefine: ${name}`);
      }
      return true;
    }

    // #ifdef NAME
    if (L.startsWith('#ifdef')) {
      const m = L.match(/^#ifdef\s+(\w+)/);
      if (m) {
        const name = m[1];
        const isDefined = this.variables[name] !== undefined || this.globalConditionals.has(name);
        this.condStack.push({ type: 'ifdef', branchSelected: isDefined });
        if (!isDefined) this.skipDepth++;
        else this.log(`   ✅ Entering #ifdef ${name}`);
      }
      return true;
    }

    // #ifndef NAME
    if (L.startsWith('#ifndef')) {
      const m = L.match(/^#ifndef\s+(\w+)/);
      if (m) {
        const name = m[1];
        const isDefined = this.variables[name] !== undefined || this.globalConditionals.has(name);
        const taken = !isDefined;
        this.condStack.push({ type: 'ifndef', branchSelected: taken });
        if (!taken) this.skipDepth++;
        else this.log(`   ✅ Entering #ifndef ${name}`);
      }
      return true;
    }

    // #if EXPR
    if (L.startsWith('#if ') && !L.startsWith('#ifdef') && !L.startsWith('#ifndef')) {
      const m = L.match(/^#if\s+(.+)/);
      if (m) {
        const ok = this.safeEvalBooleanExpr(m[1]);
        this.condStack.push({ type: 'if', branchSelected: ok });
        if (!ok) {
          this.skipDepth++;
          this.log(`   ⏭️  Skipping #if block (false): ${m[1]}`);
        } else {
          this.log(`   ✅ Entering #if block (true): ${m[1]}`);
        }
      }
      return true;
    }

    // #elif EXPR
    if (L.startsWith('#elif')) {
      const m = L.match(/^#elif\s+(.+)/);
      const top = this.condStack[this.condStack.length - 1];
      if (!top) return true;

      if (top.branchSelected) {
        if (this.skipDepth === 0) this.skipDepth++;
        this.log('   ⏭️  Skipping #elif (previous branch taken)');
        return true;
      }

      const ok = this.safeEvalBooleanExpr(m[1]);
      if (ok) {
        if (this.skipDepth > 0) this.skipDepth--;
        top.branchSelected = true;
        this.log(`   ✅ Entering #elif block (true): ${m[1]}`);
      } else {
        if (this.skipDepth === 0) this.skipDepth++;
        this.log(`   ⏭️  Skipping #elif block (false): ${m[1]}`);
      }
      return true;
    }

    // #else
    if (L.startsWith('#else')) {
      const top = this.condStack[this.condStack.length - 1];
      if (!top) return true;

      if (top.branchSelected) {
        if (this.skipDepth === 0) this.skipDepth++;
        this.log('   ⏭️  Skipping #else (previous branch taken)');
      } else {
        if (this.skipDepth > 0) this.skipDepth--;
        top.branchSelected = true;
        this.log('   ✅ Entering #else block');
      }
      return true;
    }

    // #endif
    if (L.startsWith('#endif')) {
      const top = this.condStack.pop();
      if (!top) return true;
      if (this.skipDepth > 0 && !top.branchSelected) this.skipDepth--;
      this.log('   🔚 Exiting conditional block');
      return true;
    }

    return false;
  },

  /**
   * Evaluate conditional expression (wrapper)
   */
  evaluateCondition(conditionStr) {
    return this.safeEvalBooleanExpr(conditionStr);
  },

  /**
   * Check conditionalOn / conditionalOnAll / conditionalOnNot against active flags
   */
  checkConditionalSpec(fieldSpec) {
    const isActive = (name) => this.globalConditionals.has(name) || this.variables[name] !== undefined;

    // OR semantics: any of these must be active
    if (fieldSpec.conditionalOn) {
      const list = Array.isArray(fieldSpec.conditionalOn) ? fieldSpec.conditionalOn : [fieldSpec.conditionalOn];
      const ok = list.some(isActive);
      if (!ok) return { ok: false, reason: `conditionalOn: ${list.join(' OR ')}` };
    }

    // AND semantics: all must be active
    if (fieldSpec.conditionalOnAll) {
      const list = Array.isArray(fieldSpec.conditionalOnAll) ? fieldSpec.conditionalOnAll : [fieldSpec.conditionalOnAll];
      const ok = list.every(isActive);
      if (!ok) return { ok: false, reason: `conditionalOnAll: ${list.join(' AND ')}` };
    }

    // NOT semantics: none of these may be active
    if (fieldSpec.conditionalOnNot) {
      const list = Array.isArray(fieldSpec.conditionalOnNot) ? fieldSpec.conditionalOnNot : [fieldSpec.conditionalOnNot];
      const ok = list.every((name) => !isActive(name));
      if (!ok) return { ok: false, reason: `conditionalOnNot: NOT(${list.join(' OR ')})` };
    }

    return { ok: true };
  },

  /**
   * Second Pass: Parse fields with conditional evaluation
   */
  secondPass(lines, config) {
    this.log('📝 Pass 2: Parsing fields...');
    this.initPreprocessorState();

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();

      // Skip empty/comment
      if (!line || line.startsWith('//')) continue;

      // Handle preprocessor directives
      if (this.handlePreprocessor(line)) continue;

      // Skip lines in false conditional blocks
      if (this.skipDepth > 0) continue;

      // Parse #define statements
      if (line.startsWith('#define')) {
        const nameMatch = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
        if (!nameMatch) continue;

        const [, defineName, valueRaw] = nameMatch;
        const cleanValue = valueRaw ? valueRaw.split('//')[0].trim() : true;

        // Track active feature flags (bare #define)
        if (cleanValue === true && this.isGlobalConditional(defineName)) {
          this.globalConditionals.add(defineName);
        }

        // Store numeric values for variable substitution
        const mVal = line.match(/#define\s+(\w+)\s+(-?(?:\d+(?:\.\d+)?|0x[0-9A-Fa-f]+))\b/);
        if (mVal) {
          this.variables[mVal[1]] = mVal[2];
          this.log(`   📦 Variable stored (from active branch):`, mVal[1], '=', mVal[2]);
        }

        // Map to config via field mapping
        this.parseDefineLine(line, config);
      }
    }
  },

  /**
   * Check if a define is a global conditional
   */
  isGlobalConditional(defineName) {
    const globalPatterns = [
      // Printer models
      /^ENDER\d+/,
      /^CR10/,
      /^CHIRON/,
      /^AQUILA/,
      /^SOVOL/,

      // Probe types & mounts
      /^BLTOUCH$/,
      /^EZABL$/,
      /^CUSTOM_PROBE$/,
      /.*_OEM$/,
      /.*_MOUNT$/,

      // Major features
      /^CLASSIC_JERK$/,
      /^JUNCTION_DEVIATION$/,
      /^LINEAR_ADVANCE$/,
      /^INPUT_SHAPING$/,
      /^EZOUT_ENABLE$/,
      /^MANUAL_MESH_LEVELING$/,
      /^ABL_/,
      /^V42X_TMC$/,
      /^EZNEO$/,

      // Hardware variants / speed limits
      /^SPRITE_EXTRUDER$/,
      /^XTENDER_/,
      /^LIMIT_Z_SPEED_5$/,
      /^LIMIT_Z_SPEED_10$/,
      /^SPACE_SAVER_2560$/,
      /^E_SPEED_OVERRIDE_2560$/
    ];
    return globalPatterns.some((pattern) => pattern.test(defineName));
  },

  /**
   * Parse a single #define line using field mapping
   */
  parseDefineLine(line, config) {
    const match = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
    if (!match) return;

    const [, defineName, value] = match;
    const cleanValue = value ? value.split('//')[0].trim() : true;

    // Search through field mapping
    for (const [category, fields] of Object.entries(this.fieldMapping)) {
      if (category.startsWith('$') || ['description', 'lastUpdated', 'version', 'warnings'].includes(category)) continue;

      for (const [fieldName, fieldSpec] of Object.entries(fields)) {
        if (typeof fieldSpec !== 'object' || !fieldSpec.mapsFrom) continue;

        const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom : [fieldSpec.mapsFrom];

        // Match (support wildcards *)
        let matched = false;
        for (const mapPattern of mapsFrom) {
          if (typeof mapPattern === 'string' && mapPattern.includes('*')) {
            const regex = new RegExp('^' + mapPattern.replace(/\*/g, '.*') + '$');
            if (regex.test(defineName)) { matched = true; break; }
          } else if (mapPattern === defineName) {
            matched = true; break;
          }
        }
        if (!matched) continue;

        // Check conditional dependencies (OR / AND / NOT)
        const condCheck = this.checkConditionalSpec(fieldSpec);
        if (!condCheck.ok) {
          this.log(`   ⏭️  Skipped ${defineName} (${condCheck.reason}) - condition not met`);
          return;
        }

        // Extract and store value
        const extractedValue = this.extractValue(cleanValue, fieldSpec.type, fieldSpec);
        this.storeValue(config, category, fieldName, extractedValue, fieldSpec);
        this.log(`   ✅ Mapped ${defineName} → ${category}.${fieldName} =`, extractedValue);
        return;
      }
    }
  },

  /**
   * Extract value based on field type
   */
  extractValue(rawValue, type, fieldSpec) {
    if (typeof rawValue !== 'string') rawValue = String(rawValue);

    // Resolve variable references by name when not a literal/expr
    const looksLikeIdentifier = /^[A-Z_][A-Z0-9_]*$/.test(rawValue);
    const looksLikeNumber = /^-?(?:\d+(?:\.\d+)?|0x[0-9A-Fa-f]+)$/.test(rawValue);
    const looksLikeString = /^["']/.test(rawValue);
    const looksLikeArray = /^\{/.test(rawValue);
    const looksLikeExpr = /[()*/+\-]/.test(rawValue);

    if (looksLikeIdentifier && this.variables && this.variables[rawValue] !== undefined) {
      this.log(`🔄 Resolving variable ${rawValue} = ${this.variables[rawValue]}`);
      rawValue = this.variables[rawValue];
    }

    // Keep expressions as-is
    if (looksLikeExpr && !looksLikeString && !looksLikeArray) {
      this.log(`📐 Storing expression as-is: ${rawValue}`);
      return rawValue;
    }

    switch (type) {
      case 'string': {
        return this.extractString(rawValue);
      }
      case 'integer': {
        const intVal = looksLikeNumber ? (rawValue.startsWith('0x') ? parseInt(rawValue, 16) : parseInt(rawValue, 10)) : NaN;
        return Number.isNaN(intVal) ? rawValue : intVal;
      }
      case 'float': {
        const floatVal = looksLikeNumber
          ? (rawValue.startsWith('0x') ? parseInt(rawValue, 16) : parseFloat(rawValue))
          : NaN;
        return Number.isNaN(floatVal) ? rawValue : floatVal;
      }
      case 'boolean': {
        if (rawValue === true) return true;
        const s = String(rawValue).toLowerCase();
        return s === 'true' || s === '1';
      }
      case 'array': {
        return this.extractArray(rawValue, fieldSpec);
      }
      default:
        return rawValue;
    }
  },

  /**
   * Store value in config object
   */
  storeValue(config, category, fieldName, value, fieldSpec) {
    // Array index extraction if mapsFrom: "NAME[2]"
    const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom[0] : fieldSpec.mapsFrom;
    const arrayMatch =
      typeof mapsFrom === 'string' ? mapsFrom.match(/^(.+)\[(\d+)\]$/) : null;

    if (arrayMatch && Array.isArray(value)) {
      const [, arrayName, indexStr] = arrayMatch;
      const index = parseInt(indexStr, 10);
      this.log(`   🔢 Array field detected: ${arrayName}[${index}] → extracting element ${index}`);
      value = value[index];

      if (fieldSpec.type === 'float') value = parseFloat(value);
      else if (fieldSpec.type === 'integer') value = parseInt(value, 10);
    }

    // Nested field names like "motion.xy.max"
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      let current = config[category];
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      if (!config[category]) config[category] = {};
      config[category][fieldName] = value;
    }
  },

  /**
   * Extract string value from quotes
   */
  extractString(value) {
    const m = String(value).match(/["'](.+?)["']/);
    return m ? m[1] : String(value);
  },

  /**
   * Extract array values from { x, y, z, ... } with optional element coercion
   */
  extractArray(value, fieldSpec) {
    const match = String(value).match(/\{(.+?)\}/);
    if (!match) return [];
    const raw = match[1].split(',').map((v) => v.trim());
    const out = raw.map((v) => {
      // Substitute variable references
      const resolved = this.variables?.[v] ?? v;
      // Coerce by elementType if provided
      const t = fieldSpec?.elementType;
      if (t === 'float') return parseFloat(resolved);
      if (t === 'integer') return parseInt(resolved, 10);
      if (t === 'boolean') return ['true', '1'].includes(String(resolved).toLowerCase());
      return resolved;
    });
    return out;
  },

  /**
   * Apply defaults (by define name) and derived calculations for speed/accel/jerk
   */
  applyDefaultsAndDerived(config) {
    // Helper: find field by define name across mapping
    const findFieldByDefine = (defineName) => {
      for (const [category, fields] of Object.entries(this.fieldMapping)) {
        if (category.startsWith('$') || ['description', 'lastUpdated', 'version', 'warnings'].includes(category)) continue;
        for (const [fieldName, fieldSpec] of Object.entries(fields)) {
          const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom : [fieldSpec.mapsFrom];
          if (mapsFrom && mapsFrom.some((m) => m === defineName)) {
            return { category, fieldName };
          }
        }
      }
      return null;
    };

    // Resolve defaults that reference other defines (e.g., "DEFAULT_ACCELERATION")
    for (const [category, fields] of Object.entries(this.fieldMapping)) {
      if (category.startsWith('$') || ['description', 'lastUpdated', 'version', 'warnings'].includes(category)) continue;
      for (const [fieldName, fieldSpec] of Object.entries(fields)) {
        const currentVal = config[category]?.[fieldName];
        if (currentVal === undefined && fieldSpec?.default !== undefined) {
          const defVal = fieldSpec.default;
          let resolved = defVal;

          if (typeof defVal === 'string' && /^[A-Z_][A-Z0-9_]*$/.test(defVal)) {
            // Try variables first
            if (this.variables[defVal] !== undefined) {
              resolved = this.variables[defVal];
            } else {
              // Try mapped field that comes from this define
              const loc = findFieldByDefine(defVal);
              if (loc) resolved = config[loc.category]?.[loc.fieldName];
            }
          }

          if (resolved !== undefined) {
            // Coerce based on type
            if (!config[category]) config[category] = {};
            config[category][fieldName] = this.extractValue(String(resolved), fieldSpec.type, fieldSpec);
            this.log(`   🔧 Default applied for ${category}.${fieldName} ->`, config[category][fieldName]);
          }
        }
      }
    }

    // ===== Derived calculations specific to Configuration_speed.h =====
    // Bed size detection (largest axis)
    const xBed =
      this.variables.X_BED_SIZE !== undefined
        ? parseFloat(String(this.variables.X_BED_SIZE).replace(/^0x/, ''))
        : undefined;
    const yBed =
      this.variables.Y_BED_SIZE !== undefined
        ? parseFloat(String(this.variables.Y_BED_SIZE).replace(/^0x/, ''))
        : undefined;
    const largestBed = xBed && yBed ? Math.max(xBed, yBed) : xBed || yBed;

    // Helper: XY jerk by bed size
    const jerkByBed = (size) => {
      if (!size && size !== 0) return undefined;
      if (size < 200) return 10.0;
      if (size <= 299) return 8.0;
      if (size <= 399) return 6.0;
      return 4.0; // >= 400
    };

    // Helper: XY max accel by bed brackets (from your mapping)
    const maxAccelXYByBed = (size) => {
      if (!size && size !== 0) return undefined;
      if (size < 151) return 4500;
      if (size <= 200) return 4000;
      if (size <= 250) return 3500;
      if (size <= 300) return 3000;
      if (size <= 350) return 2500;
      if (size <= 400) return 2000;
      if (size <= 450) return 1500;
      return 1000; // >450
    };

    // Feedrates.defaultMaxFeedrate: { 400, 400, Z, E }
    if (this.fieldMapping?.feedrates?.defaultMaxFeedrate && config.feedrates.defaultMaxFeedrate === undefined) {
      const zLimit5 = this.globalConditionals.has('LIMIT_Z_SPEED_5');
      const zLimit10 = this.globalConditionals.has('LIMIT_Z_SPEED_10');
      const spaceSaver = this.globalConditionals.has('SPACE_SAVER_2560');
      const eOverride = this.globalConditionals.has('E_SPEED_OVERRIDE_2560');

      const maxZ = zLimit5 ? 5 : zLimit10 ? 10 : 15;
      const maxE = spaceSaver && !eOverride ? 30 : 200;

      config.feedrates.defaultMaxFeedrate = [400, 400, maxZ, maxE];
      this.log('   🏎️  Derived defaultMaxFeedrate:', config.feedrates.defaultMaxFeedrate);
    }

    // Acceleration.defaultMaxAcceleration: { XY, XY, 500, 5000 } with overrides
    if (this.fieldMapping?.acceleration?.defaultMaxAcceleration && config.acceleration.defaultMaxAcceleration === undefined) {
      let xy = maxAccelXYByBed(largestBed) ?? 3000; // fallback
      // Overrides
      const maxXOverride =
        this.variables.MAX_X_ACCEL !== undefined ? parseInt(this.variables.MAX_X_ACCEL, 10) : undefined;
      const maxYOverride =
        this.variables.MAX_Y_ACCEL !== undefined ? parseInt(this.variables.MAX_Y_ACCEL, 10) : undefined;

      const xAccel = maxXOverride ?? xy;
      const yAccel = maxYOverride ?? xAccel; // if Y not set, uses X (per notes)
      config.acceleration.defaultMaxAcceleration = [xAccel, yAccel, 500, 5000];
      this.log('   🏗️  Derived defaultMaxAcceleration:', config.acceleration.defaultMaxAcceleration);
    }

    // Acceleration.defaultAcceleration: half of XY max
    if (this.fieldMapping?.acceleration?.defaultAcceleration && config.acceleration.defaultAcceleration === undefined) {
      const xy = maxAccelXYByBed(largestBed) ?? 3000;
      const defaultAccel = Math.round(xy / 2);
      config.acceleration.defaultAcceleration = defaultAccel;
      this.log('   ⚙️  Derived defaultAcceleration:', defaultAccel);
    }

    // Acceleration.defaultTravelAcceleration: default to DEFAULT_ACCELERATION if not set
    if (this.fieldMapping?.acceleration?.defaultTravelAcceleration && config.acceleration.defaultTravelAcceleration === undefined) {
      const fromAccel = config.acceleration.defaultAcceleration;
      if (fromAccel !== undefined) {
        config.acceleration.defaultTravelAcceleration = fromAccel;
        this.log('   🚚 Derived defaultTravelAcceleration:', fromAccel);
      }
    }

    // Jerk derived values only if Junction Deviation is disabled
    const isJDEnabled =
      this.globalConditionals.has('JUNCTION_DEVIATION') || this.variables['JUNCTION_DEVIATION'] !== undefined;

    if (!isJDEnabled) {
      if (this.fieldMapping?.jerk?.defaultXJerk && config.jerk.defaultXJerk === undefined) {
        const xj = jerkByBed(largestBed) ?? 6.0;
        config.jerk.defaultXJerk = xj;
        this.log('   🌀 Derived defaultXJerk:', xj);
      }
      if (this.fieldMapping?.jerk?.defaultYJerk && config.jerk.defaultYJerk === undefined) {
        const yj =
          config.jerk.defaultXJerk !== undefined ? config.jerk.defaultXJerk : jerkByBed(largestBed) ?? 6.0;
        config.jerk.defaultYJerk = yj;
        this.log('   🌀 Derived defaultYJerk:', yj);
      }
      if (this.fieldMapping?.jerk?.defaultZJerk && config.jerk.defaultZJerk === undefined) {
        config.jerk.defaultZJerk = 0.3;
      }
      if (this.fieldMapping?.jerk?.defaultEJerk && config.jerk.defaultEJerk === undefined) {
        config.jerk.defaultEJerk = 5.0;
      }
    } else {
      this.log('   🚫 Skipping classic jerk derivation (Junction Deviation enabled)');
    }
  },

  /**
   * Validate configuration
   */
  validateConfig(config) {
    for (const [category, fields] of Object.entries(this.fieldMapping)) {
      if (category.startsWith('$') || ['description', 'lastUpdated', 'version', 'warnings'].includes(category)) continue;

      for (const [fieldName, fieldSpec] of Object.entries(fields)) {
        if (!fieldSpec.validation && !fieldSpec.required) continue;

        const value = config[category]?.[fieldName];

        // Required: check for undefined (not falsy)
        if (fieldSpec.required && value === undefined) {
          const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom.join(', ') : fieldSpec.mapsFrom;
          config.warnings.push({
            level: (fieldSpec.validation && fieldSpec.validation.errorLevel) || 'error',
            message: `Missing required field: ${fieldName} (${mapsFrom})`
          });
        }

        if (fieldSpec.validation?.mustBeTrue && !value) {
          config.warnings.push({
            level: fieldSpec.validation.errorLevel || 'error',
            message: fieldSpec.th3dNotes || `${fieldName} should be enabled for safety`
          });
        }
      }
    }
  },

  /**
   * Parse multiple configuration files and merge
   */
  async parseMultipleFiles(files) {
    await this.loadFieldMapping();

    this.log('📚 Parsing multiple config files');
    const configs = [];

    if (files.config) {
      this.log('   📄 Parsing Configuration.h...');
      const cfg = await this.parseConfigFile(files.config);
      configs.push(cfg);
    }
    if (files.configAdv) {
      this.log('   📄 Parsing Configuration_adv.h...');
      const cfg = await this.parseConfigFile(files.configAdv);
      configs.push(cfg);
    }
    if (files.configBackend) {
      this.log('   📄 Parsing Configuration_backend.h...');
      const cfg = await this.parseConfigFile(files.configBackend);
      configs.push(cfg);
    }
    if (files.configSpeed) {
      this.log('   📄 Parsing Configuration_speed.h...');
      const cfg = await this.parseConfigFile(files.configSpeed);
      configs.push(cfg);
    }

    const merged = this.mergeConfigs(configs);
    this.log('✅ All files parsed and merged');

    return merged;
  },

  /**
   * Merge multiple config objects
   */
  mergeConfigs(configs) {
    const merged = {
      basic: {},
      hardware: {},
      temperature: {},
      motion: {},
      probe: {},
      bedLeveling: {},
      advanced: {},
      safety: {},
      communication: {},
      serial: {},
      tmc: {},
      thermal: {},
      lcd: {},
      feedrates: {},
      acceleration: {},
      jerk: {},
      speed: {},
      backend: {},
      warnings: []
    };

    for (const config of configs) {
      for (const [category, fields] of Object.entries(config)) {
        if (category === 'warnings') {
          merged.warnings.push(...fields);
          continue;
        }
        if (!merged[category]) merged[category] = {};
        this.deepMerge(merged[category], fields);
      }
    }
    return merged;
  },

  /**
   * Deep merge two objects
   */
  deepMerge(target, source) {
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.MarlinConfigParser = MarlinConfigParser;
  window.TH3DConfigParser = MarlinConfigParser.create('th3d');
}

// Optional CommonJS export for Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarlinConfigParser };
}

/**
 * Save parsed configuration to a JSON file
 * @param {object} config - Parsed configuration object
 * @param {string} filename - Output file path
 */
async function saveConfigToFile(config, filename = 'parsed-config.json') {
  const jsonData = JSON.stringify(config, null, 2); // pretty-print
  if (typeof window === 'undefined') {
    // Node.js environment
    const fs = await import('node:fs/promises');
    await fs.writeFile(filename, jsonData, 'utf8');
    console.log(`✅ Config saved to ${filename}`);
  } else {
    // Browser: trigger download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`✅ Config download triggered: ${filename}`);
  }
}
``

