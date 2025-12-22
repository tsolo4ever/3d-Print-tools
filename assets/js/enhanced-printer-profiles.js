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
            // Use V2 databases for boards, drivers, and thermistors
            const bases = ['marlin-boards-V2', 'stepper-drivers-V2', 'thermistors-V2', 'displays', 'Hotends', 'bed-probes'];
            
            for (const db of bases) {
                const response = await fetch(`assets/data/${db}.json`);
                const data = await response.json();
                
                // Normalize database names (remove -V2 suffix for internal use)
                const normalizedName = db.replace('-V2', '');
                this.databases[normalizedName] = data;
            }
            
            console.log('✅ Hardware databases loaded (V2):', Object.keys(this.databases));
            console.log('📊 Board count:', this.databases['marlin-boards']?.boards?.length);
            console.log('📊 Driver count:', this.databases['stepper-drivers']?.drivers?.length);
            console.log('📊 Thermistor count:', this.databases['thermistors']?.thermistors?.length);
            console.log('📊 Hotend count:', this.databases['Hotends']?.hotends?.length);
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
    /**
     * Tab 5: Probe & Leveling
     */
    renderTab5_Probe() {
        const probe = this.currentProfile.probe || { type: 'none', offsets: { x: 0, y: 0, z: 0 } };
        const bedLeveling = this.currentProfile.bedLeveling || { type: 'none', gridPoints: { x: 3, y: 3 }, fadeHeight: 0 };
        
        return `
            <div class="tab-content">
                <h3>📏 Probe & Leveling Configuration</h3>
                
                <h4>Probe Type</h4>
                <div class="form-group">
                    <label>Probe/Z-Endstop Type *</label>
                    <select id="probeType" class="form-control">
                        <option value="none" ${probe.type === 'none' ? 'selected' : ''}>None (Manual Leveling)</option>
                        <option value="bltouch" ${probe.type === 'bltouch' ? 'selected' : ''}>BLTouch</option>
                        <option value="3dtouch" ${probe.type === '3dtouch' ? 'selected' : ''}>3DTouch</option>
                        <option value="crtouch" ${probe.type === 'crtouch' ? 'selected' : ''}>CR Touch</option>
                        <option value="inductive" ${probe.type === 'inductive' ? 'selected' : ''}>Inductive (PL-08N, LJ12A3, etc.)</option>
                        <option value="capacitive" ${probe.type === 'capacitive' ? 'selected' : ''}>Capacitive</option>
                        <option value="optical" ${probe.type === 'optical' ? 'selected' : ''}>Optical</option>
                        <option value="microswitch" ${probe.type === 'microswitch' ? 'selected' : ''}>Microswitch</option>
                        <option value="pinda" ${probe.type === 'pinda' ? 'selected' : ''}>PINDA/SuperPINDA (Prusa)</option>
                        <option value="klicky" ${probe.type === 'klicky' ? 'selected' : ''}>Klicky Probe</option>
                        <option value="euclid" ${probe.type === 'euclid' ? 'selected' : ''}>Euclid Probe</option>
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
                            <option value="abl" ${bedLeveling.type === 'abl' ? 'selected' : ''}>Auto Bed Leveling (ABL)</option>
                            <option value="ubl" ${bedLeveling.type === 'ubl' ? 'selected' : ''}>Unified Bed Leveling (UBL)</option>
                            <option value="mbl" ${bedLeveling.type === 'mbl' ? 'selected' : ''}>Manual Bed Leveling (MBL)</option>
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
    
    /**
     * Tab 6: Motion Settings
     */
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
    
    /**
     * Tab 7: Advanced Features
     */
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
                        <input type="text" id="linearAdvanceTypeCustom" class="form-control" 
                               placeholder="Enter custom LA type"
                               style="display: none; margin-top: 10px;">
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
                        <input type="text" id="inputShapingCustom" class="form-control" 
                               placeholder="Enter custom input shaping"
                               style="display: none; margin-top: 10px;">
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
                        <input type="text" id="shaperTypeCustom" class="form-control" 
                               placeholder="Enter custom shaper"
                               style="display: none; margin-top: 10px;">
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
                        <input type="text" id="runoutSensorTypeCustom" class="form-control" 
                               placeholder="Enter custom sensor type"
                               style="display: none; margin-top: 10px;">
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
    /**
     * Tab 8: Safety Features
     */
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
                    <input type="text" id="powerLossRecoveryCustom" class="form-control" 
                           placeholder="Enter custom recovery type"
                           style="display: none; margin-top: 10px;">
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
    
    /**
     * Tab 9: Nozzle Inventory
     */
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
                            <input type="text" id="nozzleMaterialCustom" class="form-control" 
                                   placeholder="Enter custom material"
                                   style="display: none; margin-top: 10px;">
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
                            <input type="text" id="nozzleBrandCustom" class="form-control" 
                                   placeholder="Enter custom brand"
                                   style="display: none; margin-top: 10px;">
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
                            <input type="text" id="nozzleThreadCustom" class="form-control" 
                                   placeholder="Enter custom thread"
                                   style="display: none; margin-top: 10px;">
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
    
    /**
     * Render nozzle list
     */
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
                                    ${nozzle.thread ? `Thread: ${nozzle.thread} | ` : ''}
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
    
    /**
     * Get nozzle condition color
     */
    getNozzleConditionColor(condition) {
        switch(condition) {
            case 'new': return '#4caf50';
            case 'good': return '#2196f3';
            case 'worn': return '#ff9800';
            case 'damaged': return '#f44336';
            default: return '#757575';
        }
    }
    
    /**
     * Tab 10: Preferences
     */
    renderTab10_Preferences() {
        const prefs = this.currentProfile.preferences || {
            slicer: 'superslicer',
            materials: ['PLA']
        };
        
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
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matPLA" ${prefs.materials?.includes('PLA') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            PLA
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matPETG" ${prefs.materials?.includes('PETG') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            PETG
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matABS" ${prefs.materials?.includes('ABS') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            ABS
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matASA" ${prefs.materials?.includes('ASA') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            ASA
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matTPU" ${prefs.materials?.includes('TPU') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            TPU/Flex
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matNylon" ${prefs.materials?.includes('Nylon') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            Nylon
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matPC" ${prefs.materials?.includes('PC') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            Polycarbonate
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matCF" ${prefs.materials?.includes('CF') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            Carbon Fiber
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="matWood" ${prefs.materials?.includes('Wood') ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                            Wood PLA
                        </label>
                    </div>
                </div>
                
                <div class="form-group" style="margin-top: 15px;">
                    <label>Other Materials (comma-separated)</label>
                    <input type="text" id="matOther" class="form-control" 
                           placeholder="e.g., PP, HIPS, PVA, Metal-filled"
                           value="${prefs.materialsOther || ''}">
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
                    <input type="text" id="prefEnclosureCustom" class="form-control" 
                           placeholder="Enter custom enclosure type"
                           style="display: ${prefs.enclosure && prefs.enclosure.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
                    <p class="field-help">Enclosure helps with ABS/ASA printing and temperature stability</p>
                </div>
                
                <h4 style="margin-top: 25px;">Additional Notes</h4>
                <div class="form-group">
                    <label>Profile Notes</label>
                    <textarea id="profileNotes" rows="5" 
                              placeholder="Add any additional notes about your printer setup, upgrades, known issues, or tips...">${this.currentProfile.notes || ''}</textarea>
                    <p class="field-help">These notes will be included in exports to help others with similar setups</p>
                </div>
                
                <h4 style="margin-top: 25px;">Profile Metadata</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Created</label>
                        <input type="text" class="form-control" 
                               value="${this.currentProfile.created ? new Date(this.currentProfile.created).toLocaleString() : 'N/A'}" 
                               disabled>
                    </div>
                    <div class="form-group">
                        <label>Last Modified</label>
                        <input type="text" class="form-control" 
                               value="${this.currentProfile.modified ? new Date(this.currentProfile.modified).toLocaleString() : 'N/A'}" 
                               disabled>
                    </div>
                </div>
            </div>
        `;
    }
    
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
                <textarea id="m503Input" rows="10" placeholder="Paste your M503 output..." style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 4px; background: var(--background); color: var(--text-primary); font-family: monospace;"></textarea>
                <button class="btn-primary" id="parseM503Btn" style="margin-top: 10px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Parse & Apply M503</button>
                <div id="m503Result" style="display: none; margin-top: 15px;"></div>
            </div>
        `;
        
        // Add parse button handler
        document.getElementById('parseM503Btn').addEventListener('click', () => {
            this.parseAndApplyM503();
        });
    }
    
    /**
     * Parse M503 output and apply to profile
     */
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
            // Check if EEPROMParser is available
            if (typeof EEPROMParser === 'undefined') {
                throw new Error('EEPROM Parser not loaded. Please include eeprom-parser.js');
            }
            
            // Parse the M503 output
            const parsed = EEPROMParser.parseM503(m503Input);
            const summary = EEPROMParser.createSummary(parsed);
            
            // Apply parsed data to current profile
            this.applyParsedEEPROM(parsed);
            
            // Show success message with summary
            resultDiv.innerHTML = `
                <div style="background: var(--success-light); border: 2px solid var(--success); padding: 15px; border-radius: 6px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--success);">✅ M503 Parsed Successfully!</h4>
                    <p><strong>Firmware:</strong> ${summary.firmware}</p>
                    <p><strong>Settings Applied:</strong> Motion, PID, Steps, and more</p>
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
            
            // Add show warnings handler
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
    
    /**
     * Apply parsed EEPROM data to current profile
     */
    applyParsedEEPROM(parsed) {
        // Motion settings
        if (parsed.maxFeedrate) {
            if (!this.currentProfile.motion) this.currentProfile.motion = {};
            if (!this.currentProfile.motion.maxFeedrates) this.currentProfile.motion.maxFeedrates = {};
            
            if (parsed.maxFeedrate.x) this.currentProfile.motion.maxFeedrates.x = parsed.maxFeedrate.x;
            if (parsed.maxFeedrate.y) this.currentProfile.motion.maxFeedrates.y = parsed.maxFeedrate.y;
            if (parsed.maxFeedrate.z) this.currentProfile.motion.maxFeedrates.z = parsed.maxFeedrate.z;
            if (parsed.maxFeedrate.e) this.currentProfile.motion.maxFeedrates.e = parsed.maxFeedrate.e;
        }
        
        if (parsed.maxAccel) {
            if (!this.currentProfile.motion.maxAccel) this.currentProfile.motion.maxAccel = {};
            
            if (parsed.maxAccel.x) this.currentProfile.motion.maxAccel.x = parsed.maxAccel.x;
            if (parsed.maxAccel.y) this.currentProfile.motion.maxAccel.y = parsed.maxAccel.y;
            if (parsed.maxAccel.z) this.currentProfile.motion.maxAccel.z = parsed.maxAccel.z;
            if (parsed.maxAccel.e) this.currentProfile.motion.maxAccel.e = parsed.maxAccel.e;
        }
        
        if (parsed.jerk) {
            if (!this.currentProfile.motion.jerk) this.currentProfile.motion.jerk = {};
            
            if (parsed.jerk.x) this.currentProfile.motion.jerk.x = parsed.jerk.x;
            if (parsed.jerk.y) this.currentProfile.motion.jerk.y = parsed.jerk.y;
            if (parsed.jerk.z) this.currentProfile.motion.jerk.z = parsed.jerk.z;
            if (parsed.jerk.e) this.currentProfile.motion.jerk.e = parsed.jerk.e;
        }
        
        // E-steps
        if (parsed.esteps) {
            if (!this.currentProfile.motion.steps) this.currentProfile.motion.steps = {};
            this.currentProfile.motion.steps.e = parsed.esteps;
        }
        
        // PID settings
        if (parsed.pidHotend) {
            if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
            if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = { max: 275 };
            if (!this.currentProfile.temperature.hotend.pid) this.currentProfile.temperature.hotend.pid = {};
            
            this.currentProfile.temperature.hotend.pid.p = parsed.pidHotend.p;
            this.currentProfile.temperature.hotend.pid.i = parsed.pidHotend.i;
            this.currentProfile.temperature.hotend.pid.d = parsed.pidHotend.d;
        }
        
        if (parsed.pidBed) {
            if (!this.currentProfile.temperature.bed) this.currentProfile.temperature.bed = { max: 110 };
            if (!this.currentProfile.temperature.bed.pid) this.currentProfile.temperature.bed.pid = {};
            
            this.currentProfile.temperature.bed.pid.p = parsed.pidBed.p;
            this.currentProfile.temperature.bed.pid.i = parsed.pidBed.i;
            this.currentProfile.temperature.bed.pid.d = parsed.pidBed.d;
        }
        
        // Linear Advance
        if (parsed.linearAdvance !== null) {
            if (!this.currentProfile.advanced) this.currentProfile.advanced = {};
            if (!this.currentProfile.advanced.linearAdvance) this.currentProfile.advanced.linearAdvance = {};
            
            this.currentProfile.advanced.linearAdvance.k = parsed.linearAdvance;
            this.currentProfile.advanced.linearAdvance.enabled = parsed.linearAdvance > 0;
            
            // Set type based on firmware (M900 is Marlin command)
            if (parsed.linearAdvance > 0) {
                this.currentProfile.advanced.linearAdvance.type = 'marlin';
            }
        }
        
        // Z-offset
        if (parsed.zOffset !== null) {
            if (!this.currentProfile.probe) this.currentProfile.probe = { type: 'none', offsets: {} };
            if (!this.currentProfile.probe.offsets) this.currentProfile.probe.offsets = {};
            
            this.currentProfile.probe.offsets.z = parsed.zOffset;
        }
        
        // Bed size
        if (parsed.bedSize && parsed.bedSize.x) {
            if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
            
            this.currentProfile.bedSize.x = parsed.bedSize.x;
            this.currentProfile.bedSize.y = parsed.bedSize.y;
            this.currentProfile.bedSize.z = parsed.bedSize.z;
        }
        
        // Firmware info
        if (parsed.firmware) {
            this.currentProfile.firmwareVersion = parsed.firmware.version;
            if (parsed.firmware.name.toLowerCase().includes('marlin')) {
                this.currentProfile.firmwareType = 'marlin';
            } else if (parsed.firmware.name.toLowerCase().includes('klipper')) {
                this.currentProfile.firmwareType = 'klipper';
            }
        }
        
        // Update modified timestamp
        this.currentProfile.modified = new Date().toISOString();
        
        // Re-render current tab to show updated values
        this.renderCurrentTab();
        
        console.log('✅ EEPROM data applied to profile:', this.currentProfile);
    }
    
    /**
     * Render warnings from EEPROM parsing
     */
    renderWarnings(warnings) {
        if (!warnings || warnings.length === 0) {
            return '<p>No warnings or suggestions.</p>';
        }
        
        return warnings.map(w => {
            const icon = w.level === 'error' ? '❌' : w.level === 'warning' ? '⚠️' : 'ℹ️';
            const color = w.level === 'error' ? 'var(--error)' : w.level === 'warning' ? 'var(--warning)' : 'var(--info)';
            
            return `
                <div style="padding: 8px; margin: 5px 0; border-left: 3px solid ${color}; background: var(--background); border-radius: 4px;">
                    <strong style="color: ${color};">${icon} ${w.field.toUpperCase()}</strong>
                    <p style="margin: 5px 0;">${w.message}</p>
                    ${w.suggestion ? `<p style="margin: 5px 0; font-size: 0.9em; color: var(--text-secondary);">💡 ${w.suggestion}</p>` : ''}
                </div>
            `;
        }).join('');
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
        
        // File input change handler
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleEEPROMBackup(e.target.files[0]);
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
                this.handleEEPROMBackup(e.dataTransfer.files[0]);
            }
        });
    }
    
    /**
     * Handle EEPROM backup file upload
     */
    async handleEEPROMBackup(file) {
        const resultDiv = document.getElementById('eepromResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<p>⏳ Reading EEPROM backup file...</p>';
        
        // Check if EEPROMParser is available
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
            
            // Check file type
            if (file.name.endsWith('.json')) {
                // JSON backup - read as text and parse
                const text = await file.text();
                const json = JSON.parse(text);
                
                // Check if it's an M503 output or structured backup
                if (typeof json === 'string') {
                    // It's M503 text in JSON
                    parsed = EEPROMParser.parseM503(json);
                } else if (json.m503 || json.eeprom) {
                    // Structured backup with M503 field
                    parsed = EEPROMParser.parseM503(json.m503 || json.eeprom);
                } else {
                    throw new Error('Unrecognized JSON format. Expected M503 output or structured backup.');
                }
            } else if (file.name.endsWith('.zip')) {
                // ZIP backup - use parser's built-in ZIP handler
                parsed = await EEPROMParser.parseOctoPrintBackup(file);
            } else {
                throw new Error('Unsupported file type. Please upload .json or .zip file.');
            }
            
            if (!parsed || !parsed.parsed) {
                throw new Error('Failed to parse EEPROM data from backup file');
            }
            
            // Create summary
            const summary = EEPROMParser.createSummary(parsed);
            
            // Apply parsed data to profile
            this.applyParsedEEPROM(parsed);
            
            // Show success message
            resultDiv.innerHTML = `
                <div style="background: var(--success-light); border: 2px solid var(--success); padding: 15px; border-radius: 6px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--success);">✅ EEPROM Backup Parsed Successfully!</h4>
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Firmware:</strong> ${summary.firmware}</p>
                    <p><strong>Settings Applied:</strong> Motion, PID, Steps, and more</p>
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
            
            // Add show warnings handler
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
