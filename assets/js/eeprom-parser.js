/* ============================================
   EEPROM Parser Module
   Parses M503 output and OctoPrint EEPROM backups
   Global utility for all tools
   ============================================ */

const EEPROMParser = {
    
    /**
     * Parse M503 output text
     * @param {string} m503Text - Raw M503 command output
     * @returns {object} Parsed EEPROM data
     */
    parseM503(m503Text) {
        if (!m503Text) {
            throw new Error('No M503 text provided');
        }
        
        const result = {
            raw: m503Text,
            parsed: true,
            firmware: this.extractFirmware(m503Text),
            maxFeedrate: this.extractMaxFeedrate(m503Text),
            maxAccel: this.extractMaxAccel(m503Text),
            jerk: this.extractJerk(m503Text),
            esteps: this.extractESteps(m503Text),
            pidHotend: this.extractPIDHotend(m503Text),
            pidBed: this.extractPIDBed(m503Text),
            linearAdvance: this.extractLinearAdvance(m503Text),
            zOffset: this.extractZOffset(m503Text),
            bedSize: this.extractBedSize(m503Text),
            bedLevelingType: this.detectBedLeveling(m503Text),
            warnings: []
        };
        
        // Validate and add warnings
        result.warnings = this.validateEEPROM(result);
        
        return result;
    },
    
    /**
     * Parse OctoPrint EEPROM backup (.zip file)
     * @param {File} zipFile - OctoPrint backup zip file
     * @returns {Promise<object>} Parsed EEPROM data
     */
    async parseOctoPrintBackup(zipFile) {
        // Note: This requires JSZip library to be loaded
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library not loaded. Include it in your HTML.');
        }
        
        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(zipFile);
            
            // Look for eeprom.dat or M503 output
            let eepromText = null;
            
            // Try to find M503 output or eeprom data
            for (const filename in contents.files) {
                if (filename.includes('eeprom') || filename.includes('M503')) {
                    eepromText = await contents.files[filename].async('text');
                    break;
                }
            }
            
            if (!eepromText) {
                throw new Error('No EEPROM data found in backup file');
            }
            
            return this.parseM503(eepromText);
        } catch (error) {
            throw new Error(`Failed to parse OctoPrint backup: ${error.message}`);
        }
    },
    
    /**
     * Extract firmware information
     */
    extractFirmware(text) {
        const firmwareMatch = text.match(/FIRMWARE_NAME:([^\s]+).*FIRMWARE_VERSION:([^\s]+)/i) ||
                            text.match(/Marlin\s+([\d.]+)/i) ||
                            text.match(/echo:\s*([^\r\n]+)/);
        
        return {
            name: firmwareMatch ? firmwareMatch[1] : 'Unknown',
            version: firmwareMatch && firmwareMatch[2] ? firmwareMatch[2] : 'Unknown'
        };
    },
    
    /**
     * Extract max feedrates (M203)
     */
    extractMaxFeedrate(text) {
        const match = text.match(/M203\s+X([\d.]+)\s+Y([\d.]+)\s+Z([\d.]+)\s+E([\d.]+)/i);
        
        if (match) {
            return {
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
                z: parseFloat(match[3]),
                e: parseFloat(match[4])
            };
        }
        
        return { x: null, y: null, z: null, e: null };
    },
    
    /**
     * Extract max accelerations (M201)
     */
    extractMaxAccel(text) {
        const match = text.match(/M201\s+X([\d.]+)\s+Y([\d.]+)\s+Z([\d.]+)\s+E([\d.]+)/i);
        
        if (match) {
            return {
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
                z: parseFloat(match[3]),
                e: parseFloat(match[4])
            };
        }
        
        return { x: null, y: null, z: null, e: null };
    },
    
    /**
     * Extract jerk settings (M205)
     */
    extractJerk(text) {
        const match = text.match(/M205[^\r\n]*X([\d.]+)[^\r\n]*Y([\d.]+)[^\r\n]*Z([\d.]+)[^\r\n]*E([\d.]+)/i);
        
        if (match) {
            return {
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
                z: parseFloat(match[3]),
                e: parseFloat(match[4])
            };
        }
        
        return { x: null, y: null, z: null, e: null };
    },
    
    /**
     * Extract E-steps (M92)
     */
    extractESteps(text) {
        const match = text.match(/M92[^\r\n]*E([\d.]+)/i);
        return match ? parseFloat(match[1]) : null;
    },
    
    /**
     * Extract hotend PID values (M301)
     */
    extractPIDHotend(text) {
        const match = text.match(/M301\s+P([\d.]+)\s+I([\d.]+)\s+D([\d.]+)/i);
        
        if (match) {
            return {
                p: parseFloat(match[1]),
                i: parseFloat(match[2]),
                d: parseFloat(match[3])
            };
        }
        
        return null;
    },
    
    /**
     * Extract bed PID values (M304)
     */
    extractPIDBed(text) {
        const match = text.match(/M304\s+P([\d.]+)\s+I([\d.]+)\s+D([\d.]+)/i);
        
        if (match) {
            return {
                p: parseFloat(match[1]),
                i: parseFloat(match[2]),
                d: parseFloat(match[3])
            };
        }
        
        return null;
    },
    
    /**
     * Extract Linear Advance K factor (M900)
     */
    extractLinearAdvance(text) {
        const match = text.match(/M900\s+K([\d.]+)/i);
        return match ? parseFloat(match[1]) : null;
    },
    
    /**
     * Extract Z-offset (M851)
     */
    extractZOffset(text) {
        const match = text.match(/M851[^\r\n]*Z(-?[\d.]+)/i);
        return match ? parseFloat(match[1]) : null;
    },
    
    /**
     * Extract bed size (M211 or configuration)
     */
    extractBedSize(text) {
        // Try to find bed size from various places
        const xMatch = text.match(/X_MAX_POS\s+([\d.]+)|X.*max.*:?\s*([\d.]+)/i);
        const yMatch = text.match(/Y_MAX_POS\s+([\d.]+)|Y.*max.*:?\s*([\d.]+)/i);
        const zMatch = text.match(/Z_MAX_POS\s+([\d.]+)|Z.*max.*:?\s*([\d.]+)/i);
        
        return {
            x: xMatch ? parseFloat(xMatch[1] || xMatch[2]) : null,
            y: yMatch ? parseFloat(yMatch[1] || yMatch[2]) : null,
            z: zMatch ? parseFloat(zMatch[1] || zMatch[2]) : null
        };
    },
    
    /**
     * Detect bed leveling type
     */
    detectBedLeveling(text) {
        if (text.match(/G29\s+S\d|Unified Bed Leveling|UBL/i)) {
            return 'UBL';
        } else if (text.match(/Bilinear|G29/i)) {
            return 'Bilinear';
        } else if (text.match(/Mesh/i)) {
            return 'Mesh';
        } else if (text.match(/Auto.*Level|ABL/i)) {
            return 'ABL';
        } else if (text.match(/BLTouch/i)) {
            return 'BLTouch';
        }
        
        return 'Manual';
    },
    
    /**
     * Validate EEPROM data and generate warnings
     */
    validateEEPROM(data) {
        const warnings = [];
        
        // Check E-steps
        if (data.esteps !== null) {
            if (data.esteps < 50 || data.esteps > 2000) {
                warnings.push({
                    level: 'error',
                    field: 'esteps',
                    message: `E-steps value (${data.esteps}) is unusual. Typical range: 50-2000 steps/mm`,
                    suggestion: 'Verify this value or run E-steps calibration'
                });
            } else if (data.esteps === 93 || data.esteps === 415) {
                warnings.push({
                    level: 'info',
                    field: 'esteps',
                    message: `E-steps appears to be stock value (${data.esteps})`,
                    suggestion: 'Consider calibrating for your specific setup'
                });
            }
        } else {
            warnings.push({
                level: 'warning',
                field: 'esteps',
                message: 'E-steps not found in EEPROM',
                suggestion: 'Run E-steps calibration'
            });
        }
        
        // Check feedrates
        if (data.maxFeedrate.e !== null && data.maxFeedrate.e < 10) {
            warnings.push({
                level: 'warning',
                field: 'feedrate',
                message: `Low E feedrate (${data.maxFeedrate.e} mm/s) may limit print speed`,
                suggestion: 'Consider increasing if extruder can handle it'
            });
        }
        
        // Check accelerations
        if (data.maxAccel.x !== null && data.maxAccel.x > 3000) {
            warnings.push({
                level: 'warning',
                field: 'acceleration',
                message: `Very high X acceleration (${data.maxAccel.x}) may cause ringing`,
                suggestion: 'Consider lowering for better print quality'
            });
        }
        
        // Check PID
        if (!data.pidHotend) {
            warnings.push({
                level: 'warning',
                field: 'pid',
                message: 'Hotend PID values not found',
                suggestion: 'Run PID autotuning for stable temperatures'
            });
        }
        
        // Check Z-offset
        if (data.zOffset === 0) {
            warnings.push({
                level: 'info',
                field: 'zOffset',
                message: 'Z-offset is exactly 0.00',
                suggestion: 'This may not be calibrated. Run first layer calibration'
            });
        }
        
        // Check Linear Advance
        if (data.linearAdvance === null || data.linearAdvance === 0) {
            warnings.push({
                level: 'info',
                field: 'linearAdvance',
                message: 'Linear Advance not configured or set to 0',
                suggestion: 'Consider calibrating for better print quality'
            });
        }
        
        return warnings;
    },
    
    /**
     * Format EEPROM data for display
     */
    formatForDisplay(data) {
        return {
            'Firmware': `${data.firmware.name} ${data.firmware.version}`,
            'E-Steps': data.esteps ? `${data.esteps} steps/mm` : 'Not found',
            'Max Feedrate (X/Y/Z/E)': data.maxFeedrate.x ? 
                `${data.maxFeedrate.x}/${data.maxFeedrate.y}/${data.maxFeedrate.z}/${data.maxFeedrate.e} mm/s` : 
                'Not found',
            'Max Accel (X/Y/Z/E)': data.maxAccel.x ? 
                `${data.maxAccel.x}/${data.maxAccel.y}/${data.maxAccel.z}/${data.maxAccel.e} mm/s²` : 
                'Not found',
            'Jerk (X/Y/Z/E)': data.jerk.x ? 
                `${data.jerk.x}/${data.jerk.y}/${data.jerk.z}/${data.jerk.e} mm/s` : 
                'Not found',
            'PID Hotend': data.pidHotend ? 
                `P:${data.pidHotend.p} I:${data.pidHotend.i} D:${data.pidHotend.d}` : 
                'Not found',
            'PID Bed': data.pidBed ? 
                `P:${data.pidBed.p} I:${data.pidBed.i} D:${data.pidBed.d}` : 
                'Not found',
            'Linear Advance': data.linearAdvance !== null ? 
                `K=${data.linearAdvance}` : 
                'Not configured',
            'Z-Offset': data.zOffset !== null ? 
                `${data.zOffset} mm` : 
                'Not found',
            'Bed Size': data.bedSize.x ? 
                `${data.bedSize.x}×${data.bedSize.y}×${data.bedSize.z} mm` : 
                'Not found',
            'Bed Leveling': data.bedLevelingType
        };
    },
    
    /**
     * Convert parsed EEPROM to StorageManager format
     */
    toStorageFormat(parsedData) {
        return {
            maxFeedrate: parsedData.maxFeedrate,
            maxAccel: parsedData.maxAccel,
            jerk: parsedData.jerk,
            esteps: parsedData.esteps,
            pidHotend: parsedData.pidHotend,
            pidBed: parsedData.pidBed,
            linearAdvance: parsedData.linearAdvance,
            zOffset: parsedData.zOffset,
            bedSize: parsedData.bedSize,
            bedLevelingType: parsedData.bedLevelingType
        };
    },
    
    /**
     * Create a summary report
     */
    createSummary(data) {
        const issueCount = data.warnings.filter(w => w.level === 'error' || w.level === 'warning').length;
        const infoCount = data.warnings.filter(w => w.level === 'info').length;
        
        return {
            success: data.parsed,
            firmware: `${data.firmware.name} ${data.firmware.version}`,
            issueCount,
            infoCount,
            totalWarnings: data.warnings.length,
            calibrationNeeded: data.warnings.some(w => 
                w.field === 'esteps' || w.field === 'pid' || w.field === 'zOffset'
            ),
            warnings: data.warnings
        };
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.EEPROMParser = EEPROMParser;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EEPROMParser;
}
