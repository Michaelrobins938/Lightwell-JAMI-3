import { useChatStore } from "../state/chatStore";

let currentId: string | null = null;

export const ChatUI = {
  update(delta: string) {
    const store = useChatStore.getState();
    if (!currentId) {
      currentId = crypto.randomUUID();
      store.addMessage({ id: currentId, role: "assistant", content: "", finalized: false });
    }
    store.updateMessage(currentId, delta);
  },

  finalize() {
    const store = useChatStore.getState();
    if (currentId) {
      store.finalizeMessage(currentId);
      currentId = null;
    }
  },
};
