import MarkdownRenderer from "./MarkdownRenderer";
import { motion } from "framer-motion";

export default function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`max-w-[80%] px-4 py-2 rounded-2xl shadow ${
        isUser ? "bg-blue-600 text-white self-end" : "bg-gray-800 text-gray-100 self-start"
      }`}
    >
      <MarkdownRenderer content={content} />
    </motion.div>
  );
}
