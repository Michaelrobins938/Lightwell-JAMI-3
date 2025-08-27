"use client";

import { Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

const actions = [
  { icon: Copy, label: "Copy" },
  { icon: RefreshCw, label: "Regenerate" },
  { icon: ThumbsUp, label: "Good" },
  { icon: ThumbsDown, label: "Bad" },
];

export default function MessageActions() {
  return (
    <div className="absolute -bottom-8 left-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="p-1 rounded-md bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-sm"
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
