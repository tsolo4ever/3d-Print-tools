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
        
        <!-- Basic Info Section -->
        <div class="form-row">
          <div class="form-group">
            <label>Profile Name *</label>
            <input type="text" id="profileName" class="form-control" 
              value="${profile.name || ''}" 
              placeholder="e.g., My Ender 5 Plus"
              required>
            <p class="field-help">Give your printer profile a memorable name</p>
          </div>
          
          <div class="form-group">
            <label>Firmware Type *</label>
            <select id="firmwareType" class="form-control" required>
              <option value="">Select firmware...</option>
              <option value="marlin" ${profile.firmwareType === 'marlin' ? 'selected' : ''}>Marlin</option>
              <option value="th3d" ${profile.firmwareType === 'th3d' ? 'selected' : ''}>TH3D Unified</option>
              <option value="klipper" ${profile.firmwareType === 'klipper' ? 'selected' : ''}>Klipper</option>
              <option value="reprap" ${profile.firmwareType === 'reprap' ? 'selected' : ''}>RepRap</option>
              <option value="other" ${profile.firmwareType === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Firmware Version</label>
          <input type="text" id="firmwareVersion" class="form-control" 
            value="${profile.firmwareVersion || ''}" 
            placeholder="e.g., 2.1.2.6 or 2.97a">
          <p class="field-help">Check About menu or M115 command for version</p>
        </div>

        <!-- Printer Database Search -->
        <div class="printer-search-section" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--border, #ddd);">
          <div class="form-group">
            <label>Search Printer Database (${printerProfiles.length} models)</label>
            <div style="position: relative;">
              <input type="text" id="printerModelSearch" class="form-control"
                value="${this.getCurrentPrinterDisplayName(profile, databases)}"
                placeholder="Start typing printer name (e.g., Ender 3, Prusa MK3)..."
                autocomplete="off">
              <div id="printerSearchResults" class="autocomplete-results" style="display: none;"></div>
            </div>
            <p class="field-help">💡 Type to search from ${printerProfiles.length}+ printer models. Auto-fills hardware settings.</p>
            <div id="selectedPrinterInfo" style="display: none; margin-top: 10px; padding: 10px; background: #e3f2fd; border-left: 3px solid #2196f3; border-radius: 4px;"></div>
          </div>
        </div>

        <!-- Quick Setup / Import Section -->
        <div class="quick-setup-section" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--border, #ddd);">
          <h4>🔍 Quick Setup (Optional)</h4>
          
          <div class="import-section" style="margin-top: 20px;">
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
    const profileName = document.getElementById('profileName');
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

    const firmwareVersion = document.getElementById('firmwareVersion');
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
        if (context.showConfigUpload) context.showConfigUpload();
      });
    }

    const m503Btn = document.getElementById('showM503Paste');
    if (m503Btn) {
      m503Btn.addEventListener('click', () => {
        if (context.showM503Paste) context.showM503Paste();
      });
    }

    const eepromBtn = document.getElementById('showEEPROMBackup');
    if (eepromBtn) {
      eepromBtn.addEventListener('click', () => {
        if (context.showEEPROMBackup) context.showEEPROMBackup();
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
  }
};
