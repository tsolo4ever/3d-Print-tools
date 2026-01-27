/**
 * Enhanced Printer Profiles - Modular Version
 * Clean orchestrator that uses modular tab system
 * 
 * @version 3.0.0 (Modular Refactor)
 * @requires storage-manager.js
 * @requires marlin-config-parser.js
 */

// Import all tab modules
import { Tab1PrinterInfo } from './tabs/tab-1-printer-info.js';
import { Tab2Hardware } from './tabs/tab-2-hardware.js';
import { Tab3Hotend } from './tabs/tab-3-hotend.js';
import { Tab4Bed } from './tabs/tab-4-bed.js';
import { Tab5Probe } from './tabs/tab-5-probe.js';
import { Tab6Motion } from './tabs/tab-6-motion.js';
import { Tab7Advanced } from './tabs/tab-7-advanced.js';
import { Tab8Safety } from './tabs/tab-8-safety.js';
import { Tab9Nozzles } from './tabs/tab-9-nozzles.js';
import { Tab10Preferences } from './tabs/tab-10-preferences.js';

class EnhancedPrinterProfiles {
  // Debug mode
  static DEBUG = true;

  /** Debug logger */
  static log(...args) {
    if (EnhancedPrinterProfiles.DEBUG) {
      console.log(...args);
    }
  }

  /**
   * Tab modules registry
   */
  static TAB_MODULES = {
    1: Tab1PrinterInfo,
    2: Tab2Hardware,
    3: Tab3Hotend,
    4: Tab4Bed,
    5: Tab5Probe,
    6: Tab6Motion,
    7: Tab7Advanced,
    8: Tab8Safety,
    9: Tab9Nozzles,
    10: Tab10Preferences
  };

  /**
   * Render compact view of saved printer profiles (for homepage)
   */
  static renderCompactView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    const printers = StorageManager.getPrinters();
    
    if (printers.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <p style="font-size: 1.2em; margin-bottom: 20px;">📦 No printer profiles saved yet</p>
          <button class="btn-primary" onclick="createPrinterProfile();">
            ➕ Create Your First Printer Profile
          </button>
        </div>
      `;
      return;
    }

    const printersHTML = printers.map(printer => {
      const modified = printer.modified ? new Date(printer.modified).toLocaleDateString() : 'N/A';
      return `
        <div class="printer-profile-card" style="padding: 15px; background: var(--background); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: var(--text-primary);">🖨️ ${printer.name || 'Unnamed Printer'}</h4>
            <p style="margin: 0; font-size: 0.9em; color: var(--text-secondary);">
              <strong>Model:</strong> ${printer.printerModel || 'N/A'} | 
              <strong>Firmware:</strong> ${printer.firmwareType || 'N/A'} ${printer.firmwareVersion || ''} | 
              <strong>Modified:</strong> ${modified}
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-secondary" onclick="createPrinterProfile('${printer.id}');">
              ✏️ Edit
            </button>
            <button class="btn-secondary" onclick="deletePrinterProfile('${printer.id}', '${containerId}');">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      ${printersHTML}
      <div style="text-align: center; margin-top: 20px;">
        <button class="btn-primary" onclick="createPrinterProfile();">
          ➕ Add New Printer Profile
        </button>
      </div>
    `;
  }

  constructor() {
    this.currentProfile = null;
    this.currentTab = 1;
    this.databases = {};
    this.modal = null;
    
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
    } catch (error) {
      console.error('❌ Error loading databases:', error);
    }
  }

  /** Show the enhanced profile editor */
  async show(profileId = null) {
    console.log('🔵 show() method started');
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'profileLoading';
    loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:30px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;text-align:center;';
    loadingDiv.innerHTML = '<h3>⏳ Loading Hardware Databases...</h3><p>Please wait...</p>';
    document.body.appendChild(loadingDiv);
    console.log('🔵 Loading indicator shown');

    // Wait for databases to load
    if (Object.keys(this.databases).length === 0) {
      console.log('🔵 Databases empty, loading...');
      await this.loadDatabases();
    } else {
      console.log('🔵 Databases already loaded');
    }

    // Remove loading indicator
    loadingDiv.remove();
    console.log('🔵 Loading indicator removed');

    // Load profile if editing existing
    if (profileId) {
      this.currentProfile = StorageManager.getPrinter(profileId);
      console.log('🔵 Loaded existing profile:', profileId);
    } else {
      this.currentProfile = this.createDefaultProfile();
      console.log('🔵 Created new default profile');
    }

    // Create and show modal
    console.log('🔵 About to call createModal()');
    this.createModal();
    console.log('🔵 createModal() completed');
    
    console.log('🔵 About to call renderCurrentTab()');
    this.renderCurrentTab();
    console.log('🔵 renderCurrentTab() completed');
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
      bedSize: { x: 220, y: 220, z: 250 },
      advanced: {},
      safety: {},
      nozzles: { inventory: [], currentNozzleId: null },
      preferences: {},
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
            <button class="tab-btn" data-tab="7">🚀 Advanced</button>
            <button class="tab-btn" data-tab="8">🛡️ Safety</button>
            <button class="tab-btn" data-tab="9">🔧 Nozzles</button>
            <button class="tab-btn" data-tab="10">⚙️ Preferences</button>
          </div>
          
          <!-- Tab Content -->
          <div class="modal-body-enhanced" id="profileTabContent"></div>
          
          <!-- Footer -->
          <div class="modal-footer-enhanced">
            <button class="btn-nav" id="profilePrevTab">← Previous</button>
            <div style="display: flex; gap: 10px;">
              <button class="btn-nav" id="profileExport" style="background: #2196f3; color: white;">📤 Export</button>
              <button class="btn-save" id="profileSave">💾 Save</button>
            </div>
            <button class="btn-nav" id="profileNextTab">Next →</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('enhancedProfileOverlay');
    this.setupEventListeners();
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

    // Save
    document.getElementById('profileSave').addEventListener('click', () => {
      this.saveProfile();
    });

    // Export
    document.getElementById('profileExport').addEventListener('click', () => {
      this.exportProfile();
    });
  }

  /** Switch tab */
  switchTab(tabNum) {
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabNum}"]`).classList.add('active');
    this.currentTab = tabNum;
    this.renderCurrentTab();
    
    // Update navigation buttons
    document.getElementById('profilePrevTab').disabled = (tabNum === 1);
    document.getElementById('profileNextTab').disabled = (tabNum === 10);
  }

  /** Render current tab using modular system */
  renderCurrentTab() {
    const content = document.getElementById('profileTabContent');
    const tabModule = EnhancedPrinterProfiles.TAB_MODULES[this.currentTab];
    
    if (!tabModule) {
      content.innerHTML = '<div class="tab-content"><p>❌ Tab module not found</p></div>';
      return;
    }

    // Render tab HTML
    content.innerHTML = tabModule.render(this.currentProfile, this.databases);

    // Attach tab-specific listeners with complete context
    const context = {
      // Core orchestrator methods
      renderCurrentTab: () => this.renderCurrentTab(),
      switchTab: (tabNum) => this.switchTab(tabNum),
      
      // Profile update
      onProfileUpdate: () => this.onProfileUpdate(),
      
      // Autofill methods that affect multiple tabs
      autofillBoardDetails: (boardId) => this.autofillBoardDetails(boardId),
      autofillFromHotend: (hotendId) => this.autofillFromHotend(hotendId),
      autofillFromPrinterDatabase: (printer) => this.autofillFromPrinterDatabase(printer),
      
      // Provide access to databases for tab-specific operations
      databases: this.databases,
      
      // Provide access to current profile
      currentProfile: this.currentProfile
    };

    tabModule.attachListeners(
      this.currentProfile,
      () => this.onProfileUpdate(),
      this.databases,
      context
    );
  }

  /** Called when profile is updated */
  onProfileUpdate() {
    this.currentProfile.modified = new Date().toISOString();
    // Update modal title if name changed
    const headerTitle = document.querySelector('.modal-header-enhanced h3');
    if (headerTitle && this.currentProfile.name) {
      headerTitle.textContent = `🖨️ ${this.currentProfile.name}`;
    }
  }

  /** Auto-fill board details */
  autofillBoardDetails(boardId) {
    if (!this.databases['marlin-boards']) return;
    const board = this.databases['marlin-boards'].boards.find(b => b.id === boardId);
    if (!board) return;

    EnhancedPrinterProfiles.log('✅ Board selected:', board.name);

    // Auto-populate drivers if board supports TMC
    if (board.supportsTMC && this.databases['stepper-drivers']) {
      const defaultDriver = 'TMC2209';
      const driver = this.databases['stepper-drivers'].drivers.find(d => 
        d.name.includes(defaultDriver) || d.id.includes(defaultDriver)
      );
      
      if (driver && this.currentProfile.hardware) {
        if (!this.currentProfile.hardware.drivers) this.currentProfile.hardware.drivers = {};
        ['x', 'y', 'z', 'e'].forEach(axis => {
          this.currentProfile.hardware.drivers[axis] = driver.id;
        });
        EnhancedPrinterProfiles.log(`✅ Auto-filled drivers: ${defaultDriver}`);
      }
    }

    this.renderCurrentTab();
  }

  /** Auto-fill from hotend selection */
  autofillFromHotend(hotendId) {
    if (!this.databases['Hotends']) return;
    const hotend = this.databases['Hotends'].hotends.find(h => h.id === hotendId);
    if (!hotend) return;

    EnhancedPrinterProfiles.log('🔥 Auto-filling from hotend:', hotend.name);

    if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
    if (!this.currentProfile.hardware.thermistors) this.currentProfile.hardware.thermistors = {};
    if (!this.currentProfile.temperature) this.currentProfile.temperature = {};
    if (!this.currentProfile.temperature.hotend) this.currentProfile.temperature.hotend = {};

    if (hotend.thermistor) {
      this.currentProfile.hardware.thermistors.hotend = hotend.thermistor.toString();
    }

    if (hotend.maxTemp) {
      this.currentProfile.temperature.hotend.max = hotend.maxTemp;
    }

    this.renderCurrentTab();
  }

  /** Export profile */
  exportProfile() {
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
      bedSize: this.currentProfile.bedSize,
      advanced: this.currentProfile.advanced,
      safety: this.currentProfile.safety,
      nozzles: this.currentProfile.nozzles,
      preferences: this.currentProfile.preferences,
      notes: this.currentProfile.notes,
      exportDate: new Date().toISOString(),
      exportVersion: '3.0.0'
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentProfile.printerModel || 'printer'}-profile.json`.replace(/\s+/g, '_');
    a.click();
    URL.revokeObjectURL(url);

    alert('📤 Profile exported successfully!');
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

  /** Auto-fill from printer database selection (affects multiple tabs) */
  autofillFromPrinterDatabase(printer) {
    if (!printer) return;

    EnhancedPrinterProfiles.log('🖨️ Auto-filling from printer database:', printer.name);

    // Basic info already set by Tab1's printer search

    // Hardware - Tab 2
    if (printer.stockBoard && this.databases['marlin-boards']) {
      const board = this.databases['marlin-boards'].boards.find(b => 
        b.id === printer.stockBoard || b.name.includes(printer.stockBoard)
      );
      if (board) {
        if (!this.currentProfile.hardware) this.currentProfile.hardware = {};
        this.currentProfile.hardware.board = board.id;
      }
    }

    // Bed size - Tab 4
    if (printer.bedSize) {
      if (!this.currentProfile.bedSize) this.currentProfile.bedSize = {};
      this.currentProfile.bedSize.x = printer.bedSize.x || 220;
      this.currentProfile.bedSize.y = printer.bedSize.y || 220;
      this.currentProfile.bedSize.z = printer.bedSize.z || 250;
    }

    // Hotend - Tab 3
    if (printer.stockHotend) {
      if (!this.currentProfile.hotend) this.currentProfile.hotend = {};
      this.currentProfile.hotend.type = printer.stockHotend;
    }

    // Probe - Tab 5
    if (printer.stockProbe) {
      if (!this.currentProfile.probe) this.currentProfile.probe = {};
      this.currentProfile.probe.type = printer.stockProbe;
    }

    this.onProfileUpdate();
    this.renderCurrentTab();

    alert(`✅ Auto-filled settings from ${printer.name}!\n\nReview the Hardware, Bed, Hotend, and Probe tabs.`);
  }
}

// Export for use in other modules
export default EnhancedPrinterProfiles;

// Also attach to window for backward compatibility
if (typeof window !== 'undefined') {
  window.EnhancedPrinterProfiles = EnhancedPrinterProfiles;
  
  // Create global helper functions for onclick handlers
  window.createPrinterProfile = function(profileId = null) {
    console.log('🔵 createPrinterProfile() called with profileId:', profileId);
    try {
      const ep = new EnhancedPrinterProfiles();
      console.log('🔵 EnhancedPrinterProfiles instance created');
      ep.show(profileId);
      console.log('🔵 ep.show() called');
    } catch (error) {
      console.error('❌ Error in createPrinterProfile:', error);
      alert('Error opening profile editor: ' + error.message);
    }
  };
  
  window.deletePrinterProfile = function(profileId, containerId) {
    if (confirm('Delete this printer profile?')) {
      StorageManager.deletePrinter(profileId);
      EnhancedPrinterProfiles.renderCompactView(containerId);
    }
  };
  
  console.log('✅ Global helper functions registered:', {
    createPrinterProfile: typeof window.createPrinterProfile,
    deletePrinterProfile: typeof window.deletePrinterProfile
  });
  
  // Auto-initialize compact view when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('printerProfiles');
      if (container) {
        EnhancedPrinterProfiles.renderCompactView('printerProfiles');
      }
    });
  } else {
    // DOM already loaded, initialize now
    const container = document.getElementById('printerProfiles');
    if (container) {
      EnhancedPrinterProfiles.renderCompactView('printerProfiles');
    }
  }
}
