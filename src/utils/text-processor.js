const { createCanvas } = require('canvas');

/**
 * Text processing utilities for Ishihara test generation
 */
class TextProcessor {
  /**
   * Split text into words for multi-line rendering
   * @param {string} text - Input text
   * @returns {string[]} Array of words
   */
  static splitIntoWords(text) {
    return text.trim().split(/\s+/);
  }

  /**
   * Check if text should be rendered as multiple lines
   * @param {string} text - Input text
   * @returns {boolean} True if multi-line
   */
  static isMultiLine(text) {
    return this.splitIntoWords(text).length > 1;
  }

  /**
   * Calculate optimal font size for text to fit within constraints
   * @param {string} text - Text to measure
   * @param {number} maxWidth - Maximum width constraint
   * @param {number} maxHeight - Maximum height constraint
   * @param {number} initialFontSize - Starting font size
   * @param {string} fontFamily - Font family to use
   * @returns {number} Adjusted font size
   */
  static calculateOptimalFontSize(text, maxWidth, maxHeight, initialFontSize, fontFamily) {
    const tempCanvas = createCanvas(100, 100);
    const tempCtx = tempCanvas.getContext('2d');
    
    const words = this.splitIntoWords(text);
    const isMultiLine = words.length > 1;
    let adjustedFontSize = initialFontSize;
    
    // Adjust font size to fit within constraints
    do {
      tempCtx.font = `${adjustedFontSize}px ${fontFamily}`;
      
      let textWidth, textHeight;
      
      if (isMultiLine) {
        // For multi-line text, find the widest word and calculate total height
        textWidth = Math.max(...words.map(word => tempCtx.measureText(word).width));
        const lineHeight = adjustedFontSize * 1.2; // 20% line spacing
        textHeight = words.length * lineHeight;
      } else {
        // Single line text
        const textMetrics = tempCtx.measureText(text);
        textWidth = textMetrics.width;
        textHeight = (textMetrics.actualBoundingBoxAscent || adjustedFontSize * 0.7) + 
                    (textMetrics.actualBoundingBoxDescent || adjustedFontSize * 0.3);
      }
      
      if (textWidth <= maxWidth && textHeight <= maxHeight) {
        break;
      }
      adjustedFontSize *= 0.95; // Reduce font size by 5% for more precise fitting
    } while (adjustedFontSize > 20); // Minimum readable size
    
    return adjustedFontSize;
  }

  /**
   * Render text on canvas with automatic multi-line support
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to render
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} fontSize - Font size to use
   */
  static renderText(ctx, text, centerX, centerY, fontSize) {
    const words = this.splitIntoWords(text);
    
    if (words.length === 1) {
      // Single word - draw normally
      ctx.fillText(text, centerX, centerY);
    } else {
      // Multiple words - draw each word on a separate line
      const lineHeight = fontSize * 1.2; // 20% line spacing
      const totalHeight = words.length * lineHeight;
      const startY = centerY - (totalHeight / 2) + (lineHeight / 2);
      
      words.forEach((word, index) => {
        const y = startY + (index * lineHeight);
        ctx.fillText(word, centerX, y);
      });
    }
  }
}

module.exports = TextProcessor;