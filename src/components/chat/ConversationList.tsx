"use client";

import { MessageSquare } from "lucide-react";

const conversations = {
  today: [
    { id: 1, title: "Project brainstorm" },
    { id: 2, title: "LabGuard Pro ideas" },
  ],
  yesterday: [
    { id: 3, title: "Marketing plan" },
    { id: 4, title: "Investor Q&A" },
  ],
  previous: [
    { id: 5, title: "SmartPCR API design" },
    { id: 6, title: "Art portfolio automation" },
  ],
};

export default function ConversationList() {
  return (
    <div className="px-2 py-4 space-y-6">
      {/* Today */}
      <div>
        <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
          Today
        </h3>
        <div className="mt-2 space-y-1">
          {conversations.today.map((c) => (
            <a
              key={c.id}
              href={`/chat/${c.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare size={16} />
              <span className="truncate">{c.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Yesterday */}
      <div>
        <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
          Yesterday
        </h3>
        <div className="mt-2 space-y-1">
          {conversations.yesterday.map((c) => (
            <a
              key={c.id}
              href={`/chat/${c.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare size={16} />
              <span className="truncate">{c.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Previous */}
      <div>
        <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
          Previous 7 Days
        </h3>
        <div className="mt-2 space-y-1">
          {conversations.previous.map((c) => (
            <a
              key={c.id}
              href={`/chat/${c.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <MessageSquare size={16} />
              <span className="truncate">{c.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
