/**
 * Enhanced Printer Profiles
 * Advanced 10-tab printer profile editor with Configuration.h import
 * 
 * @version 2.0.0
 * @requires storage-manager.js
 * @requires config-parser.js
 */

class EnhancedPrinterProfiles {
    constructor() {
        this.currentProfile = null;
        this.currentTab = 1;
        this.databases = {};
        this.modal = null;
        this.validationState = {};
        
        // Load hardware databases
        this.loadDatabases();
    }
    
    /**
     * Load all hardware databases from JSON files
     */
    async loadDatabases() {
        try {
            const bases = ['marlin-boards', 'stepper-drivers', 'thermistors', 'displays'];
            
            for (const db of bases) {
                const response = await fetch(`assets/data/${db}.json`);
                const data = await response.json();
                this.databases[db] = data;
            }
            
            console.log('✅ Hardware databases loaded:', Object.keys(this.databases));
        } catch (error) {
            console.error('❌ Error loading databases:', error);
        }
    }
    
    /**
     * Show the enhanced profile editor
     */
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
        
        console.log('✅ Databases ready:', Object.keys(this.databases));
        console.log('📊 Board count:', this.databases['marlin-boards']?.boards?.length);
        
        // Load profile if editing existing
        if (profileId) {
            this.currentProfile = StorageManager.getPrinter(profileId);
        } else {
            // Create new profile with defaults
            this.currentProfile = this.createDefaultProfile();
        }
        
        // Create and show modal
        this.createModal();
        this.renderCurrentTab();
    }
    
    /**
     * Create default profile structure
     */
    createDefaultProfile() {
        return {
            id: 'printer_' + Date.now(),
            name: '',
            printerModel: '',
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
    
    /**
     * Create the modal HTML structure
     */
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
                        <button class="tab-btn" data-tab="5">📏 Probe</button>
                        <button class="tab-btn" data-tab="6">🏃 Motion</button>
                        <button class="tab-btn" data-tab="7">⚡ Advanced</button>
                        <button class="tab-btn" data-tab="8">🛡️ Safety</button>
                        <button class="tab-btn" data-tab="9">🔧 Nozzles</button>
                        <button class="tab-btn" data-tab="10">💾 Preferences</button>
                    </div>
                    
                    <!-- Tab Content -->
                    <div class="modal-body-enhanced" id="profileTabContent">
                        <!-- Content will be rendered here -->
                    </div>
                    
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
    
    /**
     * Setup all event listeners
     */
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
        
        // Validate button
        document.getElementById('profileValidate').addEventListener('click', () => {
            this.validateAll();
        });
        
        // Save button
        document.getElementById('profileSave').addEventListener('click', () => {
            this.saveProfile();
        });
        
        // Export button
        document.getElementById('profileExport').addEventListener('click', () => {
            this.exportForCommunity();
        });
        
        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
    
    /**
     * Switch to a different tab
     */
    switchTab(tabNum) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabNum}"]`).classList.add('active');
        
        this.currentTab = tabNum;
        this.renderCurrentTab();
        
        // Update prev/next button states
        document.getElementById('profilePrevTab').disabled = (tabNum === 1);
        document.getElementById('profileNextTab').disabled = (tabNum === 10);
    }
    
    /**
     * Render the current tab content
     */
    renderCurrentTab() {
        const content = document.getElementById('profileTabContent');
        
        switch(this.currentTab) {
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
        
        // Attach input listeners after rendering
        this.attachInputListeners();
    }
    
    /**
     * Tab 1: Printer Info
     */
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
                    <input type="text" id="printerModel" value="${this.currentProfile.printerModel || ''}" 
                           placeholder="e.g., Creality Ender 5 Plus">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Firmware Type *</label>
                        <select id="firmwareType">
                            <option value="">Select firmware...</option>
                            <option value="marlin" ${this.currentProfile.firmwareType === 'marlin' ? 'selected' : ''}>Marlin</option>
                            <option value="klipper" ${this.currentProfile.firmwareType === 'klipper' ? 'selected' : ''}>Klipper</option>
                            <option value="reprap" ${this.currentProfile.firmwareType === 'reprap' ? 'selected' : ''}>RepRap</option>
                            <option value="smoothie" ${this.currentProfile.firmwareType === 'smoothie' ? 'selected' : ''}>Smoothieware</option>
                            <option value="other" ${this.currentProfile.firmwareType === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Firmware Version</label>
                        <input type="text" id="firmwareVersion" value="${this.currentProfile.firmwareVersion || ''}" 
                               placeholder="e.g., 2.0.9.3">
                    </div>
                </div>
                
                <!-- Import Section -->
                <div class="import-section">
                    <h4>📥 Quick Import (Optional)</h4>
                    <p>Import your Configuration.h or EEPROM backup to auto-fill hardware settings:</p>
                    
                    <div class="import-methods">
                        <button class="btn-secondary" id="showConfigUpload">
                            📄 Upload Configuration.h
                        </button>
                        <button class="btn-secondary" id="showM503Paste">
                            📋 Paste M503 Output
                        </button>
                        <button class="btn-secondary" id="showEEPROMBackup">
                            💾 EEPROM Backup
                        </button>
                    </div>
                    
                    <div id="importArea" style="display: none; margin-top: 15px;">
                        <!-- Will be filled dynamically -->
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Tab 2: Hardware Configuration
     */
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
    
    /**
     * Render board dropdown options
     */
    renderBoardOptions(selectedBoard) {
        console.log('🔍 renderBoardOptions called');
        console.log('📊 databases object:', this.databases);
        console.log('📊 marlin-boards exists?', !!this.databases['marlin-boards']);
        console.log('📊 boards array:', this.databases['marlin-boards']?.boards);
        
        if (!this.databases['marlin-boards']) {
            console.log('❌ No marlin-boards database found!');
            return '';
        }
        
        console.log('✅ Rendering', this.databases['marlin-boards'].boards.length, 'boards');
        
        return this.databases['marlin-boards'].boards.map(board => {
            const selected = selectedBoard === board.id ? 'selected' : '';
            return `<option value="${board.id}" ${selected}>${board.name} (${board.mcu})</option>`;
        }).join('');
    }
    
    /**
     * Render driver dropdown options
     */
    renderDriverOptions(selectedDriver) {
        if (!this.databases['stepper-drivers']) return '';
        
        return this.databases['stepper-drivers'].drivers.map(driver => {
            const selected = selectedDriver === driver.id ? 'selected' : '';
            return `<option value="${driver.id}" ${selected}>${driver.name}</option>`;
        }).join('');
    }
    
    /**
     * Render thermistor dropdown options
     */
    renderThermistorOptions(selectedThermistor) {
        if (!this.databases['thermistors']) return '';
        
        return this.databases['thermistors'].thermistors.map(therm => {
            const selected = selectedThermistor === therm.id ? 'selected' : '';
            return `<option value="${therm.id}" ${selected}>${therm.name}</option>`;
        }).join('');
    }
    
    /**
     * Render display dropdown options
     */
    renderDisplayOptions(selectedDisplay) {
        if (!this.databases['displays']) return '';
        
        return this.databases['displays'].displays.map(display => {
            const selected = selectedDisplay === display.id ? 'selected' : '';
            return `<option value="${display.id}" ${selected}>${display.name}</option>`;
        }).join('');
    }
    
    /**
     * Tab 3: Hotend & Extruder
     */
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
                            <option value="stock">Stock Hotend</option>
                            <option value="e3d-v6">E3D V6</option>
                            <option value="e3d-volcano">E3D Volcano</option>
                            <option value="micro-swiss">Micro Swiss All-Metal</option>
                            <option value="dragon">Dragon Standard Flow</option>
                            <option value="dragon-hf">Dragon High Flow</option>
                            <option value="mosquito">Mosquito</option>
                            <option value="rapido">Phaetus Rapido</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Max Temperature (°C) *</label>
                        <input type="number" id="hotendMaxTemp" value="${temp.max}" min="200" max="500">
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
    /**
     * Tab 4: Bed Configuration
     */
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
                            <option value="standard">Standard Aluminum</option>
                            <option value="glass">Glass Bed</option>
                            <option value="pei">PEI Sheet</option>
                            <option value="magnetic">Magnetic</option>
                            <option value="spring-steel">Spring Steel</option>
                            <option value="custom">Custom</option>
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
    renderTab5_Probe() { return '<div class="tab-content"><h3>📏 Probe & Leveling</h3><p>Under construction</p></div>'; }
    renderTab6_Motion() { return '<div class="tab-content"><h3>🏃 Motion Settings</h3><p>Under construction</p></div>'; }
    renderTab7_Advanced() { return '<div class="tab-content"><h3>⚡ Advanced Features</h3><p>Under construction</p></div>'; }
    renderTab8_Safety() { return '<div class="tab-content"><h3>🛡️ Safety Features</h3><p>Under construction</p></div>'; }
    renderTab9_Nozzles() { return '<div class="tab-content"><h3>🔧 Nozzle Inventory</h3><p>Under construction</p></div>'; }
    renderTab10_Preferences() { return '<div class="tab-content"><h3>💾 Preferences</h3><p>Under construction</p></div>'; }
    
    /**
     * Attach input listeners to form fields
     */
    attachInputListeners() {
        // Basic text inputs
        const inputs = ['profileName', 'printerModel', 'firmwareVersion'];
        inputs.forEach(id => {
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
            
            // Initial check
            this.toggleConfigUploadButton();
        }
        
        // Import buttons
        const uploadBtn = document.getElementById('showConfigUpload');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.showConfigUpload());
        }
        
        const m503Btn = document.getElementById('showM503Paste');
        if (m503Btn) {
            m503Btn.addEventListener('click', () => this.showM503Paste());
        }
        
        const eepromBtn = document.getElementById('showEEPROMBackup');
        if (eepromBtn) {
            eepromBtn.addEventListener('click', () => this.showEEPROMBackup());
        }
        
        // Hardware Tab inputs
        this.attachHardwareListeners();
    }
    
    /**
     * Attach listeners for hardware tab
     */
    attachHardwareListeners() {
        // Motherboard dropdown with custom option
        const boardEl = document.getElementById('hardwareBoard');
        const boardCustomEl = document.getElementById('hardwareBoardCustom');
        
        if (boardEl) {
            boardEl.addEventListener('change', (e) => {
                if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                
                if (e.target.value === '__custom__') {
                    // Show custom input field
                    if (boardCustomEl) {
                        boardCustomEl.style.display = 'block';
                    }
                } else if (e.target.value) {
                    // Hide custom input
                    if (boardCustomEl) {
                        boardCustomEl.style.display = 'none';
                    }
                    
                    // Save selection
                    this.currentProfile.hardware.board = e.target.value;
                    this.currentProfile.modified = new Date().toISOString();
                    
                    // Auto-fill board details from database
                    this.autofillBoardDetails(e.target.value);
                }
            });
        }
        
        // Custom board name input
        if (boardCustomEl) {
            boardCustomEl.addEventListener('input', (e) => {
                if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                this.currentProfile.hardware.board = 'custom:' + e.target.value;
                this.currentProfile.modified = new Date().toISOString();
            });
        }
        
        // Stepper Drivers with custom options
        ['X', 'Y', 'Z', 'E'].forEach(axis => {
            const driverEl = document.getElementById(`driver${axis}`);
            const driverCustomEl = document.getElementById(`driver${axis}Custom`);
            
            if (driverEl) {
                driverEl.addEventListener('change', (e) => {
                    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                    if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
                    
                    if (e.target.value === '__custom__') {
                        // Show custom input
                        if (driverCustomEl) {
                            driverCustomEl.style.display = 'block';
                        }
                    } else {
                        // Hide custom input and save
                        if (driverCustomEl) {
                            driverCustomEl.style.display = 'none';
                        }
                        this.currentProfile.hardware.drivers[axis.toLowerCase()] = e.target.value;
                        this.currentProfile.modified = new Date().toISOString();
                    }
                });
            }
            
            // Custom driver input
            if (driverCustomEl) {
                driverCustomEl.addEventListener('input', (e) => {
                    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                    if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
                    this.currentProfile.hardware.drivers[axis.toLowerCase()] = 'custom:' + e.target.value;
                    this.currentProfile.modified = new Date().toISOString();
                });
            }
        });
        
        // Thermistors with custom options
        ['Hotend', 'Bed'].forEach(type => {
            const thermEl = document.getElementById(`thermistor${type}`);
            const thermCustomEl = document.getElementById(`thermistor${type}Custom`);
            
            if (thermEl) {
                thermEl.addEventListener('change', (e) => {
                    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                    if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
                    
                    if (e.target.value === '__custom__') {
                        // Show custom input
                        if (thermCustomEl) {
                            thermCustomEl.style.display = 'block';
                        }
                    } else {
                        // Hide custom input and save
                        if (thermCustomEl) {
                            thermCustomEl.style.display = 'none';
                        }
                        this.currentProfile.hardware.thermistors[type.toLowerCase()] = e.target.value;
                        this.currentProfile.modified = new Date().toISOString();
                    }
                });
            }
            
            // Custom thermistor input
            if (thermCustomEl) {
                thermCustomEl.addEventListener('input', (e) => {
                    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                    if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
                    this.currentProfile.hardware.thermistors[type.toLowerCase()] = 'custom:' + e.target.value;
                    this.currentProfile.modified = new Date().toISOString();
                });
            }
        });
        
        // Display with custom option
        const displayEl = document.getElementById('hardwareDisplay');
        const displayCustomEl = document.getElementById('hardwareDisplayCustom');
        
        if (displayEl) {
            displayEl.addEventListener('change', (e) => {
                if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                
                if (e.target.value === '__custom__') {
                    // Show custom input
                    if (displayCustomEl) {
                        displayCustomEl.style.display = 'block';
                    }
                } else {
                    // Hide custom input and save
                    if (displayCustomEl) {
                        displayCustomEl.style.display = 'none';
                    }
                    this.currentProfile.hardware.display = e.target.value;
                    this.currentProfile.modified = new Date().toISOString();
                }
            });
        }
        
        // Custom display input
        if (displayCustomEl) {
            displayCustomEl.addEventListener('input', (e) => {
                if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
                this.currentProfile.hardware.display = 'custom:' + e.target.value;
                this.currentProfile.modified = new Date().toISOString();
            });
        }
    }
    
    /**
     * Auto-fill board details from database
     */
    autofillBoardDetails(boardId) {
        if (!this.databases['marlin-boards']) return;
        
        const board = this.databases['marlin-boards'].boards.find(b => b.id === boardId);
        if (!board) return;
        
        console.log('✅ Board selected:', board);
        
        // Show board info notification
        const helpText = document.querySelector('#hardwareBoard + input + .field-help') || 
                        document.querySelector('#hardwareBoard + .field-help');
        
        if (helpText) {
            helpText.innerHTML = `
                <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #2196f3;">
                    <strong>📋 ${board.name}</strong><br>
                    <strong>MCU:</strong> ${board.mcu} | <strong>Voltage:</strong> ${board.voltage}V | <strong>Flash:</strong> ${board.flashSize}<br>
                    ${board.commonOn ? `<strong>Common on:</strong> ${board.commonOn.join(', ')}<br>` : ''}
                    ${board.notes ? `<em>${board.notes}</em>` : ''}
                </div>
            `;
        }
        
        // Store board metadata in profile
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
        
        // Auto-populate drivers based on common board configurations
        this.autofillDrivers(board);
    }
    
    /**
     * Auto-fill drivers based on board selection
     */
    autofillDrivers(board) {
        console.log('🔧 autofillDrivers called with board:', board.id);
        
        if (!this.databases['stepper-drivers']) {
            console.log('❌ No stepper-drivers database!');
            return;
        }
        
        console.log('✅ stepper-drivers database exists, drivers:', this.databases['stepper-drivers'].drivers.length);
        
        // Determine default driver based on board characteristics
        let defaultDriver = '';
        
        // Check board ID for known configurations
        if (board.id.includes('CREALITY_V427') || board.id.includes('CREALITY_V422')) {
            defaultDriver = 'TMC2208'; // Creality silent boards
        } else if (board.id.includes('BTT_SKR_MINI_E3_V3')) {
            defaultDriver = 'TMC2209'; // BTT V3
        } else if (board.id.includes('BTT_SKR_MINI_E3_V2')) {
            defaultDriver = 'TMC2209'; // BTT V2
        } else if (board.id.includes('BTT_SKR')) {
            defaultDriver = 'TMC2209'; // Most BTT boards
        } else if (board.id.includes('EINSY')) {
            defaultDriver = 'TMC2130'; // Prusa boards
        } else if (board.id.includes('RAMPS')) {
            defaultDriver = 'A4988'; // Classic RAMPS
        } else if (board.supportsTMC) {
            defaultDriver = 'TMC2209'; // Generic TMC support
        } else {
            defaultDriver = 'A4988'; // Fallback
        }
        
        console.log('🎯 Determined default driver:', defaultDriver);
        
        // Find driver ID from database (use partial match since names might have modes like "TMC2209 UART")
        const driver = this.databases['stepper-drivers'].drivers.find(d => 
            d.name.includes(defaultDriver) || d.id.includes(defaultDriver)
        );
        
        if (!driver) {
            console.log('❌ Driver not found in database! Looking for:', defaultDriver);
            console.log('Available drivers:', this.databases['stepper-drivers'].drivers.map(d => d.name));
            return;
        }
        
        console.log('✅ Found driver:', driver.id, driver.name);
        
        // Set all driver dropdowns
        ['X', 'Y', 'Z', 'E'].forEach(axis => {
            const driverEl = document.getElementById(`driver${axis}`);
            console.log(`📍 driver${axis} element:`, driverEl ? 'EXISTS' : 'NOT FOUND');
            
            if (driverEl) {
                console.log(`  Setting driver${axis} to:`, driver.id);
                driverEl.value = driver.id;
                
                // Save to profile
                if (!this.currentProfile.hardware.drivers) {
                    this.currentProfile.hardware.drivers = {};
                }
                this.currentProfile.hardware.drivers[axis.toLowerCase()] = driver.id;
            }
        });
        
        console.log('✅ All drivers set! Profile drivers:', this.currentProfile.hardware.drivers);
        
        // Update help text
        const helpText = document.querySelector('#hardwareBoard + input + .field-help');
        if (helpText) {
            const currentHTML = helpText.innerHTML;
            helpText.innerHTML = currentHTML.replace('</div>', 
                `<strong>✨ Auto-filled drivers:</strong> ${defaultDriver} (all axes)<br></div>`);
        }
        
        this.currentProfile.modified = new Date().toISOString();
    }
    
    /**
     * Update profile data
     */
    updateProfile(field, value) {
        switch(field) {
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
    
    /**
     * Show Configuration.h upload interface
     */
    showConfigUpload() {
        const importArea = document.getElementById('importArea');
        importArea.style.display = 'block';
        importArea.innerHTML = `
            <div class="config-upload-zone">
                <input type="file" id="configFileInput" accept=".h" style="display: none;">
                <div class="file-drop-zone" id="configDropZone" style="cursor: pointer;">
                    <p style="font-size: 1.2em;">📄 Drop Configuration.h here</p>
                    <p style="font-size: 0.9em; color: #888;">or click to browse</p>
                </div>
                <div id="uploadResult" style="display: none;"></div>
            </div>
        `;
        
        // Make drop zone clickable
        const dropZone = document.getElementById('configDropZone');
        const fileInput = document.getElementById('configFileInput');
        
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change handler
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleConfigFile(e.target.files[0]);
            }
        });
        
        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleConfigFile(e.dataTransfer.files[0]);
            }
        });
    }
    
    /**
     * Handle Configuration.h file upload
     */
    handleConfigFile(file) {
        const resultDiv = document.getElementById('uploadResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<p>⏳ Reading file...</p>';
        
        // Check file extension
        if (!file.name.endsWith('.h')) {
            resultDiv.innerHTML = '<p style="color: red;">❌ Error: Please upload a .h file</p>';
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                
                // Parse the configuration file
                if (typeof ConfigParser !== 'undefined') {
                    const parsed = ConfigParser.parseConfigurationH(content);
                    
                    if (parsed && Object.keys(parsed).length > 0) {
                        resultDiv.innerHTML = `
                            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50;">
                                <h4 style="margin: 0 0 10px 0; color: #4caf50;">✅ Configuration.h Parsed Successfully!</h4>
                                <p>Found ${Object.keys(parsed).length} settings</p>
                                <button class="btn-primary" onclick="applyParsedConfig()">Apply to Profile</button>
                            </div>
                        `;
                        
                        // Store parsed data temporarily
                        this.tempParsedConfig = parsed;
                    } else {
                        resultDiv.innerHTML = '<p style="color: orange;">⚠️ No recognizable settings found in file</p>';
                    }
                } else {
                    resultDiv.innerHTML = '<p style="color: orange;">⚠️ Parser not loaded. Showing raw file info.</p>';
                    resultDiv.innerHTML += `<p><strong>File:</strong> ${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>`;
                }
            } catch (error) {
                console.error('Error parsing config:', error);
                resultDiv.innerHTML = `<p style="color: red;">❌ Error parsing file: ${error.message}</p>`;
            }
        };
        
        reader.onerror = () => {
            resultDiv.innerHTML = '<p style="color: red;">❌ Error reading file</p>';
        };
        
        reader.readAsText(file);
    }
    
    /**
     * Show M503 paste interface
     */
    showM503Paste() {
        const importArea = document.getElementById('importArea');
        importArea.style.display = 'block';
        importArea.innerHTML = `
            <div class="m503-paste-zone">
                <label>Paste M503 output here:</label>
                <textarea id="m503Input" rows="10" placeholder="Paste your M503 output..."></textarea>
                <button class="btn-primary" id="parseM503Btn">Parse M503</button>
                <div id="m503Result" style="display: none;"></div>
            </div>
        `;
        
        // TODO: Add M503 parser
    }
    
    /**
     * Show EEPROM backup interface
     */
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
        
        // Make drop zone clickable
        const dropZone = document.getElementById('eepromDropZone');
        const fileInput = document.getElementById('eepromFileInput');
        
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // TODO: Add file upload and drag/drop handlers
    }
    
    /**
     * Toggle Configuration.h upload button based on firmware type
     */
    toggleConfigUploadButton() {
        const uploadBtn = document.getElementById('showConfigUpload');
        const firmwareType = document.getElementById('firmwareType');
        
        if (uploadBtn && firmwareType) {
            const isMarlin = firmwareType.value === 'marlin';
            uploadBtn.disabled = !isMarlin;
            uploadBtn.style.opacity = isMarlin ? '1' : '0.5';
            uploadBtn.title = isMarlin ? 'Upload Configuration.h file' : 'Only available for Marlin firmware';
        }
    }
    
    /**
     * Update progress indicator
     */
    updateProgress() {
        // TODO: Calculate completion percentage
        const completed = 1; // Placeholder
        const total = 10;
        const percent = (completed / total) * 100;
        
        document.getElementById('profileProgress').textContent = `${completed}/${total}`;
        document.getElementById('profileProgressBar').style.width = `${percent}%`;
    }
    
    /**
     * Validate all fields
     */
    validateAll() {
        // TODO: Implement validation
        alert('Validation system - Under construction');
    }
    
    /**
     * Export profile for community submission
     */
    exportForCommunity() {
        // Validate required fields
        if (!this.currentProfile.name) {
            alert('⚠️ Please enter a profile name before exporting');
            this.switchTab(1);
            return;
        }
        
        // Create sanitized export (remove personal data)
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
            exportVersion: '2.0.0'
        };
        
        // Create JSON file
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentProfile.printerModel || 'printer'}-profile-export.json`.replace(/\s+/g, '_');
        a.click();
        URL.revokeObjectURL(url);
        
        // Show submission instructions
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
    
    /**
     * Save profile
     */
    saveProfile() {
        // Validate required fields
        if (!this.currentProfile.name) {
            alert('Please enter a profile name');
            this.switchTab(1);
            return;
        }
        
        // Save to storage
        StorageManager.savePrinter(this.currentProfile);
        
        // Close modal
        this.close();
        
        // Trigger event
        window.dispatchEvent(new CustomEvent('printerProfileSaved', {
            detail: this.currentProfile
        }));
    }
    
    /**
     * Close the modal
     */
    close() {
        if (this.modal) {
            this.modal.style.opacity = '0';
            setTimeout(() => {
                this.modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedPrinterProfiles;
}
