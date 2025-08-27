#!/usr/bin/env node

/**
 * Fix Ember Voice Script
 * 
 * This script helps find and replace all instances of 'ember' voice with 'verse'
 * throughout your project to fix the OpenAI Realtime API errors.
 * 
 * Usage: node scripts/fix-ember-voices.js
 */

const fs = require('fs');
const path = require('path');

// Files that need manual fixing (based on grep search)
const criticalFiles = [
  'src/voice-mode/components/VoiceModeInterface.tsx',
  'src/voice-mode/components/NarratorOrb.tsx', 
  'src/voice-mode/VoiceOrb.tsx',
  'src/voice-mode/useVoiceMode.ts',
  'src/pages/ChatGPTPage.tsx',
  'src/components/gpt/InputBar.tsx',
  'scripts/test-fixed-audio.js',
  'scripts/test-audio-pipeline.js'
];

console.log('🔍 Ember Voice Fix Script');
console.log('========================\n');

console.log('❌ CRITICAL: Found multiple files still using "ember" voice');
console.log('💡 This is why your OpenAI Realtime API calls are failing!\n');

console.log('📋 Files that need manual fixing:');
criticalFiles.forEach((file, index) => {
  console.log(`  ${index + 1}. ${file}`);
});

console.log('\n🔧 Manual Fix Instructions:');
console.log('==========================');
console.log('1. Open each file above');
console.log('2. Find and replace ALL instances of:');
console.log('   - voice: "ember" → voice: "verse"');
console.log('   - voicePersonality: "ember" → voicePersonality: "verse"');
console.log('   - personality: "ember" → personality: "verse"');
console.log('   - currentVoice: "ember" → currentVoice: "verse"');
console.log('   - \'ember\' → \'verse\' (in voice configurations)');

console.log('\n🎯 Valid OpenAI Voices:');
console.log('======================');
console.log('• alloy    - Warm and conversational');
console.log('• ash      - Calm and soothing');
console.log('• ballad   - Gentle and melodic');
console.log('• coral    - Bright and energetic');
console.log('• echo     - Clear and resonant');
console.log('• sage     - Wise and measured');
console.log('• shimmer  - Soft and ethereal');
console.log('• verse    - Rich and expressive (RECOMMENDED)');

console.log('\n⚠️  IMPORTANT:');
console.log('==============');
console.log('• After fixing, HARD REFRESH your browser (Ctrl+F5)');
console.log('• The browser caches JavaScript, so changes won\'t take effect until then');
console.log('• Test with: chatClient.testCorrectedConfig()');

console.log('\n🚀 Quick Test After Fixing:');
console.log('===========================');
console.log('1. Fix all files above');
console.log('2. Hard refresh browser (Ctrl+F5)');
console.log('3. Run: chatClient.checkAndRefreshConfig()');
console.log('4. Run: chatClient.testCorrectedConfig()');

console.log('\n✅ Expected Results:');
console.log('===================');
console.log('• No more "Invalid voice" errors');
console.log('• No more "Unknown parameter" errors');
console.log('• Real audio flowing through your pipeline');
console.log('• Audio analyser showing real levels (not 0.0000)');
console.log('• Your orb/particles lighting up with real audio');
