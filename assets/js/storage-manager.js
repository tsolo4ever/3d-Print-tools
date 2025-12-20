/* ============================================
   Global Storage Manager
   Handles all localStorage operations for the suite
   ============================================ */

const StorageManager = {
    // Storage keys
    STORAGE_KEY: '3d-print-tools-data',
    VERSION: '1.0',
    
    /**
     * Initialize storage with default structure
     */
    init() {
        if (!this.getData()) {
            const defaultData = {
                version: this.VERSION,
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    units: 'metric',
                    showTips: true
                },
                printers: [],
                tools: {}
            };
            this.saveData(defaultData);
        }
        return this.getData();
    },
    
    /**
     * Get all data from localStorage
     */
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Save all data to localStorage
     */
    saveData(data) {
        try {
            data.lastModified = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Update last modified timestamp
     */
    updateTimestamp() {
        const data = this.getData();
        if (data) {
            this.saveData(data);
        }
    },
    
    // ==========================================
    // PRINTER PROFILE MANAGEMENT
    // ==========================================
    
    /**
     * Get all printer profiles
     */
    getPrinters() {
        const data = this.getData() || this.init();
        return data.printers || [];
    },
    
    /**
     * Get a specific printer by ID
     */
    getPrinter(id) {
        const printers = this.getPrinters();
        return printers.find(p => p.id === id);
    },
    
    /**
     * Add a new printer profile
     */
    addPrinter(printer) {
        const data = this.getData() || this.init();
        
        // Generate unique ID if not provided
        if (!printer.id) {
            printer.id = 'printer_' + Date.now();
        }
        
        // Add timestamps
        printer.created = new Date().toISOString();
        printer.modified = new Date().toISOString();
        
        // Ensure extended schema fields exist with defaults
        const extendedPrinter = {
            ...printer,
            // Basic Info (legacy support)
            name: printer.name || 'New Printer',
            esteps: printer.esteps || null,
            extruder: printer.extruder || null,
            notes: printer.notes || '',
            
            // Extended Fields (new)
            printerModel: printer.printerModel || null,
            firmwareVersion: printer.firmwareVersion || null,
            
            // Hotend Configuration
            hotend: printer.hotend || {
                type: null,              // hotend ID from database
                heaterType: 'cartridge', // 'cartridge', 'ceramic', 'high-flow', 'custom'
                maxFlow: null,           // mm³/s
                maxTemp: null,           // °C
                pidTuned: false,         // Has PID been tuned?
                pidValues: null          // { p, i, d } if available
            },
            
            // Extruder Configuration
            extruderType: printer.extruderType || 'bowden', // 'direct' or 'bowden'
            
            // EEPROM Data
            eeprom: printer.eeprom || {
                maxFeedrate: { x: null, y: null, z: null, e: null },
                maxAccel: { x: null, y: null, z: null, e: null },
                jerk: { x: null, y: null, z: null, e: null },
                esteps: printer.esteps || null, // Link to legacy field
                pidHotend: null,     // { p, i, d }
                pidBed: null,        // { p, i, d }
                linearAdvance: null, // K factor
                zOffset: null,       // Baby stepping offset
                bedSize: { x: null, y: null, z: null },
                bedLevelingType: null // 'UBL', 'Bilinear', 'Manual', etc.
            },
            
            // Nozzle Inventory
            nozzles: printer.nozzles || [
                { size: 0.4, material: 'brass', installed: true }
            ],
            
            // Slicer Preference
            preferredSlicer: printer.preferredSlicer || 'superslicer',
            
            // Materials
            commonMaterials: printer.commonMaterials || ['PLA', 'PETG']
        };
        
        data.printers.push(extendedPrinter);
        return this.saveData(data) ? extendedPrinter : null;
    },
    
    /**
     * Update an existing printer profile
     */
    updatePrinter(id, updates) {
        const data = this.getData() || this.init();
        const index = data.printers.findIndex(p => p.id === id);
        
        if (index !== -1) {
            // Deep merge for nested objects (eeprom, hotend, etc.)
            const currentPrinter = data.printers[index];
            data.printers[index] = {
                ...currentPrinter,
                ...updates,
                id: id, // Preserve ID
                created: currentPrinter.created, // Preserve creation date
                modified: new Date().toISOString(),
                // Deep merge nested objects
                hotend: updates.hotend ? { ...currentPrinter.hotend, ...updates.hotend } : currentPrinter.hotend,
                eeprom: updates.eeprom ? { ...currentPrinter.eeprom, ...updates.eeprom } : currentPrinter.eeprom,
                nozzles: updates.nozzles || currentPrinter.nozzles,
                commonMaterials: updates.commonMaterials || currentPrinter.commonMaterials
            };
            return this.saveData(data) ? data.printers[index] : null;
        }
        return null;
    },
    
    /**
     * Delete a printer profile
     */
    deletePrinter(id) {
        const data = this.getData() || this.init();
        const originalLength = data.printers.length;
        data.printers = data.printers.filter(p => p.id !== id);
        
        if (data.printers.length < originalLength) {
            return this.saveData(data);
        }
        return false;
    },
    
    /**
     * Clear all printer profiles
     */
    clearPrinters() {
        const data = this.getData() || this.init();
        data.printers = [];
        return this.saveData(data);
    },
    
    /**
     * Update EEPROM data for a printer
     */
    updatePrinterEEPROM(id, eepromData) {
        const printer = this.getPrinter(id);
        if (!printer) return null;
        
        const updates = {
            eeprom: {
                ...printer.eeprom,
                ...eepromData
            }
        };
        
        // If e-steps is in EEPROM, sync with legacy field
        if (eepromData.esteps !== undefined) {
            updates.esteps = eepromData.esteps;
        }
        
        return this.updatePrinter(id, updates);
    },
    
    /**
     * Update hotend configuration for a printer
     */
    updatePrinterHotend(id, hotendData) {
        const printer = this.getPrinter(id);
        if (!printer) return null;
        
        return this.updatePrinter(id, {
            hotend: {
                ...printer.hotend,
                ...hotendData
            }
        });
    },
    
    /**
     * Update nozzle inventory for a printer
     */
    updatePrinterNozzles(id, nozzles) {
        return this.updatePrinter(id, { nozzles });
    },
    
    /**
     * Set PID tuning status for a printer
     */
    setPIDTuned(id, tuned, pidValues = null) {
        const printer = this.getPrinter(id);
        if (!printer) return null;
        
        return this.updatePrinter(id, {
            hotend: {
                ...printer.hotend,
                pidTuned: tuned,
                pidValues: pidValues
            }
        });
    },
    
    /**
     * Get printer by name (for quick lookup)
     */
    getPrinterByName(name) {
        const printers = this.getPrinters();
        return printers.find(p => p.name === name);
    },
    
    /**
     * Migrate legacy printer profiles to new extended schema
     */
    migratePrinterProfiles() {
        const data = this.getData();
        if (!data || !data.printers) return false;
        
        let migrated = false;
        data.printers = data.printers.map(printer => {
            // Check if already has extended fields
            if (printer.hotend && printer.eeprom) {
                return printer;
            }
            
            migrated = true;
            
            // Migrate to extended schema
            return {
                ...printer,
                printerModel: printer.printerModel || null,
                firmwareVersion: printer.firmwareVersion || null,
                hotend: printer.hotend || {
                    type: null,
                    heaterType: 'cartridge',
                    maxFlow: null,
                    maxTemp: null,
                    pidTuned: false,
                    pidValues: null
                },
                extruderType: printer.extruderType || (printer.extruder?.toLowerCase().includes('direct') ? 'direct' : 'bowden'),
                eeprom: printer.eeprom || {
                    maxFeedrate: { x: null, y: null, z: null, e: null },
                    maxAccel: { x: null, y: null, z: null, e: null },
                    jerk: { x: null, y: null, z: null, e: null },
                    esteps: printer.esteps || null,
                    pidHotend: null,
                    pidBed: null,
                    linearAdvance: null,
                    zOffset: null,
                    bedSize: { x: null, y: null, z: null },
                    bedLevelingType: null
                },
                nozzles: printer.nozzles || [
                    { size: 0.4, material: 'brass', installed: true }
                ],
                preferredSlicer: printer.preferredSlicer || 'superslicer',
                commonMaterials: printer.commonMaterials || ['PLA', 'PETG']
            };
        });
        
        if (migrated) {
            this.saveData(data);
            console.log('Printer profiles migrated to extended schema');
        }
        
        return migrated;
    },
    
    // ==========================================
    // TOOL-SPECIFIC DATA MANAGEMENT
    // ==========================================
    
    /**
     * Get data for a specific tool
     */
    getToolData(toolName) {
        const data = this.getData() || this.init();
        return data.tools[toolName] || { history: [] };
    },
    
    /**
     * Save data for a specific tool
     */
    saveToolData(toolName, toolData) {
        const data = this.getData() || this.init();
        data.tools[toolName] = toolData;
        return this.saveData(data);
    },
    
    /**
     * Add history entry to a tool
     */
    addToolHistory(toolName, entry) {
        const toolData = this.getToolData(toolName);
        
        if (!toolData.history) {
            toolData.history = [];
        }
        
        // Add timestamp and ID
        entry.timestamp = new Date().toISOString();
        entry.id = 'entry_' + Date.now();
        
        // Add to beginning of array (newest first)
        toolData.history.unshift(entry);
        
        // Limit history to last 50 entries
        if (toolData.history.length > 50) {
            toolData.history = toolData.history.slice(0, 50);
        }
        
        return this.saveToolData(toolName, toolData);
    },
    
    /**
     * Get history for a tool
     */
    getToolHistory(toolName, limit = 10) {
        const toolData = this.getToolData(toolName);
        return toolData.history ? toolData.history.slice(0, limit) : [];
    },
    
    /**
     * Clear history for a tool
     */
    clearToolHistory(toolName) {
        const toolData = this.getToolData(toolName);
        toolData.history = [];
        return this.saveToolData(toolName, toolData);
    },
    
    // ==========================================
    // USER PREFERENCES
    // ==========================================
    
    /**
     * Get user preferences
     */
    getPreferences() {
        const data = this.getData() || this.init();
        return data.preferences || {};
    },
    
    /**
     * Update user preferences
     */
    updatePreferences(updates) {
        const data = this.getData() || this.init();
        data.preferences = {
            ...data.preferences,
            ...updates
        };
        return this.saveData(data);
    },
    
    /**
     * Get a specific preference
     */
    getPreference(key, defaultValue = null) {
        const prefs = this.getPreferences();
        return prefs[key] !== undefined ? prefs[key] : defaultValue;
    },
    
    /**
     * Set a specific preference
     */
    setPreference(key, value) {
        return this.updatePreferences({ [key]: value });
    },
    
    // ==========================================
    // EXPORT / IMPORT
    // ==========================================
    
    /**
     * Export all data as JSON string
     */
    exportData() {
        const data = this.getData() || this.init();
        return JSON.stringify(data, null, 2);
    },
    
    /**
     * Export data and download as file
     */
    exportToFile() {
        try {
            const data = this.exportData();
            const date = new Date().toISOString().split('T')[0];
            const filename = `3d-print-tools-backup-${date}.json`;
            
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting data:', error);
            return false;
        }
    },
    
    /**
     * Import data from JSON string
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Validate data structure
            if (!data.version || !data.printers) {
                throw new Error('Invalid data format');
            }
            
            // Merge with existing data (optional)
            // For now, we'll replace entirely
            return this.saveData(data);
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },
    
    /**
     * Import data from file
     */
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const result = this.importData(e.target.result);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    },
    
    /**
     * Clear all data (with caution!)
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    },
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    /**
     * Get storage usage information
     */
    getStorageInfo() {
        const data = this.exportData();
        return {
            size: new Blob([data]).size,
            sizeKB: (new Blob([data]).size / 1024).toFixed(2),
            printerCount: this.getPrinters().length,
            toolCount: Object.keys(this.getData()?.tools || {}).length
        };
    },
    
    /**
     * Check if storage is available
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        StorageManager.init();
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
