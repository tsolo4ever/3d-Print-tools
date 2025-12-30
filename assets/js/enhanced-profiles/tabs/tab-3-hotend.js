/**
 * Tab 3: Hotend & Extruder Configuration
 * Hotend type, temperature limits, PID tuning, and extruder settings
 * 
 * @module Tab3Hotend
 */

export const Tab3Hotend = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (Hotends, heaters, thermistors)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const temp = profile.temperature?.hotend || { max: 275, pid: { p: 0, i: 0, d: 0 } };
    const motion = profile.motion || {};
    const hardware = profile.hardware || {};
    
    return `
      <div class="tab-content">
        <h3>🔥 Hotend & Extruder Configuration</h3>

        <!-- Hotend Type Section -->
        <h4>Hotend Type</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Hotend Model *</label>
            <select id="hotendType" class="form-control">
              <option value="">Select hotend...</option>
              ${this.renderHotendOptions(profile.hotendType, databases)}
              <option value="__custom__">🔧 Custom / Other...</option>
            </select>
            <input type="text" id="hotendTypeCustom" class="form-control"
              value="${profile.hotendType && profile.hotendType.startsWith('custom:') ? profile.hotendType.replace('custom:', '') : ''}"
              placeholder="Enter custom hotend"
              style="display: ${profile.hotendType && profile.hotendType.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          </div>

          <div class="form-group">
            <label>Max Temperature (°C) *</label>
            <input type="number" id="hotendMaxTemp" class="form-control" 
              value="${temp.max}" min="200" max="500">
          </div>

          <div class="form-group">
            <label>Heater Cartridge</label>
            <select id="hotendHeater" class="form-control">
              <option value="">Select heater...</option>
              ${this.renderHeaterOptions(profile.hotendHeater, databases)}
            </select>
            <p class="field-help">Heater wattage affects heat-up speed</p>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="highFlowHotend" 
                ${profile.highFlowHotend ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              High Flow Hotend
            </label>
            <p class="field-help">CHT, Volcano, or other high-flow hotend</p>
          </div>
        </div>

        <!-- Hotend Thermistor Section -->
        <h4 style="margin-top: 25px;">Hotend Thermistor</h4>
        <div class="form-group">
          <label>Thermistor Type *</label>
          <select id="thermistorHotend" class="form-control">
            <option value="">Select thermistor...</option>
            ${this.renderThermistorOptions(hardware.thermistors?.hotend, databases)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="thermistorHotendCustom" class="form-control" 
            placeholder="Enter custom thermistor" 
            style="display: none; margin-top: 5px;">
        </div>

        <!-- PID Tuning Section -->
        <h4 style="margin-top: 25px;">PID Tuning (Hotend)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>P (Proportional)</label>
            <input type="number" id="hotendPidP" class="form-control" 
              value="${temp.pid?.p || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>I (Integral)</label>
            <input type="number" id="hotendPidI" class="form-control" 
              value="${temp.pid?.i || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>D (Derivative)</label>
            <input type="number" id="hotendPidD" class="form-control" 
              value="${temp.pid?.d || 0}" step="0.01">
          </div>
        </div>
        <p class="field-help">💡 Run PID autotune: M303 E0 S220 C8 U1</p>

        <!-- Extruder Configuration Section -->
        <h4 style="margin-top: 25px;">Extruder Configuration</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Extruder Type *</label>
            <select id="extruderType" class="form-control">
              <option value="direct" ${profile.extruderType === 'direct' ? 'selected' : ''}>Direct Drive</option>
              <option value="bowden" ${profile.extruderType === 'bowden' ? 'selected' : ''}>Bowden</option>
            </select>
          </div>
          <div class="form-group">
            <label>E-Steps/mm *</label>
            <input type="number" id="esteps" class="form-control" 
              value="${motion.steps?.e || 93}" step="0.1">
            <p class="field-help">📐 Use E-Steps Calculator to calibrate</p>
          </div>
        </div>

        <!-- Extrusion Limits Section -->
        <h4 style="margin-top: 25px;">Extrusion Limits</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Max Feedrate (mm/s)</label>
            <input type="number" id="maxFeedrateE" class="form-control" 
              value="${motion.maxFeedrates?.e || 25}">
          </div>
          <div class="form-group">
            <label>Max Acceleration (mm/s²)</label>
            <input type="number" id="maxAccelE" class="form-control" 
              value="${motion.maxAccel?.e || 5000}">
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render hotend dropdown options
   * @param {string} selectedHotend - Currently selected hotend ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderHotendOptions(selectedHotend, databases) {
    if (!databases['Hotends']?.hotends) return '';
    
    return databases['Hotends'].hotends.map(hotend => {
      const selected = selectedHotend === hotend.id ? 'selected' : '';
      return `<option value="${hotend.id}" ${selected}>${hotend.name} (${hotend.category})</option>`;
    }).join('');
  },

  /**
   * Render heater cartridge dropdown options
   * @param {string} selectedHeater - Currently selected heater ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderHeaterOptions(selectedHeater, databases) {
    if (!databases['heaters']?.hotendHeaters) return '';
    
    return databases['heaters'].hotendHeaters.map(heater => {
      const selected = selectedHeater === heater.id ? 'selected' : '';
      return `<option value="${heater.id}" ${selected}>${heater.name} (${heater.wattage}W ${heater.voltage}V)</option>`;
    }).join('');
  },

  /**
   * Render thermistor dropdown options
   * @param {string} selectedThermistor - Currently selected thermistor ID
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderThermistorOptions(selectedThermistor, databases) {
    if (!databases['thermistors']?.thermistors) return '';
    
    return databases['thermistors'].thermistors.map(therm => {
      const selected = selectedThermistor === therm.id ? 'selected' : '';
      return `<option value="${therm.id}" ${selected}>${therm.name}</option>`;
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
    // Initialize objects if needed
    if (!profile.temperature) profile.temperature = {};
    if (!profile.temperature.hotend) profile.temperature.hotend = { max: 275, pid: {} };
    if (!profile.motion) profile.motion = {};
    if (!profile.motion.steps) profile.motion.steps = {};
    if (!profile.motion.maxFeedrates) profile.motion.maxFeedrates = {};
    if (!profile.motion.maxAccel) profile.motion.maxAccel = {};

    // Hotend type
    const hotendType = document.getElementById('hotendType');
    const hotendCustom = document.getElementById('hotendTypeCustom');
    
    if (hotendType) {
      hotendType.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (hotendCustom) hotendCustom.style.display = 'block';
        } else if (e.target.value) {
          if (hotendCustom) hotendCustom.style.display = 'none';
          profile.hotendType = e.target.value;
          profile.modified = new Date().toISOString();
          
          // Auto-fill from hotend database
          if (context.autofillFromHotend) {
            context.autofillFromHotend(e.target.value);
          }
          
          updateCallback();
        }
      });
    }
    
    if (hotendCustom) {
      hotendCustom.addEventListener('input', (e) => {
        profile.hotendType = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Hotend heater
    const hotendHeater = document.getElementById('hotendHeater');
    if (hotendHeater) {
      hotendHeater.addEventListener('change', (e) => {
        profile.hotendHeater = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // High flow checkbox
    const highFlowHotend = document.getElementById('highFlowHotend');
    if (highFlowHotend) {
      highFlowHotend.addEventListener('change', (e) => {
        profile.highFlowHotend = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Max temperature
    const hotendMaxTemp = document.getElementById('hotendMaxTemp');
    if (hotendMaxTemp) {
      hotendMaxTemp.addEventListener('input', (e) => {
        profile.temperature.hotend.max = parseFloat(e.target.value) || 275;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Thermistor
    const thermistorHotend = document.getElementById('thermistorHotend');
    const thermistorCustom = document.getElementById('thermistorHotendCustom');
    
    if (thermistorHotend) {
      thermistorHotend.addEventListener('change', (e) => {
        if (!profile.hardware) profile.hardware = {};
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        
        if (e.target.value === '__custom__') {
          if (thermistorCustom) thermistorCustom.style.display = 'block';
        } else {
          if (thermistorCustom) thermistorCustom.style.display = 'none';
          profile.hardware.thermistors.hotend = e.target.value;
          profile.modified = new Date().toISOString();
          updateCallback();
        }
      });
    }
    
    if (thermistorCustom) {
      thermistorCustom.addEventListener('input', (e) => {
        if (!profile.hardware) profile.hardware = {};
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        profile.hardware.thermistors.hotend = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // PID values
    ['hotendPidP', 'hotendPidI', 'hotendPidD'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const pidType = id.replace('hotendPid', '').toLowerCase();
          if (!profile.temperature.hotend.pid) profile.temperature.hotend.pid = {};
          profile.temperature.hotend.pid[pidType] = parseFloat(e.target.value) || 0;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });

    // Extruder type
    const extruderType = document.getElementById('extruderType');
    if (extruderType) {
      extruderType.addEventListener('change', (e) => {
        profile.extruderType = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // E-steps
    const esteps = document.getElementById('esteps');
    if (esteps) {
      esteps.addEventListener('input', (e) => {
        profile.motion.steps.e = parseFloat(e.target.value) || 93;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Max feedrate E
    const maxFeedrateE = document.getElementById('maxFeedrateE');
    if (maxFeedrateE) {
      maxFeedrateE.addEventListener('input', (e) => {
        profile.motion.maxFeedrates.e = parseFloat(e.target.value) || 25;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Max acceleration E
    const maxAccelE = document.getElementById('maxAccelE');
    if (maxAccelE) {
      maxAccelE.addEventListener('input', (e) => {
        profile.motion.maxAccel.e = parseFloat(e.target.value) || 5000;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
