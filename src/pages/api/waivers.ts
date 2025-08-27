import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        fullName,
        email,
        dateOfBirth,
        emergencyContact,
        emergencyPhone,
        signature,
        ipAddress,
        userAgent,
        termsAccepted
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !dateOfBirth || !signature || !termsAccepted) {
        return res.status(400).json({ 
          error: 'Missing required fields: fullName, email, dateOfBirth, signature, and termsAccepted are required' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate date of birth (must be a valid date and user must be at least 13 years old)
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 13) {
        return res.status(400).json({ error: 'Users must be at least 13 years old to use this service' });
      }

      // Check if user already has an active waiver
      const existingWaiver = await prisma.serviceWaiver.findFirst({
        where: {
          email: email,
          isActive: true
        },
        orderBy: {
          signedAt: 'desc'
        }
      });

      // If there's an existing active waiver, deactivate it
      if (existingWaiver) {
        await prisma.serviceWaiver.update({
          where: { id: existingWaiver.id },
          data: { isActive: false }
        });
      }

      // Create new waiver
      const waiver = await prisma.serviceWaiver.create({
        data: {
          fullName,
          email,
          dateOfBirth: dob,
          emergencyContact,
          emergencyPhone,
          signature,
          ipAddress: ipAddress || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: userAgent || req.headers['user-agent'],
          termsAccepted: JSON.stringify(termsAccepted),
          isActive: true
        }
      });

      // Store waiver reference in localStorage for the frontend
      const waiverReference = {
        id: waiver.id,
        signedAt: waiver.signedAt,
        fullName: waiver.fullName,
        email: waiver.email
      };

      return res.status(201).json({
        success: true,
        message: 'Service waiver signed successfully',
        waiver: waiverReference
      });

    } catch (error) {
      console.error('Error creating service waiver:', error);
      return res.status(500).json({ 
        error: 'Internal server error while processing waiver' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email parameter is required' });
      }

      // Find active waiver for the email
      const waiver = await prisma.serviceWaiver.findFirst({
        where: {
          email: email,
          isActive: true
        },
        orderBy: {
          signedAt: 'desc'
        }
      });

      if (!waiver) {
        return res.status(404).json({ error: 'No active waiver found for this email' });
      }

      return res.status(200).json({
        success: true,
        waiver: {
          id: waiver.id,
          fullName: waiver.fullName,
          email: waiver.email,
          signedAt: waiver.signedAt,
          isActive: waiver.isActive
        }
      });

    } catch (error) {
      console.error('Error retrieving service waiver:', error);
      return res.status(500).json({ 
        error: 'Internal server error while retrieving waiver' 
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
