// Consent Manager Component - Handles user approval for memory proposals
// Implements granular consent control with clear explanations

import React, { useState, useEffect } from 'react';
import { MemoryProposal, ConsentLevel, RetentionPolicy } from '../../services/secureMemoryService';

interface ConsentManagerProps {
  proposals: MemoryProposal[];
  onApprove: (approvedProposals: MemoryProposal[]) => void;
  onReject: (rejectedProposalIds: string[]) => void;
  onModify: (modifiedProposal: MemoryProposal) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface ConsentItemProps {
  proposal: MemoryProposal;
  onApprove: () => void;
  onReject: () => void;
  onModify: (proposal: MemoryProposal) => void;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({
  proposals,
  onApprove,
  onReject,
  onModify,
  isVisible,
  onClose
}) => {
  const [approvedProposals, setApprovedProposals] = useState<Set<string>>(new Set());
  const [rejectedProposals, setRejectedProposals] = useState<Set<string>>(new Set());
  const [modifiedProposals, setModifiedProposals] = useState<Map<string, MemoryProposal>>(new Map());

  useEffect(() => {
    if (isVisible) {
      setApprovedProposals(new Set());
      setRejectedProposals(new Set());
      setModifiedProposals(new Map());
    }
  }, [isVisible, proposals]);

  const handleApprove = (proposalId: string) => {
    setApprovedProposals(prev => new Set([...prev, proposalId]));
    setRejectedProposals(prev => {
      const newSet = new Set(prev);
      newSet.delete(proposalId);
      return newSet;
    });
  };

  const handleReject = (proposalId: string) => {
    setRejectedProposals(prev => new Set([...prev, proposalId]));
    setApprovedProposals(prev => {
      const newSet = new Set(prev);
      newSet.delete(proposalId);
      return newSet;
    });
  };

  const handleModify = (proposal: MemoryProposal) => {
    setModifiedProposals(prev => new Map(prev).set(proposal.id || '', proposal));
  };

  const handleSubmit = () => {
    const approved = proposals.filter(p => approvedProposals.has(p.id || ''));
    const rejected = Array.from(rejectedProposals);
    const modified = Array.from(modifiedProposals.values());

    // Apply modifications to approved proposals
    const finalApproved = approved.map(proposal => {
      const modified = modifiedProposals.get(proposal.id || '');
      return modified || proposal;
    });

    onApprove(finalApproved);
    onReject(rejected);
    onClose();
  };

  const getConsentLevelDescription = (level: ConsentLevel): string => {
    switch (level) {
      case 'explicit': return 'You explicitly asked me to remember this';
      case 'inferred': return 'I inferred this from our conversation';
      case 'therapeutic': return 'Standard therapeutic notes for continuity';
      case 'crisis': return 'Crisis-related information for safety';
      case 'preference': return 'Your stated preferences';
      default: return 'Unknown consent level';
    }
  };

  const getRetentionDescription = (policy: RetentionPolicy): string => {
    switch (policy) {
      case 'session': return 'Only for this session';
      case 'temporary': return '30 days';
      case 'therapeutic': return '2 years (standard therapy notes)';
      case 'permanent': return 'Until you delete it';
      case 'crisis': return '7 years (crisis records)';
      default: return 'Unknown retention policy';
    }
  };

  const getMemoryTypeDescription = (type: string): string => {
    switch (type) {
      case 'stable_identity': return 'Basic identity information';
      case 'therapeutic_theme': return 'Recurring therapeutic themes';
      case 'session_continuity': return 'Session continuity notes';
      case 'meta_preference': return 'Communication preferences';
      case 'coping_strategy': return 'What helps you cope';
      case 'crisis_history': return 'Crisis-related information';
      case 'progress_note': return 'Therapeutic progress';
      case 'relationship_context': return 'Important relationships';
      case 'work_stress': return 'Work-related stressors';
      case 'health_concern': return 'Health information';
      case 'life_event': return 'Significant life events';
      case 'emotional_state': return 'Emotional patterns';
      case 'user_preference': return 'Your preferences';
      default: return 'General information';
    }
  };

  if (!isVisible || proposals.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Memory Consent Review
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          <p>
            I've identified some information from our conversation that could be helpful to remember for future sessions. 
            Please review each item and let me know what you'd like me to remember.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {proposals.map((proposal, index) => (
            <ConsentItem
              key={proposal.id || index}
              proposal={proposal}
              onApprove={() => handleApprove(proposal.id || '')}
              onReject={() => handleReject(proposal.id || '')}
              onModify={handleModify}
              isApproved={approvedProposals.has(proposal.id || '')}
              isRejected={rejectedProposals.has(proposal.id || '')}
              getConsentLevelDescription={getConsentLevelDescription}
              getRetentionDescription={getRetentionDescription}
              getMemoryTypeDescription={getMemoryTypeDescription}
            />
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {approvedProposals.size} approved, {rejectedProposals.size} rejected
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConsentItem: React.FC<ConsentItemProps & {
  isApproved: boolean;
  isRejected: boolean;
  getConsentLevelDescription: (level: ConsentLevel) => string;
  getRetentionDescription: (policy: RetentionPolicy) => string;
  getMemoryTypeDescription: (type: string) => string;
}> = ({
  proposal,
  onApprove,
  onReject,
  onModify,
  isApproved,
  isRejected,
  getConsentLevelDescription,
  getRetentionDescription,
  getMemoryTypeDescription
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedContent, setModifiedContent] = useState(proposal.content);
  const [modifiedImportance, setModifiedImportance] = useState(proposal.importance);

  const handleModify = () => {
    const modifiedProposal = {
      ...proposal,
      content: modifiedContent,
      importance: modifiedImportance
    };
    onModify(modifiedProposal);
    setIsModifying(false);
  };

  const getImportanceColor = (importance: number): string => {
    if (importance >= 8) return 'text-red-600';
    if (importance >= 6) return 'text-orange-600';
    return 'text-green-600';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`border rounded-lg p-4 ${
      isApproved ? 'border-green-200 bg-green-50' :
      isRejected ? 'border-red-200 bg-red-50' :
      'border-gray-200 bg-white'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">
              {getMemoryTypeDescription(proposal.type)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              proposal.importance >= 8 ? 'bg-red-100 text-red-800' :
              proposal.importance >= 6 ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }`}>
              Importance: {proposal.importance}/10
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              proposal.confidence >= 0.8 ? 'bg-green-100 text-green-800' :
              proposal.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Confidence: {Math.round(proposal.confidence * 100)}%
            </span>
          </div>

          <div className="text-sm text-gray-700 mb-2">
            {isModifying ? (
              <textarea
                value={modifiedContent}
                onChange={(e) => setModifiedContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            ) : (
              <p>{proposal.content}</p>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Consent: {getConsentLevelDescription(proposal.consentLevel)}</p>
            <p>Retention: {getRetentionDescription(proposal.retentionPolicy)}</p>
            {proposal.tags && proposal.tags.length > 0 && (
              <p>Tags: {proposal.tags.join(', ')}</p>
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
              <p><strong>Source:</strong> {proposal.source}</p>
              <p><strong>Category:</strong> {proposal.category}</p>
              <p><strong>Emotional Valence:</strong> {proposal.emotionalValence}</p>
              {proposal.metadata && Object.keys(proposal.metadata).length > 0 && (
                <p><strong>Metadata:</strong> {JSON.stringify(proposal.metadata, null, 2)}</p>
              )}
            </div>
          )}
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={onApprove}
            className={`px-3 py-1 text-xs rounded-md ${
              isApproved
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className={`px-3 py-1 text-xs rounded-md ${
              isRejected
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
            }`}
          >
            Reject
          </button>
          {!isModifying ? (
            <button
              onClick={() => setIsModifying(true)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Modify
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleModify}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsModifying(false);
                  setModifiedContent(proposal.content);
                  setModifiedImportance(proposal.importance);
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isModifying && (
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-600">Importance:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={modifiedImportance}
              onChange={(e) => setModifiedImportance(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-600">{modifiedImportance}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentManager;
