import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

type ResendInstance = InstanceType<typeof Resend>;

@Injectable()
export class EmailService {
    private resend!: ResendInstance;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        if (apiKey && apiKey !== 'your-resend-api-key') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            this.resend = new (Resend as any)(apiKey) as ResendInstance;
            this.logger.log('Email service initialized with Resend');
        } else {
            this.logger.warn('Resend API key not configured. Email sending disabled.');
        }
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        if (!this.resend) {
            this.logger.warn('Email not sent: Resend not configured');
            return false;
        }

        try {
            const from = this.configService.get<string>('EMAIL_FROM', 'noreply@devtools-hub.com');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            await (this.resend as any).emails.send({ from, to, subject, html });
            this.logger.log(`Email sent to ${to}`);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email: ${message}`);
            return false;
        }
    }

    async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #3b82f6;">Welcome to DevTools Hub, ${name}! 🎉</h1>
                <p>We're excited to have you on board.</p>
                <p>You now have access to:</p>
                <ul>
                    <li>🔧 JSON Formatter</li>
                    <li>🔐 JWT Decoder</li>
                    <li>📱 QR Generator</li>
                    <li>🔑 Password Generator</li>
                    <li>🌐 API Tester</li>
                    <li>And 5 more tools!</li>
                </ul>
                <p>Start using your tools at: <a href="${this.configService.get<string>('APP_URL')}">DevTools Hub</a></p>
                <hr />
                <p style="color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
            </div>
        `;
        return this.sendEmail(to, 'Welcome to DevTools Hub! 🚀', html);
    }

    async sendVerificationEmail(to: string, token: string): Promise<boolean> {
        const verifyUrl = `${this.configService.get<string>('APP_URL')}/verify?token=${token}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #3b82f6;">Verify your email</h1>
                <p>Click the button below to verify your email address:</p>
                <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
                <p>Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
                <hr />
                <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
            </div>
        `;
        return this.sendEmail(to, 'Verify your email', html);
    }

    async sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
        const resetUrl = `${this.configService.get<string>('APP_URL')}/reset-password?token=${token}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #3b82f6;">Reset your password</h1>
                <p>You requested to reset your password. Click the button below:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
                <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
                <hr />
                <p style="color: #666; font-size: 12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>
        `;
        return this.sendEmail(to, 'Reset your password', html);
    }
}