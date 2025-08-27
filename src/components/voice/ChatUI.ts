import { addMessageDelta, finalizeMessage } from "../../state/chatStore";

export const ChatUI = {
  buffer: "",
  currentId: null as string | null,

  update(delta: string) {
    if (!this.currentId) {
      // Use a simple ID generation instead of crypto.randomUUID for browser compatibility
      this.currentId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addMessageDelta(this.currentId, "assistant", delta);
    } else {
      addMessageDelta(this.currentId, "assistant", delta);
    }
  },

  finalize() {
    if (this.currentId) {
      finalizeMessage(this.currentId);
      this.currentId = null;
    }
  },

  // Handle user input from voice
  addUserMessage(message: string) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    addMessageDelta(userId, "user", message);
    finalizeMessage(userId);
    console.log('🎤 User voice input:', message);
  }
};
