#!/usr/bin/env node

// Simple test script to debug README file finding
const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('Arguments:', process.argv.slice(2));
console.log('');

// Function to recursively find all README.md files
function findReadmeFiles(dir, results = []) {
    try {
        const items = fs.readdirSync(dir);
        console.log(`Scanning directory: ${dir} (${items.length} items)`);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            // Skip excluded directories
            if (stat.isDirectory()) {
                if (item === 'readmes' ||
                    item === 'node_modules' ||
                    item === '.git' ||
                    item === 'archive' ||
                    item.includes('backup')) {
                    console.log(`  Skipping excluded directory: ${item}`);
                    continue;
                }
                console.log(`  Entering directory: ${item}`);
                findReadmeFiles(fullPath, results);
            } else if (item.toLowerCase() === 'readme.md') {
                console.log(`  Found README.md: ${fullPath}`);
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error scanning directory ${dir}:`, error.message);
    }

    return results;
}

// Find all README.md files
console.log('Starting README.md search...');
const readmeFiles = findReadmeFiles(process.cwd());

console.log('');
console.log(`Found ${readmeFiles.length} README.md files:`);
readmeFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${path.relative(process.cwd(), file)}`);
});

console.log('');
console.log('Test complete.');
