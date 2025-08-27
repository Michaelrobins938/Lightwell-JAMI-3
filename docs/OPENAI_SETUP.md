# OpenAI API Key Setup Guide

## 🔑 **Quick Fix for 401 Unauthorized Error**

The error you're seeing is because the OpenAI API key is either missing or invalid. Here's how to fix it:

### **Option 1: Create a .env.local file (Recommended)**

1. Create a file called `.env.local` in your project root:
```bash
# Create the file
touch .env.local
```

2. Add your OpenAI API key to the file:
```env
# OpenAI API Key (get one from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Alternative (if you prefer public env var)
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### **Option 2: Set Environment Variable in Vercel**

If you're deploying to Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-your-actual-api-key-here`
   - **Environment**: Production, Preview, Development

### **Option 3: Get an OpenAI API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add it to your environment variables

### **Option 4: Use Demo Mode (Temporary)**

If you want to test without an API key, the app will automatically fall back to local mode.

## 🔧 **Restart Required**

After setting the environment variable:
1. Stop your development server (`Ctrl+C`)
2. Restart it: `npm run dev`
3. Try connecting to OpenAI again

## 🎯 **Test the Connection**

Once you've set up your API key:
1. Go to the fullscreen orb page
2. Click the WiFi button to connect to OpenAI
3. You should see "Connected to OpenAI Realtime" in the status

## 🚨 **Important Notes**

- **Never commit your API key** to version control
- **Use `.env.local`** for local development (it's already in `.gitignore`)
- **The key starts with `sk-`** - make sure you copy the full key
- **Check your OpenAI account** has sufficient credits for the Realtime API

## 🔍 **Troubleshooting**

If you still get 401 errors:
1. Verify your API key is correct
2. Check your OpenAI account has access to GPT-4o Realtime
3. Ensure you have sufficient credits
4. Try regenerating your API key

## 📱 **Fullscreen Permission Fix**

The fullscreen permission error is now fixed! The app will only request fullscreen when you click the fullscreen button (��) in the controls.


