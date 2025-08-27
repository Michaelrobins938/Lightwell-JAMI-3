import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { userId, answers, type } = req.body

    if (!userId || !answers || !type) {
      return res.status(400).json({ message: 'Missing required fields: userId, answers, and type' })
    }

    // Calculate a basic score (you might want to implement proper scoring logic)
    const score = Math.floor(Math.random() * 100) // Placeholder score

    const assessment = await prisma.assessment.create({
      data: {
        userId,
        type,
        answers: JSON.stringify(answers),
        score,
      },
    })

    res.status(200).json({ assessmentId: assessment.id })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage })
  }
}