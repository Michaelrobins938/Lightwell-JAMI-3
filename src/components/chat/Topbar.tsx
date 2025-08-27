"use client";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

type Props = {
  model: string; 
  setModel:(m:string)=>void;
  markdown: boolean; 
  setMarkdown:(v:boolean)=>void;
}

const MODELS = [
  { id:"gpt-5", label:"Luna AI-5" },
  { id:"gpt-4o", label:"GPT-4o" },
  { id:"gpt-4o-mini", label:"GPT-4o mini" },
];

export default function Topbar({ model, setModel, markdown, setMarkdown }: Props) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const currentModel = MODELS.find(m => m.id === model);

  return (
    <div className="flex items-center justify-between p-3 border-b border-white/10 bg-gray-800">
      <div className="flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-white">Luna AI-5</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            className="icon-btn flex items-center gap-2 px-3 py-2"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            title="Model"
          >
            <span className="text-sm">{currentModel?.label || "Model"}</span>
            <ChevronDown size={16}/>
          </button>
          
          {showModelDropdown && (
            <div className="absolute right-0 top-12 bg-gray-800 border border-gray-600 rounded-lg p-2 z-50 min-w-[120px]">
              {MODELS.map((modelOption) => (
                <div
                  key={modelOption.id}
                  className={`px-3 py-2 rounded cursor-pointer text-sm ${
                    model === modelOption.id 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setModel(modelOption.id);
                    setShowModelDropdown(false);
                  }}
                >
                  {modelOption.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          className="icon-btn flex items-center gap-2 px-3 py-2" 
          onClick={() => setMarkdown(!markdown)} 
          title="Markdown"
        >
          <span className="text-sm">{markdown ? "Markdown: On" : "Markdown: Off"}</span>
        </button>
      </div>
    </div>
  );
}

