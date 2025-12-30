/**
 * Tab 8: Safety Features
 * Thermal runaway protection, temperature limits, and extrusion safety
 * 
 * @module Tab8Safety
 */

export const Tab8Safety = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (not used in this tab)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const safety = profile.safety || {
      thermalRunaway: { enabled: true, period: 40, hysteresis: 4 },
      minTemp: { hotend: 5, bed: 5 },
      maxTemp: { hotend: 275, bed: 110 },
      extrusionLimits: { minTemp: 170, maxLength: 200 },
      coldExtrusion: { prevent: true, minTemp: 170 },
      watchdog: true,
      powerLossRecovery: false
    };

    return `
      <div class="tab-content">
        <h3>🛡️ Safety Features</h3>

        <!-- Thermal Runaway Protection -->
        <h4>Thermal Runaway Protection</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="thermalRunawayEnabled" 
                ${safety.thermalRunaway?.enabled !== false ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Enable Thermal Runaway Protection
            </label>
            <p class="field-help">⚠️ CRITICAL - Prevents fire hazards</p>
          </div>
          <div class="form-group">
            <label>Monitoring Period (seconds)</label>
            <input type="number" id="thermalRunawayPeriod" class="form-control" 
              value="${safety.thermalRunaway?.period || 40}" 
              min="10" max="120"
              ${safety.thermalRunaway?.enabled === false ? 'disabled' : ''}>
            <p class="field-help">Time to reach target temp (40s typical)</p>
          </div>
          <div class="form-group">
            <label>Hysteresis (°C)</label>
            <input type="number" id="thermalRunawayHysteresis" class="form-control" 
              value="${safety.thermalRunaway?.hysteresis || 4}" 
              min="1" max="10"
              ${safety.thermalRunaway?.enabled === false ? 'disabled' : ''}>
            <p class="field-help">Temperature drop threshold (4°C typical)</p>
          </div>
        </div>

        <!-- Temperature Limits -->
        <h4 style="margin-top: 25px;">Temperature Limits</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Hotend Min Temp (°C)</label>
            <input type="number" id="minTempHotend" class="form-control" 
              value="${safety.minTemp?.hotend || 5}" 
              min="0" max="50">
            <p class="field-help">Below this triggers error (5°C typical)</p>
          </div>
          <div class="form-group">
            <label>Hotend Max Temp (°C)</label>
            <input type="number" id="maxTempHotend" class="form-control" 
              value="${safety.maxTemp?.hotend || 275}" 
              min="200" max="500">
            <p class="field-help">Above this triggers error</p>
          </div>
          <div class="form-group">
            <label>Bed Min Temp (°C)</label>
            <input type="number" id="minTempBed" class="form-control" 
              value="${safety.minTemp?.bed || 5}" 
              min="0" max="50">
            <p class="field-help">Below this triggers error (5°C typical)</p>
          </div>
          <div class="form-group">
            <label>Bed Max Temp (°C)</label>
            <input type="number" id="maxTempBed" class="form-control" 
              value="${safety.maxTemp?.bed || 110}" 
              min="60" max="150">
            <p class="field-help">Above this triggers error</p>
          </div>
        </div>

        <!-- Cold Extrusion Prevention -->
        <h4 style="margin-top: 25px;">Cold Extrusion Prevention</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="coldExtrusionPrevent" 
                ${safety.coldExtrusion?.prevent !== false ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Prevent Cold Extrusion
            </label>
            <p class="field-help">Blocks extrusion below min temp</p>
          </div>
          <div class="form-group">
            <label>Min Extrusion Temp (°C)</label>
            <input type="number" id="coldExtrusionMinTemp" class="form-control" 
              value="${safety.coldExtrusion?.minTemp || 170}" 
              min="150" max="200"
              ${safety.coldExtrusion?.prevent === false ? 'disabled' : ''}>
            <p class="field-help">No extrusion below this temp (170°C typical)</p>
          </div>
        </div>

        <!-- Extrusion Limits -->
        <h4 style="margin-top: 25px;">Extrusion Limits</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Min Extrusion Temp (°C)</label>
            <input type="number" id="extrusionMinTemp" class="form-control" 
              value="${safety.extrusionLimits?.minTemp || 170}" 
              min="150" max="200">
            <p class="field-help">Minimum temp for extrusion (170°C typical)</p>
          </div>
          <div class="form-group">
            <label>Max Extrusion Length (mm)</label>
            <input type="number" id="extrusionMaxLength" class="form-control" 
              value="${safety.extrusionLimits?.maxLength || 200}" 
              min="100" max="1000">
            <p class="field-help">Single move limit (200mm typical)</p>
          </div>
        </div>

        <!-- Additional Safety Features -->
        <h4 style="margin-top: 25px;">Additional Safety</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="watchdog" 
                ${safety.watchdog !== false ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Enable Watchdog Timer
            </label>
            <p class="field-help">Resets board if firmware hangs</p>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="powerLossRecovery" 
                ${safety.powerLossRecovery ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Power Loss Recovery
            </label>
            <p class="field-help">Resume print after power failure</p>
          </div>
        </div>

        <!-- Safety Warning -->
        <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
          <strong>⚠️ Safety Warning:</strong>
          <p style="margin: 10px 0 0 0;">Never disable thermal runaway protection unless you understand the risks. 
          This feature prevents fires caused by thermistor failures or heater malfunctions.</p>
        </div>
      </div>
    `;
  },

  /**
   * Attach event listeners for this tab
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases (not used in this tab)
   * @param {Object} context - Additional context (parent controller methods)
   */
  attachListeners(profile, updateCallback, databases, context) {
    // Initialize safety object if needed
    if (!profile.safety) profile.safety = {};
    if (!profile.safety.thermalRunaway) profile.safety.thermalRunaway = {};
    if (!profile.safety.minTemp) profile.safety.minTemp = {};
    if (!profile.safety.maxTemp) profile.safety.maxTemp = {};
    if (!profile.safety.extrusionLimits) profile.safety.extrusionLimits = {};
    if (!profile.safety.coldExtrusion) profile.safety.coldExtrusion = {};

    // Thermal Runaway Protection
    const trEnabled = document.getElementById('thermalRunawayEnabled');
    const trPeriod = document.getElementById('thermalRunawayPeriod');
    const trHysteresis = document.getElementById('thermalRunawayHysteresis');
    
    if (trEnabled) {
      trEnabled.addEventListener('change', (e) => {
        profile.safety.thermalRunaway.enabled = e.target.checked;
        const disabled = !e.target.checked;
        if (trPeriod) trPeriod.disabled = disabled;
        if (trHysteresis) trHysteresis.disabled = disabled;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (trPeriod) {
      trPeriod.addEventListener('input', (e) => {
        profile.safety.thermalRunaway.period = parseInt(e.target.value, 10) || 40;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (trHysteresis) {
      trHysteresis.addEventListener('input', (e) => {
        profile.safety.thermalRunaway.hysteresis = parseInt(e.target.value, 10) || 4;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Temperature Limits
    const minTempHotend = document.getElementById('minTempHotend');
    const maxTempHotend = document.getElementById('maxTempHotend');
    const minTempBed = document.getElementById('minTempBed');
    const maxTempBed = document.getElementById('maxTempBed');
    
    if (minTempHotend) {
      minTempHotend.addEventListener('input', (e) => {
        profile.safety.minTemp.hotend = parseFloat(e.target.value) || 5;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (maxTempHotend) {
      maxTempHotend.addEventListener('input', (e) => {
        profile.safety.maxTemp.hotend = parseFloat(e.target.value) || 275;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (minTempBed) {
      minTempBed.addEventListener('input', (e) => {
        profile.safety.minTemp.bed = parseFloat(e.target.value) || 5;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (maxTempBed) {
      maxTempBed.addEventListener('input', (e) => {
        profile.safety.maxTemp.bed = parseFloat(e.target.value) || 110;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Cold Extrusion Prevention
    const cePrevent = document.getElementById('coldExtrusionPrevent');
    const ceMinTemp = document.getElementById('coldExtrusionMinTemp');
    
    if (cePrevent) {
      cePrevent.addEventListener('change', (e) => {
        profile.safety.coldExtrusion.prevent = e.target.checked;
        if (ceMinTemp) ceMinTemp.disabled = !e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (ceMinTemp) {
      ceMinTemp.addEventListener('input', (e) => {
        profile.safety.coldExtrusion.minTemp = parseFloat(e.target.value) || 170;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Extrusion Limits
    const extMinTemp = document.getElementById('extrusionMinTemp');
    const extMaxLength = document.getElementById('extrusionMaxLength');
    
    if (extMinTemp) {
      extMinTemp.addEventListener('input', (e) => {
        profile.safety.extrusionLimits.minTemp = parseFloat(e.target.value) || 170;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (extMaxLength) {
      extMaxLength.addEventListener('input', (e) => {
        profile.safety.extrusionLimits.maxLength = parseFloat(e.target.value) || 200;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Additional Safety
    const watchdog = document.getElementById('watchdog');
    const powerLossRecovery = document.getElementById('powerLossRecovery');
    
    if (watchdog) {
      watchdog.addEventListener('change', (e) => {
        profile.safety.watchdog = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (powerLossRecovery) {
      powerLossRecovery.addEventListener('change', (e) => {
        profile.safety.powerLossRecovery = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
