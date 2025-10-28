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
      circularBackgroundColor = '#F5F5F5',
      transparentBackground = false
    } = circularOptions;
    
    if (circular) {
      if (!transparentBackground) {
        // Fill entire canvas with background color
        ctx.fillStyle = circularBackgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
      
      // Create circular clipping path
      const circleRadius = Math.min(width, height) / 2 - margin;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      ctx.clip();
      
      if (!transparentBackground) {
        // Fill circle with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    } else if (!transparentBackground) {
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
   * Save canvas to file with support for multiple formats
   * @param {Canvas} canvas - Canvas object
   * @param {string} outputPath - Output file path
   * @param {Object} options - Export options
   */
  static saveCanvasToFile(canvas, outputPath, options = {}) {
    const { format = 'png', transparent = false } = options;
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Determine format from file extension if not specified
    const fileExtension = path.extname(outputPath).toLowerCase();
    const actualFormat = format === 'auto' ? 
      (fileExtension === '.svg' ? 'svg' : 'png') : format;
    
    if (actualFormat === 'svg') {
      this.saveCanvasAsSVG(canvas, outputPath, transparent);
    } else {
      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
    }
  }

  /**
   * Save canvas as SVG file
   * @param {Canvas} canvas - Canvas object
   * @param {string} outputPath - Output file path
   * @param {boolean} transparent - Whether to use transparent background
   */
  static saveCanvasAsSVG(canvas, outputPath, transparent = false) {
    // Get canvas context and image data to recreate as SVG
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Start SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (!transparent) {
      svgContent += `
  <rect width="100%" height="100%" fill="white"/>`;
    }
    
    // Note: This is a simplified SVG export. For full canvas-to-SVG conversion,
    // we would need to track all drawing operations. For now, we'll convert
    // the raster image to an embedded image in SVG.
    const dataURL = canvas.toDataURL('image/png');
    svgContent += `
  <image width="${width}" height="${height}" href="${dataURL}"/>
</svg>`;
    
    fs.writeFileSync(outputPath, svgContent);
  }

  /**
   * Generate SVG circles directly (better for vector output)
   * @param {Array} circles - Array of circle objects
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {boolean} transparent - Whether to use transparent background
   * @returns {string} SVG content
   */
  static generateSVGFromCircles(circles, width, height, transparent = false) {
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    if (!transparent) {
      svgContent += `
  <rect width="100%" height="100%" fill="white"/>`;
    }
    
    // Add each circle as SVG element
    for (const circle of circles) {
      svgContent += `
  <circle cx="${circle.x}" cy="${circle.y}" r="${circle.radius}" fill="${circle.color}"/>`;
    }
    
    svgContent += `
</svg>`;
    
    return svgContent;
  }

  /**
   * Save circles directly as SVG (true vector format)
   * @param {Array} circles - Array of circle objects
   * @param {string} outputPath - Output file path
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {boolean} transparent - Whether to use transparent background
   */
  static saveCirclesAsSVG(circles, outputPath, width, height, transparent = false) {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const svgContent = this.generateSVGFromCircles(circles, width, height, transparent);
    fs.writeFileSync(outputPath, svgContent);
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