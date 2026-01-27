/**
 * Tab 1: Printer Info
 * Basic printer information, model selection, and configuration import
 * 
 * @module Tab1PrinterInfo
 */

export const Tab1PrinterInfo = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (printer-profiles, etc.)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const printerProfiles = databases['printer-profiles']?.printers || [];
    
    return `
      <div class="tab-content">
        <h3>📋 Printer Information</h3>
        
        <!-- Row 1: Profile Name (full width) -->
        <div class="form-field">
          <label>Profile Name *</label>
          <input type="text" id="tab1_profileName" 
            value="${profile.name || ''}" 
            placeholder="e.g., My Ender 5 Plus"
            required>
          <p class="field-help">Give your printer profile a memorable name</p>
        </div>

        <!-- Row 2: Printer Database Search (full width) -->
        <div class="form-field" style="margin-top: 10px;">
          <label>Search Printer Database (${printerProfiles.length} models)</label>
          <div style="position: relative; width: 100%;">
            <input type="text" id="printerModelSearch"
              value="${this.getCurrentPrinterDisplayName(profile, databases)}"
              placeholder="Start typing printer name (e.g., Ender 3, Prusa MK3)..."
              autocomplete="off"
              style="width: 100%;">
            <div id="printerSearchResults" class="autocomplete-results" style="display: none;"></div>
          </div>
          <p class="field-help">💡 Type to search from ${printerProfiles.length}+ printer models. Auto-fills hardware settings.</p>
          <div id="selectedPrinterInfo" style="display: none; margin-top: 10px; padding: 10px; background: #e3f2fd; border-left: 3px solid #2196f3; border-radius: 4px;"></div>
        </div>

        <!-- Separator -->
        <div style="margin: 15px 0; border-top: 2px solid var(--border, #ddd);"></div>

        <!-- Row 3: Firmware Type and Version (50/50 split) -->
        <div class="form-grid">
          <div class="form-field">
            <label>Firmware Type *</label>
            <select id="firmwareType" required>
              <option value="">Select firmware...</option>
              <option value="marlin" ${profile.firmwareType === 'marlin' ? 'selected' : ''}>Marlin</option>
              <option value="th3d" ${profile.firmwareType === 'th3d' ? 'selected' : ''}>TH3D Unified</option>
              <option value="klipper" ${profile.firmwareType === 'klipper' ? 'selected' : ''}>Klipper</option>
              <option value="reprap" ${profile.firmwareType === 'reprap' ? 'selected' : ''}>RepRap</option>
              <option value="other" ${profile.firmwareType === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>

          <div class="form-field">
            <label>Firmware Version <span title="Required for TH3D to use version-specific core mappings">ⓘ</span></label>
            <input type="text" id="tab1_firmwareVersion" 
              value="${profile.firmwareVersion || ''}" 
              placeholder="e.g., 2.1.2.6 or 2.97a"
              title="For TH3D: Enter version (e.g., 2.97a) for optimized parsing, or leave blank to use generic mapping">
            <p class="field-help">💡 TH3D users: Version enables optimized core field mapping. Leave blank to use generic fallback.</p>
          </div>
        </div>

        <!-- Quick Setup / Import Section -->
        <div class="quick-setup-section" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--border, #ddd);">
          <h4>🔍 Quick Setup (Optional)</h4>
          
          <div class="import-section" style="margin-top: 10px;">
            <h4>📥 Import Settings</h4>
            <p>Import your Configuration.h or EEPROM backup to auto-fill settings:</p>
            <div class="import-methods">
              <button class="btn-secondary" id="showConfigUpload">📄 Upload Configuration.h</button>
              <button class="btn-secondary" id="showM503Paste">📋 Paste M503 Output</button>
              <button class="btn-secondary" id="showEEPROMBackup">💾 EEPROM Backup</button>
            </div>
            <div id="importArea" style="display: none; margin-top: 15px;"></div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get current printer display name from profile
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases
   * @returns {string} Printer display name
   */
  getCurrentPrinterDisplayName(profile, databases) {
    if (!profile.printerModel) return '';
    if (databases['printer-profiles']?.printers) {
      const printer = databases['printer-profiles'].printers.find(p => p.id === profile.printerModel);
      if (printer) return printer.name;
    }
    return profile.printerModel;
  },

  /**
   * Attach event listeners for this tab
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases
   * @param {Object} context - Additional context (parent controller methods)
   */
  attachListeners(profile, updateCallback, databases, context) {
    // Basic text inputs
    const profileName = document.getElementById('tab1_profileName');
    if (profileName) {
      profileName.addEventListener('input', (e) => {
        profile.name = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    const firmwareType = document.getElementById('firmwareType');
    if (firmwareType) {
      firmwareType.addEventListener('change', (e) => {
        profile.firmwareType = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
        this.toggleConfigUploadButton();
      });
      this.toggleConfigUploadButton();
    }

    const firmwareVersion = document.getElementById('tab1_firmwareVersion');
    if (firmwareVersion) {
      firmwareVersion.addEventListener('input', (e) => {
        profile.firmwareVersion = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Setup printer autocomplete
    this.setupPrinterAutocomplete(profile, updateCallback, databases, context);

    // Import button listeners
    const uploadBtn = document.getElementById('showConfigUpload');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        this.showConfigUpload(profile, context);
      });
    }

    const m503Btn = document.getElementById('showM503Paste');
    if (m503Btn) {
      m503Btn.addEventListener('click', () => {
        this.showM503Paste();
      });
    }

    const eepromBtn = document.getElementById('showEEPROMBackup');
    if (eepromBtn) {
      eepromBtn.addEventListener('click', () => {
        this.showEEPROMBackup();
      });
    }
  },

  /**
   * Setup autocomplete for printer search
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases
   * @param {Object} context - Additional context
   */
  setupPrinterAutocomplete(profile, updateCallback, databases, context) {
    const searchInput = document.getElementById('printerModelSearch');
    const resultsDiv = document.getElementById('printerSearchResults');
    const infoDiv = document.getElementById('selectedPrinterInfo');
    
    if (!searchInput || !resultsDiv || !databases['printer-profiles']) return;

    let currentIndex = -1;
    let filteredPrinters = [];

    const searchPrinters = (query) => {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) return [];
      
      return databases['printer-profiles'].printers
        .filter(p => !p._section && p.name)
        .filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.manufacturer?.toLowerCase().includes(lowerQuery) ||
          p.id?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 10);
    };

    const renderResults = (printers) => {
      if (printers.length === 0) {
        resultsDiv.innerHTML = '<div class="autocomplete-item-no-results">No printers found</div>';
        resultsDiv.style.display = 'block';
        return;
      }
      
      resultsDiv.innerHTML = printers.map((p, idx) => `
        <div class="autocomplete-item ${idx === currentIndex ? 'active' : ''}" data-printer-id="${p.id}">
          <strong>${p.name}</strong>
          ${p.manufacturer ? `<br><small style="color: #666;">${p.manufacturer}</small>` : ''}
        </div>
      `).join('');
      resultsDiv.style.display = 'block';
    };

    const selectPrinter = (printerId) => {
      const printer = databases['printer-profiles'].printers.find(p => p.id === printerId);
      if (!printer) return;
      
      profile.printerModel = printer.id;
      profile.modified = new Date().toISOString();
      searchInput.value = printer.name;
      resultsDiv.style.display = 'none';
      currentIndex = -1;
      
      this.showPrinterInfo(printer, infoDiv);
      
      // Auto-fill from printer database
      if (context.autofillFromPrinterDatabase) {
        context.autofillFromPrinterDatabase(printer);
      }
      
      updateCallback();
    };

    // Input event
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length < 2) {
        resultsDiv.style.display = 'none';
        if (infoDiv) infoDiv.style.display = 'none';
        return;
      }
      filteredPrinters = searchPrinters(query);
      currentIndex = -1;
      renderResults(filteredPrinters);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (resultsDiv.style.display === 'none') return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, filteredPrinters.length - 1);
        renderResults(filteredPrinters);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, -1);
        renderResults(filteredPrinters);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0 && filteredPrinters[currentIndex]) {
          selectPrinter(filteredPrinters[currentIndex].id);
        }
      } else if (e.key === 'Escape') {
        resultsDiv.style.display = 'none';
        currentIndex = -1;
      }
    });

    // Click on result
    resultsDiv.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (item && item.dataset.printerId) {
        selectPrinter(item.dataset.printerId);
      }
    });

    // Click outside closes results
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.style.display = 'none';
      }
    });
  },

  /**
   * Show printer info card
   * @param {Object} printer - Printer data from database
   * @param {HTMLElement} infoDiv - Element to display info in
   */
  showPrinterInfo(printer, infoDiv) {
    if (!infoDiv) return;
    
    let infoHTML = `
      <strong style="font-size: 1.1em;">${printer.name}</strong><br>
      <strong>Manufacturer:</strong> ${printer.manufacturer}<br>
    `;
    
    if (printer.kinematics) {
      infoHTML += `<strong>Kinematics:</strong> ${printer.kinematics}<br>`;
    }
    if (printer.bedSize) {
      infoHTML += `<strong>Build Volume:</strong> ${printer.bedSize.x}×${printer.bedSize.y}×${printer.bedSize.z}mm<br>`;
    }
    if (printer.stockBoard) {
      infoHTML += `<strong>Stock Board:</strong> ${printer.stockBoard}<br>`;
    }
    if (printer.stockHotend) {
      infoHTML += `<strong>Stock Hotend:</strong> ${printer.stockHotend}<br>`;
    }
    if (printer.stockProbe) {
      infoHTML += `<strong>Stock Probe:</strong> ${printer.stockProbe}<br>`;
    }
    if (printer.notes) {
      infoHTML += `<br><em style="color: #666;">${printer.notes}</em>`;
    }
    
    infoDiv.innerHTML = infoHTML;
    infoDiv.style.display = 'block';
  },

  /**
   * Toggle Configuration.h upload button based on firmware type
   */
  toggleConfigUploadButton() {
    const uploadBtn = document.getElementById('showConfigUpload');
    const firmwareType = document.getElementById('firmwareType');
    
    if (uploadBtn && firmwareType) {
      const isMarlinBased = firmwareType.value === 'marlin' || firmwareType.value === 'th3d';
      uploadBtn.disabled = !isMarlinBased;
      uploadBtn.style.opacity = isMarlinBased ? '1' : '0.5';
      uploadBtn.title = isMarlinBased 
        ? 'Upload Configuration.h file' 
        : 'Only available for Marlin-based firmware';
    }
  },

  /**
   * Show Configuration.h upload interface
   * @param {Object} profile - Current printer profile
   * @param {Object} context - Orchestrator context
   */
  showConfigUpload(profile, context) {
    const importArea = document.getElementById('importArea');
    if (!importArea) return;

    const isMarlin = profile.firmwareType === 'marlin';
    const isTH3D = profile.firmwareType === 'th3d';
    
    importArea.innerHTML = `
      <div class="card" style="padding: 20px; margin-top: 15px;">
        <h4 style="margin-top: 0;">📄 Upload Configuration Files</h4>
        <p style="color: var(--text-secondary);">Select Configuration.h files (you can select multiple files):</p>
        
        <!-- Hidden File Input -->
        <input type="file" 
          id="configFileInput" 
          accept=".h" 
          multiple
          style="display: none;">
        
        <!-- Drag and Drop Zone (themed) -->
        <div id="configDropZone" class="file-drop-zone" style="padding: 50px 20px; text-align: center; margin: 15px 0;">
          <p style="margin: 0 0 10px 0; pointer-events: none; font-size: 1.2em;">
            🎯 Click to browse or drag and drop
          </p>
          <p style="margin: 0; pointer-events: none; color: var(--text-secondary, #666); font-size: 0.95em;">
            Configuration.h files here
          </p>
        </div>
        
        <div id="selectedFiles" style="margin-top: 15px;"></div>
        
        <button class="btn-primary" id="parseConfigBtn" disabled style="margin-top: 15px; width: 100%;">
          ⚡ Parse and Import
        </button>
        
        <button class="btn-secondary" id="cancelImportBtn" style="margin-top: 10px; width: 100%;">
          ✕ Cancel
        </button>
      </div>
    `;

    importArea.style.display = 'block';

    // Setup file input handler
    const fileInput = document.getElementById('configFileInput');
    const dropZone = document.getElementById('configDropZone');
    const parseBtn = document.getElementById('parseConfigBtn');
    const cancelBtn = document.getElementById('cancelImportBtn');
    const filesDiv = document.getElementById('selectedFiles');
    let selectedFiles = [];

    const updateFilesList = (files) => {
      selectedFiles = Array.from(files);
      filesDiv.innerHTML = selectedFiles.map(f => 
        `<div style="padding: 8px; background: var(--success-light); border-radius: 4px; margin-bottom: 5px; border-left: 3px solid var(--success);">
          ✅ ${f.name} <small style="color: var(--text-secondary);">(${(f.size / 1024).toFixed(1)} KB)</small>
        </div>`
      ).join('');
      parseBtn.disabled = selectedFiles.length === 0;
    };

    // File input change
    fileInput.addEventListener('change', (e) => {
      updateFilesList(e.target.files);
    });

    // Click on drop zone to browse files
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag and drop handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    dropZone.addEventListener('dragover', () => {
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      dropZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      
      // Validate files
      const validFiles = Array.from(files).filter(f => f.name.endsWith('.h'));
      if (validFiles.length !== files.length) {
        alert('⚠️ Some files were skipped. Only .h files are allowed.');
      }
      if (validFiles.length > 0) {
        updateFilesList(validFiles);
      }
    });

    // Parse button
    parseBtn.addEventListener('click', async () => {
      await this.parseConfigFiles(selectedFiles, profile, context);
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
      importArea.style.display = 'none';
      importArea.innerHTML = '';
    });
  },

  /**
   * Parse Configuration.h files
   * @param {FileList} files - Files to parse
   * @param {Object} profile - Current printer profile
   * @param {Object} context - Orchestrator context
   */
  async parseConfigFiles(files, profile, context) {
    // Check if parser is available
    if (!window.UniversalParser || typeof window.UniversalParser.create !== 'function') {
      alert('❌ Config parser not loaded. Please ensure universal-parser.js is included in index.html.');
      return;
    }

    // Check if StagingDataManager is available
    if (!window.StagingDataManager) {
      alert('❌ Staging Data Manager not loaded. Please ensure staging-data-manager.js is included in index.html.');
      return;
    }

    // For TH3D, recommend version but allow fallback
    if (profile.firmwareType === 'th3d' && (!profile.firmwareVersion || profile.firmwareVersion.trim() === '')) {
      const useDefault = confirm(
        '⚠️ TH3D Firmware Version Not Specified\n\n' +
        'For best results, enter your TH3D firmware version (e.g., 2.97a) in the "Firmware Version" field.\n\n' +
        'Version-specific mapping provides optimized parsing with only UI-relevant fields.\n\n' +
        '─────────────────\n\n' +
        'Click OK to continue with generic fallback mapping\n' +
        'Click Cancel to go back and enter version'
      );
      
      if (!useDefault) {
        return; // User wants to enter version
      }
      // Continue with default mapping
      console.log('📌 Using generic TH3D fallback mapping (no version specified)');
    }

    const parseBtn = document.getElementById('parseConfigBtn');
    const originalText = parseBtn?.textContent || '⚡ Parse and Import';
    
    if (parseBtn) {
      parseBtn.disabled = true;
      parseBtn.textContent = '⏳ Parsing...';
    }

    try {
      // Detect mapping file path based on firmware type and version
      let mappingPath = 'assets/data/maps/marlin/marlin-config-mapping.json'; // Default for Marlin
      
      if (profile.firmwareType === 'th3d') {
        // Map TH3D version to core mapping file
        const version = (profile.firmwareVersion || '').toLowerCase();
        if (version.includes('2.97') || version.startsWith('2.97')) {
          mappingPath = 'assets/data/maps/th3d/TH3D UFW 2.97a/core/th3d-config-mapping-core.json';
          console.log('🎯 Using TH3D 2.97a core mapping (optimized UI fields)');
        } else if (version) {
          // Try version-specific mapping
          mappingPath = `assets/data/maps/th3d/TH3D UFW ${version}/core/th3d-config-mapping-core.json`;
          console.warn('⚠️ Attempting version-specific mapping for:', version);
        } else {
          mappingPath = 'assets/data/maps/th3d/default/th3d-config-mapping.json';
          console.warn('⚠️ Using fallback TH3D mappings (no version specified)');
        }
      }
      
      console.log(`🔧 Using mapping: ${mappingPath} (Firmware: ${profile.firmwareType} ${profile.firmwareVersion || ''})`);
      
      // Create parser instance
      const parser = window.UniversalParser.create();
      
      // Load mapping
      try {
        await parser.loadMapping(mappingPath);
      } catch (err) {
        throw new Error(`Failed to load mapping file: ${mappingPath}\n\n${err.message}`);
      }
      
      const fileContents = {};
      const fileNames = [];

      // Read all files and map to parser's expected property names
      for (const file of files) {
        const content = await file.text();
        const name = file.name.toLowerCase();
        fileNames.push(file.name);
        
        // Map file names to parser property names
        if (name.includes('configuration_adv')) {
          fileContents.configAdv = content;
        } else if (name.includes('configuration_backend')) {
          fileContents.configBackend = content;
        } else if (name.includes('configuration_speed')) {
          fileContents.configSpeed = content;
        } else if (name.includes('configuration')) {
          fileContents.config = content;
        }
      }

      console.log('📄 Parsing files:', Object.keys(fileContents));

      // Parse files
      const parsed = await parser.parseMultiple(fileContents);
      
      console.log('✅ Parsed configuration:', parsed);
      console.log('📊 Debug log entries:', parsed._debugLog?.length || 0);

      // Create staging data structure (will add totalFields after processing)
      const stagingData = {
        parsedData: {},
        parsedConfig: parsed,  // SAVE COMPLETE PARSED CONFIG (including _debugLog)
        metadata: {
          firmwareType: profile.firmwareType,
          firmwareVersion: profile.firmwareVersion || '',
          timestamp: new Date().toISOString(),
          mappingPath: mappingPath,
          fileNames: fileNames,
          parserVersion: '1.0.0 (Universal Parser)'
        },
        temporary: true,
        profileName: null
      };

      // Transform parsed data into staging format using parser metadata
      const parsedMetadata = parsed._metadata || {};
      let stagingFieldCount = 0;
      
      for (const [category, fields] of Object.entries(parsed)) {
        if (category.startsWith('_') || category === 'warnings') continue;
        
        for (const [fieldName, value] of Object.entries(fields)) {
          // Look up metadata for this field
          const categoryMetadata = parsedMetadata[category];
          const fieldMetadata = categoryMetadata?.[fieldName];
          
          if (!fieldMetadata) {
            console.warn(`⚠️ No metadata found for ${category}.${fieldName}`);
            continue;
          }
          
          // Use the actual #define name from parser metadata
          const defineName = fieldMetadata.defineName;
          
          stagingData.parsedData[defineName] = {
            value: value,
            profilePath: `${category}.${fieldName}`,
            uiFieldId: fieldMetadata.uiFieldId,
            type: fieldMetadata.type,
            label: fieldName,
            category: category,
            defineName: defineName
          };
          
          stagingFieldCount++;
        }
      }
      
      // Add actual staging field count
      stagingData.metadata.totalFields = stagingFieldCount;
      stagingData.metadata.fieldsWithUiMapping = Object.values(stagingData.parsedData)
        .filter(f => f.uiFieldId !== null).length;

      // Save to staging storage
      const saved = window.StagingDataManager.saveStagingData(stagingData);
      
      if (saved) {
        // Show staging data banner
        window.StagingDataManager.showBanner();
        
        // Apply to profile (legacy approach for now)
        this.applyParsedData(parsed, profile);

        // Mark profile as modified
        if (context.onProfileUpdate) {
          context.onProfileUpdate();
        }

        // Show success and close import area
        const fieldCount = stagingData.metadata.totalFields;
        const mappedCount = stagingData.metadata.fieldsWithUiMapping;
        alert(
          `✅ Successfully parsed ${files.length} file(s)!\n\n` +
          `📊 Imported ${fieldCount} configuration settings:\n` +
          `   • ${mappedCount} fields have UI mappings\n` +
          `   • ${fieldCount - mappedCount} fields stored (no UI mapping yet)\n\n` +
          `💡 Data is temporary until you:\n` +
          `   1. Enter a profile name\n` +
          `   2. Click "Save Profile"\n\n` +
          `Navigate through tabs to review imported settings.`
        );
        
        // Close import area
        const importArea = document.getElementById('importArea');
        if (importArea) {
          importArea.style.display = 'none';
          importArea.innerHTML = '';
        }

        // Re-render to show updated data
        if (context.renderCurrentTab) {
          context.renderCurrentTab();
        }
      } else {
        throw new Error('Failed to save staging data');
      }

    } catch (error) {
      console.error('❌ Parse error:', error);
      alert('❌ Failed to parse configuration files:\n\n' + error.message + '\n\nPlease ensure you uploaded valid Configuration.h files.');
    }

    if (parseBtn) {
      parseBtn.disabled = false;
      parseBtn.textContent = originalText;
    }
  },

  /**
   * Populate UI fields from staging data using uiFieldId metadata
   * @param {Object} stagingData - Staging data with uiFieldId metadata
   */
  populateUIFromStagingData(stagingData) {
    if (!stagingData || !stagingData.parsedData) {
      console.warn('⚠️ No staging data to populate UI');
      return;
    }

    let populatedCount = 0;
    let skippedCount = 0;
    
    console.log('🎨 Populating UI fields from staging data...');
    console.log(`   Found ${Object.keys(stagingData.parsedData).length} parsed fields`);
    
    // Iterate through each parsed field
    for (const [defineName, fieldData] of Object.entries(stagingData.parsedData)) {
      try {
        const { uiFieldId, value, type } = fieldData;
        
        // Skip if no UI mapping
        if (!uiFieldId) {
          skippedCount++;
          continue;
        }
        
        // Find the input element (might not exist if on different tab)
        const element = document.getElementById(uiFieldId);
        if (!element) {
          skippedCount++;
          continue; // Silently skip - element might be on another tab
        }
        
        // Populate based on element type
        if (element.tagName === 'INPUT') {
          if (element.type === 'checkbox') {
            element.checked = Boolean(value);
          } else {
            element.value = value || '';
          }
        } else if (element.tagName === 'SELECT') {
          element.value = value || '';
        } else if (element.tagName === 'TEXTAREA') {
          element.value = value || '';
        }
        
        console.log(`   ✅ ${uiFieldId} = "${value}" (from ${defineName})`);
        populatedCount++;
      } catch (err) {
        console.error(`   ❌ Error populating ${defineName}:`, err);
        skippedCount++;
      }
    }
    
    console.log(`✨ Populated ${populatedCount} UI fields (${skippedCount} skipped/not visible)`);
  },

  /**
   * Apply parsed configuration to profile
   * @param {Object} parsed - Parsed configuration data
   * @param {Object} profile - Current printer profile
   */
  applyParsedData(parsed, profile) {
    console.log('📝 Applying parsed config to profile...');
    
    // NEW: Populate UI fields directly from staging data
    try {
      const stagingData = window.StagingDataManager?.loadStagingData();
      if (stagingData) {
        this.populateUIFromStagingData(stagingData);
      } else {
        console.warn('⚠️ No staging data available for UI population');
      }
    } catch (err) {
      console.error('❌ Error populating UI from staging data:', err);
      // Continue with profile data application even if UI population fails
    }
    
    // Helper to merge all categories with same base name (e.g., "motion", "motion_1", "motion_2")
    const mergeCategories = (baseName) => {
      const merged = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (key === baseName || key.startsWith(baseName + '_')) {
          Object.assign(merged, value);
        }
      }
      return Object.keys(merged).length > 0 ? merged : null;
    };

    // Basic info (handle basic, basic_1, etc.)
    const basicData = mergeCategories('basic');
    if (basicData) {
      if (basicData.machineName && !profile.name) {
        profile.name = basicData.machineName;
      }
      if (basicData.customMachineName && !profile.name) {
        profile.name = basicData.customMachineName;
      }
      if (basicData.baudRate) {
        profile.baudRate = basicData.baudRate;
      }
      if (basicData.serialPort) {
        if (!profile.communication) profile.communication = {};
        profile.communication.serialPort = basicData.serialPort;
      }
    }

    // Hardware (handle hardware, hardware_1, etc.)
    const hardwareData = mergeCategories('hardware');
    if (hardwareData) {
      if (!profile.hardware) profile.hardware = {};
      
      if (hardwareData.motherboard) {
        profile.hardware.board = hardwareData.motherboard;
      }
      
      // Temperature sensors
      if (hardwareData.tempSensor0 !== undefined) {
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        profile.hardware.thermistors.hotend = hardwareData.tempSensor0;
      }
      if (hardwareData.tempSensorBed !== undefined) {
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        profile.hardware.thermistors.bed = hardwareData.tempSensorBed;
      }

      // Stepper drivers
      const driverFields = ['xDriverType', 'yDriverType', 'zDriverType', 'e0DriverType'];
      for (const field of driverFields) {
        if (hardwareData[field]) {
          if (!profile.hardware.drivers) profile.hardware.drivers = {};
          profile.hardware.drivers[field] = hardwareData[field];
        }
      }
    }

    // Motion (handle motion, motion_1, etc.)
    const motionData = mergeCategories('motion');
    if (motionData) {
      if (!profile.motion) profile.motion = {};
      Object.assign(profile.motion, motionData);
    }

    // Temperature (handle temperature, temperature_1, etc.)
    const temperatureData = mergeCategories('temperature');
    if (temperatureData) {
      if (!profile.temperature) profile.temperature = {};
      Object.assign(profile.temperature, temperatureData);
    }

    // Probe (handle probe, probe_1, etc.)
    const probeData = mergeCategories('probe');
    if (probeData) {
      if (!profile.probe) profile.probe = {};
      Object.assign(profile.probe, probeData);
    }

    // Bed leveling
    const bedLevelingData = mergeCategories('bedLeveling');
    if (bedLevelingData) {
      if (!profile.bedLeveling) profile.bedLeveling = {};
      Object.assign(profile.bedLeveling, bedLevelingData);
    }

    // Safety
    const safetyData = mergeCategories('safety');
    if (safetyData) {
      if (!profile.safety) profile.safety = {};
      Object.assign(profile.safety, safetyData);
    }

    // Endstops
    const endstopsData = mergeCategories('endstops');
    if (endstopsData) {
      if (!profile.endstops) profile.endstops = {};
      Object.assign(profile.endstops, endstopsData);
    }

    // Acceleration
    const accelerationData = mergeCategories('acceleration');
    if (accelerationData) {
      if (!profile.acceleration) profile.acceleration = {};
      Object.assign(profile.acceleration, accelerationData);
    }

    // Feedrates
    const feedratesData = mergeCategories('feedrates');
    if (feedratesData) {
      if (!profile.feedrates) profile.feedrates = {};
      Object.assign(profile.feedrates, feedratesData);
    }

    // Jerk
    const jerkData = mergeCategories('jerk');
    if (jerkData) {
      if (!profile.jerk) profile.jerk = {};
      Object.assign(profile.jerk, jerkData);
    }

    // Advanced features (including linearAdvance, babystepping, etc.)
    const advancedData = mergeCategories('advanced');
    if (advancedData) {
      if (!profile.advanced) profile.advanced = {};
      Object.assign(profile.advanced, advancedData);
    }

    // Handle "other" categories that might contain important fields
    const otherData = mergeCategories('other');
    if (otherData) {
      // Map firmware version fields
      if (otherData.unifiedVersion && !profile.firmwareVersion) {
        profile.firmwareVersion = otherData.unifiedVersion;
      }
      
      // Map advanced features that ended up in "other"
      if (otherData.linearAdvance !== undefined) {
        if (!profile.advanced) profile.advanced = {};
        profile.advanced.linearAdvance = otherData.linearAdvance;
      }
      if (otherData.linearAdvanceK !== undefined) {
        if (!profile.advanced) profile.advanced = {};
        profile.advanced.linearAdvanceK = otherData.linearAdvanceK;
      }
      if (otherData.babystepping !== undefined) {
        if (!profile.advanced) profile.advanced = {};
        profile.advanced.babystepping = otherData.babystepping;
      }
    }

    console.log('✅ Profile updated with parsed data');
    console.log('📊 Updated profile:', profile);
  },

  /**
   * Count parsed fields for success message
   * @param {Object} parsed - Parsed configuration data
   * @returns {number} Field count
   */
  countParsedFields(parsed) {
    let count = 0;
    const countObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          countObject(obj[key]);
        } else {
          count++;
        }
      }
    };
    countObject(parsed);
    return count;
  },

  /**
   * Show M503 paste interface (stub for now)
   */
  showM503Paste() {
    alert('🚧 M503 parsing coming soon!\n\nFor now, use Configuration.h upload.');
  },

  /**
   * Show EEPROM backup interface (stub for now)
   */
  showEEPROMBackup() {
    alert('🚧 EEPROM backup import coming soon!\n\nFor now, use Configuration.h upload.');
  }
};
