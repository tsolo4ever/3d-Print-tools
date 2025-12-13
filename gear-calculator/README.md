# Gear Calculator Pro v4.12 (Fixed)

A comprehensive web-based gear calculator for designing spur gears, especially for 3D printing applications.

## ✨ Features

### Core Calculations
- **Multiple input modes**: Module, Diametral Pitch, Outside Diameter, or Pitch Diameter + Teeth
- **Units**: Metric (mm/module) and Imperial (inch/DP)
- **Profile shift support**: Calculate gears with positive or negative profile shifts
- **Automatic calculations**: All gear dimensions computed instantly

### Specialized Tools

#### 🔧 Auto-Match Profile Shift
- Automatically finds the correct profile shift (x) to match a measured outside diameter
- Perfect for reverse-engineering existing gears
- **Fixed in v4.12**: Now works correctly with Module/PD/DP modes (not OD mode)

#### 🖨️ 3D Printing Optimization
- **Orientation Assistant**: Suggests print angles based on priority (accuracy, success, or finish)
- **Resin Shrinkage Calculator**: Compensates for post-cure shrinkage
- **Calibration Tool**: Ring method for measuring actual shrinkage

#### 📐 Mating Gear Checker
- Verifies center distance for gear pairs
- Supports profile shift combinations

#### 💾 Library Management
- Save gear calculations to IndexedDB
- Export to XML or CSV
- Import from CSV

#### 📊 DXF Export
- Export gear outline for CAD import (simplified circle - placeholder for full involute)

## 🚀 Quick Start

### Get Help
Click the **❓ Help & Documentation** button in the top-right corner for:
- Quick reference guide (popup modal)
- Complete documentation (`help.html`)
- Formula explanations
- Step-by-step workflows
- Troubleshooting tips

### Option 1: Direct Open
Just double-click `index.html` to open in your browser.

### Option 2: Local Server
```bash
# Using npx (no installation needed)
npx serve
# Opens at http://localhost:3000

# Or with auto-refresh
npx live-server
```

## 📖 How to Use

### Basic Calculation
1. Select **Units** (mm or inch)
2. Choose **Known Type** (e.g., "Module + Teeth")
3. Enter **Value A** (e.g., module = 0.5)
4. Enter **Teeth count** (e.g., 12)
5. Set **Pressure Angle** (typically 20°)
6. Adjust **Clearance** (typically 0.25) and **Profile Shift** (x, typically 0)
7. Click **Compute**

### Auto-Match Example
You measured a gear's OD but don't know the profile shift:
1. Set mode to **Module + Teeth**
2. Enter the module (e.g., 0.5) and teeth (e.g., 12)
3. Enter your measured OD in the "Measured OD" field
4. Click **Auto-match profile shift (x)**
5. The calculator finds the x value that produces that OD

### 3D Printing Workflow
1. Calculate your gear dimensions
2. Use **Orientation Assistant** to determine print angle
3. Use **Resin & Post-Cure** calculator to compensate for shrinkage
4. Print a 20mm test ring and use **Ring Method** to calibrate
5. Export to **DXF** (or use values in your CAD software)

## 🐛 Bug Fixes in v4.12

### Fixed: AutoMatch Always Returns -0.8
**Problem**: AutoMatch function was designed to work with OD mode, creating circular logic (you're setting OD to find x, but x affects OD).

**Solution**: 
- AutoMatch now works with **Module, PD, or DP modes only**
- Calculates OD directly without UI thrashing
- Shows clear error if used with OD mode
- Performance optimized (no longer updates UI 400+ times in a loop)

### Other Improvements
- Better input validation
- Consistent error handling
- Clearer user feedback
- Removed duplicate variable declarations in compute()

## 📐 Formulas

| Formula | Description |
|---------|-------------|
| `d = m · z` | Pitch diameter |
| `OD = d + 2·(1+x)·m` | Outside diameter (addendum circle) |
| `rootD = d - 2·(1+c-x)·m` | Root diameter (dedendum circle) |
| `p = π·m` | Circular pitch |
| `baseD = d·cos(PA)` | Base diameter |
| `DP = z / (d/25.4)` | Diametral pitch (imperial) |

Where:
- `m` = module (mm)
- `z` = number of teeth
- `x` = profile shift coefficient
- `c` = clearance coefficient (×module)
- `PA` = pressure angle (degrees)
- `DP` = diametral pitch (teeth per inch of diameter)

## 🗂️ File Structure

```
gear-calculator/
├── index.html          # Main application (all-in-one)
├── README.md          # This file
└── .gitignore         # Git ignore rules (if needed)
```

## 🔒 Data Storage

All gear calculations are stored locally in your browser using **IndexedDB**. Data persists across sessions but is specific to the domain/origin where the app is hosted.

## ⚠️ Important Notes

- Always validate calculations against your CAD software before manufacturing
- DXF export currently creates a simplified circle outline (not full involute profile)
- Test prints are recommended before production runs
- Profile shift (x) affects tooth thickness, strength, and center distances

## 🛠️ Technical Details

- **No dependencies**: Pure HTML/CSS/JavaScript
- **Offline capable**: Works without internet after initial load
- **Browser storage**: IndexedDB for persistence
- **Responsive design**: Works on desktop and tablet (mobile may be cramped)

## 📝 License

This tool is provided as-is for educational and design purposes. Verify all calculations independently before manufacturing.

## 🤝 Contributing

Found a bug? Have a suggestion? Feel free to open an issue or submit improvements!

## 👥 Credits

This tool was developed with assistance from:
- **Claude** (Anthropic) - AI assistant for code development, bug fixes, and comprehensive documentation
- **Microsoft 365 Copilot** - Initial development and feature implementation

Open source contributions and improvements welcome!

---

**Version**: 4.12-fixed-v4  
**Last Updated**: 2024  
**Built with**: Vanilla JavaScript, CSS Grid, IndexedDB

### New in v4:
- ⌨️ Keyboard shortcuts (Ctrl+Enter, Ctrl+S, Ctrl+H, Esc)
- 📋 Copy to clipboard button
- 📦 Collapsible sections (click headers to collapse)
- 📱 Mobile responsive (single column on small screens)
- ✨ Button hover effects and focus indicators
- ⚠️ Confirmation before clearing library
