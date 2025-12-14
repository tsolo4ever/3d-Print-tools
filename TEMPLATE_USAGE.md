# 📋 Tool Template Usage Guide

## 🎯 Quick Start

The `_template-tool.html` file is your starting point for creating new calculator tools. It includes:

✅ Complete navigation with theme toggle  
✅ Printer profile integration  
✅ Dark mode support via CSS variables  
✅ Mobile-responsive layout  
✅ Pre-styled form elements and buttons  
✅ Result display boxes  
✅ Info/warning/success message boxes  

---

## 🚀 Creating a New Tool (5 Steps)

### Step 1: Copy the Template
```bash
# From your Code directory
cp _template-tool.html new-tool-name/index.html
```

### Step 2: Update Meta Information
Find all `📝 TODO` comments and update:

```html
<!-- Change title -->
<title>Tool Name - 3D Printer Calibration Suite</title>

<!-- Change description -->
<meta name="description" content="Brief description">

<!-- Update hero section -->
<h1>🔧 Tool Name</h1>
<p>Brief description...</p>
```

### Step 3: Fix Asset Paths
Since your tool is in a subdirectory, update the paths:

**Change FROM:**
```html
<link rel="stylesheet" href="assets/css/base.css">
```

**Change TO:**
```html
<link rel="stylesheet" href="../assets/css/base.css">
```

Do this for:
- All CSS links (3 files)
- All JS script tags (3 files)
- Navigation logo link (`href="/"` → `href="../"`)

### Step 4: Customize Your Calculator
Replace the example form with your actual inputs:

```html
<!-- Example input -->
<div class="form-group">
    <label for="esteps">Current E-Steps</label>
    <input type="number" id="esteps" placeholder="100">
</div>
```

Update the JavaScript `calculate()` function with your logic:

```javascript
function calculate() {
    const value = parseFloat(document.getElementById('esteps').value);
    
    // Your calculation
    const result = value * 1.15;
    
    // Display result
    document.getElementById('resultValue').textContent = result.toFixed(2);
    document.getElementById('results').style.display = 'block';
}
```

### Step 5: Add Instructions & Guide
Update the step-by-step guide section with tool-specific instructions.

---

## 📁 File Structure After Creation

```
Code/
├── _template-tool.html          ← Template (don't modify)
├── TEMPLATE_USAGE.md            ← This guide
└── your-new-tool/
    └── index.html               ← Your tool (from template)
```

---

## 🎨 Available Components

### Form Elements

```html
<!-- Text Input -->
<div class="form-group">
    <label for="input">Label</label>
    <input type="text" id="input" placeholder="Placeholder">
</div>

<!-- Number Input -->
<div class="form-group">
    <label for="number">Number</label>
    <input type="number" id="number" step="0.01">
</div>

<!-- Dropdown -->
<div class="form-group">
    <label for="select">Choose</label>
    <select id="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
    </select>
</div>

<!-- Textarea -->
<div class="form-group">
    <label for="notes">Notes</label>
    <textarea id="notes" rows="4"></textarea>
</div>
```

### Multi-Column Forms

```html
<!-- 2 columns on desktop, 1 on mobile -->
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

### Buttons

```html
<!-- Primary button -->
<button class="btn" onclick="calculate()">Calculate</button>

<!-- Secondary button -->
<button class="btn btn-secondary" onclick="reset()">Reset</button>

<!-- Multiple buttons -->
<div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
    <button class="btn">Button 1</button>
    <button class="btn btn-secondary">Button 2</button>
</div>
```

### Message Boxes

```html
<!-- Info Box (Blue) -->
<div class="info-box">
    <strong>ℹ️ Info:</strong> Information message here
</div>

<!-- Warning Box (Orange) -->
<div class="warning-box">
    <strong>⚠️ Warning:</strong> Warning message here
</div>

<!-- Success Box (Green) -->
<div class="success-box">
    <strong>✅ Success:</strong> Success message here
</div>
```

### Result Display

```html
<div class="result-box">
    <h3>📊 Results</h3>
    <div class="result-value">123.45</div>
    <p style="color: var(--text-secondary);">
        Explanation of result
    </p>
</div>
```

---

## 🎨 Using CSS Variables

All colors, spacing, and styles use CSS variables for automatic dark mode support:

### Colors
```css
var(--text-primary)      /* Main text */
var(--text-secondary)    /* Secondary text */
var(--background)        /* Page background */
var(--card-bg)           /* Card background */
var(--border)            /* Border color */
var(--primary)           /* Primary brand color */
var(--primary-hover)     /* Hover state */
```

### Spacing
```css
var(--spacing-xs)        /* 5px */
var(--spacing-sm)        /* 10px */
var(--spacing-md)        /* 20px */
var(--spacing-lg)        /* 40px */
var(--spacing-xl)        /* 60px */
```

### Status Colors
```css
var(--success)           /* Green */
var(--warning)           /* Orange */
var(--error)             /* Red */
var(--info)              /* Blue */
var(--success-light)     /* Light green background */
var(--warning-light)     /* Light orange background */
```

---

## 🔌 Printer Profiles Integration

### Enable Printer Profiles
The template includes printer profile support. Just initialize it:

```javascript
PrinterProfileManager.render('printerProfiles', {
    showLoadButton: true,
    onLoad: (printer) => {
        // Auto-fill your form
        document.getElementById('esteps').value = printer.esteps;
    }
});
```

### Listen for Printer Loaded
```javascript
document.addEventListener('printerLoaded', (event) => {
    const printer = event.detail;
    console.log('Loaded printer:', printer);
    // Fill your form fields here
});
```

### Save to History
```javascript
StorageManager.addToolHistory('your-tool-name', {
    input: inputValue,
    result: resultValue,
    timestamp: new Date().toISOString()
});
```

---

## ✅ Checklist for New Tool

Use this checklist when creating a new tool:

- [ ] Copy template to new folder
- [ ] Update `<title>` tag
- [ ] Update meta description
- [ ] Update hero heading and description
- [ ] Fix asset paths (add `../` prefix)
- [ ] Update navigation logo link
- [ ] Replace example form with actual inputs
- [ ] Implement `calculate()` function
- [ ] Implement `reset()` function
- [ ] Update step-by-step instructions
- [ ] Update FAQ section
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test on mobile (F12 → device mode)
- [ ] Test printer profile loading (if used)
- [ ] Test all buttons and inputs
- [ ] Validate all calculations

---

## 📊 Example: Creating Flow Calibration Tool

```bash
# 1. Copy template
cp _template-tool.html flow-calibration/index.html

# 2. Edit flow-calibration/index.html
```

Update key sections:
```html
<!-- Title -->
<title>Flow Calibration - 3D Printer Calibration Suite</title>

<!-- Hero -->
<h1>💧 Flow Calibration</h1>
<p>Fine-tune your flow percentage for perfect extrusion</p>

<!-- Form -->
<div class="form-row">
    <div class="form-group">
        <label for="targetWidth">Target Wall Width (mm)</label>
        <input type="number" id="targetWidth" value="0.4" step="0.01">
    </div>
    <div class="form-group">
        <label for="actualWidth">Actual Wall Width (mm)</label>
        <input type="number" id="actualWidth" step="0.01">
    </div>
</div>

<!-- JavaScript -->
<script>
function calculate() {
    const target = parseFloat(document.getElementById('targetWidth').value);
    const actual = parseFloat(document.getElementById('actualWidth').value);
    
    if (isNaN(target) || isNaN(actual)) {
        alert('Please enter valid numbers');
        return;
    }
    
    // Calculate flow percentage
    const flowRate = (target / actual) * 100;
    
    // Display
    document.getElementById('resultValue').textContent = 
        flowRate.toFixed(1) + '%';
    document.getElementById('results').style.display = 'block';
    
    // Save to history
    StorageManager.addToolHistory('flow-calibration', {
        target: target,
        actual: actual,
        flowRate: flowRate,
        timestamp: new Date().toISOString()
    });
}
</script>
```

Done! You now have a fully functional Flow Calibration tool.

---

## 🎯 Best Practices

### 1. Use Semantic HTML
```html
<!-- Good -->
<header>
<main>
<section>
<article>

<!-- Avoid -->
<div class="header">
<div class="main">
```

### 2. Always Use CSS Variables
```css
/* Good */
color: var(--text-primary);

/* Avoid */
color: #333;
```

### 3. Validate User Input
```javascript
function calculate() {
    const value = parseFloat(document.getElementById('input').value);
    
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (value <= 0) {
        alert('Value must be greater than 0');
        return;
    }
    
    // Continue with calculation...
}
```

### 4. Provide Clear Instructions
- Use info boxes for helpful tips
- Use warning boxes for important notes
- Include step-by-step guides
- Add FAQs for common questions

### 5. Mobile-First
- Test on mobile devices
- Use responsive grid layouts
- Make buttons touch-friendly (min 44px)
- Ensure text is readable (min 16px)

---

## 🐛 Troubleshooting

### Styles Not Loading?
- Check asset paths have `../` prefix
- Verify files exist in `assets/css/`
- Check browser console for 404 errors

### Theme Toggle Not Working?
- Verify `navigation.js` is loaded
- Check for JavaScript errors in console
- Ensure HTML has proper structure

### Printer Profiles Not Showing?
- Verify `storage-manager.js` loads first
- Then `printer-profiles.js`
- Check container ID matches: `id="printerProfiles"`
- Verify `PrinterProfileManager.render()` is called

---

## 📚 Additional Resources

- **THEME_USAGE_GUIDE.md** - Complete theme system guide
- **PRINTER_PROFILES_USAGE.md** - Printer profiles API
- **assets/css/base.css** - All available CSS variables
- **Existing tools** - See E-Steps, Nozzle Guide, Gear Calc for examples

---

**Happy tool building!** 🔧

If you have questions or need help, refer to the other MD files or check existing tools for examples.

---

**Created:** December 14, 2024  
**Template Version:** 1.0  
**Status:** ✅ Ready to use
