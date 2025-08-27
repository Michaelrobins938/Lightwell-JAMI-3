import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  finalized: boolean;
};

type ChatState = {
  messages: ChatMessage[];
  addMessageDelta: (id: string, role: "user" | "assistant", delta: string) => void;
  finalizeMessage: (id: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  addMessageDelta: (id, role, delta) =>
    set((state) => {
      const idx = state.messages.findIndex((m) => m.id === id);
      if (idx === -1) {
        return {
          messages: [
            ...state.messages,
            { id, role, content: delta, finalized: false },
          ],
        };
      } else {
        const updated = [...state.messages];
        updated[idx] = {
          ...updated[idx],
          content: updated[idx].content + delta,
        };
        return { messages: updated };
      }
    }),

  finalizeMessage: (id) =>
    set((state) => {
      const idx = state.messages.findIndex((m) => m.id === id);
      if (idx === -1) return state;
      const updated = [...state.messages];
      updated[idx] = { ...updated[idx], finalized: true };
      return { messages: updated };
    }),
}));

export const addMessageDelta = (id: string, role: "user" | "assistant", delta: string) =>
  useChatStore.getState().addMessageDelta(id, role, delta);

export const finalizeMessage = (id: string) =>
  useChatStore.getState().finalizeMessage(id);
