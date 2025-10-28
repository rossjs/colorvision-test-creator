/**
 * Circle placement and validation utilities for Ishihara test generation
 */
class CirclePlacer {
  /**
   * Check if a circle placement is valid (within bounds and no overlaps)
   * @param {number} x - Circle center X
   * @param {number} y - Circle center Y  
   * @param {number} radius - Circle radius
   * @param {Array} existingCircles - Array of existing circles
   * @param {Object} constraints - Placement constraints
   * @returns {boolean} True if placement is valid
   */
  static isValidPlacement(x, y, radius, existingCircles, constraints) {
    const { width, height, margin, circular, centerX, centerY, padding } = constraints;
    
    // Check canvas bounds (with margin)
    if (x - radius < margin || x + radius > width - margin ||
        y - radius < margin || y + radius > height - margin) {
      return false;
    }
    
    // For circular images, check if circle is within the circular boundary
    if (circular) {
      const circleRadius = Math.min(width, height) / 2 - margin;
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distanceFromCenter + radius > circleRadius) {
        return false;
      }
    }
    
    // Check overlap with existing circles
    for (const circle of existingCircles) {
      const dx = x - circle.x;
      const dy = y - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < radius + circle.radius + padding) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Generate a random position for circle placement
   * @param {Object} constraints - Placement constraints
   * @returns {Object} Position with x, y coordinates
   */
  static generateRandomPosition(constraints) {
    const { width, height, margin, circular, centerX, centerY } = constraints;
    
    if (circular) {
      // Generate position within circular boundary
      const circleRadius = Math.min(width, height) / 2 - margin;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * circleRadius;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      };
    } else {
      // Generate position within rectangular boundary (with margin)
      const effectiveWidth = width - (margin * 2);
      const effectiveHeight = height - (margin * 2);
      return {
        x: margin + Math.random() * effectiveWidth,
        y: margin + Math.random() * effectiveHeight
      };
    }
  }

  /**
   * Determine the color for a circle based on underlying text pattern
   * @param {number} x - Circle center X
   * @param {number} y - Circle center Y
   * @param {number} radius - Circle radius
   * @param {Array} luminanceMap - 2D array of luminance values
   * @param {Object} options - Color determination options
   * @returns {string|null} Color hex string or null if invalid
   */
  static determineCircleColor(x, y, radius, luminanceMap, options) {
    const { tolerance, onColor, offColor, mapWidth, mapHeight } = options;
    
    let inPixels = 0;
    let totalPixels = 0;
    
    // Sample pixels within circle
    const samples = Math.max(8, radius); // Sample density based on radius
    for (let dy = -radius; dy <= radius; dy += radius / samples) {
      for (let dx = -radius; dx <= radius; dx += radius / samples) {
        if (dx * dx + dy * dy <= radius * radius) {
          const px = Math.floor(x + dx);
          const py = Math.floor(y + dy);
          
          if (px >= 0 && px < mapWidth && py >= 0 && py < mapHeight) {
            totalPixels++;
            if (luminanceMap[py][px]) inPixels++;
          }
        }
      }
    }
    
    if (totalPixels === 0) return null;
    
    const inRatio = inPixels / totalPixels;
    
    // Check tolerance - reject circles that are too mixed
    if (inRatio > tolerance && inRatio < 1 - tolerance) {
      return null; // Circle crosses boundary too much
    }
    
    return inRatio > 0.5 ? onColor : offColor;
  }
}

module.exports = CirclePlacer;