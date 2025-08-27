import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // For development/demo purposes, generate a random 6-digit code
    // In production, you'd integrate with a real SMS service like Twilio
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code temporarily (in production, use Redis or similar)
    // For now, we'll just log it
    console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);

    // In production, send SMS here using Twilio or similar service
    // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await twilio.messages.create({
    //   body: `Your JAMI-3 verification code is: ${verificationCode}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: phoneNumber
    // });

    return res.status(200).json({
      success: true,
      message: 'Verification code sent',
      code: process.env.NODE_ENV === 'development' ? verificationCode : undefined // Only return in dev
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
}
