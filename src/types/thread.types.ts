// Thread branching system types for conversation management

export interface ThreadNode {
  id: string;
  messageId: string;
  parentId?: string;
  children: ThreadNode[];
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isActive?: boolean; // Add isActive property
  metadata?: Record<string, any>;
}

export interface ThreadTree {
  root: ThreadNode;
  rootId: string; // Add rootId for compatibility
  nodes: Map<string, ThreadNode>; // Add nodes map for efficient access
  activePathIds: string[]; // Add active path tracking
  totalNodes: number;
  maxDepth: number;
  createdAt: Date;
  updatedAt: Date;
  branches: ThreadBranch[];
}

export interface ThreadBranch {
  id: string;
  name: string;
  nodes: ThreadNode[];
  startNodeId?: string; // Add startNodeId
  endNodeId?: string; // Add endNodeId
  isArchived?: boolean; // Add isArchived
  lastActiveAt?: Date; // Add lastActiveAt
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationPath {
  threadIds: string[];
  messages: ThreadMessage[];
  branchPoint?: {
    nodeId: string;
    alternativePaths: string[][];
  };
}

export interface ThreadMessage {
  id: string;
  threadNodeId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  feedback?: 'positive' | 'negative' | null;
  metadata?: any;
}

export interface ThreadBranchingState {
  tree: ThreadTree;
  currentPath: ConversationPath;
  isNavigatingHistory: boolean;
  showBranchVisualization: boolean;
  selectedBranchId?: string;
}

export interface ThreadAction {
  type: 'CREATE_BRANCH' | 'SWITCH_BRANCH' | 'DELETE_BRANCH' | 'MERGE_BRANCH' | 'ARCHIVE_BRANCH';
  payload: any;
  timestamp: Date;
  userId?: string;
}

export interface BranchCreationOptions {
  reason: 'edit' | 'regenerate' | 'manual';
  title?: string;
  description?: string;
  preserveHistory: boolean;
  autoSwitch: boolean;
}