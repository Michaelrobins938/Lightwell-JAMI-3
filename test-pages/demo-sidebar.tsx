// Demo page for resizable sidebar system

import React, { useState } from 'react';
import Head from 'next/head';
import { ResizableSidebar } from '../components/layout/ResizableSidebar';
import { SidebarConfig } from '../types/sidebar.types';

// Sample sidebar configurations
const leftSidebarConfig: SidebarConfig = {
  id: 'demo-left-sidebar',
  position: 'left',
  minWidth: 200,
  maxWidth: 600,
  defaultWidth: 300,
  isCollapsible: true,
  persistKey: 'demo-left-sidebar-state',
  resizeHandle: 'right',
};

const rightSidebarConfig: SidebarConfig = {
  id: 'demo-right-sidebar', 
  position: 'right',
  minWidth: 250,
  maxWidth: 500,
  defaultWidth: 350,
  isCollapsible: true,
  persistKey: 'demo-right-sidebar-state',
  resizeHandle: 'left',
};

export default function DemoSidebarPage() {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(300);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(350);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <>
      <Head>
        <title>Resizable Sidebar Demo - Luna AI</title>
        <meta name="description" content="Demonstration of resizable sidebars with persistent storage" />
      </Head>

      <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Left Sidebar */}
        <ResizableSidebar
          config={leftSidebarConfig}
          onResize={setLeftSidebarWidth}
          onCollapse={setLeftCollapsed}
          showPresetButtons={true}
          showStats={true}
        >
          <div className="h-full p-4 space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Left Sidebar
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Navigation and tools
              </p>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 7l5 5l5-5" />
                </svg>
                Dashboard
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.964L3 20l1.036-5.874A8.955 8.955 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
                </svg>
                Chat History
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </a>
            </nav>

            {/* Recent Chats */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 px-3">
                Recent Chats
              </h3>
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                  Python List Comprehension Help
                </div>
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                  React Component Architecture
                </div>
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                  Career Change Advice
                </div>
              </div>
            </div>

            {/* Current Width Display */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div>Width: {leftSidebarWidth}px</div>
                <div>Status: {leftCollapsed ? 'Collapsed' : 'Expanded'}</div>
              </div>
            </div>
          </div>
        </ResizableSidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Resizable Sidebar Demo
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Drag the sidebar edges to resize. Click collapse buttons to hide sidebars.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Left: {leftSidebarWidth}px | Right: {rightSidebarWidth}px
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Feature Showcase */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Interactive Resizing
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Drag the sidebar edges to resize
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Real-time width constraints (min/max)
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Touch support for mobile devices
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Keyboard shortcuts (Cmd/Ctrl + [ ])
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Persistent Storage
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Remembers width across page reloads
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Collapse/expand state persistence
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Export/import configuration support
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      Version-compatible storage format
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                  How to Use the Resizable Sidebars
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Resizing Actions:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                      <li>Hover over the sidebar edge to see the resize cursor</li>
                      <li>Click and drag to adjust the width dynamically</li>
                      <li>Notice the real-time width indicator while dragging</li>
                      <li>Width constraints prevent going below min/max limits</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Collapse/Expand:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                      <li>Click the collapse button (arrow icon) to hide sidebar</li>
                      <li>Collapsed sidebar shows a minimal expand button</li>
                      <li>Use keyboard shortcuts: Cmd/Ctrl + [ to toggle left</li>
                      <li>Previous width is remembered when expanding</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Preset and Stats Features */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Width Presets
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>The left sidebar includes preset width options:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Narrow:</strong> Minimum width for essential content</li>
                      <li><strong>Compact:</strong> Balanced width for focused work</li>
                      <li><strong>Default:</strong> Standard width for most use cases</li>
                      <li><strong>Wide:</strong> Expanded width for detailed content</li>
                      <li><strong>Maximum:</strong> Full width for maximum content</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Usage Statistics
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>View detailed resize analytics:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Total number of resize actions</li>
                      <li>Average width across all resizes</li>
                      <li>Most commonly used width setting</li>
                      <li>Breakdown by resize trigger type</li>
                      <li>Export/import configuration options</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Implementation */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Technical Implementation
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Service Layer:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      <li>SidebarService singleton</li>
                      <li>Persistent storage management</li>
                      <li>Width constraint validation</li>
                      <li>Event logging and statistics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      React Hooks:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      <li>useResizableSidebar hook</li>
                      <li>Mouse/touch event handling</li>
                      <li>Debounced resize callbacks</li>
                      <li>Keyboard shortcut integration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      UI Components:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      <li>ResizableSidebar component</li>
                      <li>Framer Motion animations</li>
                      <li>Responsive design patterns</li>
                      <li>Dark mode support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <ResizableSidebar
          config={rightSidebarConfig}
          onResize={setRightSidebarWidth}
          onCollapse={setRightCollapsed}
          showPresetButtons={false}
          showStats={false}
        >
          <div className="h-full p-4 space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Right Sidebar
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Details and actions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                Primary Action
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                Secondary Action
              </button>
            </div>

            {/* Properties Panel */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Properties
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width
                  </label>
                  <input 
                    type="number" 
                    value={rightSidebarWidth}
                    readOnly
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <input 
                    type="text" 
                    value={rightCollapsed ? 'Collapsed' : 'Expanded'}
                    readOnly
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <input 
                    type="text" 
                    value="Right"
                    readOnly
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Resize Activity
              </h3>
              <div className="h-24 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center space-x-1 p-2">
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '30%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '40%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '20%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '70%' }}></div>
                <div className="w-2 bg-blue-400 rounded-t" style={{ height: '50%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Width changes over time
              </p>
            </div>
          </div>
        </ResizableSidebar>
      </div>
    </>
  );
}