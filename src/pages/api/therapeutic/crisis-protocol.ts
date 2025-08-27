import { NextApiRequest, NextApiResponse } from 'next';
import { CrisisLevel, UserProfile } from '../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { crisisLevel, userProfile } = req.body;

    if (!crisisLevel) {
      return res.status(400).json({ error: 'Crisis level is required' });
    }

    // Log crisis event for monitoring
    console.warn('CRISIS PROTOCOL TRIGGERED:', {
      level: crisisLevel.level,
      timestamp: new Date().toISOString(),
      userId: userProfile?.id || 'unknown'
    });

    // Crisis protocol response
    const crisisResponse = {
      protocolActivated: true,
      timestamp: new Date().toISOString(),
      level: crisisLevel.level,
      actions: generateCrisisActions(crisisLevel, userProfile),
      monitoring: {
        riskFactors: crisisLevel.riskFactors
      },
      safety: {
        immediateSafetyCheck: crisisLevel.level === 'critical',
        stayWithUser: crisisLevel.level === 'critical' || crisisLevel.level === 'high',
        removeLethalMeans: crisisLevel.level === 'critical',
        contactEmergencyServices: crisisLevel.level === 'critical'
      }
    };

    // Trigger additional safety measures based on crisis level
    if (crisisLevel.level === 'critical') {
      await triggerCriticalCrisisProtocol(crisisLevel, userProfile);
    } else if (crisisLevel.level === 'high') {
      await triggerHighCrisisProtocol(crisisLevel, userProfile);
    }

    return res.status(200).json(crisisResponse);
  } catch (error) {
    console.error('Crisis protocol error:', error);
    return res.status(500).json({ 
      error: 'Failed to execute crisis protocol',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function generateCrisisActions(crisisLevel: CrisisLevel, userProfile: UserProfile) {
  const actions = [];

  // Immediate actions based on crisis level
  if (crisisLevel.level === 'critical') {
    actions.push({
      priority: 'immediate',
      action: 'Call 911 or emergency services',
      reason: 'Immediate risk of harm to self or others',
      completed: false
    });
    actions.push({
      priority: 'immediate',
      action: 'Stay with the person',
      reason: 'Ensure immediate safety and prevent harm',
      completed: false
    });
    actions.push({
      priority: 'immediate',
      action: 'Remove access to lethal means',
      reason: 'Reduce immediate risk of harm',
      completed: false
    });
  } else if (crisisLevel.level === 'high') {
    actions.push({
      priority: 'immediate',
      action: 'Call crisis hotline (988)',
      reason: 'Professional crisis intervention support',
      completed: false
    });
    actions.push({
      priority: 'immediate',
      action: 'Contact mental health professional',
      reason: 'Professional assessment and intervention',
      completed: false
    });
    actions.push({
      priority: 'immediate',
      action: 'Ensure safety',
      reason: 'Prevent escalation of crisis',
      completed: false
    });
  } else if (crisisLevel.level === 'moderate') {
    actions.push({
      priority: 'high',
      action: 'Schedule therapy session',
      reason: 'Professional support for current distress',
      completed: false
    });
    actions.push({
      priority: 'high',
      action: 'Practice coping skills',
      reason: 'Immediate emotional regulation',
      completed: false
    });
    actions.push({
      priority: 'medium',
      action: 'Reach out to support network',
      reason: 'Social support and connection',
      completed: false
    });
  }

  // Add immediate actions from crisis assessment
  crisisLevel.immediateActions.forEach(action => {
    actions.push({
      priority: 'immediate',
      action: action,
      reason: 'Crisis assessment recommendation',
      completed: false
    });
  });

  return actions;
}

async function triggerCriticalCrisisProtocol(crisisLevel: CrisisLevel, userProfile: UserProfile) {
  // Critical crisis protocol - immediate emergency response
  console.error('CRITICAL CRISIS PROTOCOL ACTIVATED:', {
    userId: userProfile?.id,
    timestamp: new Date().toISOString(),
    riskFactors: crisisLevel.riskFactors
  });

  // In a real implementation, this would:
  // 1. Immediately contact emergency services
  // 2. Notify human supervisors
  // 3. Log all actions for safety monitoring
  // 4. Provide immediate crisis intervention
  // 5. Ensure user safety above all else

  // For now, we'll log the critical situation
  const criticalProtocol = {
    activated: true,
    timestamp: new Date().toISOString(),
    emergencyServices: 'IMMEDIATE CONTACT REQUIRED',
    safetyMeasures: [
      'Stay with user at all times',
      'Remove access to lethal means',
      'Contact emergency services immediately',
      'Notify human crisis intervention team',
      'Document all actions for safety review'
    ],
    userProfile: {
      userId: userProfile?.id,
      name: userProfile?.name,
      email: userProfile?.email
    }
  };

  console.error('CRITICAL PROTOCOL DETAILS:', criticalProtocol);
}

async function triggerHighCrisisProtocol(crisisLevel: CrisisLevel, userProfile: UserProfile) {
  // High crisis protocol - immediate professional intervention
  console.warn('HIGH CRISIS PROTOCOL ACTIVATED:', {
    userId: userProfile?.id,
    timestamp: new Date().toISOString(),
    riskFactors: crisisLevel.riskFactors
  });

  // In a real implementation, this would:
  // 1. Contact crisis hotline or mental health professional
  // 2. Provide immediate crisis intervention
  // 3. Monitor user safety
  // 4. Prepare for escalation if needed
  // 5. Document intervention for follow-up

  const highProtocol = {
    activated: true,
    timestamp: new Date().toISOString(),
    crisisIntervention: 'PROFESSIONAL INTERVENTION REQUIRED',
    safetyMeasures: [
      'Provide immediate crisis intervention',
      'Contact crisis hotline (988)',
      'Connect with mental health professional',
      'Monitor user safety continuously',
      'Prepare for escalation if needed'
    ],
    userProfile: {
      userId: userProfile?.id,
      name: userProfile?.name,
      email: userProfile?.email
    }
  };

  console.warn('HIGH PROTOCOL DETAILS:', highProtocol);
} 