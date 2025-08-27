#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Google OAuth Setup Helper\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Google OAuth Configuration
# Get this from Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-actual-google-client-id-here"

# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# AI Services
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_API_URL="https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL="openai/gpt-4o-mini"
OPENAI_API_KEY="your-openai-api-key"

# Application Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable "Google+ API" and "Google Identity Services API"');
console.log('4. Go to "APIs & Services" > "OAuth consent screen"');
console.log('5. Configure the consent screen with your app details');
console.log('6. Go to "APIs & Services" > "Credentials"');
console.log('7. Create OAuth 2.0 Client ID for Web application');
console.log('8. Add http://localhost:3000 to authorized JavaScript origins');
console.log('9. Copy the Client ID and update .env.local file');
console.log('10. Restart your development server');

console.log('\n📖 For detailed instructions, see: docs/GOOGLE_OAUTH_QUICK_SETUP.md');
console.log('\n🚀 After setup, run: npm run dev');
