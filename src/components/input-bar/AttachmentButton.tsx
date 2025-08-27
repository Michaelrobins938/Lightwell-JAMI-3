"use client";

import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface AttachmentButtonProps {
  onFileSelect: (files: File[]) => void;
}

export default function AttachmentButton({ onFileSelect }: AttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(Array.from(e.target.files));
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        title="Attach files"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
