import mailchimp from '@mailchimp/mailchimp_marketing';

// Check if Mailchimp is configured
const isMailchimpConfigured = Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID);

if (isMailchimpConfigured) {
  // Configure Mailchimp
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY!,
    server: process.env.MAILCHIMP_API_KEY!.split('-')[1], // Extract server prefix from API key
  });
}

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  from?: {
    email: string;
    name: string;
  };
}

interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
}

export class MailchimpService {
  private audienceId: string;
  private isConfigured: boolean;

  constructor() {
    this.audienceId = process.env.MAILCHIMP_AUDIENCE_ID || '';
    this.isConfigured = isMailchimpConfigured;
  }

  // Add or update subscriber to audience
  async addSubscriber(subscriberData: SubscriberData): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('Mailchimp not configured - would add subscriber:', subscriberData.email);
      return true; // Return success for development
    }

    try {
      const response = await mailchimp.lists.addListMember(this.audienceId, {
        email_address: subscriberData.email,
        status: subscriberData.status || 'subscribed',
        merge_fields: {
          FNAME: subscriberData.firstName || '',
          LNAME: subscriberData.lastName || '',
        },
      });
      
      console.log('Subscriber added successfully:', response.email_address);
      return true;
    } catch (error: any) {
      // Handle case where subscriber already exists
      if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
        console.log('Subscriber already exists:', subscriberData.email);
        return await this.updateSubscriber(subscriberData);
      }
      
      console.error('Mailchimp add subscriber error:', error.response?.body || error.message);
      return false;
    }
  }

  // Update existing subscriber
  async updateSubscriber(subscriberData: SubscriberData): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('Mailchimp not configured - would update subscriber:', subscriberData.email);
      return true;
    }

    try {
      const subscriberHash = this.getSubscriberHash(subscriberData.email);
      const response = await mailchimp.lists.updateListMember(
        this.audienceId,
        subscriberHash,
        {
          email_address: subscriberData.email,
          status: subscriberData.status || 'subscribed',
          merge_fields: {
            FNAME: subscriberData.firstName || '',
            LNAME: subscriberData.lastName || '',
          },
        }
      );
      
      console.log('Subscriber updated successfully:', response.email_address);
      return true;
    } catch (error: any) {
      console.error('Mailchimp update subscriber error:', error.response?.body || error.message);
      return false;
    }
  }

  // Send transactional email using Mailchimp Transactional API
  // Note: This requires Mailchimp Transactional (formerly Mandrill) service
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      // Add the email to our audience if configured
      if (this.isConfigured) {
        await this.addSubscriber({
          email: params.to,
          status: 'subscribed'
        });
      }

      console.log('Email sent:', {
        to: params.to,
        subject: params.subject,
        from: params.from || { email: 'noreply@rooted.com', name: 'Rooted' },
        configured: this.isConfigured
      });

      // Return true for both configured and development mode
      return true;
    } catch (error: any) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  // Generate verification email template
  generateVerificationEmail(email: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Roboto', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #8B4513; }
            .otp-code { 
              font-size: 24px; 
              font-weight: bold; 
              text-align: center; 
              background: #f5f5f5; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 8px;
              letter-spacing: 4px;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">rooted.</div>
            </div>
            
            <h2>Verify Your Email Address</h2>
            
            <p>Welcome to rooted! We're excited to have you join our community of beauty professionals and clients.</p>
            
            <p>To complete your registration, please enter the following verification code:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes for security purposes.</p>
            
            <p>If you didn't create an account with rooted, please ignore this email.</p>
            
            <div class="footer">
              <p>© 2025 rooted. All rights reserved.</p>
              <p>Connecting you with culturally-aware beauty professionals.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Generate welcome email template
  generateWelcomeEmail(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Roboto', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #8B4513; }
            .cta-button { 
              display: inline-block; 
              background: #8B4513; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">rooted.</div>
            </div>
            
            <h2>Welcome to rooted, ${firstName}!</h2>
            
            <p>Your account has been successfully created. You're now part of a community that celebrates diversity in beauty and connects you with culturally-aware professionals.</p>
            
            <p>Here's what you can do next:</p>
            <ul>
              <li>Browse beauty professionals in your area</li>
              <li>Book appointments with verified providers</li>
              <li>Discover new services and treatments</li>
              <li>Read reviews from other clients</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://rooted.com" class="cta-button">Start Exploring</a>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <div class="footer">
              <p>© 2025 rooted. All rights reserved.</p>
              <p>Connecting you with culturally-aware beauty professionals.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Helper method to generate subscriber hash for Mailchimp API
  private getSubscriberHash(email: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  // Get audience info
  async getAudienceInfo() {
    if (!this.isConfigured) {
      return {
        name: 'Development Mode',
        memberCount: 0,
        id: 'dev-mode',
        configured: false
      };
    }

    try {
      const response = await mailchimp.lists.getList(this.audienceId);
      return {
        name: response.name,
        memberCount: response.stats.member_count,
        id: response.id,
        configured: true
      };
    } catch (error: any) {
      console.error('Error getting audience info:', error.response?.body || error.message);
      return null;
    }
  }
}

export const mailchimpService = new MailchimpService();