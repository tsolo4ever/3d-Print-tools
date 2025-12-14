# Project Notes - 3D Printer Calibration Suite

## Theme Toggle Implementation (December 2024)

### ✅ GLOBAL & REUSABLE SYSTEM
The theme system is **fully global and reusable** across all tools in the suite!

**What's Global:**
- CSS variables in `assets/css/base.css` - Available to any page that links it
- Theme toggle JavaScript in `assets/js/navigation.js` - Works on any page
- Navigation component in `assets/css/navigation.css` - Consistent navbar everywhere
- localStorage preference - Shared across all pages in the suite

**How to Use It:**
Any tool in the suite can get full theme support by:
1. Linking `../assets/css/base.css` and `../assets/css/navigation.css`
2. Adding the navigation bar HTML with theme toggle button
3. Linking `../assets/js/navigation.js`
4. Using CSS variables instead of hardcoded colors

See `THEME_USAGE_GUIDE.md` for complete instructions!

### Overview
Added dark mode theme toggle functionality to the entire calibration suite. Users can now switch between light and dark modes with a single click, and their preference is saved locally.

### Files Modified

#### 1. `assets/js/navigation.js`
**Changes Made:**
- Added `initializeThemeToggle()` function
- Reads theme preference from localStorage on page load
- Toggles between 'light' and 'dark' themes
- Updates button icon (🌙 for light mode, ☀️ for dark mode)
- Saves preference to localStorage for persistence

**Key Functions:**
- `initializeThemeToggle()` - Sets up theme toggle on page load
- `updateThemeIcon(button, theme)` - Changes button appearance based on theme

#### 2. `assets/css/base.css`
**Changes Made:**
- Added `[data-theme="dark"]` selector with dark mode color variables
- Updated all color references to use CSS variables
- Dark mode colors:
  - Background: `#1a1a1a`
  - Card background: `#2d2d2d`
  - Primary text: `#e0e0e0`
  - Secondary text: `#b0b0b0`
  - Borders: `#404040`
- Adjusted primary colors for better visibility in dark mode
- Modified shadows to be more prominent on dark backgrounds

#### 3. `index.html`
**Changes Made:**
- Updated all inline styles to use CSS variables
- Changed hardcoded colors (e.g., `background: white`) to `background: var(--card-bg)`
- Ensured all text elements reference `var(--text-primary)` or `var(--text-secondary)`
- Tool cards, features section, and footer now fully support dark mode

### How It Works

1. **Initial Load:**
   - Page loads and JavaScript checks localStorage for 'theme' key
   - If found, applies saved theme; otherwise defaults to 'light'
   - Sets `data-theme` attribute on `<html>` element

2. **Theme Toggle:**
   - User clicks theme button in navigation
   - JavaScript reads current theme from `data-theme` attribute
   - Switches to opposite theme
   - Saves new preference to localStorage
   - Updates button icon

3. **CSS Application:**
   - All colors use CSS custom properties (variables)
   - Light mode uses default `:root` variables
   - Dark mode overrides variables with `[data-theme="dark"]` selector
   - Smooth transition between themes via CSS transitions

### User Experience

**Light Mode (Default):**
- Clean, bright interface
- Traditional white backgrounds
- High contrast for daylight use
- Button shows 🌙 moon icon

**Dark Mode:**
- Easy on the eyes for night use
- Dark gray backgrounds (#1a1a1a, #2d2d2d)
- Adjusted colors for readability
- Button shows ☀️ sun icon
- Preference persists across sessions

### Technical Details

**localStorage Key:** `theme`  
**Possible Values:** `'light'` or `'dark'`  
**HTML Attribute:** `data-theme` on `<html>` element  
**Default:** Light mode if no preference is saved

### Browser Compatibility
- Works in all modern browsers that support:
  - CSS custom properties (CSS variables)
  - localStorage API
  - data attributes
  - ES6 JavaScript

### Future Enhancements
- [ ] Add system preference detection (prefers-color-scheme media query)
- [ ] Add smooth transition animation between themes
- [ ] Extend dark mode support to all sub-tools (E-Steps, Nozzle Guide, etc.)
- [ ] Add keyboard shortcut for theme toggle
- [ ] Add theme selector with more options (auto/light/dark)

### Testing Checklist
- [x] Theme toggles correctly
- [x] Preference persists after page reload
- [x] All text remains readable in both modes
- [x] Tool cards display correctly in both themes
- [x] Navigation bar adapts to theme
- [x] Footer links visible in both modes
- [x] Icons and emojis display properly
- [ ] Test on mobile devices
- [ ] Test in all major browsers (Chrome, Firefox, Safari, Edge)

### Related Files
- Navigation component: `assets/css/navigation.css`
- Base styling: `assets/css/base.css`
- Theme logic: `assets/js/navigation.js`
- Main page: `index.html`

### Code Comments
All modified files include inline PROJECT NOTE comments explaining:
- Purpose of the changes
- How the theme system works
- Which variables control colors
- How persistence is handled

---

## Notes for Future Development

### Style Consistency
When creating new tools or pages, ensure:
1. Use CSS variables from `base.css` for all colors
2. Never hardcode colors like `white`, `black`, `#fff`, etc.
3. Reference colors via variables:
   - `var(--text-primary)` for main text
   - `var(--text-secondary)` for secondary text
   - `var(--card-bg)` for card backgrounds
   - `var(--background)` for page background
   - `var(--border)` for borders

### Adding New Tools
New tools should:
1. Link to shared CSS files (`base.css`, `navigation.css`)
2. Include theme toggle button in navigation
3. Link to `navigation.js` for theme functionality
4. Use CSS variables throughout their custom styles

### localStorage Usage
Current localStorage keys used:
- `theme` - User's theme preference (light/dark)

Future keys to consider:
- Printer profiles
- Calculation history
- User preferences per tool

---

**Last Updated:** December 13, 2024  
**Modified By:** Slot Tech III  
**Status:** ✅ Theme toggle fully functional on main page
