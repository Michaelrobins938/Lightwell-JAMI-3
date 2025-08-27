#!/usr/bin/env node

/**
 * Scroll Animation Fixer - GPT-5 Theme Consistency
 * Removes scroll-triggered animations for consistent full-page renders
 *
 * Usage:
 * - node scripts/fix-scroll-animations.js --preview
 * - node scripts/fix-scroll-animations.js --fix
 * - node scripts/fix-scroll-animations.js --fix-login-only
 */

const fs = require('fs');
const path = require('path');

const isPreview = process.argv.includes('--preview');
const fixLoginOnly = process.argv.includes('--fix-login-only');
const shouldFix = process.argv.includes('--fix');

console.log('🎬 Scroll Animation Fixer');
console.log('=========================\n');

// Specific patterns that cause scroll-triggered animations
const scrollAnimationPatterns = [
  // Framer Motion whileInView patterns
  {
    name: 'whileInView with viewport once',
    pattern: /whileInView=\{[^}]+\}\s*viewport=\{[^}]+\}/g,
    replacement: 'animate={{ opacity: 1, y: 0 }}'
  },
  {
    name: 'whileInView simple',
    pattern: /whileInView=\{[^}]+\}/g,
    replacement: 'animate={{ opacity: 1, y: 0 }}'
  },

  // Common whileInView patterns
  {
    name: 'whileInView opacity y',
    pattern: /whileInView=\{\{\s*opacity:\s*1,\s*y:\s*0\s*\}\}/g,
    replacement: 'animate={{ opacity: 1, y: 0 }}'
  },
  {
    name: 'whileInView opacity x',
    pattern: /whileInView=\{\{\s*opacity:\s*1,\s*x:\s*0\s*\}\}/g,
    replacement: 'animate={{ opacity: 1, x: 0 }}'
  },
  {
    name: 'whileInView opacity scale',
    pattern: /whileInView=\{\{\s*opacity:\s*1,\s*scale:\s*1\s*\}\}/g,
    replacement: 'animate={{ opacity: 1, scale: 1 }}'
  },

  // Viewport with once pattern
  {
    name: 'viewport once',
    pattern: /viewport=\{[^}]*once[^}]*\}/g,
    replacement: ''
  },

  // AOS data attributes
  {
    name: 'data-aos fade-up',
    pattern: /data-aos="fade-up"/g,
    replacement: ''
  },
  {
    name: 'data-aos fade-in',
    pattern: /data-aos="fade-in"/g,
    replacement: ''
  },
  {
    name: 'data-aos any',
    pattern: /data-aos="[^"]*"/g,
    replacement: ''
  },

  // Tailwind opacity-0 classes that hide content initially
  {
    name: 'opacity-0 translate-y',
    pattern: /opacity-0\s+translate-y-\d+/g,
    replacement: 'opacity-100'
  },
  {
    name: 'opacity-0 translate-x',
    pattern: /opacity-0\s+translate-x-\d+/g,
    replacement: 'opacity-100'
  },
  {
    name: 'opacity-0 scale',
    pattern: /opacity-0\s+scale-\d+/g,
    replacement: 'opacity-100'
  },

  // Intersection observer hooks
  {
    name: 'useInView hook',
    pattern: /const\s*\[.*\]\s*=\s*useInView\([^)]*\);?/g,
    replacement: '// const [inView] = useInView(); // Removed for consistent rendering'
  },
];

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

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    console.log(`📄 Processing: ${filePath.replace(process.cwd(), '')}`);

    scrollAnimationPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changes += matches.length;
        console.log(`  ✅ ${pattern.name}: ${matches.length} fixed`);
      }
    });

    // Additional cleanup for motion components with whileInView
    if (content.includes('whileInView')) {
      // Replace whileInView with animate and remove viewport
      content = content.replace(
        /whileInView=\{([^}]+)\}/g,
        'animate={$1}'
      );
      content = content.replace(
        /viewport=\{[^}]+\}/g,
        ''
      );
      console.log('  ✅ Additional whileInView cleanup');
    }

    // Clean up empty props and extra whitespace
    content = content.replace(/\s+>\s*/g, '>\n');
    content = content.replace(/(\w+)\s*=\{\s*\}/g, '');
    content = content.replace(/\s+/g, ' ');

    if (content !== originalContent) {
      if (isPreview || (!shouldFix && !fixLoginOnly)) {
        console.log(`  📝 Would modify: ${changes} changes`);
        return true;
      } else {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✨ Modified: ${changes} changes`);
        return true;
      }
    } else {
      console.log(`  ⏭️  No changes needed`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding scroll-triggered animations...\n');

  let files;

  if (fixLoginOnly) {
    files = ['src/pages/login.tsx'];
    console.log('🎯 Targeting login page only\n');
  } else {
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    const searchDirs = ['src'];

    files = [];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        files.push(...findFiles(dir, extensions));
      }
    }
    console.log(`📁 Found ${files.length} files to process\n`);
  }

  let totalFiles = 0;
  let totalChanges = 0;

  for (const file of files) {
    if (processFile(file)) {
      totalFiles++;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (isPreview) {
    console.log(`📊 Preview Complete: ${totalFiles} files would be modified`);
  } else if (shouldFix || fixLoginOnly) {
    console.log(`✅ Animation Fix Complete: ${totalFiles} files modified`);
  } else {
    console.log(`📋 Scan Complete: ${totalFiles} files need attention`);
  }
  console.log('='.repeat(50));
  console.log('\n💡 Tips:');
  console.log('  - Use --preview to see changes first');
  console.log('  - Use --fix-login-only for just the login page');
  console.log('  - Use --fix for the entire codebase');
  console.log('  - Set DISABLE_SCROLL_ANIMATIONS = true for runtime override');

  // Show what was fixed
  if (totalFiles > 0) {
    console.log('\n🎯 Fixed Patterns:');
    scrollAnimationPatterns.forEach(pattern => {
      console.log(`  • ${pattern.name}`);
    });
  }
}

if (process.argv.includes('--help') || process.argv.length === 2) {
  console.log('\nUsage:');
  console.log('  node scripts/fix-scroll-animations.js --preview');
  console.log('  node scripts/fix-scroll-animations.js --fix');
  console.log('  node scripts/fix-scroll-animations.js --fix-login-only');
  process.exit(0);
}

main().catch(console.error);

