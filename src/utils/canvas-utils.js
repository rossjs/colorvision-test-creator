const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Canvas utilities for Ishihara test generation
 */
class CanvasUtils {
  /**
   * Create and configure a canvas for text rendering
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} backgroundColor - Background color
   * @returns {Object} Canvas and context
   */
  static createTextCanvas(width, height, backgroundColor = '#FFFFFF') {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    return { canvas, ctx };
  }

  /**
   * Create and configure a canvas for final image output
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {boolean} circular - Whether to create circular clipping
   * @param {Object} circularOptions - Circular canvas options
   * @returns {Object} Canvas and context
   */
  static createOutputCanvas(width, height, circular = false, circularOptions = {}) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const { 
      centerX = width / 2, 
      centerY = height / 2, 
      margin = 50,
      circularBackgroundColor = '#F5F5F5' 
    } = circularOptions;
    
    if (circular) {
      // Fill entire canvas with background color
      ctx.fillStyle = circularBackgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Create circular clipping path
      const circleRadius = Math.min(width, height) / 2 - margin;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      ctx.clip();
      
      // Fill circle with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }
    
    return { canvas, ctx };
  }

  /**
   * Draw circles on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} circles - Array of circle objects
   */
  static drawCircles(ctx, circles) {
    for (const circle of circles) {
      ctx.fillStyle = circle.color;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * Save canvas to file
   * @param {Canvas} canvas - Canvas object
   * @param {string} outputPath - Output file path
   */
  static saveCanvasToFile(canvas, outputPath) {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save output
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
  }

  /**
   * Create luminance map from canvas image data
   * @param {Canvas} canvas - Source canvas
   * @param {number} luminanceThreshold - Threshold for luminance detection
   * @returns {Array} 2D array of boolean luminance values
   */
  static createLuminanceMap(canvas, luminanceThreshold = 0.5) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const getLuminance = require('./luminance');
    
    const luminanceMap = new Array(canvas.height);
    for (let y = 0; y < canvas.height; y++) {
      luminanceMap[y] = new Array(canvas.width);
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        luminanceMap[y][x] = getLuminance(r, g, b) < luminanceThreshold; // Inverted for text
      }
    }
    
    return luminanceMap;
  }
}

module.exports = CanvasUtils;