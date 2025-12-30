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

        <!-- Motherboard Section -->
        <div class="form-group">
          <label>Motherboard *</label>
          <select id="hardwareBoard" class="form-control">
            <option value="">Select motherboard...</option>
            ${this.renderBoardOptions(hardware.board, databases)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="hardwareBoardCustom" class="form-control"
            value="${hardware.board && hardware.board.startsWith('custom:') ? hardware.board.replace('custom:', '') : ''}"
            placeholder="Enter custom board name"
            style="display: none; margin-top: 10px;">
          <p class="field-help">Select your motherboard or choose "Custom" to enter manually</p>
        </div>

        <!-- Stepper Drivers Section -->
        <h4 style="margin-top: 25px;">Stepper Drivers</h4>
        <div class="form-row">
          <div class="form-group">
            <label>X-Axis Driver</label>
            <select id="driverX" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.x, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverXCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Y-Axis Driver</label>
            <select id="driverY" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.y, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverYCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Z-Axis Driver</label>
            <select id="driverZ" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.z, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverZCustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
          <div class="form-group">
            <label>Extruder Driver</label>
            <select id="driverE" class="form-control">
              <option value="">Select driver...</option>
              ${this.renderDriverOptions(hardware.drivers?.e, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="driverECustom" class="form-control" 
              placeholder="Enter custom driver" 
              style="display: none; margin-top: 5px;">
          </div>
        </div>

        <!-- Display Section -->
        <h4 style="margin-top: 25px;">Display</h4>
        <div class="form-group">
          <label>LCD/Display Type</label>
          <select id="hardwareDisplay" class="form-control">
            <option value="">Select display...</option>
            ${this.renderDisplayOptions(hardware.display, databases)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="hardwareDisplayCustom" class="form-control" 
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

    // Motherboard dropdown
    const boardEl = document.getElementById('hardwareBoard');
    const boardCustomEl = document.getElementById('hardwareBoardCustom');
    
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

    // Stepper Drivers
    ['X', 'Y', 'Z', 'E'].forEach(axis => {
      const driverEl = document.getElementById(`driver${axis}`);
      const driverCustomEl = document.getElementById(`driver${axis}Custom`);
      
      if (driverEl) {
        driverEl.addEventListener('change', (e) => {
          if (e.target.value === '__custom__') {
            if (driverCustomEl) driverCustomEl.style.display = 'block';
          } else {
            if (driverCustomEl) driverCustomEl.style.display = 'none';
            profile.hardware.drivers[axis.toLowerCase()] = e.target.value;
            profile.modified = new Date().toISOString();
            updateCallback();
          }
        });
      }
      
      if (driverCustomEl) {
        driverCustomEl.addEventListener('input', (e) => {
          profile.hardware.drivers[axis.toLowerCase()] = 'custom:' + e.target.value;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });

    // Display
    const displayEl = document.getElementById('hardwareDisplay');
    const displayCustomEl = document.getElementById('hardwareDisplayCustom');
    
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
