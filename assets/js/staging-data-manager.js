/**
 * Staging Data Manager
 * Manages temporary storage of parsed Configuration.h data with UI field metadata
 * Data is temporary until user saves with a profile name
 * 
 * @module StagingDataManager
 */

const StagingDataManager = {
  
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
  
  // Storage key for localStorage
  STORAGE_KEY: 'config_staging',
  
  /**
   * Save parsed data to localStorage (temporary)
   * @param {Object} stagingData - Staging data with parsedData and metadata
   * @returns {boolean} Success status
   */
  saveStagingData(stagingData) {
    try {
      // Validate staging data structure
      if (!stagingData.parsedData || typeof stagingData.parsedData !== 'object') {
        console.error('❌ Invalid staging data: missing parsedData object');
        return false;
      }
      
      // Add temporary flag and timestamp
      stagingData.temporary = true;
      stagingData.profileName = null;
      
      if (!stagingData.metadata) {
        stagingData.metadata = {};
      }
      stagingData.metadata.savedAt = new Date().toISOString();
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stagingData));
      this.log('💾 Staging data saved temporarily');
      this.log(`   📊 ${Object.keys(stagingData.parsedData).length} defines stored`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save staging data:', error);
      return false;
    }
  },
  
  /**
   * Load staging data from localStorage
   * @returns {Object|null} Staging data or null if not found
   */
  loadStagingData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      this.log('📂 Staging data loaded');
      this.log(`   📊 ${Object.keys(parsed.parsedData || {}).length} defines available`);
      
      return parsed;
    } catch (error) {
      console.error('❌ Failed to load staging data:', error);
      return null;
    }
  },
  
  /**
   * Check if staging data exists
   * @returns {boolean} True if staging data exists
   */
  hasStagingData() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  },
  
  /**
   * Clear staging data from localStorage
   */
  clearStagingData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.log('🗑️ Staging data cleared');
  },
  
  /**
   * Get value by UI field ID
   * @param {string} uiFieldId - UI field ID (e.g., "tab7_linearAdvanceEnabled")
   * @returns {any|null} Field value or null if not found
   */
  getValueByUiField(uiFieldId) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.uiFieldId === uiFieldId) {
        this.log(`🔍 Found value for ${uiFieldId}:`, data.value);
        return data.value;
      }
    }
    
    this.log(`⚠️ No value found for ${uiFieldId}`);
    return null;
  },
  
  /**
   * Get value by profile path
   * @param {string} profilePath - Profile path (e.g., "advanced.linearAdvance")
   * @returns {any|null} Field value or null if not found
   */
  getValueByPath(profilePath) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.profilePath === profilePath) {
        this.log(`🔍 Found value for ${profilePath}:`, data.value);
        return data.value;
      }
    }
    
    this.log(`⚠️ No value found for ${profilePath}`);
    return null;
  },
  
  /**
   * Get all fields for a specific tab
   * @param {number} tabNumber - Tab number (1-10)
   * @returns {Array} Array of field objects with define name and data
   */
  getFieldsForTab(tabNumber) {
    const staging = this.loadStagingData();
    if (!staging) return [];
    
    const fields = [];
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.uiFieldId) {
        // Extract tab number from uiFieldId prefix (e.g., "tab7_..." → 7)
        const match = data.uiFieldId.match(/^tab(\d+)_/);
        if (match && parseInt(match[1], 10) === tabNumber) {
          fields.push({
            define,
            ...data
          });
        }
      }
    }
    
    this.log(`🔍 Found ${fields.length} fields for tab ${tabNumber}`);
    return fields;
  },
  
  /**
   * Get all fields by category
   * @param {string} category - Category name (e.g., "motion", "probe", "hardware")
   * @returns {Array} Array of field objects
   */
  getFieldsByCategory(category) {
    const staging = this.loadStagingData();
    if (!staging) return [];
    
    const fields = [];
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (data.category === category) {
        fields.push({
          define,
          ...data
        });
      }
    }
    
    this.log(`🔍 Found ${fields.length} fields for category "${category}"`);
    return fields;
  },
  
  /**
   * Get metadata about staged configuration
   * @returns {Object|null} Metadata object or null
   */
  getMetadata() {
    const staging = this.loadStagingData();
    return staging ? staging.metadata : null;
  },
  
  /**
   * Convert staging data to profile object
   * Creates a complete profile object from staging data
   * @param {string} profileName - Name for the profile
   * @returns {Object|null} Profile object or null if no staging data
   */
  convertToProfile(profileName) {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    this.log('🔄 Converting staging data to profile...');
    
    const profile = {
      id: Date.now().toString(),
      name: profileName,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      firmwareType: staging.metadata.firmwareType || 'unknown',
      firmwareVersion: staging.metadata.firmwareVersion || ''
    };
    
    // Apply parsed values to profile using profilePath
    let fieldCount = 0;
    for (const [define, data] of Object.entries(staging.parsedData)) {
      if (!data.profilePath) {
        this.log(`⚠️ Skipping ${define}: no profilePath`);
        continue;
      }
      
      const path = data.profilePath.split('.');
      let current = profile;
      
      // Create nested structure
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      // Set value
      const finalKey = path[path.length - 1];
      current[finalKey] = data.value;
      fieldCount++;
    }
    
    this.log(`✅ Profile created with ${fieldCount} fields`);
    return profile;
  },
  
  /**
   * Export staging data to JSON file
   * Triggers download in browser
   * @param {string} filename - Output filename (default: parsed-config.json)
   */
  exportToFile(filename = 'parsed-config.json') {
    const staging = this.loadStagingData();
    if (!staging) {
      console.warn('⚠️ No staging data to export');
      return;
    }
    
    try {
      const jsonData = JSON.stringify(staging, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.log(`✅ Staging data exported: ${filename}`);
    } catch (error) {
      console.error('❌ Failed to export staging data:', error);
    }
  },
  
  /**
   * Get summary statistics about staging data
   * @returns {Object|null} Statistics object or null
   */
  getStatistics() {
    const staging = this.loadStagingData();
    if (!staging) return null;
    
    const stats = {
      totalDefines: Object.keys(staging.parsedData).length,
      categories: {},
      tabs: {},
      types: {}
    };
    
    for (const [define, data] of Object.entries(staging.parsedData)) {
      // Count by category
      if (data.category) {
        stats.categories[data.category] = (stats.categories[data.category] || 0) + 1;
      }
      
      // Count by tab
      if (data.uiFieldId) {
        const match = data.uiFieldId.match(/^tab(\d+)_/);
        if (match) {
          const tabNum = parseInt(match[1], 10);
          stats.tabs[tabNum] = (stats.tabs[tabNum] || 0) + 1;
        }
      }
      
      // Count by type
      if (data.type) {
        stats.types[data.type] = (stats.types[data.type] || 0) + 1;
      }
    }
    
    return stats;
  },
  
  /**
   * Display staging data banner in UI
   * Shows notification that temporary data is loaded
   */
  showBanner() {
    // Remove existing banner if present
    const existing = document.getElementById('stagingDataBanner');
    if (existing) existing.remove();
    
    const staging = this.loadStagingData();
    if (!staging) return;
    
    const stats = this.getStatistics();
    const banner = document.createElement('div');
    banner.id = 'stagingDataBanner';
    banner.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    
    banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
        <div>
          📋 <strong>Configuration Loaded (Temporary)</strong> - 
          ${stats.totalDefines} settings from ${staging.metadata.firmwareType || 'firmware'} ${staging.metadata.firmwareVersion || ''} 
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="StagingDataManager.exportToFile()" 
            style="padding: 6px 12px; border: 1px solid white; background: rgba(255,255,255,0.2); 
                   color: white; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
            💾 Export JSON
          </button>
          <button onclick="StagingDataManager.clearAndRemoveBanner()" 
            style="padding: 6px 12px; border: 1px solid white; background: rgba(255,255,255,0.2); 
                   color: white; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
            🗑️ Discard
          </button>
        </div>
      </div>
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.9;">
        💡 Enter a profile name and click Save to keep this configuration
      </div>
    `;
    
    document.body.appendChild(banner);
    this.log('📢 Staging data banner displayed');
  },
  
  /**
   * Clear staging data and remove banner
   * Helper method for banner button
   */
  clearAndRemoveBanner() {
    if (confirm('⚠️ Discard parsed configuration?\n\nThis will clear all imported settings. This action cannot be undone.')) {
      this.clearStagingData();
      const banner = document.getElementById('stagingDataBanner');
      if (banner) banner.remove();
      this.log('✅ Staging data discarded and banner removed');
      
      // Trigger page reload to clear any populated fields
      if (confirm('Reload page to reset form?')) {
        window.location.reload();
      }
    }
  },
  
  /**
   * Hide banner without clearing data
   */
  hideBanner() {
    const banner = document.getElementById('stagingDataBanner');
    if (banner) banner.remove();
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.StagingDataManager = StagingDataManager;
}

// Optional CommonJS export for Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StagingDataManager };
}
