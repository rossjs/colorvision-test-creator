/**
 * Color Palettes for Different Types of Color Vision Deficiencies
 * 
 * These palettes are designed to simulate how different color combinations
 * might appear to people with various types of color vision deficiencies.
 * 
 * ⚠️ EDUCATIONAL USE ONLY - NOT FOR MEDICAL DIAGNOSIS ⚠️
 */

/**
 * Color palette definitions
 * Each palette contains foreground (on) and background (off) colors
 * that create different visibility patterns for various color vision types
 */
const COLOR_PALETTES = {
  // Default palette - good general contrast
  default: {
    name: 'Default Orange/Cyan',
    description: 'Good general contrast for most color vision types',
    onColor: '#FF6B35',   // Orange/red for text
    offColor: '#4ECDC4',  // Cyan/green for background
    targetDeficiency: 'general'
  },

  // Protanopia (red-blind) optimized palettes
  protanopia: {
    name: 'Protanopia (Red-blind) Test',
    description: 'Optimized for testing red color blindness',
    onColor: '#8B0000',   // Dark red
    offColor: '#90EE90',  // Light green
    targetDeficiency: 'protanopia'
  },

  // Deuteranopia (green-blind) optimized palettes
  deuteranopia: {
    name: 'Deuteranopia (Green-blind) Test',
    description: 'Optimized for testing green color blindness',
    onColor: '#D2691E',   // Chocolate/orange-brown
    offColor: '#6B8E23',  // Olive green
    targetDeficiency: 'deuteranopia'
  },

  // Tritanopia (blue-blind) optimized palettes
  tritanopia: {
    name: 'Tritanopia (Blue-blind) Test',
    description: 'Optimized for testing blue color blindness',
    onColor: '#FFD700',   // Gold/yellow
    offColor: '#4169E1',  // Royal blue
    targetDeficiency: 'tritanopia'
  },

  // High contrast palettes
  'high-contrast-red': {
    name: 'High Contrast Red/Green',
    description: 'Maximum contrast red/green combination',
    onColor: '#B22222',   // Fire brick red
    offColor: '#32CD32',  // Lime green
    targetDeficiency: 'red-green'
  },

  'high-contrast-blue': {
    name: 'High Contrast Blue/Yellow',
    description: 'Maximum contrast blue/yellow combination',
    onColor: '#000080',   // Navy blue
    offColor: '#FFFF00',  // Bright yellow
    targetDeficiency: 'blue-yellow'
  },

  // Subtle/mild palettes for research
  'subtle-red-green': {
    name: 'Subtle Red/Green',
    description: 'Subtle red-green difference for mild deficiencies',
    onColor: '#CD5C5C',   // Indian red
    offColor: '#228B22',  // Forest green
    targetDeficiency: 'mild-red-green'
  },

  'subtle-brown-green': {
    name: 'Subtle Brown/Green',
    description: 'Brown-green combination often confused by color blind individuals',
    onColor: '#A0522D',   // Sienna brown
    offColor: '#556B2F',  // Dark olive green
    targetDeficiency: 'brown-green-confusion'
  },

  // Monochromatic-friendly (for complete color blindness)
  monochrome: {
    name: 'Monochrome Compatible',
    description: 'High luminance contrast for monochromacy',
    onColor: '#2F2F2F',   // Dark gray
    offColor: '#D3D3D3',  // Light gray
    targetDeficiency: 'monochromacy'
  },

  // Research/scientific palettes
  'scientific-red': {
    name: 'Scientific Red Standard',
    description: 'Standard red used in color vision research',
    onColor: '#FF0000',   // Pure red
    offColor: '#00FF00',  // Pure green
    targetDeficiency: 'research-standard'
  },

  'ishihara-classic': {
    name: 'Classic Ishihara Colors',
    description: 'Colors inspired by traditional Ishihara plates',
    onColor: '#8B4513',   // Saddle brown
    offColor: '#9ACD32',  // Yellow green
    targetDeficiency: 'classic-test'
  }
};

/**
 * Get all available palette names
 * @returns {Array<string>} Array of palette names
 */
function getPaletteNames() {
  return Object.keys(COLOR_PALETTES);
}

/**
 * Get palette by name
 * @param {string} paletteName - Name of the palette
 * @returns {Object|null} Palette object or null if not found
 */
function getPalette(paletteName) {
  const palette = COLOR_PALETTES[paletteName.toLowerCase()];
  return palette || null;
}

/**
 * Get all palettes
 * @returns {Object} All palettes
 */
function getAllPalettes() {
  return COLOR_PALETTES;
}

/**
 * Get palettes by target deficiency type
 * @param {string} deficiencyType - Type of color vision deficiency
 * @returns {Array<Object>} Array of matching palettes
 */
function getPalettesByDeficiency(deficiencyType) {
  return Object.entries(COLOR_PALETTES)
    .filter(([_, palette]) => palette.targetDeficiency === deficiencyType)
    .map(([name, palette]) => ({ name, ...palette }));
}

/**
 * Validate if a palette name exists
 * @param {string} paletteName - Name of the palette to validate
 * @returns {boolean} True if palette exists
 */
function isValidPalette(paletteName) {
  return COLOR_PALETTES.hasOwnProperty(paletteName.toLowerCase());
}

/**
 * Get palette help text for CLI
 * @returns {string} Formatted help text listing all palettes
 */
function getPaletteHelpText() {
  const paletteList = Object.entries(COLOR_PALETTES)
    .map(([name, palette]) => `    ${name.padEnd(20)} - ${palette.description}`)
    .join('\n');
  
  return `Available color palettes:\n${paletteList}`;
}

module.exports = {
  COLOR_PALETTES,
  getPaletteNames,
  getPalette,
  getAllPalettes,
  getPalettesByDeficiency,
  isValidPalette,
  getPaletteHelpText
};