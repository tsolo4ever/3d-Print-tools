/* ============================================
   Navigation JavaScript
   ============================================ */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Mobile dropdown toggle
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    const dropdownMenu = document.querySelector('.nav-dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        // Toggle dropdown on click for mobile
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            this.textContent = dropdownMenu.style.display === 'block' ? 'Tools ▴' : 'Tools ▾';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                dropdownToggle.textContent = 'Tools ▾';
            }
        });
    }
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize theme settings modal
    initializeThemeSettingsModal();
    
    // Highlight active page
    highlightActivePage();
});

function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Theme Toggle Functionality with Auto-Switching
   ============================================
   PROJECT NOTE: Enhanced theme system with auto-switching
   - Stores user preference in localStorage
   - Applies theme on page load
   - Supports multiple themes: light, dark, high-contrast, high-contrast-dark
   - Auto-switching features:
     * Follow system preference (prefers-color-scheme)
     * Time-based switching (day/night based on hour)
     * User can override auto-switching with manual selection
   ============================================ */

function initializeThemeToggle() {
    // Initialize auto-switching features
    initializeAutoSwitching();
    
    // Check for dual dropdown system (Brand + Mode)
    const brandSelector = document.querySelector('.brand-selector');
    const modeSelector = document.querySelector('.mode-selector');
    
    if (brandSelector && modeSelector) {
        initializeDualDropdownThemeSystem(brandSelector, modeSelector);
        return;
    }
    
    // Check for new theme selector dropdown (legacy)
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector) {
        initializeThemeSelector(themeSelector);
        return;
    }
    
    // Fallback to legacy theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        initializeLegacyThemeToggle(themeToggle);
    }
}

/* ============================================
   Dual Dropdown Theme System (Brand + Mode)
   ============================================ */

function initializeDualDropdownThemeSystem(brandSelector, modeSelector) {
    // Restore saved selections
    const savedBrand = localStorage.getItem('themeBrand') || 'default';
    const savedMode = localStorage.getItem('themeMode') || 'light';
    
    brandSelector.value = savedBrand;
    modeSelector.value = savedMode;
    
    // Apply the combined theme
    applyDualDropdownTheme(savedBrand, savedMode);
    
    // Handle brand dropdown change
    brandSelector.addEventListener('change', function() {
        const brand = this.value;
        const mode = modeSelector.value;
        localStorage.setItem('themeBrand', brand);
        applyDualDropdownTheme(brand, mode);
    });
    
    // Handle mode dropdown change
    modeSelector.addEventListener('change', function() {
        const brand = brandSelector.value;
        const mode = this.value;
        localStorage.setItem('themeMode', mode);
        applyDualDropdownTheme(brand, mode);
    });
}

function applyDualDropdownTheme(brand, mode) {
    // Combine brand and mode to create theme name
    let themeName = '';
    
    if (brand === 'default') {
        // Default brand uses standard theme names
        themeName = mode;
    } else {
        // Brand themes combine with mode
        if (mode === 'light') {
            themeName = brand;
        } else if (mode === 'dark') {
            themeName = brand + '-dark';
        } else if (mode === 'high-contrast') {
            themeName = brand + '-high-contrast';
        } else if (mode === 'high-contrast-dark') {
            themeName = brand + '-high-contrast-dark';
        }
    }
    
    // Apply the theme
    applyTheme(themeName);
    
    // Set manual override flag if auto-switching is enabled
    const followSystem = localStorage.getItem('followSystemTheme') === 'true';
    const timeBased = localStorage.getItem('timeBasedSwitching') === 'true';
    
    if (followSystem || timeBased) {
        localStorage.setItem('manualThemeOverride', 'true');
        setTimeout(() => {
            localStorage.removeItem('manualThemeOverride');
        }, 24 * 60 * 60 * 1000);
    }
}

/* ============================================
   Auto-Switching Features
   ============================================ */

function initializeAutoSwitching() {
    const followSystem = localStorage.getItem('followSystemTheme') === 'true';
    const timeBasedSwitching = localStorage.getItem('timeBasedSwitching') === 'true';
    const useHighContrast = localStorage.getItem('useHighContrast') === 'true';
    const timeBasedHighContrast = localStorage.getItem('timeBasedHighContrast') === 'true';
    const brand = localStorage.getItem('themeBrand') || 'default';
    
    // Apply auto-switching logic
    let autoTheme = null;
    
    if (followSystem) {
        const baseTheme = getSystemPreferredTheme();
        if (useHighContrast) {
            // Apply brand-specific high contrast
            if (brand === 'default') {
                autoTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
            } else {
                autoTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
            }
        } else {
            autoTheme = baseTheme;
        }
    } else if (timeBasedSwitching) {
        const baseTheme = getTimeBasedTheme();
        if (timeBasedHighContrast) {
            // Apply brand-specific high contrast
            if (brand === 'default') {
                autoTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
            } else {
                autoTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
            }
        } else {
            autoTheme = baseTheme;
        }
    }
    
    // If auto-switching is enabled and no manual override exists
    if (autoTheme && !localStorage.getItem('manualThemeOverride')) {
        applyTheme(autoTheme);
    } else {
        // Apply saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }
    
    // Listen for system theme changes
    if (followSystem && window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('followSystemTheme') === 'true' && 
                !localStorage.getItem('manualThemeOverride')) {
                const newTheme = e.matches ? 'dark' : 'light';
                applyTheme(newTheme);
                updateThemeSelector(newTheme);
            }
        });
    }
    
    // Check time every minute for time-based switching (regular or high contrast)
    if (timeBasedSwitching) {
        setInterval(() => {
            const isTimeBased = localStorage.getItem('timeBasedSwitching') === 'true';
            const timeBasedHC = localStorage.getItem('timeBasedHighContrast') === 'true';
            const brand = localStorage.getItem('themeBrand') || 'default';
            
            if (isTimeBased && !localStorage.getItem('manualThemeOverride')) {
                const baseTheme = getTimeBasedTheme();
                let timeTheme;
                
                if (timeBasedHC) {
                    // Apply brand-specific high contrast
                    if (brand === 'default') {
                        timeTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
                    } else {
                        timeTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
                    }
                } else {
                    timeTheme = baseTheme;
                }
                
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (timeTheme !== currentTheme) {
                    applyTheme(timeTheme);
                    updateThemeSelector(timeTheme);
                }
            }
        }, 60000); // Check every minute
    }
    
    // Initialize auto-switching toggle buttons if they exist
    initializeAutoSwitchingToggles();
}

function getSystemPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function getTimeBasedTheme() {
    const hour = new Date().getHours();
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDarkTime = hour >= 19 || hour < 7;
    
    // Check if user has a brand theme selected
    if (savedTheme === 'prusa' || savedTheme === 'prusa-dark') {
        return isDarkTime ? 'prusa-dark' : 'prusa';
    }
    if (savedTheme === 'bambu' || savedTheme === 'bambu-dark') {
        return isDarkTime ? 'bambu-dark' : 'bambu';
    }
    if (savedTheme === 'creality' || savedTheme === 'creality-dark') {
        return isDarkTime ? 'creality-dark' : 'creality';
    }
    if (savedTheme === 'voron' || savedTheme === 'voron-dark') {
        return isDarkTime ? 'voron-dark' : 'voron';
    }
    if (savedTheme === 'ultimaker' || savedTheme === 'ultimaker-dark') {
        return isDarkTime ? 'ultimaker-dark' : 'ultimaker';
    }
    if (savedTheme === 'formlabs' || savedTheme === 'formlabs-dark') {
        return isDarkTime ? 'formlabs-dark' : 'formlabs';
    }
    if (savedTheme === 'anycubic' || savedTheme === 'anycubic-dark') {
        return isDarkTime ? 'anycubic-dark' : 'anycubic';
    }
    
    // Default light/dark switching
    return isDarkTime ? 'dark' : 'light';
}

function getHighContrastTimeBasedTheme() {
    const hour = new Date().getHours();
    // High contrast dark from 7 PM (19:00) to 7 AM (7:00)
    if (hour >= 19 || hour < 7) {
        return 'high-contrast-dark';
    }
    return 'high-contrast';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function updateThemeSelector(theme) {
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector) {
        themeSelector.value = theme;
    }
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        updateThemeIcon(themeToggle, theme);
    }
}

function initializeAutoSwitchingToggles() {
    // Follow system theme toggle
    const followSystemToggle = document.getElementById('followSystemTheme');
    if (followSystemToggle) {
        followSystemToggle.checked = localStorage.getItem('followSystemTheme') === 'true';
        followSystemToggle.addEventListener('change', function() {
            localStorage.setItem('followSystemTheme', this.checked);
            if (this.checked) {
                // Disable time-based when enabling follow system
                localStorage.setItem('timeBasedSwitching', 'false');
                const timeBasedToggle = document.getElementById('timeBasedSwitching');
                if (timeBasedToggle) timeBasedToggle.checked = false;
                
                // Clear manual override and apply system theme
                localStorage.removeItem('manualThemeOverride');
                const useHighContrast = localStorage.getItem('useHighContrast') === 'true';
                const baseTheme = getSystemPreferredTheme();
                const finalTheme = useHighContrast ? (baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast') : baseTheme;
                applyTheme(finalTheme);
                updateThemeSelector(finalTheme);
            }
        });
    }
    
    // Use high contrast with system preference
    const useHighContrastToggle = document.getElementById('useHighContrast');
    if (useHighContrastToggle) {
        useHighContrastToggle.checked = localStorage.getItem('useHighContrast') === 'true';
        useHighContrastToggle.addEventListener('change', function() {
            localStorage.setItem('useHighContrast', this.checked);
            // If follow system is enabled, reapply theme with high contrast
            if (localStorage.getItem('followSystemTheme') === 'true') {
                localStorage.removeItem('manualThemeOverride');
                const brand = localStorage.getItem('themeBrand') || 'default';
                const baseTheme = getSystemPreferredTheme();
                let finalTheme;
                
                if (this.checked) {
                    // Apply brand-specific high contrast
                    if (brand === 'default') {
                        finalTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
                    } else {
                        finalTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
                    }
                } else {
                    finalTheme = baseTheme;
                }
                
                applyTheme(finalTheme);
                updateThemeSelector(finalTheme);
            }
        });
    }
    
    // Time-based switching toggle
    const timeBasedToggle = document.getElementById('timeBasedSwitching');
    if (timeBasedToggle) {
        timeBasedToggle.checked = localStorage.getItem('timeBasedSwitching') === 'true';
        timeBasedToggle.addEventListener('change', function() {
            localStorage.setItem('timeBasedSwitching', this.checked);
            if (this.checked) {
                // Disable follow system when enabling time-based
                localStorage.setItem('followSystemTheme', 'false');
                const followSystemToggle = document.getElementById('followSystemTheme');
                if (followSystemToggle) followSystemToggle.checked = false;
                
                // Clear manual override and apply time-based theme
                localStorage.removeItem('manualThemeOverride');
                const timeBasedHighContrast = localStorage.getItem('timeBasedHighContrast') === 'true';
                const brand = localStorage.getItem('themeBrand') || 'default';
                const baseTheme = getTimeBasedTheme();
                let finalTheme;
                
                if (timeBasedHighContrast) {
                    // Apply brand-specific high contrast
                    if (brand === 'default') {
                        finalTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
                    } else {
                        finalTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
                    }
                } else {
                    finalTheme = baseTheme;
                }
                
                applyTheme(finalTheme);
                updateThemeSelector(finalTheme);
            }
        });
    }
    
    // Use high contrast with time-based switching
    const timeBasedHighContrastToggle = document.getElementById('timeBasedHighContrast');
    if (timeBasedHighContrastToggle) {
        timeBasedHighContrastToggle.checked = localStorage.getItem('timeBasedHighContrast') === 'true';
        timeBasedHighContrastToggle.addEventListener('change', function() {
            localStorage.setItem('timeBasedHighContrast', this.checked);
            // If time-based is enabled, reapply theme with high contrast
            if (localStorage.getItem('timeBasedSwitching') === 'true') {
                localStorage.removeItem('manualThemeOverride');
                const brand = localStorage.getItem('themeBrand') || 'default';
                const baseTheme = getTimeBasedTheme();
                let finalTheme;
                
                if (this.checked) {
                    // Apply brand-specific high contrast
                    if (brand === 'default') {
                        finalTheme = baseTheme === 'dark' ? 'high-contrast-dark' : 'high-contrast';
                    } else {
                        finalTheme = baseTheme === 'dark' ? brand + '-high-contrast-dark' : brand + '-high-contrast';
                    }
                } else {
                    finalTheme = baseTheme;
                }
                
                applyTheme(finalTheme);
                updateThemeSelector(finalTheme);
            }
        });
    }
}

// New theme selector (dropdown) functionality
function initializeThemeSelector(selector) {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    selector.value = currentTheme;
    
    // Theme selector change handler
    selector.addEventListener('change', function() {
        const newTheme = this.value;
        
        // Manual selection disables auto-switching temporarily
        const followSystem = localStorage.getItem('followSystemTheme') === 'true';
        const timeBased = localStorage.getItem('timeBasedSwitching') === 'true';
        
        if (followSystem || timeBased) {
            // Set a flag that user manually overrode the theme
            localStorage.setItem('manualThemeOverride', 'true');
            // Clear the override after 24 hours
            setTimeout(() => {
                localStorage.removeItem('manualThemeOverride');
            }, 24 * 60 * 60 * 1000);
        }
        
        // Apply new theme
        applyTheme(newTheme);
    });
}

// Legacy theme toggle button functionality (for backward compatibility)
function initializeLegacyThemeToggle(themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeToggle, currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Manual selection disables auto-switching temporarily
        const followSystem = localStorage.getItem('followSystemTheme') === 'true';
        const timeBased = localStorage.getItem('timeBasedSwitching') === 'true';
        
        if (followSystem || timeBased) {
            localStorage.setItem('manualThemeOverride', 'true');
            setTimeout(() => {
                localStorage.removeItem('manualThemeOverride');
            }, 24 * 60 * 60 * 1000);
        }
        
        applyTheme(newTheme);
        updateThemeIcon(themeToggle, newTheme);
    });
}

function updateThemeIcon(button, theme) {
    button.textContent = theme === 'light' ? '🌙' : '☀️';
    button.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
}

/* ============================================
   Theme Settings Modal
   ============================================ */

function initializeThemeSettingsModal() {
    const settingsBtn = document.querySelector('.theme-settings-btn');
    const modal = document.querySelector('.theme-settings-modal');
    const closeBtn = document.querySelector('.theme-settings-close');
    
    if (!settingsBtn || !modal) return;
    
    // Open modal
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        modal.classList.add('active');
    });
    
    // Close modal on close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}
