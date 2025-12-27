
### What
- Add **single parser** `assets/js/marlin-config-parser.js` (Marlin + TH3D via mappingSets).
- Update **Enhanced Printer Profiles** to use the single parser + comply with **debug logging** pattern.
- Keep **manual mapping file lists** in `mappingSets` (TH3D + Marlin).

### Why
- Normalize all imports into one code path → simpler maintenance and consistent behavior.
- Follow our **JavaScript Debug Logging Convention**:
  - Module `DEBUG` flag + `log(...)` wrapper.
  - `console.log` → `this.log`.
  - Preserve `console.error`/`console.warn` visibility.

### How to test
1. Open the editor, go to **Quick Import**.
2. Upload `Configuration.h` + `Configuration_adv.h` (and optional `backend`, `speed`).
3. Verify parsed values populate hardware/temperature/motion/probe/leveling/advanced/safety tabs.
4. Toggle `EnhancedPrinterProfiles.DEBUG` to confirm silence/verbosity switching.

### Notes
- If you add new mapping files later, append them to the **manual list** in `mappingSets.th3d.files` or `mappingSets.marlin.files`.
- If order-sensitive overrides are needed, keep files in the intended sequence; the parser merges with “last wins”.
