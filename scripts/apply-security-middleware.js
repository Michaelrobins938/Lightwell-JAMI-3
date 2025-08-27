#!/usr/bin/env node

/**
 * Script to apply security middleware to all API endpoints
 * This script automatically adds withSecurity wrapper to API handlers
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const API_DIR = 'src/pages/api';
const EXCLUDED_FILES = [
  'src/pages/api/chat.ts', // Already secured
  'src/pages/api/security/status.ts', // Already secured
  'src/pages/api/chat/presence.ts', // WebSocket handler
  'src/pages/api/realtime.ts', // WebSocket handler
  'src/pages/api/realtime-proxy.ts', // WebSocket handler
];

// Patterns to identify API handlers
const HANDLER_PATTERNS = [
  /export default async function handler\(/,
  /export default function handler\(/,
  /export default asyncHandler\(/,
  /export default authMiddleware\(/,
];

// Files that need security middleware
const filesToSecure = [];

// Find all API files
function findApiFiles() {
  const pattern = path.join(API_DIR, '**/*.ts');
  const files = glob.sync(pattern);
  
  console.log(`🔍 Found ${files.length} API files`);
  
  files.forEach(file => {
    if (EXCLUDED_FILES.includes(file)) {
      console.log(`⏭️  Skipping excluded file: ${file}`);
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if file already has security middleware
    if (content.includes('withSecurity') || content.includes('SecureRequest')) {
      console.log(`✅ Already secured: ${file}`);
      return;
    }
    
    // Check if file has a handler
    const hasHandler = HANDLER_PATTERNS.some(pattern => pattern.test(content));
    if (hasHandler) {
      filesToSecure.push(file);
      console.log(`🔒 Needs security: ${file}`);
    } else {
      console.log(`⏭️  No handler found: ${file}`);
    }
  });
}

// Apply security middleware to a file
function secureFile(filePath) {
  console.log(`\n🔒 Securing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Add import for security middleware
  if (!content.includes('withSecurity')) {
    const importMatch = content.match(/import.*from.*['"]/);
    if (importMatch) {
      const lastImportIndex = content.lastIndexOf('import');
      const lastImportEnd = content.indexOf('\n', lastImportIndex) + 1;
      
      const securityImport = `import { withSecurity, SecureRequest } from '${getRelativePath(filePath)}/middleware/securityMiddleware';\n`;
      content = content.slice(0, lastImportEnd) + securityImport + content.slice(lastImportEnd);
      modified = true;
    }
  }
  
  // Update handler function signature
  if (content.includes('NextApiRequest') && !content.includes('SecureRequest')) {
    content = content.replace(
      /async function handler\(req: NextApiRequest/g,
      'async function handler(req: SecureRequest'
    );
    content = content.replace(
      /function handler\(req: NextApiRequest/g,
      'function handler(req: SecureRequest'
    );
    modified = true;
  }
  
  // Wrap handler with withSecurity
  if (!content.includes('withSecurity(')) {
    // Handle different export patterns
    const patterns = [
      /export default async function handler\(/g,
      /export default function handler\(/g,
      /export default asyncHandler\(/g,
      /export default authMiddleware\(/g,
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, 'export default withSecurity(');
        content = content.replace(/\);\s*$/, '));');
        modified = true;
      }
    });
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Secured: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

// Get relative path for import
function getRelativePath(filePath) {
  const depth = filePath.split('/').length - 3; // Remove src/pages/api
  return '../'.repeat(depth);
}

// Main execution
function main() {
  console.log('🛡️  Applying Security Middleware to API Endpoints');
  console.log('================================================\n');
  
  // Find files to secure
  findApiFiles();
  
  console.log(`\n📊 Summary:`);
  console.log(`- Total API files found: ${glob.sync(path.join(API_DIR, '**/*.ts')).length}`);
  console.log(`- Files to secure: ${filesToSecure.length}`);
  
  if (filesToSecure.length === 0) {
    console.log('\n🎉 All API endpoints are already secured!');
    return;
  }
  
  console.log('\n🔒 Applying security middleware...\n');
  
  let securedCount = 0;
  filesToSecure.forEach(file => {
    if (secureFile(file)) {
      securedCount++;
    }
  });
  
  console.log(`\n📊 Results:`);
  console.log(`- Files processed: ${filesToSecure.length}`);
  console.log(`- Files secured: ${securedCount}`);
  console.log(`- Files skipped: ${filesToSecure.length - securedCount}`);
  
  if (securedCount > 0) {
    console.log('\n✅ Security middleware applied successfully!');
    console.log('\n⚠️  Next steps:');
    console.log('1. Review the changes to ensure they are correct');
    console.log('2. Test the API endpoints to ensure they still work');
    console.log('3. Update any TypeScript errors that may occur');
    console.log('4. Run the application to verify security is working');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { findApiFiles, secureFile };
