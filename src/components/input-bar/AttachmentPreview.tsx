"use client";

import React from 'react';
import { X, File, Image, Video, Music } from 'lucide-react';

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export default function AttachmentPreview({ files, onRemove }: AttachmentPreviewProps) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {files.map((file, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm"
        >
          <div className="text-gray-600 dark:text-gray-400">
            {getFileIcon(file)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white truncate font-medium">
              {file.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={() => onRemove(i)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
