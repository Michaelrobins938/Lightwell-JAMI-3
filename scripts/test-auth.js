#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3005'; // Using the port from your dev server

async function testAuth() {
  console.log('🧪 Testing Authentication System\n');

  // Test 1: Sign up a new user
  console.log('1. Testing user signup...');
  try {
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
      }),
    });

    const signupData = await signupResponse.json();
    
    if (signupResponse.ok) {
      console.log('✅ Signup successful');
      console.log('   Token received:', signupData.token ? 'Yes' : 'No');
      console.log('   User data received:', signupData.user ? 'Yes' : 'No');
      console.log('   User ID:', signupData.user?.id);
      console.log('   User email:', signupData.user?.email);
    } else {
      console.log('❌ Signup failed:', signupData.error);
      return;
    }

    // Test 2: Login with the created user
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123!',
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log('   Token received:', loginData.token ? 'Yes' : 'No');
      console.log('   User data received:', loginData.user ? 'Yes' : 'No');
      console.log('   User ID:', loginData.user?.id);
      console.log('   User email:', loginData.user?.email);
      console.log('   Subscription tier:', loginData.user?.subscriptionTier);
      console.log('   Jamie access:', loginData.user?.jamieAccess);
    } else {
      console.log('❌ Login failed:', loginData.error);
    }

    // Test 3: Login with wrong password
    console.log('\n3. Testing login with wrong password...');
    const wrongPasswordResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'WrongPassword123!',
      }),
    });

    const wrongPasswordData = await wrongPasswordResponse.json();
    
    if (!wrongPasswordResponse.ok) {
      console.log('✅ Wrong password correctly rejected');
      console.log('   Error message:', wrongPasswordData.error);
    } else {
      console.log('❌ Wrong password was accepted (security issue!)');
    }

    // Test 4: Login with non-existent user
    console.log('\n4. Testing login with non-existent user...');
    const nonExistentResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'TestPassword123!',
      }),
    });

    const nonExistentData = await nonExistentResponse.json();
    
    if (!nonExistentResponse.ok) {
      console.log('✅ Non-existent user correctly rejected');
      console.log('   Error message:', nonExistentData.error);
    } else {
      console.log('❌ Non-existent user was accepted (security issue!)');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🎉 Authentication test completed!');
}

// Run the test
testAuth().catch(console.error);
