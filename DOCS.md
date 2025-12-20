# 📚 Complete Documentation Guide

Comprehensive guide to all tools, systems, and features in the 3D Printer Calibration Suite.

---

## 🎯 Quick Navigation

- [Theme System](#theme-system) - Dark mode, brand themes, auto-switching
- [Printer Profiles](#printer-profiles) - Multi-printer management
- [Tool Template](#tool-template) - Create new tools
- [Tools Overview](#tools-overview) - All available tools
- [Project Structure](#project-structure) - File organization

---

## 🎨 Theme System

The suite features a comprehensive 18-theme system with auto-switching capabilities.

### Quick Setup (3 Steps)

#### 1. Link CSS Files in `<head>`
```html
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/navigation.css">
```

#### 2. Add Navigation Bar
```html
<nav class="suite-nav">
    <div class="container">
        <a href="../" class="logo">🔧 Calibration Suite</a>
        <button class="mobile-menu-toggle">☰</button>
        <div class="nav-links">
            <a href="../">Home</a>
            <a href="../E-Steps_Calculator_Interactive/">E-Steps</a>
            <a href="../SharePoint_Nozzle_Selection_Guide/">Nozzle Guide</a>
            <a href="../gear-calculator/">Gear Calc</a>
            <a href="../docs/">Docs</a>
        </div>
        <div class="nav-actions">
            <button class="theme-toggle" title="Toggle Theme">🌙</button>
        </div>
    </div>
</nav>
```

#### 3. Link JavaScript
```html
<script src="../assets/js/navigation.js"></script>
```

### Available Themes (18 Total)

#### Standard Themes
- **Light** - Default light theme
- **Dark** - Default dark theme
- **High Contrast Light** - WCAG AAA compliant
- **High Contrast Dark** - WCAG AAA compliant

#### Brand Themes (2 variants each)
- 🟠 **Prusa Orange** (#ff6b00) - Light & Dark
- 🟢 **Bambu Lab Green** (#00ae42) - Light & Dark
- 🔵 **Creality Blue** (#1e88e5) - Light & Dark
- 🔴 **Voron Red** (#d32f2f) - Light & Dark
- ⚙️ **Ultimaker Steel** (#546e7a) - Light & Dark
- 💎 **Formlabs Teal** (#00b8a9) - Light & Dark
- 🟣 **Anycubic Purple** (#9c27b0) - Light & Dark

### Auto-Switching Features

#### System Preference Sync 🌍
- Real-time OS theme matching
- Automatic updates when system theme changes
- Works on Windows, macOS, Linux

#### Time-Based Auto-Switching 🕐
- Light themes: 7 AM - 7 PM
- Dark themes: 7 PM - 7 AM
- Works with all brand themes
- Checks every minute for time changes

#### Manual Override
- 24-hour temporary pause when manually selecting theme
- Auto-resumes after 24 hours
- Respects user's immediate preference

### CSS Variables (Dark Mode Support)

All colors use CSS variables for automatic dark mode:

```css
/* Colors */
var(--background)      /* Page background */
var(--card-bg)         /* Card backgrounds */
var(--text-primary)    /* Main text */
var(--text-secondary)  /* Secondary text */
var(--border)          /* Borders */
var(--primary)         /* Brand color */

/* Spacing */
var(--spacing-xs)      /* 5px */
var(--spacing-sm)      /* 10px */
var(--spacing-md)      /* 20px */
var(--spacing-lg)      /* 40px */
var(--spacing-xl)      /* 60px */

/* Status Colors */
var(--success)         /* Green */
var(--warning)         /* Orange */
var(--error)           /* Red */
var(--info)            /* Blue */
```

### Refactoring Checklist

When converting an existing tool:
- [ ] Link `base.css` and `navigation.css`
- [ ] Add navigation bar with theme toggle
- [ ] Link `navigation.js`
- [ ] Replace hardcoded colors with CSS variables
- [ ] Replace `background: white` with `var(--card-bg)`
- [ ] Replace `color: #333` with `var(--text-primary)`
- [ ] Test in both light and dark modes

---

## 💾 Printer Profiles

Global localStorage system for managing multiple printers and tool history.

### Quick Start

#### Include Files
```html
<head>
    <link rel="stylesheet" href="../assets/css/printer-profiles.css">
</head>

<body>
    <div id="printerProfiles"></div>
    
    <script src="../assets/js/storage-manager.js"></script>
    <script src="../assets/js/printer-profiles.js"></script>
</body>
```

#### Initialize
```javascript
PrinterProfileManager.render('printerProfiles', {
    showLoadButton: true,
    onLoad: (printer) => {
        // Fill calculator with printer data
        document.getElementById('esteps').value = printer.esteps;
    }
});

// Listen for printer loaded event
document.addEventListener('printerLoaded', (event) => {
    const printer = event.detail;
    // Auto-fill your form
});
```

### StorageManager API

#### Printer Management
```javascript
StorageManager.getPrinters()                // Get all
StorageManager.getPrinter(id)               // Get one
StorageManager.addPrinter(data)             // Add
StorageManager.updatePrinter(id, data)      // Update
StorageManager.deletePrinter(id)            // Delete
StorageManager.clearPrinters()              // Clear all
```

#### Tool History
```javascript
StorageManager.addToolHistory('esteps', {
    currentValue: 425.0,
    newValue: 437.2,
    timestamp: new Date()
});

StorageManager.getToolHistory('esteps', 10) // Last 10
StorageManager.clearToolHistory('esteps')
```

#### Preferences
```javascript
StorageManager.getPreferences()
StorageManager.getPreference('theme', 'light')
StorageManager.setPreference('theme', 'dark')
StorageManager.updatePreferences({theme: 'dark'})
```

#### Export/Import
```javascript
StorageManager.exportToFile()               // Download JSON
StorageManager.exportData()                 // Get JSON string
StorageManager.importData(jsonString)       // Load from JSON
StorageManager.importFromFile(file)         // Load from file
```

### Data Structure

```javascript
{
    version: '1.0',
    preferences: {
        theme: 'light',
        units: 'metric',
        showTips: true
    },
    printers: [
        {
            id: 'printer_001',
            name: 'Ender 3 Max',
            esteps: 425.0,
            extruder: 'Sprite Pro',
            notes: 'My main printer',
            created: '2024-12-13T...',
            modified: '2024-12-13T...'
        }
    ],
    tools: {
        esteps: {
            history: [/* last 50 tests */]
        },
        flow: {
            history: []
        }
    }
}
```

### Features

- **Add/Edit/Delete** printers with modal dialogs
- **Load printer** into calculator (one-click)
- **Export/Import** for backup and sharing
- **First-time tip** (dismissible)
- **Notifications** for user feedback
- **Fully responsive** design
- **Theme-aware** styling

---

## 📋 Tool Template

The `_template-tool.html` file is your starting point for creating new calculator tools.

### Creating a New Tool (5 Steps)

#### Step 1: Copy Template
```bash
cp _template-tool.html new-tool-name/index.html
```

#### Step 2: Update Meta Information
```html
<title>Tool Name - 3D Printer Calibration Suite</title>
<meta name="description" content="Brief description">

<h1>🔧 Tool Name</h1>
<p>Brief description...</p>
```

#### Step 3: Fix Asset Paths
Since your tool is in a subdirectory, add `../` prefix:

```html
<!-- Change FROM -->
<link rel="stylesheet" href="assets/css/base.css">

<!-- Change TO -->
<link rel="stylesheet" href="../assets/css/base.css">
```

Do this for all:
- CSS links (3 files)
- JS script tags (3 files)
- Navigation logo link

#### Step 4: Customize Calculator
```html
<div class="form-group">
    <label for="input">Label</label>
    <input type="number" id="input">
</div>
```

Update JavaScript `calculate()` function:
```javascript
function calculate() {
    const value = parseFloat(document.getElementById('input').value);
    const result = value * 1.15;
    document.getElementById('resultValue').textContent = result.toFixed(2);
    document.getElementById('results').style.display = 'block';
}
```

#### Step 5: Add Instructions
Update step-by-step guide with tool-specific instructions.

### Available Components

#### Form Elements
```html
<!-- Text Input -->
<div class="form-group">
    <label for="input">Label</label>
    <input type="text" id="input">
</div>

<!-- Number Input -->
<input type="number" id="number" step="0.01">

<!-- Dropdown -->
<select id="select">
    <option value="1">Option 1</option>
</select>

<!-- Textarea -->
<textarea id="notes" rows="4"></textarea>
```

#### Multi-Column Forms
```html
<div class="form-row">
    <div class="form-group">
        <label>Input 1</label>
        <input type="text">
    </div>
    <div class="form-group">
        <label>Input 2</label>
        <input type="text">
    </div>
</div>
```

#### Buttons
```html
<!-- Primary -->
<button class="btn" onclick="calculate()">Calculate</button>

<!-- Secondary -->
<button class="btn btn-secondary" onclick="reset()">Reset</button>
```

#### Message Boxes
```html
<!-- Info (Blue) -->
<div class="info-box">
    <strong>ℹ️ Info:</strong> Message here
</div>

<!-- Warning (Orange) -->
<div class="warning-box">
    <strong>⚠️ Warning:</strong> Message here
</div>

<!-- Success (Green) -->
<div class="success-box">
    <strong>✅ Success:</strong> Message here
</div>
```

#### Result Display
```html
<div class="result-box">
    <h3>📊 Results</h3>
    <div class="result-value">123.45</div>
    <p>Explanation of result</p>
</div>
```

### Checklist

- [ ] Copy template to new folder
- [ ] Update `<title>` tag
- [ ] Update meta description
- [ ] Fix asset paths (add `../`)
- [ ] Replace example form
- [ ] Implement `calculate()` function
- [ ] Implement `reset()` function
- [ ] Update instructions
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test on mobile

---

## 🔧 Tools Overview

### Essential Calibration (6 Tools)

#### ✅ E-Steps Calculator
**Status:** Complete | **Complexity:** Low | **Impact:** Very High
- Calibrate extruder steps per millimeter
- Interactive guidance with test prints
- Preset library included

#### ✅ Nozzle Selection Guide
**Status:** Complete | **Complexity:** Low | **Impact:** High
- Choose the right nozzle size for your needs
- Material compatibility guide
- Purchasing recommendations

#### ✅ Gear Calculator
**Status:** Complete | **Complexity:** Medium | **Impact:** Medium
- Calculate gear ratios for custom builds
- Multiple configuration support

#### ✅ Flow Rate Calibration
**Status:** Complete | **Complexity:** Medium | **Impact:** Very High
- Single-wall calibration cube method
- Two-wall verification
- Multi-measurement averaging
- Material presets (PLA, PETG, ABS, etc.)
- Temperature adjustment calculator

#### 🚧 Temperature Tower Generator
**Status:** In Progress | **Complexity:** Medium | **Impact:** Very High
- Find optimal printing temperature
- Custom temperature ranges
- G-code generation
- Multiple tower types
- Evaluation guide

#### 🚧 Retraction Tuning
**Status:** In Progress | **Complexity:** Medium | **Impact:** High
- Eliminate stringing and blobs
- Distance/speed calculator
- Test model generator
- Bowden vs Direct Drive support

### Advanced Calibration (5 Tools)

#### 📋 Pressure/Linear Advance
**Status:** Planned | **Complexity:** Medium-High | **Impact:** Very High
- Eliminate corner bulging
- Pattern generator
- Marlin & Klipper support

#### 📋 PID Tuning Assistant
**Status:** Planned | **Complexity:** Low | **Impact:** High
- Stable temperature control
- Hotend & bed PID calibration
- Auto-tune G-code generator

#### 📋 First Layer Calibration
**Status:** Planned | **Complexity:** Low | **Impact:** Very High
- Perfect adhesion and Z-offset
- Test pattern generator

#### 📋 Belt Tension Calculator
**Status:** Planned | **Complexity:** Medium | **Impact:** High
- Proper belt tension
- Frequency measurement guide
- Resonance diagnostic

#### 📋 Volumetric Flow Rate
**Status:** Planned | **Complexity:** Medium | **Impact:** High
- Understand speed limits
- Hotend database
- Print time optimizer

### Print Quality (4 Tools)

#### 📋 Acceleration/Jerk Tuning
**Status:** Planned | **Complexity:** Medium | **Impact:** Very High
- Balance speed and quality
- Ringing elimination
- Test generators

#### 📋 Bridge Settings
**Status:** Planned | **Complexity:** Low | **Impact:** Medium
- Perfect bridging
- Cooling optimization

#### 📋 Support Optimizer
**Status:** Planned | **Complexity:** Medium | **Impact:** Medium
- Minimal supports
- Easy removal

#### 📋 Bed Leveling Visualizer
**Status:** Planned | **Complexity:** Medium | **Impact:** Medium
- Mesh visualization
- Warp detection

### Maintenance & Utilities

#### 📋 Filament Drying Guide
**Status:** Planned | **Complexity:** Low | **Impact:** High
- Drying time/temperature database
- Moisture detection
- Storage recommendations

#### 📋 Maintenance Tracker
**Status:** Planned | **Complexity:** Medium | **Impact:** Medium
- Maintenance schedule
- Component tracking

---

## 📁 Project Structure

```
Code/
├── index.html                              # Main hub page
├── README.md                               # Project overview
├── DOCS.md                                 # This documentation
├── CHANGELOG.md                            # Version history
├── MASTER_ROADMAP.md                       # Development roadmap
├── TOOLS_OVERVIEW.md                       # Tool quick reference
├── _template-tool.html                     # Template for new tools
│
├── assets/                                 # Shared resources
│   ├── css/
│   │   ├── base.css                       # Core styles & themes
│   │   ├── navigation.css                 # Nav component
│   │   └── printer-profiles.css           # Printer UI
│   ├── js/
│   │   ├── navigation.js                  # Theme switching
│   │   ├── printer-profiles.js            # Printer management
│   │   └── storage-manager.js             # LocalStorage API
│   └── images/                            # Shared images
│
├── E-Steps_Calculator_Interactive/        # E-Steps tool ✅
├── SharePoint_Nozzle_Selection_Guide/     # Nozzle tool ✅
├── gear-calculator/                       # Gear tool ✅
├── flow-calibration/                      # Flow tool ✅
├── temperature-tower/                     # Temperature tool ✅
├── retraction-tuning/                     # Retraction (planned)
│
└── docs/                                  # User documentation
    └── index.html                         # Doc hub
```

### File Size Summary
- Total CSS: ~8KB
- Total JS: ~2KB
- Each tool: ~40-50KB
- Project: <500KB

---

## 🎯 Recommended Calibration Order

### For New Users
1. **E-Steps Calculator** - Foundation calibration
2. **Flow Rate Calibration** - Fine-tune after E-steps
3. **Temperature Tower** - Find optimal temperature
4. **Retraction Tuning** - Eliminate stringing
5. **First Layer Calibration** - Perfect adhesion

### For Quality Issues

| Problem | Tool |
|---------|------|
| Stringing | Retraction Tuning |
| Poor adhesion | First Layer Calibration |
| Ringing/ghosting | Belt Tension / Acceleration |
| Under/over extrusion | E-Steps / Flow Rate |
| Corner quality | Pressure Advance |

### For Upgrading Hardware
1. E-Steps (if new extruder)
2. PID Tuning (if new hotend)
3. Pressure Advance
4. Flow Rate
5. Belt Tension (if CoreXY upgrade)

---

## 📊 Quick Reference

### Theme Colors
- E-Steps: Purple (#667eea)
- Flow: Blue (#45b7d1)
- Nozzle: Red (#ff6b6b)
- Gear: Teal (#4ecdc4)
- Temperature: Warm Red (#f38181)
- Retraction: Lavender (#aa96da)

### Browser Support
- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers

### Storage Limits
- ~5-10 MB per domain (localStorage)
- Can store 100+ printers comfortably
- History limited to 50 entries per tool
- Export feature for unlimited backups

---

## 💡 Tips & Best Practices

### General
- Always calibrate at actual printing temperature
- Use fresh, dry filament
- Take multiple measurements and average
- Document your settings
- Save to EEPROM (M500)

### Mobile Usage
- Use tablet at the printer
- Phone for quick reference
- Responsive design works on all devices

### Data Management
- Export settings regularly for backup
- Save printer profiles for quick setup
- Track test history for consistency

---

**Last Updated:** December 2024  
**Documentation Version:** 1.0  
**Status:** Complete & Current

For detailed development information, see **MASTER_ROADMAP.md**  
For quick tool reference, see **TOOLS_OVERVIEW.md**
