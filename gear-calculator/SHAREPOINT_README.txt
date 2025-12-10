================================================================================
  GEAR CALCULATOR PRO v4.12 - Company Distribution Package
================================================================================

QUICK START INSTRUCTIONS
-------------------------
1. Extract the ZIP file to your computer
2. Double-click "index.html" to open the calculator
3. Click the "❓ Help & Documentation" button for complete instructions

WHAT'S INCLUDED
---------------
✓ index.html          - Main calculator (works offline, no installation)
✓ help.html           - Complete documentation and formula reference
✓ README.md           - Technical documentation
✓ CHANGELOG.md        - Version history and bug fixes
✓ IMPROVEMENTS.md     - Recent feature additions
✓ .gitignore          - Git configuration (for developers)

SYSTEM REQUIREMENTS
-------------------
• Modern web browser (Chrome, Edge, Firefox, Safari)
• No internet connection required after initial download
• No installation or plugins needed
• Works on Windows, Mac, and Linux

KEY FEATURES
------------
✓ Spur gear calculations (metric and imperial)
✓ Multiple input modes (Module, DP, OD, PD + Teeth)
✓ Profile shift auto-matching for reverse engineering
✓ 3D printing orientation assistant
✓ Resin shrinkage compensation calculator
✓ Calibration tools (ring method)
✓ Mating gear checker (center distance)
✓ Save/export library (XML, CSV)
✓ Built-in help system with formulas and workflows

INTENDED USE
------------
• Mechanical design and prototyping
• 3D printing gears (resin/FDM)
• Reverse-engineering existing gears
• Educational purposes
• Gear specification documentation

GETTING HELP
------------
1. In-app: Click "❓ Help & Documentation" button
2. Quick reference: Built-in popup modal with key formulas
3. Full guide: Open "help.html" for complete documentation
4. Glossary: "help.html" includes definitions of all terms

IMPORTANT NOTES
---------------
⚠️ Always validate calculations against CAD software before manufacturing
⚠️ Test prints recommended before production runs
⚠️ Data stored locally in browser - export regularly for backup
⚠️ DXF export creates simplified circle (placeholder for full involute)

TYPICAL WORKFLOWS
-----------------

1. DESIGN NEW GEAR
   → Choose module and teeth count
   → Set PA = 20°, c = 0.25, x = 0
   → Click Compute
   → Use Orientation Assistant for 3D printing setup
   → Add to Library

2. REVERSE-ENGINEER GEAR
   → Count teeth
   → Measure OD with calipers
   → Set mode to Module + Teeth
   → Enter estimated module
   → Use Auto-Match to find profile shift
   → Verify with CAD software

3. 3D PRINT WORKFLOW
   → Calculate gear
   → Use Ring Method to calibrate shrinkage
   → Apply scale factor in slicer
   → Orient per Assistant recommendations
   → Test print and verify dimensions

4. DESIGN GEAR PAIR
   → Choose same module for both gears
   → Calculate each gear separately
   → Use Mating Gear Checker to verify center distance
   → Apply same shrinkage compensation to both

STANDARD VALUES REFERENCE
--------------------------
Pressure Angle (PA):
  • 14.5° - Older standard
  • 20°   - Most common (recommended)
  • 25°   - High-strength applications

Clearance (c):
  • 0.25  - Standard value (recommended)
  • 0.2-0.3 - Acceptable range

Profile Shift (x):
  • 0     - Standard gear (most common)
  • +0.2 to +0.5 - Stronger teeth, prevent undercut
  • -0.2 to -0.5 - Weaker teeth (avoid if possible)

Module (m) - Common values:
  • 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0 mm

TROUBLESHOOTING
---------------

Problem: Calculator won't open
Solution: Make sure you extracted ALL files from ZIP, not just index.html

Problem: Auto-match always returns -0.8
Solution: Use Module/PD/DP mode, NOT "Outside Diameter + Teeth" mode

Problem: Data disappeared after closing browser
Solution: Data is browser-specific. Export XML/CSV regularly for backup

Problem: 3D printed gear wrong size
Solution: Run calibration ring test, apply shrinkage compensation

Problem: Gears don't mesh smoothly
Solution: Verify both gears have same module and pressure angle

SUPPORT
-------
For questions or issues:
• Check help.html for detailed explanations
• Review CHANGELOG.md for known issues
• Consult with engineering team for validation

DATA BACKUP RECOMMENDATION
---------------------------
If you plan to save gear calculations:
1. Click "💾 Save XML" regularly
2. Store exports in shared network location
3. Consider adding to version control (Git)

VERSION INFORMATION
-------------------
Version: 4.12-fixed-v2
Release Date: 2024
Key Improvements:
  • Fixed AutoMatch bug (no longer returns -0.8)
  • Added auto-fill OD feature
  • Optimized performance (400x faster auto-match)
  • Added comprehensive help system
  • Improved validation and error messages

LICENSE & DISCLAIMER
--------------------
This tool is provided for educational and design assistance purposes.
Always validate calculations independently before manufacturing.
No warranty expressed or implied.

================================================================================
For complete technical documentation, open README.md in a text editor
or view help.html in your web browser.
================================================================================
