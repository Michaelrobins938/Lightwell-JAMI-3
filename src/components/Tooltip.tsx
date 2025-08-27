import React from 'react';
import { motion } from 'framer-motion';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded-md whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none"
      >
        {content}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
      </motion.div>
    </div>
  );
};