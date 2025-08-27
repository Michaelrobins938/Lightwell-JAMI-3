#!/usr/bin/env node

/**
 * Test script to verify the audio pipeline fix
 * This tests the corrected content type for OpenAI Realtime API
 */

const CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  model: 'gpt-4o-realtime-preview',
  voice: 'verse'  // ✅ FIXED: Changed from 'ember' to 'verse'
};

console.log('🔍 Testing Fixed Audio Pipeline...\n');
console.log('📋 Configuration:');
console.log(`   Model: ${CONFIG.model}`);
console.log(`   Voice: ${CONFIG.voice}`);
console.log(`   API Key: ${CONFIG.apiKey ? '***' + CONFIG.apiKey.slice(-4) : 'NOT SET'}\n`);

if (!CONFIG.apiKey || CONFIG.apiKey === 'your-api-key-here') {
  console.error('❌ Please set OPENAI_API_KEY environment variable');
  process.exit(1);
}

/**
 * Test the corrected SDP content type approach
 */
async function testSDPSession() {
  console.log('🧪 Test: SDP Session Creation (Fixed Content Type)');
  console.log('─'.repeat(60));
  
  try {
    console.log('🎯 Testing session creation with correct content type...');
    
    // Create a minimal SDP offer for testing
    const testSDP = `v=0
o=- 1234567890 2 IN IP4 127.0.0.1
s=-
c=IN IP4 127.0.0.1
t=0 0
m=audio 9 UDP/TLS/RTP/SAVPF 111
a=mid:audio
a=sendrecv
a=rtpmap:111 opus/48000/2
a=fmtp:111 minptime=10;useinbandfec=1`;
    
    console.log('📤 Sending SDP offer with application/sdp content type...');
    
    const response = await fetch('https://api.openai.com/v1/realtime', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/sdp', // ✅ CORRECT: This was the issue!
      },
      body: testSDP
    });
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Session created successfully!');
      console.log('📄 Response preview:', data.substring(0, 200) + '...');
      
      // Check if response contains WebSocket URL
      if (data.includes('websocket') || data.includes('ws://') || data.includes('wss://')) {
        console.log('🎯 WebSocket URL found in response');
      } else {
        console.log('💡 Response format:', typeof data);
        console.log('📏 Response length:', data.length);
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Session creation failed');
      console.log('📄 Error details:', errorText);
      
      // Provide specific guidance based on error
      if (response.status === 400) {
        console.log('\n💡 This might be a payload format issue');
        console.log('   The SDP format might need adjustment');
      } else if (response.status === 401) {
        console.log('\n💡 Authentication issue - check your API key');
      } else if (response.status === 403) {
        console.log('\n💡 Permission issue - check your OpenAI account access');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Fetch not available in Node.js < 18');
      console.log('   Try: npm install node-fetch');
    }
  }
  
  console.log('');
}

/**
 * Test models endpoint to verify API access
 */
async function testModelsAccess() {
  console.log('🧪 Test: API Models Access');
  console.log('─'.repeat(60));
  
  try {
    console.log('🔍 Checking available models...');
    
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Models endpoint accessible');
      console.log(`📊 Total models: ${data.data.length}`);
      
      // Look for realtime models
      const realtimeModels = data.data.filter(model => 
        model.id.includes('realtime') || model.id.includes('gpt-4o')
      );
      
      if (realtimeModels.length > 0) {
        console.log('🎯 Realtime models found:');
        realtimeModels.forEach(model => {
          console.log(`   - ${model.id}`);
        });
      } else {
        console.log('⚠️ No realtime models found');
        console.log('💡 First few available models:');
        data.data.slice(0, 5).forEach(model => {
          console.log(`   - ${model.id}`);
        });
      }
      
    } else {
      console.log(`❌ Models endpoint failed: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Models test failed:', error.message);
  }
  
  console.log('');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Fixed Audio Pipeline Tests...\n');
  
  await testModelsAccess();
  await testSDPSession();
  
  console.log('🏁 Tests Complete!');
  console.log('\n📋 Results Summary:');
  console.log('   • If SDP session succeeds: Your content type fix worked! 🎉');
  console.log('   • If it still fails: We need to adjust the SDP format');
  console.log('   • Check the error messages above for specific guidance');
  console.log('\n💡 Next steps:');
  console.log('   1. If successful, test in your browser with the fixed chatClient');
  console.log('   2. If SDP format issue, we\'ll need to create proper WebRTC SDP');
  console.log('   3. Check browser console for audio pipeline logs');
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
