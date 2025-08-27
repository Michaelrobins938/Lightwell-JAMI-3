"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
}

export default function ShareModal({ onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Chat</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Copy Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copy Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share to
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Twitter', color: 'bg-blue-500 hover:bg-blue-600' },
                  { name: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                  { name: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
                  { name: 'Reddit', color: 'bg-orange-500 hover:bg-orange-600' }
                ].map(({ name, color }) => (
                  <button
                    key={name}
                    onClick={() => {
                      // TODO: Implement social sharing
                      console.log(`Share to ${name}`);
                    }}
                    className={`p-3 text-white rounded-lg transition-colors ${color} flex items-center justify-center gap-2`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p>Sharing this link will allow others to view this conversation. Make sure you trust the people you're sharing with.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
