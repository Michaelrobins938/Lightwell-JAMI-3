import { create } from 'zustand'

type UI = {
  sidebarPinned: boolean        // user pin state
  sidebarOpen: boolean          // runtime (open for overlay/peek)
  sidebarCollapsed: boolean     // narrow bar state (56px)
  overlayVisible: boolean       // dark scrim on small widths
  setSidebarPinned(v: boolean): void
  setSidebarOpen(v: boolean): void
  setSidebarCollapsed(v: boolean): void
  setOverlayVisible(v: boolean): void

  // voice
  voiceActive: boolean
  setVoiceActive(v: boolean): void
}

export const useUI = create<UI>((set) => ({
  sidebarPinned: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('gpt.sidebarPinned') ?? 'true') : true,
  sidebarOpen: true,
  sidebarCollapsed: false,
  overlayVisible: false,
  setSidebarPinned: (v) => { 
    if (typeof window !== 'undefined') {
      localStorage.setItem('gpt.sidebarPinned', JSON.stringify(v));
    }
    set({ sidebarPinned: v }) 
  },
  setSidebarOpen:   (v) => set({ sidebarOpen: v }),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setOverlayVisible: (v) => set({ overlayVisible: v }),

  voiceActive: false,
  setVoiceActive: (v) => set({ voiceActive: v }),
}))
