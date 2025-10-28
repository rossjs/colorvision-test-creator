const ColorVisionGenerator = require('../src/colorvision-generator');

/**
 * Basic usage examples for ColorVision Test Creator
 */
async function runExamples() {
  console.log('🎨 ColorVision Test Creator - Basic Usage Examples');
  console.log('=================================================\n');

  try {
    // Example 1: Basic number generation
    console.log('Example 1: Generating basic number test...');
    const basicGenerator = new ColorVisionGenerator({
      width: 600,
      height: 600,
      fontSize: 200
    });
    
    await basicGenerator.generate('8', 'examples/output/basic-8.png');
    console.log('✅ Created: examples/output/basic-8.png\n');

    // Example 2: Circular test with custom colors
    console.log('Example 2: Generating circular test with custom colors...');
    const circularGenerator = new ColorVisionGenerator({
      width: 800,
      height: 800,
      fontSize: 300,
      circular: true,
      margin: 80,
      onColor: '#D2691E',  // Chocolate
      offColor: '#32CD32'  // Lime green
    });
    
    await circularGenerator.generate('3', 'examples/output/circular-3.png');
    console.log('✅ Created: examples/output/circular-3.png\n');

    // Example 3: Multi-character text
    console.log('Example 3: Generating multi-character test...');
    const multiGenerator = new ColorVisionGenerator({
      width: 1000,
      height: 600,
      fontSize: 200,
      margin: 60,
      onColor: '#B22222',  // Fire brick
      offColor: '#6B8E23'  // Olive drab
    });
    
    await multiGenerator.generate('42', 'examples/output/multi-42.png');
    console.log('✅ Created: examples/output/multi-42.png\n');

    // Example 4: Maximum text fit in circular mode
    console.log('Example 4: Generating circular test with maximum text fit...');
    const maxFitGenerator = new ColorVisionGenerator({
      width: 800,
      height: 800,
      circular: true,
      maxTextFit: true,
      onColor: '#FF6B35',
      offColor: '#4ECDC4'
    });
    
    await maxFitGenerator.generate('A', 'examples/output/maxfit-A.png');
    console.log('✅ Created: examples/output/maxfit-A.png\n');

    // Example 5: Fine-tuned circle parameters
    console.log('Example 5: Generating test with fine-tuned parameters...');
    const fineTunedGenerator = new ColorVisionGenerator({
      width: 800,
      height: 800,
      fontSize: 250,
      minRadius: 2,
      maxRadius: 15,
      tolerance: 0.15,
      onColor: '#CD5C5C',  // Indian red
      offColor: '#88B04B'  // Sage green
    });
    
    await fineTunedGenerator.generate('7', 'examples/output/finetuned-7.png');
    console.log('✅ Created: examples/output/finetuned-7.png\n');

    console.log('🎉 All examples completed successfully!');
    console.log('Check the examples/output/ directory for generated images.');

  } catch (error) {
    console.error('❌ Error running examples:', error.message);
    process.exit(1);
  }
}

// Run examples if called directly
if (require.main === module) {
  runExamples();
}

module.exports = { runExamples };