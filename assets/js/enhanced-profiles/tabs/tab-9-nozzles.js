/**
 * Tab 9: Nozzle Inventory
 * Manage nozzle collection and track currently installed nozzle
 * 
 * @module Tab9Nozzles
 */

export const Tab9Nozzles = {
  /**
   * Render tab HTML
   * @param {Object} profile - Current printer profile
   * @param {Object} databases - Hardware databases (Nozzle database)
   * @returns {string} HTML string
   */
  render(profile, databases) {
    const nozzles = profile.nozzles || { inventory: [], currentNozzleId: null };
    
    return `
      <div class="tab-content">
        <h3>🔧 Nozzle Inventory</h3>

        <!-- Current Nozzle Section -->
        <h4>Currently Installed Nozzle</h4>
        <div class="form-group">
          <label>Active Nozzle</label>
          <select id="currentNozzle" class="form-control">
            <option value="">Select from inventory...</option>
            ${this.renderNozzleInventoryOptions(nozzles.inventory, nozzles.currentNozzleId)}
          </select>
          <p class="field-help">Select which nozzle is currently installed</p>
        </div>

        ${nozzles.currentNozzleId ? this.renderCurrentNozzleDetails(nozzles.inventory, nozzles.currentNozzleId) : ''}

        <!-- Nozzle Inventory Section -->
        <h4 style="margin-top: 25px;">Nozzle Inventory</h4>
        <p class="field-help">Track your nozzle collection for quick switching</p>
        
        <div id="nozzleInventoryList" style="margin-bottom: 15px;">
          ${this.renderNozzleInventoryList(nozzles.inventory)}
        </div>

        <!-- Add Nozzle Form -->
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px; background: #f9f9f9;">
          <h5 style="margin-top: 0;">Add New Nozzle</h5>
          <div class="form-row">
            <div class="form-group">
              <label>Size (mm) *</label>
              <input type="number" id="newNozzleSize" class="form-control" 
                placeholder="0.4" step="0.05" min="0.1" max="2.0">
            </div>
            <div class="form-group">
              <label>Material *</label>
              <select id="newNozzleMaterial" class="form-control">
                <option value="">Select material...</option>
                <option value="brass">Brass</option>
                <option value="hardened-steel">Hardened Steel</option>
                <option value="stainless-steel">Stainless Steel</option>
                <option value="ruby">Ruby Tipped</option>
                <option value="tungsten">Tungsten Carbide</option>
                <option value="copper">Copper Alloy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Coating</label>
              <select id="newNozzleCoating" class="form-control">
                <option value="">None</option>
                <option value="nickel">Nickel Plated</option>
                <option value="teflon">PTFE (Teflon)</option>
                <option value="diamond">Diamond-Like Carbon (DLC)</option>
                <option value="titanium">Titanium Nitride</option>
              </select>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <input type="text" id="newNozzleNotes" class="form-control" 
                placeholder="e.g., For PLA only, high flow, etc.">
            </div>
          </div>
          <button id="addNozzleBtn" class="btn btn-primary" style="margin-top: 10px;">
            ➕ Add to Inventory
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Render nozzle inventory dropdown options
   * @param {Array} inventory - Array of nozzle objects
   * @param {string} currentNozzleId - Currently selected nozzle ID
   * @returns {string} HTML options
   */
  renderNozzleInventoryOptions(inventory, currentNozzleId) {
    if (!inventory || inventory.length === 0) return '';
    
    return inventory.map(nozzle => {
      const selected = nozzle.id === currentNozzleId ? 'selected' : '';
      const label = `${nozzle.size}mm ${nozzle.material}${nozzle.coating ? ` (${nozzle.coating})` : ''}`;
      return `<option value="${nozzle.id}" ${selected}>${label}</option>`;
    }).join('');
  },

  /**
   * Render current nozzle details box
   * @param {Array} inventory - Array of nozzle objects
   * @param {string} currentNozzleId - Currently selected nozzle ID
   * @returns {string} HTML string
   */
  renderCurrentNozzleDetails(inventory, currentNozzleId) {
    const nozzle = inventory.find(n => n.id === currentNozzleId);
    if (!nozzle) return '';

    return `
      <div style="margin-top: 15px; padding: 15px; background: #e8f5e9; border: 1px solid #4caf50; border-radius: 4px;">
        <strong>✓ Active Nozzle:</strong>
        <ul style="margin: 10px 0 0 20px; padding: 0;">
          <li><strong>Size:</strong> ${nozzle.size}mm</li>
          <li><strong>Material:</strong> ${nozzle.material}</li>
          ${nozzle.coating ? `<li><strong>Coating:</strong> ${nozzle.coating}</li>` : ''}
          ${nozzle.notes ? `<li><strong>Notes:</strong> ${nozzle.notes}</li>` : ''}
        </ul>
      </div>
    `;
  },

  /**
   * Render nozzle inventory list
   * @param {Array} inventory - Array of nozzle objects
   * @returns {string} HTML string
   */
  renderNozzleInventoryList(inventory) {
    if (!inventory || inventory.length === 0) {
      return '<p style="color: #999; font-style: italic;">No nozzles in inventory. Add one below.</p>';
    }

    return `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0; border-bottom: 2px solid #ddd;">
            <th style="padding: 8px; text-align: left;">Size</th>
            <th style="padding: 8px; text-align: left;">Material</th>
            <th style="padding: 8px; text-align: left;">Coating</th>
            <th style="padding: 8px; text-align: left;">Notes</th>
            <th style="padding: 8px; text-align: center;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${inventory.map(nozzle => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px;"><strong>${nozzle.size}mm</strong></td>
              <td style="padding: 8px;">${nozzle.material}</td>
              <td style="padding: 8px;">${nozzle.coating || '-'}</td>
              <td style="padding: 8px;">${nozzle.notes || '-'}</td>
              <td style="padding: 8px; text-align: center;">
                <button class="btn-delete-nozzle" data-nozzle-id="${nozzle.id}" 
                  style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">
                  🗑️ Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  /**
   * Attach event listeners for this tab
   * @param {Object} profile - Current printer profile
   * @param {Function} updateCallback - Called when profile changes
   * @param {Object} databases - Hardware databases
   * @param {Object} context - Additional context (parent controller methods)
   */
  attachListeners(profile, updateCallback, databases, context) {
    // Initialize nozzles object if needed
    if (!profile.nozzles) profile.nozzles = { inventory: [], currentNozzleId: null };
    if (!profile.nozzles.inventory) profile.nozzles.inventory = [];

    // Current nozzle selector
    const currentNozzleSelect = document.getElementById('currentNozzle');
    if (currentNozzleSelect) {
      currentNozzleSelect.addEventListener('change', (e) => {
        profile.nozzles.currentNozzleId = e.target.value || null;
        profile.modified = new Date().toISOString();
        updateCallback();
        
        // Re-render to show details
        if (context.renderCurrentTab) {
          context.renderCurrentTab();
        }
      });
    }

    // Add nozzle button
    const addNozzleBtn = document.getElementById('addNozzleBtn');
    if (addNozzleBtn) {
      addNozzleBtn.addEventListener('click', () => {
        const size = document.getElementById('newNozzleSize');
        const material = document.getElementById('newNozzleMaterial');
        const coating = document.getElementById('newNozzleCoating');
        const notes = document.getElementById('newNozzleNotes');

        // Validate
        if (!size.value || !material.value) {
          alert('Please enter nozzle size and material');
          return;
        }

        // Create new nozzle object
        const newNozzle = {
          id: 'nozzle_' + Date.now(),
          size: parseFloat(size.value),
          material: material.value,
          coating: coating.value || null,
          notes: notes.value || null,
          addedDate: new Date().toISOString()
        };

        // Add to inventory
        profile.nozzles.inventory.push(newNozzle);
        profile.modified = new Date().toISOString();

        // Clear form
        size.value = '';
        material.value = '';
        coating.value = '';
        notes.value = '';

        // Update and re-render
        updateCallback();
        if (context.renderCurrentTab) {
          context.renderCurrentTab();
        }
      });
    }

    // Delete nozzle buttons
    const deleteButtons = document.querySelectorAll('.btn-delete-nozzle');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nozzleId = e.target.getAttribute('data-nozzle-id');
        
        if (confirm('Are you sure you want to delete this nozzle from inventory?')) {
          // Remove from inventory
          profile.nozzles.inventory = profile.nozzles.inventory.filter(n => n.id !== nozzleId);
          
          // Clear current nozzle if it was deleted
          if (profile.nozzles.currentNozzleId === nozzleId) {
            profile.nozzles.currentNozzleId = null;
          }
          
          profile.modified = new Date().toISOString();
          
          // Update and re-render
          updateCallback();
          if (context.renderCurrentTab) {
            context.renderCurrentTab();
          }
        }
      });
    });
  }
};
