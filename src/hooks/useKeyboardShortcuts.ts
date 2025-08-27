import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSendMessage?: () => void;
  onNewLine?: () => void;
  onOpenCommandPalette?: () => void;
  onFocusInput?: () => void;
  onEscape?: () => void;
  isInputFocused?: boolean;
  isCommandPaletteOpen?: boolean;
  isModalOpen?: boolean;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const {
    onSendMessage,
    onNewLine,
    onOpenCommandPalette,
    onFocusInput,
    onEscape,
    isInputFocused = false,
    isCommandPaletteOpen = false,
    isModalOpen = false
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle shortcuts if user is typing in an input/textarea
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Handle Escape key
    if (event.key === 'Escape') {
      if (isModalOpen) {
        event.preventDefault();
        onEscape?.();
        return;
      }
    }

    // Handle Command+K or Ctrl+K for command palette
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      onOpenCommandPalette?.();
      return;
    }

    // Handle Enter key when input is focused
    if (event.key === 'Enter' && isInputFocused) {
      if (event.shiftKey) {
        // Shift+Enter for new line
        onNewLine?.();
      } else {
        // Enter to send message
        event.preventDefault();
        onSendMessage?.();
      }
      return;
    }

    // Handle Ctrl+Enter or Cmd+Enter to send message
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onSendMessage?.();
      return;
    }

    // Handle slash key to focus input
    if (event.key === '/' && !isInputFocused) {
      event.preventDefault();
      onFocusInput?.();
      return;
    }
  }, [
    onSendMessage,
    onNewLine,
    onOpenCommandPalette,
    onFocusInput,
    onEscape,
    isInputFocused,
    isCommandPaletteOpen,
    isModalOpen
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return shortcuts object for external use
  return {
    shortcuts: {
      sendMessage: onSendMessage,
      newLine: onNewLine,
      openCommandPalette: onOpenCommandPalette,
      focusInput: onFocusInput,
      escape: onEscape
    }
  };
};


