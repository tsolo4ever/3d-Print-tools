# 🔧 3D Printer Calibration Suite

A comprehensive collection of web-based tools for calibrating and optimizing your 3D printer.

## 🚀 Live Site

Visit: https://tsolo4ever.github.io/3d-Print-tools

## 📦 What's Included

### ✅ Available Now (5 Tools)

- **E-Steps Calculator** - Calibrate extruder steps per millimeter with interactive guidance
- **Flow Rate Calibration** - Fine-tune flow percentage for perfect extrusion
- **Nozzle Selection Guide** - Choose the right nozzle size and material for your needs
- **Gear Calculator** - Calculate gear ratios for custom extruder builds
- **Temperature Tower Generator** - Generate temperature test towers with automatic G-code modification (NEW!)

### 🚧 Coming Soon

- **Retraction Tuning** - Eliminate stringing and blobs (In Progress - 10%)
- **Pressure/Linear Advance** - Fine-tune corner quality
- **PID Tuning Assistant** - Stable temperature control
- **First Layer Calibration** - Perfect adhesion and Z-offset

## 🌟 Features

- 📱 **Mobile Friendly** - Use right at your printer on any device
- 💾 **Data Persistence** - Save settings and history for multiple printers
- 🎨 **Brand Themes** - 7 manufacturer themes (Prusa, Bambu Lab, Creality, Voron, etc.)
- 🌓 **Smart Theme System** - Auto-switching based on time or system preference
- 🎓 **Educational** - Learn while you calibrate with detailed guides
- ⚡ **Fast & Easy** - Quick calculations with instant results
- 🔒 **Privacy First** - All data stays local, no accounts needed
- 🆓 **Free & Open Source** - Completely free to use
- ♿ **Accessible** - High contrast modes and keyboard navigation

## 📁 Project Structure

```
3d-print-tools/
├── index.html                          # Main hub page with tool grid
├── _template-tool.html                 # Template for new tools
├── assets/                             # Shared resources
│   ├── css/
│   │   ├── base.css                   # Theme system & core styles
│   │   ├── navigation.css             # Navigation component
│   │   └── printer-profiles.css       # Printer profile system
│   ├── js/
│   │   ├── navigation.js              # Theme switching & navigation
│   │   ├── printer-profiles.js        # Multi-printer profiles
│   │   └── storage-manager.js         # LocalStorage management
│   └── images/                        # Shared images & assets
├── E-Steps_Calculator_Interactive/    # E-Steps calculator (complete)
├── flow-calibration/                  # Flow rate calibration (complete)
├── SharePoint_Nozzle_Selection_Guide/ # Nozzle selection guide (complete)
├── gear-calculator/                   # Gear ratio calculator (complete)
├── temperature-tower/                 # Temperature tower generator (complete)
├── retraction-tuning/                 # Retraction tuning (in progress)
├── pressure-advance/                  # Pressure advance (planned)
├── pid-tuning/                        # PID tuning (planned)
└── docs/                              # Documentation & guides
    ├── index.html                     # Documentation hub
    └── guides/                        # Comprehensive guides
```

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks, no build process
- **Progressive Enhancement** - Works offline, installable as PWA
- **LocalStorage API** - Client-side data persistence
- **Responsive Design** - Mobile-first approach

## 🎨 Design System

### Theme System
The suite features a comprehensive theme system with:
- **Base Themes:** Light, Dark, High Contrast, High Contrast Dark
- **Brand Themes:** Prusa, Bambu Lab, Creality, Voron, Ultimaker, Formlabs, Anycubic
- **Auto-Switching:** Time-based (7 AM - 7 PM) or system preference sync
- **Accessibility:** High contrast variants for better visibility

### Tool Color Palette
- E-Steps: `#667eea` (Purple)
- Flow: `#45b7d1` (Blue)
- Nozzle: `#ff6b6b` (Red)
- Gear: `#4ecdc4` (Teal)
- Temperature: `#f38181` (Warm Red)
- Retraction: `#aa96da` (Lavender)
- Pressure Advance: `#ffa726` (Orange)
- PID: `#66bb6a` (Green)

### Design Philosophy
- **Simplicity First** - Clean, intuitive interfaces
- **Progressive Disclosure** - Advanced features accessible when needed
- **Mobile-First** - Optimized for use at the printer
- **Offline-Capable** - No internet required after initial load
- **Privacy-Respecting** - All data stays local, no accounts needed
- **Accessible** - WCAG compliant with keyboard navigation

## 📖 Usage

1. Visit the main hub page
2. Select the tool you need
3. Follow the step-by-step instructions
4. Apply the calculated values to your printer
5. Enjoy better print quality!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue with details
2. **Suggest Features** - Share your ideas
3. **Improve Documentation** - Fix typos, add examples
4. **Submit Pull Requests** - Add new features or fix bugs

### Development Setup

```bash
# Clone the repository
git clone https://github.com/tsolo4ever/3d-Print-tools.git

# Navigate to the directory
cd 3d-Print-tools

# Open in browser (no build required!)
# Just open index.html in your browser
```

## 📝 Roadmap

### Phase 1: Foundation ✅ Complete
- [x] Create hub page and navigation system
- [x] Build unified folder structure
- [x] Design comprehensive theme framework
- [x] Implement E-Steps Calculator
- [x] Create Nozzle Selection Guide
- [x] Build Gear Calculator

### Phase 2: Enhancement ✅ Complete
- [x] Flow Rate Calibration tool
- [x] Theme system with brand themes
- [x] Time-based auto-switching
- [x] System preference sync
- [x] Test history tracking
- [x] LocalStorage persistence
- [x] Mobile responsive design
- [x] Shared component library

### Phase 3: Expansion (In Progress)
- [x] Temperature Tower Generator
- [ ] Retraction Tuning Tool (10% complete)
- [ ] Pressure/Linear Advance Calculator
- [ ] PID Tuning Assistant
- [ ] First Layer Calibration
- [ ] Complete documentation hub
- [ ] Video tutorials

### Phase 4: Advanced Features (Planned)
- [ ] Multi-printer profile management
- [ ] Export/import configurations
- [ ] PWA support (offline, installable)
- [ ] Print quality diagnostic tool
- [ ] Belt tension calculator
- [ ] Volumetric flow rate calculator
- [ ] OctoPrint/Klipper integration (optional)
- [ ] Multi-language support

## 📄 License

[MIT License](LICENSE) - Feel free to use and modify

## 🙏 Acknowledgments

- Inspired by the 3D printing community
- Special thanks to all contributors
- Built with ❤️ for makers everywhere

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/tsolo4ever/3d-Print-tools/issues)
- **Documentation:** [Full Docs](docs/)
- **FAQ:** [Frequently Asked Questions](docs/faq.html)

## 🔗 Links

- **GitHub:** [tsolo4ever/3d-Print-tools](https://github.com/tsolo4ever/3d-Print-tools)
- **Documentation:** [Full Guide](docs/)
- **Live Site:** https://tsolo4ever.github.io/3d-Print-tools

---

## 🎯 Recommended Calibration Order

For best results, calibrate your printer in this order:

1. **E-Steps Calculator** - Foundation for all other calibrations
2. **Flow Rate Calibration** - Fine-tune after E-steps are correct
3. **Temperature Tower** - Find optimal temperature for your filament
4. **Retraction Tuning** - Eliminate stringing (temperature-dependent)
5. **Pressure Advance** - Advanced fine-tuning for corner quality

---

**Made with 🔧 for the 3D printing community**

*Last Updated: December 15, 2025*
