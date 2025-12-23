# 🔧 3D Printer Calibration Suite

> **Your complete toolkit for calibrating and optimizing your 3D printer for perfect prints**

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-blue?style=flat-square)](https://tsolo4ever.github.io/3d-Print-tools) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE) [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square)](https://github.com/tsolo4ever/3d-Print-tools)

---

## 🎯 What is This?

A **comprehensive, free, open-source web-based tool suite** for 3D printer calibration and optimization. Use it right at your printer on any device, with no accounts, no tracking, and no internet required after the initial load.

Whether you're a beginner struggling with your first perfect layer or an advanced user fine-tuning pressure advance, this suite has tools to help you achieve perfect prints.

---

## 🚀 Quick Start

### 🌐 **Live Site**
Visit: **https://tsolo4ever.github.io/3d-Print-tools**

### 📋 **Available Tools**

| Tool | Status | Best For |
|------|--------|----------|
| 🎯 [E-Steps Calculator](#-available-tools) | ✅ Complete | Extruder calibration (foundation) |
| 💧 [Flow Rate Calibration](#-available-tools) | ✅ Complete | Perfect extrusion width |
| 🔍 [Nozzle Selection Guide](#-available-tools) | ✅ Complete | Choosing the right nozzle |
| ⚙️ [Gear Calculator](#-available-tools) | ✅ Complete | Custom gear ratios |
| 🌡️ [Temperature Tower Generator](#-available-tools) | ✅ Complete | Finding optimal temperature |
| 🔄 [Retraction Tuning](#-available-tools) | ✅ Complete | Eliminating stringing |
| ⚡ [Pressure/Linear Advance](#-upcoming-tools) | 🚧 Coming | Corner quality & detail |
| 🎛️ [PID Tuning Assistant](#-upcoming-tools) | 🚧 Coming | Temperature control |

**[→ View Full Tool List](#-complete-tool-list)**

---

## ✨ Features

### 🎓 **Educational**
- Step-by-step guidance for every tool
- Learn calibration best practices
- Comprehensive documentation included
- Video guides and examples

### 📱 **Mobile-First Design**
- Use right at your printer
- Works on phones, tablets, laptops
- Fully responsive layouts
- Touch-friendly interface

### 💾 **Save & Manage**
- Multi-printer profile system
- Store unlimited calibration data
- Export/import for backup
- Test history tracking

### 🎨 **7 Brand Themes**
- Prusa, Bambu Lab, Creality, Voron, Ultimaker, Formlabs, Anycubic
- Light, Dark, and High Contrast variants
- Auto-switching by time or system preference
- Customizable font sizes

### 🌓 **Accessibility**
- High contrast modes (WCAG AAA)
- Keyboard navigation
- Screen reader friendly
- Adjustable font sizes

### 🔒 **Privacy First**
- All data stored locally (localStorage)
- No accounts or login required
- No tracking or analytics
- No cloud dependencies
- Works offline after initial load

### ⚡ **Performance**
- <500KB total project size
- Pure HTML/CSS/JavaScript
- No external dependencies
- Instant calculations

---

## 📊 Complete Tool List

### 🔧 Essential Calibration (6 Tools)

#### ✅ E-Steps Calculator
**Status:** Complete | **Impact:** Very High | **Difficulty:** Beginner

Calibrate your extruder steps per millimeter for accurate filament extrusion. This is the foundation calibration that every 3D printer needs.

- Interactive step-by-step guide
- Multiple calibration methods
- Test print generator
- Preset library for common printers
- Test history tracking

**Path:** `/E-Steps_Calculator_Interactive/`

---

#### ✅ Flow Rate Calibration
**Status:** Complete | **Impact:** Very High | **Difficulty:** Beginner

Fine-tune your extrusion flow for perfect wall thickness and layer adhesion after E-steps calibration.

- Single-wall cube method
- Two-wall verification approach
- Multi-measurement averaging
- Material-specific presets (PLA, PETG, ABS, etc.)
- Temperature adjustment calculator
- Visual comparison tool

**Path:** `/flow-calibration/`

---

#### ✅ Nozzle Selection Guide
**Status:** Complete | **Impact:** High | **Difficulty:** Beginner

Choose the right nozzle size and material for your specific printing needs and material types.

- Nozzle size comparison
- Material compatibility guide
- Performance characteristics
- Purchasing recommendations
- Use case guidance

**Path:** `/SharePoint_Nozzle_Selection_Guide/`

---

#### ✅ Gear Calculator
**Status:** Complete | **Impact:** Medium | **Difficulty:** Medium

Calculate precise gear ratios for custom extruder builds and mechanical modifications.

- Multiple configuration support
- Compound gear calculations
- Ratio validation
- Printable reference charts

**Path:** `/gear-calculator/`

---

#### ✅ Temperature Tower Generator
**Status:** Complete | **Impact:** Very High | **Difficulty:** Beginner

Generate temperature test towers to find the optimal printing temperature for different filaments.

- Custom temperature ranges
- Automatic layer-by-layer temperature stepping
- Multiple tower designs
- G-code generation (all slicers compatible)
- Evaluation guide with examples
- Material-specific recommendations

**Path:** `/temperature-tower/`

---

#### ✅ Retraction Tuning
**Status:** Complete | **Impact:** High | **Difficulty:** Medium

Dial in perfect retraction settings to eliminate stringing, blobs, and oozing.

- Distance/speed optimizer
- Bowden vs Direct Drive guidance
- Z-hop recommendations
- Test print generator
- Problem diagnostic tool
- Before/after comparison

**Path:** `/retraction-tuning/`

---

### ⚡ Advanced Calibration (5 Tools)

#### 🚧 Pressure/Linear Advance
**Status:** Planned | **Impact:** Very High | **Difficulty:** Intermediate

Eliminate corner bulging and improve detail with precision pressure advance calibration.

- Pattern generator (squares, lines, text)
- K-factor calculator
- Marlin (M900) & Klipper support
- Visual comparison tool
- Speed-specific optimization

**Path:** `/pressure-advance/`

---

#### 🚧 PID Tuning Assistant
**Status:** Planned | **Impact:** High | **Difficulty:** Intermediate

Achieve stable temperature control for hotend and heated bed with automated PID tuning.

- Hotend PID calibration (M303 S200 E0)
- Heated bed PID calibration (M303 S60 E-1)
- Auto-tune G-code generator
- Stability analysis
- Temperature oscillation detection
- Settings application guide

**Path:** `/pid-tuning/`

---

#### 📋 First Layer Calibration
**Status:** Planned | **Impact:** Very High | **Difficulty:** Beginner

Perfect adhesion and Z-offset for consistent first layer results.

- Z-offset calculator
- Live adjustment guide
- Test pattern generator
- Bed leveling verification
- Adhesion troubleshooter

**Path:** `/first-layer-calibration/`

---

#### 📋 Belt Tension Calculator
**Status:** Planned | **Impact:** High | **Difficulty:** Intermediate

Achieve proper belt tension to eliminate ringing and ghosting.

- Frequency-to-tension conversion
- Printer-type specific guidance
- Measurement method comparisons
- Resonance diagnostics
- Optimal range recommendations

**Path:** `/belt-tension/`

---

#### 📋 Volumetric Flow Rate
**Status:** Planned | **Impact:** High | **Difficulty:** Advanced

Understand your printer's speed limits based on hotend and material capabilities.

- Maximum flow calculator
- Speed limit optimizer
- Hotend capability database
- Print time estimator
- Filament viscosity considerations

**Path:** `/volumetric-flow/`

---

### 🎯 Print Quality (4 Tools)

#### 📋 Acceleration/Jerk Tuning
**Status:** Planned | **Impact:** Very High | **Difficulty:** Intermediate

Balance speed and quality by optimizing acceleration and jerk settings.

- Acceleration calculator
- Jerk/Junction Deviation guide
- Ringing vs quality trade-offs
- Test cube generator
- Artifact identifier

---

#### 📋 Bridge Settings Optimizer
**Status:** Planned | **Impact:** Medium | **Difficulty:** Beginner

Perfect bridging without supports by optimizing flow and cooling.

- Bridge flow calculator
- Fan speed recommendations
- Speed optimizer
- Test pattern generator

---

#### 📋 Support Optimizer
**Status:** Planned | **Impact:** Medium | **Difficulty:** Intermediate

Minimize supports while ensuring quality with proper density and settings.

- Density calculator
- Overhang angle guide
- Interface layer optimizer
- Easy removal techniques

---

#### 📋 Print Quality Diagnostic
**Status:** Planned | **Impact:** High | **Difficulty:** Intermediate

Identify and fix print problems with an intelligent diagnostic system.

- Photo upload analysis
- Problem identification AI
- Solution suggestions
- Settings recommendations

---

### 🛠️ Maintenance & Utilities (3+ Tools)

#### 📋 Filament Drying Guide
**Status:** Planned | **Impact:** High | **Difficulty:** Beginner

Proper filament drying and storage to maintain print quality.

- Material-specific drying times/temps
- Moisture detection checklist
- Drying method comparison
- Storage recommendations

**Materials Included:**
- PLA: 45°C, 4-6 hours
- PETG: 65°C, 4-6 hours
- ABS: 65-80°C, 4-6 hours
- Nylon: 70-80°C, 12+ hours
- TPU: 55-65°C, 4 hours
- PC: 80-90°C, 6+ hours

---

#### 📋 Bed Leveling Visualizer
**Status:** Planned | **Impact:** Medium | **Difficulty:** Intermediate

Visualize and understand bed mesh data for perfect first layers.

- Mesh heatmap generation
- G29 output parser
- Warp detection
- Leveling guide

---

#### 📋 Maintenance Tracker
**Status:** Planned | **Impact:** Medium | **Difficulty:** Beginner

Track maintenance tasks and component lifespans.

- Maintenance scheduler
- Component replacement reminders
- Checklist system
- History tracking

---

## 🏗️ Project Structure

```
3d-print-tools/
├── index.html                              # Main hub page
├── README.md                               # This file
├── CHANGELOG.md                            # Version history
├── MASTER_ROADMAP.md                       # Development roadmap
├── DOCS.md                                 # Detailed documentation
├── TOOLS_OVERVIEW.md                       # Quick tool reference
│
├── assets/                                 # Shared resources
│   ├── css/
│   │   ├── base.css                       # Theme system & core styles
│   │   ├── navigation.css                 # Navigation component
│   │   └── printer-profiles.css           # Printer profile UI
│   ├── js/
│   │   ├── navigation.js                  # Theme switching & UI
│   │   ├── printer-profiles.js            # Printer management
│   │   └── storage-manager.js             # LocalStorage API
│   └── data/                              # 📊 Comprehensive 3D Printing Dataset
│       │                                   # Includes: printers, hotends, nozzles,
│       │                                   # thermistors, stepper drivers, bed probes,
│       │                                   # filaments, gcode reference, error codes,
│       │                                   # and calibration procedures
│
├── E-Steps_Calculator_Interactive/        # ✅ E-Steps tool
│   ├── index.html
│   └── README.md
│
├── flow-calibration/                      # ✅ Flow tool
│   └── index.html
│
├── SharePoint_Nozzle_Selection_Guide/     # ✅ Nozzle tool
│   ├── index.html
│   ├── js/
│   └── data/
│
├── gear-calculator/                       # ✅ Gear tool
│   ├── index.html
│   └── README.md
│
├── temperature-tower/                     # ✅ Temperature tool
│   ├── index.html
│   ├── example.gcode
│   └── STL files
│
├── retraction-tuning/                     # ✅ Retraction tool
│   └── index.html
│
├── pressure-advance/                      # 🚧 Pressure tool
│   └── index.html
│
├── pid-tuning/                            # 🚧 PID tool
│   └── index.html
│
├── docs/                                  # Documentation hub
│   ├── index.html
│   └── guides/
│       ├── E-Steps_Calibration_Guide.md
│       ├── Flow_Rate_Calibration_Guide.md
│       ├── Nozzle_Size_Comparison_Guide.md
│       └── ... more guides
│
└── firmware-helper/                       # Firmware examples & guides
    ├── example-*.h
    └── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (Vanilla)** - Pure JS, no frameworks
- **LocalStorage API** - Client-side data persistence

### Design
- **Mobile-First** - Optimized for all screen sizes
- **Responsive Grid** - Auto-adapting layouts
- **CSS Variables** - Dynamic theming system
- **Progressive Enhancement** - Works without JavaScript

### Browser Support
- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Offline capable (PWA ready)

### Performance
- <500KB total project size
- Zero external dependencies
- No build process required
- Fast loading on any connection
- Instant calculations

---

## 🎨 Design System

### Theme Architecture
- **4 Base Themes:** Light, Dark, High Contrast, High Contrast Dark
- **7 Brand Themes:** Prusa, Bambu Lab, Creality, Voron, Ultimaker, Formlabs, Anycubic
- **2 Variants:** Light/Dark for each brand
- **Total:** 18 unique themes

### Auto-Switching Features
- **System Preference Sync** - Real-time OS theme matching
- **Time-Based Switching** - Light (7 AM-7 PM), Dark (7 PM-7 AM)
- **Manual Override** - 24-hour pause on auto-switching
- **Persistent Settings** - User preferences saved

### Tool Color Palette
| Tool | Color | Hex |
|------|-------|-----|
| E-Steps | Purple | #667eea |
| Flow | Blue | #45b7d1 |
| Nozzle | Red | #ff6b6b |
| Gear | Teal | #4ecdc4 |
| Temperature | Warm Red | #f38181 |
| Retraction | Lavender | #aa96da |
| Pressure | Orange | #ffa726 |
| PID | Green | #66bb6a |

---

## 💾 Features in Detail

### Printer Profile System
- **Multi-Printer Support** - Store unlimited printer configurations
- **Quick Load** - One-click load saved settings
- **Export/Import** - Backup and share configurations
- **Auto-Fill** - Automatically populate calculator forms
- **History Tracking** - Track calibration changes over time

### Data Persistence
- **LocalStorage** - 5-10MB per domain
- **No Cloud** - All data stays on your device
- **Export Feature** - Download JSON backups
- **Import Feature** - Restore from backup files
- **Privacy** - No tracking or analytics

### Educational Content
- **Step-by-Step Guides** - In-tool guidance for each calculator
- **Visual Explanations** - Diagrams and illustrations
- **Links to Docs** - Comprehensive documentation
- **Video References** - Links to recommended videos
- **Troubleshooting** - Common issues and solutions

---

## 🚀 Recommended Calibration Order

### For New Users
1. **E-Steps Calculator** - Foundation calibration (most important!)
2. **Flow Rate Calibration** - Fine-tune after E-steps
3. **Temperature Tower** - Find optimal temperature for your filament
4. **Retraction Tuning** - Eliminate stringing
5. **First Layer Calibration** - Perfect adhesion

### For Quality Issues

| Problem | Tool |
|---------|------|
| Stringing between parts | Retraction Tuning |
| Poor first layer adhesion | First Layer Calibration |
| Ringing/ghosting on walls | Belt Tension Calculator or Acceleration Tuning |
| Under/over extrusion | E-Steps or Flow Rate Calibration |
| Corner bulging | Pressure/Linear Advance |
| Inconsistent temperature | PID Tuning Assistant |
| Bridging failure | Bridge Settings Optimizer |

### After Hardware Changes
1. **E-Steps** (if you changed the extruder)
2. **PID Tuning** (if you changed the hotend)
3. **Pressure Advance** (any major change)
4. **Flow Rate** (new hotend or nozzle)
5. **Belt Tension** (if you upgraded to CoreXY)

---

## 📚 Documentation

### In-Tool Resources
- Step-by-step guides built into each calculator
- Preset libraries with common configurations
- Educational info boxes throughout
- Example images and diagrams
- Troubleshooting sections

### Full Documentation
- 📖 **[DOCS.md](DOCS.md)** - Complete technical documentation
- 🗺️ **[MASTER_ROADMAP.md](MASTER_ROADMAP.md)** - Development planning
- 📋 **[TOOLS_OVERVIEW.md](TOOLS_OVERVIEW.md)** - Quick tool reference
- 📝 **[CHANGELOG.md](CHANGELOG.md)** - Version history

### Calibration Guides
- **[E-Steps Calibration Guide](docs/guides/E-Steps_Calibration_Guide.md)** - Detailed walkthrough
- **[Flow Rate Guide](docs/guides/flow_rate_calibration.md)** - Methods and techniques
- **[Nozzle Selection Guide](docs/guides/Nozzle_Size_Comparison_Guide.md)** - Comprehensive comparison
- **[Temperature Tuning](docs/guides/temperature_tuning.md)** - Temperature optimization
- **[Retraction Calibration](docs/guides/retraction_calibration.md)** - Stringing solutions
- **[More Guides →](docs/guides/)** - Additional calibration resources

---

## 🤝 Contributing

We welcome contributions from the 3D printing community!

### How to Contribute

#### 🐛 Report Bugs
- Open an issue with detailed steps to reproduce
- Include browser/device information
- Screenshots help!

#### 💡 Suggest Features
- Describe the feature clearly
- Explain how it would help users
- Share any implementation ideas

#### 📝 Improve Documentation
- Fix typos and unclear explanations
- Add examples and diagrams
- Update outdated information

#### 🔧 Submit Code
- Fork the repository
- Create a feature branch
- Submit a pull request
- Include description of changes

#### 🎓 Add Calibration Guides
- Share your expertise
- Document your calibration process
- Add to the guides folder
- Help other users learn

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tsolo4ever/3d-Print-tools.git
   cd 3d-Print-tools
   ```

2. **No build process required!**
   - Just open `index.html` in your browser
   - Or use any local server (Python, Node, etc.)

3. **Development tips:**
   - Use browser DevTools for debugging
   - Test on mobile devices
   - Check different theme combinations
   - Verify localStorage functionality

---

## 📊 Development Roadmap

### Current Status: **Phase 2** 🎯
- ✅ Phase 1: Foundation Complete
- 🚧 Phase 2: Core Suite Completion (Current)
- 📋 Phase 3: Advanced Calibration (Next)
- 📋 Phase 4: Quality & Maintenance
- 📋 Phase 5: Professional Features
- 📋 Phase 6: Ecosystem Expansion

### Phase 2 Timeline (Weeks 3-8)
- [x] Refactor existing tools with navigation
- [x] Add localStorage to all tools
- [x] Flow Rate Calibration
- [x] Temperature Tower Generator
- [x] Retraction Tuning
- [ ] Printer profile system refinement
- [ ] Theme system enhancements

### Phase 3 Timeline (Weeks 9-16)
- [ ] PID Tuning Assistant
- [ ] First Layer Calibration
- [ ] Pressure/Linear Advance
- [ ] Belt Tension Calculator
- [ ] Volumetric Flow Rate

### Phase 4+ Timeline (Weeks 17+)
- [ ] Acceleration/Jerk Tuning
- [ ] Bridge Settings Optimizer
- [ ] Support Optimizer
- [ ] Filament Drying Guide
- [ ] Bed Leveling Visualizer
- [ ] And many more...

**[→ View Full Roadmap](MASTER_ROADMAP.md)**

---

## 📈 Usage Statistics & Success Metrics

### Quality Indicators
- Successful calibrations with improved print quality
- Reduced support questions about calibration
- User satisfaction scores
- Community contributions

### Performance Targets
- Page load time < 2 seconds
- Mobile performance score > 90
- Accessibility (WCAG) > 95%
- SEO score > 90

---

## 🎓 Learning Resources

### Getting Started
1. Visit the [live site](https://tsolo4ever.github.io/3d-Print-tools)
2. Read the in-tool guides
3. Follow the step-by-step instructions
4. Apply results to your printer
5. Track your improvements in printer profiles

### 3D Printing Resources
- [r/3Dprinting](https://reddit.com/r/3Dprinting) - Community Q&A
- [Prusa Knowledge Base](https://help.prusa3d.com) - Detailed guides
- [YouTube Calibration](https://www.youtube.com) - Video tutorials
- [3D Printing Community](https://www.thingiverse.com) - Models & tips

### Advanced Topics
- G-code optimization
- Firmware tuning (Marlin, Klipper)
- Slicer configuration
- Hardware upgrades

---

## 🔒 Privacy & Security

### Your Data is Safe
- ✅ **All data stored locally** - Never sent to servers
- ✅ **No tracking** - Zero analytics
- ✅ **No accounts** - No login required
- ✅ **No cookies** - Except localStorage
- ✅ **Open source** - Code is publicly available
- ✅ **Export anytime** - Download your data as JSON

### How It Works
1. Data stored in browser's localStorage
2. Optional backup via export function
3. Import from backup files
4. Settings persist across sessions
5. Works offline after initial load

---

## 💬 Support & Community

### Getting Help
- 📖 [Documentation](docs/) - Comprehensive guides
- ❓ [FAQ](docs/faq.html) - Common questions
- 🐛 [Issues](https://github.com/tsolo4ever/3d-Print-tools/issues) - Bug reports
- 💭 [Discussions](https://github.com/tsolo4ever/3d-Print-tools/discussions) - General discussion

### Connect With Us
- ⭐ [Star on GitHub](https://github.com/tsolo4ever/3d-Print-tools) - Show your support!
- 🍴 [Fork the repo](https://github.com/tsolo4ever/3d-Print-tools/fork) - Contribute
- 📧 Share feedback - Help us improve

---

## 📄 License

This project is released under the **MIT License** - free to use for any purpose.

```
MIT License

Copyright (c) 2024 3D Print Tools Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

**[View Full License →](LICENSE)**

---

## 🙏 Acknowledgments

### Built By
The 3D printing community, for the 3D printing community.

### Inspired By
- Prusa's calibration guides
- E3D's resources
- Voron design philosophy
- Community feedback and suggestions

### Thank You To
- All contributors and testers
- Community feedback providers
- Everyone using these tools to improve their prints

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| 🌐 Live Site | https://tsolo4ever.github.io/3d-Print-tools |
| 📖 Documentation | [DOCS.md](DOCS.md) |
| 🗺️ Roadmap | [MASTER_ROADMAP.md](MASTER_ROADMAP.md) |
| 📋 Tools Overview | [TOOLS_OVERVIEW.md](TOOLS_OVERVIEW.md) |
| 📝 Changelog | [CHANGELOG.md](CHANGELOG.md) |
| 🐙 GitHub Repo | https://github.com/tsolo4ever/3d-Print-tools |
| 🐛 Report Issues | https://github.com/tsolo4ever/3d-Print-tools/issues |
| 💬 Discussions | https://github.com/tsolo4ever/3d-Print-tools/discussions |

---

## 🚀 Getting Started Now

### Option 1: Use Online (Recommended)
👉 **[Visit the Live Site →](https://tsolo4ever.github.io/3d-Print-tools)**

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/tsolo4ever/3d-Print-tools.git
cd 3d-Print-tools

# Open in browser (no build needed!)
# Option A: Open index.html directly
open index.html

# Option B: Use Python's built-in server
python -m http.server 8000
# Then visit: http://localhost:8000

# Option C: Use Node's http-server
npx http-server
```

---

<div align="center">

### ⭐ If this project helps you, please consider starring it on GitHub!

**Happy Calibrating! 🔧✨**

---

*Last Updated: December 2024*  
*Version: 1.0*  
*Status: 🟢 Active Development*

</div>
