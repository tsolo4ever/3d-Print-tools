/**
 * UI Field Mapper
 * Bridges parser output → profile object → UI inputs using uiFieldId
 * 
 * This module handles automatic UI population from parsed configs
 * by using the uiFieldId property in core mapping files.
 * 
 * Flow:
 * 1. Parser stores values in categories using mapping's field names
 * 2. UIFieldMapper reads from those exact locations
 * 3. UIFieldMapper updates UI inputs using uiFieldId
 * 
 * @version 1.1.0
 */

const UIFieldMapper = {
  /** Debug mode */
  DEBUG: true,
  
  /** Debug logger */
  log(...args) {
    if (this.DEBUG) {
      console.log('[UIFieldMapper]', ...args);
    }
  },
  
  /**
   * Apply parsed configuration to UI using uiFieldId mappings
   * @param {Object} parsedConfig - Parsed configuration from parser (uses mapping's categories/field names)
   * @param {Object} coreMapping - Core mapping file with uiFieldId properties
   * @param {Object} profileObject - Profile object to update (optional)
   * @returns {Object} - { applied: count, skipped: count, errors: [] }
   */
  applyToUI(parsedConfig, coreMapping, profileObject) {
    const result = {
      applied: 0,
      skipped: 0,
      errors: []
    };
    
    if (!coreMapping) {
      this.log('❌ No core mapping provided');
      return result;
    }
    
    this.log('🎯 Applying parsed config to UI fields');
    this.log('📦 Available categories in parsed config:', Object.keys(parsedConfig));
    
    // Iterate through all categories in the core mapping
    const metadataKeys = ['$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines', 'coreDefines', 'fullDefines'];
    
    for (const [categoryName, categoryFields] of Object.entries(coreMapping)) {
      if (metadataKeys.includes(categoryName) || !categoryFields) continue;
      
      for (const [fieldName, fieldData] of Object.entries(categoryFields)) {
        if (!fieldData || typeof fieldData !== 'object') continue;
        
        try {
          // Get the UI field ID
          const uiFieldId = fieldData.uiFieldId;
          
          if (!uiFieldId) {
            continue; // No UI mapping for this field
          }
          
          // Find the value in parsed config using the exact category and field name
          // Parser stores: parsedConfig[categoryName][fieldName]
          const value = this.findValueInParsed(parsedConfig, categoryName, fieldName);
          
          if (value !== undefined && value !== null) {
            // Update UI input (for visual feedback)
            const updated = this.updateUIInput(uiFieldId, value, fieldData.type);
            
            if (updated) {
              result.applied++;
              this.log(`✅ ${categoryName}.${fieldName} → #${uiFieldId} = ${value}`);
            } else {
              result.skipped++;
              this.log(`⏭️  ${categoryName}.${fieldName} → #${uiFieldId} (element not found)`);
            }
          } else {
            result.skipped++;
          }
        } catch (error) {
          result.errors.push({
            category: categoryName,
            field: fieldName,
            error: error.message
          });
          this.log(`❌ Error applying ${categoryName}.${fieldName}:`, error);
        }
      }
    }
    
    this.log(`📊 Results: ${result.applied} applied, ${result.skipped} skipped, ${result.errors.length} errors`);
    return result;
  },
  
  /**
   * Find value in parsed config by exact category and field name
   * Parser stores values using mapping's exact field names in mapping's categories
   * 
   * @param {Object} parsedConfig - Parsed configuration object
   * @param {String} category - Category from core mapping (e.g., 'temperature_2', 'geometry')
   * @param {String} fieldName - Field name from core mapping (e.g., 'xBedSize', 'thermalProtectionHotends')
   * @returns {*} Value if found, undefined otherwise
   */
  findValueInParsed(parsedConfig, category, fieldName) {
    if (!parsedConfig || !category || !fieldName) return undefined;

    // Parser stores values exactly as defined in the mapping
    const categoryData = parsedConfig[category];
    if (!categoryData) {
      return undefined;
    }

    // Direct field access
    if (categoryData[fieldName] !== undefined) {
      return categoryData[fieldName];
    }

    // Handle nested fields (e.g., "motion.xy.max")
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      let current = categoryData;
      for (const part of parts) {
        if (current && typeof current === 'object') {
          current = current[part];
        } else {
          return undefined;
        }
      }
      return current;
    }

    return undefined;
  },
  
  /**
   * Update UI input element with value
   * @param {String} uiFieldId - HTML element ID
   * @param {*} value - Value to set
   * @param {String} type - Field type ('string', 'integer', 'boolean', 'float', etc.)
   * @returns {Boolean} - True if element was found and updated
   */
  updateUIInput(uiFieldId, value, type) {
    const element = document.getElementById(uiFieldId);
    
    if (!element) {
      return false;
    }
    
    try {
      // Handle different input types
      if (element.type === 'checkbox') {
        element.checked = !!value;
      } else if (element.type === 'radio') {
        if (element.value === String(value)) {
          element.checked = true;
        }
      } else if (element.tagName === 'SELECT') {
        // For dropdowns, set the value
        element.value = String(value);
      } else if (element.type === 'number') {
        // For number inputs, convert to number
        element.value = type === 'float' ? parseFloat(value) : parseInt(value, 10);
      } else {
        // For text inputs, set as string
        element.value = String(value);
      }
      
      // Trigger change event to update any listeners
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      return true;
    } catch (error) {
      this.log(`❌ Error updating UI element #${uiFieldId}:`, error);
      return false;
    }
  },
  
  /**
   * Get all UI field IDs from core mapping
   * @param {Object} coreMapping - Core mapping file
   * @returns {Array} - Array of {uiFieldId, mapsFrom, type, category, fieldName}
   */
  getAllUIFields(coreMapping) {
    const fields = [];
    const metadataKeys = ['$schema', 'version', 'firmware', 'configFile', 'generatedFrom', 'totalDefines', 'coreDefines', 'fullDefines'];
    
    for (const [categoryName, categoryFields] of Object.entries(coreMapping)) {
      if (metadataKeys.includes(categoryName) || !categoryFields) continue;
      
      for (const [fieldName, fieldData] of Object.entries(categoryFields)) {
        if (!fieldData || typeof fieldData !== 'object') continue;
        
        if (fieldData.uiFieldId) {
          fields.push({
            uiFieldId: fieldData.uiFieldId,
            mapsFrom: fieldData.mapsFrom,
            type: fieldData.type,
            category: categoryName,
            fieldName: fieldName
          });
        }
      }
    }
    
    return fields;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIFieldMapper;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.UIFieldMapper = UIFieldMapper;
}
