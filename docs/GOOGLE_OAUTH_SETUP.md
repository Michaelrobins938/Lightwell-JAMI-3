# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Lightwell application.

## Prerequisites

1. A Google Cloud Platform account
2. Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Services API

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Lightwell"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users if you're in testing mode

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
6. Click "Create"

## Step 4: Get Your Client ID

1. After creating the OAuth 2.0 client, you'll see a popup with your client ID
2. Copy the client ID (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## Step 5: Configure Environment Variables

1. Add the following to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id-here"
   ```

2. For production, add the same variable to your Vercel environment variables

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click the "Continue with Google" button
4. You should see the Google sign-in popup

## Troubleshooting

### Google Sign-In Button Not Appearing
- Make sure the Google Client ID is correctly set in your environment variables
- Check the browser console for any JavaScript errors
- Verify that the Google Identity Services script is loading

### Authentication Fails
- Check that your OAuth consent screen is properly configured
- Verify that the redirect URIs match your application URLs
- Ensure the required scopes are added to the OAuth consent screen

### CORS Errors
- Make sure your authorized JavaScript origins include your domain
- For development, ensure `http://localhost:3000` is included

## Security Considerations

1. **Client ID Security**: The client ID is public and safe to include in client-side code
2. **Token Verification**: The application verifies Google ID tokens on the server side
3. **HTTPS**: Always use HTTPS in production for secure token transmission
4. **Environment Variables**: Never commit your client ID to version control

## Production Deployment

1. Update your OAuth consent screen with your production domain
2. Add your production domain to authorized JavaScript origins
3. Set the environment variable in your hosting platform (Vercel, etc.)
4. Test the authentication flow in production

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
