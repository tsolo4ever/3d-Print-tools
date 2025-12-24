/* ============================================
   TH3D Configuration.h Parser (Data-Driven)
   Parse TH3D Unified Firmware Configuration files
   Uses th3d-field-mapping.json as source of truth
   
   ⚠️ KNOWN LIMITATIONS:
   - Array fields (DEFAULT_AXIS_STEPS_PER_UNIT) need special handling
   - Field mapping has stepsPerMM.x, stepsPerMM.y, etc. as separate fields
   - But #define is a single array { 80, 80, 400, 93 }
   - Currently extractArray() returns array, but storeValue() expects single value
   
   📋 TODO:
   - Add array index extraction logic in storeValue()
   - Handle nested array-to-object mapping (array[0] → obj.x)
   - Test with all TH3D example files
   - Add fallback for fields not in mapping
   ============================================ */

const TH3DConfigParser = {
    
    // Field mapping loaded from JSON
    fieldMapping: null,
    
    /**
     * Load field mapping from JSON file
     */
    async loadFieldMapping() {
        if (this.fieldMapping) return this.fieldMapping;
        
        try {
            const response = await fetch('firmware-helper/th3d-field-mapping.json');
            this.fieldMapping = await response.json();
            console.log('✅ TH3D Field Mapping loaded:', this.fieldMapping.version);
            return this.fieldMapping;
        } catch (error) {
            console.error('❌ Failed to load field mapping:', error);
            throw new Error('Could not load TH3D field mapping file');
        }
    },
    
    /**
     * Parse TH3D Configuration.h file content
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
        
        // Store defined variables for substitution (preserve across multiple file parses)
        if (!this.variables) {
            this.variables = {};
        }
        
        const lines = content.split('\n');
        
        console.log('🔍 TH3D Parser (Data-Driven): Starting parse of', lines.length, 'lines');
        
        // First pass: collect simple variable definitions
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#define')) {
                const match = line.match(/#define\s+(\w+)\s+([\d.]+)$/);
                if (match) {
                    this.variables[match[1]] = match[2];
                    console.log('   📝 Stored variable:', match[1], '=', match[2]);
                }
            }
        }
        
        console.log('🔍 Variables collected:', Object.keys(this.variables).length);
        
        // Second pass: parse using field mapping
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and pure comments
            if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                continue;
            }
            
            // Parse #define statements
            if (line.startsWith('#define')) {
                this.parseDefineLine(line, config);
            }
        }
        
        console.log('🔍 Final bedLeveling config:', config.bedLeveling);
        
        // Validate and add warnings
        this.validateConfig(config);
        
        return config;
    },
    
    /**
     * Parse a single #define line using field mapping
     * 
     * ⚠️ TODO: Add fallback for unmapped fields
     * If a #define is not found in the mapping, we silently skip it.
     * Consider adding a "unknown" or "unmapped" section to capture these
     * so users can identify missing fields in the mapping.
     */
    parseDefineLine(line, config) {
        // Extract the define name and value
        const match = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
        if (!match) return;
        
        const [, defineName, value] = match;
        const cleanValue = value ? value.split('//')[0].trim() : true;
        
        // Search through field mapping for this define
        for (const [category, fields] of Object.entries(this.fieldMapping)) {
            // Skip metadata fields
            if (category.startsWith('$') || category === 'description' || category === 'lastUpdated' || category === 'version' || category === 'warnings') {
                continue;
            }
            
            for (const [fieldName, fieldSpec] of Object.entries(fields)) {
                // Skip non-field entries
                if (typeof fieldSpec !== 'object' || !fieldSpec.mapsFrom) {
                    continue;
                }
                
                // Check if this define matches any mapsFrom value
                const mapsFrom = Array.isArray(fieldSpec.mapsFrom) ? fieldSpec.mapsFrom : [fieldSpec.mapsFrom];
                
                // Handle wildcard matches (e.g., "LCD_*", "DISPLAY_*")
                let matched = false;
                for (const mapPattern of mapsFrom) {
                    if (mapPattern.includes('*')) {
                        // Wildcard pattern - convert to regex
                        const regex = new RegExp('^' + mapPattern.replace(/\*/g, '.*') + '$');
                        if (regex.test(defineName)) {
                            matched = true;
                            break;
                        }
                    } else if (mapPattern === defineName) {
                        // Exact match
                        matched = true;
                        break;
                    }
                }
                
                if (matched) {
                    // Extract and store the value based on field type
                    const extractedValue = this.extractValue(cleanValue, fieldSpec.type, fieldSpec);
                    
                    // Store in correct category and handle nested structures
                    this.storeValue(config, category, fieldName, extractedValue, fieldSpec);
                    
                    console.log(`   ✅ Mapped ${defineName} → ${category}.${fieldName} =`, extractedValue);
                    return; // Stop after first match
                }
            }
        }
        
        // TODO: If we reach here, the define was not found in mapping
        // Consider logging or storing unknown defines for debugging
        // console.log(`   ⚠️ Unmapped define: ${defineName} = ${cleanValue}`);
    },
    
    /**
     * Extract value based on field type
     */
    extractValue(rawValue, type, fieldSpec) {
        switch (type) {
            case 'string':
                return this.extractString(rawValue);
            
            case 'integer':
                return parseInt(rawValue);
            
            case 'float':
                return parseFloat(rawValue);
            
            case 'boolean':
                // For defines, presence = true
                return rawValue === true || rawValue === 'true' || rawValue === '1';
            
            case 'array':
                return this.extractArray(rawValue);
            
            default:
                // Unknown type, return as-is
                return rawValue;
        }
    },
    
    /**
     * Store value in config object (handles nested structures)
     * 
     * ⚠️ TODO: This function needs enhancement for array fields
     * Currently: Stores single values to nested paths (e.g., "stepsPerMM.x" → config.motion.stepsPerMM.x = 80)
     * Problem: When extractValue() returns an array [80, 80, 400, 93], we need to map:
     *   - array[0] → stepsPerMM.x
     *   - array[1] → stepsPerMM.y
     *   - array[2] → stepsPerMM.z
     *   - array[3] → stepsPerMM.e
     * 
     * Solution needed: Detect when fieldSpec has "mapsFrom" containing array notation (e.g., "[0]")
     * Then extract the array index and store only that element.
     */
    storeValue(config, category, fieldName, value, fieldSpec) {
        // TODO: Add array index extraction here
        // Check if fieldSpec.mapsFrom contains "[0]", "[1]", etc.
        // If so, and value is an array, extract only the indexed element
        // Example: if mapsFrom = "DEFAULT_AXIS_STEPS_PER_UNIT[0]" and value = [80, 80, 400, 93]
        // Then extract index 0 → value = 80
        
        // Handle nested field names (e.g., "motion.stepsPerMM.x")
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
            // Simple field
            if (!config[category]) {
                config[category] = {};
            }
            config[category][fieldName] = value;
        }
        
        // Special handling for specific fields
        
        // Store USER_PRINTER_NAME for variable resolution
        if (fieldName === 'machineName' && category === 'basic') {
            config.basic.userPrinterNameValue = value;
        }
        
        // Handle EZABL_POINTS variable storage
        if (fieldName === 'gridPointsX' && value && !isNaN(value)) {
            this.variables['EZABL_POINTS'] = value;
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
     * Handles variable substitution (e.g., CUSTOM_ESTEPS_VALUE)
     */
    extractArray(value) {
        const match = value.match(/\{(.+?)\}/);
        if (!match) return [];
        return match[1].split(',').map(v => {
            v = v.trim();
            // Check if it's a variable reference
            if (this.variables && this.variables[v]) {
                console.log(`🔄 TH3D Parser: Substituting ${v} = ${this.variables[v]}`);
                return this.variables[v];
            }
            return v;
        });
    },
    
    /**
     * Validate configuration and add warnings
     */
    validateConfig(config) {
        // Use validation rules from field mapping
        for (const [category, fields] of Object.entries(this.fieldMapping)) {
            // Skip metadata
            if (category.startsWith('$') || category === 'description' || category === 'lastUpdated' || category === 'version' || category === 'warnings') {
                continue;
            }
            
            for (const [fieldName, fieldSpec] of Object.entries(fields)) {
                if (!fieldSpec.validation) continue;
                
                const validation = fieldSpec.validation;
                const value = config[category]?.[fieldName];
                
                // Required field check
                if (fieldSpec.required && !value) {
                    config.warnings.push({
                        level: validation.errorLevel || 'error',
                        message: `Missing required field: ${fieldName} (${fieldSpec.mapsFrom.join(', ')})`
                    });
                }
                
                // Must be true check
                if (validation.mustBeTrue && !value) {
                    config.warnings.push({
                        level: validation.errorLevel || 'error',
                        message: fieldSpec.th3dNotes || `${fieldName} should be enabled for safety`
                    });
                }
                
                // Range checks
                if (value !== undefined && value !== null) {
                    if (validation.min !== undefined && value < validation.min) {
                        config.warnings.push({
                            level: 'warning',
                            message: `${fieldName} (${value}) is below minimum (${validation.min})`
                        });
                    }
                    
                    if (validation.max !== undefined && value > validation.max) {
                        config.warnings.push({
                            level: 'warning',
                            message: `${fieldName} (${value}) is above maximum (${validation.max})`
                        });
                    }
                    
                    // Warning if outside range
                    if (validation.warningIfOutside) {
                        if ((validation.min && value < validation.min) || (validation.max && value > validation.max)) {
                            config.warnings.push({
                                level: 'warning',
                                message: `${fieldName} (${value}) is outside typical range (${validation.min}-${validation.max})`
                            });
                        }
                    }
                }
            }
        }
    },
    
    /**
     * Alias for parseConfigFile (for compatibility)
     */
    async parseConfigurationH(content) {
        return await this.parseConfigFile(content);
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.TH3DConfigParser = TH3DConfigParser;
}
