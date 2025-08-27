"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MessageItem from "./MessageItem";
import TypingDots from "./TypingDots";
import InputBar from "./InputBar";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import MoodMonitor from "./MoodMonitor";
import { useGeminiVision } from "../../hooks/useGeminiVision";
import { AlertTriangle } from "lucide-react";
import ProfileButton from "../ProfileButton";

type Msg = { id:string; role:"user"|"assistant"; content:string };

export default function ChatWindow({
  model, markdown, onVoiceModeToggle, selectedModel, onOpenSettings, onModelChange, onFullscreenOrbToggle
}:{ 
  model:string; 
  markdown:boolean; 
  onVoiceModeToggle?: () => void;
  selectedModel?: string;
  onOpenSettings?: () => void;
  onModelChange?: (model: string) => void;
  onFullscreenOrbToggle?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showTtsSettings, setShowTtsSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('bf0a246a-8642-498a-9950-80c35e9276b5');
  const [isThinking, setIsThinking] = useState(false);
  const [useJamie, setUseJamie] = useState(true); // Enable Jamie by default
  const [showMoodMonitor, setShowMoodMonitor] = useState(false);
  const [crisisAlerts, setCrisisAlerts] = useState<any[]>([]);
  const bottomRef = useAutoScroll({ enabled: true }, [messages.length, streamingMessage]);
  const ttsSettingsRef = useRef<HTMLDivElement>(null);
  
  // Gemini Vision integration
  const { webcamImage, screenImage, sendVisionMessage } = useGeminiVision();

  // Click outside handler for TTS settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ttsSettingsRef.current && !ttsSettingsRef.current.contains(event.target as Node)) {
        setShowTtsSettings(false);
      }
    };

    if (showTtsSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTtsSettings]);

  // Available Cartesia voices
  const availableVoices = [
    {
      id: 'bf0a246a-8642-498a-9950-80c35e9276b5',
      name: 'Sophie',
      description: 'Therapeutic voice for Jamie AI'
    }
  ];

  // Model mapping for OpenAI API
  const getOpenAIModelName = (displayName: string): string => {
    const openAIModel = (() => {
      switch (displayName) {
        case 'GPT-5':
          return 'gpt-4o'; // GPT-5 not yet available, fallback to GPT-4o
        case 'GPT-4o':
          return 'gpt-4o';
        case 'GPT-4.1':
          return 'gpt-4-turbo-preview';
        case 'GPT-3.5':
          return 'gpt-3.5-turbo';
        default:
          return 'gpt-4o'; // Default fallback
      }
    })();
    
    console.log(`🤖 Model selected: ${displayName} → OpenAI API: ${openAIModel}`);
    return openAIModel;
  };

  // TTS function using Cartesia
  const speakWithCartesia = useCallback(async (text: string) => {
    if (!text.trim() || !ttsEnabled) {
      console.log('🔇 TTS skipped:', { text: text.substring(0, 50), ttsEnabled });
      return;
    }
    
    try {
      setIsSpeaking(true);
      console.log('🔊 Starting Cartesia TTS for:', text.substring(0, 50) + '...');
      
      // Test audio context first
      const testAudio = new Audio();
      testAudio.volume = 1.0;
      console.log('🔊 Test audio element created, volume:', testAudio.volume);
      
      const response = await fetch('/api/cartesia/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voiceId: selectedVoice
        })
      });

      console.log('🔊 Cartesia API response status:', response.status);
      console.log('🔊 Cartesia API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`TTS failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const audioBuffer = await response.arrayBuffer();
      console.log('🔊 Audio buffer received, size:', audioBuffer.byteLength, 'bytes');
      
      // Validate that we actually got audio data
      if (audioBuffer.byteLength === 0) {
        throw new Error('Cartesia returned empty audio buffer');
      }
      
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      console.log('🔊 Audio blob created, size:', audioBlob.size, 'bytes, type:', audioBlob.type);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🔊 Audio URL created:', audioUrl.substring(0, 100) + '...');
      
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.preload = 'auto';
      audio.autoplay = false;
      
      // Performance optimizations for faster TTS
      audio.load();
      
      console.log('🔊 Audio element created, volume:', audio.volume, 'readyState:', audio.readyState);
      
      // Set up event listeners
      audio.onloadstart = () => console.log('🔊 Audio loading started');
      audio.oncanplay = () => console.log('🔊 Audio can play');
      audio.oncanplaythrough = () => console.log('🔊 Audio can play through');
      audio.onloadeddata = () => console.log('🔊 Audio data loaded');
      audio.onloadedmetadata = () => console.log('🔊 Audio metadata loaded');
      
      audio.onended = () => {
        console.log('✅ TTS playback completed');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('❌ TTS playback error:', error);
        console.error('❌ Audio error details:', audio.error);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      // Start playing as soon as we can, don't wait for full load
      audio.oncanplay = async () => {
        console.log('🔊 Audio ready to play, starting playback...');
        try {
          await audio.play();
          console.log('🎵 TTS audio started playing successfully');
        } catch (playError) {
          console.error('❌ Audio play failed:', playError);
        }
      };

      // Don't wait for full load - start playing when we can
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        console.log('🔊 Audio metadata ready, starting playback...');
        await audio.play();
      }
      
    } catch (error) {
      console.error('❌ Cartesia TTS error:', error);
      setIsSpeaking(false);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'TTS service unavailable';
      console.warn('⚠️ TTS Error:', errorMessage);
      
      // No fallback - only use Cartesia TTS
      console.log('🔇 TTS failed, no fallback used');
    }
  }, [ttsEnabled, selectedVoice]);

  // Function to add messages from voice mode
  const addMessage = (msg: { role: string; content: string }) => {
    const id = crypto.randomUUID();
    const message: Msg = {
      id,
      role: msg.role as "user" | "assistant",
      content: msg.content
    };
    setMessages(m => [...m, message]);
    setHasStarted(true);
  };

  const send = async (text:string, attachments:{type:"image"|"pdf"; dataUrl:string; page?:number}[]) => {
    const id = crypto.randomUUID();
    setMessages(m => [...m, { id, role:"user", content: text }]);
    setHasStarted(true);
    setIsGenerating(true);
    setLoading(true);

    // Initial delay (600-900ms random jitter) while dots are pulsing
    const initialDelay = 600 + Math.random() * 300;
    await new Promise(resolve => setTimeout(resolve, initialDelay));

    try {
      let aiResponse = '';
      
      // Check if we have vision images from Gemini
      const hasVisionImages = webcamImage || screenImage;
      
      if (hasVisionImages) {
        // Use Gemini Vision API
        console.log('🎥 Using Gemini Vision API with captured images');
        
        const allImages = [
          ...(webcamImage ? [webcamImage] : []),
          ...(screenImage ? [screenImage] : []),
          ...attachments.filter(a => a.type === "image").map(a => a.dataUrl)
        ];
        
        aiResponse = await sendVisionMessage(text, allImages);
        
      } else if (attachments.some(a => a.type === "image")) {
        // Use Gemini Vision for attached images
        console.log('🎥 Using Gemini Vision API with attached images');
        
        const imageUrls = attachments
          .filter(a => a.type === "image")
          .map(a => a.dataUrl);
        
        aiResponse = await sendVisionMessage(text, imageUrls);
        
      } else {
        // Use regular chat API (existing logic)
        const hint = attachments.some(a=>a.type==="image") ? "\n(Attached images provided — describe and analyze them as needed.)" : "";
        const userText = text + hint;

        let response: Response;
        
        if (useJamie) {
          // Use Jamie system with advanced features
          response = await fetch("/api/chat/stream", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
              message: userText,
              userId: 'gpt-chat-user',
              useRealStreaming: false, // Use Jamie instead of OpenAI
              model: getOpenAIModelName(selectedModel || 'GPT-5')
            })
          });
        } else {
          // Use basic OpenAI streaming
          response = await fetch("/api/chat/stream", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
              message: userText,
              userId: 'gpt-chat-user',
              useRealStreaming: true, // Use OpenAI streaming
              model: getOpenAIModelName(selectedModel || 'GPT-5')
            })
          });
        }

        if (!response.ok) {
          throw new Error(`Chat API failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }
              if (data === '[THINKING]') {
                // AI is thinking, keep showing typing dots
                setIsThinking(true);
                continue;
              }
              if (data === '[FIRST_TOKEN]') {
                // First token received, start streaming
                continue;
              }
              try {
                // Add to the response
                aiResponse += data;
                setStreamingMessage(aiResponse);
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }

      setLoading(false);
      setIsGenerating(false);
      setIsThinking(false);
      
      // Add final message after streaming is complete
      setMessages(m => [...m, { id: crypto.randomUUID(), role:"assistant", content: aiResponse }]);
      setStreamingMessage("");
      
      // Automatically speak the AI response with Cartesia TTS
      if (aiResponse.trim()) {
        await speakWithCartesia(aiResponse);
      }
      
    } catch (error) {
      setLoading(false);
      setIsGenerating(false);
      setIsThinking(false);
      const errorText = "I'm experiencing some technical difficulties. Please try again.";
      setMessages(m => [...m, { id: crypto.randomUUID(), role:"assistant", content: errorText }]);
      setStreamingMessage("");
      
      // Also speak error messages
      await speakWithCartesia(errorText);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden" 
      style={{ 
        backgroundColor: '#202020',
        margin: 0,
        padding: 0,
        height: '100vh'
      }}
    >


      {/* ChatGPT 5 Header with Inline Model Switcher */}
      <div className="h-12 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 px-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Model:</span>
          <select
            value={selectedModel || 'GPT-5'}
            onChange={(e) => onModelChange?.(e.target.value)}
            className="bg-neutral-800 text-white px-3 py-1 rounded-lg focus:outline-none text-sm hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <option value="GPT-5">GPT-5 (GPT-4o)</option>
            <option value="GPT-4o">GPT-4o</option>
            <option value="GPT-4.1">GPT-4.1</option>
            <option value="GPT-3.5">GPT-3.5</option>
          </select>
          <span className="text-neutral-400 text-xs">
            ({getOpenAIModelName(selectedModel || 'GPT-5')})
          </span>
        </div>
        
        {/* TTS Toggle Button */}
        <button
          onClick={() => setShowTtsSettings(!showTtsSettings)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            ttsEnabled 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
          }`}
          title={ttsEnabled ? 'TTS Enabled - Click for settings' : 'TTS Disabled - Click for settings'}
        >
          {ttsEnabled ? '🔊 TTS ON' : '🔇 TTS OFF'}
        </button>
        
        {/* Jamie Toggle Button */}
        <button
          onClick={() => setUseJamie(!useJamie)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            useJamie 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
          }`}
          title={useJamie ? 'Jamie AI Enabled - Click to disable' : 'Jamie AI Disabled - Click to enable'}
        >
          {useJamie ? '🤖 Jamie ON' : '🤖 Jamie OFF'}
        </button>

        {/* Mood Monitor Toggle Button */}
        <button
          onClick={() => setShowMoodMonitor(!showMoodMonitor)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            showMoodMonitor 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
          }`}
          title={showMoodMonitor ? 'Mood Monitor Enabled - Click to disable' : 'Mood Monitor Disabled - Click to enable'}
        >
          {showMoodMonitor ? '❤️ Mood ON' : '❤️ Mood OFF'}
        </button>
        
        {/* Vision Status Indicator */}
        {(webcamImage || screenImage) && (
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 rounded-lg text-white text-sm">
            <span>🎥 Vision Active</span>
            <span className="text-xs">
              ({[webcamImage && 'Webcam', screenImage && 'Screen'].filter(Boolean).join(', ')})
            </span>
          </div>
        )}
        
        {/* TTS Settings Panel */}
        {showTtsSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-neutral-800 border border-neutral-700 rounded-lg p-4 shadow-xl z-50 min-w-64"
            ref={ttsSettingsRef}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">TTS Settings</h3>
                <button
                  onClick={() => setShowTtsSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* TTS Enable/Disable */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Enable TTS</span>
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    ttsEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    ttsEnabled ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Active Model Indicator */}
              <div className="flex items-center justify-between p-2 bg-neutral-700 rounded-lg">
                <span className="text-gray-300 text-sm">Active Model</span>
                <span className="text-blue-400 text-sm font-medium">
                  {selectedModel || 'GPT-5'} ({getOpenAIModelName(selectedModel || 'GPT-5')})
                </span>
              </div>
              
              {/* Voice Selection */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-neutral-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableVoices.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} - {voice.description}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Performance Settings */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">Performance Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-300 text-sm">
                    <input
                      type="radio"
                      name="performance"
                      value="fast"
                      defaultChecked
                      className="text-blue-500"
                    />
                    <span>Fast (Lower quality, faster generation)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-300 text-sm">
                    <input
                      type="radio"
                      name="performance"
                      value="balanced"
                      className="text-blue-500"
                    />
                    <span>Balanced (Good quality, moderate speed)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-300 text-sm">
                    <input
                      type="radio"
                      name="performance"
                      value="quality"
                      className="text-blue-500"
                    />
                    <span>Quality (Best quality, slower generation)</span>
                  </label>
                </div>
              </div>
              
              {/* Test TTS Button */}
              <button
                onClick={() => speakWithCartesia("Hello! This is a test of the Cartesia TTS system.")}
                disabled={!ttsEnabled || isSpeaking}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSpeaking ? 'Speaking...' : 'Test TTS'}
              </button>
              
              {/* API Status Check */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/cartesia/synthesize', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ text: 'test' })
                    });
                    if (response.ok) {
                      const audioBuffer = await response.arrayBuffer();
                      console.log('✅ Cartesia API working - Audio size:', audioBuffer.byteLength, 'bytes');
                      alert(`✅ Cartesia API working!\nAudio size: ${audioBuffer.byteLength} bytes`);
                    } else {
                      const error = await response.json();
                      console.error('❌ Cartesia API error:', error);
                      alert(`❌ Cartesia API error: ${error.error || 'Unknown error'}`);
                    }
                  } catch (error) {
                    console.error('❌ Cartesia API test failed:', error);
                    alert(`❌ Cartesia API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Check API Status
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg text-white text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Speaking...
          </div>
        )}

        {/* Profile Button */}
        <div className="flex items-center">
          <ProfileButton
            userName="Demo User"
            userEmail="demo@luna-web.com"
            onSettingsClick={() => onOpenSettings?.()}
            onLogoutClick={() => {
              // Handle logout logic
              console.log('Logout clicked');
            }}
            onHelpClick={() => {
              // Handle help logic
              console.log('Help clicked');
            }}
          />
        </div>
      </div>

      {/* Crisis Alert Banner */}
      {crisisAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900 border-b border-red-700 p-3 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-red-100">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              CRISIS ALERT: {crisisAlerts[0].message}
            </span>
            <button
              onClick={() => setCrisisAlerts(prev => prev.slice(1))}
              className="ml-2 px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto" 
        style={{
          width: '100%',
          height: 'calc(100vh - 120px)',
          padding: '24px 32px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#444 transparent'
        }}
      >
        {!hasStarted ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <motion.div
              className="font-medium mb-8 tracking-tight"
              style={{ 
                fontSize: '20px', 
                fontWeight: 500,
                lineHeight: '28px',
                color: '#EDEDED',
                fontFamily: 'Inter, sans-serif'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              What can I help with?
            </motion.div>
            {/* This space is reserved for the centered input bar - actual bar is positioned absolutely */}
          </div>
        ) : (
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {messages.map((m, index) => (
              <motion.div 
                key={m.id} 
                className="flex gap-4 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <MessageItem who={m.role} text={m.content}/>
                
                {/* TTS Speaking Indicator for Assistant Messages */}
                {m.role === 'assistant' && isSpeaking && ttsEnabled && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Speaking with Cartesia TTS...
                  </div>
                )}
              </motion.div>
            ))}
            {isGenerating && (
              <motion.div 
                className="flex gap-4 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* AI Avatar */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-gray-600 to-gray-700">
                  AI
                </div>
                
                {/* ChatGPT 5 typing dots */}
                <div className="flex-1 max-w-[720px]">
                  <div className="inline-block bg-[#202020] rounded-xl px-4 py-3">
                    <TypingDots />
                  </div>
                </div>
              </motion.div>
            )}
            {streamingMessage && (
              <motion.div 
                className="flex gap-4 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* AI Avatar */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-gray-600 to-gray-700">
                  AI
                </div>
                
                {/* Streaming message with blinking caret */}
                <div className="flex-1 max-w-[720px]">
                  <div className="inline-block bg-[#202020] rounded-xl px-4 py-3">
                    <div 
                      className="text-white" 
                      style={{ 
                        whiteSpace: "pre-wrap", 
                        fontFamily: 'Inter, sans-serif', 
                        fontSize: '15px', 
                        lineHeight: '1.4',
                        color: '#EDEDED'
                      }}
                    >
                      {streamingMessage}
                      <span className="inline-block w-0.5 h-4 bg-white ml-0.5 animate-pulse" />
                    </div>
                  </div>
                  
                  {/* TTS Processing Indicator */}
                  {ttsEnabled && (
                    <div className="mt-2 flex items-center gap-2 text-blue-400 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      Preparing TTS...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* Auto-scroll anchor */}
            <div ref={bottomRef.scrollRef} />
          </motion.div>
        )}
      </div>

      {/* ChatGPT 5 Input Bar - Fixed bottom with proper centering */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 z-50">
        <div className="w-full max-w-3xl px-4">
          <motion.div
            style={{
              width: hasStarted ? '100%' : 'min(640px, 80vw)',
              height: '48px',
              backgroundColor: '#2A2A2A',
              borderRadius: '24px',
              padding: '12px 16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            animate={{
              transform: hasStarted ? 'translateY(0px)' : 'translateY(calc(-50vh + 100px))'
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut"
            }}
          >
            <InputBar 
              disabled={loading} 
              onSubmit={send} 
              placeholder={`Message ${selectedModel || 'ChatGPT'}...`} 
              onVoiceModeToggle={onVoiceModeToggle}
              onFullscreenOrbToggle={onFullscreenOrbToggle}
              addMessage={addMessage}
            />
          </motion.div>
        </div>
      </div>

      {/* Mood Monitor Sidebar */}
      <MoodMonitor
        isVisible={showMoodMonitor}
        onToggle={() => setShowMoodMonitor(!showMoodMonitor)}
        onCrisisAlert={(alert) => {
          setCrisisAlerts(prev => [alert, ...prev]);
          // Show crisis alert in chat
          setMessages(m => [...m, { 
            id: crypto.randomUUID(), 
            role: "assistant", 
            content: `🚨 CRISIS ALERT: ${alert.message} Please consider reaching out to a crisis helpline (988) or mental health professional immediately.` 
          }]);
        }}
        userId="gpt-chat-user"
      />
    </div>
  );
}