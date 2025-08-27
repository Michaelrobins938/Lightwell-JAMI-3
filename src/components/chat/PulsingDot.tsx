"use client";
import { motion } from "framer-motion";

export default function PulsingDot() {
  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        className="w-2 h-2 bg-white rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}