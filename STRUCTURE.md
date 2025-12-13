# 📁 Project Structure

Complete folder structure for the 3D Printer Calibration Suite.

## Directory Tree

```
Code/
│
├── index.html                              ✅ Main hub/landing page
├── README.md                               ✅ Repository documentation
├── STRUCTURE.md                            ✅ This file
├── gear-calculator.zip                     📦 Legacy archive
│
├── assets/                                 ✅ Shared resources
│   ├── css/
│   │   ├── base.css                       ✅ Core styling framework
│   │   └── navigation.css                 ✅ Navigation component
│   ├── js/
│   │   └── navigation.js                  ✅ Navigation logic
│   └── images/                            📁 Shared images (empty)
│
├── E-Steps_Calculator_Interactive/        ✅ E-Steps Calculator
│   ├── index.html                         ✅ Main calculator
│   ├── README.md                          ✅ Documentation
│   ├── PLANNING.md                        ✅ Planning doc
│   └── ROADMAP.md                         ✅ Development roadmap
│
├── SharePoint_Nozzle_Selection_Guide/    ✅ Nozzle Guide
│   ├── index.html                         ✅ Main guide
│   ├── README.md                          ✅ Documentation
│   └── PLANNING.md                        ✅ Planning doc
│
├── gear-calculator/                       ✅ Gear Calculator
│   ├── index.html                         ✅ Main calculator
│   └── [other files...]                   📁 Existing files
│
├── flow-calibration/                      🚧 Coming Soon
│   └── index.html                         ✅ Under construction page
│
├── temperature-tower/                     🚧 Coming Soon
│   └── index.html                         ✅ Under construction page
│
├── retraction-tuning/                     🚧 Coming Soon
│   └── index.html                         ✅ Under construction page
│
└── docs/                                  ✅ Documentation
    └── index.html                         ✅ Docs hub page
```

## Status Legend

- ✅ Complete and ready
- 🚧 Under construction / Coming soon
- 📦 Archive / Legacy
- 📁 Empty directory (ready for content)

## File Descriptions

### Root Level

| File/Folder | Purpose | Status |
|-------------|---------|--------|
| `index.html` | Main hub page with tool cards | ✅ Complete |
| `README.md` | Repository documentation | ✅ Complete |
| `STRUCTURE.md` | This file - structure overview | ✅ Complete |

### Assets (Shared Resources)

| File | Purpose | Status |
|------|---------|--------|
| `assets/css/base.css` | Core styling framework with design system | ✅ Complete |
| `assets/css/navigation.css` | Navigation bar component styles | ✅ Complete |
| `assets/js/navigation.js` | Navigation functionality (mobile menu, etc.) | ✅ Complete |
| `assets/images/` | Shared images, icons, logos | 📁 Ready for content |

### Tools

#### E-Steps Calculator ✅
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Interactive calculator with full guide | ✅ Complete |
| `README.md` | Tool documentation | ✅ Complete |
| `PLANNING.md` | Planning document | ✅ Complete |
| `ROADMAP.md` | Development roadmap (v1.0 → v5.0) | ✅ Complete |

#### Nozzle Selection Guide ✅
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Nozzle selection tool | ✅ Complete |
| `README.md` | Tool documentation | ✅ Complete |
| `PLANNING.md` | Planning document | ✅ Complete |

#### Gear Calculator ✅
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Gear ratio calculator | ✅ Complete |
| `[various]` | Supporting files | ✅ Complete |

#### Flow Calibration 🚧
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | "Coming Soon" placeholder | ✅ Complete |
| Future files | Tool implementation | 📋 Planned |

#### Temperature Tower 🚧
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | "Coming Soon" placeholder | ✅ Complete |
| Future files | Tool implementation | 📋 Planned |

#### Retraction Tuning 🚧
| File | Purpose | Status |
|------|---------|--------|
| `index.html` | "Coming Soon" placeholder | ✅ Complete |
| Future files | Tool implementation | 📋 Planned |

### Documentation

| File | Purpose | Status |
|------|---------|--------|
| `docs/index.html` | Documentation hub | ✅ Complete |
| `docs/faq.html` | FAQ page | 📋 Planned |
| `docs/getting-started.html` | Getting started guide | 📋 Planned |
| `docs/troubleshooting.html` | Troubleshooting guide | 📋 Planned |

## Design System

### CSS Variables (Shared)

All tools use the same design system defined in `assets/css/base.css`:

```css
/* Color Palette */
--primary: #0078d4
--esteps-accent: #667eea
--nozzle-accent: #ff6b6b
--gear-accent: #4ecdc4
--flow-accent: #45b7d1
--temp-accent: #f38181
--retract-accent: #aa96da

/* Status Colors */
--success: #4caf50
--warning: #ff9800
--error: #f44336
--info: #2196f3

/* Spacing, Radius, Shadows */
[See base.css for full list]
```

### Navigation Component

All pages include the same navigation bar:

```html
<nav class="suite-nav">
    <div class="container">
        <a href="/" class="logo">🔧 Calibration Suite</a>
        <div class="nav-links">
            <a href="/">Home</a>
            <a href="/E-Steps_Calculator_Interactive/">E-Steps</a>
            <a href="/SharePoint_Nozzle_Selection_Guide/">Nozzle Guide</a>
            <a href="/gear-calculator/">Gear Calc</a>
            <a href="/docs/">Docs</a>
        </div>
        <div class="nav-actions">
            <button class="theme-toggle">🌙</button>
        </div>
    </div>
</nav>
```

## Next Steps

### Immediate Tasks
1. [ ] Refactor existing tools to use shared framework
2. [ ] Add navigation to existing tool pages
3. [ ] Test all navigation links
4. [ ] Add favicon and meta tags
5. [ ] Test on mobile devices

### Phase 2
1. [ ] Implement localStorage for settings
2. [ ] Add theme toggle functionality (dark mode)
3. [ ] Create printer profile system
4. [ ] Add export/import functionality

### Phase 3
1. [ ] Build flow calibration tool
2. [ ] Build temperature tower generator
3. [ ] Build retraction tuning tool
4. [ ] Complete all documentation pages

## URL Structure

```
Main Hub:        /
E-Steps:         /E-Steps_Calculator_Interactive/
Nozzle Guide:    /SharePoint_Nozzle_Selection_Guide/
Gear Calc:       /gear-calculator/
Flow:            /flow-calibration/
Temp Tower:      /temperature-tower/
Retraction:      /retraction-tuning/
Docs:            /docs/
FAQ:             /docs/faq.html
```

## File Size Summary

- Total CSS: ~8KB (uncompressed)
- Total JS: ~2KB (uncompressed)
- Each tool page: ~40-50KB (varies)
- Hub page: ~12KB
- Total project: <500KB (excluding images)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support
- IE11: ⚠️ Not officially supported (but should work)

## Progressive Enhancement

The suite is built with progressive enhancement:

1. **Base:** Works with HTML only
2. **Enhanced:** CSS for styling
3. **Interactive:** JavaScript for calculations
4. **Advanced:** localStorage, PWA features (future)

---

**Structure Created:** December 2024  
**Status:** Phase 1 Complete - Framework Established  
**Next Phase:** Refactor existing tools to use framework
