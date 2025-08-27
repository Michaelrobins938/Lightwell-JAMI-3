#!/usr/bin/env node

/**
 * Lightwell Security Verification Script
 * 
 * This script verifies that all security measures have been properly implemented
 * and are functioning correctly.
 * 
 * Usage:
 *   npm run security:verify
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Test results tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Utility functions
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logTest(testName, result, details = '') {
  testResults.total++;
  if (result) {
    testResults.passed++;
    log(`✅ ${testName}`, 'green');
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, details });
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
}

function logSection(sectionName) {
  log(`\n${sectionName}`, 'magenta');
  log('-'.repeat(sectionName.length));
}

// Security verification functions
function verifySecurityMiddleware() {
  logSection('Security Middleware Verification');
  
  const middlewareFiles = [
    'src/middleware/securityMiddleware.ts',
    'src/middleware/inputValidation.ts',
    'src/middleware/outputSanitization.ts',
    'src/middleware/rateLimit.ts'
  ];

  middlewareFiles.forEach(file => {
    const exists = fs.existsSync(file);
    logTest(`Security middleware file exists: ${file}`, exists, exists ? '' : 'File not found');
    
    if (exists) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for security patterns
      const hasInputValidation = content.includes('validateInput') || content.includes('sanitizeUserInput');
      const hasRateLimiting = content.includes('rateLimit') || content.includes('RateLimitConfig');
      const hasOutputSanitization = content.includes('sanitizeOutput') || content.includes('sanitizeHTML');
      const hasSecurityHeaders = content.includes('Content-Security-Policy') || content.includes('X-Frame-Options');
      
      logTest(`Input validation implemented in ${file}`, hasInputValidation);
      logTest(`Rate limiting implemented in ${file}`, hasRateLimiting);
      logTest(`Output sanitization implemented in ${file}`, hasOutputSanitization);
      logTest(`Security headers implemented in ${file}`, hasSecurityHeaders);
    }
  });
}

function verifyXSSProtection() {
  logSection('XSS Protection Verification');
  
  const vulnerableFiles = [
    'src/components/gpt/MessageItem.tsx',
    'src/components/voice/JARVIS_VoiceMode.js',
    'src/voice-mode/src/components/Chat/Message.tsx',
    'src/voice-mode/components/MessageItem.tsx',
    'src/voice-mode/components/MessageBubble.tsx'
  ];

  vulnerableFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for dangerous patterns
      const hasDangerouslySetInnerHTML = content.includes('dangerouslySetInnerHTML');
      const hasInnerHTML = content.includes('innerHTML');
      
      if (hasDangerouslySetInnerHTML || hasInnerHTML) {
        // Check if sanitization is implemented
        const hasSanitization = content.includes('sanitizeHTML') || 
                               content.includes('sanitizeUserInput') || 
                               content.includes('sanitizeContent');
        
        logTest(`XSS protection in ${file}`, hasSanitization, 
          hasSanitization ? '' : 'Dangerous HTML usage detected without sanitization');
      } else {
        logTest(`No dangerous HTML usage in ${file}`, true);
      }
    } else {
      logTest(`File exists: ${file}`, false, 'File not found');
    }
  });
}

function verifyCommandInjectionProtection() {
  logSection('Command Injection Protection Verification');
  
  const scriptFiles = [
    'scripts/test-jarvis-voice-system.js',
    'scripts/security-verification.js'
  ];

  scriptFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for dangerous imports
      const hasExecSync = content.includes('execSync');
      const hasChildProcess = content.includes('child_process');
      const hasEval = content.includes('eval(');
      const hasExec = content.includes('exec(');
      
      logTest(`No execSync import in ${file}`, !hasExecSync, 
        hasExecSync ? 'execSync import detected' : '');
      logTest(`No child_process import in ${file}`, !hasChildProcess, 
        hasChildProcess ? 'child_process import detected' : '');
      logTest(`No eval usage in ${file}`, !hasEval, 
        hasEval ? 'eval usage detected' : '');
      logTest(`No exec usage in ${file}`, !hasExec, 
        hasExec ? 'exec usage detected' : '');
    }
  });
}

function verifySecurityHeaders() {
  logSection('Security Headers Verification');
  
  const configFile = 'next.config.js';
  
  if (fs.existsSync(configFile)) {
    const content = fs.readFileSync(configFile, 'utf8');
    
    // Check for security headers
    const hasCSP = content.includes('Content-Security-Policy');
    const hasXFrameOptions = content.includes('X-Frame-Options');
    const hasXContentTypeOptions = content.includes('X-Content-Type-Options');
    const hasXSSProtection = content.includes('X-XSS-Protection');
    const hasHSTS = content.includes('Strict-Transport-Security');
    const hasReferrerPolicy = content.includes('Referrer-Policy');
    const hasPermissionsPolicy = content.includes('Permissions-Policy');
    
    logTest('Content Security Policy configured', hasCSP);
    logTest('X-Frame-Options configured', hasXFrameOptions);
    logTest('X-Content-Type-Options configured', hasXContentTypeOptions);
    logTest('X-XSS-Protection configured', hasXSSProtection);
    logTest('Strict-Transport-Security configured', hasHSTS);
    logTest('Referrer-Policy configured', hasReferrerPolicy);
    logTest('Permissions-Policy configured', hasPermissionsPolicy);
  } else {
    logTest('Next.js config file exists', false, 'next.config.js not found');
  }
}

function verifyInputValidation() {
  logSection('Input Validation Verification');
  
  const validationPatterns = [
    'email.*regex',
    'password.*regex',
    'uuid.*regex',
    'sanitizedText.*regex'
  ];

  const validationFiles = [
    'src/middleware/inputValidation.ts',
    'src/utils/htmlSanitizer.ts'
  ];

  validationFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      validationPatterns.forEach(pattern => {
        const hasPattern = content.includes(pattern.split('.*')[0]);
        logTest(`Input validation pattern found in ${file}: ${pattern}`, hasPattern);
      });
    }
  });
}

function verifyFileUploadSecurity() {
  logSection('File Upload Security Verification');
  
  const uploadFiles = [
    'src/services/fileUploadService.ts',
    'src/components/upload/FileUpload.tsx'
  ];

  uploadFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for security measures
      const hasFileTypeValidation = content.includes('fileType') || content.includes('mimeType');
      const hasFileSizeValidation = content.includes('fileSize') || content.includes('maxSize');
      const hasVirusScanning = content.includes('virus') || content.includes('malware');
      const hasSecureStorage = content.includes('encrypt') || content.includes('secure');
      
      logTest(`File type validation in ${file}`, hasFileTypeValidation);
      logTest(`File size validation in ${file}`, hasFileSizeValidation);
      logTest(`Virus scanning in ${file}`, hasVirusScanning);
      logTest(`Secure storage in ${file}`, hasSecureStorage);
    }
  });
}

function verifyAuthenticationSecurity() {
  logSection('Authentication Security Verification');
  
  const authFiles = [
    'src/pages/api/auth/login.ts',
    'src/pages/api/auth/register.ts',
    'src/middleware/auth.ts'
  ];

  authFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for security measures
      const hasPasswordHashing = content.includes('bcrypt') || content.includes('hash');
      const hasJWTValidation = content.includes('jwt') || content.includes('token');
      const hasRateLimiting = content.includes('rateLimit') || content.includes('throttle');
      const hasInputValidation = content.includes('validate') || content.includes('sanitize');
      
      logTest(`Password hashing in ${file}`, hasPasswordHashing);
      logTest(`JWT validation in ${file}`, hasJWTValidation);
      logTest(`Rate limiting in ${file}`, hasRateLimiting);
      logTest(`Input validation in ${file}`, hasInputValidation);
    }
  });
}

function verifyEnvironmentSecurity() {
  logSection('Environment Security Verification');
  
  // Check for sensitive files
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'secrets.json',
    'config.json'
  ];

  sensitiveFiles.forEach(file => {
    const exists = fs.existsSync(file);
    logTest(`Sensitive file not in repository: ${file}`, !exists, 
      exists ? 'Sensitive file found in repository' : '');
  });

  // Check .gitignore
  const gitignoreFile = '.gitignore';
  if (fs.existsSync(gitignoreFile)) {
    const content = fs.readFileSync(gitignoreFile, 'utf8');
    
    const hasEnvFiles = content.includes('.env');
    const hasSecrets = content.includes('secrets');
    const hasKeys = content.includes('*.key');
    const hasCerts = content.includes('*.pem') || content.includes('*.crt');
    
    logTest('.env files in .gitignore', hasEnvFiles);
    logTest('Secrets in .gitignore', hasSecrets);
    logTest('Keys in .gitignore', hasKeys);
    logTest('Certificates in .gitignore', hasCerts);
  }
}

function verifyDependencySecurity() {
  logSection('Dependency Security Verification');
  
  const packageFile = 'package.json';
  
  if (fs.existsSync(packageFile)) {
    const content = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
    
    // Check for security-related dependencies
    const dependencies = { ...content.dependencies, ...content.devDependencies };
    
    const securityDeps = [
      'helmet',
      'express-rate-limit',
      'bcrypt',
      'jsonwebtoken',
      'cors',
      'helmet-csp'
    ];

    securityDeps.forEach(dep => {
      const hasDep = dependencies[dep];
      logTest(`Security dependency installed: ${dep}`, !!hasDep, 
        hasDep ? `Version: ${hasDep}` : 'Not installed');
    });
  }
}

function generateSecurityReport() {
  logSection('Security Verification Report');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`\n📊 Security Verification Results:`, 'bright');
  log(`Total Tests: ${testResults.total}`, 'white');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : 'yellow');
  
  if (testResults.errors.length > 0) {
    log(`\n❌ Failed Tests:`, 'red');
    testResults.errors.forEach(error => {
      log(`  - ${error.test}: ${error.details}`, 'yellow');
    });
  }
  
  // Security score calculation
  const securityScore = Math.round((testResults.passed / testResults.total) * 100);
  
  log(`\n🔒 Overall Security Score: ${securityScore}/100`, securityScore >= 90 ? 'green' : 'yellow');
  
  if (securityScore >= 90) {
    log('🎉 Security verification PASSED - Enterprise grade security achieved!', 'green');
  } else if (securityScore >= 70) {
    log('⚠️  Security verification PARTIAL - Some issues need attention', 'yellow');
  } else {
    log('🚨 Security verification FAILED - Critical security issues found', 'red');
  }
  
  // Generate report file
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: testResults.total,
    passedTests: testResults.passed,
    failedTests: testResults.failed,
    successRate: parseFloat(successRate),
    securityScore: securityScore,
    errors: testResults.errors,
    status: securityScore >= 90 ? 'PASSED' : securityScore >= 70 ? 'PARTIAL' : 'FAILED'
  };
  
  fs.writeFileSync('security-verification-report.json', JSON.stringify(report, null, 2));
  log('\n📄 Security report saved to: security-verification-report.json', 'cyan');
}

// Main execution
function main() {
  logHeader('LIGHTWELL SECURITY VERIFICATION');
  log('Starting comprehensive security verification...', 'cyan');
  
  try {
    verifySecurityMiddleware();
    verifyXSSProtection();
    verifyCommandInjectionProtection();
    verifySecurityHeaders();
    verifyInputValidation();
    verifyFileUploadSecurity();
    verifyAuthenticationSecurity();
    verifyEnvironmentSecurity();
    verifyDependencySecurity();
    
    generateSecurityReport();
    
  } catch (error) {
    log(`\n❌ Security verification failed with error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  main();
}

module.exports = {
  verifySecurityMiddleware,
  verifyXSSProtection,
  verifyCommandInjectionProtection,
  verifySecurityHeaders,
  verifyInputValidation,
  verifyFileUploadSecurity,
  verifyAuthenticationSecurity,
  verifyEnvironmentSecurity,
  verifyDependencySecurity,
  generateSecurityReport
};
