# Brand Themes Documentation

## Overview
The 3D Print Tools Calibration Suite includes brand-specific themes for popular printer manufacturers, each with automatic day/night variants.

## Available Brand Themes

### 🟠 Prusa Orange
- **Light:** `prusa` - Vibrant orange (#ff6b00)
- **Dark:** `prusa-dark` - Auto-applied at night (7 PM - 7 AM)
- Target users: Prusa Research printer owners

### 🟢 Bambu Lab Green  
- **Light:** `bambu` - Fresh green (#00ae42)
- **Dark:** `bambu-dark` - Auto-applied at night
- Target users: Bambu Lab printer owners

### 🔵 Creality Blue
- **Light:** `creality` - Professional blue (#1e88e5)
- **Dark:** `creality-dark` - Auto-applied at night
- Target users: Ender and Creality users

### 🔴 Voron Red
- **Light:** `voron` - Bold red (#d32f2f)
- **Dark:** `voron-dark` - Auto-applied at night
- Target users: Voron community members

## Time-Based Auto-Switching

When time-based auto-switching is enabled:
1. User selects brand theme (e.g., Prusa)
2. System detects saved brand preference
3. Automatically switches between light/dark variants based on time
4. 7 AM - 7 PM: Light variant
5. 7 PM - 7 AM: Dark variant

## Implementation

**Files:**
- `assets/css/base.css` - 8 theme definitions (4 light + 4 dark)
- `assets/js/navigation.js` - Smart brand detection in `getTimeBasedTheme()`

**CSS Variables:** Each theme customizes:
- `--primary`, `--primary-hover`, `--primary-light`
- Status colors (success, warning, error, info)
- Accent colors for calculators
- Shadows with brand color tints

## Total Theme System
12 themes total:
- 2 Standard (light, dark)
- 2 High Contrast (light, dark)
- 8 Brand Themes (4 brands × 2 variants each)

## Author
**Claude (Anthropic AI Assistant)**  
Date: December 14, 2024  
Project: 3D Print Tools Calibration Suite
