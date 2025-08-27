// src/hooks/useVoiceSessionFallback.ts
// Fallback version using API key as query parameter (for browser compatibility)
import { useEffect, useRef } from "react";

export function useVoiceSessionFallback(onMessage: (msg: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("[VOICE] Setting up direct OpenAI realtime connection (fallback method)…");

    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!API_KEY) {
      console.error("❌ Missing NEXT_PUBLIC_OPENAI_API_KEY in .env.local");
      return;
    }

    // Construct the websocket URL with API key as query param
    const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview&api_key=${API_KEY}`;
    
    // Connect to OpenAI Realtime API (no headers needed)
    const ws = new WebSocket(url);

    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("[VOICE] ✅ Connected to OpenAI Realtime API (fallback method)");
    };

    ws.onclose = () => {
      console.log("[VOICE] 🔴 WebSocket closed");
    };

    ws.onerror = (err) => {
      console.error("[VOICE] ❌ WebSocket error", err);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.warn("[VOICE] Failed to parse WS message", err);
      }
    };

    wsRef.current = ws;

    // Cleanup on unmount
    return () => {
      console.log("[VOICE] Cleaning up OpenAI connection…");
      ws.close();
      wsRef.current = null;
    };
  }, [onMessage]);

  return {
    send: (msg: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(msg));
      }
    },
  };
}
