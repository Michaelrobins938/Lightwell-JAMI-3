interface BranchChatPayload {
  chatId: string;
  messageId: string;
  newContent: string;
}

interface BranchChatResponse {
  id: string;
  // Add other properties of the new chat object if known
}

export const branchChat = async (payload: BranchChatPayload): Promise<BranchChatResponse> => {
  const response = await fetch('/api/chats/branch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to branch chat');
  }

  return response.json();
};