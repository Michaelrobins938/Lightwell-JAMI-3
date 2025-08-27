#!/usr/bin/env node

/**
 * Test script for Voice API endpoints
 * Tests the complete flow: health check -> start session -> send chunk -> update transcript -> end session
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';

// Simple HTTP request helper
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = (options.protocol === 'https:' ? https : http).request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function testVoiceAPI() {
  console.log('🧪 Testing Voice API endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/voice/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Healthy: ${healthResponse.body.healthy}`);
    
    if (healthResponse.status !== 200 || !healthResponse.body.healthy) {
      console.error('❌ Health check failed');
      return;
    }
    console.log('   ✅ Health check passed\n');

    // Test 2: Start session
    console.log('2. Testing session start...');
    const sessionData = {
      language: 'en-US',
      personality: null,
      userId: 'test-user-123'
    };

    const startResponse = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/voice/session/start',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(sessionData));

    console.log(`   Status: ${startResponse.status}`);
    console.log(`   Success: ${startResponse.body.success}`);
    
    if (startResponse.status !== 200 || !startResponse.body.success) {
      console.error('❌ Session start failed');
      return;
    }

    const sessionId = startResponse.body.sessionId;
    console.log(`   Session ID: ${sessionId}`);
    console.log('   ✅ Session started successfully\n');

    // Test 3: Update transcript
    console.log('3. Testing transcript update...');
    const transcriptData = {
      sessionId: sessionId,
      transcript: 'Hello, this is a test transcript for the voice API.'
    };

    const transcriptResponse = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/voice/transcript',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(transcriptData));

    console.log(`   Status: ${transcriptResponse.status}`);
    console.log(`   Success: ${transcriptResponse.body.success}`);
    
    if (transcriptResponse.status !== 200 || !transcriptResponse.body.success) {
      console.error('❌ Transcript update failed');
      return;
    }

    console.log(`   Word count: ${transcriptResponse.body.transcript.wordCount}`);
    console.log('   ✅ Transcript updated successfully\n');

    // Test 4: End session
    console.log('4. Testing session end...');
    const endData = {
      id: sessionId,
      endTime: new Date().toISOString(),
      transcript: 'Final transcript: Hello, this is a test transcript for the voice API.'
    };

    const endResponse = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/voice/session/end',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(endData));

    console.log(`   Status: ${endResponse.status}`);
    console.log(`   Success: ${endResponse.body.success}`);
    
    if (endResponse.status !== 200 || !endResponse.body.success) {
      console.error('❌ Session end failed');
      return;
    }

    console.log(`   Duration: ${endResponse.body.session.duration}ms`);
    console.log('   ✅ Session ended successfully\n');

    console.log('🎉 All Voice API tests passed!\n');

    // Summary
    console.log('📊 Test Summary:');
    console.log('   ✅ Health check endpoint working');
    console.log('   ✅ Session start endpoint working');
    console.log('   ✅ Transcript update endpoint working');
    console.log('   ✅ Session end endpoint working');
    console.log('\n🚀 Voice API is ready for frontend integration!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/',
      method: 'GET',
      timeout: 2000
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ Server is not running on localhost:3001');
    console.log('Please run: npm run dev');
    process.exit(1);
  }

  console.log('✅ Server is running\n');
  await testVoiceAPI();
}

if (require.main === module) {
  main();
}