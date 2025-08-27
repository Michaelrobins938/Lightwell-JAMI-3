# Google OAuth Quick Setup Guide

## Current Error
You're seeing: "Missing required parameter: client_id" because the Google OAuth client ID is not configured.

## Quick Fix Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google+ API" and "Google Identity Services API"

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Luna Mental Health"
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `openid`, `email`, `profile`
5. Add test users (your email) if in testing mode

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)
6. Click "Create"

### 4. Get Your Client ID
- Copy the client ID (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

### 5. Set Environment Variable
Create or update your `.env.local` file:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-actual-client-id-here"
```

### 6. Restart Development Server
```bash
npm run dev
```

## Troubleshooting

### If you still get the error:
1. Check that `.env.local` file exists in project root
2. Verify the client ID is correct (no extra spaces)
3. Restart the development server
4. Clear browser cache

### For Production:
1. Add the same environment variable to your hosting platform (Vercel, etc.)
2. Update OAuth consent screen with production domain
3. Add production domain to authorized origins

## Security Notes
- The client ID is public and safe to include in client-side code
- Never commit your `.env.local` file to version control
- The server-side verification ensures security

## Test the Integration
1. Go to `/auth/login`
2. Click "Continue with Google"
3. You should see the Google sign-in popup
4. Complete the authentication flow

## Need Help?
- Check the browser console for detailed error messages
- Verify all steps in the OAuth consent screen
- Ensure the Google APIs are enabled in your project
