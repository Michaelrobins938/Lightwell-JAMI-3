"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  attachments?: { name: string; url: string; type: string }[];
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Check for onboarding completion and show welcome message
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const postSignupOnboardingComplete = localStorage.getItem('postSignup_onboarding_complete');

    // Only show greeting if user just completed onboarding and there are no messages yet
    if ((onboardingCompleted === 'true' || postSignupOnboardingComplete === 'true') && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: "Hello! I'm JAMI-3. I'm here with you. What would you like to talk about today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      // Clear the onboarding completion flags after showing the message
      localStorage.removeItem('postSignup_onboarding_complete');
    }
  }, []); // Empty dependency array to run only once on mount

  const sendMessage = async (text: string, files?: File[]) => {
    if (!text.trim() && !files?.length) return;

    // Convert file uploads to blob URLs for preview
    const attachments =
      files?.map((f) => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })) || [];

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      attachments,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Create assistant message placeholder for streaming
    const asstId = Date.now().toString() + "-a";
    setMessages((prev) => [
      ...prev,
      { 
        id: asstId, 
        role: "assistant", 
        content: "", 
        isStreaming: true,
        timestamp: new Date()
      },
    ]);
    setIsGenerating(true);

    try {
      // 🔗 Real SSE streaming to your API endpoint
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({ 
          message: text,
          files: files?.map(f => ({
            name: f.name,
            type: f.type,
            size: f.size
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let isFirstToken = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Handle SSE format if present
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }
            
            if (data === '[THINKING]') {
              continue;
            }
            
            if (data === '[FIRST_TOKEN]') {
              isFirstToken = false;
              continue;
            }
            
            // Only process actual content tokens
            if (!data.startsWith('[') && data.trim()) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === asstId 
                    ? { ...m, content: m.content + data, isStreaming: true }
                    : m
                )
              );
            }
          }
        }
      }

      // Finalize the message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === asstId 
            ? { ...m, content: m.content, isStreaming: false }
            : m
        )
      );

    } catch (error) {
      console.error("Streaming error:", error);
      
      // Show error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === asstId 
            ? { 
                ...m, 
                content: "Sorry, I encountered an error while processing your request. Please try again.",
                isStreaming: false 
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gpt5-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gpt5-beam-gradient rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-semibold">J3</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              JAMI-3
            </h1>
            <p className="text-xs text-slate-400">AI Therapeutic Assistant</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-16 h-16 bg-gpt5-beam-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white text-xl font-bold">J3</span>
            </div>
            <h2 className="text-2xl font-light mb-3 text-white">Hello, I'm JAMI-3</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              I'm your AI therapeutic companion. I'm here to listen, support, and help you navigate your mental wellness journey.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300">Empathetic</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300">Non-judgmental</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300">Available 24/7</span>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))
        )}
        
        {isGenerating && <TypingIndicator />}
      </div>

      {/* Enhanced Input */}
      <ChatInput onSend={sendMessage} hasMessages={messages.length > 0} />
    </div>
  );
}