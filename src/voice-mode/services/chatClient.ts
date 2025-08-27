// src/voice-mode/services/chatClient.ts

export const chatClient = {
  connect: async () => {
    console.log('chatClient.connect called');
    return Promise.resolve();
  },
  getAnalyserNode: () => {
    console.log('chatClient.getAnalyserNode called');
    return null;
  },
  sendTestMessage: async () => {
    console.log('chatClient.sendTestMessage called');
    return Promise.resolve();
  },
  testOrbAnimations: () => {
    console.log('chatClient.testOrbAnimations called');
  },
  restoreVisualEffects: () => {
    console.log('chatClient.restoreVisualEffects called');
  },
  disconnect: async () => {
    console.log('chatClient.disconnect called');
    return Promise.resolve();
  },
  on: (event: string, callback: (...args: any[]) => void) => {
    console.log(`chatClient.on called for event: ${event}`);
  },
  off: (event: string, callback: (...args: any[]) => void) => {
    console.log(`chatClient.off called for event: ${event}`);
  },
  getMessageQueueStatus: () => {
    console.log('chatClient.getMessageQueueStatus called');
    return { queueLength: 0 };
  },
  getDetailedStatus: () => {
    console.log('chatClient.getDetailedStatus called');
    return {};
  },
  getDataChannelState: () => {
    console.log('chatClient.getDataChannelState called');
    return 'not created';
  },
};