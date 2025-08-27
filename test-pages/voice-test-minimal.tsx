import React, { useState, useRef } from "react";

export default function VoiceTestMinimal() {
  const [status, setStatus] = useState<"disconnected" | "connected">("disconnected");
  const [log, setLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const logEvent = (msg: string, data?: any) => {
    setLog((prev) => [...prev, msg + (data ? " " + JSON.stringify(data) : "")]);
    console.log(msg, data || "");
  };

  const connect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:3000/api/realtime");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      logEvent("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logEvent("📥", data);
      } catch {
        logEvent("📥 (raw)", event.data);
      }
    };

    ws.onerror = (err) => {
      logEvent("❌ WebSocket error", err);
    };

    ws.onclose = (evt) => {
      setStatus("disconnected");
      logEvent("🔌 WebSocket closed", evt.code);
    };
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("disconnected");
    logEvent("🔌 Disconnected manually");
  };

  const sendPing = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      logEvent("⚠️ Not connected");
      return;
    }

    // STEP 1: Send conversation item (the user text)
    wsRef.current.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            { type: "input_text", text: "Hello from browser!" }
          ]
        }
      })
    );
    logEvent("📤 Sent conversation.item.create");

    // STEP 2: Ask model to respond
    wsRef.current.send(
      JSON.stringify({
        type: "response.create",
        response: {
          modalities: ["text", "audio"],
          instructions: "Respond conversationally."
        }
      })
    );
    logEvent("📤 Sent response.create");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🎤 Voice Test Minimal</h1>
      <p>Status: {status === "connected" ? "🟢 connected" : "🔴 disconnected"}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={connect} className="bg-green-600 px-4 py-2 rounded">Connect</button>
        <button onClick={sendPing} className="bg-blue-600 px-4 py-2 rounded">Send Ping</button>
        <button onClick={disconnect} className="bg-red-600 px-4 py-2 rounded">Disconnect</button>
      </div>

      <h2 className="mt-6 font-semibold">Event Log:</h2>
      <pre className="bg-black text-green-400 p-3 mt-2 h-80 overflow-y-scroll">
        {log.join("\n")}
      </pre>
    </div>
  );
}
