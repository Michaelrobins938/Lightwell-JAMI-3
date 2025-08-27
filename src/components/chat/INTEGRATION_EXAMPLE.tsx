// Integration Example for ChatGPTInterface.tsx
// This shows exactly how to update your existing code

import React from 'react';
import { StreamingMessage, MessageBubble, ChatContainer } from './StreamingMessage';

// EXAMPLE 1: Update your existing StreamingMessage usage
// Find this in your ChatGPTInterface.tsx around line 1758:

export function UpdatedMessageDisplay({ 
  message, 
  streamingMessage, 
  isStreaming, 
  isThinking,
  speakWithCartesia 
}: {
  message: any;
  streamingMessage: string;
  isStreaming: boolean;
  isThinking: boolean;
  speakWithCartesia: (text: string) => Promise<void>;
}) {
  return (
    <div className="message-container">
      {message.id === streamingMessage && isStreaming ? (
        // OLD WAY - No TTS
        // <StreamingMessage 
        //   content={streamingMessage || ' '}
        //   isStreaming={isStreaming}
        //   isThinking={isThinking}
        // />

        // NEW WAY - Auto-TTS enabled
        <StreamingMessage 
          content={streamingMessage || ' '}
          isStreaming={isStreaming}
          isThinking={isThinking}
          isAssistant={true}           // Enable for Jamie responses
          autoTTS={true}               // Enable auto-TTS
          onTTS={speakWithCartesia}   // Your existing TTS function
        />
      ) : (
        <div className="message-content">
          {message.content}
        </div>
      )}
    </div>
  );
}

// EXAMPLE 2: Use the new MessageBubble component
// This is simpler and handles both overflow and TTS automatically:

export function SimpleMessageDisplay({ 
  messages, 
  speakWithCartesia 
}: {
  messages: any[];
  speakWithCartesia: (text: string) => Promise<void>;
}) {
  return (
    <div className="messages-list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.content}
          isAssistant={message.role === 'assistant'}
          autoTTS={true}
          onTTS={speakWithCartesia}
        />
      ))}
    </div>
  );
}

// EXAMPLE 3: Use ChatContainer for proper scrolling
// This handles both overflow and auto-scrolling:

export function CompleteChatDisplay({ 
  messages, 
  speakWithCartesia 
}: {
  messages: any[];
  speakWithCartesia: (text: string) => Promise<void>;
}) {
  return (
    <ChatContainer className="chat-messages">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.content}
          isAssistant={message.role === 'assistant'}
          autoTTS={true}
          onTTS={speakWithCartesia}
        />
      ))}
    </ChatContainer>
  );
}

// EXAMPLE 4: Integration with your existing speakWithCartesia
// Add this to your ChatGPTInterface.tsx:

export function TTSIntegrationExample() {
  // Your existing TTS function
  const speakWithCartesia = async (text: string) => {
    // Your existing TTS logic
    console.log('Speaking with Cartesia:', text);
  };

  // Optional: Add Web Speech API fallback
  const speakWithFallback = async (text: string) => {
    try {
      await speakWithCartesia(text);
    } catch (error) {
      console.log('Falling back to Web Speech API');
      // Import this from the utils/tts.ts file we created
      // import { speak as speakFallback } from '../../utils/tts';
      // speakFallback(text);
    }
  };

  return (
    <div>
      {/* Use the fallback TTS function */}
      <StreamingMessage 
        content="Hello, I'm Jamie!"
        isStreaming={false}
        isThinking={false}
        isAssistant={true}
        autoTTS={true}
        onTTS={speakWithFallback}
      />
    </div>
  );
}

// EXAMPLE 5: Complete integration in your message loop
// Replace your existing message rendering with this:

export function CompleteMessageLoop({ 
  messages, 
  streamingMessage, 
  isStreaming, 
  isThinking,
  speakWithCartesia 
}: {
  messages: any[];
  streamingMessage: string;
  isStreaming: boolean;
  isThinking: boolean;
  speakWithCartesia: (text: string) => Promise<void>;
}) {
  return (
    <ChatContainer className="chat-messages">
      {messages.map((message) => {
        // Check if this message is currently streaming
        const isThisStreaming = message.id === streamingMessage && isStreaming;
        
        if (isThisStreaming) {
          // Show streaming message with auto-TTS
          return (
            <StreamingMessage
              key={message.id}
              content={streamingMessage || ' '}
              isStreaming={isStreaming}
              isThinking={isThinking}
              isAssistant={true}
              autoTTS={true}
              onTTS={speakWithCartesia}
            />
          );
        } else {
          // Show completed message with auto-TTS
          return (
            <MessageBubble
              key={message.id}
              message={message.content}
              isAssistant={message.role === 'assistant'}
              autoTTS={true}
              onTTS={speakWithCartesia}
            />
          );
        }
      })}
    </ChatContainer>
  );
}

// EXAMPLE 6: Minimal changes to your existing code
// Just add these 3 props to your existing StreamingMessage:

export function MinimalChanges() {
  // Example variables - in real usage these would be props or state
  const streamingMessage = '';
  const isStreaming = false;
  const isThinking = false;
  const speakWithCartesia = async (text: string) => {
    // Example TTS function
    console.log('TTS:', text);
  };

  return (
    <div>
      {/* BEFORE - Your existing code */}
      {/* 
      <StreamingMessage 
        content={streamingMessage || ' '}
        isStreaming={isStreaming}
        isThinking={isThinking}
      />
      */}
      
      {/* AFTER - Just add 3 new props */}
      <StreamingMessage 
        content={streamingMessage || ' '}
        isStreaming={isStreaming}
        isThinking={isThinking}
        isAssistant={true}           // ← ADD THIS
        autoTTS={true}               // ← ADD THIS  
        onTTS={speakWithCartesia}   // ← ADD THIS
      />
    </div>
  );
}
