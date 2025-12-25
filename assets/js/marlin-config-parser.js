/* ============================================
   Universal Marlin Configuration Parser
   Parse ANY Marlin-based firmware configuration files
   
   Supports:
   - TH3D Unified Firmware
   - Vanilla Marlin
   - Custom Marlin variants
   
   Features:
   - Configurable mapping file sets
   - Full preprocessor support (#if/#elif/#else)
   - Variable storage & resolution
   - Array field mapping
   - Wildcard matching
   - Runtime conditionals
   - Multi-file parsing
   
   Usage:
   const parser = MarlinConfigParser.create('th3d');
   const config = await parser.parseMultipleFiles(files);
   ============================================ */

const MarlinConfigParser = {
    
    // Debug mode - set to false to suppress all console logging
    DEBUG: true,
    
    /**
     * Debug logger - only logs if DEBUG is true
     */
    log(...args) {
        if (this.DEBUG) {
            console.log(...args);
        }
    },
    
    /**
     * Mapping file set configurations
     * Add new firmware variants here
     */
    mappingSets: {
        'th3d': {
            name: 'TH3D Unified Firmware',
            basePath: 'assets/data/maps/th3d/',
            files: [
                'th3d-config-mapping.json',
                'th3d-config-adv-mapping-part1.json',
                'th3d-config-adv-mapping-part2.json',
                'th3d-config-adv-mapping-part3.json',
                'th3d-config-adv-mapping-part4.json',
                'th3d-config-backend-mapping.json',
                'th3d-config-speed-mapping.json'
            ]
        },
        'marlin': {
            name: 'Vanilla Marlin',
            basePath: 'assets/data/maps/marlin/',
            files: [
                'marlin-config-mapping.json',
                'marlin-config-adv-mapping.json'
            ]
        },
        // Add more firmware variants as needed
        'custom': {
            name: 'Custom Mapping',
            basePath: 'assets/data/maps/custom/',
            files: []  // Set dynamically
        }
    },
    
    /**
     * Create a parser instance for a specific firmware variant
     * @param {string} variant - 'th3d', 'marlin', or 'custom'
     * @param {object} customConfig - Optional custom configuration
     * @returns {object} Parser instance
     */
    create(variant = 'th3d', customConfig = null) {
        const instance = Object.create(this);
        
        // Set mapping configuration
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
            
            // Load all mapping files in parallel
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
            
            // Filter out failed loads
            const validMappings = mappings.filter(m => m !== null);
            
            if (validMappings.length === 0) {
                throw new Error('No mapping files could be loaded');
            }
            
            // Merge all mappings into one object
            this.fieldMapping = this.mergeMappings(validMappings);
            
            this.log('✅ Field Mappings loaded and merged');
            this.log('   Categories:', Object.keys(this.fieldMapping).filter(k => !k.startsWith('$') && k !== 'description' && k !== 'lastUpdated' && k !== 'version').join(', '));
            
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
        
        // Merge each mapping file
        for (const mapping of mappings) {
            for (const [category, fields] of Object.entries(mapping)) {
                // Skip metadata
                if (category.startsWith('$') || category === 'description' || category === 'lastUpdated' || category === 'version' || category === 'part' || category === 'sourceFile' || category === 'th3dNotes') {
                    continue;
                }
                
                // Initialize category if it doesn't exist
                if (!merged[category]) {
                    merged[category] = {};
                }
                
                // Merge fields (later files override earlier)
                Object.assign(merged[category], fields);
            }
        }
        
        return merged;
    },
    
    /**
     * Parse configuration file content
     * @param {string} content - File content as text
     * @returns {object} Parsed configuration object
     */
    async parseConfigFile(content) {
        // Ensure mapping is loaded
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
            warnings: []
        };
        
        const lines = content.split('\n');
        
        this.log(`🔍 ${this.mappingConfig.name} Parser: Starting parse of ${lines.length} lines`);
        
        // Two-pass parsing strategy
        this.firstPass(lines);
        this.secondPass(lines, config);
        
        // Validate and add warnings
        this.validateConfig(config);
        
        return config;
    },
    
    /**
     * First Pass: Collect global conditionals and unconditional variables
     * Only processes #defines outside of conditional blocks
     */
    firstPass(lines) {
        this.log('🎯 Pass 1: Detecting global conditionals...');
        let inConditionalBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip comments
            if (line.startsWith('//')) continue;
            
            // Track conditional block boundaries
            if (line.startsWith('#if') || line.startsWith('#ifndef') || line.startsWith('#ifdef')) {
                inConditionalBlock = true;
                continue;
            }
            if (line.startsWith('#endif')) {
                inConditionalBlock = false;
                continue;
            }
            
            // Only process defines outside conditional blocks
            if (!inConditionalBlock && line.startsWith('#define')) {
                const match = line.match(/#define\s+(\w+)/);
                if (match) {
                    const defineName = match[1];
                    
                    // Track global conditionals (printer models, features, etc.)
                    if (this.isGlobalConditional(defineName)) {
                        this.globalConditionals.add(defineName);
                        this.log('   ✅ Global conditional active:', defineName);
                    }
                    
                    // Store unconditional numeric variables
                    const valueMatch = line.match(/#define\s+(\w+)\s+([\d.]+)$/);
                    if (valueMatch) {
                        this.variables[valueMatch[1]] = valueMatch[2];
                        this.log('   📦 Variable stored:', valueMatch[1], '=', valueMatch[2]);
                    }
                }
            }
        }
        
        this.log('🎯 Active conditionals:', Array.from(this.globalConditionals).join(', '));
        this.log('🔍 Variables collected:', Object.keys(this.variables).length);
    },
    
    /**
     * Second Pass: Parse fields with conditional evaluation
     * Handles #if/#elif/#else blocks and stores variables from active branches
     */
    secondPass(lines, config) {
        this.log('📝 Pass 2: Parsing fields...');
        
        let conditionalStack = [];
        let skipUntilEndif = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                continue;
            }
            
            // Handle preprocessor directives
            if (this.handlePreprocessor(line, conditionalStack, skipUntilEndif)) {
                skipUntilEndif = this.skipUntilEndif;
                continue;
            }
            
            // Skip lines in false conditional blocks
            if (skipUntilEndif > 0) {
                continue;
            }
            
            // Parse #define statements
            if (line.startsWith('#define')) {
                // Store numeric values for variable substitution
                const valueMatch = line.match(/#define\s+(\w+)\s+([\d.]+)\s*(?:\/\/.*)?$/);
                if (valueMatch) {
                    this.variables[valueMatch[1]] = valueMatch[2];
                    this.log(`   📦 Variable stored (from active branch):`, valueMatch[1], '=', valueMatch[2]);
                }
                
                this.parseDefineLine(line, config);
            }
        }
    },
    
    /**
     * Handle preprocessor directives (#if, #elif, #else, #endif, #ifndef)
     * @returns {boolean} True if line was a preprocessor directive
     */
    handlePreprocessor(line, conditionalStack, skipUntilEndif) {
        // #ifndef
        if (line.startsWith('#ifndef')) {
            const match = line.match(/#ifndef\s+(\w+)/);
            if (match) {
                const defineName = match[1];
                const isDefined = this.variables[defineName] !== undefined;
                conditionalStack.push({ type: 'ifndef', condition: !isDefined, taken: false });
                if (isDefined) {
                    this.skipUntilEndif = (this.skipUntilEndif || 0) + 1;
                    this.log(`   ⏭️  Skipping #ifndef ${defineName} block (already defined)`);
                } else {
                    this.skipUntilEndif = skipUntilEndif;
                }
            }
            return true;
        }
        
        // #if
        if (line.startsWith('#if ') && !line.startsWith('#ifndef') && !line.startsWith('#ifdef')) {
            const conditionMatch = line.match(/#if\s+(.+)/);
            if (conditionMatch) {
                const conditionStr = conditionMatch[1].trim();
                const result = this.evaluateCondition(conditionStr);
                conditionalStack.push({ type: 'if', condition: result, taken: result });
                if (!result) {
                    this.skipUntilEndif = (this.skipUntilEndif || 0) + 1;
                    this.log(`   ⏭️  Skipping #if block (condition false):`, conditionStr);
                } else {
                    this.log(`   ✅ Entering #if block (condition true):`, conditionStr);
                    this.skipUntilEndif = skipUntilEndif;
                }
            }
            return true;
        }
        
        // #elif
        if (line.startsWith('#elif')) {
            if (conditionalStack.length > 0) {
                const currentBlock = conditionalStack[conditionalStack.length - 1];
                
                if (currentBlock.taken) {
                    if (!this.skipUntilEndif) this.skipUntilEndif = 1;
                    this.log(`   ⏭️  Skipping #elif (previous branch taken)`);
                    return true;
                }
                
                const conditionMatch = line.match(/#elif\s+(.+)/);
                if (conditionMatch) {
                    const conditionStr = conditionMatch[1].trim();
                    const result = this.evaluateCondition(conditionStr);
                    
                    if (result) {
                        if (this.skipUntilEndif > 0) this.skipUntilEndif--;
                        currentBlock.taken = true;
                        this.log(`   ✅ Entering #elif block (condition true):`, conditionStr);
                    } else {
                        if (!this.skipUntilEndif) this.skipUntilEndif = 1;
                        this.log(`   ⏭️  Skipping #elif block (condition false):`, conditionStr);
                    }
                }
            }
            return true;
        }
        
        // #else
        if (line.startsWith('#else')) {
            if (conditionalStack.length > 0) {
                const currentBlock = conditionalStack[conditionalStack.length - 1];
                
                if (currentBlock.taken) {
                    if (!this.skipUntilEndif) this.skipUntilEndif = 1;
                    this.log(`   ⏭️  Skipping #else (previous branch taken)`);
                } else {
                    if (this.skipUntilEndif > 0) this.skipUntilEndif--;
                    currentBlock.taken = true;
                    this.log(`   ✅ Entering #else block`);
                }
            }
            return true;
        }
        
        // #endif
        if (line.startsWith('#endif')) {
            if (this.skipUntilEndif > 0) {
                this.skipUntilEndif--;
            }
            if (conditionalStack.length > 0) {
                conditionalStack.pop();
            }
            return true;
        }
        
        return false;
    },
    
    /**
     * Evaluate conditional expression (#if, #elif)
     */
    evaluateCondition(conditionStr) {
        // Handle ENABLED(NAME)
        conditionStr = conditionStr.replace(/ENABLED\((\w+)\)/g, (match, name) => {
            return this.globalConditionals.has(name) ? 'true' : 'false';
        });
        
        // Handle DISABLED(NAME)
        conditionStr = conditionStr.replace(/DISABLED\((\w+)\)/g, (match, name) => {
            return !this.globalConditionals.has(name) ? 'true' : 'false';
        });
        
        // Replace variable names with values
        conditionStr = conditionStr.replace(/\b([A-Z_][A-Z0-9_]*)\b/g, (match, varName) => {
            if (this.variables && this.variables[varName] !== undefined) {
                return this.variables[varName];
            }
            return '0';
        });
        
        // Evaluate expression safely
        try {
            const result = new Function(`return ${conditionStr}`)();
            this.log(`   📊 Condition "${conditionStr}" evaluated to:`, result);
            return !!result;
        } catch (error) {
            this.log(`   ⚠️  Could not evaluate condition "${conditionStr}":`, error.message);
            return false;
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
            
            // Probe types
            /^BLTOUCH/,
            /^EZABL/,
            /^CUSTOM_PROBE/,
            /.*_OEM$/,
            /.*_MOUNT$/,
            
            // Major features
            /^LINEAR_ADVANCE/,
            /^INPUT_SHAPING/,
            /^EZOUT_ENABLE/,
            /^MANUAL_MESH_LEVELING/,
            /^ABL_/,
            /^V42X_TMC/,
            /^EZNEO/,
            
            // Hardware variants
            /^SPRITE_EXTRUDER/,
            /^XTENDER_/
        ];
        
        return globalPatterns.some(pattern => pattern.test(defineName));
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
            // Skip metadata
            if (category.startsWith('$') || category === 'description' || category === 'lastUpdated' || category === 'version' || category === 'warnings') {
                continue;
            }
            
            for (const [fieldName, fieldSpec] of Object.entries(fields)) {
                if (typeof fieldSpec !== 'object' || !fieldSpec.mapsFrom) {
                    continue;
                }
                
                const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom : [fieldSpec.mapsFrom];
                
                // Check for match (including wildcards)
                let matched = false;
                for (const mapPattern of mapsFrom) {
                    if (mapPattern.includes('*')) {
                        const regex = new RegExp('^' + mapPattern.replace(/\*/g, '.*') + '$');
                        if (regex.test(defineName)) {
                            matched = true;
                            break;
                        }
                    } else if (mapPattern === defineName) {
                        matched = true;
                        break;
                    }
                }
                
                if (matched) {
                    // Check conditional dependencies
                    if (fieldSpec.conditionalOn) {
                        const conditions = Array.isArray(fieldSpec.conditionalOn) ? fieldSpec.conditionalOn : [fieldSpec.conditionalOn];
                        const hasActiveParent = conditions.some(cond => this.globalConditionals.has(cond));
                        
                        if (!hasActiveParent) {
                            this.log(`   ⏭️  Skipped ${defineName} (conditionalOn: ${conditions.join(' OR ')}) - parent(s) not active`);
                            return;
                        }
                    }
                    
                    // Extract and store value
                    const extractedValue = this.extractValue(cleanValue, fieldSpec.type, fieldSpec);
                    this.storeValue(config, category, fieldName, extractedValue, fieldSpec);
                    this.log(`   ✅ Mapped ${defineName} → ${category}.${fieldName} =`, extractedValue);
                    return;
                }
            }
        }
    },
    
    /**
     * Extract value based on field type
     */
    extractValue(rawValue, type, fieldSpec) {
        if (typeof rawValue !== 'string') {
            rawValue = String(rawValue);
        }
        
        // Check for variable reference
        if (!rawValue.match(/^[\d.-]+$/) &&
            !rawValue.match(/^["']/) &&
            !rawValue.match(/^\{/) &&
            !rawValue.match(/[\(\)\*\/\+\-]/) &&
            this.variables && this.variables[rawValue]) {
            
            this.log(`🔄 Resolving variable ${rawValue} = ${this.variables[rawValue]}`);
            rawValue = this.variables[rawValue];
        }
        
        // Keep expressions as-is
        if (rawValue.match(/[\(\)\*\/]/)) {
            this.log(`📐 Storing expression as-is: ${rawValue}`);
            return rawValue;
        }
        
        switch (type) {
            case 'string':
                return this.extractString(rawValue);
            case 'integer':
                const intVal = parseInt(rawValue);
                return isNaN(intVal) ? rawValue : intVal;
            case 'float':
                const floatVal = parseFloat(rawValue);
                return isNaN(floatVal) ? rawValue : floatVal;
            case 'boolean':
                return rawValue === true || rawValue === 'true' || rawValue === '1';
            case 'array':
                return this.extractArray(rawValue);
            default:
                return rawValue;
        }
    },
    
    /**
     * Store value in config object
     */
    storeValue(config, category, fieldName, value, fieldSpec) {
        // Handle array index extraction
        const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom[0] : fieldSpec.mapsFrom;
        const arrayMatch = mapsFrom.match(/^(.+)\[(\d+)\]$/);
        
        if (arrayMatch && Array.isArray(value)) {
            const [, arrayName, indexStr] = arrayMatch;
            const index = parseInt(indexStr);
            this.log(`   🔢 Array field detected: ${arrayName}[${index}] → extracting element ${index}`);
            value = value[index];
            
            if (fieldSpec.type === 'float') {
                value = parseFloat(value);
            } else if (fieldSpec.type === 'integer') {
                value = parseInt(value);
            }
        }
        
        // Handle nested field names
        if (fieldName.includes('.')) {
            const parts = fieldName.split('.');
            let current = config[category];
            
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = value;
        } else {
            if (!config[category]) {
                config[category] = {};
            }
            config[category][fieldName] = value;
        }
    },
    
    /**
     * Extract string value from quotes
     */
    extractString(value) {
        const match = value.match(/["'](.+?)["']/);
        return match ? match[1] : value;
    },
    
    /**
     * Extract array values from { x, y, z, ... }
     */
    extractArray(value) {
        const match = value.match(/\{(.+?)\}/);
        if (!match) return [];
        return match[1].split(',').map(v => {
            v = v.trim();
            if (this.variables && this.variables[v]) {
                this.log(`🔄 Substituting ${v} = ${this.variables[v]}`);
                return this.variables[v];
            }
            return v;
        });
    },
    
    /**
     * Validate configuration
     */
    validateConfig(config) {
        // Validation logic from field mapping
        for (const [category, fields] of Object.entries(this.fieldMapping)) {
            if (category.startsWith('$') || category === 'description' || category === 'lastUpdated' || category === 'version' || category === 'warnings') {
                continue;
            }
            
            for (const [fieldName, fieldSpec] of Object.entries(fields)) {
                if (!fieldSpec.validation) continue;
                
                const validation = fieldSpec.validation;
                const value = config[category]?.[fieldName];
                
                if (fieldSpec.required && !value) {
                    config.warnings.push({
                        level: validation.errorLevel || 'error',
                        message: `Missing required field: ${fieldName} (${fieldSpec.mapsFrom.join(', ')})`
                    });
                }
                
                if (validation.mustBeTrue && !value) {
                    config.warnings.push({
                        level: validation.errorLevel || 'error',
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
                
                if (!merged[category]) {
                    merged[category] = {};
                }
                
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
                if (!target[key]) {
                    target[key] = {};
                }
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
}

// For backward compatibility, create TH3D parser instance
if (typeof window !== 'undefined') {
    window.TH3DConfigParser = MarlinConfigParser.create('th3d');
}
