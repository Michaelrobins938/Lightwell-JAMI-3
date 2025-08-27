"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HomepageMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomepageMobileSidebar({ isOpen, onClose }: HomepageMobileSidebarProps) {
  const features = [
    "Research",
    "Safety",
    "For Business",
    "For Developers",
    "Community",
    "News",
    "Company",
  ];

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -300 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.08, // delay each link
      },
    },
    exit: {
      x: -300,
      transition: { duration: 0.2 },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 200 
      } 
    },
    hover: {
      scale: 1.05,
      x: 5,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="relative w-64 h-full bg-gray-900 border-r border-gray-700 p-6"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>

            <h1 className="text-3xl font-bold mb-8 text-white">
              Lightwell
            </h1>
            <motion.nav className="flex flex-col space-y-4">
              {features.map((f) => (
                <motion.div 
                  key={f} 
                  variants={linkVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Link
                    href={`/${f.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800 relative overflow-hidden"
                    onClick={onClose}
                  >
                    <span className="relative z-10">{f}</span>
                    <motion.div
                      className="absolute inset-0 bg-gray-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      initial={false}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
