import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  model?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
  userId?: string;
}

export interface ChatState {
  // Chat data
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  
  // Model selection
  currentModel: string;
  availableModels: string[];
  
  // Voice mode
  isVoiceMode: boolean;
  isRecording: boolean;
  transcript: string;
  
  // UI state
  isLoading: boolean;
  isTyping: boolean;
  
  // Actions
  createChat: (title?: string, model?: string) => string;
  loadChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  setModel: (model: string) => void;
  toggleVoiceMode: () => void;
  setRecording: (recording: boolean) => void;
  setTranscript: (transcript: string) => void;
  clearTranscript: () => void;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const DEFAULT_MODELS = [
  'luna-ai-4',
  'luna-ai-3.5', 
  'luna-ai-4-turbo',
  'gpt-4o',
  'gpt-4o-mini'
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      chats: [],
      currentChatId: null,
      currentChat: null,
      currentModel: 'luna-ai-4',
      availableModels: DEFAULT_MODELS,
      isVoiceMode: false,
      isRecording: false,
      transcript: '',
      isLoading: false,
      isTyping: false,

      // Actions
      createChat: (title = 'New Chat', model?: string) => {
        const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newChat: Chat = {
          id: chatId,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: model || get().currentModel,
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: chatId,
          currentChat: newChat,
        }));

        return chatId;
      },

      loadChat: (chatId: string) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (chat) {
          set({
            currentChatId: chatId,
            currentChat: chat,
          });
        }
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const newChats = state.chats.filter(c => c.id !== chatId);
          let newCurrentChatId = state.currentChatId;
          let newCurrentChat = state.currentChat;

          if (chatId === state.currentChatId) {
            newCurrentChatId = newChats.length > 0 ? newChats[0].id : null;
            newCurrentChat = newChats.length > 0 ? newChats[0] : null;
          }

          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
            currentChat: newCurrentChat,
          };
        });
      },

      renameChat: (chatId: string, title: string) => {
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
          ),
          currentChat: state.currentChat?.id === chatId 
            ? { ...state.currentChat, title, updatedAt: new Date() }
            : state.currentChat,
        }));
      },

      addMessage: (chatId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        set((state) => {
          const updatedChats = state.chats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: new Date(),
                  title: chat.messages.length === 0 
                    ? newMessage.content.slice(0, 50) + (newMessage.content.length > 50 ? '...' : '')
                    : chat.title,
                }
              : chat
          );

          const updatedCurrentChat = state.currentChat?.id === chatId
            ? {
                ...state.currentChat,
                messages: [...state.currentChat.messages, newMessage],
                updatedAt: new Date(),
                title: state.currentChat.messages.length === 0 
                  ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                  : state.currentChat.title,
              }
            : state.currentChat;

          return {
            chats: updatedChats,
            currentChat: updatedCurrentChat,
          };
        });
      },

      updateChatTitle: (chatId: string, title: string) => {
        get().renameChat(chatId, title);
      },

      setModel: (model: string) => {
        set({ currentModel: model });
        // Update current chat model if exists
        const { currentChatId } = get();
        if (currentChatId) {
          set((state) => ({
            chats: state.chats.map(chat =>
              chat.id === currentChatId ? { ...chat, model } : chat
            ),
            currentChat: state.currentChat?.id === currentChatId 
              ? { ...state.currentChat, model }
              : state.currentChat,
          }));
        }
      },

      toggleVoiceMode: () => {
        set((state) => ({ isVoiceMode: !state.isVoiceMode }));
      },

      setRecording: (recording: boolean) => {
        set({ isRecording: recording });
      },

      setTranscript: (transcript: string) => {
        set({ transcript });
      },

      clearTranscript: () => {
        set({ transcript: '' });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setTyping: (typing: boolean) => {
        set({ isTyping: typing });
      },

      // Persistence methods
      saveToLocalStorage: () => {
        if (typeof window === 'undefined') return;
        const state = get();
        localStorage.setItem('luna-chat-store', JSON.stringify({
          chats: state.chats,
          currentChatId: state.currentChatId,
          currentModel: state.currentModel,
        }));
      },

      loadFromLocalStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          const saved = localStorage.getItem('luna-chat-store');
          if (saved) {
            const parsed = JSON.parse(saved);
            set({
              chats: parsed.chats || [],
              currentChatId: parsed.currentChatId || null,
              currentChat: parsed.chats?.find((c: Chat) => c.id === parsed.currentChatId) || null,
              currentModel: parsed.currentModel || 'luna-ai-4',
            });
          }
        } catch (error) {
          console.error('Failed to load chat store from localStorage:', error);
        }
      },
    }),
    {
      name: 'luna-chat-store',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        currentModel: state.currentModel,
      }),
      // Skip hydration during SSR
      skipHydration: true,
    }
  )
);
