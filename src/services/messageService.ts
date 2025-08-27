interface UpdateMessagePayload {
  content: string;
}

export const updateMessage = async (messageId: string, payload: UpdateMessagePayload) => {
  const response = await fetch(`/api/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update message');
  }

  return response.json();
};