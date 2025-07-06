import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Gmail API configuration
const isGmailConfigured = Boolean(
  process.env.GMAIL_CLIENT_ID && 
  process.env.GMAIL_CLIENT_SECRET && 
  process.env.GMAIL_REFRESH_TOKEN &&
  process.env.GMAIL_USER_EMAIL
);

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  from?: {
    email: string;
    name: string;
  };
}

export class GmailService {
  private oauth2Client: any;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = isGmailConfigured;
    
    if (this.isConfigured) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );

      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('Gmail not configured - email would be sent in production');
      return true; // Return true for development
    }

    try {
      const accessToken = await this.oauth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER_EMAIL,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });

      const mailOptions = {
        from: params.from ? `${params.from.name} <${params.from.email}>` : `rooted. <${process.env.GMAIL_USER_EMAIL}>`,
        to: params.to,
        subject: params.subject,
        html: params.htmlContent,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Gmail send error:', error);
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
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; font-weight: bold; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-code { background: #f8f9fa; border: 2px dashed #D2691E; border-radius: 12px; padding: 30px; margin: 30px 0; }
          .otp-number { font-size: 48px; font-weight: bold; color: #8B4513; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .button { display: inline-block; background: #8B4513; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>rooted.</h1>
          </div>
          <div class="content">
            <h2 style="color: #8B4513; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="font-size: 16px; margin-bottom: 30px;">Welcome to rooted! Please use the verification code below to complete your account setup.</p>
            
            <div class="otp-code">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code:</p>
              <div class="otp-number">${otp}</div>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This code will expire in 10 minutes. If you didn't create an account with rooted, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 rooted. - Connecting you with amazing beauty professionals</p>
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
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; font-weight: bold; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: #8B4513; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>rooted.</h1>
          </div>
          <div class="content">
            <h2 style="color: #8B4513; margin-bottom: 20px;">Welcome ${firstName}! 🎉</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your account has been successfully verified and you're now part of the rooted community!
            </p>
            <p style="margin-bottom: 20px;">
              You can now discover and connect with amazing beauty professionals in your area.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">Explore Services</a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 rooted. - Connecting you with amazing beauty professionals</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const gmailService = new GmailService();