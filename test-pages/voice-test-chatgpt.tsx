import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useChatStore } from '../state/chatStore';

// Dynamic import for VoiceMode to avoid SSR issues
const VoiceMode = dynamic(() => import('../components/VoiceMode'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="text-white">Loading Voice Mode...</div>
  </div>
});

export default function VoiceTestChatGPT() {
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const { messages, addMessageDelta, finalizeMessage } = useChatStore();

  const handleOpenVoiceMode = () => {
    setIsVoiceModeOpen(true);
    console.log('🎤 Opening ChatGPT voice mode...');

    // Add a welcome message
    const welcomeId = `welcome_${Date.now()}`;
    addMessageDelta(welcomeId, 'assistant', '🎙️ Welcome to ChatGPT Voice Mode! Click the microphone button to start speaking.');
    setTimeout(() => finalizeMessage(welcomeId), 3000);
  };

  const handleAddTestMessage = () => {
    const testId = `test_${Date.now()}`;
    addMessageDelta(testId, 'user', 'This is a test message from the UI');
    finalizeMessage(testId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          ChatGPT Voice Mode Test
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Voice Controls</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenVoiceMode}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </button>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Status: {isVoiceModeOpen ? 'Active' : 'Inactive'}</p>
              <p className="text-xs text-gray-500">Click the microphone to open ChatGPT voice mode</p>
              <button
                onClick={handleAddTestMessage}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Add Test Message
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chat Messages</h2>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No messages yet. Activate voice mode to start chatting!
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {message.role}
                    </span>
                    {!message.finalized && (
                      <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">
                        Typing...
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>This page tests the ChatGPT-style voice mode integration.</p>
          <p>Make sure you have OPENAI_API_KEY set in your environment variables.</p>
          <p>Check the browser console for debug messages.</p>
        </div>
      </div>

      {/* ChatGPT Voice Mode */}
      <VoiceMode
        isOpen={isVoiceModeOpen}
        onClose={() => {
          setIsVoiceModeOpen(false);
          console.log('🎤 Voice mode closed');
        }}
      />
    </div>
  );
}
