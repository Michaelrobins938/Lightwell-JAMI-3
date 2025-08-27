// Simple token estimation utilities (approximate)
// These are lightweight heuristics; replace with tiktoken or model-specific tokenizers in production.

export function estimateTokensForText(text: string): number {
	if (!text) return 0;
	// Rough heuristic: ~1 token per 4 characters, min 1 per word
	const byChars = Math.ceil(text.length / 4);
	const byWords = Math.max(1, text.trim().split(/\s+/).filter(Boolean).length);
	return Math.max(byChars, byWords);
}

export function estimateTokensForMessages(messages: { role: string; content: string }[]): number {
	return messages.reduce((sum, m) => sum + estimateTokensForText(m.content), 0);
}

export interface UsageEstimate {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}

export function computeUsageEstimate(
	promptMessages: { role: string; content: string }[],
	assistantText: string
): UsageEstimate {
	const promptTokens = estimateTokensForMessages(promptMessages);
	const completionTokens = estimateTokensForText(assistantText);
	return {
		promptTokens,
		completionTokens,
		totalTokens: promptTokens + completionTokens,
	};
}


