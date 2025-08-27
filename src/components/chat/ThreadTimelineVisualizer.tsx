// Thread Timeline Visualizer Component
// Shows conversation branches and allows navigation between different paths

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreadNode {
  id: string;
  message: string;
  timestamp: Date;
  isUser: boolean;
  hasChildren: boolean;
  isSelected: boolean;
  isActive: boolean;
  parentId?: string;
  children?: string[];
  metadata?: {
    tokens?: number;
    model?: string;
    duration?: number;
  };
}

interface ThreadTimelineVisualizerProps {
  nodes: ThreadNode[];
  onNodeSelect?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string) => void;
  selectedNodeId?: string;
  className?: string;
  maxHeight?: number;
  showMetadata?: boolean;
}

export const ThreadTimelineVisualizer: React.FC<ThreadTimelineVisualizerProps> = ({
  nodes,
  onNodeSelect,
  onNodeHover,
  selectedNodeId,
  className = '',
  maxHeight = 400,
  showMetadata = false,
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPanRef = useRef({ x: 0, y: 0 });

  // Build tree structure
  const buildTree = (nodes: ThreadNode[]) => {
    const nodeMap = new Map<string, ThreadNode>();
    const rootNodes: ThreadNode[] = [];

    // Create map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build parent-child relationships
    nodes.forEach(node => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(node.id);
      } else {
        rootNodes.push(nodeMap.get(node.id)!);
      }
    });

    return { nodeMap, rootNodes };
  };

  const { nodeMap, rootNodes } = buildTree(nodes);

  // Render node
  const renderNode = (node: ThreadNode, level: number = 0, index: number = 0) => {
    const isExpanded = expandedBranches.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;
    const isHovered = hoveredNodeId === node.id;

    return (
      <motion.div
        key={node.id}
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        {/* Connection Line */}
        {level > 0 && (
          <div className="absolute left-0 top-0 w-px h-full bg-gray-300 transform -translate-x-1/2" />
        )}

        {/* Node Content */}
        <motion.div
          className={`relative flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
            isSelected
              ? 'border-blue-500 bg-blue-50'
              : isHovered
              ? 'border-gray-400 bg-gray-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onNodeSelect?.(node.id)}
          onMouseEnter={() => {
            setHoveredNodeId(node.id);
            onNodeHover?.(node.id);
          }}
          onMouseLeave={() => setHoveredNodeId(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginLeft: `${level * 40}px`,
          }}
        >
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
            node.isUser ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {node.isUser ? 'U' : 'A'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {node.isUser ? 'You' : 'Luna AI'}
              </span>
              <span className="text-xs text-gray-500">
                {node.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="text-sm text-gray-800 line-clamp-2">
              {node.message}
            </div>

            {/* Metadata */}
            {showMetadata && node.metadata && (
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                {node.metadata.tokens && (
                  <span>📊 {node.metadata.tokens} tokens</span>
                )}
                {node.metadata.model && (
                  <span>🤖 {node.metadata.model}</span>
                )}
                {node.metadata.duration && (
                  <span>⏱️ {node.metadata.duration}ms</span>
                )}
              </div>
            )}

            {/* Branch Indicator */}
            {hasChildren && (
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedBranches(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(node.id)) {
                        newSet.delete(node.id);
                      } else {
                        newSet.add(node.id);
                      }
                      return newSet;
                    });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{isExpanded ? '▼' : '▶'}</span>
                  <span>{node.children?.length || 0} branches</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Indicator */}
          {node.isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children?.map((childId, childIndex) => {
                const childNode = nodeMap.get(childId);
                if (!childNode) return null;
                return renderNode(childNode, level + 1, childIndex);
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - lastPanRef.current.x,
        y: e.clientY - lastPanRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)));
  };

  // Auto-expand branches with active nodes
  useEffect(() => {
    const activeNode = nodes.find(node => node.isActive);
    if (activeNode) {
      const expandParents = (nodeId: string) => {
        const node = nodeMap.get(nodeId);
        if (node?.parentId) {
          setExpandedBranches(prev => {
            const newSet = new Set(prev);
            newSet.add(node.parentId!);
            return newSet;
          });
          expandParents(node.parentId);
        }
      };
      expandParents(activeNode.id);
    }
  }, [nodes, nodeMap]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Conversation Timeline</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(1)}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <span className="text-xs text-gray-500">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: maxHeight }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <motion.div
          className="p-4"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0',
          }}
        >
          {/* Root Nodes */}
          <div className="space-y-3">
            {rootNodes.map((node, index) => renderNode(node, 0, index))}
          </div>

          {/* Empty State */}
          {rootNodes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">💬</div>
              <div className="text-sm">No conversation history</div>
            </div>
          )}
        </motion.div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            +
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            −
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{nodes.length} messages</span>
          <span>Drag to pan • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
