// Thread branch visualization component

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreadTree, ThreadNode, ThreadBranch } from '../../types/thread.types';

// Helper functions
function findNodeById(node: ThreadNode, id: string): ThreadNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return undefined;
}

function getAllNodeIds(node: ThreadNode): string[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...getAllNodeIds(child));
  }
  return ids;
}

interface ThreadBranchVisualizerProps {
  tree: ThreadTree;
  onSelectBranch: (branchId: string) => void;
  onDeleteBranch: (branchId: string) => void;
  selectedBranchId?: string;
  className?: string;
}

interface VisualNode {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  level: number;
  isActive: boolean;
  children: VisualNode[];
  parentId?: string;
  timestamp: Date;
  isBranchPoint: boolean;
}

export function ThreadBranchVisualizer({
  tree,
  onSelectBranch,
  onDeleteBranch,
  selectedBranchId,
  className = '',
}: ThreadBranchVisualizerProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Convert thread tree to visual representation
  const visualTree = useMemo(() => {
    const buildVisualNode = (nodeId: string, level: number): VisualNode | null => {
      const node = findNodeById(tree.root, nodeId);
      if (!node) return null;

      const children = node.children
        .map(child => buildVisualNode(child.id, level + 1))
        .filter(Boolean) as VisualNode[];

      return {
        id: node.id,
        content: node.content,
        role: node.role,
        level,
        isActive: false, // ThreadNode doesn't have isActive property
        children,
        parentId: node.parentId,
        timestamp: node.timestamp,
        isBranchPoint: node.children.length > 1,
      };
    };

    return buildVisualNode(tree.root.id, 0);
  }, [tree]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (nodeId: string) => {
    const correspondingBranch = tree.branches.find(b => b.nodes.some(n => n.id === nodeId));
    if (correspondingBranch) {
      onSelectBranch(correspondingBranch.id);
    }
  };

  const renderNode = (visualNode: VisualNode, index: number = 0) => {
    const isExpanded = expandedNodes.has(visualNode.id);
    const isSelected = selectedBranchId === tree.branches.find(b => b.nodes.some(n => n.id === visualNode.id))?.id;
    const isHovered = hoveredNode === visualNode.id;
    
    return (
      <div key={visualNode.id} className="relative">
        {/* Connection Line to Parent */}
        {visualNode.parentId && (
          <div className="absolute -top-4 left-1/2 w-px h-4 bg-gray-300 dark:bg-gray-600" />
        )}

        {/* Node */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`relative mb-4 ${visualNode.level > 0 ? 'ml-8' : ''}`}
          onMouseEnter={() => setHoveredNode(visualNode.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Horizontal Connection Line */}
          {visualNode.parentId && (
            <div className="absolute -left-8 top-1/2 w-8 h-px bg-gray-300 dark:bg-gray-600" />
          )}

          {/* Node Content */}
          <div
            onClick={() => handleNodeClick(visualNode.id)}
            className={`
              relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${visualNode.isActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }
              ${isSelected ? 'ring-2 ring-blue-500' : ''}
              ${isHovered ? 'shadow-lg transform scale-105' : 'shadow-sm'}
              ${visualNode.role === 'user' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-purple-500'}
            `}
          >
            {/* Role Badge */}
            <div className={`
              absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
              ${visualNode.role === 'user' ? 'bg-green-500' : 'bg-purple-500'}
            `}>
              {visualNode.role === 'user' ? 'U' : 'AI'}
            </div>

            {/* Branch Point Indicator */}
            {visualNode.isBranchPoint && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
            )}

            {/* Message Content */}
            <div className="pr-8">
              <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
                {visualNode.content.length > 60 
                  ? `${visualNode.content.slice(0, 60)}...` 
                  : visualNode.content
                }
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {visualNode.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {/* Expand/Collapse Button */}
            {visualNode.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodeExpansion(visualNode.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </button>
            )}

            {/* Delete Branch Button */}
            {visualNode.parentId && isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const branch = tree.branches.find(b => b.nodes.some(n => n.id === visualNode.id));
                  if (branch) {
                    onDeleteBranch(branch.id);
                  }
                }}
                className="absolute bottom-2 right-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                title="Delete branch"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Children */}
          <AnimatePresence>
            {(isExpanded || visualNode.children.length === 1) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4"
              >
                {visualNode.children.map((child, childIndex) => (
                  <div key={child.id} className="relative">
                    {childIndex > 0 && (
                      <div className="absolute -top-2 left-0 w-full h-px bg-gray-200 dark:bg-gray-700" />
                    )}
                    {renderNode(child, childIndex)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  if (!visualTree) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No conversation threads to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conversation Threads
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tree.branches.length} branches • {tree.totalNodes} messages
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpandedNodes(new Set(getAllNodeIds(tree.root)))}
            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedNodes(new Set())}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 mb-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">User</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Branch Point</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Active Path</span>
        </div>
      </div>

      {/* Thread Tree */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {renderNode(visualTree)}
        </div>
      </div>
    </div>
  );
}