// Multi-modal input component supporting text + images like ChatGPT

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MultiModalMessage {
  text: string;
  images: MultiModalImage[];
}

export interface MultiModalImage {
  id: string;
  file: File;
  preview: string;
  alt?: string;
  error?: string;
}

interface MultiModalInputProps {
  onSendMessage: (message: MultiModalMessage) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxImages?: number;
  maxImageSize?: number; // in MB
  allowedImageTypes?: string[];
  className?: string;
}

export function MultiModalInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = "Type a message...",
  maxImages = 4,
  maxImageSize = 5, // 5MB
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
}: MultiModalInputProps) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<MultiModalImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [text, resizeTextarea]);

  // Create image preview
  const createImagePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Validate image file
  const validateImage = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!allowedImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Unsupported image type: ${file.type}`,
      };
    }

    // Check file size
    const maxBytes = maxImageSize * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `Image too large (max ${maxImageSize}MB)`,
      };
    }

    return { valid: true };
  }, [allowedImageTypes, maxImageSize]);

  // Process uploaded images
  const processImages = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check total image count
    if (images.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: MultiModalImage[] = [];

    for (const file of fileArray) {
      // Validate image
      const validation = validateImage(file);
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        const preview = await createImagePreview(file);
        const imageData: MultiModalImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
        };
        newImages.push(imageData);
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
    }
  }, [images.length, maxImages, validateImage, createImagePreview]);

  // Handle file input change
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImages(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processImages]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (!disabled && !isLoading) {
      setIsDragOver(true);
    }
  }, [disabled, isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);

    if (disabled || isLoading) return;

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      processImages(files);
    }
  }, [disabled, isLoading, processImages]);

  // Handle send message
  const handleSend = useCallback(() => {
    if ((!text.trim() && images.length === 0) || disabled || isLoading) {
      return;
    }

    const message: MultiModalMessage = {
      text: text.trim(),
      images: [...images],
    };

    onSendMessage(message);
    setText('');
    setImages([]);
    resizeTextarea();
  }, [text, images, disabled, isLoading, onSendMessage, resizeTextarea]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  // Paste handler for images
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      processImages(files);
    }
  }, [processImages]);

  const hasContent = text.trim() || images.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedImageTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Image previews */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {images.map((image) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  onRemove={() => removeImage(image.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex items-end space-x-3 p-3 bg-white dark:bg-gray-900 border rounded-2xl shadow-lg transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
        } ${disabled || isLoading ? 'opacity-50' : ''}`}
      >
        {/* Add image button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading || images.length >= maxImages}
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            images.length >= maxImages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={`Add image (${images.length}/${maxImages})`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              disabled
                ? "Please wait..."
                : images.length > 0
                ? "Add a message about the image(s)..."
                : placeholder
            }
            disabled={disabled || isLoading}
            rows={1}
            className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none text-base leading-6"
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <motion.button
          whileHover={{ scale: hasContent && !disabled && !isLoading ? 1.05 : 1 }}
          whileTap={{ scale: hasContent && !disabled && !isLoading ? 0.95 : 1 }}
          onClick={handleSend}
          disabled={!hasContent || disabled || isLoading}
          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
            hasContent && !disabled && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
          title={isLoading ? "Please wait..." : "Send message"}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </motion.button>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center pointer-events-none"
            >
              <div className="text-blue-600 dark:text-blue-400 text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Drop images here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard hint */}
      {hasContent && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 right-4 text-xs text-gray-400 dark:text-gray-500"
        >
          Press Enter to send • {images.length > 0 && `${images.length} image${images.length === 1 ? '' : 's'} attached`}
        </motion.div>
      )}
    </div>
  );
}

// Image preview component
function ImagePreview({ 
  image, 
  onRemove 
}: { 
  image: MultiModalImage; 
  onRemove: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.preview}
          alt={image.alt || 'Uploaded image'}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Remove image"
      >
        ×
      </button>

      {/* Error indicator */}
      {image.error && (
        <div className="absolute inset-0 bg-red-500/80 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}