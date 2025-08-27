import React from 'react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex items-center px-3 py-2 rounded-md cursor-pointer text-sm text-gray-200 transition-colors duration-200 ${
        active ? 'bg-gray-800' : 'hover:bg-gray-800'
      } ${className}`}
      onClick={onClick}
      whileHover={{ backgroundColor: 'rgba(31, 41, 55, 1)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-4 h-4 mr-3 flex-shrink-0">
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </motion.div>
  );
};

export default SidebarItem;