/**
 * Tab Renderer
 * Organizes and renders form tabs/sections from mapping file definitions
 * 
 * DEBUG MODE:
 * Set TabRenderer.DEBUG = false to silence debug logs
 * Errors (console.error) remain visible
 * 
 * @version 1.0.0
 * @requires field-renderer.js
 */
const TabRenderer = {
    // Debug mode - set to false to suppress console logging
    DEBUG: true,
    
    /**
     * Debug logger - only logs if DEBUG is true
     */
    log(...args) {
        if (this.DEBUG) {
            console.log('[TabRenderer]', ...args);
        }
    },
    
    /**
     * Initialize renderer
     */
    init() {
        this.log('TabRenderer initialized');
        return true;
    },
    
    /**
     * Render complete tab from mapping data
     * @param {number} tabNumber - Tab number (1-10)
     * @param {object} mappingData - Loaded mapping file
     * @param {object} profileData - Current profile data
     * @returns {string} HTML string
     */
    render(tabNumber, mappingData, profileData = {}) {
        this.log(`Rendering tab ${tabNumber}`);
        
        if (!mappingData) {
            console.error('❌ Mapping data not provided!');
            return '<div class="tab-content"><p>Error: Mapping data not loaded</p></div>';
        }
        
        // Get all fields for this tab
        const tabFields = this.getFieldsForTab(mappingData, tabNumber);
        
        if (tabFields.length === 0) {
            return `
                <div class="tab-content">
                    <p style="color: var(--text-secondary); padding: 20px;">
                        No fields defined for Tab ${tabNumber} yet.
                    </p>
                </div>
            `;
        }
        
        this.log(`Found ${tabFields.length} fields for tab ${tabNumber}`);
        
        // Group fields by section
        const sections = this.groupBySection(tabFields);
        this.log(`Organized into ${sections.length} sections`);
        
        // Render sections
        const sectionsHTML = sections.map(section => 
            this.renderSection(section, profileData)
        ).join('');
        
        return `
            <div class="tab-content">
                ${sectionsHTML}
            </div>
        `;
    },
    
    /**
     * Get all fields for specified tab
     * @param {object} mappingData - Mapping file data
     * @param {number} tabNumber - Tab number (1-10)
     * @returns {Array} Array of field objects
     */
    getFieldsForTab(mappingData, tabNumber) {
        const fields = [];
        
        // Walk through all categories
        for (const [category, categoryFields] of Object.entries(mappingData)) {
            // Skip metadata fields (starting with $)
            if (category.startsWith('$')) continue;
            
            // Skip if not an object
            if (typeof categoryFields !== 'object') continue;
            
            // Check each field in category
            for (const [fieldName, fieldDef] of Object.entries(categoryFields)) {
                // Skip if field is not an object
                if (typeof fieldDef !== 'object') continue;
                
                // Check if field belongs to this tab
                if (fieldDef.uiTab === tabNumber) {
                    fields.push({
                        category: category,
                        name: fieldName,
                        def: fieldDef,
                        order: fieldDef.uiOrder || 999,
                        section: fieldDef.uiSection || 'General'
                    });
                }
            }
        }
        
        // Sort by order
        fields.sort((a, b) => a.order - b.order);
        
        return fields;
    },
    
    /**
     * Group fields by section
     * @param {Array} fields - Array of field objects
     * @returns {Array} Array of section objects
     */
    groupBySection(fields) {
        const sectionMap = new Map();
        
        for (const field of fields) {
            const sectionName = field.section;
            
            if (!sectionMap.has(sectionName)) {
                sectionMap.set(sectionName, {
                    title: sectionName,
                    fields: []
                });
            }
            
            sectionMap.get(sectionName).fields.push(field);
        }
        
        return Array.from(sectionMap.values());
    },
    
    /**
     * Render a section with its fields
     * @param {object} section - Section object with title and fields
     * @param {object} profileData - Profile data for field values
     * @returns {string} HTML string
     */
    renderSection(section, profileData) {
        this.log(`Rendering section: ${section.title} (${section.fields.length} fields)`);
        
        const fieldsHTML = section.fields.map(field => {
            // Get field value from profile data
            const value = this.getFieldValue(profileData, field.category, field.name);
            
            // Render field using FieldRenderer
            return FieldRenderer.render(field.category, field.name, value);
        }).join('');
        
        return `
            <div class="form-section">
                ${section.title !== 'General' ? `<h4>${section.title}</h4>` : ''}
                ${fieldsHTML}
            </div>
        `;
    },
    
    /**
     * Get field value from profile data
     * @param {object} profileData - Profile data object
     * @param {string} category - Field category
     * @param {string} fieldName - Field name
     * @returns {any} Field value or null
     */
    getFieldValue(profileData, category, fieldName) {
        // Try to get value from profile data
        // Profile structure might be different from mapping structure
        // This is a simple implementation - can be enhanced later
        
        if (!profileData) return null;
        
        // Try direct path: profileData.category.fieldName
        if (profileData[category] && profileData[category][fieldName] !== undefined) {
            return profileData[category][fieldName];
        }
        
        // Try flat structure: profileData.fieldName
        if (profileData[fieldName] !== undefined) {
            return profileData[fieldName];
        }
        
        return null;
    },
    
    /**
     * Get tab metadata (title, icon) from first field in tab
     * @param {object} mappingData - Mapping file data
     * @param {number} tabNumber - Tab number
     * @returns {object} Tab metadata {title, icon}
     */
    getTabMetadata(mappingData, tabNumber) {
        const fields = this.getFieldsForTab(mappingData, tabNumber);
        
        if (fields.length === 0) {
            return {
                title: `Tab ${tabNumber}`,
                icon: '📝'
            };
        }
        
        // Check if any field has tab metadata
        const firstField = fields[0].def;
        
        return {
            title: firstField.uiTabTitle || `Tab ${tabNumber}`,
            icon: firstField.uiTabIcon || '📝'
        };
    },
    
    /**
     * Populate all database-select elements in rendered tab
     * @param {HTMLElement} container - Container element with rendered fields
     */
    async populateDatabaseSelects(container) {
        const selects = container.querySelectorAll('select[data-database]');
        this.log(`Populating ${selects.length} database selects`);
        
        const promises = Array.from(selects).map(select => 
            FieldRenderer.populateDatabaseSelect(select)
        );
        
        await Promise.all(promises);
        this.log(`✅ All database selects populated`);
    },
    
    /**
     * Render form row (multiple fields side-by-side)
     * Useful for grouping related fields like X/Y/Z coordinates
     * @param {Array} fields - Array of field objects
     * @param {object} profileData - Profile data
     * @returns {string} HTML string
     */
    renderFormRow(fields, profileData) {
        const fieldsHTML = fields.map(field => {
            const value = this.getFieldValue(profileData, field.category, field.name);
            return FieldRenderer.render(field.category, field.name, value);
        }).join('');
        
        return `
            <div class="form-row">
                ${fieldsHTML}
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabRenderer;
}
