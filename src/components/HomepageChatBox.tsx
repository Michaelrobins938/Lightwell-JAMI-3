"use client";

import { useState } from "react";
import { ArrowUp, Paperclip, Search, Mic } from "lucide-react";

export default function HomepageChatBox() {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Demo JAMI-3 says: "${input}"`);
    setInput("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center">
      <h2 className="text-4xl font-bold mb-6 text-white">
        JAMI-3
      </h2>
      <p className="text-gray-300 mb-8 text-lg">
        Talk openly. Be heard. Find peace.
      </p>
      <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-700 mb-6">
        <input
          type="text"
          placeholder="Ask JAMI-3..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
        />
        <div className="flex items-center space-x-2 ml-3">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-300 transition">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-gray-300 transition">
            <Search className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-gray-300 transition">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 text-sm text-gray-300 border border-gray-600 shadow-md transition-all">
          How can JAMI-3 help with anxiety?
        </button>
        <button className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 text-sm text-gray-300 border border-gray-600 shadow-md transition-all">
          Tell me about mindfulness techniques
        </button>
        <button className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 text-sm text-gray-300 border border-gray-600 shadow-md transition-all">
          I'm feeling overwhelmed today
        </button>
      </div>
    </div>
  );
}
