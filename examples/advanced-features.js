/**
 * Advanced Features Example - ColorVision Test Creator
 * 
 * Demonstrates the new features: color palettes, SVG output, and transparent backgrounds
 */

const ColorVisionGenerator = require('../index');
const ColorPalettes = require('../src/utils/color-palettes');
const path = require('path');

async function demonstrateNewFeatures() {
  console.log('🎨 ColorVision Test Creator - Advanced Features Demo\n');

  // Show available palettes
  console.log('📋 Available Color Palettes:');
  const paletteNames = ColorPalettes.getPaletteNames();
  paletteNames.forEach(name => {
    const palette = ColorPalettes.getPalette(name);
    console.log(`   ${name}: ${palette.description}`);
  });
  console.log('');

  const examples = [
    {
      name: 'Protanopia PNG with Transparent Background',
      options: {
        palette: 'protanopia',
        transparent: true,
        circular: true
      },
      text: '8',
      filename: 'example-protanopia-transparent.png'
    },
    {
      name: 'Deuteranopia SVG Vector Format',
      options: {
        palette: 'deuteranopia',
        format: 'svg',
        circular: false,
        fontSize: 400
      },
      text: 'A',
      filename: 'example-deuteranopia-vector.svg'
    },
    {
      name: 'Tritanopia SVG with Transparent Background',
      options: {
        palette: 'tritanopia',
        format: 'svg',
        transparent: true,
        circular: true,
        maxTextFit: true
      },
      text: '5',
      filename: 'example-tritanopia-svg-transparent.svg'
    },
    {
      name: 'High Contrast Blue/Yellow',
      options: {
        palette: 'high-contrast-blue',
        format: 'png',
        circular: false,
        width: 1000,
        height: 1000
      },
      text: '42',
      filename: 'example-high-contrast-blue.png'
    },
    {
      name: 'Classic Ishihara Colors (SVG)',
      options: {
        palette: 'ishihara-classic',
        format: 'svg',
        circular: true,
        fontSize: 350
      },
      text: '3',
      filename: 'example-ishihara-classic.svg'
    }
  ];

  for (const example of examples) {
    console.log(`🔄 Generating: ${example.name}...`);
    
    try {
      const generator = new ColorVisionGenerator(example.options);
      const outputPath = path.join('output', example.filename);
      
      const result = await generator.generate(example.text, outputPath);
      
      console.log(`   ✅ Success: ${result.circleCount} circles`);
      console.log(`   📁 Saved: ${result.outputPath}`);
      console.log(`   🎨 Format: ${example.options.format || 'png'}`);
      console.log(`   🎯 Palette: ${example.options.palette || 'default'}`);
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }

  // Demonstrate palette API usage
  console.log('🔍 Palette API Examples:');
  console.log('   Protanopia colors:', ColorPalettes.getPalette('protanopia'));
  console.log('   All red-green palettes:', ColorPalettes.getPalettesByDeficiency('red-green'));
  console.log('   Is "protanopia" valid?', ColorPalettes.isValidPalette('protanopia'));
  console.log('   Is "invalid" valid?', ColorPalettes.isValidPalette('invalid'));
  
  console.log('\n🎉 Advanced features demonstration complete!');
  console.log('📂 Check the output/ folder for generated files');
}

// Run the demonstration
if (require.main === module) {
  demonstrateNewFeatures().catch(console.error);
}

module.exports = demonstrateNewFeatures;