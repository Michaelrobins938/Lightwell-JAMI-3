import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Volume2, 
  VolumeX, 
  Zap, 
  ZapOff,
  Settings,
  X,
  Accessibility,
  Headphones
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  contrast: 'normal' | 'high' | 'very-high';
  reducedMotion: boolean;
  screenReader: boolean;
  soundEffects: boolean;
  focusIndicators: boolean;
  dyslexiaFriendly: boolean;
}

interface AccessibilityToolbarProps {
  onSettingsChange: (settings: AccessibilitySettings) => void;
  className?: string;
}

const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ 
  onSettingsChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false,
    soundEffects: true,
    focusIndicators: true,
    dyslexiaFriendly: false,
  });

  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    // Apply font size
    const fontSizeMap = {
      'small': 'text-sm',
      'medium': 'text-base',
      'large': 'text-lg',
      'x-large': 'text-xl'
    };
    
    document.documentElement.className = document.documentElement.className
      .replace(/text-(sm|base|lg|xl)/g, '')
      .replace(/contrast-(normal|high|very-high)/g, '')
      .replace(/motion-(reduced|normal)/g, '')
      .replace(/dyslexia-(enabled|disabled)/g, '');
    
    document.documentElement.classList.add(
      fontSizeMap[newSettings.fontSize],
      `contrast-${newSettings.contrast}`,
      `motion-${newSettings.reducedMotion ? 'reduced' : 'normal'}`,
      `dyslexia-${newSettings.dyslexiaFriendly ? 'enabled' : 'disabled'}`
    );

    // Apply focus indicators
    if (newSettings.focusIndicators) {
      document.documentElement.classList.add('focus-visible');
    } else {
      document.documentElement.classList.remove('focus-visible');
    }

    // Notify parent component
    onSettingsChange(newSettings);
    
    // Save to localStorage
    localStorage.setItem('luna-accessibility-settings', JSON.stringify(newSettings));
  }, [onSettingsChange]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('luna-accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, [applySettings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 'medium',
      contrast: 'normal',
      reducedMotion: false,
      screenReader: false,
      soundEffects: true,
      focusIndicators: true,
      dyslexiaFriendly: false,
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-8 z-30 p-4 bg-luna-500 text-white rounded-full shadow-lg hover:bg-luna-600 transition-colors focus:outline-none focus:ring-4 focus:ring-luna-300 ${
          settings.focusIndicators ? 'focus:ring-4 focus:ring-luna-300' : ''
        }`}
        style={{ right: '2rem' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Accessibility settings"
      >
        <Accessibility size={24} />
      </motion.button>

      {/* Accessibility Panel */}
      {isOpen && (
        <motion.div
          key="accessibility-panel"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-luna-800 shadow-2xl z-40 border-l border-luna-200 dark:border-luna-700 ${className}`}
        >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-luna-900 dark:text-luna-100">
                  Accessibility Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-luna-100 dark:hover:bg-luna-700 rounded-full transition-colors"
                  aria-label="Close accessibility settings"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Settings Content */}
              <div className="flex-1 space-y-6 overflow-y-auto">
                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-luna-700 dark:text-luna-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['small', 'medium', 'large', 'x-large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting('fontSize', size)}
                        className={`p-2 rounded border transition-colors ${
                          settings.fontSize === size
                            ? 'bg-luna-500 text-white border-luna-500'
                            : 'bg-white dark:bg-luna-700 border-luna-200 dark:border-luna-600 text-luna-700 dark:text-luna-300 hover:bg-luna-50 dark:hover:bg-luna-600'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div>
                  <label className="block text-sm font-medium text-luna-700 dark:text-luna-300 mb-2">
                    Contrast
                  </label>
                  <div className="space-y-2">
                    {(['normal', 'high', 'very-high'] as const).map((contrast) => (
                      <button
                        key={contrast}
                        onClick={() => updateSetting('contrast', contrast)}
                        className={`w-full p-3 rounded border transition-colors text-left ${
                          settings.contrast === contrast
                            ? 'bg-luna-500 text-white border-luna-500'
                            : 'bg-white dark:bg-luna-700 border-luna-200 dark:border-luna-600 text-luna-700 dark:text-luna-300 hover:bg-luna-50 dark:hover:bg-luna-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{contrast.charAt(0).toUpperCase() + contrast.slice(1)}</span>
                          {contrast === 'high' && <Eye size={16} />}
                          {contrast === 'very-high' && <EyeOff size={16} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap size={16} />
                      <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                        Reduced Motion
                      </span>
                    </div>
                    <button
                      onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.reducedMotion ? 'bg-luna-500' : 'bg-luna-200 dark:bg-luna-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} />
                      <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                        Screen Reader
                      </span>
                    </div>
                    <button
                      onClick={() => updateSetting('screenReader', !settings.screenReader)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.screenReader ? 'bg-luna-500' : 'bg-luna-200 dark:bg-luna-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 size={16} />
                      <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                        Sound Effects
                      </span>
                    </div>
                    <button
                      onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.soundEffects ? 'bg-luna-500' : 'bg-luna-200 dark:bg-luna-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Type size={16} />
                      <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                        Focus Indicators
                      </span>
                    </div>
                    <button
                      onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.focusIndicators ? 'bg-luna-500' : 'bg-luna-200 dark:bg-luna-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Headphones size={16} />
                      <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                        Dyslexia Friendly
                      </span>
                    </div>
                    <button
                      onClick={() => updateSetting('dyslexiaFriendly', !settings.dyslexiaFriendly)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.dyslexiaFriendly ? 'bg-luna-500' : 'bg-luna-200 dark:bg-luna-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.dyslexiaFriendly ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-luna-200 dark:border-luna-700">
                <button
                  onClick={resetSettings}
                  className="w-full p-3 bg-luna-100 dark:bg-luna-700 text-luna-700 dark:text-luna-300 rounded-lg hover:bg-luna-200 dark:hover:bg-luna-600 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        )}

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};

export default AccessibilityToolbar; 