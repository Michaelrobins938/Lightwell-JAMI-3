#!/usr/bin/env node

/**
 * Animation Disabler Script
 * Removes all scroll animations from the codebase for clean screenshots
 *
 * Usage:
 * - node scripts/disable-animations.js
 * - node scripts/disable-animations.js --preview (to see what would be changed)
 * - node scripts/disable-animations.js --specific-file src/pages/login.tsx
 *
 * For Windows PowerShell users, see: scripts/disable-animations.ps1
 */

const fs = require('fs');
const path = require('path');

const isPreview = process.argv.includes('--preview');
const specificFile = process.argv.find(arg => arg.includes('--specific-file='))?.split('=')[1];

console.log('🎬 Animation Disabler Script');
console.log('============================\n');

// Patterns to remove (in order of specificity)
const patterns = [
  // Framer Motion scroll animations
  { name: 'whileInView', regex: /whileInView=\{[^}]*\}/g },
  { name: 'whileInView (nested)', regex: /whileInView=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // Initial animation states
  { name: 'initial', regex: /initial=\{[^}]*\}/g },
  { name: 'initial (nested)', regex: /initial=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // Animation props
  { name: 'animate', regex: /animate=\{[^}]*\}/g },
  { name: 'animate (nested)', regex: /animate=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // Exit animations
  { name: 'exit', regex: /exit=\{[^}]*\}/g },
  { name: 'exit (nested)', regex: /exit=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // Transition props
  { name: 'transition', regex: /transition=\{[^}]*\}/g },
  { name: 'transition (nested)', regex: /transition=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // Variants
  { name: 'variants', regex: /variants=\{[^}]*\}/g },
  { name: 'variants (nested)', regex: /variants=\{[^}]*\{[^}]*\}[^}]*\}/g },

  // AOS (Animate On Scroll) attributes
  { name: 'data-aos', regex: /data-aos="[^"]*"/g },

  // Lazy loading
  { name: 'loading="lazy"', regex: /loading="lazy"/g },

  // Motion components (replace with regular divs)
  { name: 'motion.div', regex: /<motion\.div/g, replacement: '<div className="opacity-100"' },
  { name: 'motion.section', regex: /<motion\.section/g, replacement: '<section className="opacity-100"' },
  { name: 'motion.h1', regex: /<motion\.h1/g, replacement: '<h1 className="opacity-100"' },
  { name: 'motion.h2', regex: /<motion\.h2/g, replacement: '<h2 className="opacity-100"' },
  { name: 'motion.p', regex: /<motion\.p/g, replacement: '<p className="opacity-100"' },
  { name: 'motion.button', regex: /<motion\.button/g, replacement: '<button className="opacity-100"' },
  { name: 'motion.span', regex: /<motion\.span/g, replacement: '<span className="opacity-100"' },
];

async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        if (pattern.replacement) {
          content = content.replace(pattern.regex, pattern.replacement);
        } else {
          content = content.replace(pattern.regex, '');
        }
        changes += matches.length;
        console.log(`  ✅ ${pattern.name}: ${matches.length} removed`);
      }
    });

    // Clean up empty props
    content = content.replace(/\s+>\s*/g, '>\n');
    content = content.replace(/(\w+)\s*=\{\s*\}/g, '');
    content = content.replace(/\s+/g, ' ');
    content = content.replace(/\s*\n\s*/g, '\n');

    if (content !== originalContent) {
      if (isPreview) {
        console.log(`📝 Would modify: ${filePath} (${changes} changes)`);
      } else {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✨ Modified: ${filePath} (${changes} changes)`);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Recursively find files with extensions
function findFiles(dir, extensions) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

async function main() {
  console.log('🔍 Scanning for animation patterns...\n');

  let files;

  if (specificFile) {
    files = [specificFile];
  } else {
    // Find all TypeScript/React files
    const extensions = ['.tsx', '.ts'];
    const searchDirs = ['src', 'components', 'pages'];

    files = [];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        files.push(...findFiles(dir, extensions));
      }
    }
  }

  console.log(`📁 Found ${files.length} files to process\n`);

  let totalFiles = 0;
  let totalChanges = 0;

  for (const file of files) {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {
      const modified = await processFile(filePath);
      if (modified) {
        totalFiles++;
      }
    }
  }

  console.log('\n' + '='.repeat(40));
  if (isPreview) {
    console.log(`📊 Preview Complete: ${totalFiles} files would be modified`);
  } else {
    console.log(`✅ Animation Removal Complete: ${totalFiles} files modified`);
  }
  console.log('='.repeat(40));
  console.log('\n💡 Tips:');
  console.log('  - Run with --preview to see changes first');
  console.log('  - Use --specific-file to target one file');
  console.log('  - Check browser console for disableAnimations() function');
  console.log('  - Set DISABLE_ANIMATIONS = true in _app.tsx for runtime disabling');
}

main().catch(console.error);
