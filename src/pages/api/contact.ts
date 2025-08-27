import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // For now, just log the contact form submission
    console.log('Contact form submission:', { name, email, message });

    // In a real implementation, you would send an email here
    // await sendEmail({
    //   to: 'support@luna-ai.com',
    //   subject: `Contact form submission from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ error: 'Failed to process contact form' });
  }
}