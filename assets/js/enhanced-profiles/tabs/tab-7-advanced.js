/**
 * Tab 7: Advanced Features
 * Linear Advance, Arc Support, Input Shaping, and other advanced firmware features
 * 
 * @module Tab7Advanced
 */

export const Tab7Advanced = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (not used in this tab)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const advanced = profile.advanced || {
      linearAdvance: { enabled: false, kFactor: 0 },
      arcSupport: false,
      inputShaping: { enabled: false, frequency: { x: 0, y: 0 }, damping: 0.1 },
      sCurve: false,
      junctionDeviation: 0.05,
      firmwareRetraction: { enabled: false, length: 1, speed: 40 }
    };

    return `
      <div class="tab-content">
        <h3>🚀 Advanced Features</h3>

        <!-- Linear Advance Section -->
        <h4>Linear Advance (Pressure Control)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="linearAdvanceEnabled" 
                ${advanced.linearAdvance?.enabled ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Enable Linear Advance
            </label>
            <p class="field-help">Compensates for pressure changes during printing</p>
          </div>
          <div class="form-group">
            <label>K-Factor</label>
            <input type="number" id="linearAdvanceK" class="form-control" 
              value="${advanced.linearAdvance?.kFactor || 0}" 
              step="0.01" min="0" max="2"
              ${!advanced.linearAdvance?.enabled ? 'disabled' : ''}>
            <p class="field-help">Calibrate using pattern test (0.0-0.2 typical)</p>
          </div>
        </div>

        <!-- Arc Support Section -->
        <h4 style="margin-top: 25px;">Arc Support (G2/G3 Commands)</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="arcSupport" 
              ${advanced.arcSupport ? 'checked' : ''} 
              style="width: auto; margin-right: 10px;">
            Enable Arc Support (G2/G3)
          </label>
          <p class="field-help">Smooth curves instead of line segments</p>
        </div>

        <!-- Input Shaping Section -->
        <h4 style="margin-top: 25px;">Input Shaping (Resonance Compensation)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="inputShapingEnabled" 
                ${advanced.inputShaping?.enabled ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Enable Input Shaping
            </label>
            <p class="field-help">Reduces ringing/ghosting artifacts</p>
          </div>
          <div class="form-group">
            <label>X-Axis Frequency (Hz)</label>
            <input type="number" id="inputShapingFreqX" class="form-control" 
              value="${advanced.inputShaping?.frequency?.x || 0}" 
              step="0.5" min="0" max="200"
              ${!advanced.inputShaping?.enabled ? 'disabled' : ''}>
            <p class="field-help">Measured resonance frequency</p>
          </div>
          <div class="form-group">
            <label>Y-Axis Frequency (Hz)</label>
            <input type="number" id="inputShapingFreqY" class="form-control" 
              value="${advanced.inputShaping?.frequency?.y || 0}" 
              step="0.5" min="0" max="200"
              ${!advanced.inputShaping?.enabled ? 'disabled' : ''}>
            <p class="field-help">Measured resonance frequency</p>
          </div>
          <div class="form-group">
            <label>Damping Ratio</label>
            <input type="number" id="inputShapingDamping" class="form-control" 
              value="${advanced.inputShaping?.damping || 0.1}" 
              step="0.01" min="0" max="1"
              ${!advanced.inputShaping?.enabled ? 'disabled' : ''}>
            <p class="field-help">0.1 typical (lower = more aggressive)</p>
          </div>
        </div>

        <!-- S-Curve Acceleration Section -->
        <h4 style="margin-top: 25px;">S-Curve Acceleration</h4>
        <div class="form-group">
          <label>
            <input type="checkbox" id="sCurve" 
              ${advanced.sCurve ? 'checked' : ''} 
              style="width: auto; margin-right: 10px;">
            Enable S-Curve Acceleration
          </label>
          <p class="field-help">Smoother acceleration/deceleration curves</p>
        </div>

        <!-- Junction Deviation Section -->
        <h4 style="margin-top: 25px;">Junction Deviation</h4>
        <div class="form-group">
          <label>Junction Deviation (mm)</label>
          <input type="number" id="junctionDeviation" class="form-control" 
            value="${advanced.junctionDeviation || 0.05}" 
            step="0.001" min="0.001" max="0.2">
          <p class="field-help">Controls cornering speed (0.02-0.05 typical)</p>
        </div>

        <!-- Firmware Retraction Section -->
        <h4 style="margin-top: 25px;">Firmware Retraction (G10/G11)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="firmwareRetractionEnabled" 
                ${advanced.firmwareRetraction?.enabled ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Enable Firmware Retraction
            </label>
            <p class="field-help">Use G10/G11 for retraction</p>
          </div>
          <div class="form-group">
            <label>Retraction Length (mm)</label>
            <input type="number" id="firmwareRetractionLength" class="form-control" 
              value="${advanced.firmwareRetraction?.length || 1}" 
              step="0.1" min="0" max="10"
              ${!advanced.firmwareRetraction?.enabled ? 'disabled' : ''}>
            <p class="field-help">0.5-1mm direct, 4-6mm bowden</p>
          </div>
          <div class="form-group">
            <label>Retraction Speed (mm/s)</label>
            <input type="number" id="firmwareRetractionSpeed" class="form-control" 
              value="${advanced.firmwareRetraction?.speed || 40}" 
              step="5" min="10" max="100"
              ${!advanced.firmwareRetraction?.enabled ? 'disabled' : ''}>
            <p class="field-help">25-60 mm/s typical</p>
          </div>
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
    // Initialize advanced object if needed
    if (!profile.advanced) profile.advanced = {};
    if (!profile.advanced.linearAdvance) profile.advanced.linearAdvance = {};
    if (!profile.advanced.inputShaping) profile.advanced.inputShaping = { frequency: {} };
    if (!profile.advanced.firmwareRetraction) profile.advanced.firmwareRetraction = {};

    // Linear Advance
    const laEnabled = document.getElementById('linearAdvanceEnabled');
    const laK = document.getElementById('linearAdvanceK');
    
    if (laEnabled) {
      laEnabled.addEventListener('change', (e) => {
        profile.advanced.linearAdvance.enabled = e.target.checked;
        if (laK) laK.disabled = !e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (laK) {
      laK.addEventListener('input', (e) => {
        profile.advanced.linearAdvance.kFactor = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Arc Support
    const arcSupport = document.getElementById('arcSupport');
    if (arcSupport) {
      arcSupport.addEventListener('change', (e) => {
        profile.advanced.arcSupport = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Input Shaping
    const isEnabled = document.getElementById('inputShapingEnabled');
    const isFreqX = document.getElementById('inputShapingFreqX');
    const isFreqY = document.getElementById('inputShapingFreqY');
    const isDamping = document.getElementById('inputShapingDamping');
    
    if (isEnabled) {
      isEnabled.addEventListener('change', (e) => {
        profile.advanced.inputShaping.enabled = e.target.checked;
        const disabled = !e.target.checked;
        if (isFreqX) isFreqX.disabled = disabled;
        if (isFreqY) isFreqY.disabled = disabled;
        if (isDamping) isDamping.disabled = disabled;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (isFreqX) {
      isFreqX.addEventListener('input', (e) => {
        if (!profile.advanced.inputShaping.frequency) profile.advanced.inputShaping.frequency = {};
        profile.advanced.inputShaping.frequency.x = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (isFreqY) {
      isFreqY.addEventListener('input', (e) => {
        if (!profile.advanced.inputShaping.frequency) profile.advanced.inputShaping.frequency = {};
        profile.advanced.inputShaping.frequency.y = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (isDamping) {
      isDamping.addEventListener('input', (e) => {
        profile.advanced.inputShaping.damping = parseFloat(e.target.value) || 0.1;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // S-Curve
    const sCurve = document.getElementById('sCurve');
    if (sCurve) {
      sCurve.addEventListener('change', (e) => {
        profile.advanced.sCurve = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Junction Deviation
    const junctionDeviation = document.getElementById('junctionDeviation');
    if (junctionDeviation) {
      junctionDeviation.addEventListener('input', (e) => {
        profile.advanced.junctionDeviation = parseFloat(e.target.value) || 0.05;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Firmware Retraction
    const frEnabled = document.getElementById('firmwareRetractionEnabled');
    const frLength = document.getElementById('firmwareRetractionLength');
    const frSpeed = document.getElementById('firmwareRetractionSpeed');
    
    if (frEnabled) {
      frEnabled.addEventListener('change', (e) => {
        profile.advanced.firmwareRetraction.enabled = e.target.checked;
        const disabled = !e.target.checked;
        if (frLength) frLength.disabled = disabled;
        if (frSpeed) frSpeed.disabled = disabled;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (frLength) {
      frLength.addEventListener('input', (e) => {
        profile.advanced.firmwareRetraction.length = parseFloat(e.target.value) || 1;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (frSpeed) {
      frSpeed.addEventListener('input', (e) => {
        profile.advanced.firmwareRetraction.speed = parseFloat(e.target.value) || 40;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
