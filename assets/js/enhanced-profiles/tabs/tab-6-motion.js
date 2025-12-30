/**
 * Enhanced Printer Profiles - Tab 6: Motion Settings
 * 
 * Handles motion configuration including:
 * - Steps per mm (X/Y/Z/E)
 * - Maximum feedrates
 * - Maximum acceleration
 * - Jerk settings
 * - Print/Retract/Travel acceleration
 * 
 * @module tab-6-motion
 * @version 1.0.0
 */

/**
 * Render Tab 6: Motion Settings
 * @param {Object} profile - Current printer profile
 * @param {Object} databases - Hardware databases (not used in this tab)
 * @returns {string} HTML content for motion tab
 */
export function render(profile, databases) {
  const motion = profile.motion || {
    steps: { x: 80, y: 80, z: 400, e: 93 },
    maxFeedrates: { x: 500, y: 500, z: 5, e: 25 },
    maxAccel: { x: 500, y: 500, z: 100, e: 5000 },
    jerk: { x: 8, y: 8, z: 0.4, e: 5 }
  };

  return `
    <div class="tab-content">
      <h3>🏃 Motion Settings</h3>

      <h4>Steps per mm</h4>
      <div class="form-row">
        <div class="form-group">
          <label>X-Axis Steps/mm *</label>
          <input type="number" id="stepsX" value="${motion.steps?.x || 80}" step="0.01">
          <p class="field-help">80 typical for belts</p>
        </div>
        <div class="form-group">
          <label>Y-Axis Steps/mm *</label>
          <input type="number" id="stepsY" value="${motion.steps?.y || 80}" step="0.01">
          <p class="field-help">80 typical for belts</p>
        </div>
        <div class="form-group">
          <label>Z-Axis Steps/mm *</label>
          <input type="number" id="stepsZ" value="${motion.steps?.z || 400}" step="0.01">
          <p class="field-help">400 typical for leadscrews</p>
        </div>
        <div class="form-group">
          <label>E-Axis Steps/mm *</label>
          <input type="number" id="stepsE" value="${motion.steps?.e || 93}" step="0.1">
          <p class="field-help">Use E-Steps Calculator</p>
        </div>
      </div>

      <h4 style="margin-top: 25px;">Maximum Feedrates (mm/s)</h4>
      <div class="form-row">
        <div class="form-group">
          <label>X-Axis Max Speed</label>
          <input type="number" id="maxFeedrateX" value="${motion.maxFeedrates?.x || 500}" step="1">
          <p class="field-help">300-500 typical</p>
        </div>
        <div class="form-group">
          <label>Y-Axis Max Speed</label>
          <input type="number" id="maxFeedrateY" value="${motion.maxFeedrates?.y || 500}" step="1">
          <p class="field-help">300-500 typical</p>
        </div>
        <div class="form-group">
          <label>Z-Axis Max Speed</label>
          <input type="number" id="maxFeedrateZ" value="${motion.maxFeedrates?.z || 5}" step="0.1">
          <p class="field-help">5-10 typical</p>
        </div>
        <div class="form-group">
          <label>E-Axis Max Speed</label>
          <input type="number" id="maxFeedrateE" value="${motion.maxFeedrates?.e || 25}" step="1">
          <p class="field-help">25-50 typical</p>
        </div>
      </div>

      <h4 style="margin-top: 25px;">Maximum Acceleration (mm/s²)</h4>
      <div class="form-row">
        <div class="form-group">
          <label>X-Axis Accel</label>
          <input type="number" id="maxAccelX" value="${motion.maxAccel?.x || 500}" step="10">
          <p class="field-help">500-3000 typical</p>
        </div>
        <div class="form-group">
          <label>Y-Axis Accel</label>
          <input type="number" id="maxAccelY" value="${motion.maxAccel?.y || 500}" step="10">
          <p class="field-help">500-3000 typical</p>
        </div>
        <div class="form-group">
          <label>Z-Axis Accel</label>
          <input type="number" id="maxAccelZ" value="${motion.maxAccel?.z || 100}" step="10">
          <p class="field-help">100-500 typical</p>
        </div>
        <div class="form-group">
          <label>E-Axis Accel</label>
          <input type="number" id="maxAccelE" value="${motion.maxAccel?.e || 5000}" step="100">
          <p class="field-help">5000-10000 typical</p>
        </div>
      </div>

      <h4 style="margin-top: 25px;">Jerk Settings (mm/s)</h4>
      <div class="form-row">
        <div class="form-group">
          <label>X-Axis Jerk</label>
          <input type="number" id="jerkX" value="${motion.jerk?.x || 8}" step="0.1">
          <p class="field-help">8-10 typical</p>
        </div>
        <div class="form-group">
          <label>Y-Axis Jerk</label>
          <input type="number" id="jerkY" value="${motion.jerk?.y || 8}" step="0.1">
          <p class="field-help">8-10 typical</p>
        </div>
        <div class="form-group">
          <label>Z-Axis Jerk</label>
          <input type="number" id="jerkZ" value="${motion.jerk?.z || 0.4}" step="0.1">
          <p class="field-help">0.3-0.4 typical</p>
        </div>
        <div class="form-group">
          <label>E-Axis Jerk</label>
          <input type="number" id="jerkE" value="${motion.jerk?.e || 5}" step="0.1">
          <p class="field-help">5-10 typical</p>
        </div>
      </div>

      <h4 style="margin-top: 25px;">Travel Acceleration</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Print Acceleration (mm/s²)</label>
          <input type="number" id="printAccel" value="${motion.printAccel || 500}" step="10">
          <p class="field-help">Acceleration during printing</p>
        </div>
        <div class="form-group">
          <label>Retract Acceleration (mm/s²)</label>
          <input type="number" id="retractAccel" value="${motion.retractAccel || 1000}" step="10">
          <p class="field-help">Extruder retraction speed</p>
        </div>
        <div class="form-group">
          <label>Travel Acceleration (mm/s²)</label>
          <input type="number" id="travelAccel" value="${motion.travelAccel || 1000}" step="10">
          <p class="field-help">Non-printing moves</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners for Tab 6: Motion Settings
 * @param {Object} profile - Current printer profile
 * @param {Function} updateCallback - Callback function when profile is updated
 * @param {Object} databases - Hardware databases (not used in this tab)
 * @param {Object} context - Parent context (for logging, etc.)
 */
export function attachListeners(profile, updateCallback, databases, context) {
  // Motion — Steps per mm
  ['stepsX', 'stepsY', 'stepsZ', 'stepsE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        const axis = id.replace('steps', '').toLowerCase();
        if (!profile.motion) profile.motion = {};
        if (!profile.motion.steps) profile.motion.steps = {};
        profile.motion.steps[axis] = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  });

  // Motion — Maximum feedrates
  ['maxFeedrateX', 'maxFeedrateY', 'maxFeedrateZ', 'maxFeedrateE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        const axis = id.replace('maxFeedrate', '').toLowerCase();
        if (!profile.motion) profile.motion = {};
        if (!profile.motion.maxFeedrates) profile.motion.maxFeedrates = {};
        profile.motion.maxFeedrates[axis] = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  });

  // Motion — Maximum acceleration
  ['maxAccelX', 'maxAccelY', 'maxAccelZ', 'maxAccelE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        const axis = id.replace('maxAccel', '').toLowerCase();
        if (!profile.motion) profile.motion = {};
        if (!profile.motion.maxAccel) profile.motion.maxAccel = {};
        profile.motion.maxAccel[axis] = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  });

  // Motion — Jerk settings
  ['jerkX', 'jerkY', 'jerkZ', 'jerkE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        const axis = id.replace('jerk', '').toLowerCase();
        if (!profile.motion) profile.motion = {};
        if (!profile.motion.jerk) profile.motion.jerk = {};
        profile.motion.jerk[axis] = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  });

  // Travel accelerations (print, retract, travel)
  ['printAccel', 'retractAccel', 'travelAccel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        if (!profile.motion) profile.motion = {};
        profile.motion[id] = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  });
}
