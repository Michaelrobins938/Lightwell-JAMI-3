import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatGPTInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
  theme?: 'light' | 'dark' | 'jarvis';
  placeholder?: string;
  title?: string;
  avatar?: {
    user: string;
    assistant: string;
  };
}

const ChatGPTInterface: React.FC<ChatGPTInterfaceProps> = ({
  onSendMessage,
  className = '',
  theme = 'jarvis',
  placeholder = 'Message...',
  title = 'Chat Interface',
  avatar = { user: '👤', assistant: '🤖' }
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const sessions = await response.json();
        // Convert sessions to chat format
        const chatFormat: Chat[] = sessions.map((s: any) => ({
          id: s.id,
          title: s.title,
          messages: [], // Will load messages when selected
          createdAt: s.createdAt
        }));
        setChats(chatFormat);
        if (chatFormat.length > 0) {
          setCurrentChat(chatFormat[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async (updatedChats: Chat[]) => {
    // Chat history is now saved to database via API calls
    // This function is kept for compatibility but does minimal work
    console.log('Chat history managed by database');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChat(newChat);
    saveChatHistory(updatedChats);
    setMessageInput('');
    inputRef.current?.focus();
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    saveChatHistory(updatedChats);
    
    if (currentChat?.id === chatId) {
      setCurrentChat(updatedChats.length > 0 ? updatedChats[0] : null);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;
    
    if (!currentChat) {
      startNewChat();
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // Update current chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage]
    };

    // Update chat title if it's the first message
    if (updatedChat.messages.length === 1) {
      updatedChat.title = messageInput.trim().slice(0, 30) + (messageInput.length > 30 ? '...' : '');
    }

    const updatedChats = chats.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    );

    setCurrentChat(updatedChat);
    setChats(updatedChats);
    setMessageInput('');
    setIsLoading(true);

    try {
      let response = 'Message received. AI integration pending.';
      
      if (onSendMessage) {
        response = await onSendMessage(userMessage.content);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      const finalUpdatedChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage]
      };

      const finalUpdatedChats = chats.map(chat => 
        chat.id === currentChat.id ? finalUpdatedChat : chat
      );

      setCurrentChat(finalUpdatedChat);
      setChats(finalUpdatedChats);
      saveChatHistory(finalUpdatedChats);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }

    saveChatHistory(updatedChats);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatgpt-interface theme-${theme} ${className}`}>
      {/* Sidebar */}
      <motion.div 
        className={`chat-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 260 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <motion.button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </motion.button>
          
          {!sidebarCollapsed && (
            <motion.button
              className="new-chat-btn"
              onClick={startNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              + New Chat
            </motion.button>
          )}
        </div>

        {!sidebarCollapsed && (
          <motion.div 
            className="chat-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {chats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => selectChat(chat)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-meta">
                    {chat.messages.length} messages
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => deleteChat(chat.id, e)}
                    aria-label="Delete chat"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!sidebarCollapsed && (
          <motion.div 
            className="sidebar-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Ready</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <h2 className="chat-title">{title}</h2>
          {currentChat && (
            <div className="chat-info">
              {currentChat.messages.length} messages
            </div>
          )}
        </div>

        <div className="messages-area">
          {(!currentChat || currentChat.messages.length === 0) && (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>Type a message below to begin chatting.</p>
            </motion.div>
          )}

          <AnimatePresence>
            {currentChat?.messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`message ${message.role}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? avatar.user : avatar.assistant}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              className="message assistant loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message-avatar">{avatar.assistant}</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              className="message-input"
              placeholder={placeholder}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <motion.button
              className="send-btn"
              onClick={sendMessage}
              disabled={!messageInput.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? '⏳' : '➤'}
            </motion.button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatgpt-interface {
          display: flex;
          height: 600px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        /* Theme Variables */
        .theme-light {
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-tertiary: #f3f4f6;
          --text-primary: #374151;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --accent-color: #10b981;
          --accent-hover: #059669;
          --message-user-bg: #10b981;
          --message-assistant-bg: #f3f4f6;
        }

        .theme-dark {
          --bg-primary: #1f2937;
          --bg-secondary: #111827;
          --bg-tertiary: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --border-color: #4b5563;
          --accent-color: #3b82f6;
          --accent-hover: #2563eb;
          --message-user-bg: #3b82f6;
          --message-assistant-bg: #374151;
        }

        .theme-jarvis {
          --bg-primary: rgba(10, 10, 30, 0.95);
          --bg-secondary: rgba(0, 20, 40, 0.95);
          --bg-tertiary: rgba(255, 255, 255, 0.05);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
          --border-color: rgba(0, 255, 255, 0.2);
          --accent-color: #00ffff;
          --accent-hover: #0080ff;
          --message-user-bg: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.2));
          --message-assistant-bg: rgba(255, 255, 255, 0.05);
        }

        .chat-sidebar {
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .collapse-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          align-self: flex-start;
        }

        .collapse-btn:hover {
          background: var(--accent-color);
          color: var(--bg-primary);
        }

        .new-chat-btn {
          width: 100%;
          padding: 12px;
          background: var(--accent-color);
          color: var(--bg-primary);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .new-chat-btn:hover {
          background: var(--accent-hover);
        }

        .chat-list {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-item {
          padding: 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .chat-item:hover {
          background: var(--accent-color);
          color: var(--bg-primary);
        }

        .chat-item.active {
          background: var(--accent-color);
          color: var(--bg-primary);
          border-color: var(--accent-color);
        }

        .chat-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-meta {
          font-size: 12px;
          opacity: 0.7;
        }

        .delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff4444;
          border-radius: 4px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .chat-item:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: rgba(255, 0, 0, 0.2);
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00ff00;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .chat-info {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .messages-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .message {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
          background: var(--message-assistant-bg);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .message.user .message-content {
          background: var(--message-user-bg);
          color: white;
        }

        .message-text {
          line-height: 1.5;
          margin-bottom: 4px;
          color: inherit;
        }

        .message-timestamp {
          font-size: 11px;
          opacity: 0.6;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color);
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .input-area {
          padding: 16px 24px;
          border-top: 1px solid var(--border-color);
        }

        .input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          min-height: 44px;
          max-height: 120px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          font-family: inherit;
          resize: none;
          outline: none;
        }

        .message-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        .message-input::placeholder {
          color: var(--text-secondary);
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: var(--accent-color);
          border: none;
          border-radius: 8px;
          color: var(--bg-primary);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-btn:disabled {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          cursor: not-allowed;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        /* Scrollbar Styling */
        .chat-list::-webkit-scrollbar,
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }

        .chat-list::-webkit-scrollbar-track,
        .messages-area::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
        }

        .chat-list::-webkit-scrollbar-thumb,
        .messages-area::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .chat-list::-webkit-scrollbar-thumb:hover,
        .messages-area::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default ChatGPTInterface;