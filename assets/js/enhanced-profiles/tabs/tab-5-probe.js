/**
 * Tab 5: Probe & Leveling Configuration
 * Probe type, offsets, and bed leveling system configuration
 * 
 * @module Tab5Probe
 */

export const Tab5Probe = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (bed-probes)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const probe = profile.probe || { type: 'none', offsets: { x: 0, y: 0, z: 0 } };
    const bedLeveling = profile.bedLeveling || { type: 'none', gridPoints: { x: 3, y: 3 }, fadeHeight: 0 };
    
    return `
      <div class="tab-content">
        <h3>📯 Probe & Leveling Configuration</h3>

        <!-- Probe Type Section -->
        <h4>Probe Type</h4>
        <div class="form-group">
          <label>Probe/Z-Endstop Type *</label>
          <select id="probeType" class="form-control">
            ${this.renderProbeOptions(probe.type, databases)}
            <option value="__custom__" ${probe.type && probe.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
          </select>
          <input type="text" id="probeTypeCustom" class="form-control"
            value="${probe.type && probe.type.startsWith('custom:') ? probe.type.replace('custom:', '') : ''}"
            placeholder="Enter custom probe type"
            style="display: ${probe.type && probe.type.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          <p class="field-help">Select your probe type or choose "Custom" to specify</p>
        </div>

        <!-- Probe Settings (shown when probe is selected) -->
        <div id="probeSettings" style="display: ${probe.type !== 'none' ? 'block' : 'none'};">
          <!-- Probe Offsets Section -->
          <h4 style="margin-top: 25px;">Probe Offsets</h4>
          <div class="form-row">
            <div class="form-group">
              <label>X Offset (mm)</label>
              <input type="number" id="probeOffsetX" class="form-control" 
                value="${probe.offsets?.x || 0}" step="0.1">
              <p class="field-help">Negative if left of nozzle</p>
            </div>
            <div class="form-group">
              <label>Y Offset (mm)</label>
              <input type="number" id="probeOffsetY" class="form-control" 
                value="${probe.offsets?.y || 0}" step="0.1">
              <p class="field-help">Negative if in front of nozzle</p>
            </div>
            <div class="form-group">
              <label>Z Offset (mm)</label>
              <input type="number" id="probeOffsetZ" class="form-control" 
                value="${probe.offsets?.z || 0}" step="0.01">
              <p class="field-help">Use Z-Offset Calibration tool</p>
            </div>
          </div>

          <!-- Bed Leveling Method Section -->
          <h4 style="margin-top: 25px;">Bed Leveling Method</h4>
          <div class="form-group">
            <label>Leveling System *</label>
            <select id="bedLevelingType" class="form-control">
              <option value="none" ${bedLeveling.type === 'none' ? 'selected' : ''}>None (Manual Leveling)</option>
              <option value="abl" ${bedLeveling.type === 'abl' ? 'selected' : ''}>Auto Bed Leveling (ABL)</option>
              <option value="ubl" ${bedLeveling.type === 'ubl' ? 'selected' : ''}>Unified Bed Leveling (UBL)</option>
              <option value="mbl" ${bedLeveling.type === 'mbl' ? 'selected' : ''}>Manual Bed Leveling (MBL)</option>
              <option value="mesh" ${bedLeveling.type === 'mesh' ? 'selected' : ''}>Mesh Bed Leveling</option>
              <option value="__custom__" ${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? 'selected' : ''}>🔧 Custom / Other...</option>
            </select>
            <input type="text" id="bedLevelingTypeCustom" class="form-control"
              value="${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? bedLeveling.type.replace('custom:', '') : ''}"
              placeholder="Enter custom leveling type"
              style="display: ${bedLeveling.type && bedLeveling.type.startsWith('custom:') ? 'block' : 'none'}; margin-top: 10px;">
          </div>

          <!-- Mesh Configuration (shown when leveling is enabled) -->
          <div id="meshSettings" style="display: ${bedLeveling.type !== 'none' ? 'block' : 'none'};">
            <h4 style="margin-top: 25px;">Mesh Configuration</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Grid Points X</label>
                <input type="number" id="gridPointsX" class="form-control" 
                  value="${bedLeveling.gridPoints?.x || 3}" min="3" max="15">
                <p class="field-help">3-5 typical, 7+ for UBL</p>
              </div>
              <div class="form-group">
                <label>Grid Points Y</label>
                <input type="number" id="gridPointsY" class="form-control" 
                  value="${bedLeveling.gridPoints?.y || 3}" min="3" max="15">
                <p class="field-help">3-5 typical, 7+ for UBL</p>
              </div>
              <div class="form-group">
                <label>Fade Height (mm)</label>
                <input type="number" id="fadeHeight" class="form-control" 
                  value="${bedLeveling.fadeHeight || 0}" step="0.1" min="0">
                <p class="field-help">0 = disabled, 10mm typical</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render probe dropdown options
   * @param {string} selectedProbe - Currently selected probe type
   * @param {Object} databases - Hardware databases
   * @returns {string} HTML options
   */
  renderProbeOptions(selectedProbe, databases) {
    if (!databases['bed-probes']?.probes) return '<option value="none">None / Mechanical Switch</option>';
    
    return databases['bed-probes'].probes.map(probe => {
      const selected = selectedProbe === probe.id ? 'selected' : '';
      return `<option value="${probe.id}" ${selected}>${probe.name}</option>`;
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
    if (!profile.probe) profile.probe = { type: 'none', offsets: { x: 0, y: 0, z: 0 } };
    if (!profile.bedLeveling) profile.bedLeveling = { type: 'none', gridPoints: { x: 3, y: 3 }, fadeHeight: 0 };

    // Probe type
    const probeType = document.getElementById('probeType');
    const probeCustom = document.getElementById('probeTypeCustom');
    const probeSettings = document.getElementById('probeSettings');
    
    if (probeType) {
      probeType.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (probeCustom) probeCustom.style.display = 'block';
        } else {
          if (probeCustom) probeCustom.style.display = 'none';
          profile.probe.type = e.target.value;
          profile.modified = new Date().toISOString();
          
          // Show/hide probe settings
          if (probeSettings) {
            probeSettings.style.display = e.target.value !== 'none' ? 'block' : 'none';
          }
          
          updateCallback();
        }
      });
    }
    
    if (probeCustom) {
      probeCustom.addEventListener('input', (e) => {
        profile.probe.type = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Probe offsets
    ['probeOffsetX', 'probeOffsetY', 'probeOffsetZ'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('probeOffset', '').toLowerCase();
          if (!profile.probe.offsets) profile.probe.offsets = {};
          profile.probe.offsets[axis] = parseFloat(e.target.value) || 0;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });

    // Bed leveling type
    const bedLevelingType = document.getElementById('bedLevelingType');
    const bedLevelingCustom = document.getElementById('bedLevelingTypeCustom');
    const meshSettings = document.getElementById('meshSettings');
    
    if (bedLevelingType) {
      bedLevelingType.addEventListener('change', (e) => {
        if (e.target.value === '__custom__') {
          if (bedLevelingCustom) bedLevelingCustom.style.display = 'block';
        } else {
          if (bedLevelingCustom) bedLevelingCustom.style.display = 'none';
          profile.bedLeveling.type = e.target.value;
          profile.modified = new Date().toISOString();
          
          // Show/hide mesh settings
          if (meshSettings) {
            meshSettings.style.display = e.target.value !== 'none' ? 'block' : 'none';
          }
          
          updateCallback();
        }
      });
    }
    
    if (bedLevelingCustom) {
      bedLevelingCustom.addEventListener('input', (e) => {
        profile.bedLeveling.type = 'custom:' + e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Mesh grid points
    ['gridPointsX', 'gridPointsY'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const axis = id.replace('gridPoints', '').toLowerCase();
          if (!profile.bedLeveling.gridPoints) profile.bedLeveling.gridPoints = {};
          profile.bedLeveling.gridPoints[axis] = parseInt(e.target.value, 10) || 3;
          profile.modified = new Date().toISOString();
          updateCallback();
        });
      }
    });

    // Fade height
    const fadeHeight = document.getElementById('fadeHeight');
    if (fadeHeight) {
      fadeHeight.addEventListener('input', (e) => {
        profile.bedLeveling.fadeHeight = parseFloat(e.target.value) || 0;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
