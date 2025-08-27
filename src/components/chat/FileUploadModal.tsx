"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Image, Video, Music, File, FolderOpen, Plus, Brain, Search, Palette, Infinity, BookOpen, Globe, Pencil, Cloud, Paperclip } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
}

export default function FileUploadModal({ isOpen, onClose, onFileUpload }: FileUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  const mainOptions = [
    { icon: Paperclip, label: "Add photos & files", action: () => fileInputRef.current?.click() },
    { icon: Cloud, label: "Add from Google Drive", action: () => console.log("Google Drive") },
    { icon: Brain, label: "Agent mode", action: () => console.log("Agent mode"), isNew: true },
    { icon: Search, label: "Deep research", action: () => console.log("Deep research") },
    { icon: Palette, label: "Create image", action: () => console.log("Create image") },
    { icon: Infinity, label: "Use connectors", action: () => console.log("Use connectors") },
    { icon: Plus, label: "More", action: () => setShowMoreOptions(!showMoreOptions), hasArrow: true },
  ];

  const moreOptions = [
    { icon: BookOpen, label: "Study and learn", action: () => console.log("Study and learn") },
    { icon: Globe, label: "Web search", action: () => console.log("Web search") },
    { icon: Pencil, label: "Canvas", action: () => console.log("Canvas") },
    { icon: Cloud, label: "Connect OneDrive", action: () => console.log("OneDrive") },
    { icon: Cloud, label: "Connect Sharepoint", action: () => console.log("SharePoint") },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            className="relative w-80 bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content */}
            <div className="p-3">
              {/* ChatGPT-style Options Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Left Column - Main Options */}
                <div className="space-y-1">
                  {mainOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={option.action}
                      className="w-full flex items-center gap-2 p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
                    >
                      <option.icon className="w-3 h-3 text-white/60" />
                      <span className="flex-1">{option.label}</span>
                      {option.isNew && (
                        <span className="px-1 py-0.5 bg-gray-600 text-white text-xs rounded-full">NEW</span>
                      )}
                      {option.hasArrow && (
                        <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Right Column - More Options (shown when More is clicked) */}
                {showMoreOptions && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1 border-l border-white/10 pl-2"
                  >
                    {moreOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={option.action}
                        className="w-full flex items-center gap-2 p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs"
                      >
                        <option.icon className="w-3 h-3 text-white/60" />
                        <span className="flex-1">{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
