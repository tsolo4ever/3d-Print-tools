/* ============================================
   TH3D Configuration.h Parser
   Parse TH3D Unified Firmware Configuration files
   Optimized for TH3D-specific naming conventions
   ============================================ */

const TH3DConfigParser = {
    
    /**
     * Parse TH3D Configuration.h file content
     * @param {string} content - File content as text
     * @returns {object} Parsed configuration object
     */
    parseConfigFile(content) {
        const config = {
            basic: {},
            hardware: {},
            temperature: {},
            motion: {},
            probe: {},
            bedLeveling: {},
            advanced: {},
            safety: {},
            warnings: []
        };
        
        // Store defined variables for substitution
        this.variables = {};
        
        const lines = content.split('\n');
        
        // First pass: collect simple variable definitions
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#define')) {
                const match = line.match(/#define\s+(\w+)\s+([\d.]+)$/);
                if (match) {
                    this.variables[match[1]] = match[2];
                }
            }
        }
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and pure comments
            if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
                continue;
            }
            
            // Parse #define statements
            if (line.startsWith('#define')) {
                this.parseDefineLine(line, config);
            }
        }
        
        // Validate and add warnings
        this.validateConfig(config);
        
        return config;
    },
    
    /**
     * Parse a single #define line (TH3D specific)
     */
    parseDefineLine(line, config) {
        // Extract the define name and value
        const match = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
        if (!match) return;
        
        const [, name, value] = match;
        const cleanValue = value ? value.split('//')[0].trim() : true;
        
        // === TH3D SPECIFIC FIELDS ===
        
        // TH3D Firmware Version
        if (name === 'UNIFIED_VERSION') {
            config.basic.firmwareVersion = this.extractString(cleanValue);
        }
        
        // TH3D Distribution Date
        else if (name === 'STRING_DISTRIBUTION_DATE') {
            config.basic.distributionDate = this.extractString(cleanValue);
        }
        
        // Machine Name (TH3D uses USER_PRINTER_NAME)
        else if (name === 'USER_PRINTER_NAME') {
            const extracted = this.extractString(cleanValue);
            console.log('🔍 TH3D Parser found USER_PRINTER_NAME!');
            console.log('   Raw value:', cleanValue);
            console.log('   Extracted:', extracted);
            config.basic.machineName = extracted;
            // Store for variable resolution
            config.basic.userPrinterNameValue = extracted;
        }
        
        // Also support standard Marlin field as fallback
        // BUT skip if it's a variable reference (e.g., "USER_PRINTER_NAME" without quotes)
        else if (name === 'CUSTOM_MACHINE_NAME') {
            const extracted = this.extractString(cleanValue);
            // If it's a variable reference (no quotes found, returns the raw value)
            if (extracted === cleanValue && cleanValue === 'USER_PRINTER_NAME') {
                // It's a variable reference - use the stored value if available
                if (config.basic.userPrinterNameValue) {
                    config.basic.machineName = config.basic.userPrinterNameValue;
                }
                // Don't overwrite with the variable name
            } else if (!config.basic.machineName) {
                // It's a real string value, use it
                config.basic.machineName = extracted;
            }
        }
        
        // === BASIC INFO ===
        else if (name === 'MACHINE_UUID') {
            config.basic.uuid = this.extractString(cleanValue);
        } else if (name === 'STRING_CONFIG_H_AUTHOR') {
            config.basic.author = this.extractString(cleanValue);
        } else if (name === 'MOTHERBOARD') {
            config.basic.motherboard = cleanValue;
        } else if (name === 'SERIAL_PORT') {
            config.basic.serialPort = parseInt(cleanValue);
        } else if (name === 'BAUDRATE') {
            config.basic.baudRate = parseInt(cleanValue);
        }
        
        // === STEPPER DRIVERS ===
        else if (name === 'X_DRIVER_TYPE') {
            config.hardware.driverX = cleanValue;
        } else if (name === 'Y_DRIVER_TYPE') {
            config.hardware.driverY = cleanValue;
        } else if (name === 'Z_DRIVER_TYPE') {
            config.hardware.driverZ = cleanValue;
        } else if (name === 'E0_DRIVER_TYPE') {
            config.hardware.driverE0 = cleanValue;
        }
        
        // === THERMISTORS ===
        else if (name === 'TEMP_SENSOR_0') {
            config.hardware.thermistorHotend = parseInt(cleanValue);
        } else if (name === 'TEMP_SENSOR_BED') {
            config.hardware.thermistorBed = parseInt(cleanValue);
        }
        
        // === TEMPERATURE LIMITS ===
        else if (name === 'HEATER_0_MAXTEMP') {
            config.temperature.hotendMaxTemp = parseInt(cleanValue);
        } else if (name === 'BED_MAXTEMP') {
            config.temperature.bedMaxTemp = parseInt(cleanValue);
        }
        
        // === PID ===
        else if (name === 'PIDTEMP') {
            config.temperature.pidHotendEnabled = true;
        } else if (name === 'DEFAULT_Kp') {
            config.temperature.pidHotendP = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_Ki') {
            config.temperature.pidHotendI = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_Kd') {
            config.temperature.pidHotendD = parseFloat(cleanValue);
        } else if (name === 'PIDTEMPBED') {
            config.temperature.pidBedEnabled = true;
        } else if (name === 'DEFAULT_bedKp') {
            config.temperature.pidBedP = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_bedKi') {
            config.temperature.pidBedI = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_bedKd') {
            config.temperature.pidBedD = parseFloat(cleanValue);
        }
        
        // === MOTION ===
        else if (name === 'DEFAULT_AXIS_STEPS_PER_UNIT') {
            const steps = this.extractArray(cleanValue);
            if (steps.length >= 4) {
                config.motion.stepsPerMM = {
                    x: parseFloat(steps[0]),
                    y: parseFloat(steps[1]),
                    z: parseFloat(steps[2]),
                    e: parseFloat(steps[3])
                };
            }
        } else if (name === 'DEFAULT_MAX_FEEDRATE') {
            const feedrates = this.extractArray(cleanValue);
            if (feedrates.length >= 4) {
                config.motion.maxFeedrate = {
                    x: parseFloat(feedrates[0]),
                    y: parseFloat(feedrates[1]),
                    z: parseFloat(feedrates[2]),
                    e: parseFloat(feedrates[3])
                };
            }
        } else if (name === 'DEFAULT_MAX_ACCELERATION') {
            const accels = this.extractArray(cleanValue);
            if (accels.length >= 4) {
                config.motion.maxAcceleration = {
                    x: parseFloat(accels[0]),
                    y: parseFloat(accels[1]),
                    z: parseFloat(accels[2]),
                    e: parseFloat(accels[3])
                };
            }
        } else if (name === 'DEFAULT_ACCELERATION') {
            config.motion.defaultAcceleration = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_RETRACT_ACCELERATION') {
            config.motion.retractAcceleration = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_TRAVEL_ACCELERATION') {
            config.motion.travelAcceleration = parseFloat(cleanValue);
        }
        
        // === JERK ===
        else if (name === 'CLASSIC_JERK') {
            config.motion.classicJerk = true;
        } else if (name === 'DEFAULT_XJERK') {
            config.motion.jerkX = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_YJERK') {
            config.motion.jerkY = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_ZJERK') {
            config.motion.jerkZ = parseFloat(cleanValue);
        } else if (name === 'DEFAULT_EJERK') {
            config.motion.jerkE = parseFloat(cleanValue);
        }
        
        // === PROBE (TH3D specific options) ===
        else if (name === 'EZABL_ENABLE' || name === 'EZABL_POINTS') {
            config.probe.type = 'EZABL'; // TH3D's own probe
        } else if (name === 'BLTOUCH') {
            config.probe.type = 'BLTouch';
        } else if (name === 'NOZZLE_TO_PROBE_OFFSET') {
            const offsets = this.extractArray(cleanValue);
            if (offsets.length >= 3) {
                config.probe.offset = {
                    x: parseFloat(offsets[0]),
                    y: parseFloat(offsets[1]),
                    z: parseFloat(offsets[2])
                };
            }
        }
        
        // === BED LEVELING ===
        else if (name === 'AUTO_BED_LEVELING_BILINEAR') {
            config.bedLeveling.type = 'BILINEAR';
        } else if (name === 'AUTO_BED_LEVELING_UBL') {
            config.bedLeveling.type = 'UBL';
        } else if (name === 'GRID_MAX_POINTS_X') {
            config.bedLeveling.gridPointsX = parseInt(cleanValue);
        } else if (name === 'GRID_MAX_POINTS_Y') {
            config.bedLeveling.gridPointsY = parseInt(cleanValue);
        }
        
        // === BED SIZE ===
        else if (name === 'X_BED_SIZE') {
            config.basic.bedSizeX = parseInt(cleanValue);
        } else if (name === 'Y_BED_SIZE') {
            config.basic.bedSizeY = parseInt(cleanValue);
        } else if (name === 'Z_MAX_POS') {
            config.basic.zMaxPos = parseInt(cleanValue);
        }
        
        // === ADVANCED FEATURES ===
        else if (name === 'LIN_ADVANCE') {
            config.advanced.linearAdvance = true;
        } else if (name === 'LIN_ADVANCE_K') {
            config.advanced.linearAdvanceK = parseFloat(cleanValue);
        } else if (name === 'ARC_SUPPORT') {
            config.advanced.arcSupport = true;
        }
        
        // === SAFETY ===
        else if (name === 'THERMAL_PROTECTION_HOTENDS') {
            config.safety.thermalProtectionHotend = true;
        } else if (name === 'THERMAL_PROTECTION_BED') {
            config.safety.thermalProtectionBed = true;
        } else if (name === 'FILAMENT_RUNOUT_SENSOR') {
            config.safety.filamentSensor = true;
        }
        
        // === TH3D SPECIFIC FEATURES ===
        else if (name === 'TH3D_RGB_ENABLE') {
            config.advanced.th3dRGB = true;
        } else if (name === 'POWER_LOSS_RECOVERY') {
            config.advanced.powerLossRecovery = true;
        }
    },
    
    /**
     * Extract string value from quotes
     */
    extractString(value) {
        const match = value.match(/["'](.+?)["']/);
        return match ? match[1] : value;
    },
    
    /**
     * Extract array values from { x, y, z, ... }
     * Handles variable substitution (e.g., CUSTOM_ESTEPS_VALUE)
     */
    extractArray(value) {
        const match = value.match(/\{(.+?)\}/);
        if (!match) return [];
        return match[1].split(',').map(v => {
            v = v.trim();
            // Check if it's a variable reference
            if (this.variables && this.variables[v]) {
                console.log(`🔄 TH3D Parser: Substituting ${v} = ${this.variables[v]}`);
                return this.variables[v];
            }
            return v;
        });
    },
    
    /**
     * Validate configuration and add warnings
     */
    validateConfig(config) {
        // Check for missing critical settings
        if (!config.basic.motherboard) {
            config.warnings.push({
                level: 'error',
                message: 'No motherboard defined (MOTHERBOARD)'
            });
        }
        
        if (!config.motion.stepsPerMM) {
            config.warnings.push({
                level: 'warning',
                message: 'No steps per mm defined (DEFAULT_AXIS_STEPS_PER_UNIT)'
            });
        }
        
        // Check thermal protection
        if (!config.safety.thermalProtectionHotend) {
            config.warnings.push({
                level: 'error',
                message: 'Thermal protection for hotend is DISABLED! This is dangerous!'
            });
        }
    },
    
    /**
     * Alias for parseConfigFile (for compatibility)
     */
    parseConfigurationH(content) {
        return this.parseConfigFile(content);
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.TH3DConfigParser = TH3DConfigParser;
}
