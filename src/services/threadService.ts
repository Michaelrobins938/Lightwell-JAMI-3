// Thread management service for conversation branching

import { 
  ThreadNode, 
  ThreadTree, 
  ThreadBranch, 
  ConversationPath, 
  BranchCreationOptions,
  ThreadMessage
} from '../types/thread.types';

export class ThreadService {
  private static instance: ThreadService;
  
  public static getInstance(): ThreadService {
    if (!ThreadService.instance) {
      ThreadService.instance = new ThreadService();
    }
    return ThreadService.instance;
  }

  // Create a new thread tree with initial message
  createThreadTree(initialMessage: ThreadMessage): ThreadTree {
    const rootNode: ThreadNode = {
      id: `thread_${Date.now()}_root`,
      messageId: initialMessage.id,
      content: initialMessage.content,
      role: initialMessage.role,
      timestamp: initialMessage.timestamp,
      children: [],
      isActive: true,
    };

    const tree: ThreadTree = {
      root: rootNode,
      rootId: rootNode.id,
      nodes: new Map([[rootNode.id, rootNode]]),
      activePathIds: [rootNode.id],
      branches: [],
      totalNodes: 1,
      maxDepth: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return tree;
  }

  // Add a new message to the current active path
  addMessage(tree: ThreadTree, message: ThreadMessage, parentNodeId?: string): ThreadTree {
    const parentId = parentNodeId || this.getLastActiveNode(tree)?.id;
    if (!parentId) {
      throw new Error('No parent node found for new message');
    }

    const newNode: ThreadNode = {
      id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      parentId,
      messageId: message.id,
      content: message.content,
      role: message.role,
      timestamp: message.timestamp,
      children: [],
      isActive: true,
    };

    // Update parent node
    const parentNode = tree.nodes.get(parentId);
    if (parentNode) {
      parentNode.children.push(newNode);
      tree.nodes.set(parentId, parentNode);
    }

    // Add new node
    tree.nodes.set(newNode.id, newNode);

    // Update active path
    tree.activePathIds.push(newNode.id);

    return tree;
  }

  // Create a branch from a specific node
  createBranch(
    tree: ThreadTree, 
    fromNodeId: string, 
    newMessage: ThreadMessage,
    options: BranchCreationOptions
  ): { tree: ThreadTree; branchId: string } {
    const fromNode = tree.nodes.get(fromNodeId);
    if (!fromNode) {
      throw new Error('Source node not found');
    }

    // Create new branch node
    const branchNode: ThreadNode = {
      id: `thread_${Date.now()}_branch`,
      parentId: fromNodeId,
      messageId: newMessage.id,
      content: newMessage.content,
      role: newMessage.role,
      timestamp: newMessage.timestamp,
      children: [],
      isActive: options.autoSwitch,
      metadata: {
        edited: options.reason === 'edit',
        branchTitle: options.title,
        branchReason: options.reason,
      },
    };

    // Update parent node
    fromNode.children.push(branchNode);
    tree.nodes.set(fromNodeId, fromNode);

    // Add branch node
    tree.nodes.set(branchNode.id, branchNode);

    // Create branch metadata
    const branch: ThreadBranch = {
      id: branchNode.id,
      name: options.title || `Branch from ${fromNode.content.slice(0, 30)}...`,
      nodes: [branchNode],
      startNodeId: fromNodeId,
      endNodeId: branchNode.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date(),
    };

    tree.branches.push(branch);

    // Update active path if auto-switching
    if (options.autoSwitch) {
      // Deactivate current path
      tree.activePathIds.forEach(nodeId => {
        const node = tree.nodes.get(nodeId);
        if (node) {
          node.isActive = false;
          tree.nodes.set(nodeId, node);
        }
      });

      // Set new active path
      tree.activePathIds = this.getPathToNode(tree, branchNode.id);
      tree.activePathIds.forEach(nodeId => {
        const node = tree.nodes.get(nodeId);
        if (node) {
          node.isActive = true;
          tree.nodes.set(nodeId, node);
        }
      });
    }

    return { tree, branchId: branchNode.id };
  }

  // Switch to a specific branch
  switchToBranch(tree: ThreadTree, branchId: string): ThreadTree {
    const targetNode = tree.nodes.get(branchId);
    if (!targetNode) {
      throw new Error('Branch node not found');
    }

    // Deactivate current path
    tree.activePathIds.forEach(nodeId => {
      const node = tree.nodes.get(nodeId);
      if (node) {
        node.isActive = false;
        tree.nodes.set(nodeId, node);
      }
    });

    // Activate new path
    const newPath = this.getPathToNode(tree, branchId);
    tree.activePathIds = newPath;
    
    newPath.forEach(nodeId => {
      const node = tree.nodes.get(nodeId);
      if (node) {
        node.isActive = true;
        tree.nodes.set(nodeId, node);
      }
    });

    // Update branch last active time
    const branch = tree.branches.find(b => b.id === branchId);
    if (branch) {
      branch.lastActiveAt = new Date();
    }

    return tree;
  }

  // Get the current conversation path as messages
  getCurrentPath(tree: ThreadTree): ThreadMessage[] {
    return tree.activePathIds.map(nodeId => {
      const node = tree.nodes.get(nodeId);
      if (!node) return null;
      
      return {
        id: node.messageId,
        threadNodeId: node.id,
        role: node.role,
        content: node.content,
        timestamp: node.timestamp,
        metadata: node.metadata,
      };
    }).filter(Boolean) as ThreadMessage[];
  }

  // Get all possible branches from a specific node
  getBranchesFromNode(tree: ThreadTree, nodeId: string): ThreadNode[] {
    const node = tree.nodes.get(nodeId);
    if (!node) return [];

    return node.children.map(child => child).filter(Boolean) as ThreadNode[];
  }

  // Get the path from root to a specific node
  getPathToNode(tree: ThreadTree, targetNodeId: string): string[] {
    const path: string[] = [];
    let currentNodeId: string | undefined = targetNodeId;

    while (currentNodeId) {
      path.unshift(currentNodeId);
      const node = tree.nodes.get(currentNodeId);
      currentNodeId = node?.parentId;
    }

    return path;
  }

  // Get the last active node in the current path
  getLastActiveNode(tree: ThreadTree): ThreadNode | null {
    if (tree.activePathIds.length === 0) return null;
    
    const lastNodeId = tree.activePathIds[tree.activePathIds.length - 1];
    return tree.nodes.get(lastNodeId) || null;
  }

  // Delete a branch and all its descendants
  deleteBranch(tree: ThreadTree, branchId: string): ThreadTree {
    const branchNode = tree.nodes.get(branchId);
    if (!branchNode) return tree;

    // Recursively delete all descendants
    this.deleteNodeAndDescendants(tree, branchId);

    // Remove from parent's children
    if (branchNode.parentId) {
      const parentNode = tree.nodes.get(branchNode.parentId);
      if (parentNode) {
        parentNode.children = parentNode.children.filter(node => node.id !== branchId);
        tree.nodes.set(branchNode.parentId, parentNode);
      }
    }

    // Remove branch metadata
    tree.branches = tree.branches.filter(b => b.id !== branchId);

    // If the deleted branch was active, switch to main path
    if (tree.activePathIds.includes(branchId)) {
      tree.activePathIds = [tree.rootId];
    }

    return tree;
  }

  // Helper method to recursively delete nodes
  private deleteNodeAndDescendants(tree: ThreadTree, nodeId: string): void {
    const node = tree.nodes.get(nodeId);
    if (!node) return;

    // Delete all children first
    node.children.forEach(child => {
      this.deleteNodeAndDescendants(tree, child.id);
    });

    // Delete the node itself
    tree.nodes.delete(nodeId);
  }

  // Get tree statistics
  getTreeStats(tree: ThreadTree): {
    totalNodes: number;
    totalBranches: number;
    maxDepth: number;
    activeBranches: number;
  } {
    const totalNodes = tree.nodes.size;
    const totalBranches = tree.branches.length;
    const activeBranches = tree.branches.filter(b => !b.isArchived).length;
    
    // Calculate max depth
    let maxDepth = 0;
    tree.nodes.forEach(node => {
      const pathLength = this.getPathToNode(tree, node.id).length;
      maxDepth = Math.max(maxDepth, pathLength);
    });

    return {
      totalNodes,
      totalBranches,
      maxDepth,
      activeBranches,
    };
  }

  // Export thread tree for persistence
  exportTree(tree: ThreadTree): string {
    const exportData = {
      rootId: tree.rootId,
      nodes: Array.from(tree.nodes.entries()),
      activePathIds: tree.activePathIds,
      branches: tree.branches,
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import thread tree from JSON
  importTree(jsonData: string): ThreadTree {
    const data = JSON.parse(jsonData);

    // Reconstruct nodes map with proper ThreadNode objects
    const nodes = new Map<string, ThreadNode>();
    if (data.nodes) {
      Object.entries(data.nodes).forEach(([key, value]: [string, any]) => {
        nodes.set(key, value as ThreadNode);
      });
    }

    return {
      root: nodes.get(data.rootId) || null as any,
      rootId: data.rootId,
      nodes: nodes,
      activePathIds: data.activePathIds || [],
      branches: data.branches?.map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        lastActiveAt: new Date(b.lastActiveAt),
      })) || [],
      totalNodes: data.totalNodes || 0,
      maxDepth: data.maxDepth || 1,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}