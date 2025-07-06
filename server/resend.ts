import { Resend } from 'resend';

// Check if Resend API key is configured
const isResendConfigured = Boolean(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  from?: {
    email: string;
    name: string;
  };
}

export class ResendService {
  private resend: Resend | null;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = isResendConfigured;
    this.resend = this.isConfigured ? new Resend(process.env.RESEND_API_KEY!) : null;
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.isConfigured || !this.resend) {
      console.log('Resend not configured - email would be sent in production');
      console.log('Email details:', {
        to: params.to,
        subject: params.subject,
        from: params.from
      });
      return true; // Return true for development
    }

    try {
      const fromEmail = params.from?.email || 'onboarding@resend.dev';
      const fromName = params.from?.name || 'rooted';

      const { data, error } = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: params.to,
        subject: params.subject,
        html: params.htmlContent,
      });

      if (error) {
        console.error('Resend email error:', JSON.stringify(error, null, 2));
        return false;
      }

      console.log('Email sent successfully via Resend:', data?.id);
      return true;
    } catch (error) {
      console.error('Resend send error:', error);
      return false;
    }
  }

  generateVerificationEmail(email: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - rooted.</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #DEB887 100%); 
            padding: 48px 20px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 36px; 
            font-weight: bold; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .content { 
            padding: 48px 40px; 
            text-align: center; 
          }
          .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 16px;
          }
          .description {
            font-size: 16px;
            color: #666;
            margin-bottom: 32px;
            line-height: 1.5;
          }
          .otp-container { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            border: 3px solid #D2691E; 
            border-radius: 16px; 
            padding: 32px; 
            margin: 32px 0; 
            position: relative;
          }
          .otp-label {
            font-size: 14px;
            color: #8B4513;
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .otp-code { 
            font-size: 56px; 
            font-weight: bold; 
            color: #8B4513; 
            letter-spacing: 12px; 
            font-family: 'Courier New', monospace; 
            text-shadow: 0 2px 4px rgba(139, 69, 19, 0.1);
          }
          .validity-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            font-size: 14px;
            color: #856404;
          }
          .security-note {
            font-size: 14px;
            color: #666;
            margin-top: 32px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #D2691E;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 24px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
            border-top: 1px solid #e9ecef;
          }
          .footer a {
            color: #8B4513;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>rooted.</h1>
          </div>
          <div class="content">
            <div class="welcome-text">Verify Your Email Address</div>
            <div class="description">
              Welcome to rooted! You're one step away from connecting with amazing beauty professionals. 
              Please use the verification code below to complete your account setup.
            </div>
            
            <div class="otp-container">
              <div class="otp-label">Your verification code</div>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="validity-notice">
              ⏰ This code will expire in 10 minutes for your security.
            </div>
            
            <div class="security-note">
              <strong>Security Notice:</strong> If you didn't create an account with rooted, please ignore this email. 
              Never share this code with anyone.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 rooted. - Connecting you with culturally-aware beauty professionals</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmail(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to rooted.</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #DEB887 100%); 
            padding: 48px 20px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 36px; 
            font-weight: bold; 
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .content { 
            padding: 48px 40px; 
          }
          .welcome-title {
            font-size: 28px;
            font-weight: 600;
            color: #8B4513;
            margin-bottom: 24px;
            text-align: center;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 24px 0; 
            box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
            transition: transform 0.2s ease;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .features {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin: 12px 0;
            font-size: 14px;
          }
          .feature-icon {
            width: 20px;
            height: 20px;
            background: #D2691E;
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 24px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
            border-top: 1px solid #e9ecef;
          }
          .footer a {
            color: #8B4513;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>rooted.</h1>
          </div>
          <div class="content">
            <div class="welcome-title">Welcome ${firstName}! 🎉</div>
            <p style="font-size: 16px; margin-bottom: 24px; text-align: center;">
              Your account has been successfully verified and you're now part of the rooted community!
            </p>
            
            <div class="features">
              <h3 style="color: #8B4513; margin-bottom: 16px;">What you can do now:</h3>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Discover culturally-aware beauty professionals in your area</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Browse services across hair, nails, lashes, and more</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Connect with top-rated providers who understand your needs</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>Book appointments and manage your beauty journey</span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <span class="button">Start Exploring Services</span>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              If you have any questions, our support team is here to help you get the most out of rooted.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 rooted. - Connecting you with culturally-aware beauty professionals</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const resendService = new ResendService();