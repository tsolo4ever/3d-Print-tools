/**
 * For directions on how to use this firmware visit http://uf2.th3dstudio.com and click on your printer/board link
 * NO IMPLIED SUPPORT OR WARRANTY IS PROVIDED WITH THIS FIRMWARE AND IS PROVIDED AS-IS
 */
#pragma once
#define CONFIGURATION_H_VERSION 02010204

#define UNIFIED_VERSION "TH3D UFW 2.97a"
#define STRING_DISTRIBUTION_DATE "2025-08-26"

//===========================================================================
//============================ TH3D Configuration ===========================
//===========================================================================

// ONLY UNCOMMENT ONE PRINTER AT A TIME!!! IF YOU HAVE MULTIPLE MACHINES FLASH THEM ONE AT A TIME.
// UNCOMMENT MEANS REMOVING THE // IN FRONT OF A #define XXXXXX LINE.
// DO NOT USE AUTO BUILD MARLIN WITH OUR FIRMWARE - UNINSTALL IT FROM VSCODE BEFORE USING IF YOU HAVE ISSUES COMPILING.

// CPU Notes ----------------------------------------------------------------
// There is also a V3.0.1 variant of this board with the STM32F4 series CPU. If you have this CPU on your board uncomment the below line and
// in the platformio.ini change the default_envs from STM32G0B1RE_btt to STM32F401RC_btt.
//#define E3MINIV3_F4CPU

// Fan Header Notes ---------------------------------------------------------
// Our firmware has automatic control of the fans for this board. If you are using any of these fans, connect them to the correct headers as outlined below.
//
// FAN0 is your layer fan
// FAN1 is the controller fan. This means it will come on/off when the motors and/or any heaters are on and turn off 1 minute after all are shut off/disabled.
// FAN2 is the hotend fan. This means it will come on/off when the hotend is above/below 50C.

// Ender 2 Pro Notes --------------------------------------------------------
// The Ender 2 Pro requires Motor Adapter Cable from TH3D due to stock connections using 5 pins: https://www.th3dstudio.com/product/ender-2-pro-stepper-motor-adapter-cable-4-pack/

//===========================================================================
// ***********   CREALITY PRINTERS W/SKR E3 MINI V3 BOARD    ****************
//===========================================================================

//#define ENDER2_PRO
//#define ENDER3
//#define ENDER3_PRO
//#define ENDER3_MAX
//#define ENDER5
//#define ENDER5_PRO
#define ENDER5_PLUS

//#define CR10
//#define CR10_MINI
//#define CR10_S4
//#define CR10_S5
// NOTE: It is HIGHLY recommended to use an external bed MOSFET with the CR-10 series machines due to the high load the beds have.
// While these boards work on 12V machines, they are designed for 24V printers that pull less current (specifically on the bed).
// If you need a MOSFET, we carry one here: https://www.th3dstudio.com/product/high-amp-12v-24v-mosfet-heated-bed-or-hotend/

// EZOut Filament Sensor
// This board only works with this version of our sensor kit: https://www.th3dstudio.com/product/ezout-v3-filament-sensor/
// Connect the EZOut sensor kit to the "E-Stop" port and uncomment the below line to enable the filament sensor.
// Also works with the stock Ender 3 MAX sensor.
//#define EZOUT_ENABLE

// Creality CR-10S Series Filament Sensor
// Connect the stock sensor to the "E-Stop" port and uncomment the below line to enable the filament sensor.
//#define CR10S_STOCKFILAMENTSENSOR

// BTT SFS V1.0 - Smart Filament Sensor - PROVIDED AS-IS - NOT SUPPORTED BY TH3D
// Connect the sensor to the "E-Stop" port and uncomment the below line to enable the filament sensor.
// BTT recommends a sensing length of 7mm for their sensor. If you are getting false triggers try changing the BTT_SFS_DISTANCE_MM value until you find one that works
// with your BTT SFS sensor. The official BTT docs are here: https://github.com/bigtreetech/smart-filament-detection-module
//#define BTT_SFS_FILAMENT_SENSOR
#define BTT_SFS_DISTANCE_MM 7

// EZABL Probe Mounts - Uncomment the mount you are using for your EZABL to enable EZABL support in the firmware.
//#define CR10_OEM
//#define ENDER2_PRO_OEM
//#define ENDER2_PRO_OEM_MICRO
//#define ENDER3_OEM
//#define ENDER3_V2_OEM
//#define ENDER3_MAX_OEM
//#define ENDER5_OEM
#define ENDER5_PLUS_OEM
//#define SPRITE_EXTRUDER_18MM_MOUNT // Mounts to the stock CRTouch bracket
//#define CUSTOM_PROBE

// EZABL on Servo Header
// If your EZABL is not triggering on the normal Z-Stop header uncomment the below line and then connect the EZABL across the PC14 and GND pins.
// These pins are located on the Z-PROBE header and are not filtered. The filtering BTT uses on their endstops sometimes does not work with our EZABL kits.
//#define EZABL_ON_SERVO_HEADER

// Ender 5 - Leadscrew Setting
// If you have the new Ender 5/5 Pro Model that has the new 800steps/mm Z leadscrew uncomment the below option to set the correct steps/mm
#define ENDER5_NEW_LEADSCREW

// Ender 5 Plus ONLY ABL Settings -------------------------------------------
// By default the Ender 5 Plus comes with a BL Touch. Enabling the ENDER5_PLUS_EZABL or ENDER5_PLUS_NOABL will override the BL Touch setting
// If you are using the stock BL Touch with a non-stock mount enable the CUSTOM_PROBE line above and enter the offsets below for the new mount.
#define ENDER5_PLUS_EZABL
//#define ENDER5_PLUS_NOABL

// EZNeo Settings -----------------------------------------------------------
// If you are using an EZNeo strip on your printer, uncomment the line for what strip you are using.
//#define EZNEO_220

//===========================================================================
// *************************  END PRINTER SECTION   *************************
//===========================================================================

/**
 * EZABL Advanced Settings - EZABL_POINTS & EZABL_PROBE_EDGE are also used for other probes
 */

// Probing Grid Points - If you want more or less EZABL probe points change the number below, use odd numbers. Total points is # times #.
#define EZABL_POINTS 9

// Probe Edge - How far from the edge of the bed to probe from. Use 30 if using binder clips. This also sets the edge inset value for MANUAL_MESH_LEVELING.
#define EZABL_PROBE_EDGE 15

// CHOOSE ABL_UBL OR  DEFAULT IS ABL_BILINEAR
#define ABL_UBL

// Fast Probing - Works with most machines and all EZABL sensors (8mm/s)
#define EZABL_FASTPROBE

// Superfast Probing - Works with Pro/NG EZABL Probes (15mm/s) & BLTouch/CRTouch (10mm/s)
//#define EZABL_SUPERFASTPROBE

// Heaters on During Probing - Heaters will stay on during probing - May reduce accuracy do not use unless told to by support
//#define HEATERS_ON_DURING_PROBING

// Probing Steppers Off - This will cycle the XYE stepper motors during probing to reduce interference from them. When using this do NOT touch the X or Y during probing as they will not be locked.
//#define PROBING_STEPPERS_OFF

// Slow Down Moves - Does your machine make weird noises/vibrations when it is probing the mesh? Enable this to slow down the speed between probe points.
//#define SLOWER_PROBE_MOVES

// Grid Extrapolation - This will use the mesh data to make assumptions of the bed outside the probe area. Disable if you are getting incorrect results on the edges of the bed.
#define EXTRAPOLATE_BEYOND_GRID

/**
 * BLTouch/CRTouch
 * 
 * If you want to use the BLTouch/CRTouch uncomment the BLTOUCH line below.
 * You also need then enter in your sensor offsets below in the CUSTOM PROBE section.
 * 
 * If you are using the 5 pin header for all the BL Touch connections, uncomment BLTOUCH_ON_5PIN line - THIS IS THE RECOMMENDED CONNECTION METHOD ON THIS BOARD. See BLTOUCH_ON_5PIN Wiring.png for connection info.
 *
 * If you need to change your SERVO control pin you can change that with the SERVO0_PIN Line below. Most people do NOT need to change/set this.
 */
#define BLTOUCH
#define BLTOUCH_ON_5PIN
//#define SERVO0_PIN PA1

/**
 * Custom Probe Offset - EZABL/BLTouch/CRTouch
 * 
 * If you have a probe mount that is not pre-setup in the firmware then uncomment
 * the CUSTOM_PROBE option (or BLTOUCH if using one) above and enter your probe offsets below
 */
#if ANY(CUSTOM_PROBE, BLTOUCH)
  /**
  * Z Probe to nozzle (X,Y) offset, relative to (0, 0).
  *
  * In the following example the X and Y offsets are both positive:
  *
  *   #define NOZZLE_TO_PROBE_OFFSET { 10, 10, 0 }
  *
  *     +-- BACK ---+
  *     |           |
  *   L |    (+) P  | R <-- probe (10,10)
  *   E |           | I
  *   F | (-) N (+) | G <-- nozzle (0,0)
  *   T |           | H
  *     |    (-)    | T
  *     |           |
  *     O-- FRONT --+
  *   (0,0)
  *
  * Specify a Probe position as { X, Y, Z }
  * Do NOT enter an number for the Z position in here. Store your offset in EEPROM.
  * 
  * When is the offset POSITIVE?
  * If the probe is right of the nozzle the offset on X is POSITIVE
  * If the probe is behind of the nozzle the offset on Y is POSITIVE
  * 
  * When is the offset NEGATIVE?
  * If the probe is left of the nozzle the offset on X is NEGATIVE
  * If the probe is in front of the nozzle the offset on Y is NEGATIVE
  */
  //#define NOZZLE_TO_PROBE_OFFSET { 10, 10, 0 }
#endif


//===========================================================================
//******************** Extra Features and Tweaks ****************************
//===========================================================================

// EXTRUDER SETTINGS -------------------------------
// Use to set custom esteps and/or reverse your E Motor direction if you are installing an extruder that needs the direction reversed.
// If you reversed the wiring on your E motor already (like the Bondtech Guide says to do) then you do not need to reverse it in the firmware here.
//
// Example EStep Values For Common Extuders: 
// TH3D Aluminum Extruder ------  95 ESteps
// Micro Swiss DD Extruder ----- 130 ESteps
// LGX/LGX Lite/MS NG Extruder - 400 ESteps
// TH3D Tough Extruder V2 ------ 407 ESteps
// TH3D Tough Extruder V1 ------ 410 ESteps
// Bondtech BMG Extruder ------- 415 ESteps
// Creality Sprite Extruder ---- 425 ESteps
// LDO Orbiter/Sherpa Mini ----- 690 ESteps
//
// If you want to change the Esteps for your printer you can uncomment the below line and set CUSTOM_ESTEPS_VALUE to what you want - USE WHOLE NUMBERS ONLY
// This option sets the esteps from the CUSTOM_ESTEPS_VALUE line below.
// If you need to reverse the e motor direction also enabled the REVERSE_E_MOTOR_DIRECTION option.
#define CUSTOM_ESTEPS
#define CUSTOM_ESTEPS_VALUE 424.09
//#define REVERSE_E_MOTOR_DIRECTION

// FILAMENT SENSOR UNLOAD SETTINGS -----------------
// If you have a filament sensor that is physically mounted to the machine you can enable MOUNTED_FILAMENT_SENSOR to set the unload length to 5mm to prevent filament from backing up in the sensor by uncommenting MOUNTED_FILAMENT_SENSOR 
//#define MOUNTED_FILAMENT_SENSOR

// If you have a direct drive machine with a filament sensor uncomment DIRECT_DRIVE_PRINTER to decrease the unload length from 100mm to 20mm
#define DIRECT_DRIVE_PRINTER

// THERMISTOR SETTINGS -----------------------------

// If you are using an E3D V6 Hotend (or Hemera) with their cartridge thermistor (not glass version) uncomment the below line.
//#define V6_HOTEND

// If you are using a Tough Hotend from TH3D or any thermistors TH3D sells for your hotend uncomment the below line.
//#define TH3D_HOTEND_THERMISTOR

// If you are using a known hotend thermistor value uncomment the below 2 lines and enter the thermistor number replacing the X after the #define KNOWN_HOTEND_THERMISTOR_VALUE
#define KNOWN_HOTEND_THERMISTOR
#define KNOWN_HOTEND_THERMISTOR_VALUE 1

// If you have a hotend and thermistor capable of over 290C you can set the max temp value below.
// Setting this higher than 290C on a stock or traditional thermistor will damage it. Refer to your thermistor documentation to see what max temp is.
#define HIGH_TEMP_THERMISTOR
#define HIGH_TEMP_THERMISTOR_TEMP 305

// BED THERMISTOR SETTINGS -------------------------

// If you are using a thermistor TH3D sells for your bed uncomment the below line.
//#define TH3D_BED_THERMISTOR

// If you are using a Keenovo with SSR and the Keenovo temperature sensor uncomment the below line.
//#define KEENOVO_TEMPSENSOR

// If you are using a known bed thermistor value uncomment the below 2 lines and enter the thermistor number replacing the X after the #define KNOWN_BED_THERMISTOR_VALUE
//#define KNOWN_BED_THERMISTOR
//#define KNOWN_BED_THERMISTOR_VALUE X

// If you are using an AC bed with a standalone controller (Keenovo) uncomment the below line to disable the heated bed in the firmware
//#define AC_BED

// MISC --------------------------------------------

// LCD Knob Direction
// Turning your LCD knob clockwise should move DOWN in the menus/make values increase and counter-clockwise should move UP in the menus/make values decrease
// If yours is behaving opposite then enable the REVERSE_KNOB_DIRECTION option below
//#define REVERSE_KNOB_DIRECTION

// If you have a 5015 fan that whines when under 100% speed uncomment the below line.
//#define FAN_FIX

// Use your own printer name - Uncomment both lines
#define CUSTOM_PRINTER_NAME
#define USER_PRINTER_NAME "POS Unit"

// If your printer is homing to the endstops hard uncomment this to change the homing speed/divisor to make it less aggressive.
//#define SLOWER_HOMING

// Axis Direction Settings
// If you need to reverse the direction of a motor uncomment the below option for that axis.
// E motor settings are below in the Extruder Settings Section
//#define REVERSE_X_MOTOR
//#define REVERSE_Y_MOTOR
//#define REVERSE_Z_MOTOR

// ENDER XTENDER KIT SETTINGS ----------------------

// Ender Xtender Kits for Ender 3/3 Pro
//#define XTENDER_E3_300    //300x300x250 Size
//#define XTENDER_E3_300XL  //300x300x400 Size
//#define XTENDER_E3_400    //400x400x250 Size
//#define XTENDER_E3_400Z   //235x235x400 Size
//#define XTENDER_E3_400XL  //400x400x500 Size
//#define XTENDER_E3_500Z   //235x235x500 Size

// Ender Xtender Kits for Ender 5/5 Pro
//#define XTENDER_E5_5XL    //235x235x500 Size

// Ender Xtender Kits for Ender 5 Plus
//#define XTENDER_E5P_400   //510x510x400 Size
//#define XTENDER_E5P_500   //510x510x500 Size

// BAUDRATE ADJUSTMENT -----------------------------
// This firmware uses a 115200 default baud rate as that is the most reliable and compatible. If you want to use 250000 uncomment the below line.
#define FASTER_BAUDRATE

// BTT TOUCH SCREEN --------------------------------
// If you are using the BTT Touch Screen uncomment the below line to enable additional options per the BTT docs they recommend for use with their LCD
#define BTT_TOUCH_SCREEN

//===========================================================================
//*************************** Advanced Features *****************************
//===========================================================================

/**
 * EEPROM on SD Card
 * 
 * NOTE: THIS TAKES UP EXTRA SPACE ON THE CPU SO IF YOUR COMPILE FAILS DISABLE SOME OTHER OPTIONS IN THE FIRMWARE.
 * If your board has issues saving the EEPROM that could be due to a defective EEPROM chip. This will make an EEPROM.DAT file
 * You can use a SD card in the printer slot to save the EEPROM to that instead. Just uncomment the below line
 * and then leave an SD card in the printer at all times. If you have to take it out, power off the printer before removing
 * then put your GCode files on the SD card, insert the card again, and then power the printer up.
 */
//#define SDCARD_EEPROM_EMULATION

/**
 * Input Shaping
 * 
 * See here on how to use Input Shaping: https://www.th3dstudio.com/marlin-input-shaping-calculator/
 * 
 * Below are the frequency and damping settings for each axis.
 * Damping must have f at the end of the number and the range is 0.00-1.00.
 */
#define INPUT_SHAPING

// X Axis Settings
#define INPUT_SHAPING_FREQ_X 40
#define INPUT_SHAPING_DAMPING_X 0.15f
// Y Axis Settings
#define INPUT_SHAPING_FREQ_Y 40
#define INPUT_SHAPING_DAMPING_Y 0.15f

/**
 * Bed and Z Height Adjustments
 * 
 * If you need to make changes to your X, Y, and/or Z size on your printer for whatever reason you can uncomment the custom size/height line
 * for whatever axis you need to make changes to and then replace the XXX with the new size in millimeters.
 */
//#define CUSTOM_X_BED_SIZE XXX
//#define CUSTOM_Y_BED_SIZE XXX
//#define CUSTOM_Z_HEIGHT XXX

/**
 * Home Offset Adjustment
 * 
 * If you need to adjust your XY home offsets from defaults then you can uncomment the HOME_ADJUST line below and enter your
 * custom XY offsets. This is provided for convenience and is unsupported with included product support.
 * 
 * How to use - measure (home XY then jog using the LCD 1mm at a time) the X and Y distance the nozzle is off
 * the build plate and then put those as NEGATIVE values below on the X_HOME_LOCATION and Y_HOME_LOCATION values
 * Positive values will NOT work (move your endstops to fix a positive offset or change your bed size above).
 */
//#define HOME_ADJUST
#define X_HOME_LOCATION -10
#define Y_HOME_LOCATION -10

/**
 * PID Bed Temperature Control
 * 
 * If you want PID Bed Temperature control enable the below line. You will need to tune it for your machine.
 * See the PID Bed setup guide here: https://tickets.th3dstudio.com/help-guides/article/p-i-d-bed-calibration-guide
 */
#define ENABLE_PIDBED

/**
 * Fine Babystepping
 * 
 * Enabling the below line will set the babystep resolution from 0.025mm to 0.010mm for finer control.
 */
#define FINE_BABYSTEPPING

/**
 * Linear Advance
 * 
 * See here on how to use Linear Advance: http://marlinfw.org/docs/features/lin_advance.html
 * 
 * Change the K Value with the LINEAR_ADVANCE_K line below or use M900 KX.XX in your starting code (recommended).
 */
#define LINEAR_ADVANCE
#define LINEAR_ADVANCE_K .1

/**
 * Manual Mesh Leveling 
 *
 * If you want to use manual mesh leveling you can enable the below option. 
 * This is for generating a MANUAL mesh WITHOUT a probe. To change the mesh inset value change the EZABL_PROBE_EDGE setting above.
 * 
 * Mesh Bed Leveling Documentation: http://marlinfw.org/docs/gcode/G029-mbl.html 
 * 
 * NOTE: If you want to automate the leveling process our EZABL kits do this for you. Check them out here: http://EZABL.TH3DStudio.com
 */
//#define MANUAL_MESH_LEVELING

/**
 * Bed Skew Compensation
 *
 * This feature corrects for misalignment in the XYZ axes.
 *
 * Take the following steps to get the bed skew in the XY plane:
 *  1. Print a test square (e.g., https://www.thingiverse.com/thing:2563185)
 *  2. For XY_DIAG_AC measure the diagonal A to C
 *  3. For XY_DIAG_BD measure the diagonal B to D
 *  4. For XY_SIDE_AD measure the edge A to D
 *
 * Marlin automatically computes skew factors from these measurements.
 * Skew factors may also be computed and set manually:
 *
 *  - Compute AB     : SQRT(2*AC*AC+2*BD*BD-4*AD*AD)/2
 *  - XY_SKEW_FACTOR : TAN(PI/2-ACOS((AC*AC-AB*AB-AD*AD)/(2*AB*AD)))
 *
 * If desired, follow the same procedure for XZ and YZ.
 * Use these diagrams for reference:
 *
 *    Y                     Z                     Z
 *    ^     B-------C       ^     B-------C       ^     B-------C
 *    |    /       /        |    /       /        |    /       /
 *    |   /       /         |   /       /         |   /       /
 *    |  A-------D          |  A-------D          |  A-------D
 *    +-------------->X     +-------------->X     +-------------->Y
 *     XY_SKEW_FACTOR        XZ_SKEW_FACTOR        YZ_SKEW_FACTOR
 */
//#define SKEW_CORRECTION

#if ENABLED(SKEW_CORRECTION)
  // Input all length measurements here:
  #define XY_DIAG_AC 282.8427124746
  #define XY_DIAG_BD 282.8427124746
  #define XY_SIDE_AD 200

  // Or, set the XY skew factor directly:
  //#define XY_SKEW_FACTOR 0.0

  //#define SKEW_CORRECTION_FOR_Z
  #if ENABLED(SKEW_CORRECTION_FOR_Z)
    #define XZ_DIAG_AC 282.8427124746
    #define XZ_DIAG_BD 282.8427124746
    #define YZ_DIAG_AC 282.8427124746
    #define YZ_DIAG_BD 282.8427124746
    #define YZ_SIDE_AD 200

    // Or, set the Z skew factors directly:
    //#define XZ_SKEW_FACTOR 0.0
    //#define YZ_SKEW_FACTOR 0.0
  #endif

  // Enable this option for M852 to set skew at runtime
  //#define SKEW_CORRECTION_GCODE
#endif

/**
 * Power Loss Recovery
 * 
 * Continue after Power-Loss feature will store the current state to the SD Card at the start of each layer
 * during SD printing. If this is found at bootup it will ask you if you want to resume the print.
 * NOTE: This feature causes excessive wear on your SD card. This feature is not supported by TH3D Support.
 */
//#define POWER_LOSS_RECOVERY

/**
 * ARC Support Override
 *
 * Arc support is enabled by default on all builds but this takes up extra space.
 * If you get compile errors due to the size being too large when enabling other options, then disable ARC_SUPPORT
 * by uncommenting the DISABLE_ARC_SUPPORT line below.
 */ 
//#define DISABLE_ARC_SUPPORT

/**
 * SD Support Override
 * 
 * If you need to free up flash and ram space to enable more features you can disable the SD card slot on the board.
 * Only do this if you are only printing to the printer over USB from something like Octoprint/EZPi or your PC.
 */
//#define NO_SDCARD

//===========================================================================
// **********************  END CONFIGURATION SETTINGS   *********************
//===========================================================================

/**
 * ****************************DO NOT TOUCH ANYTHING BELOW THIS COMMENT**************************
 * Core machine settings are below. Do NOT modify these unless you understand what you are doing.
 */

//BLTouch/CRTouch ABL Updates
#if ENABLED(BLTOUCH) && DISABLED(CUSTOM_PROBE)
  #define CUSTOM_PROBE
#endif

//Set Ender 3 Pro Machine Setting
#if ENABLED(ENDER3_PRO)
  #define ENDER3
#endif

//Set Ender 5 Pro Machine Setting
#if ENABLED(ENDER5_PRO)
  #define ENDER5
#endif

/**
 * Machine Configuration Settings
 */
 
 //Creality SKR E3 Mini V3 Board Settings
#if ANY(ENDER2_PRO, ENDER3, ENDER3_MAX, ENDER5, ENDER5_PLUS, CR10, CR10_MINI, CR10_S4, CR10_S5)
  #define SERIAL_PORT 2
  #define SERIAL_PORT_2 -1
  
  #if ANY(CR10, CR10_MINI, CR10_S4, CR10_S5)
    #define PRINTER_VOLTAGE_12
  #else
    #define PRINTER_VOLTAGE_24
  #endif

  #if ENABLED(FASTER_BAUDRATE)
    #define BAUDRATE 250000
  #else
    #define BAUDRATE 115200
  #endif
  
  #define CR10_STOCKDISPLAY
  
  #if ENABLED(REVERSE_KNOB_DIRECTION) && DISABLED(ENDER5_PLUS)
    #define REVERSE_ENCODER_DIRECTION
  #endif

  #define SKR_E3_MINI_V3_0
  
  #ifndef MOTHERBOARD
    #if ENABLED(E3MINIV3_F4CPU)
      #define MOTHERBOARD BOARD_BTT_SKR_MINI_E3_V3_0_1
    #else
      #define MOTHERBOARD BOARD_BTT_SKR_MINI_E3_V3_0
    #endif
  #endif
  
  #if ANY(ENDER5_NEW_LEADSCREW, ENDER5_PLUS)
    #define CREALITY_Z_STEPS 800
  #else
    #define CREALITY_Z_STEPS 400
  #endif

  #if ENABLED(CUSTOM_ESTEPS)
    #define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, CREALITY_Z_STEPS, CUSTOM_ESTEPS_VALUE }
  #else
    #define DEFAULT_AXIS_STEPS_PER_UNIT   { 80, 80, CREALITY_Z_STEPS, 424.09 }
  #endif

  #define SHOW_BOOTSCREEN

  #define EXTRUDERS 1

  #if ENABLED(ENDER2_PRO)
    #define X_BED_SIZE 165
    #define Y_BED_SIZE 168
    #define Z_MAX_POS 180
    #define PRINTER_VOLTAGE_24
  #endif
  
  #if ENABLED(ENDER5)
    #if ENABLED(XTENDER_E5_5XL)
      #define X_BED_SIZE 235
      #define Y_BED_SIZE 235
      #define Z_MAX_POS 500
    #else
      #define X_BED_SIZE 220
      #define Y_BED_SIZE 220
      #define Z_MAX_POS 300
    #endif
  #endif
  
  #if ENABLED(ENDER5_PLUS)
    #if ENABLED(XTENDER_E5P_400)
      #define X_BED_SIZE 510
      #define Y_BED_SIZE 510
      #define Z_MAX_POS 400
    #elif ENABLED(XTENDER_E5P_500)
      #define X_BED_SIZE 510
      #define Y_BED_SIZE 510
      #define Z_MAX_POS 500
    #else
      #define X_BED_SIZE 360
      #define Y_BED_SIZE 360
      #define Z_MAX_POS 410
    #endif
    #if DISABLED(REVERSE_KNOB_DIRECTION)
      #define REVERSE_ENCODER_DIRECTION
    #endif
  #endif
  
  #if ENABLED(ENDER3)
    #if ENABLED(XTENDER_E3_300)
      #define X_BED_SIZE 300
      #define Y_BED_SIZE 300
      #define Z_MAX_POS 250
    #elif ENABLED(XTENDER_E3_300XL)
      #define X_BED_SIZE 300
      #define Y_BED_SIZE 300
      #define Z_MAX_POS 400
    #elif ENABLED(XTENDER_E3_400)
      #define X_BED_SIZE 400
      #define Y_BED_SIZE 400
      #define Z_MAX_POS 250
    #elif ENABLED(XTENDER_E3_400Z)
      #define X_BED_SIZE 235
      #define Y_BED_SIZE 235
      #define Z_MAX_POS 400
    #elif ENABLED(XTENDER_E3_400XL)
      #define X_BED_SIZE 400
      #define Y_BED_SIZE 400
      #define Z_MAX_POS 500
    #elif ENABLED(XTENDER_E3_500Z)
      #define X_BED_SIZE 235
      #define Y_BED_SIZE 235
      #define Z_MAX_POS 500
    #else
      #define X_BED_SIZE 235
      #define Y_BED_SIZE 235
      #define Z_MAX_POS 250
    #endif
  #endif
  
  #if ENABLED(ENDER3_MAX)
    #define X_BED_SIZE 300
    #define Y_BED_SIZE 300
    #define Z_MAX_POS 340
  #endif
  
  #if ENABLED(CR10)
    #define DUAL_Z_MOTORS
    #define X_BED_SIZE 300
    #define Y_BED_SIZE 300
    #define Z_MAX_POS 400
    #define PRINTER_VOLTAGE_12
  #endif

  #if ENABLED(CR10_MINI)
    #define X_BED_SIZE 300
    #define Y_BED_SIZE 220
    #define Z_MAX_POS 300
    #define PRINTER_VOLTAGE_12
  #endif

  #if ENABLED(CR10_S4)
    #define DUAL_Z_MOTORS
    #define CR10_S4
    #define X_BED_SIZE 400
    #define Y_BED_SIZE 400
    #define Z_MAX_POS 400
    #define PRINTER_VOLTAGE_12
    #define SLOWER_PROBE_MOVES
  #endif

  #if ENABLED(CR10_S5)
    #define DUAL_Z_MOTORS
    #define CR10_S5
    #define X_BED_SIZE 500
    #define Y_BED_SIZE 500
    #define Z_MAX_POS 500
    #define PRINTER_VOLTAGE_12
    #define SLOWER_PROBE_MOVES
  #endif
  
  #if ENABLED(HOME_ADJUST)
    #define X_MIN_POS X_HOME_LOCATION
    #define Y_MIN_POS Y_HOME_LOCATION
  #elif ENABLED(ENDER2_PRO_OEM)
    #define X_MIN_POS -9
    #define Y_MIN_POS -4
  #elif ENABLED(ENDER2_PRO_OEM_MICRO)
    #define X_MIN_POS -9
    #define Y_MIN_POS -4
  #elif ENABLED(ENDER2_PRO)
    #define X_MIN_POS -20
    #define Y_MIN_POS -4
  #else
    #define X_MIN_POS 0
    #define Y_MIN_POS 0
  #endif

  #if ENABLED(ENDER5) || ENABLED(ENDER5_PLUS)
    #define USE_XMAX_PLUG
    #define USE_YMAX_PLUG
    #define USE_ZMIN_PLUG
  #else
    #define USE_XMIN_PLUG
    #define USE_YMIN_PLUG
    #define USE_ZMIN_PLUG
  #endif

  #if ENABLED(ENDER5) || ENABLED(ENDER5_PLUS)
    #define X_HOME_DIR 1
    #define Y_HOME_DIR 1
    #define Z_HOME_DIR -1
  #else
    #define X_HOME_DIR -1
    #define Y_HOME_DIR -1
    #define Z_HOME_DIR -1
  #endif

  #if NONE(V6_HOTEND, TH3D_HOTEND_THERMISTOR, KNOWN_HOTEND_THERMISTOR)
    #define TEMP_SENSOR_0 1
  #else
    #if ENABLED(EZBOARD_PT100)
      #define TEMP_SENSOR_0 20
    #elif ENABLED(V6_HOTEND)
      #define TEMP_SENSOR_0 5
    #elif ENABLED(KNOWN_HOTEND_THERMISTOR)
      #define TEMP_SENSOR_0 KNOWN_HOTEND_THERMISTOR_VALUE
    #elif ENABLED(TH3D_HOTEND_THERMISTOR)
      #define TEMP_SENSOR_0 1
    #endif
  #endif
  
  #define TEMP_SENSOR_1 0 
  #define TEMP_SENSOR_2 0
  #define TEMP_SENSOR_3 0
  #define TEMP_SENSOR_4 0
  #define TEMP_SENSOR_5 0
  #define TEMP_SENSOR_6 0
  #define TEMP_SENSOR_7 0
  
  #if NONE(TH3D_BED_THERMISTOR, KEENOVO_TEMPSENSOR, KNOWN_BED_THERMISTOR, AC_BED)
    #define TEMP_SENSOR_BED 1
  #else
    #if ENABLED(AC_BED)
      #define TEMP_SENSOR_BED 0
    #elif ENABLED(KNOWN_BED_THERMISTOR)
      #define TEMP_SENSOR_BED KNOWN_BED_THERMISTOR_VALUE
    #elif ENABLED(TH3D_BED_THERMISTOR)
      #define TEMP_SENSOR_BED 1
    #elif ENABLED(KEENOVO_TEMPSENSOR)
      #define TEMP_SENSOR_BED 11
    #endif
  #endif
  
  #define TEMP_SENSOR_PROBE 0
  #define TEMP_SENSOR_CHAMBER 0

  #define DEFAULT_Kp 27.9849
  #define DEFAULT_Ki 5.3002
  #define DEFAULT_Kd 36.9401
  
  #define DEFAULT_bedKp 462.10
  #define DEFAULT_bedKi 85.47
  #define DEFAULT_bedKd 624.59

  #define ENDSTOPPULLUPS

  #define X_MIN_ENDSTOP_INVERTING false
  #define Y_MIN_ENDSTOP_INVERTING false
  #define Z_MIN_ENDSTOP_INVERTING false
  #define X_MAX_ENDSTOP_INVERTING false
  #define Y_MAX_ENDSTOP_INVERTING false
  #define Z_MAX_ENDSTOP_INVERTING false
  #define Z_MIN_PROBE_ENDSTOP_INVERTING false

  #if ANY(BLTOUCH_ON_5PIN, EZABL_ON_SERVO_HEADER)
    #define USE_PROBE_FOR_Z_HOMING
  #else
    #define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
  #endif

  #define X_DRIVER_TYPE TMC2209
  #define Y_DRIVER_TYPE TMC2209
  #define Z_DRIVER_TYPE TMC2209
  #define E0_DRIVER_TYPE TMC2209

  #define X_ENABLE_ON 0
  #define Y_ENABLE_ON 0
  #define Z_ENABLE_ON 0
  #define E_ENABLE_ON 0

  #if ENABLED(ENDER2_PRO)
    #if ENABLED(REVERSE_X_MOTOR)
      #define INVERT_X_DIR true
    #else
      #define INVERT_X_DIR false
    #endif
  #else
    #if ENABLED(REVERSE_X_MOTOR)
      #define INVERT_X_DIR false
    #else
      #define INVERT_X_DIR true
    #endif
  #endif

  #if ENABLED(ENDER2_PRO)
    #if ENABLED(REVERSE_Y_MOTOR)
      #define INVERT_Y_DIR true
    #else
      #define INVERT_Y_DIR false
    #endif
  #else
    #if ENABLED(REVERSE_Y_MOTOR)
      #define INVERT_Y_DIR false
    #else
      #define INVERT_Y_DIR true
    #endif
  #endif

  #if ANY(ENDER5, ENDER5_PLUS, ENDER2_PRO)
    #if ENABLED(REVERSE_Z_MOTOR)
      #define INVERT_Z_DIR false
    #else
      #define INVERT_Z_DIR true
    #endif
  #else
    #if ENABLED(REVERSE_Z_MOTOR)
      #define INVERT_Z_DIR true
    #else
      #define INVERT_Z_DIR false
    #endif
  #endif

  #if ENABLED(ENDER2_PRO)
    #if ENABLED(REVERSE_E_MOTOR_DIRECTION)
      #define INVERT_E0_DIR true
    #else
      #define INVERT_E0_DIR false
    #endif
  #else
    #if ENABLED(REVERSE_E_MOTOR_DIRECTION)
      #define INVERT_E0_DIR false
    #else
      #define INVERT_E0_DIR true
    #endif
  #endif
  
  #define INVERT_E1_DIR false
  #define INVERT_E2_DIR false
  #define INVERT_E3_DIR false
  #define INVERT_E4_DIR false
  #define INVERT_E5_DIR false
  #define INVERT_E6_DIR false
  #define INVERT_E7_DIR false

  #define ENCODER_PULSES_PER_STEP 4
  #define ENCODER_STEPS_PER_MENU_ITEM 1

  #define Z_PROBE_OFFSET_RANGE_MIN -10
  #define Z_PROBE_OFFSET_RANGE_MAX 10
  
  #if ENABLED(ENDER5_PLUS)
    #if DISABLED(ENDER5_PLUS_NOABL) && DISABLED(ENDER5_PLUS_EZABL)
      #define BLTOUCH
    #ifndef EZABL_PROBE_EDGE
      #define EZABL_PROBE_EDGE 15
    #endif
    #ifndef EZABL_POINTS
      #define EZABL_POINTS 5
    #endif
    #if DISABLED(CUSTOM_PROBE)
        #define CUSTOM_PROBE
        #define NOZZLE_TO_PROBE_OFFSET { -44, -9, 0}
      #endif
    #endif  
    #if DISABLED(ENDER5_PLUS_NOABL)
      #define ABL_ENABLE
    #endif
  #endif

  #if ANY(EZOUT_ENABLE, CR10S_STOCKFILAMENTSENSOR, BTT_SFS_FILAMENT_SENSOR)
    #define FILAMENT_RUNOUT_SENSOR
  #endif
  #if ENABLED(FILAMENT_RUNOUT_SENSOR)
    #define FIL_RUNOUT_ENABLED_DEFAULT true // Enable the sensor on startup. Override with M412 followed by M500.
    #define NUM_RUNOUT_SENSORS   1          // Number of sensors, up to one per extruder. Define a FIL_RUNOUT#_PIN for each.
    #if ANY(EZOUT_ENABLE, BTT_SFS_FILAMENT_SENSOR)
      #define FIL_RUNOUT_STATE     LOW        // Pin state indicating that filament is NOT present.
    #else
      #define FIL_RUNOUT_STATE     HIGH        // Pin state indicating that filament is NOT present.
    #endif
    #define FIL_RUNOUT_PULLUP               // Use internal pullup for filament runout pins.
    //#define FIL_RUNOUT_PULLDOWN           // Use internal pulldown for filament runout pins.

    // Set one or more commands to execute on filament runout.
    // (After 'M412 H' Marlin will ask the host to handle the process.)
    #define FILAMENT_RUNOUT_SCRIPT "M600"

    // After a runout is detected, continue printing this length of filament
    // before executing the runout script. Useful for a sensor at the end of
    // a feed tube. Requires 4 bytes SRAM per sensor, plus 4 bytes overhead.
    #if ENABLED(BTT_SFS_FILAMENT_SENSOR)
      #define FILAMENT_RUNOUT_DISTANCE_MM BTT_SFS_DISTANCE_MM
    #endif

    #ifdef FILAMENT_RUNOUT_DISTANCE_MM
      // Enable this option to use an encoder disc that toggles the runout pin
      // as the filament moves. (Be sure to set FILAMENT_RUNOUT_DISTANCE_MM
      // large enough to avoid false positives.)
      #define FILAMENT_MOTION_SENSOR
    #endif
  #endif
  
  #if ENABLED(EZNEO_220)
    #define RGB_LIGHTS
    #define NEOPIXEL_LED
    #if ENABLED(NEOPIXEL_LED)
      #define NEOPIXEL_TYPE   NEO_GRB // NEO_GRBW / NEO_GRB - four/three channel driver type (defined in Adafruit_NeoPixel.h)
      #define NEOPIXEL_PIXELS 15       // Number of LEDs in the strip. (Longest strip when NEOPIXEL2_SEPARATE is disabled.)
      #define NEOPIXEL_IS_SEQUENTIAL   // Sequential display for temperature change - LED by LED. Disable to change all LEDs at once.
      #define NEOPIXEL_BRIGHTNESS 255  // Initial brightness (0-255)
      #define NEOPIXEL_STARTUP_TEST  // Cycle through colors at startup
    #endif

    /**
     * Printer Event LEDs
     *
     * During printing, the LEDs will reflect the printer status:
     *
     *  - Gradually change from blue to violet as the heated bed gets to target temp
     *  - Gradually change from violet to red as the hotend gets to temperature
     *  - Change to white to illuminate work surface
     *  - Change to green once print has finished
     *  - Turn off after the print has finished and the user has pushed a button
     */
    #if ANY(BLINKM, RGB_LED, RGBW_LED, PCA9632, PCA9533, NEOPIXEL_LED)
      #define PRINTER_EVENT_LEDS
    #endif
  #endif
#endif
// End SKR E3 Mini V3 Board Settings
 
/*
 * All other settings are stored in the Configuration_backend.h and Configuration_speed.h files. Do not change unless you know what you are doing.
 */
 
#include "Configuration_backend.h"
#include "Configuration_speed.h"