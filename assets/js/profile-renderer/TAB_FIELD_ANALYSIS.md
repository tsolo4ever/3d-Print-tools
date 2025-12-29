# Enhanced Printer Profiles - Tab Field Analysis

This document maps all fields used in each tab to prepare for adding UI metadata to the mapping JSON.

## Tab 1: Printer Info ✅ (COMPLETED)
- [x] `basic.machineName` - text input
- [x] `basic.motherboard` - database-select (marlin-boards)
- [x] `basic.extruders` - number input
- [x] `basic.baudRate` - select dropdown
- [x] `hardware.driverX` - database-select (stepper-drivers)
- [x] `hardware.driverY` - database-select (stepper-drivers)
- [x] `hardware.driverZ` - database-select (stepper-drivers)
- [x] `hardware.driverE0` - database-select (stepper-drivers)
- [x] `hardware.thermistorHotend` - database-select (thermistors)
- [x] `hardware.thermistorBed` - database-select (thermistors)
- [x] Special: Printer database search (autocomplete)
- [x] Special: Configuration.h import buttons

## Tab 2: Hardware Configuration
Fields to add:
- [ ] `hardware.board` - database-select (marlin-boards) with custom option
- [ ] `hardware.drivers.x` - database-select (stepper-drivers) with custom
- [ ] `hardware.drivers.y` - database-select (stepper-drivers) with custom
- [ ] `hardware.drivers.z` - database-select (stepper-drivers) with custom
- [ ] `hardware.drivers.e` - database-select (stepper-drivers) with custom
- [ ] `hardware.display` - database-select (displays) with custom

## Tab 3: Hotend & Extruder
Fields to add:
- [ ] `hotendType` - database-select (Hotends) with custom
- [ ] `temperature.hotend.max` - number (°C)
- [ ] `hotendHeater` - database-select (heaters)
- [ ] `highFlowHotend` - checkbox
- [ ] `hardware.thermistors.hotend` - database-select (thermistors) with custom
- [ ] `temperature.hotend.pid.p` - number (PID P)
- [ ] `temperature.hotend.pid.i` - number (PID I)
- [ ] `temperature.hotend.pid.d` - number (PID D)
- [ ] `extruderType` - select (direct/bowden)
- [ ] `motion.steps.e` - number (E-steps/mm)
- [ ] `motion.maxFeedrates.e` - number (mm/s)
- [ ] `motion.maxAccel.e` - number (mm/s²)

## Tab 4: Bed Configuration
Fields to add:
- [ ] `temperature.bedType` - select dropdown
- [ ] `temperature.bed.max` - number (°C)
- [ ] `hardware.thermistors.bed` - database-select (thermistors) with custom
- [ ] `temperature.bed.pid.p` - number (PID P)
- [ ] `temperature.bed.pid.i` - number (PID I)
- [ ] `temperature.bed.pid.d` - number (PID D)
- [ ] `bedSize.x` - number (mm)
- [ ] `bedSize.y` - number (mm)
- [ ] `bedSize.z` - number (mm)

## Tab 5: Probe & Leveling
Fields to add:
- [ ] `probe.type` - database-select (bed-probes) with custom
- [ ] `probe.offsets.x` - number (mm)
- [ ] `probe.offsets.y` - number (mm)
- [ ] `probe.offsets.z` - number (mm)
- [ ] `bedLeveling.type` - select (none/abl/ubl/mbl/mesh) with custom
- [ ] `bedLeveling.gridPoints.x` - number
- [ ] `bedLeveling.gridPoints.y` - number
- [ ] `bedLeveling.fadeHeight` - number (mm)

## Tab 6: Motion Settings
Fields to add:
- [ ] `motion.steps.x` - number (steps/mm)
- [ ] `motion.steps.y` - number (steps/mm)
- [ ] `motion.steps.z` - number (steps/mm)
- [ ] `motion.steps.e` - number (steps/mm)
- [ ] `motion.maxFeedrates.x` - number (mm/s)
- [ ] `motion.maxFeedrates.y` - number (mm/s)
- [ ] `motion.maxFeedrates.z` - number (mm/s)
- [ ] `motion.maxFeedrates.e` - number (mm/s)
- [ ] `motion.maxAccel.x` - number (mm/s²)
- [ ] `motion.maxAccel.y` - number (mm/s²)
- [ ] `motion.maxAccel.z` - number (mm/s²)
- [ ] `motion.maxAccel.e` - number (mm/s²)
- [ ] `motion.jerk.x` - number (mm/s)
- [ ] `motion.jerk.y` - number (mm/s)
- [ ] `motion.jerk.z` - number (mm/s)
- [ ] `motion.jerk.e` - number (mm/s)
- [ ] `motion.printAccel` - number (mm/s²)
- [ ] `motion.retractAccel` - number (mm/s²)
- [ ] `motion.travelAccel` - number (mm/s²)

## Tab 7: Advanced Features
Fields to add:
- [ ] `advanced.linearAdvance.type` - select (none/marlin/klipper/reprap) with custom
- [ ] `advanced.linearAdvance.k` - number (K factor)
- [ ] `advanced.arcSupport` - checkbox
- [ ] `advanced.junctionDeviation.enabled` - select (classic/junction)
- [ ] `advanced.junctionDeviation.value` - number
- [ ] `advanced.inputShaping.type` - select (none/klipper/marlin) with custom
- [ ] `advanced.inputShaping.shaperType` - select (mzv/ei/2hump_ei/3hump_ei/zv) with custom
- [ ] `advanced.runoutSensor.type` - select (none/mechanical/encoder/optical) with custom
- [ ] `advanced.runoutSensor.inverted` - checkbox
- [ ] `advanced.autoReportTemp` - checkbox
- [ ] `advanced.sdCardSupport` - checkbox
- [ ] `advanced.eepromSupport` - checkbox

## Tab 8: Safety Features
Fields to add:
- [ ] `safety.thermalProtection.hotend` - checkbox
- [ ] `safety.thermalProtection.bed` - checkbox
- [ ] `safety.runaway.period` - number (seconds)
- [ ] `safety.runaway.hysteresis` - number (°C)
- [ ] `safety.hotendMinTemp` - number (°C)
- [ ] `safety.hotendMaxTemp` - number (°C)
- [ ] `safety.bedMinTemp` - number (°C)
- [ ] `safety.bedMaxTemp` - number (°C)
- [ ] `safety.minExtrusionTemp` - number (°C)
- [ ] `safety.maxExtrusionLength` - number (mm)
- [ ] `safety.preventColdExtrusion` - checkbox
- [ ] `safety.powerLossRecovery.type` - select (none/basic/advanced) with custom
- [ ] `safety.noMovesBeforeHoming` - checkbox
- [ ] `safety.softwareEndstops` - checkbox

## Tab 9: Nozzles (Inventory Management)
This tab is a **dynamic list** - not standard fields. Will need special handling:
- [ ] Nozzle list management (add/edit/delete)
- [ ] Per-nozzle fields:
  - `size` - number (mm)
  - `material` - select with custom
  - `brand` - select with custom
  - `thread` - select with custom
  - `condition` - select
  - `notes` - textarea

## Tab 10: Preferences & Notes
Fields to add:
- [ ] `preferences.slicer` - select with custom
- [ ] `preferences.materials` - checkbox group (PLA/PETG/ABS/ASA/TPU/Nylon/PC/CF/Wood)
- [ ] `preferences.materialsOther` - text input
- [ ] `preferences.enclosure` - select (none/partial/full/heated) with custom
- [ ] `notes` - textarea
- [ ] `created` - readonly text (metadata)
- [ ] `modified` - readonly text (metadata)

## Summary Statistics
- **Total standard fields across all tabs:** ~100+
- **Tab 1:** 10 fields ✅ DONE
- **Tabs 2-10:** ~90+ fields to add UI metadata
- **Special cases:** Tab 9 (dynamic list), Tab 1 (autocomplete/import features)
