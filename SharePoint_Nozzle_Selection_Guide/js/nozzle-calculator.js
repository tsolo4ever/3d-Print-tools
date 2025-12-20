/* ============================================
   Nozzle Calculator Module
   Calculations for flow rates, print times, costs
   ============================================ */

const NozzleCalculator = {
    
    /**
     * Calculate volumetric flow rate
     * @param {number} nozzleSize - Nozzle diameter in mm
     * @param {number} layerHeight - Layer height in mm
     * @param {number} lineWidth - Line width in mm (defaults to nozzle size)
     * @param {number} printSpeed - Print speed in mm/s
     * @returns {object} Flow rate data
     */
    calculateFlowRate(nozzleSize, layerHeight, lineWidth = null, printSpeed) {
        if (!lineWidth) {
            lineWidth = nozzleSize;
        }
        
        // Volumetric flow = layer height × line width × speed
        const flowRate = layerHeight * lineWidth * printSpeed;
        
        return {
            flowRate: flowRate,
            flowRateRounded: Math.round(flowRate * 100) / 100,
            nozzleSize,
            layerHeight,
            lineWidth,
            printSpeed,
            unit: 'mm³/s'
        };
    },
    
    /**
     * Check if flow rate is compatible with hotend
     * @param {number} flowRate - Calculated flow rate in mm³/s
     * @param {object} hotend - Hotend object from database
     * @returns {object} Compatibility check
     */
    checkFlowCompatibility(flowRate, hotend) {
        if (!hotend || !hotend.maxFlow) {
            return {
                compatible: null,
                message: 'Hotend max flow not specified',
                utilizationPercent: null
            };
        }
        
        const utilization = (flowRate / hotend.maxFlow) * 100;
        const compatible = flowRate <= hotend.maxFlow;
        
        let message;
        if (utilization < 50) {
            message = 'Excellent - Low hotend utilization';
        } else if (utilization < 75) {
            message = 'Good - Moderate hotend utilization';
        } else if (utilization < 90) {
            message = 'Caution - High hotend utilization';
        } else if (utilization <= 100) {
            message = 'Warning - Near maximum capacity';
        } else {
            message = 'Error - Exceeds hotend capacity!';
        }
        
        return {
            compatible,
            utilization: Math.round(utilization),
            utilizationPercent: Math.round(utilization),
            maxFlow: hotend.maxFlow,
            message,
            suggestedSpeed: compatible ? null : Math.floor((hotend.maxFlow / flowRate) * printSpeed)
        };
    },
    
    /**
     * Calculate optimal layer height range for nozzle
     * @param {number} nozzleSize - Nozzle diameter in mm
     * @returns {object} Layer height recommendations
     */
    getLayerHeightRange(nozzleSize) {
        return {
            min: Math.round(nozzleSize * 0.25 * 1000) / 1000,  // 25% of nozzle
            optimal: Math.round(nozzleSize * 0.50 * 1000) / 1000,  // 50% of nozzle
            max: Math.round(nozzleSize * 0.80 * 1000) / 1000,  // 80% of nozzle
            nozzleSize
        };
    },
    
    /**
     * Estimate print time for a part
     * @param {object} params - Part parameters
     * @returns {object} Time estimate
     */
    estimatePrintTime(params) {
        const {
            length,      // mm
            width,       // mm
            height,      // mm
            nozzleSize,
            layerHeight,
            infillPercent = 20,
            wallCount = 3,
            topBottomLayers = 4,
            printSpeed = 50,  // mm/s
            travelSpeed = 150,  // mm/s
            supportNeeded = false
        } = params;
        
        const layers = Math.ceil(height / layerHeight);
        const perimeterLength = 2 * (length + width);
        const wallWidth = nozzleSize * wallCount;
        const floorArea = length * width;
        const infillArea = floorArea - (perimeterLength * wallWidth);
        
        // Estimate extrusion time per layer
        const perimeterTime = (perimeterLength * wallCount) / printSpeed;
        const infillTime = (infillArea * infillPercent / 100) / (printSpeed * 1.5); // Infill slightly faster
        const solidFillTime = floorArea / printSpeed;
        
        // Time per layer type
        const normalLayerTime = perimeterTime + infillTime;
        const solidLayerTime = perimeterTime + solidFillTime;
        
        // Calculate total time
        const normalLayers = layers - (topBottomLayers * 2);
        const totalLayerTime = (normalLayers * normalLayerTime) + (topBottomLayers * 2 * solidLayerTime);
        
        // Add travel time estimate (roughly 10-15% of print time)
        const travelTime = totalLayerTime * 0.12;
        
        // Add support time if needed (roughly 20-30% additional)
        const supportTime = supportNeeded ? totalLayerTime * 0.25 : 0;
        
        const totalSeconds = totalLayerTime + travelTime + supportTime;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;
        
        return {
            seconds: Math.round(totalSeconds),
            minutes: Math.round(totalMinutes),
            hours: Math.round(totalHours * 100) / 100,
            formatted: this.formatTime(totalSeconds),
            breakdown: {
                layers,
                layerTime: Math.round(normalLayerTime),
                travelTime: Math.round(travelTime),
                supportTime: Math.round(supportTime)
            }
        };
    },
    
    /**
     * Estimate material usage
     * @param {object} params - Part parameters
     * @returns {object} Material estimate
     */
    estimateMaterial(params) {
        const {
            length,
            width,
            height,
            nozzleSize,
            layerHeight,
            infillPercent = 20,
            wallCount = 3,
            topBottomLayers = 4,
            supportNeeded = false,
            materialDensity = 1.24  // PLA default
        } = params;
        
        const volume = length * width * height;
        const wallVolume = 2 * (length + width) * height * nozzleSize * wallCount;
        const topBottomVolume = length * width * layerHeight * topBottomLayers * 2;
        const infillVolume = (volume - wallVolume - topBottomVolume) * (infillPercent / 100);
        
        const totalVolume = wallVolume + topBottomVolume + infillVolume;
        const supportVolume = supportNeeded ? totalVolume * 0.15 : 0;
        
        const totalVolumeWithSupport = totalVolume + supportVolume;
        const weightGrams = (totalVolumeWithSupport / 1000) * materialDensity;  // Convert mm³ to cm³
        
        return {
            volume: Math.round(totalVolume),
            volumeWithSupport: Math.round(totalVolumeWithSupport),
            weight: Math.round(weightGrams * 100) / 100,
            weightGrams: Math.round(weightGrams * 100) / 100,
            supportWeight: Math.round((supportVolume / 1000) * materialDensity * 100) / 100
        };
    },
    
    /**
     * Calculate print cost
     * @param {number} weightGrams - Material weight in grams
     * @param {number} pricePerKg - Material price per kilogram
     * @param {number} printTimeHours - Print time in hours
     * @param {number} electricityCostPerKwh - Electricity cost per kWh
     * @param {number} printerWattage - Printer power consumption in watts
     * @returns {object} Cost breakdown
     */
    calculateCost(weightGrams, pricePerKg, printTimeHours, electricityCostPerKwh = 0.12, printerWattage = 150) {
        const materialCost = (weightGrams / 1000) * pricePerKg;
        const energyKwh = (printerWattage / 1000) * printTimeHours;
        const energyCost = energyKwh * electricityCostPerKwh;
        const totalCost = materialCost + energyCost;
        
        return {
            material: Math.round(materialCost * 100) / 100,
            energy: Math.round(energyCost * 100) / 100,
            total: Math.round(totalCost * 100) / 100,
            energyKwh: Math.round(energyKwh * 100) / 100
        };
    },
    
    /**
     * Compare multiple nozzle sizes
     * @param {object} partParams - Part parameters
     * @param {array} nozzleSizes - Array of nozzle sizes to compare
     * @param {number} pricePerKg - Material price
     * @returns {array} Comparison results
     */
    compareNozzles(partParams, nozzleSizes = [0.4, 0.6, 0.8, 1.0], pricePerKg = 20) {
        return nozzleSizes.map(nozzleSize => {
            const layerHeights = this.getLayerHeightRange(nozzleSize);
            const layerHeight = layerHeights.optimal;
            
            const params = {
                ...partParams,
                nozzleSize,
                layerHeight
            };
            
            const time = this.estimatePrintTime(params);
            const material = this.estimateMaterial(params);
            const cost = this.calculateCost(material.weightGrams, pricePerKg, time.hours);
            
            return {
                nozzleSize,
                layerHeight,
                time,
                material,
                cost,
                totalCost: cost.total
            };
        });
    },
    
    /**
     * Calculate retraction settings based on extruder type
     * @param {number} nozzleSize - Nozzle diameter in mm
     * @param {string} extruderType - 'direct' or 'bowden'
     * @param {object} hotend - Hotend object (optional)
     * @returns {object} Retraction recommendations
     */
    calculateRetraction(nozzleSize, extruderType, hotend = null) {
        let distance, speed;
        
        if (extruderType === 'direct') {
            // Direct drive retraction scales with nozzle size
            distance = 0.5 + (nozzleSize * 2);  // 0.5-2.5mm typical range
            speed = 45 - (nozzleSize * 10);     // Slower for larger nozzles
            
            // Adjust for hotend if provided
            if (hotend && hotend.retraction && hotend.retraction.direct) {
                distance = (hotend.retraction.direct[0] + hotend.retraction.direct[1]) / 2;
            }
        } else {
            // Bowden retraction
            distance = 4 + (nozzleSize * 2);    // 4-7mm typical range
            speed = 45 - (nozzleSize * 5);      // Slower for larger nozzles
            
            if (hotend && hotend.retraction && hotend.retraction.bowden) {
                distance = (hotend.retraction.bowden[0] + hotend.retraction.bowden[1]) / 2;
            }
        }
        
        return {
            distance: Math.round(distance * 10) / 10,
            speed: Math.round(speed),
            deretractSpeed: 40,  // Usually consistent
            extruderType,
            nozzleSize
        };
    },
    
    /**
     * Format time in human-readable format
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    },
    
    /**
     * Calculate strength difference between nozzles (based on layer adhesion)
     * @param {number} nozzleSize - Nozzle diameter in mm
     * @param {number} baselineNozzle - Baseline nozzle size (default 0.4mm)
     * @returns {object} Strength comparison
     */
    calculateStrength(nozzleSize, baselineNozzle = 0.4) {
        // Larger nozzles create stronger parts due to better layer adhesion
        // Approximate formula based on testing
        const ratio = nozzleSize / baselineNozzle;
        const strengthIncrease = (ratio - 1) * 0.15; // ~15% per doubling
        const strengthPercent = 100 + (strengthIncrease * 100);
        
        return {
            nozzleSize,
            baselineNozzle,
            strengthPercent: Math.round(strengthPercent),
            strengthRatio: Math.round(ratio * 100) / 100,
            message: strengthPercent > 100 ? 
                `${Math.round(strengthPercent - 100)}% stronger than ${baselineNozzle}mm` :
                `${Math.round(100 - strengthPercent)}% weaker than ${baselineNozzle}mm`
        };
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.NozzleCalculator = NozzleCalculator;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NozzleCalculator;
}
