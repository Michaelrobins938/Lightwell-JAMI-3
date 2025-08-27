import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
  },
});

// Lightwell email template
const createPasswordResetEmail = (resetLink: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Lightwell</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
        }
        .tagline {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s ease;
        }
        .reset-button:hover {
          transform: translateY(-2px);
        }
        .warning {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .warning-title {
          color: #c53030;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .warning-text {
          color: #742a2a;
          font-size: 14px;
          line-height: 1.5;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #718096;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .social-links {
          margin-top: 20px;
        }
        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        .expiry {
          background-color: #ebf8ff;
          border: 1px solid #bee3f8;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .expiry-text {
          color: #2b6cb0;
          font-size: 14px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Lightwell</div>
          <div class="tagline">Your Mental Health Companion</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          
          <div class="message">
            We received a request to reset your password for your Lightwell account. 
            If you didn't make this request, you can safely ignore this email.
          </div>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="reset-button">
              Reset Your Password
            </a>
          </div>
          
          <div class="expiry">
            <div class="expiry-text">
              ⏰ This link will expire in 1 hour for security reasons
            </div>
          </div>
          
          <div class="warning">
            <div class="warning-title">🔒 Security Notice</div>
            <div class="warning-text">
              If you didn't request this password reset, please contact our support team immediately. 
              Your account security is our top priority.
            </div>
          </div>
          
          <div class="message">
            If the button above doesn't work, you can copy and paste this link into your browser:
            <br><br>
            <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Need help? Contact our support team at support@lightwell.com
          </div>
          <div class="footer-text">
            © 2025 Lightwell. All rights reserved.
          </div>
          <div class="social-links">
            <a href="#" class="social-link">Privacy Policy</a>
            <a href="#" class="social-link">Terms of Service</a>
            <a href="#" class="social-link">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send password reset email
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
  userName: string
): Promise<boolean> => {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Lightwell" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: to,
      subject: 'Reset Your Password - Lightwell',
      html: createPasswordResetEmail(resetLink, userName),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  to: string,
  userName: string
): Promise<boolean> => {
  try {
    const welcomeEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Lightwell</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            color: #718096;
            font-size: 14px;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Lightwell</div>
            <div class="tagline">Your Mental Health Companion</div>
          </div>
          
          <div class="content">
            <div class="greeting">Welcome to Lightwell, ${userName}! 🌟</div>
            
            <div class="message">
              We're thrilled to have you join our community of mental health support. 
              Lightwell is here to provide you with compassionate AI assistance, 
              therapeutic resources, and a safe space for your mental well-being journey.
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
                Get Started
              </a>
            </div>
            
            <div class="message">
              <strong>What you can do with Lightwell:</strong><br>
              • Chat with Jamie AI for personalized support<br>
              • Access therapeutic resources and exercises<br>
              • Track your mood and progress<br>
              • Connect with our supportive community<br>
              • Learn coping strategies and techniques
            </div>
            
            <div class="message">
              If you have any questions or need assistance, our support team is here to help. 
              Simply reply to this email or contact us at support@lightwell.com
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              Thank you for choosing Lightwell for your mental health journey.
            </div>
            <div class="footer-text">
              © 2025 Lightwell. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Lightwell" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: to,
      subject: 'Welcome to Lightwell - Your Mental Health Journey Begins',
      html: welcomeEmail,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

// Verify email service configuration
export const verifyEmailService = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error);
    return false;
  }
}; 