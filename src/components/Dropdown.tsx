import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideDown, fadeIn } from '../utils/animations';
import { ChevronRight } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: DropdownItem[];
  badge?: string;
}

interface DropdownProps {
  items: DropdownItem[];
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  children,
  className = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuIndex, setSubmenuIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSubmenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: DropdownItem, index: number) => {
    if (item.children && item.children.length > 0) {
      setSubmenuIndex(submenuIndex === index ? null : index);
    } else {
      item.onClick?.();
      setIsOpen(false);
      setSubmenuIndex(null);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 mt-2 min-w-[200px] bg-gray-900 border border-gray-800 rounded-lg shadow-lg ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="py-1">
              {items.map((item, index) => (
                <div key={index} className="relative">
                  <motion.div
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleItemClick(item, index)}
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 1)' }}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <div className="w-4 h-4 mr-3">
                          {item.icon}
                        </div>
                      )}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.children && item.children.length > 0 && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {item.children && submenuIndex === index && (
                      <motion.div
                        className="absolute left-full top-0 ml-1 min-w-[180px] bg-gray-900 border border-gray-800 rounded-lg shadow-lg"
                        variants={slideDown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="py-1">
                          {item.children.map((subItem, subIndex) => (
                            <motion.div
                              key={subIndex}
                              className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 cursor-pointer"
                              onClick={() => {
                                subItem.onClick?.();
                                setIsOpen(false);
                                setSubmenuIndex(null);
                              }}
                              whileHover={{ backgroundColor: 'rgba(31, 41, 55, 1)' }}
                            >
                              {subItem.icon && (
                                <div className="w-4 h-4 mr-3">
                                  {subItem.icon}
                                </div>
                              )}
                              <span>{subItem.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;