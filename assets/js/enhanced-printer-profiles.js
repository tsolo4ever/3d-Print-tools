
/**
 * Enhanced Printer Profiles
 * Advanced 10-tab printer profile editor with Configuration.h import
 *
 * DEBUG MODE:
 * Set EnhancedPrinterProfiles.DEBUG = false to silence debug logs.
 * Errors (console.error) and important warnings (console.warn) remain visible.
 *
 * @version 2.1.0
 * @requires storage-manager.js
 * @requires marlin-config-parser.js  // <-- parser file name on git
 */
class EnhancedPrinterProfiles {
  // Debug mode — set to false to suppress ALL informational logging
  static DEBUG = true;

  /** Debug logger — only logs if DEBUG is true */
  static log(...args) {
    if (EnhancedPrinterProfiles.DEBUG) {
      console.log(...args);
    }
  }

  constructor() {
    this.currentProfile = null;
    this.currentTab = 1;
    this.databases = {};
    this.modal = null;
    this.validationState = {};
    this.tempConfigFiles = [];
    this.tempParsedConfig = null;
    // Load hardware databases
    this.loadDatabases();
  }

  /** Load hardware databases */
  async loadDatabases() {
    try {
      const bases = [
        'marlin-boards-V2',
        'stepper-drivers-V2',
        'thermistors-V2',
        'displays',
        'Hotends',
        'bed-probes',
        'heaters',
        'printer-profiles'
      ];

      for (const db of bases) {
        const response = await fetch(`assets/data/${db}.json`);
        const data = await response.json();
        const normalizedName = db.replace('-V2', '');
        this.databases[normalizedName] = data;
      }

      EnhancedPrinterProfiles.log('✅ Hardware databases loaded:', Object.keys(this.databases));
      EnhancedPrinterProfiles.log('📊 Board count:', this.databases['marlin-boards']?.boards?.length);
      EnhancedPrinterProfiles.log('📊 Driver count:', this.databases['stepper-drivers']?.drivers?.length);
      EnhancedPrinterProfiles.log('📊 Thermistor count:', this.databases['thermistors']?.thermistors?.length);
      EnhancedPrinterProfiles.log('📊 Hotend count:', this.databases['Hotends']?.hotends?.length);
      EnhancedPrinterProfiles.log('📊 Probe count:', this.databases['bed-probes']?.probes?.length);
      EnhancedPrinterProfiles.log('📊 Printer profile count:', this.databases['printer-profiles']?.printers?.length);
    } catch (error) {
      console.error('❌ Error loading databases:', error);
    }
  }

  /** Show the enhanced profile editor */
  async show(profileId = null) {
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'profileLoading';
    loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:30px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;text-align:center;';
    loadingDiv.innerHTML = '<h3>⏳ Loading Hardware Databases...</h3><p>Please wait...</p>';
    document.body.appendChild(loadingDiv);

    // Wait for databases to load
    if (Object.keys(this.databases).length === 0) {
      await this.loadDatabases();
    }

    // Remove loading indicator
    loadingDiv.remove();
    EnhancedPrinterProfiles.log('✅ Databases ready:', Object.keys(this.databases));
    EnhancedPrinterProfiles.log('📊 Board count:', this.databases['marlin-boards']?.boards?.length);

    // Load profile if editing existing
    if (profileId) {
      this.currentProfile = StorageManager.getPrinter(profileId);
    } else {
      this.currentProfile = this.createDefaultProfile();
    }

    // Create and show modal
    this.createModal();
    this.renderCurrentTab();
  }

  /** Create default profile structure */
  createDefaultProfile() {
    return {
      id: 'printer_' + Date.now(),
      name: '',
      printerModel: '',
      firmwareType: '',
      firmwareVersion: '',
      hardware: {
        board: '',
        drivers: { x: '', y: '', z: '', e: '' },
        thermistors: { hotend: '', bed: '' },
        display: ''
      },
      temperature: {
        hotend: { max: 275, pid: { p: 0, i: 0, d: 0 } },
        bed: { max: 110, pid: { p: 0, i: 0, d: 0 } }
      },
      motion: {
        steps: { x: 80, y: 80, z: 400, e: 93 },
        maxFeedrates: { x: 500, y: 500, z: 5, e: 25 },
        maxAccel: { x: 500, y: 500, z: 100, e: 5000 },
        jerk: { x: 8, y: 8, z: 0.4, e: 5 }
      },
      probe: {
        type: 'none',
        offsets: { x: 0, y: 0, z: 0 }
      },
      bedLeveling: {
        type: 'none',
        gridPoints: { x: 3, y: 3 },
        fadeHeight: 0
      },
      advanced: {
        linearAdvance: { enabled: false, k: 0 },
        arcSupport: false
      },
      safety: {
        thermalProtection: { hotend: true, bed: true },
        runaway: { enabled: true, period: 40, hysteresis: 4 }
      },
      nozzles: [],
      preferences: {
        slicer: 'superslicer',
        materials: ['PLA']
      },
      notes: '',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
  }

  /** Create the modal HTML structure */
  createModal() {
    const modalHTML = `
      <div class="printer-modal" id="enhancedProfileOverlay">
        <div class="modal-content-enhanced">
          <!-- Header -->
          <div class="modal-header-enhanced">
            <h3>🖨️ ${this.currentProfile.name || 'New Printer Profile'}</h3>
            <button class="modal-close-btn" id="enhancedProfileClose">✕</button>
          </div>
          <!-- Tab Navigation -->
          <div class="modal-tabs">
            <button class="tab-btn active" data-tab="1">📋 Printer Info</button>
            <button class="tab-btn" data-tab="2">⚙️ Hardware</button>
            <button class="tab-btn" data-tab="3">🔥 Hotend</button>
            <button class="tab-btn" data-tab="4">🛏️ Bed</button>
            <button class="tab-btn" data-tab="5">📯 Probe</button>
            <button class="tab-btn" data-tab="6">🏃 Motion</button>
            <button class="tab-btn" data-tab="7">⚡ Advanced</button>
            <button class="tab-btn" data-tab="8">🛡️ Safety</button>
            <button class="tab-btn" data-tab="9">🔧 Nozzles</button>
            <button class="tab-btn" data-tab="10">💾 Preferences</button>
          </div>
          <!-- Tab Content -->
          <div class="modal-body-enhanced" id="profileTabContent"></div>
          <!-- Footer -->
          <div class="modal-footer-enhanced">
            <button class="btn-nav" id="profilePrevTab">← Previous</button>
            <div style="display: flex; gap: 10px;">
              <button class="btn-nav" id="profileValidate">🔍 Validate</button>
              <button class="btn-nav" id="profileExport" style="background: #2196f3; color: white;">📤 Export & Share</button>
              <button class="btn-save" id="profileSave">💾 Save</button>
            </div>
            <button class="btn-nav" id="profileNextTab">Next →</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('enhancedProfileOverlay');
    // Setup event listeners
    this.setupEventListeners();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /** Setup all event listeners */
  setupEventListeners() {
    // Close button
    document.getElementById('enhancedProfileClose').addEventListener('click', () => {
      this.close();
    });
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabNum = parseInt(e.currentTarget.dataset.tab);
        this.switchTab(tabNum);
      });
    });
    // Previous/Next buttons
    document.getElementById('profilePrevTab').addEventListener('click', () => {
      if (this.currentTab > 1) {
        this.switchTab(this.currentTab - 1);
      }
    });
    document.getElementById('profileNextTab').addEventListener('click', () => {
      if (this.currentTab < 10) {
        this.switchTab(this.currentTab + 1);
      }
    });
    // Validate
    document.getElementById('profileValidate').addEventListener('click', () => {
      this.validateAll();
    });
    // Save
    document.getElementById('profileSave').addEventListener('click', () => {
      this.saveProfile();
    });
    // Export
    document.getElementById('profileExport').addEventListener('click', () => {
      this.exportForCommunity();
    });
  }

  /** Switch tab */
  switchTab(tabNum) {
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabNum}"]`).classList.add('active');
    this.currentTab = tabNum;
    this.renderCurrentTab();
    document.getElementById('profilePrevTab').disabled = (tabNum === 1);
    document.getElementById('profileNextTab').disabled = (tabNum === 10);
  }

  /** Render current tab */
  renderCurrentTab() {
    const content = document.getElementById('profileTabContent');
    switch (this.currentTab) {
      case 1: content.innerHTML = this.renderTab1_PrinterInfo(); break;
      case 2: content.innerHTML = this.renderTab2_Hardware(); break;
      case 3: content.innerHTML = this.renderTab3_Hotend(); break;
      case 4: content.innerHTML = this.renderTab4_Bed(); break;
      case 5: content.innerHTML = this.renderTab5_Probe(); break;
      case 6: content.innerHTML = this.renderTab6_Motion(); break;
      case 7: content.innerHTML = this.renderTab7_Advanced(); break;
      case 8: content.innerHTML = this.renderTab8_Safety(); break;
      case 9: content.innerHTML = this.renderTab9_Nozzles(); break;
      case 10: content.innerHTML = this.renderTab10_Preferences(); break;
    }
    this.attachInputListeners();
  }

  /** Tab 1: Printer Info */
  renderTab1_PrinterInfo() {
    return `
      <div class="tab-content">
        <h3>📋 Printer Information</h3>

        <div class="form-group">
          <label>Profile Name *</label>
          <input type="text" id="profileName" value="${this.currentProfile.name}"
            placeholder="e.g., My Ender 5 Plus" required>
        </div>

        <div class="form-group">
          <label>Printer Model</label>
          <div style="position: relative;">
            <input type="text" id="printerModelSearch" class="form-control"
              value="${this.getCurrentPrinterDisplayName()}"
              placeholder="Start typing printer name (e.g., Ender 3, Prusa MK3)..."
              autocomplete="off">
            <div id="printerSearchResults" class="autocomplete-results" style="display: none;"></div>
          </div>
          <p class="field-help">💡 Type to search from 280+ printer models. Use ↑↓ arrows to navigate, Enter to select.</p>
          <div id="selectedPrinterInfo" style="display: none; margin-top: 10px; padding: 10px; background: #e3f2fd; border-left: 3px solid #2196f3; border-radius: 4px;"></div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Firmware Type *</label>
            <select id="firmwareType">
              <option value="">Select firmware...</option>
              <option value="marlin" ${this.currentProfile.firmwareType === 'marlin' ? 'selected' : ''}>Marlin</option>
              <option value="th3d"   ${this.currentProfile.firmwareType === 'th3d' ? 'selected' : ''}>TH3D (Marlin Fork)</option>
              <option value="klipper"${this.currentProfile.firmwareType === 'klipper' ? 'selected' : ''}>Klipper</option>
              <option value="reprap" ${this.currentProfile.firmwareType === 'reprap' ? 'selected' : ''}>RepRap</option>
              <option value="smoothie"${this.currentProfile.firmwareType === 'smoothie' ? 'selected' : ''}>Smoothieware</option>
              <option value="other"  ${this.currentProfile.firmwareType === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Firmware Version</label>
            <input type="text" id="firmwareVersion" value="${this.currentProfile.firmwareVersion || ''}" placeholder="e.g., 2.0.9.3">
          </div>
        </div>

        <!-- Quick Import -->
        <div class="import-section">
          <h4>📥 Quick Import (Optional)</h4>
          <p>Import your Configuration.h or EEPROM backup to auto-fill hardware settings:</p>
          <div class="import-methods">
            <button class="btn-secondary" id="showConfigUpload">📄 Upload Configuration.h</button>
            <button class="btn-secondary" id="showM503Paste">📋 Paste M503 Output</button>
            <button class="btn-secondary" id="showEEPROMBackup">💾 EEPROM Backup</button>
          </div>
          <div id="importArea" style="display: none; margin-top: 15px;"></div>
        </div>
      </div>
    `;
  }

  /** Tab 2: Hardware Configuration */
  renderTab2_Hardware() {
    const hardware = this.currentProfile.hardware || {};
    return `
      <div class="tab-content">
        <h3>⚙️ Hardware Configuration</h3>

        <div class="form-group">
          <label>Motherboard *</label>
          <select id="hardwareBoard" class="form-control">
            <option value="">Select motherboard...</option>
            ${this.renderBoardOptions(hardware.board)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="hardwareBoardCustom" class="form-control"
            value="${hardware.board && hardware.board.startsWith('custom:') ? hardware.board.replace('custom:', '') : ''}"
            placeholder="Enter custom board name"
            style="display: none; margin-top: 10px;">
          <p class="field-help">Select your motherboard or choose "Custom" to enter manually</p>
        </div>

        <h4 style="margin-top: 25px;">Stepper Drivers</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Driver</label>
            <select id="driverX" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.x)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverXCustom" class="form-control" placeholder="Enter custom driver" style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Y-Axis Driver</label>
            <select id="driverY" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.y)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverYCustom" class="form-control" placeholder="Enter custom driver" style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Z-Axis Driver</label>
            <select id="driverZ" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.z)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverZCustom" class="form-control" placeholder="Enter custom driver" style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Extruder Driver</label>
            <select id="driverE" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.e)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverECustom" class="form-control" placeholder="Enter custom driver" style="display: none; margin-top: 5px;">
          </div>
        </div>

        <h4 style="margin-top: 25px;">Display</h4>
        <div class="form-group">
          <label>LCD/Display Type</label>
          <select id="hardwareDisplay" class="form-control">
            <option value="">Select display...</option>
            ${this.renderDisplayOptions(hardware.display)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="hardwareDisplayCustom" class="form-control" placeholder="Enter custom display" style="display: none; margin-top: 10px;">
        </div>
      </div>
    `;
  }

  /** Render board options */
  renderBoardOptions(selectedBoard) {
    EnhancedPrinterProfiles.log('🔎 renderBoardOptions called');
    EnhancedPrinterProfiles.log('📊 databases object:', this.databases);
    EnhancedPrinterProfiles.log('📊 marlin-boards exists?', !!this.databases['marlin-boards']);
    EnhancedPrinterProfiles.log('📊 boards array:', this.databases['marlin-boards']?.boards);
    if (!this.databases['marlin-boards']) {
      EnhancedPrinterProfiles.log('❌ No marlin-boards database found!');
      return '';
    }
    EnhancedPrinterProfiles.log('✅ Rendering', this.databases['marlin-boards'].boards.length, 'boards');
    return this.databases['marlin-boards'].boards.map(board => {
      const selected = selectedBoard === board.id ? 'selected' : '';
      return `<option value="${board.id}" ${selected}>${board.name} (${board.mcu})</option>`;
    }).join('');
  }

  /** Render driver options */
  renderDriverOptions(selectedDriver) {
    if (!this.databases['stepper-drivers']) return '';
    return this.databases['stepper-drivers'].drivers.map(driver => {
      const selected = selectedDriver === driver.id ? 'selected' : '';
      return `<option value="${driver.id}" ${selected}>${driver.name}</option>`;
    }).join('');
  }

  /** Render thermistor options */
  renderThermistorOptions(selectedThermistor) {
    if (!this.databases['thermistors']) return '';
    return this.databases['thermistors'].thermistors.map(therm => {
      const selected = selectedThermistor === therm.id ? 'selected' : '';
      return `<option value="${therm.id}" ${selected}>${therm.name}</option>`;
    }).join('');
  }

  /** Render display options */
  renderDisplayOptions(selectedDisplay) {
    if (!this.databases['displays']) return '';
    return this.databases['displays'].displays.map(display => {
      const selected = selectedDisplay === display.id ? 'selected' : '';
      return `<option value="${display.id}" ${selected}>${display.name}</option>`;
    }).join('');
  }

  /** Render hotend options */
  renderHotendOptions(selectedHotend) {
    if (!this.databases['Hotends']) return '';
    return this.databases['Hotends'].hotends.map(hotend => {
      const selected = selectedHotend === hotend.id ? 'selected' : '';
      return `<option value="${hotend.id}" ${selected}>${hotend.name} (${hotend.category})</option>`;
    }).join('');
  }

  /** Render probe options */
  renderProbeOptions(selectedProbe) {
    if (!this.databases['bed-probes']) return '';
    return this.databases['bed-probes'].probes.map(probe => {
      const selected = selectedProbe === probe.id ? 'selected' : '';
      return `<option value="${probe.id}" ${selected}>${probe.name}</option>`;
    }).join('');
  }

  /** Render heater cartridge options */
  renderHeaterOptions(selectedHeater) {
    if (!this.databases['heaters']) return '';
    return this.databases['heaters'].hotendHeaters.map(heater => {
      const selected = selectedHeater === heater.id ? 'selected' : '';
      return `<option value="${heater.id}" ${selected}>${heater.name} (${heater.wattage}W ${heater.voltage}V)</option>`;
    }).join('');
  }

  /** Get current printer display name */
  getCurrentPrinterDisplayName() {
    if (!this.currentProfile.printerModel) return '';
    if (this.databases['printer-profiles'] && this.databases['printer-profiles'].printers) {
      const printer = this.databases['printer-profiles'].printers.find(p => p.id === this.currentProfile.printerModel);
      if (printer) return printer.name;
    }
    return this.currentProfile.printerModel;
  }

  /** Setup autocomplete for printer search */
  setupPrinterAutocomplete() {
    const searchInput = document.getElementById('printerModelSearch');
    const resultsDiv = document.getElementById('printerSearchResults');
    const infoDiv = document.getElementById('selectedPrinterInfo');
    if (!searchInput || !resultsDiv) return;

    let currentIndex = -1;
    let filteredPrinters = [];

    const searchPrinters = (query) => {
      if (!this.databases['printer-profiles']) return [];
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) return [];
      return this.databases['printer-profiles'].printers
        .filter(p => !p._section && p.name)
        .filter(p => p.name.toLowerCase().includes(lowerQuery)
          || p.manufacturer?.toLowerCase().includes(lowerQuery)
          || p.id?.toLowerCase().includes(lowerQuery))
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
      const printer = this.databases['printer-profiles'].printers.find(p => p.id === printerId);
      if (!printer) return;
      this.currentProfile.printerModel = printer.id;
      this.currentProfile.modified = new Date().toISOString();
      searchInput.value = printer.name;
      resultsDiv.style.display = 'none';
      currentIndex = -1;
      this.showPrinterInfo(printer);
      this.autofillFromPrinterDatabase(printer);
    };

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length < 2) {
        resultsDiv.style.display = 'none';
        infoDiv.style.display = 'none';
        return;
      }
      filteredPrinters = searchPrinters(query);
      currentIndex = -1;
      renderResults(filteredPrinters);
    });

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

    resultsDiv.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (item && item.dataset.printerId) {
        selectPrinter(item.dataset.printerId);
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.style.display = 'none';
      }
    });
  }

  /** Show printer info card */
  showPrinterInfo(printer) {
    const infoDiv = document.getElementById('selectedPrinterInfo');
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
  }

  /** Auto-fill hardware from printer database */
  autofillFromPrinterDatabase(printer) {
    EnhancedPrinterProfiles.log('✨ Auto-filling hardware from printer database:', printer.name);
    // Auto-fill board
    if (printer.stockBoard && this.databases['marlin-boards']) {
      const board = this.databases['marlin-boards'].boards.find(b => b.id === printer.stockBoard);
      if (board) {
        this.currentProfile.hardware.board = printer.stockBoard;
        EnhancedPrinterProfiles.log(' ✅ Board:', printer.stockBoard);
        this.autofillDrivers(board);
      }
    }
    // Hotend
    if (printer.stockHotend && this.databases['Hotends']) {
      const hotend = this.databases['Hotends'].hotends.find(h => h.id === printer.stockHotend);
      if (hotend) {
        this.currentProfile.hotendType = printer.stockHotend;
        EnhancedPrinterProfiles.log(' ✅ Hotend:', printer.stockHotend);
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
        if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
        if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};
        if (hotend.thermistor) {
          this.currentProfile.hardware.thermistors.hotend = hotend.thermistor.toString();
          EnhancedPrinterProfiles.log(' ✅ Thermistor:', hotend.thermistor);
        }
        if (hotend.maxTemp) {
          this.currentProfile.temperature.hotend.max = hotend.maxTemp;
          EnhancedPrinterProfiles.log(' ✅ Max Temp:', hotend.maxTemp, '°C');
        }
      }
    }
    // Display
    if (printer.stockDisplay && this.databases['displays']) {
      const display = this.databases['displays'].displays.find(d => d.id === printer.stockDisplay);
      if (display) {
        this.currentProfile.hardware.display = printer.stockDisplay;
        EnhancedPrinterProfiles.log(' ✅ Display:', printer.stockDisplay);
      }
    }
    // Bed size
    if (printer.bedSize) {
      if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
      this.currentProfile.bedSize.x = printer.bedSize.x;
      this.currentProfile.bedSize.y = printer.bedSize.y;
      this.currentProfile.bedSize.z = printer.bedSize.z;
      EnhancedPrinterProfiles.log(' ✅ Bed size:', printer.bedSize);
    }
    // Bed type
    if (printer.bedType) {
      if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
      this.currentProfile.temperature.bedType = printer.bedType;
      EnhancedPrinterProfiles.log(' ✅ Bed type:', printer.bedType);
    }
    // Probe type
    if (printer.stockProbe && printer.stockProbe !== null) {
      if (!this.currentProfile.probe) this.currentProfile.probe = { offsets: { x: 0, y: 0, z: 0 } };
      this.currentProfile.probe.type = printer.stockProbe;
      EnhancedPrinterProfiles.log(' ✅ Probe:', printer.stockProbe);
    }
    // Extruder type
    if (printer.extruderType) {
      this.currentProfile.extruderType = printer.extruderType;
      EnhancedPrinterProfiles.log(' ✅ Extruder type:', printer.extruderType);
    }
    setTimeout(() => this.renderCurrentTab(), 100);
  }

  /** Tab 3: Hotend & Extruder */
  renderTab3_Hotend() {
    const temp = this.currentProfile.temperature?.hotend || { max: 275, pid: { p: 0, i: 0, d: 0 } };
    const motion = this.currentProfile.motion || {};
    return `
      <div class="tab-content">
        <h3>🔥 Hotend & Extruder Configuration</h3>

        <h4>Hotend Type</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Hotend Model *</label>
            <select id="hotendType" class="form-control">
              <option value="">Select hotend...</option>
              ${this.renderHotendOptions(this.currentProfile.hotendType)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="hotendTypeCustom" class="form-control"
              value="${this.currentProfile.hotendType && this.currentProfile.hotendType.startsWith('custom:') ? this.currentProfile.hotendType.replace('custom:', '') : ''}"
              placeholder="Enter custom hotend"
              style="display: ${this.currentProfile.hotendType && this.currentProfile.hotendType.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          </div>

          <div class="form-group">
            <label>Max Temperature (°C) *</label>
            <input type="number" id="hotendMaxTemp" value="${temp.max}" min="200" max="500">
          </div>

          <div class="form-group">
            <label>Heater Cartridge</label>
            <select id="hotendHeater" class="form-control">
              <option value="">Select heater...</option>
              ${this.renderHeaterOptions(this.currentProfile.hotendHeater)}
            </select>
            <p class="field-help">Heater wattage affects heat-up speed</p>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="highFlowHotend" ${this.currentProfile.highFlowHotend ? 'checked' : ''} style="width: auto; margin-right: 10px;">
              High Flow Hotend
            </label>
            <p class="field-help">CHT, Volcano, or other high-flow hotend</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Hotend Thermistor</h4>
        <div class="form-group">
          <label>Thermistor Type *</label>
          <select id="thermistorHotend" class="form-control">
            <option value="">Select thermistor...</option>
            ${this.renderThermistorOptions(this.currentProfile.hardware?.thermistors?.hotend)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="thermistorHotendCustom" class="form-control" placeholder="Enter custom thermistor" style="display: none; margin-top: 5px;">
        </div>

        <h4 style="margin-top: 25px;">PID Tuning (Hotend)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>P (Proportional)</label>
            <input type="number" id="hotendPidP" value="${temp.pid?.p || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>I (Integral)</label>
            <input type="number" id="hotendPidI" value="${temp.pid?.i || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>D (Derivative)</label>
            <input type="number" id="hotendPidD" value="${temp.pid?.d || 0}" step="0.01">
          </div>
        </div>
        <p class="field-help">💡 Run PID autotune: M303 E0 S220 C8 U1</p>

        <h4 style="margin-top: 25px;">Extruder Configuration</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Extruder Type *</label>
            <select id="extruderType" class="form-control">
              <option value="direct">Direct Drive</option>
              <option value="bowden">Bowden</option>
            </select>
          </div>
          <div class="form-group">
            <label>E-Steps/mm *</label>
            <input type="number" id="esteps" value="${motion.steps?.e || 93}" step="0.1">
            <p class="field-help">📐 Use E-Steps Calculator to calibrate</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Extrusion Limits</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Max Feedrate (mm/s)</label>
            <input type="number" id="maxFeedrateE" value="${motion.maxFeedrates?.e || 25}">
          </div>
          <div class="form-group">
            <label>Max Acceleration (mm/s²)</label>
            <input type="number" id="maxAccelE" value="${motion.maxAccel?.e || 5000}">
          </div>
        </div>
      </div>
    `;
  }

  /** Tab 4: Bed Configuration */
  renderTab4_Bed() {
    const temp = this.currentProfile.temperature?.bed || { max: 110, pid: { p: 0, i: 0, d: 0 } };
    return `
      <div class="tab-content">
        <h3>🛏️ Bed Configuration</h3>

        <h4>Bed Specifications</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Bed Type</label>
            <select id="bedType" class="form-control">
              <option value="">Select bed type...</option>
              <option value="aluminum" ${this.currentProfile.temperature?.bedType === 'aluminum' ? 'selected' : ''}>Standard Aluminum</option>
              <option value="glass"    ${this.currentProfile.temperature?.bedType === 'glass' ? 'selected' : ''}>Glass Bed</option>
              <option value="pei"      ${this.currentProfile.temperature?.bedType === 'pei' ? 'selected' : ''}>PEI Sheet</option>
              <option value="magnetic" ${this.currentProfile.temperature?.bedType === 'magnetic' ? 'selected' : ''}>Magnetic</option>
              <option value="spring-steel" ${this.currentProfile.temperature?.bedType === 'spring-steel' ? 'selected' : ''}>Spring Steel</option>
              <option value="ultrabase" ${this.currentProfile.temperature?.bedType === 'ultrabase' ? 'selected' : ''}>Ultrabase</option>
              <option value="buildtak"  ${this.currentProfile.temperature?.bedType === 'buildtak' ? 'selected' : ''}>BuildTak</option>
              <option value="carborundum" ${this.currentProfile.temperature?.bedType === 'carborundum' ? 'selected' : ''}>Carborundum</option>
              <option value="custom"    ${this.currentProfile.temperature?.bedType === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>
          <div class="form-group">
            <label>Max Temperature (°C) *</label>
            <input type="number" id="bedMaxTemp" value="${temp.max}" min="60" max="150">
          </div>
        </div>

        <h4 style="margin-top: 25px;">Bed Thermistor</h4>
        <div class="form-group">
          <label>Thermistor Type</label>
          <select id="thermistorBed" class="form-control">
            <option value="">Select thermistor...</option>
            ${this.renderThermistorOptions(this.currentProfile.hardware?.thermistors?.bed)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="thermistorBedCustom" class="form-control" placeholder="Enter custom thermistor" style="display: none; margin-top: 5px;">
        </div>

        <h4 style="margin-top: 25px;">PID Tuning (Bed)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>P (Proportional)</label>
            <input type="number" id="bedPidP" value="${temp.pid?.p || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>I (Integral)</label>
            <input type="number" id="bedPidI" value="${temp.pid?.i || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>D (Derivative)</label>
            <input type="number" id="bedPidD" value="${temp.pid?.d || 0}" step="0.01">
          </div>
        </div>
        <p class="field-help">💡 Run PID autotune: M303 E-1 S60 C8 U1</p>

        <h4 style="margin-top: 25px;">Bed Size</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Width (X) mm</label>
            <input type="number" id="bedSizeX" value="${this.currentProfile.bedSize?.x || 220}" min="100" max="500">
          </div>
          <div class="form-group">
            <label>Depth (Y) mm</label>
            <input type="number" id="bedSizeY" value="${this.currentProfile.bedSize?.y || 220}" min="100" max="500">
          </div>
          <div class="form-group">
            <label>Height (Z) mm</label>
            <input type="number" id="bedSizeZ" value="${this.currentProfile.bedSize?.z || 250}" min="100" max="600">
          </div>
        </div>
      </div>
    `;
  }

  /** Tab 5: Probe & Leveling */
  renderTab5_Probe() {
    const probe = this.currentProfile.probe || { type: 'none', offsets: { x: 0, y: 0, z: 0 } };
    const bedLeveling = this.currentProfile.bedLeveling || { type: 'none', gridPoints: { x: 3, y: 3 }, fadeHeight: 0 };
    return `
      <div class="tab-content">
        <h3>📯 Probe & Leveling Configuration</h3>

        <h4>Probe Type</h4>
        <div class="form-group">
          <label>Probe/Z-Endstop Type *</label>
          <select id="probeType" class="form-control">
            ${this.renderProbeOptions(probe.type)}
            <option value="__custom__" ${probe.type && probe.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
          </select>
          <input type="text" id="probeTypeCustom" class="form-control"
            value="${probe.type && probe.type.startsWith('custom:') ? probe.type.replace('custom:', '') : ''}"
            placeholder="Enter custom probe type"
            style="display: ${probe.type && probe.type.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          <p class="field-help">Select your probe type or choose "Custom" to specify</p>
        </div>

        <div id="probeSettings" style="display: ${probe.type !== 'none' ? 'block' : 'none'};">
          <h4 style="margin-top: 25px;">Probe Offsets</h4>
          <div class="form-row">
            <div class="form-group">
              <label>X Offset (mm)</label>
              <input type="number" id="probeOffsetX" value="${probe.offsets?.x || 0}" step="0.1">
              <p class="field-help">Negative if left of nozzle</p>
            </div>
            <div class="form-group">
              <label>Y Offset (mm)</label>
              <input type="number" id="probeOffsetY" value="${probe.offsets?.y || 0}" step="0.1">
              <p class="field-help">Negative if in front of nozzle</p>
            </div>
            <div class="form-group">
              <label>Z Offset (mm)</label>
              <input type="number" id="probeOffsetZ" value="${probe.offsets?.z || 0}" step="0.01">
              <p class="field-help">Use Z-Offset Calibration tool</p>
            </div>
          </div>

          <h4 style="margin-top: 25px;">Bed Leveling Method</h4>
          <div class="form-group">
            <label>Leveling System *</label>
            <select id="bedLevelingType" class="form-control">
              <option value="none" ${bedLeveling.type === 'none' ? 'selected' : ''}>None (Manual Leveling)</option>
              <option value="abl"  ${bedLeveling.type === 'abl' ? 'selected' : ''}>Auto Bed Leveling (ABL)</option>
              <option value="ubl"  ${bedLeveling.type === 'ubl' ? 'selected' : ''}>Unified Bed Leveling (UBL)</option>
              <option value="mbl"  ${bedLeveling.type === 'mbl' ? 'selected' : ''}>Manual Bed Leveling (MBL)</option>
              <option value="mesh" ${bedLeveling.type === 'mesh' ? 'selected' : ''}>Mesh Bed Leveling</option>
              <option value="__custom__" ${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
            </select>
            <input type="text" id="bedLevelingTypeCustom" class="form-control"
              value="${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? bedLeveling.type.replace('custom:', '') : ''}"
              placeholder="Enter custom leveling type"
              style="display: ${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          </div>

          <div id="meshSettings" style="display: ${bedLeveling.type !== 'none' ? 'block' : 'none'};">
            <h4 style="margin-top: 25px;">Mesh Configuration</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Grid Points X</label>
                <input type="number" id="gridPointsX" value="${bedLeveling.gridPoints?.x || 3}" min="3" max="15">
                <p class="field-help">3-5 typical, 7+ for UBL</p>
              </div>
              <div class="form-group">
                <label>Grid Points Y</label>
                <input type="number" id="gridPointsY" value="${bedLeveling.gridPoints?.y || 3}" min="3" max="15">
                <p class="field-help">3-5 typical, 7+ for UBL</p>
              </div>
              <div class="form-group">
                <label>Fade Height (mm)</label>
                <input type="number" id="fadeHeight" value="${bedLeveling.fadeHeight || 0}" step="0.1" min="0">
                <p class="field-help">0 = disabled, 10mm typical</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /** Tab 6: Motion Settings */
  renderTab6_Motion() {
    const motion = this.currentProfile.motion || {
      steps: { x: 80, y: 80, z: 400, e: 93 },
      maxFeedrates: { x: 500, y: 500, z: 5, e: 25 },
      maxAccel: { x: 500, y: 500, z: 100, e: 5000 },
      jerk: { x: 8, y: 8, z: 0.4, e: 5 }
    };
    return `
      <div class="tab-content">
        <h3>🏃 Motion Settings</h3>

        <h4>Steps per mm</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Steps/mm *</label>
            <input type="number" id="stepsX" value="${motion.steps?.x || 80}" step="0.01">
            <p class="field-help">80 typical for belts</p>
          </div>
          <div class="form-group">
            <label>Y-Axis Steps/mm *</label>
            <input type="number" id="stepsY" value="${motion.steps?.y || 80}" step="0.01">
            <p class="field-help">80 typical for belts</p>
          </div>
          <div class="form-group">
            <label>Z-Axis Steps/mm *</label>
            <input type="number" id="stepsZ" value="${motion.steps?.z || 400}" step="0.01">
            <p class="field-help">400 typical for leadscrews</p>
          </div>
          <div class="form-group">
            <label>E-Axis Steps/mm *</label>
            <input type="number" id="stepsE" value="${motion.steps?.e || 93}" step="0.1">
            <p class="field-help">Use E-Steps Calculator</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Maximum Feedrates (mm/s)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Max Speed</label>
            <input type="number" id="maxFeedrateX" value="${motion.maxFeedrates?.x || 500}" step="1">
            <p class="field-help">300-500 typical</p>
          </div>
          <div class="form-group">
            <label>Y-Axis Max Speed</label>
            <input type="number" id="maxFeedrateY" value="${motion.maxFeedrates?.y || 500}" step="1">
            <p class="field-help">300-500 typical</p>
          </div>
          <div class="form-group">
            <label>Z-Axis Max Speed</label>
            <input type="number" id="maxFeedrateZ" value="${motion.maxFeedrates?.z || 5}" step="0.1">
            <p class="field-help">5-10 typical</p>
          </div>
          <div class="form-group">
            <label>E-Axis Max Speed</label>
            <input type="number" id="maxFeedrateE" value="${motion.maxFeedrates?.e || 25}" step="1">
            <p class="field-help">25-50 typical</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Maximum Acceleration (mm/s²)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Accel</label>
            <input type="number" id="maxAccelX" value="${motion.maxAccel?.x || 500}" step="10">
            <p class="field-help">500-3000 typical</p>
          </div>
          <div class="form-group">
            <label>Y-Axis Accel</label>
            <input type="number" id="maxAccelY" value="${motion.maxAccel?.y || 500}" step="10">
            <p class="field-help">500-3000 typical</p>
          </div>
          <div class="form-group">
            <label>Z-Axis Accel</label>
            <input type="number" id="maxAccelZ" value="${motion.maxAccel?.z || 100}" step="10">
            <p class="field-help">100-500 typical</p>
          </div>
          <div class="form-group">
            <label>E-Axis Accel</label>
            <input type="number" id="maxAccelE" value="${motion.maxAccel?.e || 5000}" step="100">
            <p class="field-help">5000-10000 typical</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Jerk Settings (mm/s)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Jerk</label>
            <input type="number" id="jerkX" value="${motion.jerk?.x || 8}" step="0.1">
            <p class="field-help">8-10 typical</p>
          </div>
          <div class="form-group">
            <label>Y-Axis Jerk</label>
            <input type="number" id="jerkY" value="${motion.jerk?.y || 8}" step="0.1">
            <p class="field-help">8-10 typical</p>
          </div>
          <div class="form-group">
            <label>Z-Axis Jerk</label>
            <input type="number" id="jerkZ" value="${motion.jerk?.z || 0.4}" step="0.1">
            <p class="field-help">0.3-0.4 typical</p>
          </div>
          <div class="form-group">
            <label>E-Axis Jerk</label>
            <input type="number" id="jerkE" value="${motion.jerk?.e || 5}" step="0.1">
            <p class="field-help">5-10 typical</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Travel Acceleration</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Print Acceleration (mm/s²)</label>
            <input type="number" id="printAccel" value="${motion.printAccel || 500}" step="10">
            <p class="field-help">Acceleration during printing</p>
          </div>
          <div class="form-group">
            <label>Retract Acceleration (mm/s²)</label>
            <input type="number" id="retractAccel" value="${motion.retractAccel || 1000}" step="10">
            <p class="field-help">Extruder retraction speed</p>
          </div>
          <div class="form-group">
            <label>Travel Acceleration (mm/s²)</label>
            <input type="number" id="travelAccel" value="${motion.travelAccel || 1000}" step="10">
            <p class="field-help">Non-printing moves</p>
          </div>
        </div>
      </div>
    `;
  }

  /** Tab 7: Advanced Features */
  renderTab7_Advanced() {
    const advanced = this.currentProfile.advanced || {
      linearAdvance: { enabled: false, k: 0 },
      arcSupport: false,
      junctionDeviation: { enabled: false, value: 0.005 }
    };
    return `
      <div class="tab-content">
        <h3>⚡ Advanced Features</h3>

        <h4>Linear Advance (Pressure Advance)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Linear Advance Type</label>
            <select id="linearAdvanceType" class="form-control">
              <option value="none" ${!advanced.linearAdvance?.enabled ? 'selected' : ''}>Disabled</option>
              <option value="marlin" ${advanced.linearAdvance?.type === 'marlin' ? 'selected' : ''}>Marlin Linear Advance</option>
              <option value="klipper" ${advanced.linearAdvance?.type === 'klipper' ? 'selected' : ''}>Klipper Pressure Advance</option>
              <option value="reprap" ${advanced.linearAdvance?.type === 'reprap' ? 'selected' : ''}>RepRap Firmware</option>
              <option value="__custom__" ${advanced.linearAdvance?.type && advanced.linearAdvance.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
            </select>
            <input type="text" id="linearAdvanceTypeCustom" class="form-control" placeholder="Enter custom LA type" style="display: none; margin-top: 10px;">
          </div>
          <div class="form-group">
            <label>K Factor / PA Value</label>
            <input type="number" id="linearAdvanceK" value="${advanced.linearAdvance?.k || 0}" step="0.001" min="0">
            <p class="field-help">0 = disabled, 0.05-0.15 typical for Marlin, 0.05-0.5 for Klipper</p>
          </div>
        </div>
        <p class="field-help">💡 Use Pressure Advance Calibration tool to find optimal value</p>

        <h4 style="margin-top: 25px;">Arc Support (G2/G3)</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="arcSupport" ${advanced.arcSupport ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Enable Arc Welder / G2/G3 Commands
          </label>
          <p class="field-help">Smooths curved paths, reduces file size. Requires ARC_SUPPORT in firmware.</p>
        </div>

        <h4 style="margin-top: 25px;">Junction Deviation</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Junction Deviation Mode</label>
            <select id="junctionDeviationMode" class="form-control">
              <option value="classic" ${!advanced.junctionDeviation?.enabled ? 'selected' : ''}>Classic Jerk</option>
              <option value="junction" ${advanced.junctionDeviation?.enabled ? 'selected' : ''}>Junction Deviation</option>
            </select>
            <p class="field-help">Modern firmwares prefer Junction Deviation</p>
          </div>
          <div class="form-group">
            <label>Junction Deviation Value</label>
            <input type="number" id="junctionDeviationValue" value="${advanced.junctionDeviation?.value || 0.005}" step="0.001" min="0">
            <p class="field-help">0.005-0.020 typical, higher = faster corners</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Input Shaping (Resonance Compensation)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Input Shaping</label>
            <select id="inputShaping" class="form-control">
              <option value="none" ${!advanced.inputShaping?.enabled ? 'selected' : ''}>Disabled</option>
              <option value="klipper" ${advanced.inputShaping?.type === 'klipper' ? 'selected' : ''}>Klipper Input Shaper</option>
              <option value="marlin" ${advanced.inputShaping?.type === 'marlin' ? 'selected' : ''}>Marlin Input Shaping</option>
              <option value="__custom__" ${advanced.inputShaping?.type && advanced.inputShaping.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
            </select>
            <input type="text" id="inputShapingCustom" class="form-control" placeholder="Enter custom input shaping" style="display: none; margin-top: 10px;">
          </div>
          <div class="form-group">
            <label>Shaper Type</label>
            <select id="shaperType" class="form-control">
              <option value="">Not configured</option>
              <option value="mzv" ${advanced.inputShaping?.shaperType === 'mzv' ? 'selected' : ''}>MZV (Most Common)</option>
              <option value="ei" ${advanced.inputShaping?.shaperType === 'ei' ? 'selected' : ''}>EI (Extra Smooth)</option>
              <option value="2hump_ei" ${advanced.inputShaping?.shaperType === '2hump_ei' ? 'selected' : ''}>2HUMP_EI</option>
              <option value="3hump_ei" ${advanced.inputShaping?.shaperType === '3hump_ei' ? 'selected' : ''}>3HUMP_EI</option>
              <option value="zv" ${advanced.inputShaping?.shaperType === 'zv' ? 'selected' : ''}>ZV (Fast)</option>
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="shaperTypeCustom" class="form-control" placeholder="Enter custom shaper" style="display: none; margin-top: 10px;">
          </div>
        </div>

        <h4 style="margin-top: 25px;">Filament Runout Sensor</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Runout Sensor Type</label>
            <select id="runoutSensorType" class="form-control">
              <option value="none" ${!advanced.runoutSensor?.enabled ? 'selected' : ''}>None / Disabled</option>
              <option value="mechanical" ${advanced.runoutSensor?.type === 'mechanical' ? 'selected' : ''}>Mechanical Switch</option>
              <option value="encoder" ${advanced.runoutSensor?.type === 'encoder' ? 'selected' : ''}>Encoder / Smart Sensor</option>
              <option value="optical" ${advanced.runoutSensor?.type === 'optical' ? 'selected' : ''}>Optical Sensor</option>
              <option value="__custom__" ${advanced.runoutSensor?.type && advanced.runoutSensor.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
            </select>
            <input type="text" id="runoutSensorTypeCustom" class="form-control" placeholder="Enter custom sensor type" style="display: none; margin-top: 10px;">
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="runoutInverted" ${advanced.runoutSensor?.inverted ? 'checked' : ''} style="width: auto; margin-right: 10px;">
              Inverted Logic
            </label>
            <p class="field-help">Check if sensor triggers LOW when filament present</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Other Features</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="autoReportTemp" ${advanced.autoReportTemp ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Auto Report Temperatures
          </label>
          <p class="field-help">Firmware periodically reports temps without polling</p>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="sdCardSupport" ${advanced.sdCardSupport ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            SD Card Support
          </label>
          <p class="field-help">Print from SD card</p>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="eepromSupport" ${advanced.eepromSupport ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            EEPROM Settings Storage
          </label>
          <p class="field-help">Save settings with M500</p>
        </div>
      </div>
    `;
  }

  /** Tab 8: Safety */
  renderTab8_Safety() {
    const safety = this.currentProfile.safety || {
      thermalProtection: { hotend: true, bed: true },
      runaway: { enabled: true, period: 40, hysteresis: 4 }
    };
    return `
      <div class="tab-content">
        <h3>🛡️ Safety Features</h3>

        <h4>Thermal Runaway Protection</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="thermalProtectionHotend" ${safety.thermalProtection?.hotend ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Enable Hotend Thermal Runaway Protection
          </label>
          <p class="field-help">⚠️ CRITICAL: Prevents fire if heater fails. Should always be enabled!</p>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="thermalProtectionBed" ${safety.thermalProtection?.bed ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Enable Bed Thermal Runaway Protection
          </label>
          <p class="field-help">⚠️ CRITICAL: Prevents fire if bed heater fails. Should always be enabled!</p>
        </div>

        <h4 style="margin-top: 25px;">Thermal Runaway Parameters</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Watch Period (seconds)</label>
            <input type="number" id="runawayPeriod" value="${safety.runaway?.period || 40}" min="10" max="120">
            <p class="field-help">Time to reach target temp (40s typical)</p>
          </div>
          <div class="form-group">
            <label>Hysteresis (°C)</label>
            <input type="number" id="runawayHysteresis" value="${safety.runaway?.hysteresis || 4}" min="1" max="20">
            <p class="field-help">Temp must stay within ±°C (4°C typical)</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Min/Max Temperature Safety</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Hotend Min Temp (°C)</label>
            <input type="number" id="hotendMinTemp" value="${safety.hotendMinTemp || 5}" min="-20" max="50">
            <p class="field-help">Below this triggers error (5°C typical)</p>
          </div>
          <div class="form-group">
            <label>Hotend Max Temp (°C)</label>
            <input type="number" id="hotendMaxTempSafety" value="${safety.hotendMaxTemp || 275}" min="200" max="500">
            <p class="field-help">Above this triggers error</p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Bed Min Temp (°C)</label>
            <input type="number" id="bedMinTemp" value="${safety.bedMinTemp || 5}" min="-20" max="50">
            <p class="field-help">Below this triggers error (5°C typical)</p>
          </div>
          <div class="form-group">
            <label>Bed Max Temp (°C)</label>
            <input type="number" id="bedMaxTempSafety" value="${safety.bedMaxTemp || 110}" min="60" max="150">
            <p class="field-help">Above this triggers error</p>
          </div>
        </div>

        <h4 style="margin-top: 25px;">Extrusion Safety</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Min Extrusion Temp (°C)</label>
            <input type="number" id="minExtrusionTemp" value="${safety.minExtrusionTemp || 170}" min="150" max="200">
            <p class="field-help">Prevents cold extrusion (170°C typical)</p>
          </div>
          <div class="form-group">
            <label>Max Extrusion Length (mm)</label>
            <input type="number" id="maxExtrusionLength" value="${safety.maxExtrusionLength || 200}" min="50" max="500">
            <p class="field-help">Prevents extruder grinding (200mm typical)</p>
          </div>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="preventColdExtrusion" ${safety.preventColdExtrusion !== false ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Prevent Cold Extrusion
          </label>
          <p class="field-help">Block extrusion below minimum temp (recommended)</p>
        </div>

        <h4 style="margin-top: 25px;">Power Loss Recovery</h4>
        <div class="form-group">
          <label>Power Loss Recovery</label>
          <select id="powerLossRecovery" class="form-control">
            <option value="none" ${!safety.powerLossRecovery?.enabled ? 'selected' : ''}>Disabled</option>
            <option value="basic" ${safety.powerLossRecovery?.type === 'basic' ? 'selected' : ''}>Basic Recovery</option>
            <option value="advanced" ${safety.powerLossRecovery?.type === 'advanced' ? 'selected' : ''}>Advanced (with Z-raise)</option>
            <option value="__custom__" ${safety.powerLossRecovery?.type && safety.powerLossRecovery.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
          </select>
          <input type="text" id="powerLossRecoveryCustom" class="form-control" placeholder="Enter custom recovery type" style="display: none; margin-top: 10px;">
          <p class="field-help">Resume print after power outage (requires SD card)</p>
        </div>

        <h4 style="margin-top: 25px;">Homing Safety</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="noMovesBeforeHoming" ${safety.noMovesBeforeHoming !== false ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Require Homing Before Movement
          </label>
          <p class="field-help">Prevents movement until all axes are homed (recommended)</p>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="softwareEndstops" ${safety.softwareEndstops !== false ? 'checked' : ''} style="width: auto; margin-right: 10px;">
            Software Endstops
          </label>
          <p class="field-help">Prevents movement beyond build volume (recommended)</p>
        </div>
      </div>
    `;
  }

  /** Tab 9: Nozzles */
  renderTab9_Nozzles() {
    const nozzles = this.currentProfile.nozzles || [];
    return `
      <div class="tab-content">
        <h3>🔧 Nozzle Inventory</h3>
        <p>Track your nozzle collection for quick profile creation</p>

        <div class="nozzle-list" id="nozzleList">
          ${nozzles.length > 0 ? this.renderNozzleList(nozzles) : '<p class="note">No nozzles added yet. Click "Add Nozzle" to start your inventory.</p>'}
        </div>

        <button class="btn-primary" id="addNozzleBtn" style="margin-top: 15px;">➕ Add Nozzle</button>

        <div id="nozzleForm" style="display: none; margin-top: 20px; padding: 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px;">
          <h4>Add/Edit Nozzle</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Nozzle Size (mm) *</label>
              <input type="number" id="nozzleSize" step="0.1" placeholder="0.4" required>
            </div>
            <div class="form-group">
              <label>Material *</label>
              <select id="nozzleMaterial" class="form-control">
                <option value="">Select material...</option>
                <option value="brass">Brass</option>
                <option value="hardened-steel">Hardened Steel</option>
                <option value="stainless-steel">Stainless Steel</option>
                <option value="ruby">Ruby Tip</option>
                <option value="tungsten">Tungsten Carbide</option>
                <option value="plated-copper">Plated Copper</option>
                <option value="__custom__">🔧 Custom / Other...</option>
              </select>
              <input type="text" id="nozzleMaterialCustom" class="form-control" placeholder="Enter custom material" style="display: none; margin-top: 10px;">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Brand/Manufacturer</label>
              <select id="nozzleBrand" class="form-control">
                <option value="">Select brand...</option>
                <option value="e3d">E3D</option>
                <option value="microswiss">Micro Swiss</option>
                <option value="creality">Creality</option>
                <option value="phaetus">Phaetus</option>
                <option value="slice">Slice Engineering</option>
                <option value="trianglelab">TriangleLab</option>
                <option value="nozzle-x">Nozzle X</option>
                <option value="__custom__">🔧 Custom / Other...</option>
              </select>
              <input type="text" id="nozzleBrandCustom" class="form-control" placeholder="Enter custom brand" style="display: none; margin-top: 10px;">
            </div>
            <div class="form-group">
              <label>Thread Type</label>
              <select id="nozzleThread" class="form-control">
                <option value="">Select thread...</option>
                <option value="mk8">MK8 (M6)</option>
                <option value="v6">V6 (M6 long thread)</option>
                <option value="volcano">Volcano</option>
                <option value="mk10">MK10</option>
                <option value="__custom__">🔧 Custom / Other...</option>
              </select>
              <input type="text" id="nozzleThreadCustom" class="form-control" placeholder="Enter custom thread" style="display: none; margin-top: 10px;">
            </div>
          </div>

          <div class="form-group">
            <label>Condition</label>
            <select id="nozzleCondition" class="form-control">
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="worn">Worn (replace soon)</option>
              <option value="damaged">Damaged/Clogged</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notes (optional)</label>
            <textarea id="nozzleNotes" rows="2" placeholder="e.g., For abrasive filaments only, prints PLA well"></textarea>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-primary" id="saveNozzleBtn">💾 Save Nozzle</button>
            <button class="btn-secondary" id="cancelNozzleBtn">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  /** Render nozzle list */
  renderNozzleList(nozzles) {
    return `
      <div style="display: grid; gap: 10px;">
        ${nozzles.map((nozzle, index) => `
          <div class="nozzle-item" style="padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--background);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: 1.1em;">${nozzle.size}mm ${nozzle.material || 'Nozzle'}</strong>
                ${nozzle.brand ? `<span style="color: var(--text-secondary);"> - ${nozzle.brand}</span>` : ''}
                <br>
                <small style="color: var(--text-secondary);">
                  ${nozzle.thread ? `Thread: ${nozzle.thread} ` : ''}
                  Condition: <span style="color: ${this.getNozzleConditionColor(nozzle.condition)}">${nozzle.condition || 'unknown'}</span>
                </small>
                ${nozzle.notes ? `<br><small style="color: var(--text-secondary); font-style: italic;">${nozzle.notes}</small>` : ''}
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn-secondary" onclick="editNozzle(${index})" style="padding: 6px 12px;">✏️ Edit</button>
                <button class="btn-secondary" onclick="deleteNozzle(${index})" style="padding: 6px 12px; color: var(--danger);">🗑️ Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /** Get nozzle condition color */
  getNozzleConditionColor(condition) {
    switch (condition) {
      case 'new': return '#4caf50';
      case 'good': return '#2196f3';
      case 'worn': return '#ff9800';
      case 'damaged': return '#f44336';
      default: return '#757575';
    }
  }

  /** Tab 10: Preferences */
  renderTab10_Preferences() {
    const prefs = this.currentProfile.preferences || { slicer: 'superslicer', materials: ['PLA'] };
    return `
      <div class="tab-content">
        <h3>💾 Preferences & Notes</h3>

        <h4>Slicer Preferences</h4>
        <div class="form-group">
          <label>Primary Slicer</label>
          <select id="prefSlicer" class="form-control">
            <option value="">Select slicer...</option>
            <option value="superslicer" ${prefs.slicer === 'superslicer' ? 'selected' : ''}>SuperSlicer</option>
            <option value="prusaslicer" ${prefs.slicer === 'prusaslicer' ? 'selected' : ''}>PrusaSlicer</option>
            <option value="orcaslicer" ${prefs.slicer === 'orcaslicer' ? 'selected' : ''}>OrcaSlicer</option>
            <option value="cura" ${prefs.slicer === 'cura' ? 'selected' : ''}>Cura</option>
            <option value="simplify3d" ${prefs.slicer === 'simplify3d' ? 'selected' : ''}>Simplify3D</option>
            <option value="ideamaker" ${prefs.slicer === 'ideamaker' ? 'selected' : ''}>IdeaMaker</option>
            <option value="klipper" ${prefs.slicer === 'klipper' ? 'selected' : ''}>Klipper (Mainsail/Fluidd)</option>
            <option value="__custom__" ${prefs.slicer && prefs.slicer.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
          </select>
          <input type="text" id="prefSlicerCustom" class="form-control"
            value="${prefs.slicer && prefs.slicer.startsWith('custom:') ? prefs.slicer.replace('custom:', '') : ''}"
            placeholder="Enter custom slicer"
            style="display: ${prefs.slicer && prefs.slicer.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
        </div>

        <h4 style="margin-top: 25px;">Common Materials</h4>
        <div class="form-group">
          <label>Materials You Print (select all that apply)</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
            ${['PLA','PETG','ABS','ASA','TPU','Nylon','PC','CF','Wood'].map(mat => `
              <label style="display: flex; align-items: center;">
                <input type="checkbox" id="mat${mat.replace(/[^A-Za-z]/g,'')}" ${prefs.materials?.includes(mat) ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                ${mat}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-top: 15px;">
          <label>Other Materials (comma-separated)</label>
          <input type="text" id="matOther" class="form-control" placeholder="e.g., PP, HIPS, PVA, Metal-filled" value="${prefs.materialsOther || ''}">
        </div>

        <h4 style="margin-top: 25px;">Enclosure</h4>
        <div class="form-group">
          <label>Printer Enclosure</label>
          <select id="prefEnclosure" class="form-control">
            <option value="none" ${prefs.enclosure === 'none' ? 'selected' : ''}>No Enclosure (Open Air)</option>
            <option value="partial" ${prefs.enclosure === 'partial' ? 'selected' : ''}>Partial (Top/Sides only)</option>
            <option value="full" ${prefs.enclosure === 'full' ? 'selected' : ''}>Full Enclosure</option>
            <option value="heated" ${prefs.enclosure === 'heated' ? 'selected' : ''}>Heated Enclosure</option>
            <option value="__custom__" ${prefs.enclosure && prefs.enclosure.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
          </select>
          <input type="text" id="prefEnclosureCustom" class="form-control" placeholder="Enter custom enclosure type" style="display: ${prefs.enclosure && prefs.enclosure.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          <p class="field-help">Enclosure helps with ABS/ASA printing and temperature stability</p>
        </div>

        <h4 style="margin-top: 25px;">Additional Notes</h4>
        <div class="form-group">
          <label>Profile Notes</label>
          <textarea id="profileNotes" rows="5" placeholder="Add any additional notes about your printer setup, upgrades, known issues, or tips...">${this.currentProfile.notes || ''}</textarea>
          <p class="field-help">These notes will be included in exports to help others with similar setups</p>
        </div>

        <h4 style="margin-top: 25px;">Profile Metadata</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Created</label>
            <input type="text" class="form-control" value="${this.currentProfile.created ? new Date(this.currentProfile.created).toLocaleString() : 'N/A'}" disabled>
          </div>
          <div class="form-group">
            <label>Last Modified</label>
            <input type="text" class="form-control" value="${this.currentProfile.modified ? new Date(this.currentProfile.modified).toLocaleString() : 'N/A'}" disabled>
          </div>
        </div>
      </div>
    `;
  }

  /** Attach input listeners */
  attachInputListeners() {
    // Autocomplete only on Tab 1
    if (this.currentTab === 1) this.setupPrinterAutocomplete();

    // Basic text inputs
    ['profileName', 'printerModel', 'firmwareVersion'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this.updateProfile(id, e.target.value);
        });
      }
    });

    // Firmware type dropdown
    const firmwareType = document.getElementById('firmwareType');
    if (firmwareType) {
      firmwareType.addEventListener('change', (e) => {
        this.currentProfile.firmwareType = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
        this.toggleConfigUploadButton();
      });
      this.toggleConfigUploadButton();
    }

    // Import buttons
    const uploadBtn = document.getElementById('showConfigUpload');
    if (uploadBtn) uploadBtn.addEventListener('click', () => this.showConfigUpload());

    const m503Btn = document.getElementById('showM503Paste');
    if (m503Btn) m503Btn.addEventListener('click', () => this.showM503Paste());

    const eepromBtn = document.getElementById('showEEPROMBackup');
    if (eepromBtn) eepromBtn.addEventListener('click', () => this.showEEPROMBackup());

    // Hardware tab inputs
    this.attachHardwareListeners();
    // Other tab-specific listeners
    this.attachTabSpecificListeners();
  }

  /** Attach listeners for hardware tab */
  attachHardwareListeners() {
    // Motherboard dropdown
    const boardEl = document.getElementById('hardwareBoard');
    const boardCustomEl = document.getElementById('hardwareBoardCustom');
    if (boardEl) {
      boardEl.addEventListener('change', (e) => {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        if (e.target.value === '__custom__') {
          if (boardCustomEl) boardCustomEl.style.display = 'block';
        } else if (e.target.value) {
          if (boardCustomEl) boardCustomEl.style.display = 'none';
          this.currentProfile.hardware.board = e.target.value;
          this.currentProfile.modified = new Date().toISOString();
          this.autofillBoardDetails(e.target.value);
        }
      });
    }
    if (boardCustomEl) {
      boardCustomEl.addEventListener('input', (e) => {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        this.currentProfile.hardware.board = 'custom:' + e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Stepper Drivers
    ['X', 'Y', 'Z', 'E'].forEach(axis => {
      const driverEl = document.getElementById(`driver${axis}`);
      const driverCustomEl = document.getElementById(`driver${axis}Custom`);
      if (driverEl) {
        driverEl.addEventListener('change', (e) => {
          if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
          if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
          if (e.target.value === '__custom__') {
            if (driverCustomEl) driverCustomEl.style.display = 'block';
          } else {
            if (driverCustomEl) driverCustomEl.style.display = 'none';
            this.currentProfile.hardware.drivers[axis.toLowerCase()] = e.target.value;
            this.currentProfile.modified = new Date().toISOString();
          }
        });
      }
      if (driverCustomEl) {
        driverCustomEl.addEventListener('input', (e) => {
          if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
          if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
          this.currentProfile.hardware.drivers[axis.toLowerCase()] = 'custom:' + e.target.value;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Thermistors
    ['Hotend', 'Bed'].forEach(type => {
      const thermEl = document.getElementById(`thermistor${type}`);
      const thermCustomEl = document.getElementById(`thermistor${type}Custom`);
      if (thermEl) {
        thermEl.addEventListener('change', (e) => {
          if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
          if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
          if (e.target.value === '__custom__') {
            if (thermCustomEl) thermCustomEl.style.display = 'block';
          } else {
            if (thermCustomEl) thermCustomEl.style.display = 'none';
            this.currentProfile.hardware.thermistors[type.toLowerCase()] = e.target.value;
            this.currentProfile.modified = new Date().toISOString();
          }
        });
      }
      if (thermCustomEl) {
        thermCustomEl.addEventListener('input', (e) => {
          if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
          if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
          this.currentProfile.hardware.thermistors[type.toLowerCase()] = 'custom:' + e.target.value;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Display
    const displayEl = document.getElementById('hardwareDisplay');
    const displayCustomEl = document.getElementById('hardwareDisplayCustom');
    if (displayEl) {
      displayEl.addEventListener('change', (e) => {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        if (e.target.value === '__custom__') {
          if (displayCustomEl) displayCustomEl.style.display = 'block';
        } else {
          if (displayCustomEl) displayCustomEl.style.display = 'none';
          this.currentProfile.hardware.display = e.target.value;
          this.currentProfile.modified = new Date().toISOString();
        }
      });
    }
    if (displayCustomEl) {
      displayCustomEl.addEventListener('input', (e) => {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        this.currentProfile.hardware.display = 'custom:' + e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }
  }

  /** Attach tab-specific listeners for tabs 3-10 */
  attachTabSpecificListeners() {
    // Tab 3: Hotend
    const hotendType = document.getElementById('hotendType');
    const hotendCustom = document.getElementById('hotendTypeCustom');
    if (hotendType) {
      hotendType.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (hotendCustom) hotendCustom.style.display = 'block';
        } else if (e.target.value) {
          if (hotendCustom) hotendCustom.style.display = 'none';
          this.currentProfile.hotendType = e.target.value;
          this.currentProfile.modified = new Date().toISOString();
          this.autofillFromHotend(e.target.value);
        }
      });
    }
    if (hotendCustom) {
      hotendCustom.addEventListener('input', (e) => {
        this.currentProfile.hotendType = 'custom:' + e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Heater
    const hotendHeater = document.getElementById('hotendHeater');
    if (hotendHeater) {
      hotendHeater.addEventListener('change', (e) => {
        this.currentProfile.hotendHeater = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // High Flow
    const highFlowHotend = document.getElementById('highFlowHotend');
    if (highFlowHotend) {
      highFlowHotend.addEventListener('change', (e) => {
        this.currentProfile.highFlowHotend = e.target.checked;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Hotend temp
    const hotendMaxTemp = document.getElementById('hotendMaxTemp');
    if (hotendMaxTemp) {
      hotendMaxTemp.addEventListener('input', (e) => {
        if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
        if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};
        this.currentProfile.temperature.hotend.max = parseFloat(e.target.value) || 275;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Hotend PID
    ['hotendPidP', 'hotendPidI', 'hotendPidD'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const pidType = id.replace('hotendPid', '').toLowerCase();
          if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
          if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};
          if (!this.currentProfile.temperature.hotend.pid) this.currentProfile.temperature.hotend.pid = {};
          this.currentProfile.temperature.hotend.pid[pidType] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Bed temp
    const bedMaxTemp = document.getElementById('bedMaxTemp');
    if (bedMaxTemp) {
      bedMaxTemp.addEventListener('input', (e) => {
        if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
        if (!this.currentProfile.temperature.bed) this.currentProfile.temperature.bed = {};
        this.currentProfile.temperature.bed.max = parseFloat(e.target.value) || 110;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Bed type
    const bedType = document.getElementById('bedType');
    if (bedType) {
      bedType.addEventListener('change', (e) => {
        if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
        this.currentProfile.temperature.bedType = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Bed PID
    ['bedPidP', 'bedPidI', 'bedPidD'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const pidType = id.replace('bedPid', '').toLowerCase();
          if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
          if (!this.currentProfile.temperature.bed) this.currentProfile.temperature.bed = {};
          if (!this.currentProfile.temperature.bed.pid) this.currentProfile.temperature.bed.pid = {};
          this.currentProfile.temperature.bed.pid[pidType] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Bed size
    ['bedSizeX', 'bedSizeY', 'bedSizeZ'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('bedSize', '').toLowerCase();
          if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
          this.currentProfile.bedSize[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Probe type
    const probeType = document.getElementById('probeType');
    if (probeType) {
      probeType.addEventListener('change', (e) => {
        if (!this.currentProfile.probe) this.currentProfile.probe = { offsets: { x: 0, y: 0, z: 0 } };
        this.currentProfile.probe.type = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
        const probeSettings = document.getElementById('probeSettings');
        if (probeSettings) {
          probeSettings.style.display = e.target.value !== 'none' ? 'block' : 'none';
        }
      });
    }

    // Probe offsets
    ['probeOffsetX', 'probeOffsetY', 'probeOffsetZ'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('probeOffset', '').toLowerCase();
          if (!this.currentProfile.probe) this.currentProfile.probe = { offsets: {} };
          if (!this.currentProfile.probe.offsets) this.currentProfile.probe.offsets = {};
          this.currentProfile.probe.offsets[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Bed leveling type
    const bedLevelingType = document.getElementById('bedLevelingType');
    if (bedLevelingType) {
      bedLevelingType.addEventListener('change', (e) => {
        if (!this.currentProfile.bedLeveling) this.currentProfile.bedLeveling = {};
        this.currentProfile.bedLeveling.type = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
        const meshSettings = document.getElementById('meshSettings');
        if (meshSettings) {
          meshSettings.style.display = e.target.value !== 'none' ? 'block' : 'none';
        }
      });
    }

    // Mesh params
    ['gridPointsX', 'gridPointsY', 'fadeHeight'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (!this.currentProfile.bedLeveling) this.currentProfile.bedLeveling = {};
          if (id === 'fadeHeight') {
            this.currentProfile.bedLeveling.fadeHeight = parseFloat(e.target.value) || 0;
          } else {
            const axis = id.replace('gridPoints', '').toLowerCase();
            if (!this.currentProfile.bedLeveling.gridPoints) this.currentProfile.bedLeveling.gridPoints = {};
            this.currentProfile.bedLeveling.gridPoints[axis] = parseInt(e.target.value, 10) || 3;
          }
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Motion — steps
    ['stepsX', 'stepsY', 'stepsZ', 'stepsE'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('steps', '').toLowerCase();
          if (!this.currentProfile.motion) this.currentProfile.motion = {};
          if (!this.currentProfile.motion.steps) this.currentProfile.motion.steps = {};
          this.currentProfile.motion.steps[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Motion — max feedrates
    ['maxFeedrateX', 'maxFeedrateY', 'maxFeedrateZ', 'maxFeedrateE'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('maxFeedrate', '').toLowerCase();
          if (!this.currentProfile.motion) this.currentProfile.motion = {};
          if (!this.currentProfile.motion.maxFeedrates) this.currentProfile.motion.maxFeedrates = {};
          this.currentProfile.motion.maxFeedrates[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Motion — max acceleration
    ['maxAccelX', 'maxAccelY', 'maxAccelZ', 'maxAccelE'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('maxAccel', '').toLowerCase();
          if (!this.currentProfile.motion) this.currentProfile.motion = {};
          if (!this.currentProfile.motion.maxAccel) this.currentProfile.motion.maxAccel = {};
          this.currentProfile.motion.maxAccel[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Motion — jerk
    ['jerkX', 'jerkY', 'jerkZ', 'jerkE'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('jerk', '').toLowerCase();
          if (!this.currentProfile.motion) this.currentProfile.motion = {};
          if (!this.currentProfile.motion.jerk) this.currentProfile.motion.jerk = {};
          this.currentProfile.motion.jerk[axis] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Travel accelerations
    ['printAccel', 'retractAccel', 'travelAccel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (!this.currentProfile.motion) this.currentProfile.motion = {};
          this.currentProfile.motion[id] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Advanced — LA
    const linearAdvanceK = document.getElementById('linearAdvanceK');
    if (linearAdvanceK) {
      linearAdvanceK.addEventListener('input', (e) => {
        if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
        if (!this.currentProfile.advanced.linearAdvance) this.currentProfile.advanced.linearAdvance = {};
        this.currentProfile.advanced.linearAdvance.k = parseFloat(e.target.value) || 0;
        this.currentProfile.advanced.linearAdvance.enabled = parseFloat(e.target.value) > 0;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Advanced — Arc support
    const arcSupport = document.getElementById('arcSupport');
    if (arcSupport) {
      arcSupport.addEventListener('change', (e) => {
        if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
        this.currentProfile.advanced.arcSupport = e.target.checked;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Advanced — JD value
    const junctionDeviationValue = document.getElementById('junctionDeviationValue');
    if (junctionDeviationValue) {
      junctionDeviationValue.addEventListener('input', (e) => {
        if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
        if (!this.currentProfile.advanced.junctionDeviation) this.currentProfile.advanced.junctionDeviation = {};
        this.currentProfile.advanced.junctionDeviation.value = parseFloat(e.target.value) || 0.005;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    // Advanced — other checkboxes
    ['autoReportTemp', 'sdCardSupport', 'eepromSupport'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
          this.currentProfile.advanced[id] = e.target.checked;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Safety — thermal protection
    ['thermalProtectionHotend', 'thermalProtectionBed'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          const type = id.replace('thermalProtection', '').toLowerCase();
          if (!this.currentProfile.safety) this.currentProfile.safety = {};
          if (!this.currentProfile.safety.thermalProtection) this.currentProfile.safety.thermalProtection = {};
          this.currentProfile.safety.thermalProtection[type] = e.target.checked;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Safety — runaway params
    ['runawayPeriod', 'runawayHysteresis'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const param = id.replace('runaway', '').toLowerCase();
          if (!this.currentProfile.safety) this.currentProfile.safety = {};
          if (!this.currentProfile.safety.runaway) this.currentProfile.safety.runaway = {};
          this.currentProfile.safety.runaway[param] = parseInt(e.target.value, 10) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Safety — limits
    ['hotendMinTemp', 'hotendMaxTempSafety', 'bedMinTemp', 'bedMaxTempSafety', 'minExtrusionTemp', 'maxExtrusionLength'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (!this.currentProfile.safety) this.currentProfile.safety = {};
          this.currentProfile.safety[id] = parseFloat(e.target.value) || 0;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Safety — checkboxes
    ['preventColdExtrusion', 'noMovesBeforeHoming', 'softwareEndstops'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          if (!this.currentProfile.safety) this.currentProfile.safety = {};
          this.currentProfile.safety[id] = e.target.checked;
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    // Tab 10 — materials
    ['matPLA', 'matPETG', 'matABS', 'matASA', 'matTPU', 'matNylon', 'matPC', 'matCF', 'matWood'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          if (!this.currentProfile.preferences) this.currentProfile.preferences = {};
          if (!this.currentProfile.preferences.materials) this.currentProfile.preferences.materials = [];
          const material = id.replace('mat', '');
          if (e.target.checked) {
            if (!this.currentProfile.preferences.materials.includes(material)) {
              this.currentProfile.preferences.materials.push(material);
            }
          } else {
            this.currentProfile.preferences.materials = this.currentProfile.preferences.materials.filter(m => m !== material);
          }
          this.currentProfile.modified = new Date().toISOString();
        });
      }
    });

    const matOther = document.getElementById('matOther');
    if (matOther) {
      matOther.addEventListener('input', (e) => {
        if (!this.currentProfile.preferences) this.currentProfile.preferences = {};
        this.currentProfile.preferences.materialsOther = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }

    const profileNotes = document.getElementById('profileNotes');
    if (profileNotes) {
      profileNotes.addEventListener('input', (e) => {
        this.currentProfile.notes = e.target.value;
        this.currentProfile.modified = new Date().toISOString();
      });
    }
  }

  /** Auto-fill board details from database */
  autofillBoardDetails(boardId) {
    if (!this.databases['marlin-boards']) return;
    const board = this.databases['marlin-boards'].boards.find(b => b.id === boardId);
    if (!board) return;
    EnhancedPrinterProfiles.log('✅ Board selected:', board);

    // Show info
    const helpText = document.querySelector('#hardwareBoard + input + .field-help') || document.querySelector('#hardwareBoard + .field-help');
    if (helpText) {
      helpText.innerHTML = `
        <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #2196f3;">
          <strong>📋 ${board.name}</strong><br>
          <strong>MCU:</strong> ${board.mcu} <strong>Voltage:</strong> ${board.voltage}V <strong>Flash:</strong> ${board.flashSize}<br>
          ${board.commonOn ? `<strong>Common on:</strong> ${board.commonOn.join(', ')}<br>` : ''}
          ${board.notes ? `<em>${board.notes}</em>` : ''}
        </div>
      `;
    }

    // Store metadata
    if (!this.currentProfile.hardware.boardMetadata) {
      this.currentProfile.hardware.boardMetadata = {};
    }
    this.currentProfile.hardware.boardMetadata = {
      name: board.name,
      manufacturer: board.manufacturer,
      mcu: board.mcu,
      voltage: board.voltage,
      flashSize: board.flashSize,
      supportsTMC: board.supportsTMC
    };

    // Auto-populate drivers
    this.autofillDrivers(board);
  }

  /** Auto-fill thermistor and temperature from hotend selection */
  autofillFromHotend(hotendId) {
    EnhancedPrinterProfiles.log('🔥 Auto-filling from hotend:', hotendId);
    if (!this.databases['Hotends']) {
      EnhancedPrinterProfiles.log('❌ No Hotends database!');
      return;
    }
    const hotend = this.databases['Hotends'].hotends.find(h => h.id === hotendId);
    if (!hotend) {
      EnhancedPrinterProfiles.log('❌ Hotend not found in database:', hotendId);
      return;
    }
    EnhancedPrinterProfiles.log('✅ Found hotend:', hotend.name);

    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
    if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
    if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
    if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};

    if (hotend.thermistor) {
      this.currentProfile.hardware.thermistors.hotend = hotend.thermistor.toString();
      EnhancedPrinterProfiles.log(' ✅ Thermistor:', hotend.thermistor);
      const thermistorEl = document.getElementById('thermistorHotend');
      if (thermistorEl) thermistorEl.value = hotend.thermistor.toString();
    }

    if (hotend.maxTemp) {
      this.currentProfile.temperature.hotend.max = hotend.maxTemp;
      EnhancedPrinterProfiles.log(' ✅ Max Temp:', hotend.maxTemp, '°C');
      const maxTempEl = document.getElementById('hotendMaxTemp');
      if (maxTempEl) maxTempEl.value = hotend.maxTemp;
    }

    if (this.databases['heaters']?.hotendHeaters) {
      const compatibleHeater = this.databases['heaters'].hotendHeaters.find(heater =>
        heater.stockOnHotends && heater.stockOnHotends.includes(hotendId)
      );
      if (compatibleHeater) {
        this.currentProfile.hotendHeater = compatibleHeater.id;
        EnhancedPrinterProfiles.log(' ✅ Heater:', compatibleHeater.name, `(${compatibleHeater.wattage}W ${compatibleHeater.voltage}V)`);
        const heaterEl = document.getElementById('hotendHeater');
        if (heaterEl) heaterEl.value = compatibleHeater.id;
      }
    }

    if (hotend.extruder?.defaultESteps) {
      if (!this.currentProfile.motion) this.currentProfile.motion = {};
      if (!this.currentProfile.motion.steps) this.currentProfile.motion.steps = {};
      this.currentProfile.motion.steps.e = hotend.extruder.defaultESteps;
      EnhancedPrinterProfiles.log(' ✅ E-Steps:', hotend.extruder.defaultESteps, `(${hotend.extruder.type}, ${hotend.extruder.gearType})`);
      const estepsEl = document.getElementById('esteps');
      if (estepsEl) estepsEl.value = hotend.extruder.defaultESteps;
    }

    if (hotend.extruder?.type && hotend.extruder.type !== 'Varies') {
      const typeMap = { 'Direct Drive': 'direct', 'Bowden': 'bowden', 'Both': 'direct' };
      const extruderType = typeMap[hotend.extruder.type] || 'direct';
      this.currentProfile.extruderType = extruderType;
      EnhancedPrinterProfiles.log(' ✅ Extruder Type:', hotend.extruder.type, `(${extruderType})`);
      const extruderTypeEl = document.getElementById('extruderType');
      if (extruderTypeEl) extruderTypeEl.value = extruderType;
    }

    const hotendTypeEl = document.getElementById('hotendType');
    if (hotendTypeEl) {
      let helpText = hotendTypeEl.parentElement.querySelector('.field-help');
      if (!helpText) {
        helpText = document.createElement('p');
        helpText.className = 'field-help';
        hotendTypeEl.parentElement.appendChild(helpText);
      }
      helpText.innerHTML = `
        <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #2196f3;">
          <strong>🔥 ${hotend.name}</strong><br>
          <strong>Category:</strong> ${hotend.category} <strong>Max Temp:</strong> ${hotend.maxTemp}°C<br>
          <strong>Thermistor:</strong> Type ${hotend.thermistor}<br>
          ${hotend.notes ? `<em>${hotend.notes}</em>` : ''}
          <br><br>
          <strong style="color: #1565c0;">✨ Auto-filled:</strong> Thermistor type ${hotend.thermistor}, Max temp ${hotend.maxTemp}°C
        </div>
      `;
    }
    this.currentProfile.modified = new Date().toISOString();
  }

  /** Auto-fill drivers based on board selection */
  autofillDrivers(board) {
    EnhancedPrinterProfiles.log('🔧 autofillDrivers called with board:', board.id);
    if (!this.databases['stepper-drivers']) {
      EnhancedPrinterProfiles.log('❌ No stepper-drivers database!');
      return;
    }
    EnhancedPrinterProfiles.log('✅ stepper-drivers database exists, drivers:', this.databases['stepper-drivers'].drivers.length);
    let defaultDriver = '';

    if (board.id.includes('CREALITY_V427') || board.id.includes('CREALITY_V422')) {
      defaultDriver = 'TMC2208';
    } else if (board.id.includes('BTT_SKR_MINI_E3_V3')) {
      defaultDriver = 'TMC2209';
    } else if (board.id.includes('BTT_SKR_MINI_E3_V2')) {
      defaultDriver = 'TMC2209';
    } else if (board.id.includes('BTT_SKR')) {
      defaultDriver = 'TMC2209';
    } else if (board.id.includes('EINSY')) {
      defaultDriver = 'TMC2130';
    } else if (board.id.includes('RAMPS')) {
      defaultDriver = 'A4988';
    } else if (board.supportsTMC) {
      defaultDriver = 'TMC2209';
    } else {
      defaultDriver = 'A4988';
    }
    EnhancedPrinterProfiles.log('🎯 Determined default driver:', defaultDriver);

    const driver = this.databases['stepper-drivers'].drivers.find(d =>
      d.name.includes(defaultDriver) || d.id.includes(defaultDriver)
    );
    if (!driver) {
      EnhancedPrinterProfiles.log('❌ Driver not found in database! Looking for:', defaultDriver);
      EnhancedPrinterProfiles.log('Available drivers:', this.databases['stepper-drivers'].drivers.map(d => d.name));
      return;
    }
    EnhancedPrinterProfiles.log('✅ Found driver:', driver.id, driver.name);

    if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
    ['X', 'Y', 'Z', 'E'].forEach(axis => {
      this.currentProfile.hardware.drivers[axis.toLowerCase()] = driver.id;
      EnhancedPrinterProfiles.log(`✅ Saved driver${axis} to profile:`, driver.id);
    });

    if (this.currentTab === 2) {
      ['X', 'Y', 'Z', 'E'].forEach(axis => {
        const driverEl = document.getElementById(`driver${axis}`);
        if (driverEl) {
          driverEl.value = driver.id;
          EnhancedPrinterProfiles.log(`📍 Updated driver${axis} dropdown to:`, driver.id);
        }
      });
      const helpText = document.querySelector('#hardwareBoard + input + .field-help');
      if (helpText) {
        const currentHTML = helpText.innerHTML;
        if (!currentHTML.includes('Auto-filled drivers')) {
          helpText.innerHTML = currentHTML.replace('</div>',
            `<strong>✨ Auto-filled drivers:</strong> ${defaultDriver} (all axes)<br></div>`);
        }
      }
    }
    EnhancedPrinterProfiles.log('✅ Profile drivers saved:', this.currentProfile.hardware.drivers);
    this.currentProfile.modified = new Date().toISOString();
  }

  /** Update profile data */
  updateProfile(field, value) {
    switch (field) {
      case 'profileName':
        this.currentProfile.name = value;
        break;
      case 'printerModel':
        this.currentProfile.printerModel = value;
        break;
      case 'firmwareVersion':
        this.currentProfile.firmwareVersion = value;
        break;
    }
    this.currentProfile.modified = new Date().toISOString();
    this.updateProgress();
  }

  /** Show Configuration.h upload interface */
  showConfigUpload() {
    const importArea = document.getElementById('importArea');
    importArea.style.display = 'block';
    importArea.innerHTML = `
      <div class="config-upload-zone">
        <input type="file" id="configFileInput" accept=".h" multiple style="display: none;">
        <div class="file-drop-zone" id="configDropZone" style="cursor: pointer;">
          <p style="font-size: 1.2em;">📄 Drop Configuration files here</p>
          <p style="font-size: 0.9em; color: #888;">Select multiple .h files (Configuration.h, Configuration_adv.h, backend files, speed, etc.)</p>
          <p style="font-size: 0.9em; color: #888;">or click to browse</p>
        </div>
        <div id="uploadResult" style="display: none;"></div>
      </div>
    `;
    const dropZone = document.getElementById('configDropZone');
    const fileInput = document.getElementById('configFileInput');
    dropZone.addEventListener('click', () => { fileInput.click(); });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleConfigFiles(Array.from(e.target.files));
      }
    });
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleConfigFiles(Array.from(e.dataTransfer.files));
      }
    });
  }

  /** Handle multiple Configuration.h files upload */
  async handleConfigFiles(files) {
    const resultDiv = document.getElementById('uploadResult');
    resultDiv.style.display = 'block';

    const hFiles = files.filter(f => f.name.endsWith('.h'));
    if (hFiles.length === 0) {
      resultDiv.innerHTML = '<p style="color: red;">❌ Error: Please upload .h files</p>';
      return;
    }
    this.tempConfigFiles = hFiles;

    const fileListHTML = hFiles.map(f => `
      <div style="padding: 5px; background: #e3f2fd; border-left: 3px solid #2196f3; margin: 5px 0; color: #1565c0;">
        📄 <strong style="color: #0d47a1;">${f.name}</strong> <span style="color: #424242;">(${(f.size / 1024).toFixed(1)} KB)</span>
      </div>`).join('');

    resultDiv.innerHTML = `
      <div style="background: var(--card-bg, #f5f5f5); padding: 15px; border-radius: 5px; border: 1px solid var(--border, #ddd);">
        <h4 style="margin: 0 0 10px 0; color: var(--text-primary, #212121);">📁 ${hFiles.length} file(s) ready</h4>
        ${fileListHTML}
        <button class="btn-primary" id="parseFilesBtn" style="margin-top: 10px; padding: 10px 20px;">
          🔍 Parse Files
        </button>
      </div>
    `;
    document.getElementById('parseFilesBtn').addEventListener('click', () => {
      this.parseConfigFiles();
    });
  }

  /** Parse the stored configuration files — SINGLE parser (marlin-config-parser.js) */
  async parseConfigFiles() {
    if (!this.tempConfigFiles || this.tempConfigFiles.length === 0) return;
    const resultDiv = document.getElementById('uploadResult');
    resultDiv.innerHTML = '<p>⏳ Parsing files...</p>';

    // Sort files: Configuration.h FIRST, then others (adv, backend, speed)
    const priority = { 'Configuration.h': 1, 'Configuration_adv.h': 2, 'Configuration_backend.h': 3, 'Configuration_speed.h': 4 };
    const sortedFiles = [...this.tempConfigFiles].sort((a, b) => (priority[a.name] || 999) - (priority[b.name] || 999));
    EnhancedPrinterProfiles.log('📁 File parse order:', sortedFiles.map(f => f.name).join(' → '));

    // Decide variant (th3d vs marlin) from FIRST file’s contents
    const firstText = await this.readFileAsText(sortedFiles[0]);
    const isTH3D = (this.currentProfile.firmwareType === 'th3d')
      || firstText.includes('UNIFIED_VERSION')
      || firstText.includes('TH3D Studio')
      || firstText.includes('EZABL_ENABLE')
      || firstText.includes('EZABL_POINTS');

    const variant = isTH3D ? 'th3d' : 'marlin';
    const parser = MarlinConfigParser.create(variant); // <-- single parser instance from marlin-config-parser.js
    EnhancedPrinterProfiles.log(`🧩 Using parser variant: ${variant}`);

    const parsedConfigs = [];
    const fileStatuses = [];

    for (const file of sortedFiles) {
      try {
        const content = await this.readFileAsText(file);
        const cfg = await parser.parseConfigFile(content); // normalized schema
        parsedConfigs.push(cfg);

        fileStatuses.push({
          name: file.name,
          success: true,
          settingsCount: Object.keys(cfg).length,
          parser: variant.toUpperCase()
        });
      } catch (error) {
        fileStatuses.push({ name: file.name, success: false, error: error.message });
      }
    }

    if (parsedConfigs.length > 0) {
      // Merge via parser’s merge
      const mergedConfig = parser.mergeConfigs(parsedConfigs); // includes warnings array if any
      const successCount = fileStatuses.filter(f => f.success).length;
      const mergedWarnings = mergedConfig.warnings || [];

      // Render status
      const filesHTML = fileStatuses.map(f => f.success
        ? `<div style="padding: 5px; background: #e8f5e9; border-left: 3px solid #4caf50; margin: 5px 0; color: #2e7d32;">
             ✅ <strong style="color: #1b5e20;">${f.name}</strong> - <span style="color: #33691e;">${f.settingsCount} sections</span>
             <span style="color: #424242; font-size: 0.85em;">(${f.parser})</span>
           </div>`
        : `<div style="padding: 5px; background: #ffebee; border-left: 3px solid #f44336; margin: 5px 0; color: #c62828;">
             ❌ <strong style="color: #b71c1c;">${f.name}</strong> - <span style="color: #c62828;">${f.error}</span>
           </div>`
      ).join('');

      let warningsHTML = '';
      if (mergedWarnings.length > 0) {
        const warningsList = mergedWarnings.map(w => {
          const icon = w.level === 'error' ? '❌' : w.level === 'warning' ? '⚠️' : 'ℹ️';
          const color = w.level === 'error' ? '#f44336' : w.level === 'warning' ? '#ff9800' : '#2196f3';
          return `
            <div style="padding: 8px; margin: 5px 0; border-left: 3px solid ${color}; background: #fff; border-radius: 3px;">
              <strong style="color: ${color};">${icon} ${w.level.toUpperCase()}</strong>
              <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #333;">${w.message}</p>
            </div>
          `;
        }).join('');
        warningsHTML = `
          <div style="margin: 10px 0;">
            <button id="toggleWarningsBtn" style="background: #ff9800; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
              <span id="warningToggleIcon">+</span> ${mergedWarnings.length} Warning(s) - Click to View
            </button>
            <div id="warningsContent" style="display: none; margin-top: 10px; padding: 10px; background: #fff3e0; border-radius: 4px; border: 1px solid #ff9800;">
              ${warningsList}
            </div>
          </div>
        `;
      }

      resultDiv.innerHTML = `
        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50;">
          <h4 style="margin: 0 0 10px 0; color: #2e7d32;">✅ Parsed ${successCount} of ${this.tempConfigFiles.length} file(s)</h4>
          <div style="margin: 10px 0;">${filesHTML}</div>
          ${warningsHTML}
          <button class="btn-primary" id="applyParsedConfigBtn" style="margin-top: 10px; padding: 10px 20px; font-size: 1em;">
            ✨ Apply Settings to Profile
          </button>
        </div>
      `;

      this.tempParsedConfig = mergedConfig;

      document.getElementById('applyParsedConfigBtn').addEventListener('click', () => {
        this.applyParsedConfig();
      });

      const toggleBtn = document.getElementById('toggleWarningsBtn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const content = document.getElementById('warningsContent');
          const icon = document.getElementById('warningToggleIcon');
          if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '−';
            toggleBtn.innerHTML = `<span id="warningToggleIcon">−</span> ${mergedWarnings.length} Warning(s) - Click to Hide`;
          } else {
            content.style.display = 'none';
            icon.textContent = '+';
            toggleBtn.innerHTML = `<span id="warningToggleIcon">+</span> ${mergedWarnings.length} Warning(s) - Click to View`;
          }
        });
      }
    } else {
      resultDiv.innerHTML = '<p style="color: red;">❌ Failed to parse any files</p>';
    }
  }

  /** Read file as text */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /** Apply parsed configuration to current profile */
  applyParsedConfig() {
    if (!this.tempParsedConfig) {
      alert('No parsed configuration data available');
      return;
    }
    const parsed = this.tempParsedConfig;
    EnhancedPrinterProfiles.log('📥 Applying parsed config:', parsed);
    EnhancedPrinterProfiles.log('📥 Current profile before apply:', JSON.parse(JSON.stringify(this.currentProfile)));

    // Basic
    if (parsed.basic) {
      let profileName = '';
      if (parsed.basic.machineName) {
        const name = String(parsed.basic.machineName).trim();
        if (name && !['SHORT_BUILD_VERSION', 'Marlin', 'MACHINE_NAME'].includes(name) && !name.includes('BUILD_VERSION')) {
          profileName = name;
          EnhancedPrinterProfiles.log(' ✅ Using CUSTOM_MACHINE_NAME:', profileName);
        }
      }
      if (!profileName && parsed.basic.author) {
        const author = String(parsed.basic.author).trim();
        if (author && author !== 'default' && author !== 'unknown') {
          profileName = author;
          EnhancedPrinterProfiles.log(' ✅ Using author as name:', profileName);
        }
      }
      if (profileName) {
        this.currentProfile.name = profileName;
        EnhancedPrinterProfiles.log('✅ Profile name set to:', profileName);
      } else {
        EnhancedPrinterProfiles.log('⚠️ No suitable profile name found in config files');
      }

      if (parsed.basic.firmwareVersion) {
        this.currentProfile.firmwareVersion = String(parsed.basic.firmwareVersion).trim();
        EnhancedPrinterProfiles.log('✅ Firmware version set to:', this.currentProfile.firmwareVersion);
      }
      if (parsed.basic.motherboard) {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        this.currentProfile.hardware.board = parsed.basic.motherboard;
      }
      if (parsed.basic.bedSizeX && parsed.basic.bedSizeY) {
        if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
        this.currentProfile.bedSize.x = parsed.basic.bedSizeX;
        this.currentProfile.bedSize.y = parsed.basic.bedSizeY;
      }
      if (parsed.basic.zMaxPos) {
        if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
        this.currentProfile.bedSize.z = parsed.basic.zMaxPos;
      }
    }

    // Hardware
    if (parsed.hardware) {
      if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
      if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
      if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
      if (parsed.hardware.driverX) this.currentProfile.hardware.drivers.x = parsed.hardware.driverX;
      if (parsed.hardware.driverY) this.currentProfile.hardware.drivers.y = parsed.hardware.driverY;
      if (parsed.hardware.driverZ) this.currentProfile.hardware.drivers.z = parsed.hardware.driverZ;
      if (parsed.hardware.driverE0) this.currentProfile.hardware.drivers.e = parsed.hardware.driverE0;
      if (parsed.hardware.thermistorHotend) {
        this.currentProfile.hardware.thermistors.hotend = parsed.hardware.thermistorHotend.toString();
      }
      if (parsed.hardware.thermistorBed) {
        this.currentProfile.hardware.thermistors.bed = parsed.hardware.thermistorBed.toString();
      }
      if (parsed.hardware.displayType) {
        this.currentProfile.hardware.display = parsed.hardware.displayType;
        EnhancedPrinterProfiles.log('✅ Display set from import:', parsed.hardware.displayType);
      }
    }

    // Temperature
    if (parsed.temperature) {
      if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
      if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};
      if (parsed.temperature.hotendMaxTemp) this.currentProfile.temperature.hotend.max = parsed.temperature.hotendMaxTemp;
      if (parsed.temperature.pidHotendP !== undefined) {
        if (!this.currentProfile.temperature.hotend.pid) this.currentProfile.temperature.hotend.pid = {};
        this.currentProfile.temperature.hotend.pid.p = parsed.temperature.pidHotendP;
        this.currentProfile.temperature.hotend.pid.i = parsed.temperature.pidHotendI || 0;
        this.currentProfile.temperature.hotend.pid.d = parsed.temperature.pidHotendD || 0;
      }
      if (!this.currentProfile.temperature.bed) this.currentProfile.temperature.bed = {};
      if (parsed.temperature.bedMaxTemp) this.currentProfile.temperature.bed.max = parsed.temperature.bedMaxTemp;
      if (parsed.temperature.pidBedP !== undefined) {
        if (!this.currentProfile.temperature.bed.pid) this.currentProfile.temperature.bed.pid = {};
        this.currentProfile.temperature.bed.pid.p = parsed.temperature.pidBedP;
        this.currentProfile.temperature.bed.pid.i = parsed.temperature.pidBedI || 0;
        this.currentProfile.temperature.bed.pid.d = parsed.temperature.pidBedD || 0;
      }
      if (parsed.temperature.bedType) {
        this.currentProfile.temperature.bedType = parsed.temperature.bedType;
        EnhancedPrinterProfiles.log('✅ Bed type set to:', parsed.temperature.bedType);
      }
    }

    // Motion
    if (parsed.motion) {
      if (!this.currentProfile.motion) this.currentProfile.motion = {};
      if (parsed.motion.stepsPerMM) {
        this.currentProfile.motion.steps = {
          x: parsed.motion.stepsPerMM.x || 80,
          y: parsed.motion.stepsPerMM.y || 80,
          z: parsed.motion.stepsPerMM.z || 400,
          e: parsed.motion.stepsPerMM.e || 93
        };
      }
      if (parsed.motion.maxFeedrate) {
        this.currentProfile.motion.maxFeedrates = {
          x: parsed.motion.maxFeedrate.x || 500,
          y: parsed.motion.maxFeedrate.y || 500,
          z: parsed.motion.maxFeedrate.z || 5,
          e: parsed.motion.maxFeedrate.e || 25
        };
      }
      if (parsed.motion.maxAcceleration) {
        this.currentProfile.motion.maxAccel = {
          x: parsed.motion.maxAcceleration.x || 500,
          y: parsed.motion.maxAcceleration.y || 500,
          z: parsed.motion.maxAcceleration.z || 100,
          e: parsed.motion.maxAcceleration.e || 5000
        };
      }
      if (parsed.motion.jerkX !== undefined) {
        this.currentProfile.motion.jerk = {
          x: parsed.motion.jerkX || 8,
          y: parsed.motion.jerkY || 8,
          z: parsed.motion.jerkZ || 0.4,
          e: parsed.motion.jerkE || 5
        };
      }
      if (parsed.motion.defaultAcceleration) this.currentProfile.motion.printAccel = parsed.motion.defaultAcceleration;
      if (parsed.motion.retractAcceleration) this.currentProfile.motion.retractAccel = parsed.motion.retractAcceleration;
      if (parsed.motion.travelAcceleration) this.currentProfile.motion.travelAccel = parsed.motion.travelAcceleration;
    }

    // Probe
    EnhancedPrinterProfiles.log('🔎 Parsed probe data:', parsed.probe);
    if (parsed.probe && parsed.probe.type) {
      if (!this.currentProfile.probe) this.currentProfile.probe = {};
      this.currentProfile.probe.type = parsed.probe.type.toLowerCase();
      EnhancedPrinterProfiles.log('✅ Set probe type to:', this.currentProfile.probe.type);
      if (parsed.probe.offset) {
        this.currentProfile.probe.offsets = {
          x: parsed.probe.offset.x || 0,
          y: parsed.probe.offset.y || 0,
          z: parsed.probe.offset.z || 0
        };
        EnhancedPrinterProfiles.log('✅ Set probe offsets:', this.currentProfile.probe.offsets);
      }
    }

    // Bed Leveling
    EnhancedPrinterProfiles.log('🔎 Parsed bedLeveling data:', parsed.bedLeveling);
    if (parsed.bedLeveling && parsed.bedLeveling.type) {
      if (!this.currentProfile.bedLeveling) this.currentProfile.bedLeveling = {};
      this.currentProfile.bedLeveling.type = parsed.bedLeveling.type.toLowerCase();
      EnhancedPrinterProfiles.log('✅ Set bed leveling type to:', this.currentProfile.bedLeveling.type);
      if (parsed.bedLeveling.gridPointsX) {
        this.currentProfile.bedLeveling.gridPoints = {
          x: parsed.bedLeveling.gridPointsX,
          y: parsed.bedLeveling.gridPointsY || parsed.bedLeveling.gridPointsX
        };
        EnhancedPrinterProfiles.log('✅ Set grid points to:', this.currentProfile.bedLeveling.gridPoints);
      }
      if (parsed.bedLeveling.fadeHeight !== undefined) {
        this.currentProfile.bedLeveling.fadeHeight = parsed.bedLeveling.fadeHeight;
        EnhancedPrinterProfiles.log('✅ Set fade height to:', this.currentProfile.bedLeveling.fadeHeight);
      }
    }

    // Advanced
    if (parsed.advanced) {
      if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
      if (parsed.advanced.linearAdvance !== undefined) {
        this.currentProfile.advanced.linearAdvance = {
          enabled: parsed.advanced.linearAdvance === true,
          k: parsed.advanced.linearAdvanceK || 0,
          type: this.currentProfile.advanced.linearAdvance?.type || 'marlin'
        };
      }
      if (parsed.advanced.arcSupport !== undefined) {
        this.currentProfile.advanced.arcSupport = parsed.advanced.arcSupport;
      }
      if (parsed.advanced.nozzlePark !== undefined) {
        this.currentProfile.advanced.nozzlePark = parsed.advanced.nozzlePark;
      }
      if (parsed.advanced.powerLossRecovery !== undefined) {
        if (!this.currentProfile.safety) this.currentProfile.safety = {};
        this.currentProfile.safety.powerLossRecovery = {
          enabled: parsed.advanced.powerLossRecovery,
          type: 'basic'
        };
      }
    }

    // Safety
    if (parsed.safety) {
      if (!this.currentProfile.safety) this.currentProfile.safety = {};
      if (!this.currentProfile.safety.thermalProtection) this.currentProfile.safety.thermalProtection = {};
      if (parsed.safety.thermalProtectionHotend !== undefined) {
        this.currentProfile.safety.thermalProtection.hotend = parsed.safety.thermalProtectionHotend;
      }
      if (parsed.safety.thermalProtectionBed !== undefined) {
        this.currentProfile.safety.thermalProtection.bed = parsed.safety.thermalProtectionBed;
      }
      if (parsed.safety.filamentSensor !== undefined) {
        if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
        this.currentProfile.advanced.runoutSensor = {
          enabled: parsed.safety.filamentSensor,
          type: 'mechanical'
        };
      }
    }

    this.currentProfile.modified = new Date().toISOString();
    EnhancedPrinterProfiles.log('✅ Configuration applied to profile:', this.currentProfile);
    EnhancedPrinterProfiles.log('📥 Profile name after apply:', this.currentProfile.name);
    EnhancedPrinterProfiles.log('📥 Hardware after apply:', this.currentProfile.hardware);
    EnhancedPrinterProfiles.log('📥 Motion after apply:', this.currentProfile.motion);

    const resultDiv = document.getElementById('uploadResult');
    if (resultDiv) {
      resultDiv.innerHTML = `
        <div style="background: #4caf50; color: white; padding: 15px; border-radius: 5px;">
          <h4 style="margin: 0 0 10px 0;">✅ Settings Applied Successfully!</h4>
          <p style="margin: 0;"><strong>Profile Name:</strong> ${this.currentProfile.name || '(not set)'}</p>
          <p style="margin: 0;"><strong>Firmware:</strong> ${this.currentProfile.firmwareType || '(not set)'} — ${this.currentProfile.firmwareVersion || ''}</p>
          <p style="margin: 5px 0 0 0;">Profile updated with imported settings</p>
        </div>
      `;
    }
    this.renderCurrentTab();
  }

  /** Parse & Apply M503 */
  parseAndApplyM503() {
    const m503Input = document.getElementById('m503Input').value.trim();
    const resultDiv = document.getElementById('m503Result');
    if (!m503Input) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '<p style="color: var(--error);">⚠️ Please paste M503 output first!</p>';
      return;
    }
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p>⏳ Parsing M503 output...</p>';
    try {
      if (typeof EEPROMParser === 'undefined') {
        throw new Error('EEPROM Parser not loaded. Please include eeprom-parser.js');
      }
      const parsed = EEPROMParser.parseM503(m503Input);
      const summary = EEPROMParser.createSummary(parsed);
      const settingsCount = this.applyParsedEEPROM(parsed);

      resultDiv.innerHTML = `
        <div style="background: var(--success-light); border: 2px solid var(--success); padding: 15px; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: var(--success);">✅ M503 Parsed Successfully!</h4>
          <p><strong>Firmware:</strong> ${summary.firmware}</p>
          <p><strong>Settings Applied:</strong> ${settingsCount} settings (Motion, PID, Steps, and more)</p>
          ${summary.issueCount > 0 ? `<p style="color: var(--warning);">⚠️ ${summary.issueCount} warning(s) found</p>` : ''}
          ${summary.infoCount > 0 ? `<p style="color: var(--info);">ℹ️ ${summary.infoCount} suggestion(s)</p>` : ''}
          <button class="btn-secondary" id="showWarningsBtn" style="margin-top: 10px; padding: 8px 16px; background: var(--info); color: white; border: none; border-radius: 4px; cursor: pointer;">
            View Details
          </button>
          <div id="warningsDetail" style="display: none; margin-top: 10px; padding: 10px; background: var(--background); border-radius: 4px;">
            ${this.renderWarnings(parsed.warnings)}
          </div>
        </div>
      `;
      const showWarningsBtn = document.getElementById('showWarningsBtn');
      if (showWarningsBtn) {
        showWarningsBtn.addEventListener('click', () => {
          const detail = document.getElementById('warningsDetail');
          if (detail.style.display === 'none') {
            detail.style.display = 'block';
            showWarningsBtn.textContent = 'Hide Details';
          } else {
            detail.style.display = 'none';
            showWarningsBtn.textContent = 'View Details';
          }
        });
      }
    } catch (error) {
      console.error('Error parsing M503:', error);
      resultDiv.innerHTML = `
        <div style="background: var(--error-light); border: 2px solid var(--error); padding: 15px; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: var(--error);">❌ Parse Error</h4>
          <p>${error.message}</p>
          <p style="font-size: 0.9em; color: var(--text-secondary);">
            Make sure you pasted the complete M503 output. It should contain lines like M92, M203, M201, M301, etc.
          </p>
        </div>
      `;
    }
  }

  /** Apply parsed EEPROM data */
  applyParsedEEPROM(parsed) {
    let settingsCount = 0;
    if (parsed.maxFeedrate) {
      if (!this.currentProfile.motion) this.currentProfile.motion = {};
      if (!this.currentProfile.motion.maxFeedrates) this.currentProfile.motion.maxFeedrates = {};
      if (parsed.maxFeedrate.x) { this.currentProfile.motion.maxFeedrates.x = parsed.maxFeedrate.x; settingsCount++; }
      if (parsed.maxFeedrate.y) { this.currentProfile.motion.maxFeedrates.y = parsed.maxFeedrate.y; settingsCount++; }
      if (parsed.maxFeedrate.z) { this.currentProfile.motion.maxFeedrates.z = parsed.maxFeedrate.z; settingsCount++; }
      if (parsed.maxFeedrate.e) { this.currentProfile.motion.maxFeedrates.e = parsed.maxFeedrate.e; settingsCount++; }
    }
    if (parsed.maxAccel) {
      if (!this.currentProfile.motion.maxAccel) this.currentProfile.motion.maxAccel = {};
      if (parsed.maxAccel.x) { this.currentProfile.motion.maxAccel.x = parsed.maxAccel.x; settingsCount++; }
      if (parsed.maxAccel.y) { this.currentProfile.motion.maxAccel.y = parsed.maxAccel.y; settingsCount++; }
      if (parsed.maxAccel.z) { this.currentProfile.motion.maxAccel.z = parsed.maxAccel.z; settingsCount++; }
      if (parsed.maxAccel.e) { this.currentProfile.motion.maxAccel.e = parsed.maxAccel.e; settingsCount++; }
    }
    if (parsed.jerk) {
      if (!this.currentProfile.motion.jerk) this.currentProfile.motion.jerk = {};
      if (parsed.jerk.x) { this.currentProfile.motion.jerk.x = parsed.jerk.x; settingsCount++; }
      if (parsed.jerk.y) { this.currentProfile.motion.jerk.y = parsed.jerk.y; settingsCount++; }
      if (parsed.jerk.z) { this.currentProfile.motion.jerk.z = parsed.jerk.z; settingsCount++; }
      if (parsed.jerk.e) { this.currentProfile.motion.jerk.e = parsed.jerk.e; settingsCount++; }
    }
    if (parsed.esteps) {
      if (!this.currentProfile.motion.steps) this.currentProfile.motion.steps = {};
      this.currentProfile.motion.steps.e = parsed.esteps;
      settingsCount++;
    }
    if (parsed.pidHotend) {
      if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
      if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = { max: 275 };
      if (!this.currentProfile.temperature.hotend.pid) this.currentProfile.temperature.hotend.pid = {};
      this.currentProfile.temperature.hotend.pid.p = parsed.pidHotend.p;
      this.currentProfile.temperature.hotend.pid.i = parsed.pidHotend.i;
      this.currentProfile.temperature.hotend.pid.d = parsed.pidHotend.d;
      settingsCount += 3;
    }
    if (parsed.pidBed) {
      if (!this.currentProfile.temperature.bed) this.currentProfile.temperature.bed = { max: 110 };
      if (!this.currentProfile.temperature.bed.pid) this.currentProfile.temperature.bed.pid = {};
      this.currentProfile.temperature.bed.pid.p = parsed.pidBed.p;
      this.currentProfile.temperature.bed.pid.i = parsed.pidBed.i;
      this.currentProfile.temperature.bed.pid.d = parsed.pidBed.d;
      settingsCount += 3;
    }
    if (parsed.linearAdvance !== null) {
      if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
      if (!this.currentProfile.advanced.linearAdvance) this.currentProfile.advanced.linearAdvance = {};
      this.currentProfile.advanced.linearAdvance.k = parsed.linearAdvance;
      this.currentProfile.advanced.linearAdvance.enabled = parsed.linearAdvance > 0;
      if (parsed.linearAdvance > 0) this.currentProfile.advanced.linearAdvance.type = 'marlin';
      settingsCount++;
    }
    if (parsed.zOffset !== null) {
      if (!this.currentProfile.probe) this.currentProfile.probe = { type: 'none', offsets: {} };
      if (!this.currentProfile.probe.offsets) this.currentProfile.probe.offsets = {};
      this.currentProfile.probe.offsets.z = parsed.zOffset;
      settingsCount++;
    }
    if (parsed.bedSize && parsed.bedSize.x) {
      if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
      this.currentProfile.bedSize.x = parsed.bedSize.x;
      this.currentProfile.bedSize.y = parsed.bedSize.y;
      this.currentProfile.bedSize.z = parsed.bedSize.z;
      settingsCount += 3;
    }
    if (parsed.firmware) {
      this.currentProfile.firmwareVersion = parsed.firmware.version;
      const name = parsed.firmware.name.toLowerCase();
      if (name.includes('th3d') || name.includes('unified')) {
        this.currentProfile.firmwareType = 'th3d';
        EnhancedPrinterProfiles.log('🔎 EEPROM Parser detected TH3D firmware');
      } else if (name.includes('marlin')) {
        this.currentProfile.firmwareType = 'marlin';
      } else if (name.includes('klipper')) {
        this.currentProfile.firmwareType = 'klipper';
      }
    }
    this.currentProfile.modified = new Date().toISOString();
    this.renderCurrentTab();
    EnhancedPrinterProfiles.log(`✅ EEPROM data applied to profile (${settingsCount} settings):`, this.currentProfile);
    return settingsCount;
  }

  /** Render warnings block */
  renderWarnings(warnings) {
    if (!warnings || warnings.length === 0) return '<p>No warnings or suggestions.</p>';
    return warnings.map(w => {
      const icon = w.level === 'error' ? '❌' : w.level === 'warning' ? '⚠️' : 'ℹ️';
      const color = w.level === 'error' ? 'var(--error)' : w.level === 'warning' ? 'var(--warning)' : 'var(--info)';
      return `
        <div style="padding: 8px; margin: 5px 0; border-left: 3px solid ${color}; background: var(--background); border-radius: 4px;">
          <strong style="color: ${color};">${icon} ${w.field?.toUpperCase() || 'INFO'}</strong>
          <p style="margin: 5px 0;">${w.message}</p>
          ${w.suggestion ? `<p style="margin: 5px 0; font-size: 0.9em; color: var(--text-secondary);">💡 ${w.suggestion}</p>` : ''}
        </div>
      `;
    }).join('');
  }

  /** Show EEPROM backup interface */
  showEEPROMBackup() {
    const importArea = document.getElementById('importArea');
    importArea.style.display = 'block';
    importArea.innerHTML = `
      <div class="eeprom-backup-zone">
        <input type="file" id="eepromFileInput" accept=".json,.zip" style="display: none;">
        <div class="file-drop-zone" id="eepromDropZone" style="cursor: pointer;">
          <p style="font-size: 1.2em;">💾 Drop EEPROM backup here</p>
          <p style="font-size: 0.9em; color: #888;">(OctoPrint .json or .zip)</p>
          <p style="font-size: 0.9em; color: #888;">or click to browse</p>
        </div>
        <div id="eepromResult" style="display: none;"></div>
      </div>
    `;
    const dropZone = document.getElementById('eepromDropZone');
    const fileInput = document.getElementById('eepromFileInput');
    dropZone.addEventListener('click', () => { fileInput.click(); });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleEEPROMBackup(e.target.files[0]);
      }
    });
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleEEPROMBackup(e.dataTransfer.files[0]);
      }
    });
  }

  /** Handle EEPROM backup file upload */
  async handleEEPROMBackup(file) {
    const resultDiv = document.getElementById('eepromResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p>⏳ Reading EEPROM backup file...</p>';

    if (typeof EEPROMParser === 'undefined') {
      resultDiv.innerHTML = `
        <div style="background: var(--error-light); border: 2px solid var(--error); padding: 15px; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: var(--error);">❌ Parser Error</h4>
          <p>EEPROM Parser not loaded. Please include eeprom-parser.js</p>
        </div>
      `;
      return;
    }

    try {
      let parsed;
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const json = JSON.parse(text);
        if (typeof json === 'string') {
          parsed = EEPROMParser.parseM503(json);
        } else if (json.data) {
          parsed = EEPROMParser.parseStructuredJSON(json);
        } else if (json.m503 || json.eeprom) {
          parsed = EEPROMParser.parseM503(json.m503 || json.eeprom);
        } else {
          throw new Error('Unrecognized JSON format. Expected M503 output or structured backup.');
        }
      } else if (file.name.endsWith('.zip')) {
        parsed = await EEPROMParser.parseOctoPrintBackup(file);
      } else {
        throw new Error('Unsupported file type. Please upload .json or .zip file.');
      }

      if (!parsed || !parsed.parsed) {
        throw new Error('Failed to parse EEPROM data from backup file');
      }

      const summary = EEPROMParser.createSummary(parsed);
      const settingsCount = this.applyParsedEEPROM(parsed);

      resultDiv.innerHTML = `
        <div style="background: var(--success-light); border: 2px solid var(--success); padding: 15px; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: var(--success);">✅ EEPROM Backup Parsed Successfully!</h4>
          <p><strong>File:</strong> ${file.name}</p>
          <p><strong>Firmware:</strong> ${summary.firmware}</p>
          <p><strong>Settings Applied:</strong> ${settingsCount} settings (Motion, PID, Steps, Temperatures)</p>
          ${summary.issueCount > 0 ? `<p style="color: var(--warning);">⚠️ ${summary.issueCount} warning(s) found</p>` : ''}
          ${summary.infoCount > 0 ? `<p style="color: var(--info);">ℹ️ ${summary.infoCount} suggestion(s)</p>` : ''}
          <button class="btn-secondary" id="showBackupWarningsBtn" style="margin-top: 10px; padding: 8px 16px; background: var(--info); color: white; border: none; border-radius: 4px; cursor: pointer;">
            View Details
          </button>
          <div id="backupWarningsDetail" style="display: none; margin-top: 10px; padding: 10px; background: var(--background); border-radius: 4px;">
            ${this.renderWarnings(parsed.warnings)}
          </div>
        </div>
      `;
      const showWarningsBtn = document.getElementById('showBackupWarningsBtn');
      if (showWarningsBtn) {
        showWarningsBtn.addEventListener('click', () => {
          const detail = document.getElementById('backupWarningsDetail');
          if (detail.style.display === 'none') {
            detail.style.display = 'block';
            showWarningsBtn.textContent = 'Hide Details';
          } else {
            detail.style.display = 'none';
            showWarningsBtn.textContent = 'View Details';
          }
        });
      }
    } catch (error) {
      console.error('Error parsing EEPROM backup:', error);
      resultDiv.innerHTML = `
        <div style="background: var(--error-light); border: 2px solid var(--error); padding: 15px; border-radius: 6px;">
          <h4 style="margin: 0 0 10px 0; color: var(--error);">❌ Parse Error</h4>
          <p>${error.message}</p>
          <p style="font-size: 0.9em; color: var(--text-secondary); margin-top: 10px;">
            <strong>Supported formats:</strong><br>
            • JSON file containing M503 output<br>
            • OctoPrint EEPROM backup (.zip)<br>
            • Structured JSON with "m503" or "eeprom" field
          </p>
        </div>
      `;
    }
  }

  /** Toggle Configuration.h upload button based on firmware type */
  toggleConfigUploadButton() {
    const uploadBtn = document.getElementById('showConfigUpload');
    const firmwareType = document.getElementById('firmwareType');
    if (uploadBtn && firmwareType) {
      const isMarlinBased = firmwareType.value === 'marlin' || firmwareType.value === 'th3d';
      uploadBtn.disabled = !isMarlinBased;
      uploadBtn.style.opacity = isMarlinBased ? '1' : '0.5';
      uploadBtn.title = isMarlinBased ? 'Upload Configuration.h file' : 'Only available for Marlin-based firmware';
    }
  }

  /** Update progress indicator (placeholder) */
  updateProgress() {
    const progressEl = document.getElementById('profileProgress');
    const progressBarEl = document.getElementById('profileProgressBar');
    if (progressEl && progressBarEl) {
      const completed = 1; // Placeholder
      const total = 10;
      const percent = (completed / total) * 100;
      progressEl.textContent = `${completed}/${total}`;
      progressBarEl.style.width = `${percent}%`;
    }
  }

  /** Validate all fields (placeholder) */
  validateAll() {
    alert('Validation system — Under construction');
  }

  /** Export profile for community submission */
  exportForCommunity() {
    if (!this.currentProfile.name) {
      alert('⚠️ Please enter a profile name before exporting');
      this.switchTab(1);
      return;
    }
    const exportData = {
      profileName: this.currentProfile.name,
      printerModel: this.currentProfile.printerModel,
      firmwareType: this.currentProfile.firmwareType,
      firmwareVersion: this.currentProfile.firmwareVersion,
      hardware: this.currentProfile.hardware,
      temperature: this.currentProfile.temperature,
      motion: this.currentProfile.motion,
      probe: this.currentProfile.probe,
      bedLeveling: this.currentProfile.bedLeveling,
      advanced: this.currentProfile.advanced,
      safety: this.currentProfile.safety,
      nozzles: this.currentProfile.nozzles,
      exportDate: new Date().toISOString(),
      exportVersion: '2.1.0'
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentProfile.printerModel || 'printer'}-profile-export.json`.replace(/\s+/g, '_');
    a.click();
    URL.revokeObjectURL(url);

    alert(
      '📤 Profile Exported Successfully!\n\n' +
      '✅ File downloaded: ' + a.download + '\n\n' +
      '📋 How to Submit to Community Database:\n\n' +
      '1. Go to: github.com/tsolo4ever/3d-Print-tools/issues\n' +
      '2. Click "New Issue"\n' +
      '3. Title: "Community Profile: ' + this.currentProfile.printerModel + '"\n' +
      '4. Add "Community Profiles" label\n' +
      '5. Attach the exported JSON file\n' +
      '6. Add any notes about your setup\n\n' +
      '✅ All personal data has been removed from export\n' +
      '✅ Only technical specs included\n\n' +
      'Your contribution helps other users! 🎉'
    );
  }

  /** Save profile */
  saveProfile() {
    if (!this.currentProfile.name) {
      alert('Please enter a profile name');
      this.switchTab(1);
      return;
    }
    if (this.currentProfile.id && StorageManager.getPrinter(this.currentProfile.id)) {
      StorageManager.updatePrinter(this.currentProfile.id, this.currentProfile);
    } else {
      const savedProfile = StorageManager.addPrinter(this.currentProfile);
      this.currentProfile = savedProfile;
    }
    this.close();
    window.dispatchEvent(new CustomEvent('printerProfileSaved', {
      detail: this.currentProfile
    }));
  }

  /** Close the modal */
  close() {
    if (this.modal) {
      this.modal.style.opacity = '0';
      setTimeout(() => {
        this.modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  }

  /* ------------------------------ Import helpers (M503 & EEPROM UI) ------------------------------ */

  /** Show M503 paste UI */
  showM503Paste() {
    const importArea = document.getElementById('importArea');
    importArea.style.display = 'block';
    importArea.innerHTML = `
      <div class="m503-zone">
        <textarea id="m503Input" rows="10" placeholder="Paste full M503 output here..."></textarea>
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button class="btn-primary" id="parseM503Btn">🔍 Parse M503</button>
          <button class="btn-secondary" id="clearM503Btn">Clear</button>
        </div>
        <div id="m503Result" style="display:none; margin-top:10px;"></div>
      </div>
    `;
    document.getElementById('parseM503Btn').addEventListener('click', () => this.parseAndApplyM503());
    document.getElementById('clearM503Btn').addEventListener('click', () => {
      document.getElementById('m503Input').value = '';
      document.getElementById('m503Result').style.display = 'none';
      document.getElementById('m503Result').innerHTML = '';
    });
  }
}
// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedPrinterProfiles;
}
