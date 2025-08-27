@echo off
echo Setting up all environment variables for Vercel deployment...

REM Database Configuration
npx vercel env add DATABASE_URL "file:./dev.db" --sensitive false

REM JWT Configuration
npx vercel env add JWT_SECRET "your-super-secret-jwt-key-here" --sensitive true

REM AI Services - REQUIRED for full functionality
npx vercel env add OPENAI_API_KEY "your-openai-api-key-here" --sensitive true

REM OpenRouter API - REQUIRED for therapeutic chat responses
npx vercel env add OPENROUTER_API_KEY "your-openrouter-api-key-here" --sensitive true
npx vercel env add OPENROUTER_API_URL "https://openrouter.ai/api/v1/chat/completions" --sensitive false
npx vercel env add OPENROUTER_MODEL "openai/gpt-4o-mini" --sensitive false

REM OpenAI Realtime TTS - REQUIRED for voice functionality
npx vercel env add NEXT_PUBLIC_OPENAI_API_KEY "your-openai-api-key-here" --sensitive true

REM ElevenLabs Voice Synthesis
npx vercel env add NEXT_PUBLIC_ELEVENLABS_API_KEY "your-elevenlabs-api-key-here" --sensitive true

REM Cartesia TTS
npx vercel env add CARTESIA_API_KEY "your-cartesia-api-key-here" --sensitive true

REM Gemini Vision API (Google Studios AI)
npx vercel env add GEMINI_API_KEY "your-gemini-api-key-here" --sensitive true

REM Stripe Configuration
npx vercel env add STRIPE_SECRET_KEY "your-stripe-secret-key-here" --sensitive true
npx vercel env add STRIPE_WEBHOOK_SECRET "your-stripe-webhook-secret-here" --sensitive true
npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "your-stripe-publishable-key-here" --sensitive false

REM Email Configuration (if using email services)
npx vercel env add SMTP_HOST "smtp.gmail.com" --sensitive false
npx vercel env add SMTP_PORT "587" --sensitive false
npx vercel env add SMTP_USER "your-email@gmail.com" --sensitive false
npx vercel env add SMTP_PASS "your-email-password" --sensitive true

REM Application Configuration
npx vercel env add NEXT_PUBLIC_BASE_URL "https://lightwell-jami-3.vercel.app" --sensitive false
npx vercel env add NODE_ENV "production" --sensitive false

REM Social Login Configuration
npx vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID "your-google-client-id-here" --sensitive false
npx vercel env add APPLE_CLIENT_ID "your-apple-client-id-here" --sensitive false
npx vercel env add APPLE_CLIENT_SECRET "your-apple-client-secret-here" --sensitive true
npx vercel env add MICROSOFT_CLIENT_ID "your-microsoft-client-id-here" --sensitive false
npx vercel env add MICROSOFT_CLIENT_SECRET "your-microsoft-client-secret-here" --sensitive true

REM Redis Configuration (if using Redis for caching)
npx vercel env add REDIS_URL "redis://localhost:6379" --sensitive false

echo All environment variables have been added to Vercel!
echo You can now deploy with: npx vercel --prod
