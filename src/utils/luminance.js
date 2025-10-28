/**
 * Calculate luminance of an RGB color using ITU BT.709 coefficients
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255) 
 * @param {number} b - Blue component (0-255)
 * @returns {number} Luminance value (0-1)
 */
function getLuminance(r, g, b) {
  // Convert 8-bit RGB to 0-1 range
  const vR = r / 255;
  const vG = g / 255;
  const vB = b / 255;
  
  // Linearize sRGB values
  function sRGBtoLin(channel) {
    if (channel <= 0.04045) {
      return channel / 12.92;
    } else {
      return Math.pow((channel + 0.055) / 1.055, 2.4);
    }
  }
  
  // Calculate luminance using ITU BT.709 coefficients
  const Y = 0.2126 * sRGBtoLin(vR) + 
            0.7152 * sRGBtoLin(vG) + 
            0.0722 * sRGBtoLin(vB);
  
  return Y;
}

module.exports = getLuminance;