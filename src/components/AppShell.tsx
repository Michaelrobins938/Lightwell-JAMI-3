"use client";

import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import ChatHeader from './header/ChatHeader';
import ChatWindow from './chat-window/ChatWindow';
import InputBar from './input-bar/InputBar';
import { ModalManager } from './modals/ModalManager';

// Hooks
import { useChat } from '../hooks/useChat';
import { useModal } from '../hooks/useModal';
import { usePlan } from '../hooks/usePlan';

export default function AppShell() {
  // State for sidebar and modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize core hooks
  const chatHook = useChat();
  const modalHook = useModal();
  const planHook = usePlan();

  return (
    <ModalManager>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          chatHistory={chatHook.conversations}
          onNewChat={chatHook.startNewConversation}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Chat Window */}
          <ChatHeader 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            modelSelector={chatHook.currentModel}
            onModelChange={chatHook.setCurrentModel}
          />

          {/* Chat Window */}
          <ChatWindow 
            messages={chatHook.messages}
            isLoading={chatHook.isLoading}
            onRegenerateResponse={chatHook.regenerateLastResponse}
          />

          {/* Input Bar */}
          <InputBar 
            onSendMessage={chatHook.sendMessage}
            onAttachFile={chatHook.handleFileUpload}
            onVoiceInput={chatHook.handleVoiceInput}
            disabled={chatHook.isLoading}
          />
        </div>
      </div>
    </ModalManager>
  );
}
