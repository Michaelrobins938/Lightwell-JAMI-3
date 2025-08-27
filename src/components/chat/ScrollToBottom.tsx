import { ChevronDown } from "lucide-react";

export default function ScrollToBottom({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 z-20 bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-full shadow-lg transition-all duration-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
    >
      <ChevronDown size={20} />
    </button>
  );
}

