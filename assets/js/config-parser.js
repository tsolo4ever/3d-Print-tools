/* ============================================
   Configuration.h Parser
   Parse Marlin Configuration.h files
   ============================================ */

const ConfigParser = {
    
    /**
     * Parse Configuration.h file content
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
        
        const lines = content.split('\n');
        
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
     * Parse a single #define line
     */
    parseDefineLine(line, config) {
        // Extract the define name and value
        const match = line.match(/#define\s+(\w+)(?:\s+(.+))?/);
        if (!match) return;
        
        const [, name, value] = match;
        const cleanValue = value ? value.split('//')[0].trim() : true;
        
        // Categorize by config section
        
        // === BASIC INFO ===
        if (name === 'CUSTOM_MACHINE_NAME') {
            config.basic.machineName = this.extractString(cleanValue);
        } else if (name === 'MACHINE_UUID') {
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
        } else if (name === 'E1_DRIVER_TYPE') {
            config.hardware.driverE1 = cleanValue;
        }
        
        // === THERMISTORS ===
        else if (name === 'TEMP_SENSOR_0') {
            config.hardware.thermistorHotend = parseInt(cleanValue);
        } else if (name === 'TEMP_SENSOR_BED') {
            config.hardware.thermistorBed = parseInt(cleanValue);
        } else if (name === 'TEMP_SENSOR_CHAMBER') {
            config.hardware.thermistorChamber = parseInt(cleanValue);
        }
        
        // === ENDSTOPS ===
        else if (name === 'USE_XMIN_PLUG') {
            config.hardware.endstopXMin = true;
        } else if (name === 'USE_XMAX_PLUG') {
            config.hardware.endstopXMax = true;
        } else if (name === 'USE_YMIN_PLUG') {
            config.hardware.endstopYMin = true;
        } else if (name === 'USE_YMAX_PLUG') {
            config.hardware.endstopYMax = true;
        } else if (name === 'USE_ZMIN_PLUG') {
            config.hardware.endstopZMin = true;
        } else if (name === 'USE_ZMAX_PLUG') {
            config.hardware.endstopZMax = true;
        }
        
        // === TEMPERATURE LIMITS ===
        else if (name === 'HEATER_0_MINTEMP') {
            config.temperature.hotendMinTemp = parseInt(cleanValue);
        } else if (name === 'HEATER_0_MAXTEMP') {
            config.temperature.hotendMaxTemp = parseInt(cleanValue);
        } else if (name === 'BED_MINTEMP') {
            config.temperature.bedMinTemp = parseInt(cleanValue);
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
        
        // === JERK / JUNCTION DEVIATION ===
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
        } else if (name === 'JUNCTION_DEVIATION_MM') {
            config.motion.junctionDeviation = parseFloat(cleanValue);
        }
        
        // === S-CURVE ===
        else if (name === 'S_CURVE_ACCELERATION') {
            config.motion.sCurveAcceleration = true;
        }
        
        // === PROBE ===
        else if (name === 'BLTOUCH') {
            config.probe.type = 'BLTouch';
        } else if (name === 'FIX_MOUNTED_PROBE') {
            config.probe.type = 'Fixed';
        } else if (name === 'NOZZLE_AS_PROBE') {
            config.probe.type = 'Nozzle';
        } else if (name === 'NOZZLE_TO_PROBE_OFFSET') {
            const offsets = this.extractArray(cleanValue);
            if (offsets.length >= 3) {
                config.probe.offset = {
                    x: parseFloat(offsets[0]),
                    y: parseFloat(offsets[1]),
                    z: parseFloat(offsets[2])
                };
            }
        } else if (name === 'Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN') {
            config.probe.usesZMinPin = true;
        }
        
        // === BED LEVELING ===
        else if (name === 'AUTO_BED_LEVELING_3POINT') {
            config.bedLeveling.type = '3POINT';
        } else if (name === 'AUTO_BED_LEVELING_LINEAR') {
            config.bedLeveling.type = 'LINEAR';
        } else if (name === 'AUTO_BED_LEVELING_BILINEAR') {
            config.bedLeveling.type = 'BILINEAR';
        } else if (name === 'AUTO_BED_LEVELING_UBL') {
            config.bedLeveling.type = 'UBL';
        } else if (name === 'MESH_BED_LEVELING') {
            config.bedLeveling.type = 'MESH';
        } else if (name === 'GRID_MAX_POINTS_X') {
            config.bedLeveling.gridPointsX = parseInt(cleanValue);
        } else if (name === 'GRID_MAX_POINTS_Y') {
            config.bedLeveling.gridPointsY = parseInt(cleanValue);
        } else if (name === 'DEFAULT_LEVELING_FADE_HEIGHT') {
            config.bedLeveling.fadeHeight = parseFloat(cleanValue);
        } else if (name === 'RESTORE_LEVELING_AFTER_G28') {
            config.bedLeveling.restoreAfterG28 = true;
        }
        
        // === BED SIZE ===
        else if (name === 'X_BED_SIZE') {
            config.basic.bedSizeX = parseInt(cleanValue);
        } else if (name === 'Y_BED_SIZE') {
            config.basic.bedSizeY = parseInt(cleanValue);
        } else if (name === 'X_MAX_POS') {
            config.basic.xMaxPos = parseInt(cleanValue);
        } else if (name === 'Y_MAX_POS') {
            config.basic.yMaxPos = parseInt(cleanValue);
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
        } else if (name === 'NOZZLE_PARK_FEATURE') {
            config.advanced.nozzlePark = true;
        } else if (name === 'POWER_LOSS_RECOVERY') {
            config.advanced.powerLossRecovery = true;
        } else if (name === 'BABYSTEPPING') {
            config.advanced.babystepping = true;
        }
        
        // === SAFETY ===
        else if (name === 'THERMAL_PROTECTION_HOTENDS') {
            config.safety.thermalProtectionHotend = true;
        } else if (name === 'THERMAL_PROTECTION_BED') {
            config.safety.thermalProtectionBed = true;
        } else if (name === 'THERMAL_PROTECTION_CHAMBER') {
            config.safety.thermalProtectionChamber = true;
        } else if (name === 'FILAMENT_RUNOUT_SENSOR') {
            config.safety.filamentSensor = true;
        }
        
        // === DISPLAY ===
        else if (name.includes('DISPLAY') || name.includes('LCD') || name.includes('DGUS') || name.includes('TFT')) {
            if (cleanValue === true || cleanValue === '1') {
                config.hardware.displayType = name;
            }
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
     */
    extractArray(value) {
        const match = value.match(/\{(.+?)\}/);
        if (!match) return [];
        return match[1].split(',').map(v => v.trim());
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
        
        // Check for suspicious values
        if (config.motion.stepsPerMM) {
            if (config.motion.stepsPerMM.e < 50 || config.motion.stepsPerMM.e > 1000) {
                config.warnings.push({
                    level: 'warning',
                    message: `E-steps value (${config.motion.stepsPerMM.e}) seems unusual. Typical range: 50-1000`
                });
            }
        }
        
        // Check PID values
        if (config.temperature.pidHotendEnabled) {
            if (!config.temperature.pidHotendP || !config.temperature.pidHotendI || !config.temperature.pidHotendD) {
                config.warnings.push({
                    level: 'warning',
                    message: 'PID enabled but values not fully defined'
                });
            }
        }
        
        // Check probe without bed leveling
        if (config.probe.type && !config.bedLeveling.type) {
            config.warnings.push({
                level: 'info',
                message: 'Probe detected but no bed leveling enabled'
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
     * Parse from file upload
     * @param {File} file - JavaScript File object
     * @returns {Promise<object>} Parsed configuration
     */
    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const config = this.parseConfigFile(content);
                    resolve(config);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ConfigParser = ConfigParser;
}
