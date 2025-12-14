# Theme System Usage Guide

## How to Add Theme Toggle to Any Tool

The theme system is **fully global and reusable**. Here's how to add it to any page in the suite:

### Quick Setup (3 Steps)

#### 1. Link the CSS Files in `<head>`
```html
<head>
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/navigation.css">
    <!-- Your custom styles here -->
</head>
```

#### 2. Add the Navigation Bar
```html
<body>
    <!-- Navigation -->
    <nav class="suite-nav">
        <div class="container">
            <a href="../" class="logo">🔧 Calibration Suite</a>
            <button class="mobile-menu-toggle">☰</button>
            <div class="nav-links">
                <a href="../">Home</a>
                <a href="../E-Steps_Calculator_Interactive/index.html">E-Steps</a>
                <a href="../SharePoint_Nozzle_Selection_Guide/">Nozzle Guide</a>
                <a href="../gear-calculator/">Gear Calc</a>
                <a href="../docs/">Docs</a>
            </div>
            <div class="nav-actions">
                <button class="theme-toggle" title="Toggle Theme">🌙</button>
            </div>
        </div>
    </nav>
    
    <!-- Your page content here -->
</body>
```

#### 3. Link the JavaScript at the Bottom
```html
    <script src="../assets/js/navigation.js"></script>
</body>
</html>
```

**That's it!** The theme toggle will automatically work.

---

## Converting Existing Styles to Use Theme Variables

### Replace Hardcoded Colors

**❌ Don't do this:**
```css
body {
    background-color: #f5f5f5;
    color: #333;
}

.card {
    background: white;
    border: 1px solid #e0e0e0;
}
```

**✅ Do this instead:**
```css
body {
    background-color: var(--background);
    color: var(--text-primary);
}

.card {
    background: var(--card-bg);
    border: 1px solid var(--border);
}
```

### Available CSS Variables

#### Colors
```css
/* Backgrounds */
var(--background)      /* Page background */
var(--card-bg)         /* Card/container backgrounds */

/* Text */
var(--text-primary)    /* Main text color */
var(--text-secondary)  /* Secondary text, descriptions */
var(--text-light)      /* Subtle text, hints */

/* Borders & Lines */
var(--border)          /* Borders, dividers */

/* Brand Colors */
var(--primary)         /* Primary brand color */
var(--primary-hover)   /* Primary hover state */
var(--primary-light)   /* Primary light backgrounds */

/* Calculator Accents */
var(--esteps-accent)   /* Purple #667eea */
var(--nozzle-accent)   /* Red #ff6b6b */
var(--gear-accent)     /* Teal #4ecdc4 */
var(--flow-accent)     /* Blue #45b7d1 */
var(--temp-accent)     /* Warm Red #f38181 */
var(--retract-accent)  /* Lavender #aa96da */

/* Status Colors */
var(--success)         /* Green */
var(--success-light)   /* Light green background */
var(--warning)         /* Orange */
var(--warning-light)   /* Light orange background */
var(--error)           /* Red */
var(--error-light)     /* Light red background */
var(--info)            /* Blue */
var(--info-light)      /* Light blue background */
```

#### Spacing
```css
var(--spacing-xs)      /* 5px */
var(--spacing-sm)      /* 10px */
var(--spacing-md)      /* 20px */
var(--spacing-lg)      /* 40px */
var(--spacing-xl)      /* 60px */
```

#### Other
```css
var(--radius-sm)       /* 4px border radius */
var(--radius-md)       /* 8px border radius */
var(--radius-lg)       /* 12px border radius */

var(--shadow-sm)       /* Small shadow */
var(--shadow-md)       /* Medium shadow */
var(--shadow-lg)       /* Large shadow */

var(--transition-fast)    /* 0.2s ease */
var(--transition-normal)  /* 0.3s ease */
```

---

## Refactoring Checklist

When converting an existing tool to use the theme system:

- [ ] Link `base.css` and `navigation.css`
- [ ] Add navigation bar with theme toggle button
- [ ] Link `navigation.js`
- [ ] Replace all hardcoded colors with CSS variables
- [ ] Replace `background: white` with `var(--card-bg)`
- [ ] Replace `color: #333` with `var(--text-primary)`
- [ ] Replace `background: #f5f5f5` with `var(--background)`
- [ ] Replace border colors with `var(--border)`
- [ ] Test in both light and dark modes
- [ ] Verify mobile menu works

---

## File Paths Reference

From different tool directories:

**Root level tools** (like index.html):
```html
<link rel="stylesheet" href="assets/css/base.css">
<script src="assets/js/navigation.js"></script>
```

**Subdirectory tools** (like E-Steps_Calculator_Interactive/):
```html
<link rel="stylesheet" href="../assets/css/base.css">
<script src="../assets/js/navigation.js"></script>
```

**Nested tools** (if you have tools/calculator/):
```html
<link rel="stylesheet" href="../../assets/css/base.css">
<script src="../../assets/js/navigation.js"></script>
```

---

## How It Works

1. **CSS Variables** in `base.css` define all colors
2. **Light mode** uses default `:root` values
3. **Dark mode** overrides with `[data-theme="dark"]` selector
4. **JavaScript** in `navigation.js`:
   - Loads saved theme from localStorage on page load
   - Toggles `data-theme` attribute on `<html>` element
   - Saves preference to localStorage
   - Updates button icon
5. **All pages** that link these files automatically get theme support

---

## Example: Before & After

### BEFORE (No Theme Support)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Tool</title>
    <style>
        body {
            background: #f5f5f5;
            color: #333;
        }
        .card {
            background: white;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <h1>My Tool</h1>
    <div class="card">Content</div>
</body>
</html>
```

### AFTER (Full Theme Support)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Tool</title>
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/navigation.css">
    <style>
        body {
            background: var(--background);
            color: var(--text-primary);
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
        }
    </style>
</head>
<body>
    <nav class="suite-nav">
        <div class="container">
            <a href="../" class="logo">🔧 Calibration Suite</a>
            <button class="mobile-menu-toggle">☰</button>
            <div class="nav-links">
                <a href="../">Home</a>
                <a href="../E-Steps_Calculator_Interactive/">E-Steps</a>
            </div>
            <div class="nav-actions">
                <button class="theme-toggle" title="Toggle Theme">🌙</button>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1>My Tool</h1>
        <div class="card">Content</div>
    </div>

    <script src="../assets/js/navigation.js"></script>
</body>
</html>
```

---

## Next Steps

### Priority: Refactor Existing Tools

1. **E-Steps Calculator** - Convert to use shared theme system
2. **Nozzle Selection Guide** - Convert to use shared theme system  
3. **Gear Calculator** - Convert to use shared theme system

Would you like me to refactor these existing tools to use the global theme system?

---

**Last Updated:** December 13, 2024  
**System Status:** ✅ Fully functional and reusable
