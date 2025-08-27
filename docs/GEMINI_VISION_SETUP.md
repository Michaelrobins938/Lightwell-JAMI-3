# 🎥 Gemini Vision Integration - Setup Guide

Your ChatWindow now has **Gemini Vision capabilities**! Here's how to set it up:

## 🚀 **Quick Setup**

### **1. Get Gemini API Key**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project
3. Get your API key
4. Add it to your environment variables:

```bash
# .env.local or Vercel environment variables
GEMINI_API_KEY=your_gemini_api_key_here
```

### **2. Test the Integration**
1. **Navigate to your chat page** (where ChatWindow is used)
2. **Click the camera icon** 📷 next to the microphone button
3. **Capture webcam or screen** using the vision controls
4. **Type a message** - Gemini will automatically analyze the images!

## 🎯 **How It Works**

- **📷 Webcam Capture**: Click the webcam button to capture your camera
- **🖥️ Screen Capture**: Click the screen button to capture your screen
- **🤖 Smart Routing**: 
  - If you have captured images → Uses **Gemini Vision API**
  - If no images → Uses your existing **Jamie/OpenAI chat**
- **🔄 Seamless Integration**: Works with your existing ChatWindow UI

## 🔧 **Features**

✅ **Automatic Vision Detection** - Gemini analyzes webcam/screen captures  
✅ **Fallback to Regular Chat** - No images = normal chat behavior  
✅ **Image Previews** - See what you've captured before sending  
✅ **Vision Status Indicator** - Shows when vision mode is active  
✅ **No Breaking Changes** - Your existing chat system works exactly the same  

## 📱 **Usage Examples**

### **Webcam Analysis**
1. Click 📷 button
2. Grant camera permission
3. Type: "What do you see in this image?"
4. Gemini analyzes your webcam feed!

### **Screen Analysis**
1. Click 🖥️ button
2. Select screen/window to share
3. Type: "What's on my screen?"
4. Gemini describes what you're looking at!

### **Mixed Mode**
1. Capture both webcam AND screen
2. Type: "Compare what I'm looking at vs what I'm showing"
3. Gemini analyzes both simultaneously!

## 🚨 **Troubleshooting**

### **API Key Issues**
- Check `GEMINI_API_KEY` is set in environment
- Verify API key is valid in Google AI Studio
- Check browser console for errors

### **Permission Issues**
- Allow camera access when prompted
- Allow screen sharing when prompted
- Check browser settings if permissions are blocked

### **Vision Not Working**
- Ensure you've captured at least one image
- Check the vision status indicator shows "🎥 Vision Active"
- Try refreshing the page if issues persist

## 🎉 **That's It!**

Your ChatWindow now has **Gemini Vision superpowers** while keeping all your existing functionality intact. The integration is completely seamless - just click the camera button and start using vision mode!

**Happy chatting with vision! 🎥✨**
