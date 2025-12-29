/**
 * Field Renderer
 * Renders form fields dynamically from mapping file definitions
 * 
 * DEBUG MODE:
 * Set FieldRenderer.DEBUG = false to silence debug logs
 * Errors (console.error) remain visible
 * 
 * @version 1.0.0
 */
const FieldRenderer = {
    // Debug mode - set to false to suppress console logging
    DEBUG: true,
    
    // Loaded data
    mappingData: null,
    databases: {},
    
    /**
     * Debug logger - only logs if DEBUG is true
     */
    log(...args) {
        if (this.DEBUG) {
            console.log('[FieldRenderer]', ...args);
        }
    },
    
    /**
     * Initialize renderer (can be used for setup)
     */
    async init() {
        this.log('FieldRenderer initialized');
        return true;
    },
    
    /**
     * Load mapping data directly (for when data is already loaded)
     * @param {object} mappingData - Mapping data object
     */
    loadMapping(mappingData) {
        if (typeof mappingData === 'string') {
            // Legacy: firmware name string
            return this.loadMappingFile(mappingData);
        }
        
        // Direct data assignment
        this.mappingData = mappingData;
        this.log(`✅ Loaded mapping data with ${Object.keys(mappingData).length} categories`);
        return mappingData;
    },
    
    /**
     * Load mapping file for specified firmware
     * @param {string} firmware - 'marlin' or 'th3d'
     */
    async loadMappingFile(firmware = 'marlin') {
        try {
            const path = `assets/data/maps/${firmware}/${firmware}-config-mapping.json`;
            this.log(`Loading mapping from: ${path}`);
            
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load mapping: ${response.statusText}`);
            }
            
            this.mappingData = await response.json();
            this.log(`✅ Loaded ${Object.keys(this.mappingData).length} categories`);
            
            return this.mappingData;
        } catch (error) {
            console.error('❌ Failed to load mapping file:', error);
            throw error;
        }
    },
    
    /**
     * Load hardware database for dropdowns
     * @param {string} dbName - Database name (e.g., 'marlin-boards')
     */
    async loadDatabase(dbName) {
        if (this.databases[dbName]) {
            return this.databases[dbName]; // Already loaded
        }
        
        try {
            const path = `assets/data/${dbName}.json`;
            this.log(`Loading database: ${path}`);
            
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load database: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.databases[dbName] = data;
            this.log(`✅ Loaded database: ${dbName}`);
            
            return data;
        } catch (error) {
            console.error(`❌ Failed to load database ${dbName}:`, error);
            return null;
        }
    },
    
    /**
     * Get field definition from mapping data
     * @param {string} category - Category name (e.g., 'basic')
     * @param {string} fieldName - Field name (e.g., 'machineName')
     */
    getFieldDef(category, fieldName) {
        if (!this.mappingData) {
            console.error('❌ Mapping data not loaded!');
            return null;
        }
        
        const categoryData = this.mappingData[category];
        if (!categoryData) {
            console.error(`❌ Category not found: ${category}`);
            return null;
        }
        
        const fieldDef = categoryData[fieldName];
        if (!fieldDef) {
            console.error(`❌ Field not found: ${category}.${fieldName}`);
            return null;
        }
        
        return fieldDef;
    },
    
    /**
     * Render a field based on its definition
     * @param {string} category - Category name
     * @param {string} fieldName - Field name
     * @param {any} value - Current field value
     * @returns {string} HTML string
     */
    render(category, fieldName, value = null) {
        const fieldDef = this.getFieldDef(category, fieldName);
        if (!fieldDef) {
            return `<div class="form-group error">Field not found: ${category}.${fieldName}</div>`;
        }
        
        // Build UI configuration
        const uiConfig = {
            id: fieldDef.uiId || `${category}_${fieldName}`,
            label: this.formatLabel(fieldDef, fieldName),
            type: fieldDef.uiWidget || this.inferWidget(fieldDef),
            value: value,
            required: fieldDef.required || false,
            helpText: fieldDef.helpText || fieldDef.th3dNotes || fieldDef.marlinNotes,
            placeholder: this.generatePlaceholder(fieldDef),
            validation: fieldDef.validation || {}
        };
        
        this.log(`Rendering field: ${category}.${fieldName} (${uiConfig.type})`);
        
        // Render based on widget type
        return this.renderWidget(uiConfig, fieldDef);
    },
    
    /**
     * Render widget based on type
     */
    renderWidget(uiConfig, fieldDef) {
        switch (uiConfig.type) {
            case 'text':
                return this.renderText(uiConfig);
            case 'number':
                return this.renderNumber(uiConfig, fieldDef);
            case 'select':
                return this.renderSelect(uiConfig, fieldDef);
            case 'database-select':
                return this.renderDatabaseSelect(uiConfig, fieldDef);
            case 'checkbox':
                return this.renderCheckbox(uiConfig);
            case 'textarea':
                return this.renderTextarea(uiConfig);
            default:
                return this.renderText(uiConfig);
        }
    },
    
    /**
     * Render text input
     */
    renderText(uiConfig) {
        return `
            <div class="form-group">
                <label for="${uiConfig.id}">
                    ${uiConfig.label}${uiConfig.required ? ' *' : ''}
                </label>
                <input 
                    type="text" 
                    id="${uiConfig.id}"
                    class="form-control"
                    value="${uiConfig.value || ''}" 
                    placeholder="${uiConfig.placeholder}"
                    ${uiConfig.required ? 'required' : ''}
                >
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Render number input
     */
    renderNumber(uiConfig, fieldDef) {
        const validation = fieldDef.validation || {};
        const min = validation.min !== undefined ? validation.min : '';
        const max = validation.max !== undefined ? validation.max : '';
        const step = fieldDef.type === 'float' ? '0.01' : '1';
        
        return `
            <div class="form-group">
                <label for="${uiConfig.id}">
                    ${uiConfig.label}${uiConfig.required ? ' *' : ''}
                </label>
                <input 
                    type="number" 
                    id="${uiConfig.id}"
                    class="form-control"
                    value="${uiConfig.value || ''}" 
                    placeholder="${uiConfig.placeholder}"
                    ${min !== '' ? `min="${min}"` : ''}
                    ${max !== '' ? `max="${max}"` : ''}
                    step="${step}"
                    ${uiConfig.required ? 'required' : ''}
                >
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Render select dropdown
     */
    renderSelect(uiConfig, fieldDef) {
        const options = this.getSelectOptions(fieldDef);
        const optionsHTML = options.map(opt => {
            const selected = uiConfig.value === opt.value ? 'selected' : '';
            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        }).join('');
        
        return `
            <div class="form-group">
                <label for="${uiConfig.id}">
                    ${uiConfig.label}${uiConfig.required ? ' *' : ''}
                </label>
                <select 
                    id="${uiConfig.id}"
                    class="form-control"
                    ${uiConfig.required ? 'required' : ''}
                >
                    <option value="">Select ${uiConfig.label.toLowerCase()}...</option>
                    ${optionsHTML}
                </select>
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Render database-driven select (async placeholder)
     */
    renderDatabaseSelect(uiConfig, fieldDef) {
        // This will be populated asynchronously after database loads
        return `
            <div class="form-group">
                <label for="${uiConfig.id}">
                    ${uiConfig.label}${uiConfig.required ? ' *' : ''}
                </label>
                <select 
                    id="${uiConfig.id}"
                    class="form-control"
                    data-database="${fieldDef.uiDatabase || ''}"
                    data-display-format="${fieldDef.uiDisplayFormat || '{name}'}"
                    ${uiConfig.required ? 'required' : ''}
                >
                    <option value="">Loading ${fieldDef.uiDatabase || 'options'}...</option>
                </select>
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Render checkbox
     */
    renderCheckbox(uiConfig) {
        const checked = uiConfig.value === true || uiConfig.value === 'true' ? 'checked' : '';
        
        return `
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input 
                        type="checkbox" 
                        id="${uiConfig.id}"
                        ${checked}
                        style="width: auto; margin: 0;"
                    >
                    <span>${uiConfig.label}${uiConfig.required ? ' *' : ''}</span>
                </label>
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Render textarea
     */
    renderTextarea(uiConfig) {
        return `
            <div class="form-group">
                <label for="${uiConfig.id}">
                    ${uiConfig.label}${uiConfig.required ? ' *' : ''}
                </label>
                <textarea 
                    id="${uiConfig.id}"
                    class="form-control"
                    rows="3"
                    placeholder="${uiConfig.placeholder}"
                    ${uiConfig.required ? 'required' : ''}
                >${uiConfig.value || ''}</textarea>
                ${uiConfig.helpText ? `<p class="field-help">${uiConfig.helpText}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Get select options from field definition
     */
    getSelectOptions(fieldDef) {
        const validation = fieldDef.validation || {};
        
        // Check for enum in validation
        if (validation.enum && Array.isArray(validation.enum)) {
            return validation.enum.map(value => ({
                value: value,
                label: value.toString()
            }));
        }
        
        // Check for explicit options in field def
        if (fieldDef.options && Array.isArray(fieldDef.options)) {
            return fieldDef.options;
        }
        
        // Check examples as fallback
        if (fieldDef.examples && Array.isArray(fieldDef.examples)) {
            return fieldDef.examples.map(value => ({
                value: value,
                label: value.toString()
            }));
        }
        
        return [];
    },
    
    /**
     * Infer widget type from field definition
     */
    inferWidget(fieldDef) {
        // Check for validation enum (select dropdown)
        if (fieldDef.validation?.enum) {
            return 'select';
        }
        
        // Check for database reference
        if (fieldDef.uiDatabase) {
            return 'database-select';
        }
        
        // Map by type
        switch (fieldDef.type) {
            case 'boolean':
                return 'checkbox';
            case 'integer':
            case 'float':
                return 'number';
            case 'string':
            default:
                return 'text';
        }
    },
    
    /**
     * Format label from field definition
     */
    formatLabel(fieldDef, fieldName) {
        // Use explicit label if provided
        if (fieldDef.uiLabel) {
            return fieldDef.uiLabel;
        }
        
        // Generate from field name (camelCase to Title Case)
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },
    
    /**
     * Generate placeholder text
     */
    generatePlaceholder(fieldDef) {
        if (fieldDef.uiPlaceholder) {
            return fieldDef.uiPlaceholder;
        }
        
        if (fieldDef.examples && fieldDef.examples.length > 0) {
            const example = fieldDef.examples[0];
            return `e.g., ${example}`;
        }
        
        return '';
    },
    
    /**
     * Populate database-select dropdown after loading database
     */
    async populateDatabaseSelect(selectElement) {
        const dbName = selectElement.dataset.database;
        const displayFormat = selectElement.dataset.displayFormat || '{name}';
        const currentValue = selectElement.value;
        
        if (!dbName) {
            console.error('❌ No database specified for select:', selectElement.id);
            return;
        }
        
        this.log(`Populating database select: ${selectElement.id} from ${dbName}`);
        
        // Load database
        const db = await this.loadDatabase(dbName);
        if (!db) {
            selectElement.innerHTML = '<option value="">Failed to load options</option>';
            return;
        }
        
        // Get items array (handle different database structures)
        let items = [];
        if (db.boards) items = db.boards;
        else if (db.drivers) items = db.drivers;
        else if (db.thermistors) items = db.thermistors;
        else if (db.displays) items = db.displays;
        else if (db.hotends) items = db.hotends;
        else if (db.probes) items = db.probes;
        else if (Array.isArray(db)) items = db;
        
        // Generate options
        const optionsHTML = items.map(item => {
            const label = this.formatDisplayString(item, displayFormat);
            const selected = currentValue === item.id ? 'selected' : '';
            return `<option value="${item.id}" ${selected}>${label}</option>`;
        }).join('');
        
        selectElement.innerHTML = `
            <option value="">Select...</option>
            ${optionsHTML}
            <option value="__custom__">🔧 Custom / Other...</option>
        `;
        
        this.log(`✅ Populated ${items.length} options for ${selectElement.id}`);
    },
    
    /**
     * Format display string using template
     * @param {object} item - Database item
     * @param {string} template - Template like "{name} ({mcu})"
     */
    formatDisplayString(item, template) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return item[key] || '';
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldRenderer;
}
