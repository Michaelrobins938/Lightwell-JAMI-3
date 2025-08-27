import { useState } from "react";

export default function VoiceRecorder({ onSend }: { onSend: (text: string) => void }) {
  const [recording, setRecording] = useState(false);

  const handleRecord = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (!recording) {
      recognition.start();
      setRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        onSend(transcript);
      };
      recognition.onend = () => setRecording(false);
    } else {
      recognition.stop();
      setRecording(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRecord}
      className={`ml-2 px-3 py-1 rounded-xl ${recording ? "bg-red-600" : "bg-gray-700"} text-white`}
    >
      🎤
    </button>
  );
}
