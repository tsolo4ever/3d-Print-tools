// Quick script to add the theme settings modal HTML snippet
// This is the HTML to add before </body> tag in each file

const modalHTML = `
    <!-- Theme Settings Modal -->
    <div class="theme-settings-modal">
        <div class="theme-settings-content">
            <div class="theme-settings-header">
                <h3>⚙️ Theme Settings</h3>
                <button class="theme-settings-close" aria-label="Close settings">✕</button>
            </div>

            <div class="theme-setting-group">
                <h4>🌍 Follow System Preference</h4>
                <p>Automatically match your operating system's light/dark theme setting.</p>
                <div class="theme-toggle-switch">
                    <div class="theme-toggle-label">
                        <strong>Sync with System</strong>
                        <span>Theme changes when your OS theme changes</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="followSystemTheme">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="theme-setting-group">
                <h4>🕐 Time-Based Auto-Switching</h4>
                <p>Automatically switch between light and dark themes based on time of day.</p>
                <div class="theme-toggle-switch">
                    <div class="theme-toggle-label">
                        <strong>Auto-Switch by Time</strong>
                        <span>Light theme: 7 AM - 7 PM • Dark theme: 7 PM - 7 AM</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="timeBasedSwitching">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div style="background: var(--info-light); border-left: 4px solid var(--info); padding: var(--spacing-md); margin: 0; border-radius: var(--radius-sm);">
                <strong>💡 Tip:</strong> Manual theme selection temporarily overrides auto-switching for 24 hours. Auto-switching will resume after that.
            </div>
        </div>
    </div>
`;

// Button HTML to add after theme-selector:
// <button class="theme-settings-btn" title="Theme Settings">⚙️</button>

console.log('Modal HTML ready for manual addition to files');
console.log('Files to update:');
console.log('- E-Steps_Calculator_Interactive/index.html');
console.log('- SharePoint_Nozzle_Selection_Guide/index.html');
console.log('- gear-calculator/index.html');
