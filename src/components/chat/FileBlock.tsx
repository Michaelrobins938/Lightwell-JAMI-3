"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  File, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileArchive, 
  FileSpreadsheet, 
  Presentation, 
  Download,
  ExternalLink
} from 'lucide-react';

interface FileBlockProps {
  url: string;
  name: string;
}

export default function FileBlock({ url, name }: FileBlockProps) {
  const fileName = name || url.split("/").pop() || "Download file";
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Get file icon based on extension
  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
      case 'svg':
        return <FileImage className="w-5 h-5 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <FileVideo className="w-5 h-5 text-pink-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <FileAudio className="w-5 h-5 text-yellow-500" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FileArchive className="w-5 h-5 text-gray-500" />;
      case 'txt':
      case 'md':
        return <FileText className="w-5 h-5 text-gray-400" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <FileText className="w-5 h-5 text-yellow-400" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'html':
      case 'xml':
        return <FileText className="w-5 h-5 text-orange-400" />;
      case 'json':
        return <FileText className="w-5 h-5 text-green-400" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get file type label
  const getFileType = (ext: string) => {
    switch (ext) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'xls':
      case 'xlsx': return 'Excel Spreadsheet';
      case 'csv': return 'CSV Data';
      case 'ppt':
      case 'pptx': return 'PowerPoint Presentation';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp': return 'Image File';
      case 'svg': return 'SVG Vector';
      case 'mp4':
      case 'avi':
      case 'mov': return 'Video File';
      case 'mp3':
      case 'wav': return 'Audio File';
      case 'zip':
      case 'rar': return 'Archive File';
      case 'txt': return 'Text File';
      case 'md': return 'Markdown File';
      case 'js':
      case 'ts': return 'JavaScript/TypeScript';
      case 'jsx':
      case 'tsx': return 'React Component';
      case 'css': return 'Stylesheet';
      case 'html': return 'HTML Document';
      case 'xml': return 'XML Document';
      case 'json': return 'JSON Data';
      default: return 'File';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="my-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getFileIcon(fileExtension)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-200 truncate">
              {fileName}
            </div>
            <div className="text-xs text-gray-400">
              {getFileType(fileExtension)}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {url}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
          <a
            href={url}
            download={fileName}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            title="Download file"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}
