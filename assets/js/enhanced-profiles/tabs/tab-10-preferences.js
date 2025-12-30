/**
 * Tab 10: Preferences & Notes
 * Slicer preferences, default materials, enclosure settings, and user documentation
 * 
 * @module Tab10Preferences
 */

export const Tab10Preferences = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (not used in this tab)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const prefs = profile.preferences || {
      slicer: '',
      slicerProfile: '',
      defaultMaterial: '',
      enclosure: { hasEnclosure: false, type: '', heatedChamber: false },
      tags: [],
      notes: ''
    };

    return `
      <div class="tab-content">
        <h3>⚙️ Preferences & Notes</h3>

        <!-- Slicer Preferences -->
        <h4>Slicer Preferences</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Preferred Slicer</label>
            <select id="preferredSlicer" class="form-control">
              <option value="">Select slicer...</option>
              <option value="cura" ${prefs.slicer === 'cura' ? 'selected' : ''}>Cura</option>
              <option value="prusaslicer" ${prefs.slicer === 'prusaslicer' ? 'selected' : ''}>PrusaSlicer</option>
              <option value="superslicer" ${prefs.slicer === 'superslicer' ? 'selected' : ''}>SuperSlicer</option>
              <option value="orcaslicer" ${prefs.slicer === 'orcaslicer' ? 'selected' : ''}>OrcaSlicer</option>
              <option value="simplify3d" ${prefs.slicer === 'simplify3d' ? 'selected' : ''}>Simplify3D</option>
              <option value="ideamaker" ${prefs.slicer === 'ideamaker' ? 'selected' : ''}>IdeaMaker</option>
              <option value="bambu-studio" ${prefs.slicer === 'bambu-studio' ? 'selected' : ''}>Bambu Studio</option>
              <option value="other" ${prefs.slicer === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Slicer Profile Name</label>
            <input type="text" id="slicerProfile" class="form-control" 
              value="${prefs.slicerProfile || ''}"
              placeholder="e.g., 'Ender5 Plus - 0.4mm Nozzle'">
            <p class="field-help">Name of your slicer profile for this printer</p>
          </div>
        </div>

        <!-- Material Preferences -->
        <h4 style="margin-top: 25px;">Material Preferences</h4>
        <div class="form-group">
          <label>Default Material</label>
          <select id="defaultMaterial" class="form-control">
            <option value="">Select default material...</option>
            <option value="pla" ${prefs.defaultMaterial === 'pla' ? 'selected' : ''}>PLA</option>
            <option value="petg" ${prefs.defaultMaterial === 'petg' ? 'selected' : ''}>PETG</option>
            <option value="abs" ${prefs.defaultMaterial === 'abs' ? 'selected' : ''}>ABS</option>
            <option value="asa" ${prefs.defaultMaterial === 'asa' ? 'selected' : ''}>ASA</option>
            <option value="tpu" ${prefs.defaultMaterial === 'tpu' ? 'selected' : ''}>TPU (Flexible)</option>
            <option value="nylon" ${prefs.defaultMaterial === 'nylon' ? 'selected' : ''}>Nylon</option>
            <option value="pc" ${prefs.defaultMaterial === 'pc' ? 'selected' : ''}>Polycarbonate (PC)</option>
            <option value="pla-plus" ${prefs.defaultMaterial === 'pla-plus' ? 'selected' : ''}>PLA+</option>
            <option value="wood-pla" ${prefs.defaultMaterial === 'wood-pla' ? 'selected' : ''}>Wood PLA</option>
            <option value="carbon-fiber" ${prefs.defaultMaterial === 'carbon-fiber' ? 'selected' : ''}>Carbon Fiber</option>
            <option value="other" ${prefs.defaultMaterial === 'other' ? 'selected' : ''}>Other</option>
          </select>
          <p class="field-help">Material you use most often with this printer</p>
        </div>

        <!-- Enclosure Settings -->
        <h4 style="margin-top: 25px;">Enclosure Settings</h4>
        <div class="form-row">
          <div class="form-group">
            <label>
              <input type="checkbox" id="hasEnclosure" 
                ${prefs.enclosure?.hasEnclosure ? 'checked' : ''} 
                style="width: auto; margin-right: 10px;">
              Has Enclosure
            </label>
            <p class="field-help">Printer is enclosed or has an enclosure</p>
          </div>
          <div class="form-group">
            <label>Enclosure Type</label>
            <select id="enclosureType" class="form-control"
              ${!prefs.enclosure?.hasEnclosure ? 'disabled' : ''}>
              <option value="">Select type...</option>
              <option value="diy" ${prefs.enclosure?.type === 'diy' ? 'selected' : ''}>DIY / Custom</option>
              <option value="acrylic" ${prefs.enclosure?.type === 'acrylic' ? 'selected' : ''}>Acrylic Panels</option>
              <option value="lack" ${prefs.enclosure?.type === 'lack' ? 'selected' : ''}>IKEA Lack</option>
              <option value="tent" ${prefs.enclosure?.type === 'tent' ? 'selected' : ''}>Enclosure Tent</option>
              <option value="commercial" ${prefs.enclosure?.type === 'commercial' ? 'selected' : ''}>Commercial Enclosure</option>
              <option value="built-in" ${prefs.enclosure?.type === 'built-in' ? 'selected' : ''}>Built-In (Factory)</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="heatedChamber" 
                ${prefs.enclosure?.heatedChamber ? 'checked' : ''}
                ${!prefs.enclosure?.hasEnclosure ? 'disabled' : ''}
                style="width: auto; margin-right: 10px;">
              Heated Chamber
            </label>
            <p class="field-help">Active chamber heating available</p>
          </div>
        </div>

        <!-- Profile Tags -->
        <h4 style="margin-top: 25px;">Profile Tags</h4>
        <div class="form-group">
          <label>Tags (comma-separated)</label>
          <input type="text" id="profileTags" class="form-control" 
            value="${prefs.tags ? prefs.tags.join(', ') : ''}"
            placeholder="e.g., direct-drive, dual-z, klipper, modified">
          <p class="field-help">Add tags to organize and search profiles</p>
        </div>

        <!-- User Notes -->
        <h4 style="margin-top: 25px;">User Notes</h4>
        <div class="form-group">
          <label>Notes & Documentation</label>
          <textarea id="userNotes" class="form-control" rows="6"
            placeholder="Add any notes about this printer configuration...
            
Examples:
- Modifications made
- Print quality observations
- Maintenance schedule
- Troubleshooting tips
- Upgrade plans">${prefs.notes || ''}</textarea>
          <p class="field-help">Keep notes about your printer configuration, modifications, and settings</p>
        </div>

        <!-- Profile Metadata (Read-only) -->
        <h4 style="margin-top: 25px;">Profile Metadata</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Profile ID</label>
            <input type="text" class="form-control" value="${profile.id || 'Not saved'}" disabled>
          </div>
          <div class="form-group">
            <label>Created</label>
            <input type="text" class="form-control" 
              value="${profile.created ? new Date(profile.created).toLocaleString() : 'N/A'}" disabled>
          </div>
          <div class="form-group">
            <label>Last Modified</label>
            <input type="text" class="form-control" 
              value="${profile.modified ? new Date(profile.modified).toLocaleString() : 'N/A'}" disabled>
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
    // Initialize preferences object if needed
    if (!profile.preferences) profile.preferences = {};
    if (!profile.preferences.enclosure) profile.preferences.enclosure = {};

    // Preferred Slicer
    const preferredSlicer = document.getElementById('preferredSlicer');
    if (preferredSlicer) {
      preferredSlicer.addEventListener('change', (e) => {
        profile.preferences.slicer = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Slicer Profile Name
    const slicerProfile = document.getElementById('slicerProfile');
    if (slicerProfile) {
      slicerProfile.addEventListener('input', (e) => {
        profile.preferences.slicerProfile = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Default Material
    const defaultMaterial = document.getElementById('defaultMaterial');
    if (defaultMaterial) {
      defaultMaterial.addEventListener('change', (e) => {
        profile.preferences.defaultMaterial = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Enclosure Settings
    const hasEnclosure = document.getElementById('hasEnclosure');
    const enclosureType = document.getElementById('enclosureType');
    const heatedChamber = document.getElementById('heatedChamber');
    
    if (hasEnclosure) {
      hasEnclosure.addEventListener('change', (e) => {
        profile.preferences.enclosure.hasEnclosure = e.target.checked;
        const disabled = !e.target.checked;
        if (enclosureType) enclosureType.disabled = disabled;
        if (heatedChamber) heatedChamber.disabled = disabled;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (enclosureType) {
      enclosureType.addEventListener('change', (e) => {
        profile.preferences.enclosure.type = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
    
    if (heatedChamber) {
      heatedChamber.addEventListener('change', (e) => {
        profile.preferences.enclosure.heatedChamber = e.target.checked;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // Profile Tags
    const profileTags = document.getElementById('profileTags');
    if (profileTags) {
      profileTags.addEventListener('input', (e) => {
        // Convert comma-separated string to array
        const tagsArray = e.target.value
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        profile.preferences.tags = tagsArray;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }

    // User Notes
    const userNotes = document.getElementById('userNotes');
    if (userNotes) {
      userNotes.addEventListener('input', (e) => {
        profile.preferences.notes = e.target.value;
        profile.modified = new Date().toISOString();
        updateCallback();
      });
    }
  }
};
