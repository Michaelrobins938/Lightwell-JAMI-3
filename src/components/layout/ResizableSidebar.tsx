// Resizable sidebar component with drag handles and persistent storage

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResizableSidebar } from '../../hooks/useResizableSidebar';
import { SidebarConfig, SidebarPreset } from '../../types/sidebar.types';

interface ResizableSidebarProps {
  config: SidebarConfig;
  children: React.ReactNode;
  className?: string;
  onResize?: (width: number) => void;
  onCollapse?: (isCollapsed: boolean) => void;
  showPresetButtons?: boolean;
  showStats?: boolean;
}

export function ResizableSidebar({
  config,
  children,
  className = '',
  onResize,
  onCollapse,
  showPresetButtons = false,
  showStats = false,
}: ResizableSidebarProps) {
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  // Use the resizable sidebar hook
  const {
    width,
    isCollapsed,
    isResizing,
    isVisible,
    actualWidth,
    canResize,
    isAtMinWidth,
    isAtMaxWidth,
    updateWidth,
    toggleCollapse,
    setCollapsed,
    applyPreset,
    resetToDefaults,
    startResize,
    startTouchResize,
    getPresets,
    getStats,
    exportConfig,
    importConfig,
  } = useResizableSidebar(config, {
    onResize,
    onCollapse,
    debounceDelay: 150,
    enableKeyboardShortcuts: true,
  });

  const [presets, setPresets] = useState<SidebarPreset[]>([]);
  const [stats, setStats] = useState({
    totalResizes: 0,
    averageWidth: 0,
    mostCommonWidth: 0,
    resizeFrequency: {} as Record<string, number>
  });

  // Load presets and stats
  useEffect(() => {
    setPresets(getPresets());
    setStats(getStats());
  }, [getPresets, getStats]);

  // Handle preset application
  const handleApplyPreset = useCallback((preset: SidebarPreset) => {
    applyPreset(preset);
    setShowPresetMenu(false);
  }, [applyPreset]);

  // Handle config export
  const handleExportConfig = useCallback(() => {
    const configJson = exportConfig();
    if (configJson) {
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sidebar-config-${config.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [exportConfig, config.id]);

  // Handle config import
  const handleImportConfig = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const configJson = e.target?.result as string;
      if (configJson) {
        const success = importConfig(configJson);
        if (success) {
          console.log('Sidebar configuration imported successfully');
        } else {
          console.error('Failed to import sidebar configuration');
        }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [importConfig]);

  if (!isVisible) {
    return null;
  }

  const sidebarStyle: React.CSSProperties = {
    width: actualWidth,
    [config.position]: 0,
    position: 'relative',
    transition: isResizing ? 'none' : 'width 0.2s ease-out',
  };

  const handleStyle: React.CSSProperties = {
    [config.position === 'left' ? 'right' : 'left']: -6,
    cursor: canResize ? 'ew-resize' : 'default',
    opacity: canResize ? 1 : 0.3,
  };

  return (
    <div
      className={`flex-shrink-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
        config.position === 'left' ? 'border-r' : 'border-l'
      } relative ${className}`}
      style={sidebarStyle}
    >
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-hidden"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-12 flex flex-col items-center justify-start pt-4"
          >
            {/* Collapsed state content */}
            <button
              onClick={toggleCollapse}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={`Expand ${config.position} sidebar`}
            >
              <svg 
                className={`w-4 h-4 transform ${config.position === 'right' ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize Handle */}
      {canResize && (
        <div
          className="absolute top-0 bottom-0 w-3 bg-transparent hover:bg-blue-200 dark:hover:bg-blue-800 hover:bg-opacity-50 cursor-ew-resize group transition-colors"
          style={handleStyle}
          onMouseDown={startResize}
          onTouchStart={startTouchResize}
        >
          {/* Resize indicator */}
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-px w-0.5 bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
          
          {/* Resize dots */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
          </div>
        </div>
      )}

      {/* Collapse/Expand Button */}
      {config.isCollapsible && !isCollapsed && (
        <button
          onClick={toggleCollapse}
          className={`absolute top-4 w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            config.position === 'left' ? '-right-3' : '-left-3'
          }`}
          title={`Collapse ${config.position} sidebar`}
        >
          <svg 
            className={`w-3 h-3 transform ${config.position === 'right' ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Preset Buttons */}
      {showPresetButtons && !isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="relative">
            <button
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
            >
              <span>Presets</span>
              <svg 
                className={`w-4 h-4 transform transition-transform ${showPresetMenu ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Preset Menu */}
            <AnimatePresence>
              {showPresetMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                        width === preset.width ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        {preset.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {preset.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {preset.width}px
                      </div>
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={resetToDefaults}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-orange-600 dark:text-orange-400"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      {showStats && !isCollapsed && (
        <div className="absolute top-16 left-4 right-4">
          <button
            onClick={() => setShowStatsPanel(!showStatsPanel)}
            className="w-full px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-between"
          >
            <span>Statistics</span>
            <svg 
              className={`w-4 h-4 transform transition-transform ${showStatsPanel ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showStatsPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Resizes:</span>
                  <span className="font-medium">{stats.totalResizes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Width:</span>
                  <span className="font-medium">{Math.round(stats.averageWidth)}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Most Common:</span>
                  <span className="font-medium">{stats.mostCommonWidth}px</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Export/Import:</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={handleExportConfig}
                      className="flex-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                    >
                      Export
                    </button>
                    <label className="flex-1">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                      <div className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors cursor-pointer text-center">
                        Import
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Width Indicator */}
      {isResizing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute top-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg ${
            config.position === 'left' ? 'left-4' : 'right-4'
          }`}
        >
          {width}px
          {isAtMinWidth && <span className="ml-1 text-yellow-200">(min)</span>}
          {isAtMaxWidth && <span className="ml-1 text-yellow-200">(max)</span>}
        </motion.div>
      )}
    </div>
  );
}