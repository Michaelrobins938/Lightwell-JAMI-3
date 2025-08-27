# LLM Setup Guide

## 1. OpenRouter API Setup

- Sign up at https://openrouter.ai/
- Get your OpenRouter API key
- Add to your .env.local:

OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=anthropic/claude-3-opus:beta

## 2. Supported Models
- Claude 3 Opus, Sonnet, Haiku
- GPT-4o, GPT-4 Turbo, etc.

## 3. Environment Variables
- Make sure .env.local contains only OpenRouter and OpenAI keys (no Groq)

## 4. Troubleshooting
- If you see missing API key errors, check .env.local and restart your dev server.
- For model errors, verify the model name in OPENROUTER_MODEL.

## 5. Testing
- Use /api/test-llm to verify OpenRouter integration.

## 6. More Info
- https://openrouter.ai/docs 