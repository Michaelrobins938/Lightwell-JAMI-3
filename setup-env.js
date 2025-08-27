const { execSync } = require('child_process');

const envVars = [
  // Database Configuration
  { name: 'DATABASE_URL', value: 'file:./dev.db', sensitive: false },

  // OpenRouter Configuration (URL and Model - not already set)
  { name: 'OPENROUTER_API_URL', value: 'https://openrouter.ai/api/v1/chat/completions', sensitive: false },
  { name: 'OPENROUTER_MODEL', value: 'openai/gpt-4o-mini', sensitive: false },

  // OpenAI Realtime TTS - REQUIRED for voice functionality
  { name: 'NEXT_PUBLIC_OPENAI_API_KEY', value: 'your-openai-api-key-here', sensitive: true },

  // ElevenLabs Voice Synthesis
  { name: 'NEXT_PUBLIC_ELEVENLABS_API_KEY', value: 'your-elevenlabs-api-key-here', sensitive: true },

  // Cartesia TTS
  { name: 'CARTESIA_API_KEY', value: 'your-cartesia-api-key-here', sensitive: true },

  // Gemini Vision API (Google Studios AI)
  { name: 'GEMINI_API_KEY', value: 'your-gemini-api-key-here', sensitive: true },

  // Stripe Configuration
  { name: 'STRIPE_SECRET_KEY', value: 'your-stripe-secret-key-here', sensitive: true },
  { name: 'STRIPE_WEBHOOK_SECRET', value: 'your-stripe-webhook-secret-here', sensitive: true },
  { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: 'your-stripe-publishable-key-here', sensitive: false },

  // Email Configuration (if using email services)
  { name: 'SMTP_HOST', value: 'smtp.gmail.com', sensitive: false },
  { name: 'SMTP_PORT', value: '587', sensitive: false },
  { name: 'SMTP_USER', value: 'your-email@gmail.com', sensitive: false },
  { name: 'SMTP_PASS', value: 'your-email-password', sensitive: true },

  // Application Configuration
  { name: 'NODE_ENV', value: 'production', sensitive: false },

  // Social Login Configuration
  { name: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID', value: 'your-google-client-id-here', sensitive: false },
  { name: 'APPLE_CLIENT_ID', value: 'your-apple-client-id-here', sensitive: false },
  { name: 'APPLE_CLIENT_SECRET', value: 'your-apple-client-secret-here', sensitive: true },
  { name: 'MICROSOFT_CLIENT_ID', value: 'your-microsoft-client-id-here', sensitive: false },
  { name: 'MICROSOFT_CLIENT_SECRET', value: 'your-microsoft-client-secret-here', sensitive: true },

  // Redis Configuration (if using Redis for caching)
  { name: 'REDIS_URL', value: 'redis://localhost:6379', sensitive: false },
];

console.log('🚀 Setting up all environment variables for Vercel deployment...\n');

envVars.forEach(({ name, value, sensitive }, index) => {
  try {
    console.log(`📝 Adding ${name}...`);

    // Use a simple echo to pipe the value and avoid interactive prompts
    const command = `echo "${value}" | npx vercel env add ${name} --sensitive=${sensitive} --force`;

    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name} added successfully!\n`);
  } catch (error) {
    console.log(`❌ Failed to add ${name}: ${error.message}\n`);
  }
});

console.log('🎉 Environment variable setup complete!');
console.log('🚀 You can now deploy with: npx vercel --prod');
