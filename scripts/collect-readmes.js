#!/usr/bin/env node

/**
 * Node.js script to collect all README.md files from the project
 * and move them to a centralized readmes folder
 *
 * Usage: node collect-readmes.js [--dry-run] [--target-folder=folder-name]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const targetFolderArg = args.find(arg => arg.startsWith('--target-folder='));
const targetFolder = targetFolderArg ? targetFolderArg.split('=')[1] : 'readmes';

console.log('=== README.md Collection Script ===');
console.log(`Target folder: ${targetFolder}`);
if (dryRun) {
    console.log('DRY RUN mode - no files will be moved');
}
console.log('');

// Create target folder if it doesn't exist
const targetPath = path.join(process.cwd(), targetFolder);
if (!fs.existsSync(targetPath)) {
    if (!dryRun) {
        fs.mkdirSync(targetPath, { recursive: true });
        console.log(`Created folder: ${targetFolder}`);
    } else {
        console.log(`[DRY RUN] Would create folder: ${targetFolder}`);
    }
}

// Function to recursively find all README.md files
function findReadmeFiles(dir, results = []) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        // Skip excluded directories
        if (stat.isDirectory()) {
            if (item === targetFolder ||
                item === 'node_modules' ||
                item === '.git' ||
                item === 'archive' ||
                item.includes('backup')) {
                continue;
            }
            findReadmeFiles(fullPath, results);
        } else if (item.toLowerCase() === 'readme.md') {
            results.push(fullPath);
        }
    }

    return results;
}

// Find all README.md files
const readmeFiles = findReadmeFiles(process.cwd());

console.log(`Found ${readmeFiles.length} README.md files:`);
console.log('');

let counter = 0;
for (const readmePath of readmeFiles) {
    counter++;

    // Generate a descriptive name based on the file's original location
    const relativePath = path.relative(process.cwd(), readmePath);
    const cleanName = relativePath
        .replace(/\\README\.md$/, '')
        .replace(/\\/g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();

    // Handle special cases
    let newName;
    if (cleanName === 'readme') {
        newName = 'main-readme.md';
    } else if (cleanName.startsWith('src-')) {
        newName = cleanName.replace('src-', '') + '-readme.md';
    } else {
        newName = cleanName + '-readme.md';
    }

    const targetFilePath = path.join(targetPath, newName);

    console.log(`${counter}. ${relativePath}`);
    console.log(`   -> ${targetFolder}/${newName}`);

    if (!dryRun) {
        try {
            // Move the file
            fs.renameSync(readmePath, targetFilePath);
            console.log('   Moved successfully');
        } catch (error) {
            console.error(`   Error moving file: ${error.message}`);
        }
    } else {
        console.log('   [DRY RUN] Would move file');
    }

    console.log('');
}

if (dryRun) {
    console.log('DRY RUN COMPLETED - No files were actually moved');
    console.log('Run without --dry-run flag to execute the moves');
} else {
    console.log('COLLECTION COMPLETED - All README.md files have been moved');
}

console.log('=== Script Complete ===');
