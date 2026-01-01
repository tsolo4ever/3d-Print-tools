/**
 * Tab 2: Hardware Configuration
 * Motherboard, stepper drivers, thermistors, and display selection
 * 
 * @module Tab2Hardware
 */

export const Tab2Hardware = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (boards, drivers, displays, thermistors)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const hardware = profile.hardware || {};
    
    return `
      <div class="tab-content">
        <h3>⚙️ Hardware Configuration</h3>

        <!-- Motherboard & Basic Hardware -->
        <div class="form-row">
          <div class="form-group">
            <label>Motherboard *</label>
            <select id="tab2_motherboard" class="form-control">
              <option value="">Select motherboard...</option>
              ${this.renderBoardOptions(hardware.board, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="tab2_motherboardCustom" class="form-control"
              value="${hardware.board && hardware.board.startsWith('custom:') ? hardware.board.replace('custom:', '') : ''}"
              placeholder="Enter custom board name"
              style="display: none; margin-top: 10px;">
            <p class="field-help">Select your motherboard or choose "Custom" to enter manually</p>
          </div>
          <div class="form-group">
            <label>Number of Extruders</label>
            <input type="number" id="tab2_extruders" class="form-control" 
              value="${hardware.extruders || 1}" 
              min="1" max="8" 
              placeholder="1">
            <p class="field-help">Number of extruders/hotends (usually 1)</p>
          </div>
        </div>

        <!-- Temperature Sensors -->
        <h4 style="margin-top: 25px;">Temperature Sensors</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Hotend Thermistor</label>
            <input type="number" id="tab2_hotendTempSensor" class="form-control" 
              value="${hardware.thermistors?.hotend || 1}" 
              placeholder="1">
            <p class="field-help">Thermistor type for hotend (e.g., 1 = 100k thermistor)</p>
          </div>
          <div class="form-group">
            <label>Hotend 2 Thermistor</label>
            <input type="number" id="tab2_hotend2TempSensor" class="form-control" 
              value="${hardware.thermistors?.hotend2 || 0}" 
              placeholder="0">
            <p class="field-help">Second hotend thermistor (0 = disabled)</p>
          </div>
          <div class="form-group">
            <label>Bed Thermistor</label>
            <input type="number" id="tab2_bedTempSensor" class="form-control" 
              value="${hardware.thermistors?.bed || 1}" 
              placeholder="1">
            <p class="field-help">Thermistor type for heated bed</p>
          </div>
          <div class="form-group">
            <label>Chamber Thermistor</label>
            <input type="number" id="tab2_chamberTempSensor" class="form-control" 
              value="${hardware.thermistors?.chamber || 0}" 
              placeholder="0">
            <p class="field-help">Chamber thermistor (0 = disabled)</p>
          </div>
        </div>

        <!-- Stepper Drivers Section -->
        <h4 style="margin-top: 25px;">Stepper Drivers</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Driver</label>
            <select id="tab2_xDriverType" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.x, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="tab2_xDriverTypeCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Y-Axis Driver</label>
            <select id="tab2_yDriverType" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.y, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="tab2_yDriverTypeCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Z-Axis Driver</label>
            <select id="tab2_zDriverType" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.z, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="tab2_zDriverTypeCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>E0 Extruder Driver</label>
            <select id="tab2_e0DriverType" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.e, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="tab2_e0DriverTypeCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
        </div>

        <!-- Display Section -->
        <h4 style="margin-top: 25px;">Display</h4>
        <div class="form-group">
          <label>LCD/Display Type</label>
          <select id="tab2_display" class="form-control">
            <option value="">Select display...</option>
            ${this.renderDisplayOptions(hardware.display, databases)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="tab2_displayCustom" class="form-control" 
            placeholder="Enter custom display" 
            style="display: none; margin-top: 10px;">
        </div>
      </div>
    `;
  },

  /**
   * Render motherboard dropdown options
   * @param {string} selectedBoard - Currently selected board ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderBoardOptions(selectedBoard, databases) {
    if (!databases['marlin-boards']?.boards) return '';
    
    return databases['marlin-boards'].boards.map(board => {
      const selected = selectedBoard === board.id ? 'selected' : '';
      return `<option value="${board.id}" ${selected}>${board.name} (${board.mcu})</option>`;
    }).join('');
  },

  /**
   * Render stepper driver dropdown options
   * @param {string} selectedDriver - Currently selected driver ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderDriverOptions(selectedDriver, databases) {
    if (!databases['stepper-drivers']?.drivers) return '';
    
    return databases['stepper-drivers'].drivers.map(driver => {
      const selected = selectedDriver === driver.id ? 'selected' : '';
      return `<option value="${driver.id}" ${selected}>${driver.name}</option>`;
    }).join('');
  },

  /**
   * Render display dropdown options
   * @param {string} selectedDisplay - Currently selected display ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderDisplayOptions(selectedDisplay, databases) {
    if (!databases['displays']?.displays) return '';
    
    return databases['displays'].displays.map(display => {
      const selected = selectedDisplay === display.id ? 'selected' : '';
      return `<option value="${display.id}" ${selected}>${display.name}</option>`;
    }).join('');
  },

  /**
   * Attach event listeners for this tab
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases
   * @param {Object} context - Additional context (parent controller methods)
   */
  attachListeners(profile, updateCallback, databases, context) {
    // Initialize hardware object if needed
    if (!profile.hardware) profile.hardware = {};
    if (!profile.hardware.drivers) profile.hardware.drivers = {};
    if (!profile.hardware.thermistors) profile.hardware.thermistors = {};

    // Motherboard dropdown
    const boardEl = document.getElementById('tab2_motherboard');
    const boardCustomEl = document.getElementById('tab2_motherboardCustom');
    
    if (boardEl) {
      boardEl.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (boardCustomEl) boardCustomEl.style.display = 'block';
        } else if (e.target.value) {
          if (boardCustomEl) boardCustomEl.style.display = 'none';
          profile.hardware.board = e.target.value;
          profile.modified = new Date().toISOString();
          
          // Auto-fill board details
          if (context.autofillBoardDetails) {
            context.autofillBoardDetails(e.target.value);
          }
          
          updateCallback();
        }
      });
    }
    
    if (boardCustomEl) {
      boardCustomEl.addEventListener('input', (e) => {
        profile.hardware.board = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Number of extruders
    const extrudersEl = document.getElementById('tab2_extruders');
    if (extrudersEl) {
      extrudersEl.addEventListener('input', (e) => {
        profile.hardware.extruders = parseInt(e.target.value) || 1;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Temperature sensors
    const tempSensorEls = {
      'tab2_hotendTempSensor': 'hotend',
      'tab2_hotend2TempSensor': 'hotend2',
      'tab2_bedTempSensor': 'bed',
      'tab2_chamberTempSensor': 'chamber'
    };
    
    for (const [elId, sensorKey] of Object.entries(tempSensorEls)) {
      const el = document.getElementById(elId);
      if (el) {
        el.addEventListener('input', (e) => {
          profile.hardware.thermistors[sensorKey] = parseInt(e.target.value) || 0;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    }

    // Stepper Drivers
    const driverAxes = {
      'X': 'x',
      'Y': 'y',
      'Z': 'z',
      'E0': 'e'
    };
    
    for (const [axisUpper, axisLower] of Object.entries(driverAxes)) {
      const driverType = axisUpper === 'E0' ? 'e0' : axisLower;
      const driverEl = document.getElementById(`tab2_${driverType}DriverType`);
      const driverCustomEl = document.getElementById(`tab2_${driverType}DriverTypeCustom`);
      
      if (driverEl) {
        driverEl.addEventListener('change', (e) => {
          if (e.target.value === '__custom__') {
            if (driverCustomEl) driverCustomEl.style.display = 'block';
          } else {
            if (driverCustomEl) driverCustomEl.style.display = 'none';
            profile.hardware.drivers[axisLower] = e.target.value;
            profile.modified = new Date().toISOString();
            updateCallback();
          }
        });
      }
      
      if (driverCustomEl) {
        driverCustomEl.addEventListener('input', (e) => {
          profile.hardware.drivers[axisLower] = 'custom:' + e.target.value;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    }

    // Display
    const displayEl = document.getElementById('tab2_display');
    const displayCustomEl = document.getElementById('tab2_displayCustom');
    
    if (displayEl) {
      displayEl.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (displayCustomEl) displayCustomEl.style.display = 'block';
        } else {
          if (displayCustomEl) displayCustomEl.style.display = 'none';
          profile.hardware.display = e.target.value;
          profile.modified = new Date().toISOString();
          updateCallback();
        }
      });
    }
    
    if (displayCustomEl) {
      displayCustomEl.addEventListener('input', (e) => {
        profile.hardware.display = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
