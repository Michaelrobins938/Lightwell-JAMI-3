# 🎯 Azure TTS Setup Guide

## 🚀 **Get Your Free Azure TTS API Key**

### **Step 1: Create Azure Account**
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a **free account** (no credit card required for free tier)
3. You get **$200 free credit** and **500,000 characters/month free** for TTS

### **Step 2: Create Speech Service**
1. In Azure Portal, search for "Speech Services"
2. Click "Create"
3. Choose your subscription and resource group
4. **Region**: Choose `East US` (or any region close to you)
5. **Name**: Give it a name like "LunaWeb-TTS"
6. **Pricing tier**: Choose "Free (F0)" - this gives you 500k characters/month
7. Click "Review + Create" then "Create"

### **Step 3: Get Your API Key**
1. Once created, go to your Speech Service resource
2. In the left menu, click "Keys and Endpoint"
3. Copy **Key 1** and **Location/Region**
4. You'll need both for the environment variables

## 🔧 **Set Up Environment Variables**

Create a `.env.local` file in your project root:

```bash
# Azure Cognitive Services TTS Configuration
NEXT_PUBLIC_AZURE_SPEECH_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_AZURE_SPEECH_REGION=eastus
```

**Replace:**
- `your_actual_api_key_here` with your actual Azure API key
- `eastus` with your actual region (like `westus`, `northeurope`, etc.)

## 🎵 **Voice Options**

The system is configured to use **"Jenny"** - a warm, professional female voice perfect for therapy:

- **Jenny** (`en-US-JennyNeural`) - Warm, caring, professional ✅ **DEFAULT**
- **Aria** (`en-US-AriaNeural`) - Clear, empathetic
- **Sara** (`en-US-SaraNeural`) - Gentle, understanding

## 🧪 **Test Your Setup**

1. **Restart your dev server** after adding environment variables
2. **Send a message** to Jamie in chat
3. **Check the console** for Azure TTS logs
4. **Listen** for the professional female voice

## 🔍 **Troubleshooting**

### **"Cannot find module" errors**
- Make sure you've created the Azure TTS service files
- Check that `src/services/azureTTSService.ts` exists
- Check that `src/config/azure-config.ts` exists

### **"API key not found" errors**
- Verify your `.env.local` file exists
- Make sure you've restarted the dev server
- Check that the API key is correct

### **"Region not found" errors**
- Verify your region is correct (e.g., `eastus`, `westus`)
- Check Azure portal for the exact region name

## 💰 **Costs**

- **Free Tier**: 500,000 characters/month (about 4,000 words)
- **Paid Tier**: $16 per 1 million characters
- **Your Usage**: Likely well under the free tier for personal use

## 🎉 **You're All Set!**

Once configured, Jamie will speak with a **professional, warm female voice** that sounds like a real therapist - and it's completely free for your usage level!

---

**Need Help?** Check the browser console for detailed error messages when testing TTS.
