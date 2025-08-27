// File upload service for Luna AI - handles file processing and storage

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: 'image' | 'document' | 'other';
  userId?: string;
  chatId?: string;
  createdAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    pages?: number;
    textContent?: string;
  };
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export class FileUploadService {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/files') {
    this.baseUrl = baseUrl;
  }

  /**
   * Upload a single file with progress tracking
   */
  async uploadFile(
    file: File,
    options: {
      userId?: string;
      chatId?: string;
      onProgress?: (progress: UploadProgress) => void;
    } = {}
  ): Promise<UploadedFile> {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileId', fileId);
      
      if (options.userId) formData.append('userId', options.userId);
      if (options.chatId) formData.append('chatId', options.chatId);

      // Start upload
      options.onProgress?.({
        fileId,
        progress: 0,
        status: 'uploading',
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const uploadedFile: UploadedFile = await response.json();

      // Complete upload
      options.onProgress?.({
        fileId,
        progress: 100,
        status: 'completed',
      });

      return uploadedFile;

    } catch (error) {
      options.onProgress?.({
        fileId,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
      throw error;
    }
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadFiles(
    files: File[],
    options: {
      userId?: string;
      chatId?: string;
      onProgress?: (progress: UploadProgress) => void;
      onFileComplete?: (file: UploadedFile) => void;
    } = {}
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(async (file) => {
      try {
        const uploadedFile = await this.uploadFile(file, {
          userId: options.userId,
          chatId: options.chatId,
          onProgress: options.onProgress,
        });
        
        options.onFileComplete?.(uploadedFile);
        return uploadedFile;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Get uploaded file info
   */
  async getFile(fileId: string): Promise<UploadedFile> {
    const response = await fetch(`${this.baseUrl}/${fileId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get file: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${fileId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  /**
   * Get files for a chat
   */
  async getChatFiles(chatId: string): Promise<UploadedFile[]> {
    const response = await fetch(`${this.baseUrl}?chatId=${chatId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get chat files: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Process image for AI analysis
   */
  async processImageForAI(file: UploadedFile): Promise<{
    description: string;
    objects: string[];
    text?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/${file.id}/analyze`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to analyze image: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Extract text from document
   */
  async extractTextFromDocument(file: UploadedFile): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${file.id}/extract-text`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to extract text: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.text;
  }

  /**
   * Generate image preview/thumbnail
   */
  async generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Calculate thumbnail size (max 200px)
          const maxSize = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: File,
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
    } = {}
  ): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/json',
    ];

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
      };
    }

    // Check file type
    const isTypeAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isTypeAllowed) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    return { valid: true };
  }

  /**
   * Format file for chat message
   */
  formatFileForChat(file: UploadedFile): {
    type: 'file';
    file: UploadedFile;
    preview?: string;
    description?: string;
  } {
    return {
      type: 'file',
      file,
      preview: file.type === 'image' ? file.url : undefined,
      description: `Attached ${file.type}: ${file.originalName}`,
    };
  }
}

// Global file upload service instance
export const fileUploadService = new FileUploadService();

// React hook for file uploads
import { useState, useCallback } from 'react';

export function useFileUpload(options: {
  userId?: string;
  chatId?: string;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
} = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate files
      for (const file of files) {
        const validation = fileUploadService.validateFile(file, {
          maxSize: options.maxSize ? options.maxSize * 1024 * 1024 : undefined,
          allowedTypes: options.allowedTypes,
        });

        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }
      }

      // Check file count limit
      if (options.maxFiles && uploadedFiles.length + files.length > options.maxFiles) {
        throw new Error(`Maximum ${options.maxFiles} files allowed`);
      }

      const newFiles = await fileUploadService.uploadFiles(files, {
        userId: options.userId,
        chatId: options.chatId,
        onProgress: (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [progress.fileId]: progress,
          }));
        },
        onFileComplete: (file) => {
          setUploadedFiles(prev => [...prev, file]);
        },
      });

      return newFiles;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles.length, options]);

  const removeFile = useCallback(async (fileId: string) => {
    try {
      await fileUploadService.deleteFile(fileId);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      setUploadProgress(prev => {
        const { [fileId]: removed, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      console.error('Failed to remove file:', err);
    }
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress({});
    setError(null);
  }, []);

  return {
    uploadedFiles,
    uploadProgress,
    isUploading,
    error,
    uploadFiles,
    removeFile,
    clearFiles,
  };
}