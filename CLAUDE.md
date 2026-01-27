# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**3D Printer Calibration Suite** - A comprehensive web-based toolkit for 3D printer calibration and optimization. Pure HTML/CSS/JavaScript with no build process, no external dependencies, and no backend. All data stored in browser localStorage with export/import capabilities.

**Live Site**: https://tsolo4ever.github.io/3d-Print-tools

## CRITICAL RULES - READ FIRST

### Backup Before Editing
**ALWAYS create a .bak backup before modifying any existing file:**

```bash
# Before editing a file
cp index.html index.html.bak
cp assets/js/storage-manager.js assets/js/storage-manager.js.bak

# Or use a text editor's backup feature
```

**Why**: This is a live website. If changes break functionality, we need immediate rollback capability.

### Git Push Policy
**DO NOT push changes until:**
1. Local testing is complete
2. All functionality verified working
3. Explicitly approved by user

The live site auto-deploys from GitHub Pages, so untested changes go live immediately.

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Custom Properties for theming
- **Storage**: Browser localStorage API (~10MB limit)
- **Framework**: None (zero dependencies)
- **Build**: None required (just open HTML files)

## Development Workflow

### Running Locally

```bash
# Option 1: Open directly
open index.html  # or double-click in file browser

# Option 2: Python HTTP server (recommended for testing localStorage)
python -m http.server 8000
# Open: http://localhost:8000

# Option 3: Node HTTP server
npx http-server
```

**Important**: Use HTTP server (not file://) for full localStorage functionality.

### File Structure

```
3d-Print-tools/
├── index.html                    # Main dashboard/hub
├── assets/
│   ├── css/
│   │   ├── base.css             # Theme system (18 themes)
│   │   ├── navigation.css       # Nav & theme controls
│   │   ├── printer-profiles.css # Profile manager UI
│   │   └── enhanced-profiles.css # 10-tab profile editor
│   ├── js/
│   │   ├── storage-manager.js           # Core localStorage API
│   │   ├── printer-profiles.js          # Profile list UI
│   │   ├── enhanced-printer-profiles.js # 3,268-line profile editor
│   │   ├── marlin-config-parser.js      # Configuration.h parser
│   │   ├── eeprom-parser.js             # M503 output parser
│   │   ├── navigation.js                # Theme switching
│   │   └── safety-gate.js               # Safety warnings
│   └── data/
│       ├── printer-profiles.json        # 50+ printer presets
│       ├── marlin-boards-V2.json        # Board database
│       ├── stepper-drivers-V2.json      # Driver database
│       ├── thermistors-V2.json          # Thermistor types
│       ├── Hotends.json                 # Hotend configs
│       └── maps/marlin/                 # Config mappings (38 files)
├── E-Steps_Calculator_Interactive/
├── flow-calibration/
├── gear-calculator/
├── temperature-tower/
├── retraction-tuning/
├── pressure-advance/
├── pid-tuning/
└── firmware-helper/
```

## Core Architecture

### 1. Theme System

**18 Theme Variants**: 7 brands × (light + dark) + 4 base themes

**Implementation** (`base.css`):
```css
:root {
    /* Primary brand colors */
    --primary: #0078d4;
    --primary-hover: #005a9e;

    /* Tool-specific accents */
    --esteps-accent: #667eea;
    --nozzle-accent: #ff6b6b;
    --gear-accent: #4ecdc4;

    /* Semantic colors */
    --text-primary: #333;
    --background: #f5f5f5;
    --card-bg: white;

    /* Spacing scale */
    --spacing-xs: 5px;
    --spacing-md: 20px;
    --spacing-lg: 40px;
}

[data-theme="dark"] {
    --background: #1a1a1a;
    --card-bg: #2d2d2d;
    --text-primary: #e0e0e0;
}

[data-theme="creality"] { --primary: #FF6B35; }
[data-theme="prusa"] { --primary: #EC1C24; }
[data-theme="bambu"] { --primary: #1BB0CC; }
```

**Theme Switching** (`navigation.js`):
- Dual dropdown: Brand selector + Mode selector
- Stored in: `localStorage['themeBrand']` and `localStorage['themeMode']`
- Applied via: `html.dataset.theme = 'brand-mode'`

### 2. Storage Manager (Core Data Layer)

**File**: `assets/js/storage-manager.js`

**Data Structure**:
```javascript
{
    version: '1.0',
    created: '2024-12-30T...',
    lastModified: '2025-01-27T...',
    preferences: {
        theme: 'creality-light',
        units: 'metric',
        showTips: true
    },
    printers: [
        {
            id: 'printer_1234567890',
            name: 'My Ender 3',
            printerModel: 'ENDER3_V2',
            firmwareType: 'marlin',
            firmwareVersion: '2.1.2.6',
            hardware: { motherboard, drivers, thermistors, ... },
            motion: { stepsPerMM, maxFeedrate, ... },
            hotend: { type, heaterType, maxFlow, ... },
            probe: { type, offset, ... },
            advanced: { linearAdvance, arcSupport, ... },
            nozzles: [{ size: 0.4, material: 'brass', installed: true }],
            created: '...',
            modified: '...'
        }
    ],
    tools: {
        'e-steps': {
            history: [
                { id, timestamp, input, output, notes }
            ]
        }
    }
}
```

**Key Methods**:
- `addPrinter(printer)` - Add new profile
- `updatePrinter(id, updates)` - Update existing
- `deletePrinter(id)` - Remove profile
- `getPrinter(id)` - Get single profile
- `getAllPrinters()` - Get all profiles
- `exportToFile()` - Download JSON backup
- `importFromFile(json)` - Restore from backup
- `getToolData(toolName)` - Get tool-specific data
- `saveToolData(toolName, data)` - Save tool data
- `addToolHistory(toolName, entry)` - Add history entry

**Migration System**:
```javascript
migratePrinterProfiles() {
    // Detects legacy profiles
    // Auto-upgrades to current schema
    // Preserves all existing data
}
```

### 3. Printer Profile System

**Simple View** (`printer-profiles.js`):
- List all saved profiles
- Expandable rows with details
- Load, Edit, Delete actions
- Triggers EnhancedPrinterProfiles modal for editing

**Enhanced Editor** (`enhanced-printer-profiles.js` - 3,268 lines):

**10-Tab System**:
1. **Printer Info** - Name, firmware type/version, model search
2. **Hardware** - Board, drivers, thermistors, display
3. **Hotend** - Type, heater, max flow, PID tuning
4. **Bed** - Heater type, size, temperature limits
5. **Probe** - Type, offsets, Z-min pin usage
6. **Motion** - Steps/mm, feedrates, acceleration, jerk
7. **Advanced** - Linear advance, arc support, nozzle park
8. **Safety** - Thermal protection, runaway detection
9. **Nozzles** - Inventory management
10. **Preferences** - Slicer choice, common materials

**Configuration Import**:
- Upload `Configuration.h` file (Marlin)
- Paste M503 output (EEPROM)
- Auto-fills compatible fields
- Uses MarlinConfigParser (safe parsing without eval)

### 4. Configuration Parser

**File**: `assets/js/marlin-config-parser.js`

**Purpose**: Parse Marlin firmware config files without unsafe `eval()` or `new Function()`

**Features**:
- Two-pass parsing (conditionals first, then variables)
- Preprocessor directives: `#if/#elif/#else/#endif`, `#ifdef/#ifndef`, `#undef`
- Block comment stripping
- Numeric parsing (negative, hex, float)
- Array coercion via elementType
- Feature flag tracking

**Usage**:
```javascript
const parser = new MarlinConfigParser();
const config = await parser.parseConfigFile(fileContent);
// Returns: { MOTHERBOARD: 'BOARD_CREALITY_V4', TEMP_SENSOR_0: 1, ... }
```

**Firmware Variant Support**:
```javascript
mappingSets: {
    th3d: { files: 7 mapping files },
    marlin: { files: 2 mapping files },
    custom: { configurable }
}
```

### 5. Safety System

**File**: `assets/js/safety-gate.js`

**Purpose**: Pre-blocks dangerous firmware configuration tools

**Warnings**:
- MCU flash size mismatches
- Thermistor type consequences
- Endstop configuration dangers
- Motion setting validation

**Mechanism**:
- Requires 2-checkbox acknowledgment
- 24-hour expiration on acknowledgment
- Stores timestamp in localStorage
- Blocks tool access until acknowledged

## Common Patterns

### Adding a New Tool

1. **Create directory**: `my-tool/`
2. **Create HTML file**: `my-tool/index.html`
3. **Import base styles**:
   ```html
   <link rel="stylesheet" href="../assets/css/base.css">
   <link rel="stylesheet" href="../assets/css/navigation.css">
   ```
4. **Use theme variables**:
   ```css
   .tool-card {
       background: var(--card-bg);
       color: var(--text-primary);
       border-top: 4px solid var(--my-tool-accent);
   }
   ```
5. **Add to main navigation** in `index.html`
6. **Use StorageManager** for data persistence:
   ```javascript
   <script src="../assets/js/storage-manager.js"></script>
   <script>
   // Save calculation
   StorageManager.addToolHistory('my-tool', {
       timestamp: new Date().toISOString(),
       input: { ... },
       output: { ... }
   });
   </script>
   ```

### Working with Printer Profiles

**Load a profile**:
```javascript
const printer = StorageManager.getPrinter(printerId);
if (printer) {
    // Use printer.motion.stepsPerMM.e for E-steps
    // Use printer.hotend.maxFlow for flow rate
}
```

**List all profiles**:
```javascript
const printers = StorageManager.getAllPrinters();
printers.forEach(p => {
    console.log(`${p.name}: ${p.printerModel}`);
});
```

**Update profile**:
```javascript
StorageManager.updatePrinter(printerId, {
    motion: {
        ...printer.motion,
        stepsPerMM: { ...printer.motion.stepsPerMM, e: 93 }
    }
});
```

### Event Communication Between Components

**Dispatch custom event**:
```javascript
const event = new CustomEvent('printerProfileSaved', {
    detail: { printerId: 'printer_123' }
});
document.dispatchEvent(event);
```

**Listen for event**:
```javascript
document.addEventListener('printerProfileSaved', (e) => {
    console.log('Printer saved:', e.detail.printerId);
    refreshUI();
});
```

### Modal Pattern

**Create modal**:
```javascript
const modalHTML = `
    <div class="modal" id="myModal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>My Modal</h2>
                <button onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <!-- Content -->
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="saveModal()">Save</button>
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);
```

**Show/hide**:
```javascript
document.getElementById('myModal').style.display = 'flex';  // Show
document.getElementById('myModal').style.display = 'none';  // Hide
document.body.style.overflow = 'hidden';  // Disable body scroll
document.body.style.overflow = 'auto';    // Re-enable body scroll
```

## Data Reference Files

### Loading Reference Data

**Pattern** (from `enhanced-printer-profiles.js`):
```javascript
async loadDatabases() {
    const dbNames = ['marlin-boards-V2', 'stepper-drivers-V2', 'thermistors-V2'];
    const promises = dbNames.map(name =>
        fetch(`../assets/data/${name}.json`)
            .then(r => r.json())
            .catch(err => {
                console.warn(`Failed to load ${name}:`, err);
                return null;
            })
    );

    const results = await Promise.all(promises);
    this.databases = {
        boards: results[0],
        drivers: results[1],
        thermistors: results[2]
    };
}
```

### Key Reference Files

- `printer-profiles.json` - 50+ common printer presets
- `marlin-boards-V2.json` - Motherboard database with pin configurations
- `stepper-drivers-V2.json` - Driver database (TMC, A4988, etc.)
- `thermistors-V2.json` - Thermistor type database
- `Hotends.json` - Hotend configurations (E3D, Volcano, etc.)
- `bed-probes.json` - Probe types (BLTouch, inductive, etc.)
- `heaters.json` - Heater specifications
- `displays.json` - Display types

## Testing Checklist

When making changes, verify:

### Theme System
- [ ] All 18 themes render correctly
- [ ] Theme preference persists on reload
- [ ] Tool-specific accent colors visible
- [ ] Dark mode has sufficient contrast
- [ ] High contrast mode meets WCAG AAA

### Storage Manager
- [ ] Can create new printer profile
- [ ] Can update existing profile
- [ ] Can delete profile (with confirmation)
- [ ] Export creates valid JSON file
- [ ] Import restores data correctly
- [ ] Tool history saves and retrieves

### Profile Editor
- [ ] All 10 tabs load and render
- [ ] Tab switching preserves unsaved changes
- [ ] Save button updates profile in localStorage
- [ ] Configuration.h import populates fields
- [ ] M503 paste populates fields
- [ ] Validation prevents invalid data

### Individual Tools
- [ ] Tool loads without errors
- [ ] Calculations are accurate
- [ ] Results can be saved to history
- [ ] Printer profile can be loaded
- [ ] Export/print functionality works

### Cross-Browser
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Common Issues & Solutions

### localStorage Full

**Error**: "QuotaExceededError: localStorage quota exceeded"

**Solution**:
1. Export data first: `StorageManager.exportToFile()`
2. Clear old data: `StorageManager.clearAllData()`
3. Import only needed profiles

**Prevention**: Limit tool history to 50 entries per tool

### Theme Not Applying

**Issue**: Theme variables not rendering

**Check**:
1. `<link>` to `base.css` present?
2. `navigation.js` loaded?
3. `data-theme` attribute on `<html>`?
4. localStorage has `themeBrand` and `themeMode`?

**Fix**: Clear localStorage theme keys and reload

### Configuration Import Fails

**Issue**: `Configuration.h` upload doesn't populate fields

**Debug**:
1. Check browser console for parser errors
2. Verify firmware type selected (Marlin, TH3D, etc.)
3. Check mapping files exist in `assets/data/maps/marlin/`
4. Ensure file is valid C++ syntax

**Workaround**: Manually paste M503 output instead

### Modal Doesn't Close

**Issue**: Click outside modal doesn't close it

**Cause**: Missing click handler on modal backdrop

**Fix**:
```javascript
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
```

## Performance Optimization

### Lazy Loading Reference Data

Only load databases when needed:
```javascript
// Don't load all at once
if (!this.databases) {
    await this.loadDatabases();
}
```

### Debounce Search/Filter

For search inputs:
```javascript
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterResults(e.target.value);
    }, 300);
});
```

### Cache Calculations

For expensive calculations:
```javascript
const cacheKey = `calc_${input1}_${input2}`;
let result = sessionStorage.getItem(cacheKey);
if (!result) {
    result = expensiveCalculation(input1, input2);
    sessionStorage.setItem(cacheKey, result);
}
```

## Architecture Decisions

### Why No Framework?

- **Zero dependencies** - No npm, no build, no updates
- **Small bundle size** - <500KB total
- **Fast load times** - No framework overhead
- **Easy debugging** - Vanilla JS is transparent
- **Long-term stability** - No breaking changes

### Why localStorage?

- **No backend needed** - Static hosting (GitHub Pages)
- **Privacy first** - Data never leaves device
- **Offline capable** - Works without internet
- **Simple API** - Easy to use and understand
- **Sufficient capacity** - 5-10MB for tool data

### Why CSS Variables?

- **Runtime theming** - No CSS recompilation
- **Simple switching** - Change `data-theme` attribute
- **Maintainable** - Single source of truth
- **Performant** - No style recalculation
- **Scalable** - Easy to add new themes

## Documentation Resources

- **README.md** - Project overview
- **DOCS.md** - Complete technical documentation
- **MASTER_ROADMAP.md** - Development planning
- **TOOLS_OVERVIEW.md** - Quick tool reference
- **CHANGELOG.md** - Version history
- **docs/guides/** - Individual tool guides

## Git Workflow

```bash
# Make changes
git status
git add <files>
git commit -m "description"

# Test locally before pushing
python -m http.server 8000

# Push to GitHub
git push origin main

# GitHub Pages automatically deploys from main branch
# Live in ~1-2 minutes at: https://tsolo4ever.github.io/3d-Print-tools
```

## Key Principles

1. **No build step** - HTML/CSS/JS runs directly
2. **Zero dependencies** - No npm packages
3. **Theme everything** - Use CSS variables
4. **Store locally** - Use localStorage + export
5. **Safe parsing** - No eval, no new Function
6. **Mobile-first** - Responsive by default
7. **Accessible** - WCAG AAA compliance
8. **Educational** - In-tool guides and help
9. **Offline-capable** - Works after initial load
10. **Privacy-focused** - No tracking, no analytics
