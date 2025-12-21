/**
 * Safety Warning Gate
 * Blocks access to firmware configuration tools until user acknowledges safety warnings
 * 
 * @version 1.0.0
 * @requires None (standalone)
 */

class SafetyGate {
    constructor(options = {}) {
        this.options = {
            storageKey: 'firmwareSafetyAcknowledged',
            expirationHours: 24, // Force re-reading after 24 hours
            onAccept: options.onAccept || (() => {}),
            ...options
        };
        
        this.acknowledged = this.checkAcknowledgment();
        this.modal = null;
        
        // Initialize if needed
        if (!this.acknowledged) {
            this.createModal();
        }
    }
    
    /**
     * Check if user has acknowledged warnings recently
     */
    checkAcknowledgment() {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            if (!stored) return false;
            
            const data = JSON.parse(stored);
            const now = Date.now();
            const expirationTime = data.timestamp + (this.options.expirationHours * 60 * 60 * 1000);
            
            // Check if acknowledgment has expired
            if (now > expirationTime) {
                localStorage.removeItem(this.options.storageKey);
                return false;
            }
            
            return data.acknowledged === true;
        } catch (error) {
            console.error('Error checking safety acknowledgment:', error);
            return false;
        }
    }
    
    /**
     * Store acknowledgment with timestamp
     */
    storeAcknowledgment() {
        try {
            const data = {
                acknowledged: true,
                timestamp: Date.now(),
                version: '1.0.0' // Track which version of warnings was acknowledged
            };
            localStorage.setItem(this.options.storageKey, JSON.stringify(data));
            this.acknowledged = true;
        } catch (error) {
            console.error('Error storing safety acknowledgment:', error);
        }
    }
    
    /**
     * Create and display the safety warning modal
     */
    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="safety-gate-overlay" id="safetyGateOverlay">
                <div class="safety-gate-modal">
                    <div class="safety-gate-header">
                        <h2>⚠️ CRITICAL SAFETY WARNING ⚠️</h2>
                        <p class="safety-gate-subtitle">READ THIS BEFORE PROCEEDING</p>
                    </div>
                    
                    <div class="safety-gate-content">
                        <div class="safety-warning-box danger">
                            <h3>🚨 INCORRECT SETTINGS CAN PERMANENTLY DAMAGE YOUR PRINTER!</h3>
                        </div>
                        
                        <div class="safety-critical-points">
                            <h4>Critical Risks:</h4>
                            <ul>
                                <li>
                                    <strong>Wrong Board/MCU Selection:</strong>
                                    <ul>
                                        <li>Compiling firmware &gt;256KB for a 256KB MCU = <span class="danger-text">BRICKED BOARD</span></li>
                                        <li>Example: RCT6 (256KB) vs RET6 (512KB) - <strong>YOU MUST VERIFY YOUR CHIP!</strong></li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Temperature Settings:</strong>
                                    <ul>
                                        <li>Wrong thermistor type = <span class="danger-text">FIRE HAZARD</span></li>
                                        <li>Disabled thermal protection = <span class="danger-text">FIRE HAZARD</span></li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Motion Settings:</strong>
                                    <ul>
                                        <li>Wrong steps/mm = <span class="danger-text">CRASHED AXES</span></li>
                                        <li>Wrong endstop config = <span class="danger-text">CRUSHED COMPONENTS</span></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="safety-warning-box warning">
                            <h4>⚡ MANDATORY VERIFICATION STEPS:</h4>
                            <ol>
                                <li><strong>Physically verify your motherboard</strong> - Open your printer and read the chip</li>
                                <li><strong>Verify thermistor types</strong> - Check manufacturer specifications</li>
                                <li><strong>Confirm thermal protection is enabled</strong> - Never disable safety features</li>
                                <li><strong>Verify stepper drivers</strong> - Read the chip labels</li>
                                <li><strong>Check flash size after compiling</strong> - Must be under 95% capacity</li>
                            </ol>
                        </div>
                        
                        <div class="safety-warning-box info">
                            <h4>📚 Full Safety Documentation:</h4>
                            <p>
                                Complete verification procedures, recovery instructions, and detailed safety information:
                                <br>
                                <a href="../SharePoint_Nozzle_Selection_Guide/SAFETY_DISCLAIMER.md" target="_blank" class="safety-link">
                                    📖 Read Full Safety Disclaimer
                                </a>
                            </p>
                        </div>
                        
                        <div class="safety-acknowledgment">
                            <h4>Required Acknowledgments:</h4>
                            <label class="safety-checkbox">
                                <input type="checkbox" id="safetyCheck1">
                                <span>
                                    I understand that incorrect firmware settings can cause permanent damage to my printer, 
                                    create fire hazards, and result in personal injury or property damage.
                                </span>
                            </label>
                            
                            <label class="safety-checkbox">
                                <input type="checkbox" id="safetyCheck2">
                                <span>
                                    I will manually verify ALL settings (board, MCU, thermistors, drivers) against my 
                                    physical hardware before compiling or flashing any firmware.
                                </span>
                            </label>
                            
                            <label class="safety-checkbox">
                                <input type="checkbox" id="safetyCheck3">
                                <span>
                                    I understand that this tool provides assistance only, and I am solely responsible 
                                    for verifying the accuracy of all configuration data.
                                </span>
                            </label>
                        </div>
                        
                        <div class="safety-legal">
                            <p>
                                <strong>Legal Disclaimer:</strong> This tool provides configuration assistance only. 
                                We are not responsible for damaged printers, fires, injuries, or property damage. 
                                You assume all risks when modifying firmware. No warranty is provided, express or implied.
                            </p>
                        </div>
                    </div>
                    
                    <div class="safety-gate-footer">
                        <div class="safety-button-group">
                            <button id="safetyDeclineBtn" class="safety-btn-decline">
                                ❌ I Do Not Accept
                            </button>
                            <button id="safetyAcceptBtn" class="safety-btn-accept" disabled>
                                ✅ I Accept the Risks - Proceed
                            </button>
                        </div>
                        <p class="safety-note">
                            This acknowledgment expires after 24 hours to ensure you review safety information regularly.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get references
        this.modal = document.getElementById('safetyGateOverlay');
        const check1 = document.getElementById('safetyCheck1');
        const check2 = document.getElementById('safetyCheck2');
        const check3 = document.getElementById('safetyCheck3');
        const acceptBtn = document.getElementById('safetyAcceptBtn');
        const declineBtn = document.getElementById('safetyDeclineBtn');
        
        // Prevent closing modal by clicking overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.shakeModal();
            }
        });
        
        // Enable accept button only when all checkboxes are checked
        const checkboxes = [check1, check2, check3];
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const allChecked = checkboxes.every(cb => cb.checked);
                acceptBtn.disabled = !allChecked;
            });
        });
        
        // Handle accept button
        acceptBtn.addEventListener('click', () => {
            this.handleAccept();
        });
        
        // Handle decline button
        declineBtn.addEventListener('click', () => {
            this.handleDecline();
        });
        
        // Prevent scrolling body while modal is open
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Shake modal to indicate it can't be closed without accepting
     */
    shakeModal() {
        const modal = document.querySelector('.safety-gate-modal');
        modal.classList.add('shake');
        setTimeout(() => {
            modal.classList.remove('shake');
        }, 500);
    }
    
    /**
     * Handle user accepting the warnings
     */
    handleAccept() {
        this.storeAcknowledgment();
        
        // Fade out modal
        this.modal.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.remove();
            document.body.style.overflow = '';
            
            // Call callback
            if (typeof this.options.onAccept === 'function') {
                this.options.onAccept();
            }
        }, 300);
    }
    
    /**
     * Handle user declining the warnings
     * Closes modal and locks out firmware features
     */
    handleDecline() {
        // Ensure acknowledgment is not stored
        localStorage.removeItem(this.options.storageKey);
        this.acknowledged = false;
        
        // Show decline message
        alert(
            '⚠️ Safety Warnings Declined\n\n' +
            'Firmware configuration tools are now locked.\n\n' +
            'To use these tools, you must:\n' +
            '1. Read and understand the safety warnings\n' +
            '2. Accept responsibility for verifying all settings\n' +
            '3. Acknowledge the risks involved\n\n' +
            'You can restart this tool at any time to review the warnings again.'
        );
        
        // Fade out modal
        this.modal.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.remove();
            document.body.style.overflow = '';
            
            // Optionally redirect away from firmware tools
            // window.location.href = '../';
        }, 300);
    }
    
    /**
     * Check if user has acknowledged warnings (public method)
     */
    isAcknowledged() {
        return this.acknowledged;
    }
    
    /**
     * Force show warning modal (even if previously acknowledged)
     */
    forceShow() {
        if (this.modal) {
            this.modal.remove();
        }
        this.acknowledged = false;
        this.createModal();
    }
    
    /**
     * Show a mini warning banner for firmware-related actions
     */
    static showMiniWarning(element, message = 'Verify settings before using!') {
        const banner = document.createElement('div');
        banner.className = 'safety-mini-warning';
        banner.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">${message}</span>
            <a href="../SharePoint_Nozzle_Selection_Guide/SAFETY_DISCLAIMER.md" target="_blank" class="warning-link">
                Safety Info
            </a>
        `;
        
        element.insertAdjacentElement('beforebegin', banner);
    }
    
    /**
     * Block a button/feature until safety is acknowledged
     */
    static blockUntilAcknowledged(element, gate) {
        if (!gate.isAcknowledged()) {
            element.disabled = true;
            element.title = 'You must acknowledge safety warnings first';
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
            
            // Show why it's blocked
            const blockedNotice = document.createElement('div');
            blockedNotice.className = 'safety-blocked-notice';
            blockedNotice.innerHTML = '⚠️ Safety acknowledgment required';
            element.insertAdjacentElement('beforebegin', blockedNotice);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafetyGate;
}
