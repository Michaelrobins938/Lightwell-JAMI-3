import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { prisma } from '../../lib/database';

// Assessment scoring algorithms
const scoringAlgorithms = {
  'phq-9': (answers: number[]) => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    let severity = 'Minimal';
    let interpretation = 'Little or no depression symptoms';
    
    if (score >= 20) {
      severity = 'Severe';
      interpretation = 'Severe depression symptoms - professional help strongly recommended';
    } else if (score >= 15) {
      severity = 'Moderately Severe';
      interpretation = 'Moderately severe depression symptoms - professional help recommended';
    } else if (score >= 10) {
      severity = 'Moderate';
      interpretation = 'Moderate depression symptoms - consider professional consultation';
    } else if (score >= 5) {
      severity = 'Mild';
      interpretation = 'Mild depression symptoms - monitor and consider lifestyle changes';
    }
    
    return { score, severity, interpretation };
  },
  
  'gad-7': (answers: number[]) => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    let severity = 'Minimal';
    let interpretation = 'Little or no anxiety symptoms';
    
    if (score >= 15) {
      severity = 'Severe';
      interpretation = 'Severe anxiety symptoms - professional help strongly recommended';
    } else if (score >= 10) {
      severity = 'Moderate';
      interpretation = 'Moderate anxiety symptoms - professional help recommended';
    } else if (score >= 5) {
      severity = 'Mild';
      interpretation = 'Mild anxiety symptoms - monitor and consider lifestyle changes';
    }
    
    return { score, severity, interpretation };
  },
  
  'stress-scale': (answers: number[]) => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    let severity = 'Low';
    let interpretation = 'Low stress levels - maintaining well';
    
    if (score >= 30) {
      severity = 'Very High';
      interpretation = 'Very high stress levels - immediate stress management needed';
    } else if (score >= 20) {
      severity = 'High';
      interpretation = 'High stress levels - stress management techniques recommended';
    } else if (score >= 10) {
      severity = 'Moderate';
      interpretation = 'Moderate stress levels - consider stress reduction strategies';
    }
    
    return { score, severity, interpretation };
  },
  
  'wellness-check': (answers: number[]) => {
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = answers.length * 4; // Assuming 0-4 scale
    const percentage = (score / maxScore) * 100;
    
    let level = 'Poor';
    let interpretation = 'Consider focusing on wellness improvement';
    
    if (percentage >= 80) {
      level = 'Excellent';
      interpretation = 'Excellent overall wellness - keep up the great work';
    } else if (percentage >= 60) {
      level = 'Good';
      interpretation = 'Good overall wellness with room for improvement';
    } else if (percentage >= 40) {
      level = 'Fair';
      interpretation = 'Fair wellness - consider making positive changes';
    }
    
    return { score, level, interpretation, percentage: Math.round(percentage) };
  },

  'comprehensive': (profile: any) => {
    // Handle comprehensive assessment profile
    const { depressionScore = 0, anxietyScore = 0, stressLevel = 0 } = profile;
    
    let overallSeverity = 'Minimal';
    let interpretation = 'Overall mental health appears stable';
    
    // Determine overall severity based on highest score
    const maxScore = Math.max(depressionScore, anxietyScore, stressLevel);
    
    if (maxScore >= 15) {
      overallSeverity = 'Severe';
      interpretation = 'Severe symptoms detected - immediate professional help strongly recommended';
    } else if (maxScore >= 10) {
      overallSeverity = 'Moderate';
      interpretation = 'Moderate symptoms detected - professional consultation recommended';
    } else if (maxScore >= 5) {
      overallSeverity = 'Moderate';
      interpretation = 'Mild symptoms detected - monitor and consider lifestyle changes';
    }
    
    return {
      depressionScore,
      anxietyScore,
      stressLevel,
      overallSeverity,
      interpretation,
      riskLevel: maxScore >= 15 ? 'high' : maxScore >= 10 ? 'moderate' : 'low'
    };
  }
};

import { withSecurity, SecureRequest } from '../../middleware/securityMiddleware';

export default withSecurity(async function handler(req: SecureRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'GET') {
      const { limit = '20', offset = '0' } = req.query;
      
      const assessments = await prisma.assessment.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        select: {
          id: true,
          answers: true,
          createdAt: true,
        },
      });

      // Parse and score the assessments
      const scoredAssessments = assessments.map(assessment => {
        try {
          const answerData = JSON.parse(assessment.answers);
          const { type, answers } = answerData;
          
          let results = null;
          if (type && scoringAlgorithms[type as keyof typeof scoringAlgorithms]) {
            results = scoringAlgorithms[type as keyof typeof scoringAlgorithms](answers);
          }
          
          return {
            id: assessment.id,
            type: type || 'unknown',
            createdAt: assessment.createdAt,
            results
          };
        } catch (error) {
          return {
            id: assessment.id,
            type: 'unknown',
            createdAt: assessment.createdAt,
            results: null
          };
        }
      });

      return res.status(200).json({ data: scoredAssessments });
    }

    if (req.method === 'POST') {
      const { type, answers } = req.body;

      if (!type || !answers) {
        return res.status(400).json({ error: 'Assessment type and answers are required' });
      }

      // Score the assessment
      let results = null;
      if (scoringAlgorithms[type as keyof typeof scoringAlgorithms]) {
        if (type === 'comprehensive') {
          // For comprehensive assessments, answers is a profile object
          results = scoringAlgorithms[type as keyof typeof scoringAlgorithms](answers);
        } else if (Array.isArray(answers)) {
          // For other assessments, answers is an array
          results = scoringAlgorithms[type as keyof typeof scoringAlgorithms](answers);
        } else {
          return res.status(400).json({ error: 'Invalid answers format for assessment type' });
        }
      } else {
        return res.status(400).json({ error: 'Unknown assessment type' });
      }

      // Save to database
      const assessment = await prisma.assessment.create({
        data: {
          userId: decoded.userId,
          type: type,
          answers: JSON.stringify({ type, answers }),
          score: type === 'comprehensive' ? 
            (results && 'depressionScore' in results ? results.depressionScore : 0) : 
            (results && 'score' in results ? results.score : 0),
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ 
        data: {
          id: assessment.id,
          type,
          createdAt: assessment.createdAt,
          results
        }
      });
    }
  } catch (error) {
    console.error('Assessments API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});