// SearchModal.tsx - Luna AI-style search modal
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageSquare, Clock, Edit3 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  type: 'chat' | 'recent';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: any[];
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

// Mock recent searches and suggestions
const recentSearches = [
  'Chat UI design suggestions',
  'Volume button matrix explained',
  'Example chat transcript',
  'Trial of Valerian O\'Steen',
];

export function SearchModal({
  isOpen,
  onClose,
  conversations,
  onSelectConversation,
  onNewChat
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
      // Show recent searches initially
      setSearchResults(
        recentSearches.map((search, index) => ({
          id: `recent-${index}`,
          title: search,
          preview: '',
          timestamp: '',
          type: 'recent' as const
        }))
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter conversations based on search query
      const filtered = conversations
        .filter(conv =>
          conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8)
        .map(conv => ({
          id: conv.id,
          title: conv.title || 'Untitled Chat',
          preview: conv.lastMessage || 'No messages yet',
          timestamp: new Date(conv.updatedAt).toLocaleDateString(),
          type: 'chat' as const
        }));

      setSearchResults(filtered);
    } else {
      // Show recent searches when no query
      setSearchResults(
        recentSearches.map((search, index) => ({
          id: `recent-${index}`,
          title: search,
          preview: '',
          timestamp: '',
          type: 'recent' as const
        }))
      );
    }
    setSelectedIndex(0);
  }, [searchQuery, conversations]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === 0 && searchQuery.trim()) {
        // New chat with query
        onNewChat();
        onClose();
      } else if (searchResults[selectedIndex - 1]) {
        const result = searchResults[selectedIndex - 1];
        if (result.type === 'chat') {
          onSelectConversation(result.id);
          onClose();
        }
      }
    }
  };

  const handleSelectResult = (result: SearchResult, index: number) => {
    if (index === 0 && searchQuery.trim()) {
      // New chat
      onNewChat();
      onClose();
    } else if (result.type === 'chat') {
      onSelectConversation(result.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl mx-4"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Modal */}
          <div className="bg-[#2c2c2c] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,.4)] border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/60" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white placeholder-white/50 text-lg outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-white/10 text-white/60 hover:text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div ref={resultsRef} className="max-h-96 overflow-y-auto">
              {/* New Chat Option */}
              {searchQuery.trim() && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left ${selectedIndex === 0 ? 'bg-white/5' : ''}`}
                  onClick={() => handleSelectResult({ id: 'new', title: 'New chat', preview: '', timestamp: '', type: 'recent' }, 0)}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-medium">New chat</div>
                    <div className="text-white/50 text-sm">Start a new conversation</div>
                  </div>
                </motion.button>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="py-2">
                  {!searchQuery.trim() && (
                    <div className="px-4 py-2 text-white/40 text-xs uppercase tracking-wide">
                      Today
                    </div>
                  )}

                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left ${selectedIndex === (searchQuery.trim() ? index + 1 : index) ? 'bg-white/5' : ''}`}
                      onClick={() => handleSelectResult(result, searchQuery.trim() ? index + 1 : index)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        {result.type === 'chat' ? (
                          <MessageSquare className="w-4 h-4 text-white/80" />
                        ) : (
                          <Clock className="w-4 h-4 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{result.title}</div>
                        {result.preview && (
                          <div className="text-white/50 text-sm truncate mt-0.5">{result.preview}</div>
                        )}
                        {result.timestamp && (
                          <div className="text-white/40 text-xs mt-1">{result.timestamp}</div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <div className="text-white/60">No chats found</div>
                  <div className="text-white/40 text-sm mt-1">
                    Try adjusting your search terms
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between text-xs text-white/50">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <div>
                  {searchResults.length > 0 && `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
