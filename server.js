require("dotenv").config({ path: ".env.local" });
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/api/realtime" });

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in environment variables");
  process.exit(1);
}

console.log("🔑 Using API key:", process.env.OPENAI_API_KEY.substring(0, 10) + "...");

// Simple index page served
app.get("/", (_, res) => {
  res.send(`
<!DOCTYPE html>
<html>
  <body>
    <h2>🎤 OpenAI Realtime - Auto-Running</h2>
    <p>Status: <span id="status">Starting...</span></p>
    
    <h3>Latest Response:</h3>
    <div id="response" style="background:#000; color:#0f0; padding:10px; margin:10px 0; min-height:100px; font-family:monospace;"></div>
    
    <h3>Event Log:</h3>
    <pre id="log" style="background:#000; color:#0f0; padding:10px; height:300px; overflow-y:scroll; font-size:12px;"></pre>

    <script>
      let ws;
      let audioCtx;
      let sessionReady = false;
      
      function log(msg, data) {
        const el = document.getElementById("log");
        el.textContent += msg + (data ? " " + JSON.stringify(data) : "") + "\\n";
        el.scrollTop = el.scrollHeight;
        console.log(msg, data || "");
      }

      function setStatus(text) {
        document.getElementById("status").textContent = text;
      }

      function updateResponse(text) {
        document.getElementById("response").textContent = text;
      }

      function playAudio(audioData) {
        if (!audioCtx) {
          audioCtx = new AudioContext();
        }
        
        try {
          // Convert base64 to audio buffer and play
          const arrayBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0)).buffer;
          audioCtx.decodeAudioData(arrayBuffer).then(buffer => {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start();
            log("🔊 Playing audio chunk");
          });
        } catch (err) {
          log("❌ Audio error:", err.message);
        }
      }

      // Auto-connect when page loads
      function autoConnect() {
        setStatus("Connecting...");
        ws = new WebSocket("ws://localhost:3000/api/realtime");

        ws.onopen = () => {
          setStatus("Connected - Waiting for session...");
          log("✅ Connected to proxy");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            log("📥", data);

            // Handle session creation
            if (data.type === "session.created") {
              log("🎉 Session created with OpenAI");
              sessionReady = true;
              setStatus("Connected - Session ready, starting conversation...");
              
              // Wait a moment then start conversation
              setTimeout(() => {
                startConversation();
              }, 500);
            }
            
            // Handle text responses
            if (data.type === "response.output_text.delta") {
              const currentText = document.getElementById("response").textContent;
              updateResponse(currentText + data.delta);
            }
            
            // Handle audio responses
            if (data.type === "response.audio.delta" && data.delta) {
              playAudio(data.delta);
            }
            
            // Handle completion
            if (data.type === "response.completed") {
              log("✅ Response completed");
              setStatus("Connected - Ready for next conversation");
            }
            
            // Handle errors
            if (data.type === "error") {
              log("❌ OpenAI Error:", data.error.message);
              setStatus("Error occurred - check log");
              
              // If it's a server error, try to restart conversation
              if (data.error.message.includes("server_error")) {
                log("🔄 Retrying conversation in 3 seconds...");
                setTimeout(() => {
                  if (sessionReady) {
                    startConversation();
                  }
                }, 3000);
              }
            }
            
          } catch (err) {
            log("📥 raw", event.data);
          }
        };

        ws.onclose = () => {
          setStatus("Disconnected");
          log("🔌 WebSocket closed");
          sessionReady = false;
        };

        ws.onerror = (err) => {
          setStatus("Error");
          log("❌ Error:", err.message);
        };
      }

      function startConversation() {
        if (!ws || ws.readyState !== WebSocket.OPEN || !sessionReady) {
          log("⚠️ Not ready to start conversation");
          return;
        }

        log("🚀 Starting automatic conversation...");
        
        // Clear previous response
        updateResponse("");
        
        // Send conversation item
        ws.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: "Hello! Please introduce yourself and tell me something interesting." }]
          }
        }));
        log("📤 Sent conversation item");

        // Wait a moment then request response
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["text", "audio"],
              instructions: "Respond conversationally and naturally. Be engaging and informative."
            }
          }));
          log("📤 Requested response with text + audio");
        }, 200);
      }

      // Auto-start everything when page loads
      window.onload = () => {
        log("🚀 Page loaded - auto-connecting...");
        autoConnect();
      };
    </script>
  </body>
</html>
  `);
});

// WebSocket proxy → OpenAI Realtime
wss.on("connection", async (client) => {
  console.log("🔌 Browser connected to proxy");
  const WebSocket = require("ws");
  const openai = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "OpenAI-Beta": "realtime=v1" } }
  );

  openai.on("open", () => {
    console.log("✅ Connected to OpenAI Realtime");
  });

  client.on("message", (msg) => {
    if (openai.readyState === openai.OPEN) {
      console.log("📤 Browser → OpenAI:", msg.toString());
      openai.send(msg);
    }
  });
  
  openai.on("message", (msg) => {
    if (client.readyState === client.OPEN) {
      console.log("📥 OpenAI → Browser:", msg.toString());
      client.send(msg.toString());
    }
  });

  client.on("close", () => {
    console.log("🔌 Browser disconnected");
    openai.close();
  });
  
  openai.on("close", () => {
    console.log("❌ OpenAI connection closed");
    client.close();
  });

  openai.on("error", (err) => {
    console.error("❌ OpenAI error:", err);
  });
});

server.listen(3000, () => {
  console.log("🚀 Ready at http://localhost:3000");
  console.log("🎙️ Realtime WS at ws://localhost:3000/api/realtime");
  console.log("🎯 Auto-conversation will start when you open the page!");
});