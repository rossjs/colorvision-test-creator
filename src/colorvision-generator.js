const TextProcessor = require('./utils/text-processor');
const CirclePlacer = require('./utils/circle-placer');
const CanvasUtils = require('./utils/canvas-utils');
const ColorPalettes = require('./utils/color-palettes');

/**
 * Default options for color vision test generation
 */
const DEFAULT_OPTIONS = {
  width: 800,
  height: 800,
  minRadius: 3,
  maxRadius: 20,
  onColor: '#FF6B35',    // Orange/red for text pixels
  offColor: '#4ECDC4',   // Green/cyan for background pixels
  luminanceThreshold: 0.5,
  tolerance: 0.1,        // Max % of "wrong" pixels in a circle
  padding: 0,            // Minimum space between circles
  maxAttempts: 10000,
  fontSize: 300,         // Font size for the text
  fontFamily: 'Arial, sans-serif',
  textColor: '#000000',  // Color for text rendering (before conversion)
  backgroundColor: '#FFFFFF', // Background color for text rendering
  margin: 50,            // Margin around text in pixels
  circular: false,       // Create circular image like traditional color vision tests
  circularBackgroundColor: '#F5F5F5', // Background color for circular images
  maxTextFit: false,     // Use maximum text size in circular mode (less safe margin)
  palette: null,         // Color palette name to use
  format: 'png',         // Output format: 'png' or 'svg'
  transparent: false     // Use transparent background
};

/**
 * ColorVision Test Generator
 * 
 * ⚠️ EDUCATIONAL USE ONLY - NOT FOR MEDICAL DIAGNOSIS ⚠️
 * 
 * Generates educational color vision test patterns inspired by traditional methods.
 * These are NOT medically validated diagnostic tools. For actual color vision 
 * assessment, consult qualified eye care professionals.
 * 
 * Use only for educational, artistic, and demonstration purposes.
 */
class ColorVisionGenerator {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Apply color palette if specified
    if (this.options.palette) {
      const palette = ColorPalettes.getPalette(this.options.palette);
      if (palette) {
        this.options.onColor = palette.onColor;
        this.options.offColor = palette.offColor;
      } else {
        console.warn(`Warning: Palette "${this.options.palette}" not found. Using default colors.`);
      }
    }
  }

  /**
   * Generate a color vision test image from text
   * @param {string} text - Text to generate test for
   * @param {string} outputPath - Output file path
   * @returns {Object} Generation result
   */
  async generate(text, outputPath) {
    const options = this.options;
    const { width, height, margin, circular, fontSize, fontFamily, textColor, backgroundColor } = options;

    // Calculate effective area and positioning
    const effectiveWidth = width - (margin * 2);
    const effectiveHeight = height - (margin * 2);
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate text area constraints
    const { maxTextWidth, maxTextHeight } = this._calculateTextConstraints();

    // Calculate optimal font size
    const adjustedFontSize = TextProcessor.calculateOptimalFontSize(
      text, maxTextWidth, maxTextHeight, fontSize, fontFamily
    );

    this._logGenerationInfo(text, adjustedFontSize, fontSize);

    // Create text canvas and render text
    const { canvas: textCanvas, ctx: textCtx } = CanvasUtils.createTextCanvas(width, height, backgroundColor);
    this._setupTextRendering(textCtx, adjustedFontSize, fontFamily, textColor, centerX, centerY);
    TextProcessor.renderText(textCtx, text, centerX, centerY, adjustedFontSize);

    // Create luminance map from text canvas
    const luminanceMap = CanvasUtils.createLuminanceMap(textCanvas, options.luminanceThreshold);

    // Generate circles
    const circles = this._generateCircles(luminanceMap);

    // Handle output based on format
    const { format, transparent } = options;
    
    if (format === 'svg') {
      // Save directly as SVG for true vector format
      CanvasUtils.saveCirclesAsSVG(circles, outputPath, width, height, transparent);
    } else {
      // Create output canvas and draw circles
      const { canvas, ctx } = CanvasUtils.createOutputCanvas(width, height, circular, {
        centerX, centerY, margin, 
        circularBackgroundColor: options.circularBackgroundColor,
        transparentBackground: transparent
      });

      CanvasUtils.drawCircles(ctx, circles);

      // Restore context if circular clipping was used
      if (circular) {
        ctx.restore();
      }

      // Save the result
      CanvasUtils.saveCanvasToFile(canvas, outputPath, { format, transparent });
    }

    console.log(`Generated color vision test with ${circles.length} circles`);
    console.log(`Saved to: ${outputPath}`);

    return {
      circleCount: circles.length,
      text: text,
      outputPath: outputPath,
      fontSizeUsed: adjustedFontSize
    };
  }

  /**
   * Calculate text area constraints based on circular/rectangular mode
   * @private
   */
  _calculateTextConstraints() {
    const { width, height, margin, circular, maxTextFit } = this.options;
    
    if (circular) {
      const circleRadius = Math.min(width, height) / 2 - margin;
      const textRadiusRatio = maxTextFit ? 0.92 : 0.85;
      const textRadius = circleRadius * textRadiusRatio;
      const widthRatio = maxTextFit ? 0.95 : 0.9;
      const heightRatio = maxTextFit ? 0.85 : 0.8;
      
      return {
        maxTextWidth: textRadius * 2 * widthRatio,
        maxTextHeight: textRadius * 2 * heightRatio
      };
    } else {
      const effectiveWidth = width - (margin * 2);
      const effectiveHeight = height - (margin * 2);
      return {
        maxTextWidth: effectiveWidth * 0.8,
        maxTextHeight: effectiveHeight * 0.8
      };
    }
  }

  /**
   * Setup text rendering context
   * @private
   */
  _setupTextRendering(ctx, fontSize, fontFamily, textColor, centerX, centerY) {
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  /**
   * Generate circles for the color vision test pattern
   * @private
   */
  _generateCircles(luminanceMap) {
    const options = this.options;
    const { width, height, margin, circular, minRadius, maxRadius, maxAttempts, padding } = options;
    const centerX = width / 2;
    const centerY = height / 2;

    const circles = [];
    let attempts = 0;
    let currentMaxRadius = maxRadius;

    const constraints = { width, height, margin, circular, centerX, centerY, padding };
    const colorOptions = {
      tolerance: options.tolerance,
      onColor: options.onColor,
      offColor: options.offColor,
      mapWidth: width,
      mapHeight: height
    };

    console.log(`Generating color vision test for text: "${this.currentText}"`);

    while (attempts < maxAttempts) {
      const position = CirclePlacer.generateRandomPosition(constraints);
      const radius = minRadius + Math.random() * (currentMaxRadius - minRadius);

      if (CirclePlacer.isValidPlacement(position.x, position.y, radius, circles, constraints)) {
        const color = CirclePlacer.determineCircleColor(
          position.x, position.y, radius, luminanceMap, colorOptions
        );

        if (color) {
          circles.push({ x: position.x, y: position.y, radius, color });
          attempts = 0; // Reset on success

          // Progress indicator
          if (circles.length % 100 === 0) {
            console.log(`Generated ${circles.length} circles...`);
          }
        } else {
          attempts++;
        }
      } else {
        attempts++;
      }

      // Gradually reduce radius if struggling to place circles
      if (attempts > 1000 && currentMaxRadius > minRadius + 1) {
        currentMaxRadius *= 0.98;
        console.log(`Reducing max radius to ${currentMaxRadius.toFixed(1)}`);
        attempts = 0; // Give it another chance with smaller circles
      }
    }

    return circles;
  }

  /**
   * Log generation information
   * @private
   */
  _logGenerationInfo(text, adjustedFontSize, originalFontSize) {
    this.currentText = text; // Store for use in circle generation
    
    if (adjustedFontSize !== originalFontSize) {
      console.log(`Adjusted font size from ${originalFontSize}px to ${adjustedFontSize.toFixed(1)}px to fit within margins`);
    }

    if (TextProcessor.isMultiLine(text)) {
      const words = TextProcessor.splitIntoWords(text);
      console.log(`Multi-word input detected: "${text}" will be rendered as ${words.length} lines`);
    }

    const { circular, width, height, margin, maxTextFit } = this.options;
    if (circular) {
      const circleRadius = Math.min(width, height) / 2 - margin;
      const textRadius = circleRadius * (maxTextFit ? 0.92 : 0.85);
      console.log(`Circle: radius=${circleRadius}px, text area radius=${textRadius.toFixed(1)}px (${maxTextFit ? 'maximum' : 'balanced'} fit)`);
    } else {
      const effectiveWidth = width - (margin * 2);
      const effectiveHeight = height - (margin * 2);
      console.log(`Rectangular mode: effective area=${effectiveWidth}x${effectiveHeight}px (margin=${margin}px)`);
    }
  }
}

module.exports = ColorVisionGenerator;