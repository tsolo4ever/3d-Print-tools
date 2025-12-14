# 📊 Printer Profiles Usage Guide

How to integrate the Printer Profile Manager into your tools.

---

## 🚀 Quick Start

### 1. Include the Required Files

Add these to your HTML `<head>`:

```html
<!-- Base styles (if not already included) -->
<link rel="stylesheet" href="../assets/css/base.css">

<!-- Printer Profiles CSS -->
<link rel="stylesheet" href="../assets/css/printer-profiles.css">
```

Add these before closing `</body>`:

```html
<!-- Storage Manager (required) -->
<script src="../assets/js/storage-manager.js"></script>

<!-- Printer Profile Manager -->
<script src="../assets/js/printer-profiles.js"></script>
```

---

## 📝 Basic Usage

### HTML Structure

```html
<div id="printerProfiles"></div>
```

### JavaScript Initialization

```javascript
// Initialize the printer profiles section
PrinterProfileManager.render('printerProfiles', {
    showExportImport: true,
    showLoadButton: true,
    onLoad: (printer) => {
        // This runs when user clicks "Load" button
        console.log('Loaded printer:', printer);
    }
});
```

---

## ⚙️ Configuration Options

```javascript
{
    // Show export/import buttons (default: true)
    showExportImport: true,
    
    // Show "Load" button on each printer card (default: true)
    showLoadButton: true,
    
    // Callback when "Load" is clicked
    onLoad: null,
    
    // Message shown when no printers saved
    emptyMessage: 'No printer profiles saved yet. Add one to get started!'
}
```

---

## 🎯 Example: E-Steps Calculator Integration

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/printer-profiles.css">
</head>
<body>
    <!-- Printer Profiles Section -->
    <div id="printerProfiles"></div>

    <!-- Calculator -->
    <div class="calculator">
        <h2>E-Steps Calculator</h2>
        <input type="number" id="currentEsteps" placeholder="Current E-Steps">
        <!-- ... more calculator fields ... -->
    </div>

    <script src="../assets/js/storage-manager.js"></script>
    <script src="../assets/js/printer-profiles.js"></script>
    <script>
        // Initialize printer profiles
        PrinterProfileManager.render('printerProfiles', {
            showLoadButton: true
        });

        // Listen for printer loaded event
        document.addEventListener('printerLoaded', (event) => {
            const printer = event.detail;
            
            // Automatically fill calculator with printer's E-steps
            document.getElementById('currentEsteps').value = printer.esteps;
            
            // Optionally scroll to calculator
            document.querySelector('.calculator').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    </script>
</body>
</html>
```

---

## 🔧 API Reference

### StorageManager

#### Printer Management

```javascript
// Get all printers
const printers = StorageManager.getPrinters();

// Get specific printer
const printer = StorageManager.getPrinter(id);

// Add printer
const newPrinter = StorageManager.addPrinter({
    name: 'Ender 3 Max',
    esteps: 425.0,
    extruder: 'Sprite Pro',
    notes: 'My main printer'
});

// Update printer
StorageManager.updatePrinter(id, {
    esteps: 430.0,
    notes: 'Updated settings'
});

// Delete printer
StorageManager.deletePrinter(id);

// Clear all printers
StorageManager.clearPrinters();
```

#### Tool History

```javascript
// Add history entry
StorageManager.addToolHistory('esteps', {
    currentEsteps: 425.0,
    requestedExtrusion: 100,
    actualExtrusion: 97,
    newEsteps: 437.20
});

// Get history
const history = StorageManager.getToolHistory('esteps', 10); // Last 10 entries

// Clear history
StorageManager.clearToolHistory('esteps');
```

#### Preferences

```javascript
// Get all preferences
const prefs = StorageManager.getPreferences();

// Get specific preference
const theme = StorageManager.getPreference('theme', 'light');

// Set preference
StorageManager.setPreference('theme', 'dark');

// Update multiple preferences
StorageManager.updatePreferences({
    theme: 'dark',
    units: 'metric'
});
```

#### Export/Import

```javascript
// Export to file (downloads automatically)
StorageManager.exportToFile();

// Get data as JSON string
const json = StorageManager.exportData();

// Import from JSON string
StorageManager.importData(jsonString);

// Import from file (use with file input)
const file = event.target.files[0];
await StorageManager.importFromFile(file);
```

---

## 🎨 Custom Styling

Override these CSS variables to customize appearance:

```css
.printer-profiles-section {
    /* Change border color */
    border-color: var(--primary);
}

.printer-card {
    /* Customize card appearance */
    background: linear-gradient(to bottom, white, #f5f5f5);
}

.btn-primary {
    /* Customize button color */
    background: #custom-color;
}
```

---

## 📊 Data Structure

### Printer Object

```javascript
{
    id: 'printer_1234567890',      // Auto-generated
    name: 'Ender 3 Max',            // Required
    esteps: 425.0,                  // Required
    extruder: 'Sprite Pro',         // Optional
    notes: 'My main printer',       // Optional
    created: '2024-12-13T10:00:00Z',// Auto-generated
    modified: '2024-12-13T10:00:00Z'// Auto-updated
}
```

### Global Storage Structure

```javascript
{
    version: '1.0',
    created: '2024-12-13T10:00:00Z',
    lastModified: '2024-12-13T10:00:00Z',
    preferences: {
        theme: 'light',
        units: 'metric',
        showTips: true
    },
    printers: [
        // Array of printer objects
    ],
    tools: {
        esteps: {
            history: [
                // Array of test results
            ]
        },
        flow: {
            history: []
        }
        // ... other tools
    }
}
```

---

## 🎯 Common Use Cases

### 1. Pre-populate Calculator

```javascript
document.addEventListener('printerLoaded', (event) => {
    const printer = event.detail;
    document.getElementById('currentEsteps').value = printer.esteps;
});
```

### 2. Save Calculator Results

```javascript
function calculateEsteps() {
    // ... your calculation logic ...
    
    // Save to history
    StorageManager.addToolHistory('esteps', {
        currentEsteps: currentValue,
        newEsteps: calculatedValue,
        timestamp: new Date().toISOString()
    });
}
```

### 3. Show Recent Tests

```javascript
function displayHistory() {
    const history = StorageManager.getToolHistory('esteps', 5);
    
    history.forEach(entry => {
        console.log(`Test from ${entry.timestamp}`);
        console.log(`Old: ${entry.currentEsteps}, New: ${entry.newEsteps}`);
    });
}
```

### 4. Export Button Integration

```javascript
<button onclick="StorageManager.exportToFile()">
    📤 Backup My Data
</button>
```

---

## ⚠️ Important Notes

1. **localStorage Limitations**
   - Maximum ~5-10 MB per domain
   - Cleared when user clears browser cache
   - Use Export feature for backups!

2. **Privacy**
   - All data stays local (browser only)
   - No server communication
   - User controls their data

3. **Browser Support**
   - Works in all modern browsers
   - IE11+ supported
   - Check with `StorageManager.isAvailable()`

---

## 🐛 Troubleshooting

### Storage not working?

```javascript
if (!StorageManager.isAvailable()) {
    alert('localStorage is not available in your browser');
}
```

### Data not persisting?

- Check if browser is in "Private/Incognito" mode
- Verify localStorage isn't disabled
- Check browser storage quota

### Import failing?

- Ensure JSON file is valid
- Check file was exported from same tool
- Verify file isn't corrupted

---

## 📚 Examples in the Wild

See these tools for working examples:

- `E-Steps_Calculator_Interactive/` - Full integration
- `flow-calibration/` (coming soon)
- `temperature-tower/` (coming soon)

---

## 🆘 Need Help?

- Check browser console for errors
- Verify all scripts are loaded
- Test `StorageManager.isAvailable()`
- Check that container ID exists

---

**Happy coding!** 🚀
