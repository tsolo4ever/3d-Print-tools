/**
 * Tab 4: Bed Configuration
 * Bed type, temperature limits, PID tuning, and bed size
 * 
 * @module Tab4Bed
 */

export const Tab4Bed = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (thermistors)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const temp = profile.temperature?.bed || { max: 110, pid: { p: 0, i: 0, d: 0 } };
    const hardware = profile.hardware || {};
    
    return `
      <div class="tab-content">
        <h3>🛏️ Bed Configuration</h3>

        <!-- Bed Specifications Section -->
        <h4>Bed Specifications</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Bed Type</label>
            <select id="bedType" class="form-control">
              <option value="">Select bed type...</option>
              <option value="aluminum" ${profile.temperature?.bedType === 'aluminum' ? 'selected' : ''}>Standard Aluminum</option>
              <option value="glass" ${profile.temperature?.bedType === 'glass' ? 'selected' : ''}>Glass Bed</option>
              <option value="pei" ${profile.temperature?.bedType === 'pei' ? 'selected' : ''}>PEI Sheet</option>
              <option value="magnetic" ${profile.temperature?.bedType === 'magnetic' ? 'selected' : ''}>Magnetic</option>
              <option value="spring-steel" ${profile.temperature?.bedType === 'spring-steel' ? 'selected' : ''}>Spring Steel</option>
              <option value="ultrabase" ${profile.temperature?.bedType === 'ultrabase' ? 'selected' : ''}>Ultrabase</option>
              <option value="buildtak" ${profile.temperature?.bedType === 'buildtak' ? 'selected' : ''}>BuildTak</option>
              <option value="carborundum" ${profile.temperature?.bedType === 'carborundum' ? 'selected' : ''}>Carborundum</option>
              <option value="custom" ${profile.temperature?.bedType === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>
          <div class="form-group">
            <label>Max Temperature (°C) *</label>
            <input type="number" id="bedMaxTemp" class="form-control" 
              value="${temp.max}" min="60" max="150">
          </div>
        </div>

        <!-- Bed Thermistor Section -->
        <h4 style="margin-top: 25px;">Bed Thermistor</h4>
        <div class="form-group">
          <label>Thermistor Type</label>
          <select id="thermistorBed" class="form-control">
            <option value="">Select thermistor...</option>
            ${this.renderThermistorOptions(hardware.thermistors?.bed, databases)}
            <option value="__custom__">🔧 Custom / Other...</option>
          </select>
          <input type="text" id="thermistorBedCustom" class="form-control" 
            placeholder="Enter custom thermistor" 
            style="display: none; margin-top: 5px;">
        </div>

        <!-- PID Tuning Section -->
        <h4 style="margin-top: 25px;">PID Tuning (Bed)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>P (Proportional)</label>
            <input type="number" id="bedPidP" class="form-control" 
              value="${temp.pid?.p || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>I (Integral)</label>
            <input type="number" id="bedPidI" class="form-control" 
              value="${temp.pid?.i || 0}" step="0.01">
          </div>
          <div class="form-group">
            <label>D (Derivative)</label>
            <input type="number" id="bedPidD" class="form-control" 
              value="${temp.pid?.d || 0}" step="0.01">
          </div>
        </div>
        <p class="field-help">💡 Run PID autotune: M303 E-1 S60 C8 U1</p>

        <!-- Bed Size Section -->
        <h4 style="margin-top: 25px;">Bed Size</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Width (X) mm</label>
            <input type="number" id="bedSizeX" class="form-control" 
              value="${profile.bedSize?.x || 220}" min="100" max="500">
          </div>
          <div class="form-group">
            <label>Depth (Y) mm</label>
            <input type="number" id="bedSizeY" class="form-control" 
              value="${profile.bedSize?.y || 220}" min="100" max="500">
          </div>
          <div class="form-group">
            <label>Height (Z) mm</label>
            <input type="number" id="bedSizeZ" class="form-control" 
              value="${profile.bedSize?.z || 250}" min="100" max="600">
          </div>
        </div>
      </div>
    `;
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
    if (!profile.temperature.bed) profile.temperature.bed = { max: 110, pid: {} };
    if (!profile.bedSize) profile.bedSize = {};

    // Bed type
    const bedType = document.getElementById('bedType');
    if (bedType) {
      bedType.addEventListener('change', (e) => {
        profile.temperature.bedType = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Max temperature
    const bedMaxTemp = document.getElementById('bedMaxTemp');
    if (bedMaxTemp) {
      bedMaxTemp.addEventListener('input', (e) => {
        profile.temperature.bed.max = parseFloat(e.target.value) || 110;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Thermistor
    const thermistorBed = document.getElementById('thermistorBed');
    const thermistorCustom = document.getElementById('thermistorBedCustom');
    
    if (thermistorBed) {
      thermistorBed.addEventListener('change', (e) => {
        if (!profile.hardware) profile.hardware = {};
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        
        if (e.target.value === '__custom__') {
          if (thermistorCustom) thermistorCustom.style.display = 'block';
        } else {
          if (thermistorCustom) thermistorCustom.style.display = 'none';
          profile.hardware.thermistors.bed = e.target.value;
          profile.modified = new Date().toISOString();
          updateCallback();
        }
      });
    }
    
    if (thermistorCustom) {
      thermistorCustom.addEventListener('input', (e) => {
        if (!profile.hardware) profile.hardware = {};
        if (!profile.hardware.thermistors) profile.hardware.thermistors = {};
        profile.hardware.thermistors.bed = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // PID values
    ['bedPidP', 'bedPidI', 'bedPidD'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const pidType = id.replace('bedPid', '').toLowerCase();
          if (!profile.temperature.bed.pid) profile.temperature.bed.pid = {};
          profile.temperature.bed.pid[pidType] = parseFloat(e.target.value) || 0;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });

    // Bed size
    ['bedSizeX', 'bedSizeY', 'bedSizeZ'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('bedSize', '').toLowerCase();
          profile.bedSize[axis] = parseFloat(e.target.value) || 0;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });
  }
};
