import { useVoiceMode } from "../hooks/useVoiceMode";

export default function VoiceTest() {
  const { transcript, isRecording, startRecording, stopRecording } = useVoiceMode();

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙 Voice Test</h2>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "⏹ Stop" : "🎤 Record"}
      </button>
      <div>
        <h3>Transcript:</h3>
        <p>{transcript.join(" ") || "No transcript yet..."}</p>
      </div>
    </div>
  );
}
