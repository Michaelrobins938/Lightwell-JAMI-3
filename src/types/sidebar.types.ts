// Resizable sidebar types and configurations

export interface SidebarConfig {
  id: string;
  position: 'left' | 'right';
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  isCollapsible: boolean;
  persistKey: string; // Local storage key
  resizeHandle: 'left' | 'right' | 'both';
}

export interface SidebarState {
  width: number;
  isCollapsed: boolean;
  isResizing: boolean;
  isDocked: boolean;
  isVisible: boolean;
  lastWidth: number; // Width before collapse
}

export interface SidebarDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ResizeHandle {
  position: 'left' | 'right';
  width: number;
  isActive: boolean;
  cursor: string;
}

export interface SidebarPreset {
  name: string;
  width: number;
  description?: string;
  icon?: string;
}

export interface SidebarLayoutConfig {
  leftSidebar?: SidebarConfig;
  rightSidebar?: SidebarConfig;
  mainContent: {
    minWidth: number;
    padding: number;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface SidebarResizeEvent {
  sidebarId: string;
  oldWidth: number;
  newWidth: number;
  timestamp: Date;
  trigger: 'drag' | 'preset' | 'collapse' | 'expand';
}

export interface SidebarPersistenceData {
  width: number;
  isCollapsed: boolean;
  lastWidth: number;
  position: 'left' | 'right';
  updatedAt: Date;
  version: string;
}

export interface UseSidebarOptions {
  persistToLocalStorage?: boolean;
  persistKey?: string;
  onResize?: (width: number) => void;
  onCollapse?: (isCollapsed: boolean) => void;
  onDock?: (isDocked: boolean) => void;
  debounceDelay?: number;
  enableKeyboardShortcuts?: boolean;
}