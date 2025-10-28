/**
 * ColorVision Test Creator - Main Module Entry Point
 * 
 * A Node.js library for generating educational color vision test images
 * inspired by traditional methods. Educational and artistic use only.
 * 
 * @author ColorVision Test Creator
 * @version 1.0.0
 */

const ColorVisionGenerator = require('./src/colorvision-generator');

// Export the main generator class
module.exports = ColorVisionGenerator;

// Also export as named export for convenience
module.exports.ColorVisionGenerator = ColorVisionGenerator;
module.exports.TextProcessor = require('./src/utils/text-processor');
module.exports.CirclePlacer = require('./src/utils/circle-placer');
module.exports.CanvasUtils = require('./src/utils/canvas-utils');
module.exports.Luminance = require('./src/utils/luminance');