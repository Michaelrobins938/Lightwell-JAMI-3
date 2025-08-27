import { useState, useCallback } from 'react';

export interface UseResizableSidebarReturn {
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  isVisible: boolean;
  actualWidth: number;
  canResize: boolean;
  isAtMinWidth: boolean;
  isAtMaxWidth: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
  setWidth: (width: number) => void;
}

export function useResizableSidebar(
  initialWidth: number = 300,
  minWidth: number = 200,
  maxWidth: number = 500
): UseResizableSidebarReturn {
  const [width, setWidth] = useState(initialWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [minWidth, maxWidth]);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const actualWidth = isCollapsed ? 0 : width;
  const isVisible = !isCollapsed;
  const canResize = !isCollapsed;
  const isAtMinWidth = width <= minWidth;
  const isAtMaxWidth = width >= maxWidth;

  return {
    width: actualWidth,
    isCollapsed,
    isResizing,
    isVisible,
    actualWidth,
    canResize,
    isAtMinWidth,
    isAtMaxWidth,
    handleMouseDown,
    collapse,
    expand,
    toggle,
    setWidth,
  };
}