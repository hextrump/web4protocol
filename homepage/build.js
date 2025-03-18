const fs = require('fs');

// Get the filename from command line arguments
const inputFile = process.argv[2];

if (!inputFile) {
    console.log('Please specify the JS file to convert');
    console.log('Usage: node build.js filename.js');
    process.exit(1);
}

try {
    // Import the JS file
    const component = require('./' + inputFile);
    
    // Get the first exported object from the file
    const content = Object.values(component)[0];
    
    // Create output filename (replace .js with .json)
    const outputFile = inputFile.replace('.js', '.json');
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
    
    console.log(`Generated ${outputFile}`);

} catch (error) {
    console.error('Conversion failed:', error.message);
} 