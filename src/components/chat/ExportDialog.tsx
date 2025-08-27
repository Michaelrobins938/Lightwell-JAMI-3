// Export dialog component for chat conversations

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExport } from '../../hooks/useExport';
import { ExportOptions } from '../../types/export.types';
import { ChatMessage } from '../../hooks/useStreamingChat';
import { ThreadTree } from '../../types/thread.types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  threadTree?: ThreadTree;
  conversationTitle?: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  messages,
  threadTree,
  conversationTitle = 'Conversation'
}: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'markdown',
    includeMetadata: true,
    includeTimestamps: true,
    includeBranches: false,
    includeSystemMessages: false,
    compressionLevel: 'minimal'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState({
    enabled: false,
    start: '',
    end: ''
  });

  const {
    isExporting,
    progress,
    lastExportResult,
    exportChat,
    cancelExport,
    getProgressPercentage,
    getProgressDescription,
  } = useExport({
    onExportComplete: (result) => {
      if (result.success) {
        // Auto-close dialog after successful export
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    },
    onExportError: (error) => {
      console.error('Export error:', error);
    }
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setExportOptions({
        format: 'markdown',
        includeMetadata: true,
        includeTimestamps: true,
        includeBranches: !!threadTree,
        includeSystemMessages: false,
        compressionLevel: 'minimal'
      });
      setDateRange({ enabled: false, start: '', end: '' });
      setShowAdvanced(false);
    }
  }, [isOpen, threadTree]);

  // Handle export
  const handleExport = async () => {
    let finalOptions = { ...exportOptions };

    // Add date range if enabled
    if (dateRange.enabled && dateRange.start && dateRange.end) {
      finalOptions.dateRange = {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      };
    }

    await exportChat(messages, finalOptions, threadTree);
  };

  // Handle quick export
  const handleQuickExport = (format: 'json' | 'markdown' | 'html' | 'pdf') => {
    const quickOptions: ExportOptions = {
      ...exportOptions,
      format,
      includeMetadata: true,
      includeTimestamps: true,
      includeBranches: format === 'json' && !!threadTree,
    };
    
    exportChat(messages, quickOptions, threadTree);
  };

  if (!isOpen) return null;

  const messageCount = messages.length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  const assistantMessages = messages.filter(m => m.role === 'assistant').length;
  const hasBranches = threadTree && threadTree.branches.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Export Conversation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {conversationTitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conversation Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{messageCount}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Total Messages</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">{userMessages}</div>
                <div className="text-xs text-green-600 dark:text-green-400">Your Messages</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{assistantMessages}</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">AI Responses</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Quick Export Buttons */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Quick Export
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickExport('markdown')}
                  disabled={isExporting}
                  className="flex items-center justify-center p-4 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Markdown</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Human-readable format</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickExport('json')}
                  disabled={isExporting}
                  className="flex items-center justify-center p-4 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">JSON</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Machine-readable data</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickExport('html')}
                  disabled={isExporting}
                  className="flex items-center justify-center p-4 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">HTML</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Web page format</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickExport('pdf')}
                  disabled={isExporting}
                  className="flex items-center justify-center p-4 border-2 border-orange-200 dark:border-orange-700 rounded-xl hover:border-orange-400 dark:hover:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">PDF</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Print-ready document</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
            >
              <motion.svg 
                className="w-4 h-4 mr-2"
                animate={{ rotate: showAdvanced ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
              Advanced Options
            </button>

            {/* Advanced Options */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Export Format
                    </label>
                    <select
                      value={exportOptions.format}
                      onChange={(e) => setExportOptions(prev => ({ 
                        ...prev, 
                        format: e.target.value as any 
                      }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="markdown">Markdown (.md)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="html">HTML (.html)</option>
                      <option value="pdf">PDF (.pdf)</option>
                    </select>
                  </div>

                  {/* Include Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Include in Export
                    </label>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeMetadata}
                          onChange={(e) => setExportOptions(prev => ({ 
                            ...prev, 
                            includeMetadata: e.target.checked 
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Metadata (message counts, topics, summary)
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeTimestamps}
                          onChange={(e) => setExportOptions(prev => ({ 
                            ...prev, 
                            includeTimestamps: e.target.checked 
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Timestamps
                        </span>
                      </label>

                      {hasBranches && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exportOptions.includeBranches}
                            onChange={(e) => setExportOptions(prev => ({ 
                              ...prev, 
                              includeBranches: e.target.checked 
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Thread branches ({threadTree?.branches.length} branches)
                          </span>
                        </label>
                      )}

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeSystemMessages}
                          onChange={(e) => setExportOptions(prev => ({ 
                            ...prev, 
                            includeSystemMessages: e.target.checked 
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          System messages
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={dateRange.enabled}
                        onChange={(e) => setDateRange(prev => ({ 
                          ...prev, 
                          enabled: e.target.checked 
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by date range
                      </span>
                    </label>

                    {dateRange.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ 
                              ...prev, 
                              start: e.target.value 
                            }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ 
                              ...prev, 
                              end: e.target.value 
                            }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Export Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isExporting ? 'Exporting...' : `Export as ${exportOptions.format.toUpperCase()}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Export Progress */}
          {isExporting && progress && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getProgressDescription()}
                </span>
                <button
                  onClick={cancelExport}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Cancel
                </button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Export Result */}
          {lastExportResult && !isExporting && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {lastExportResult.success ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">
                    Export completed successfully! 
                    {lastExportResult.fileSize && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        ({Math.round(lastExportResult.fileSize / 1024)} KB)
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-medium">
                    Export failed: {lastExportResult.errorMessage}
                  </span>
                </div>
              )}
              
              {lastExportResult.warnings && lastExportResult.warnings.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    Warnings: {lastExportResult.warnings.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}