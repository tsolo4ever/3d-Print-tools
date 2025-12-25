/* ============================================
   Printer Profile Manager UI
   Reusable component for managing printer profiles
   ============================================ */

const PrinterProfileManager = {
    
    /**
     * Render the printer profiles section
     * @param {string} containerId - ID of container element
     * @param {object} options - Configuration options
     */
    render(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const defaults = {
            showExportImport: true,
            showLoadButton: true,
            onLoad: null, // Callback when "Load" is clicked
            emptyMessage: 'No printer profiles saved yet. Add one to get started!'
        };
        
        const config = { ...defaults, ...options };
        
        const printers = StorageManager.getPrinters();
        const storageInfo = StorageManager.getStorageInfo();
        
        // Determine default collapsed state: collapsed if profiles exist, open if none
        const isCollapsed = printers.length > 0;
        const collapseId = `profiles-collapse-${Date.now()}`;
        
        container.innerHTML = `
            <div class="printer-profiles-section">
                <div class="section-header section-header-collapsible" onclick="PrinterProfileManager.toggleSection('${collapseId}')">
                    <div class="section-header-content">
                        <h3>
                            <span class="collapse-indicator" id="${collapseId}-indicator">${isCollapsed ? '▶' : '▼'}</span>
                            📊 Your Saved Printer Profiles
                            <button class="info-tooltip" onclick="PrinterProfileManager.showInfoTooltip(event)">
                                ℹ️
                            </button>
                        </h3>
                        <p class="section-subtitle">
                            💾 Saved locally • 📤 Export to backup • ${printers.length} printer${printers.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                </div>
                
                <div class="section-collapsible-content" id="${collapseId}" style="display: ${isCollapsed ? 'none' : 'block'}">
                
                ${printers.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">🖨️</div>
                        <p>${config.emptyMessage}</p>
                    </div>
                ` : `
                    <div class="printers-grid">
                        ${printers.map(printer => this.renderPrinterCard(printer, config)).join('')}
                    </div>
                `}
                
                <div class="profile-actions">
                    <button class="btn-primary" onclick="PrinterProfileManager.showEnhancedEditor()">
                        ➕ Add New Printer
                    </button>
                    
                    ${config.showExportImport ? `
                        <div class="action-group">
                            <button class="btn-secondary" onclick="PrinterProfileManager.exportProfiles()">
                                📤 Export All
                            </button>
                            <button class="btn-secondary" onclick="PrinterProfileManager.importProfiles()">
                                📥 Import
                            </button>
                            ${printers.length > 0 ? `
                                <button class="btn-danger" onclick="PrinterProfileManager.confirmClearAll()">
                                    🗑️ Clear All
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
                </div>
            </div>
            
            ${this.renderModal()}
        `;
        
        // Show first-time tip if this is their first printer
        if (printers.length === 1 && StorageManager.getPreference('showTips', true)) {
            this.showFirstTimeTip();
        }
    },
    
    /**
     * Render a single printer card (row format with expandable details)
     */
    renderPrinterCard(printer, config) {
        const detailsId = `printer-details-${printer.id}`;
        return `
            <div class="printer-row" data-printer-id="${printer.id}">
                <div class="printer-row-header">
                    <button class="btn-expand" onclick="PrinterProfileManager.togglePrinterDetails('${detailsId}')" title="Show details">
                        <span class="expand-icon" id="${detailsId}-icon">+</span>
                    </button>
                    <div class="printer-row-info">
                        <h4 class="printer-row-name">${this.escapeHtml(printer.name)}</h4>
                        <span class="printer-row-summary">E-Steps: ${printer.esteps || 'N/A'} steps/mm</span>
                    </div>
                    <div class="printer-actions">
                        ${config.showLoadButton ? `
                            <button class="btn-icon" onclick="PrinterProfileManager.loadPrinter('${printer.id}')" title="Load into calculator">
                                📋
                            </button>
                        ` : ''}
                        <button class="btn-icon" onclick="PrinterProfileManager.editPrinter('${printer.id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="btn-icon btn-danger-icon" onclick="PrinterProfileManager.deletePrinter('${printer.id}')" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="printer-row-details" id="${detailsId}" style="display: none;">
                    <div class="printer-details-grid">
                        <div class="printer-detail">
                            <strong>E-Steps:</strong> ${printer.esteps || 'N/A'} steps/mm
                        </div>
                        ${printer.extruder ? `
                            <div class="printer-detail">
                                <strong>Extruder:</strong> ${this.escapeHtml(printer.extruder)}
                            </div>
                        ` : ''}
                        ${printer.notes ? `
                            <div class="printer-detail full-width">
                                <strong>Notes:</strong>
                                <div class="printer-notes">
                                    ${this.escapeHtml(printer.notes)}
                                </div>
                            </div>
                        ` : ''}
                        <div class="printer-detail full-width">
                            <strong>Last Modified:</strong> ${this.formatDate(printer.modified)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render the add/edit modal
     */
    renderModal() {
        return `
            <div id="printerModal" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="PrinterProfileManager.closeModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Add Printer Profile</h3>
                        <button class="modal-close" onclick="PrinterProfileManager.closeModal()">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="printerForm" onsubmit="PrinterProfileManager.savePrinter(event)">
                            <input type="hidden" id="printerId" value="">
                            
                            <div class="form-group">
                                <label for="printerName">Printer Name *</label>
                                <input type="text" id="printerName" required placeholder="e.g., Ender 3 Max">
                            </div>
                            
                            <div class="form-group">
                                <label for="printerEsteps">E-Steps *</label>
                                <input type="number" id="printerEsteps" step="0.01" required placeholder="e.g., 425.0">
                            </div>
                            
                            <div class="form-group">
                                <label for="printerExtruder">Extruder Type</label>
                                <input type="text" id="printerExtruder" placeholder="e.g., Sprite Pro">
                            </div>
                            
                            <div class="form-group">
                                <label for="printerNotes">Notes</label>
                                <textarea id="printerNotes" rows="3" placeholder="Optional notes about this printer..."></textarea>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn-secondary" onclick="PrinterProfileManager.closeModal()">
                                    Cancel
                                </button>
                                <button type="submit" class="btn-primary">
                                    💾 Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Show Enhanced Printer Profiles editor (10-tab modal)
     */
    showEnhancedEditor() {
        // Check if EnhancedPrinterProfiles is available
        if (typeof EnhancedPrinterProfiles !== 'undefined') {
            const profileEditor = new EnhancedPrinterProfiles();
            profileEditor.show();
            console.log('✅ Enhanced profiles modal opened!');
        } else {
            // Fallback to simple modal if enhanced profiles not loaded
            console.warn('EnhancedPrinterProfiles not loaded, using simple modal');
            this.showAddModal();
        }
    },
    
    /**
     * Show add printer modal (simple version - fallback)
     */
    showAddModal() {
        document.getElementById('modalTitle').textContent = 'Add Printer Profile';
        document.getElementById('printerForm').reset();
        document.getElementById('printerId').value = '';
        document.getElementById('printerModal').style.display = 'flex';
    },
    
    /**
     * Show edit printer modal (Enhanced profiles editor)
     */
    editPrinter(id) {
        const printer = StorageManager.getPrinter(id);
        if (!printer) return;
        
        // Check if EnhancedPrinterProfiles is available
        if (typeof EnhancedPrinterProfiles !== 'undefined') {
            const profileEditor = new EnhancedPrinterProfiles();
            profileEditor.show(id); // Pass ID to load existing profile
            console.log('✅ Enhanced profiles editor opened for:', printer.name);
        } else {
            // Fallback to simple modal if enhanced profiles not loaded
            console.warn('EnhancedPrinterProfiles not loaded, using simple modal');
            document.getElementById('modalTitle').textContent = 'Edit Printer Profile';
            document.getElementById('printerId').value = printer.id;
            document.getElementById('printerName').value = printer.name || '';
            document.getElementById('printerEsteps').value = printer.esteps || '';
            document.getElementById('printerExtruder').value = printer.extruder || '';
            document.getElementById('printerNotes').value = printer.notes || '';
            document.getElementById('printerModal').style.display = 'flex';
        }
    },
    
    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('printerModal').style.display = 'none';
    },
    
    /**
     * Save printer (add or update)
     */
    savePrinter(event) {
        event.preventDefault();
        
        const id = document.getElementById('printerId').value;
        const printer = {
            name: document.getElementById('printerName').value,
            esteps: parseFloat(document.getElementById('printerEsteps').value),
            extruder: document.getElementById('printerExtruder').value,
            notes: document.getElementById('printerNotes').value
        };
        
        if (id) {
            // Update existing
            StorageManager.updatePrinter(id, printer);
            this.showNotification('✅ Printer profile updated!');
        } else {
            // Add new
            StorageManager.addPrinter(printer);
            this.showNotification('✅ Printer profile saved!');
            
            // Show first-time tip if this is their first printer
            if (StorageManager.getPrinters().length === 1 && StorageManager.getPreference('showTips', true)) {
                setTimeout(() => this.showFirstTimeTip(), 500);
            }
        }
        
        this.closeModal();
        this.refresh();
    },
    
    /**
     * Delete printer with confirmation
     */
    deletePrinter(id) {
        const printer = StorageManager.getPrinter(id);
        if (!printer) return;
        
        if (confirm(`Delete "${printer.name}"?\n\nThis cannot be undone.`)) {
            StorageManager.deletePrinter(id);
            this.showNotification('🗑️ Printer profile deleted');
            this.refresh();
        }
    },
    
    /**
     * Load printer data into calculator (callback)
     */
    loadPrinter(id) {
        const printer = StorageManager.getPrinter(id);
        if (!printer) return;
        
        // Trigger callback if provided
        const event = new CustomEvent('printerLoaded', { detail: printer });
        document.dispatchEvent(event);
        
        this.showNotification(`📋 Loaded: ${printer.name}`);
    },
    
    /**
     * Export all profiles
     */
    exportProfiles() {
        if (StorageManager.exportToFile()) {
            this.showNotification('📤 Backup downloaded!');
        } else {
            this.showNotification('❌ Export failed', 'error');
        }
    },
    
    /**
     * Import profiles
     */
    importProfiles() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                await StorageManager.importFromFile(file);
                this.showNotification('📥 Profiles imported!');
                this.refresh();
            } catch (error) {
                this.showNotification('❌ Import failed: Invalid file', 'error');
            }
        };
        
        input.click();
    },
    
    /**
     * Confirm and clear all profiles
     */
    confirmClearAll() {
        const confirmed = confirm(
            '⚠️ Delete All Printer Profiles?\n\n' +
            'This will permanently delete all saved printer profiles.\n\n' +
            '💡 Tip: Export first to backup!'
        );
        
        if (confirmed) {
            StorageManager.clearPrinters();
            this.showNotification('🗑️ All profiles cleared');
            this.refresh();
        }
    },
    
    /**
     * Show info tooltip
     */
    showInfoTooltip(event) {
        event.stopPropagation();
        alert(
            '💾 Printer Profiles Info\n\n' +
            '• Your profiles are saved locally in your browser\n' +
            '• Click "Export All" to download a backup file\n' +
            '• Save the backup file to Documents or cloud storage\n' +
            '• Use "Import" to restore from a backup file\n' +
            '• Share backup files with other devices or users\n\n' +
            'Your data stays private and under your control!'
        );
    },
    
    /**
     * Show first-time tip
     */
    showFirstTimeTip() {
        const overlay = document.createElement('div');
        overlay.className = 'tip-overlay';
        overlay.innerHTML = `
            <div class="tip-modal">
                <div class="tip-header">
                    ✅ Printer profile saved!
                </div>
                <div class="tip-body">
                    <p><strong>💡 Pro Tip:</strong></p>
                    <p>Click <strong>"Export All"</strong> to save a backup file. You can import it anytime to restore your profiles or use them on another device!</p>
                </div>
                <div class="tip-footer">
                    <button class="btn-secondary" onclick="PrinterProfileManager.dismissTip(false)">
                        Don't show again
                    </button>
                    <button class="btn-primary" onclick="PrinterProfileManager.dismissTip(true)">
                        Got it!
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },
    
    /**
     * Dismiss first-time tip
     */
    dismissTip(showAgain) {
        if (!showAgain) {
            StorageManager.setPreference('showTips', false);
        }
        const overlay = document.querySelector('.tip-overlay');
        if (overlay) {
            overlay.remove();
        }
    },
    
    /**
     * Show notification
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    /**
     * Refresh the display
     */
    refresh() {
        const container = document.querySelector('.printer-profiles-section')?.parentElement;
        if (container) {
            this.render(container.id);
        }
    },
    
    /**
     * Utility: Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Toggle collapsible section
     */
    toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        const indicator = document.getElementById(`${sectionId}-indicator`);
        
        if (!section || !indicator) return;
        
        const isCurrentlyHidden = section.style.display === 'none';
        
        if (isCurrentlyHidden) {
            section.style.display = 'block';
            indicator.textContent = '▼';
        } else {
            section.style.display = 'none';
            indicator.textContent = '▶';
        }
    },
    
    /**
     * Toggle printer details (expand/collapse row)
     */
    togglePrinterDetails(detailsId) {
        const details = document.getElementById(detailsId);
        const icon = document.getElementById(`${detailsId}-icon`);
        
        if (!details || !icon) return;
        
        const isCurrentlyHidden = details.style.display === 'none';
        
        if (isCurrentlyHidden) {
            details.style.display = 'block';
            icon.textContent = '−';
            icon.parentElement.setAttribute('title', 'Hide details');
        } else {
            details.style.display = 'none';
            icon.textContent = '+';
            icon.parentElement.setAttribute('title', 'Show details');
        }
    },
    
    /**
     * Utility: Format date
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.PrinterProfileManager = PrinterProfileManager;
    
    // Listen for profile saved event from Enhanced Profiles
    window.addEventListener('printerProfileSaved', () => {
        console.log('✅ Profile saved event received - refreshing display');
        PrinterProfileManager.refresh();
    });
}
