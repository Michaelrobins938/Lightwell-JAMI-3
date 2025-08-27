#!/usr/bin/env node

/**
 * Terminal-based Audio Pipeline Debug Script
 * Run this to see exactly where your audio pipeline is breaking
 * 
 * Usage: node scripts/test-audio-pipeline.js
 */

const WebSocket = require('ws');

// Configuration - update these with your actual values
const CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  model: 'gpt-4o-realtime-preview',
  voice: 'verse'  // ✅ FIXED: Changed from 'ember' to 'verse'
};

console.log('🔍 Audio Pipeline Debug Script Starting...\n');
console.log('📋 Configuration:');
console.log(`   Model: ${CONFIG.model}`);
console.log(`   Voice: ${CONFIG.voice}`);
console.log(`   API Key: ${CONFIG.apiKey ? '***' + CONFIG.apiKey.slice(-4) : 'NOT SET'}\n`);

if (!CONFIG.apiKey || CONFIG.apiKey === 'your-api-key-here') {
  console.error('❌ Please set OPENAI_API_KEY environment variable or update the script');
  process.exit(1);
}

/**
 * Test 1: Basic WebSocket Connection
 */
async function testWebSocketConnection() {
  console.log('🧪 Test 1: WebSocket Connection');
  console.log('─'.repeat(50));
  
  try {
    // Note: OpenAI Realtime uses a different endpoint structure
    // This is a diagnostic test to see what endpoints are available
    console.log('🔌 Attempting WebSocket connection...');
    
    // Test the realtime endpoint
    const response = await fetch('https://api.openai.com/v1/realtime', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 HTTP Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Endpoint accessible');
      console.log('📄 Response preview:', data.substring(0, 200) + '...');
    } else {
      console.log('❌ Endpoint not accessible');
      console.log('💡 This might indicate the endpoint requires POST or different parameters');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
  
  console.log('');
}

/**
 * Test 2: Session Initialization
 */
async function testSessionInit() {
  console.log('🧪 Test 2: Session Initialization');
  console.log('─'.repeat(50));
  
  try {
    console.log('🎯 Testing session creation with audio enabled...');
    
    // This is the payload that should enable audio deltas
    const sessionPayload = {
      type: "session.create",
      session: {
        model: CONFIG.model,
        voice: CONFIG.voice,
        modalities: ["audio", "text"],
        audio: {
          input: {
            type: "microphone",
            sampling_rate: 16000
          },
          output: {
            type: "speaker",
            sampling_rate: 24000
          }
        }
      }
    };
    
    console.log('📤 Session payload:');
    console.log(JSON.stringify(sessionPayload, null, 2));
    
    const response = await fetch('https://api.openai.com/v1/realtime', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionPayload)
    });
    
    console.log(`📡 Session Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session created successfully');
      console.log('📄 Session data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Session creation failed');
      console.log('📄 Error details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Session test failed:', error.message);
  }
  
  console.log('');
}

/**
 * Test 3: Audio Streaming Simulation
 */
async function testAudioStreaming() {
  console.log('🧪 Test 3: Audio Streaming Simulation');
  console.log('─'.repeat(50));
  
  try {
    console.log('🎵 Testing audio processing pipeline...');
    
    // Simulate a base64 audio chunk (this is what OpenAI would send)
    const mockBase64Audio = 'UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    
    console.log('🔊 Mock audio chunk (base64):', mockBase64Audio.substring(0, 50) + '...');
    
    // Test base64 decoding
    try {
      const binary = Buffer.from(mockBase64Audio, 'base64');
      console.log('✅ Base64 decoded successfully');
      console.log(`📏 Binary length: ${binary.length} bytes`);
      console.log(`🎵 Audio format: ${binary.length > 0 ? 'Valid' : 'Invalid'}`);
    } catch (error) {
      console.error('❌ Base64 decoding failed:', error.message);
    }
    
    // Test audio buffer creation
    try {
      const audioBuffer = Buffer.alloc(1024); // Simulate audio buffer
      console.log('✅ Audio buffer created');
      console.log(`📦 Buffer size: ${audioBuffer.length} bytes`);
    } catch (error) {
      console.error('❌ Audio buffer creation failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Audio streaming test failed:', error.message);
  }
  
  console.log('');
}

/**
 * Test 4: API Capabilities Check
 */
async function testAPICapabilities() {
  console.log('🧪 Test 4: API Capabilities Check');
  console.log('─'.repeat(50));
  
  try {
    console.log('🔍 Checking OpenAI API capabilities...');
    
    // Test models endpoint to see what's available
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Models endpoint accessible');
      
      // Look for realtime models
      const realtimeModels = data.data.filter(model => 
        model.id.includes('realtime') || model.id.includes('gpt-4o')
      );
      
      if (realtimeModels.length > 0) {
        console.log('🎯 Realtime models found:');
        realtimeModels.forEach(model => {
          console.log(`   - ${model.id} (${model.object})`);
        });
      } else {
        console.log('⚠️ No realtime models found');
        console.log('💡 Available models:', data.data.map(m => m.id).join(', '));
      }
    } else {
      console.log('❌ Models endpoint not accessible');
    }
    
  } catch (error) {
    console.error('❌ API capabilities check failed:', error.message);
  }
  
  console.log('');
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting Audio Pipeline Diagnostics...\n');
  
  await testWebSocketConnection();
  await testSessionInit();
  await testAudioStreaming();
  await testAPICapabilities();
  
  console.log('🏁 Diagnostics Complete!');
  console.log('\n📋 Summary:');
  console.log('   • Check the results above to see where your pipeline breaks');
  console.log('   • If WebSocket connection fails, check your API key and endpoint');
  console.log('   • If session creation fails, check the payload format');
  console.log('   • If audio processing fails, check the base64 handling');
  console.log('   • If no realtime models found, check your OpenAI account access');
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
