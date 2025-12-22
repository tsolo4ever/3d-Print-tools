// Memory Calculator Logic
class MemoryCalculator {
  constructor(memoryData) {
    this.data = memoryData;
  }
  
  /**
   * Calculate total memory usage for selected features
   */
  calculateUsage(mcuType, enabledFeatures, meshSize = null, extruders = 1) {
    const mcu = this.data.mcuLimits[mcuType];
    if (!mcu) {
      throw new Error(`Unknown MCU: ${mcuType}`);
    }
    
    // Start with base memory
    let flashUsed = this.data.baseMemory.flash[mcuType] || 100000;
    let ramUsed = this.data.baseMemory.ram[mcuType] || 10000;
    
    // Add each enabled feature
    for (const feature of enabledFeatures) {
      const cost = this.findFeatureCost(feature);
      if (cost) {
        flashUsed += cost.flash;
        ramUsed += cost.ram;
      }
    }
    
    // Add mesh memory if UBL/Bilinear
    if (meshSize && (enabledFeatures.includes('AUTO_BED_LEVELING_UBL') || 
                     enabledFeatures.includes('AUTO_BED_LEVELING_BILINEAR'))) {
      const meshRam = meshSize.x * meshSize.y * 4;
      ramUsed += meshRam;
    }
    
    // Add multi-extruder cost
    if (extruders > 1) {
      const extraExtruders = extruders - 1;
      flashUsed += extraExtruders * 1500;
      ramUsed += extraExtruders * 250;
    }
    
    return {
      mcu: mcuType,
      flash: {
        used: flashUsed,
        available: mcu.usableFlash,
        remaining: mcu.usableFlash - flashUsed,
        percentUsed: ((flashUsed / mcu.usableFlash) * 100).toFixed(1)
      },
      ram: {
        used: ramUsed,
        available: mcu.ram,
        remaining: mcu.ram - ramUsed,
        percentUsed: ((ramUsed / mcu.ram) * 100).toFixed(1)
      },
      willFit: {
        flash: flashUsed <= mcu.usableFlash,
        ram: ramUsed <= mcu.ram,
        overall: flashUsed <= mcu.usableFlash && ramUsed <= mcu.ram
      },
      warnings: this.generateWarnings(mcuType, flashUsed, ramUsed, mcu)
    };
  }
  
  /**
   * Find memory cost for a feature
   */
  findFeatureCost(featureName) {
    for (const category of Object.values(this.data.featureMemoryCost)) {
      if (typeof category === 'object' && category[featureName]) {
        return category[featureName];
      }
    }
    return null;
  }
  
  /**
   * Generate warnings based on usage
   */
  generateWarnings(mcuType, flashUsed, ramUsed, mcu) {
    const warnings = [];
    
    // Flash warnings
    const flashPercent = (flashUsed / mcu.usableFlash) * 100;
    if (flashPercent > 100) {
      warnings.push({
        level: 'error',
        message: `Flash overflow! ${(flashUsed - mcu.usableFlash).toLocaleString()} bytes over limit.`,
        suggestion: 'Disable features or upgrade to larger MCU.'
      });
    } else if (flashPercent > 95) {
      warnings.push({
        level: 'warning',
        message: `Flash very tight (${flashPercent.toFixed(1)}% used).`,
        suggestion: 'Consider disabling unused features.'
      });
    } else if (flashPercent > 85) {
      warnings.push({
        level: 'info',
        message: `Flash usage moderate (${flashPercent.toFixed(1)}% used).`
      });
    }
    
    // RAM warnings
    const ramPercent = (ramUsed / mcu.ram) * 100;
    if (ramPercent > 100) {
      warnings.push({
        level: 'error',
        message: `RAM overflow! ${(ramUsed - mcu.ram).toLocaleString()} bytes over limit.`,
        suggestion: 'Reduce buffer sizes, mesh points, or disable features.'
      });
    } else if (ramPercent > 90) {
      warnings.push({
        level: 'warning',
        message: `RAM very tight (${ramPercent.toFixed(1)}% used).`,
        suggestion: 'Stack overflow risk. Reduce mesh size or buffers.'
      });
    } else if (ramPercent > 75) {
      warnings.push({
        level: 'info',
        message: `RAM usage moderate (${ramPercent.toFixed(1)}% used).`
      });
    }
    
    // MCU-specific warnings
    if (mcuType.startsWith('ATmega')) {
      warnings.push({
        level: 'info',
        message: '8-bit MCU detected.',
        suggestion: 'Consider upgrading to 32-bit board for more features.'
      });
    }
    
    return warnings;
  }
  
  /**
   * Get recommended buffer settings for use case
   */
  getBufferRecommendation(useCase, mcuType) {
    const profile = this.data.serialBuffers?.profiles[useCase];
    const mcu = this.data.mcuLimits[mcuType];
    
    if (!profile) {
      return null;
    }
    
    // Check if profile fits in available RAM
    const ramAvailable = mcu ? mcu.ram : 65536;
    const ramNeeded = profile.ramUsage;
    
    return {
      ...profile,
      fits: ramNeeded < (ramAvailable * 0.1), // Allow 10% of RAM for buffers
      recommendation: ramNeeded < (ramAvailable * 0.1) 
        ? 'Recommended for your MCU'
        : 'May be too large for your MCU'
    };
  }
  
  /**
   * Suggest features to disable to fit in memory
   */
  suggestDisable(mcuType, enabledFeatures, targetFlashPercent = 90, targetRamPercent = 80) {
    const current = this.calculateUsage(mcuType, enabledFeatures);
    const suggestions = [];
    
    // Get all features sorted by memory cost (highest first)
    const featureCosts = enabledFeatures.map(f => ({
      feature: f,
      cost: this.findFeatureCost(f) || { flash: 0, ram: 0 }
    })).sort((a, b) => (b.cost.flash + b.cost.ram * 2) - (a.cost.flash + a.cost.ram * 2));
    
    let flashSaved = 0;
    let ramSaved = 0;
    
    for (const item of featureCosts) {
      const flashTarget = current.flash.available * (targetFlashPercent / 100);
      const ramTarget = current.ram.available * (targetRamPercent / 100);
      
      if (current.flash.used - flashSaved > flashTarget || 
          current.ram.used - ramSaved > ramTarget) {
        suggestions.push({
          feature: item.feature,
          flashSaved: item.cost.flash,
          ramSaved: item.cost.ram
        });
        flashSaved += item.cost.flash;
        ramSaved += item.cost.ram;
      }
    }
    
    return suggestions;
  }
}

// Example usage:
/*
const calculator = new MemoryCalculator(memoryData);

const result = calculator.calculateUsage('STM32F103RCT6', [
  'EEPROM_SETTINGS',
  'SDSUPPORT',
  'DWIN_CREALITY_LCD',
  'AUTO_BED_LEVELING_BILINEAR',
  'BLTOUCH',
  'LIN_ADVANCE',
  'TMC2209',
  'POWER_LOSS_RECOVERY'
], { x: 5, y: 5 });

console.log(result);
// {
//   mcu: 'STM32F103RCT6',
//   flash: { used: 178500, available: 233472, remaining: 54972, percentUsed: '76.5' },
//   ram: { used: 15800, available: 49152, remaining: 33352, percentUsed: '32.1' },
//   willFit: { flash: true, ram: true, overall: true },
//   warnings: [...]
// }
*/
