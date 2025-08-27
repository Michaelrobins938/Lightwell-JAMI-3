// Sidebar management service with persistence

import { 
  SidebarConfig, 
  SidebarState, 
  SidebarPersistenceData,
  SidebarResizeEvent,
  SidebarPreset 
} from '../types/sidebar.types';

export class SidebarService {
  private static instance: SidebarService;
  private sidebars = new Map<string, SidebarState>();
  private resizeHistory: SidebarResizeEvent[] = [];
  private persistenceVersion = '1.0.0';

  public static getInstance(): SidebarService {
    if (!SidebarService.instance) {
      SidebarService.instance = new SidebarService();
    }
    return SidebarService.instance;
  }

  // Initialize sidebar with configuration
  initializeSidebar(config: SidebarConfig): SidebarState {
    // Try to load persisted state
    const persistedState = this.loadPersistedState(config.persistKey);
    
    const initialState: SidebarState = {
      width: persistedState?.width || config.defaultWidth,
      isCollapsed: persistedState?.isCollapsed || false,
      isResizing: false,
      isDocked: true,
      isVisible: true,
      lastWidth: persistedState?.lastWidth || config.defaultWidth,
    };

    // Validate width constraints
    initialState.width = this.constrainWidth(initialState.width, config);
    initialState.lastWidth = this.constrainWidth(initialState.lastWidth, config);

    this.sidebars.set(config.id, initialState);
    return initialState;
  }

  // Get current sidebar state
  getSidebarState(sidebarId: string): SidebarState | null {
    return this.sidebars.get(sidebarId) || null;
  }

  // Update sidebar width
  updateWidth(sidebarId: string, newWidth: number, config: SidebarConfig): SidebarState {
    const currentState = this.sidebars.get(sidebarId);
    if (!currentState) {
      throw new Error(`Sidebar ${sidebarId} not found`);
    }

    const constrainedWidth = this.constrainWidth(newWidth, config);
    const oldWidth = currentState.width;

    const updatedState: SidebarState = {
      ...currentState,
      width: constrainedWidth,
      isCollapsed: false, // Expanding when resizing
      lastWidth: constrainedWidth,
    };

    this.sidebars.set(sidebarId, updatedState);

    // Log resize event
    this.logResizeEvent({
      sidebarId,
      oldWidth,
      newWidth: constrainedWidth,
      timestamp: new Date(),
      trigger: 'drag'
    });

    // Persist state
    this.persistState(sidebarId, updatedState, config);

    return updatedState;
  }

  // Toggle collapse state
  toggleCollapse(sidebarId: string, config: SidebarConfig): SidebarState {
    const currentState = this.sidebars.get(sidebarId);
    if (!currentState || !config.isCollapsible) {
      throw new Error(`Sidebar ${sidebarId} not found or not collapsible`);
    }

    const updatedState: SidebarState = {
      ...currentState,
      isCollapsed: !currentState.isCollapsed,
      lastWidth: currentState.isCollapsed ? currentState.lastWidth : currentState.width,
    };

    this.sidebars.set(sidebarId, updatedState);

    // Log resize event
    this.logResizeEvent({
      sidebarId,
      oldWidth: currentState.width,
      newWidth: updatedState.isCollapsed ? 0 : updatedState.lastWidth,
      timestamp: new Date(),
      trigger: updatedState.isCollapsed ? 'collapse' : 'expand'
    });

    // Persist state
    this.persistState(sidebarId, updatedState, config);

    return updatedState;
  }

  // Set resize state
  setResizing(sidebarId: string, isResizing: boolean): SidebarState {
    const currentState = this.sidebars.get(sidebarId);
    if (!currentState) {
      throw new Error(`Sidebar ${sidebarId} not found`);
    }

    const updatedState: SidebarState = {
      ...currentState,
      isResizing,
    };

    this.sidebars.set(sidebarId, updatedState);
    return updatedState;
  }

  // Apply preset width
  applyPreset(sidebarId: string, preset: SidebarPreset, config: SidebarConfig): SidebarState {
    const currentState = this.sidebars.get(sidebarId);
    if (!currentState) {
      throw new Error(`Sidebar ${sidebarId} not found`);
    }

    const constrainedWidth = this.constrainWidth(preset.width, config);
    const oldWidth = currentState.width;

    const updatedState: SidebarState = {
      ...currentState,
      width: constrainedWidth,
      isCollapsed: false,
      lastWidth: constrainedWidth,
    };

    this.sidebars.set(sidebarId, updatedState);

    // Log resize event
    this.logResizeEvent({
      sidebarId,
      oldWidth,
      newWidth: constrainedWidth,
      timestamp: new Date(),
      trigger: 'preset'
    });

    // Persist state
    this.persistState(sidebarId, updatedState, config);

    return updatedState;
  }

  // Calculate optimal width based on content
  calculateOptimalWidth(
    sidebarId: string, 
    contentWidth: number, 
    config: SidebarConfig
  ): number {
    // Add padding and ensure minimum width
    const optimalWidth = Math.max(contentWidth + 32, config.minWidth);
    return this.constrainWidth(optimalWidth, config);
  }

  // Get common presets
  getCommonPresets(config: SidebarConfig): SidebarPreset[] {
    const range = config.maxWidth - config.minWidth;
    
    return [
      {
        name: 'Narrow',
        width: config.minWidth,
        description: 'Minimum width for essential content',
        icon: 'compress'
      },
      {
        name: 'Compact',
        width: config.minWidth + Math.round(range * 0.25),
        description: 'Compact view for focused work',
        icon: 'sidebar-collapse'
      },
      {
        name: 'Default',
        width: config.defaultWidth,
        description: 'Balanced width for most use cases',
        icon: 'layout-sidebar'
      },
      {
        name: 'Wide',
        width: config.minWidth + Math.round(range * 0.75),
        description: 'Wide view for detailed content',
        icon: 'sidebar-expand'
      },
      {
        name: 'Maximum',
        width: config.maxWidth,
        description: 'Full width for maximum content',
        icon: 'expand'
      }
    ];
  }

  // Get resize statistics
  getResizeStats(sidebarId: string): {
    totalResizes: number;
    averageWidth: number;
    mostCommonWidth: number;
    resizeFrequency: Record<string, number>;
  } {
    const sidebarEvents = this.resizeHistory.filter(event => event.sidebarId === sidebarId);
    
    if (sidebarEvents.length === 0) {
      return {
        totalResizes: 0,
        averageWidth: 0,
        mostCommonWidth: 0,
        resizeFrequency: {}
      };
    }

    const widths = sidebarEvents.map(event => event.newWidth);
    const averageWidth = widths.reduce((sum, width) => sum + width, 0) / widths.length;
    
    // Find most common width (rounded to nearest 50px)
    const widthBuckets = widths.reduce((buckets, width) => {
      const bucket = Math.round(width / 50) * 50;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
      return buckets;
    }, {} as Record<number, number>);
    
    const mostCommonWidth = parseInt(
      Object.keys(widthBuckets).reduce((a, b) => 
        widthBuckets[parseInt(a)] > widthBuckets[parseInt(b)] ? a : b
      )
    );

    const resizeFrequency = sidebarEvents.reduce((freq, event) => {
      freq[event.trigger] = (freq[event.trigger] || 0) + 1;
      return freq;
    }, {} as Record<string, number>);

    return {
      totalResizes: sidebarEvents.length,
      averageWidth,
      mostCommonWidth,
      resizeFrequency
    };
  }

  // Reset sidebar to defaults
  resetToDefaults(sidebarId: string, config: SidebarConfig): SidebarState {
    const defaultState: SidebarState = {
      width: config.defaultWidth,
      isCollapsed: false,
      isResizing: false,
      isDocked: true,
      isVisible: true,
      lastWidth: config.defaultWidth,
    };

    this.sidebars.set(sidebarId, defaultState);

    // Clear persisted state
    if (typeof window !== 'undefined') {
      localStorage.removeItem(config.persistKey);
    }

    return defaultState;
  }

  // Responsive breakpoint handling
  handleBreakpointChange(
    sidebarId: string, 
    breakpoint: 'mobile' | 'tablet' | 'desktop',
    config: SidebarConfig
  ): SidebarState {
    const currentState = this.sidebars.get(sidebarId);
    if (!currentState) {
      throw new Error(`Sidebar ${sidebarId} not found`);
    }

    let adjustments: Partial<SidebarState> = {};

    switch (breakpoint) {
      case 'mobile':
        // On mobile, collapse by default
        adjustments = {
          isCollapsed: true,
          isVisible: false,
        };
        break;
      case 'tablet':
        // On tablet, show but narrow
        adjustments = {
          width: Math.min(currentState.width, config.minWidth + 100),
          isVisible: true,
          isCollapsed: false,
        };
        break;
      case 'desktop':
        // On desktop, restore full functionality
        adjustments = {
          isVisible: true,
          isCollapsed: false,
        };
        break;
    }

    const updatedState: SidebarState = {
      ...currentState,
      ...adjustments,
    };

    this.sidebars.set(sidebarId, updatedState);
    return updatedState;
  }

  // Private helper methods
  private constrainWidth(width: number, config: SidebarConfig): number {
    return Math.max(config.minWidth, Math.min(width, config.maxWidth));
  }

  private logResizeEvent(event: SidebarResizeEvent): void {
    this.resizeHistory.push(event);
    
    // Keep only last 100 events
    if (this.resizeHistory.length > 100) {
      this.resizeHistory = this.resizeHistory.slice(-100);
    }
  }

  private persistState(sidebarId: string, state: SidebarState, config: SidebarConfig): void {
    if (typeof window === 'undefined') return;

    const persistenceData: SidebarPersistenceData = {
      width: state.width,
      isCollapsed: state.isCollapsed,
      lastWidth: state.lastWidth,
      position: config.position,
      updatedAt: new Date(),
      version: this.persistenceVersion,
    };

    try {
      localStorage.setItem(config.persistKey, JSON.stringify(persistenceData));
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }

  private loadPersistedState(persistKey: string): SidebarPersistenceData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(persistKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as SidebarPersistenceData;
      
      // Check version compatibility
      if (parsed.version !== this.persistenceVersion) {
        console.log('Sidebar persistence version mismatch, using defaults');
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn('Failed to load persisted sidebar state:', error);
      return null;
    }
  }

  // Export/import functionality
  exportSidebarConfig(sidebarId: string): string | null {
    const state = this.sidebars.get(sidebarId);
    if (!state) return null;

    return JSON.stringify({
      width: state.width,
      isCollapsed: state.isCollapsed,
      lastWidth: state.lastWidth,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importSidebarConfig(sidebarId: string, configJson: string, config: SidebarConfig): boolean {
    try {
      const imported = JSON.parse(configJson);
      
      const updatedState: SidebarState = {
        width: this.constrainWidth(imported.width, config),
        isCollapsed: imported.isCollapsed || false,
        isResizing: false,
        isDocked: true,
        isVisible: true,
        lastWidth: this.constrainWidth(imported.lastWidth, config),
      };

      this.sidebars.set(sidebarId, updatedState);
      this.persistState(sidebarId, updatedState, config);
      
      return true;
    } catch (error) {
      console.error('Failed to import sidebar config:', error);
      return false;
    }
  }

  // Clean up
  dispose(): void {
    this.sidebars.clear();
    this.resizeHistory = [];
  }
}