import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuardGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
@UseGuards(JwtAuthGuardGuard)
@ApiBearerAuth()
export class EmailController {
    constructor(private emailService: EmailService) { }

    @Post('send-test')
    async sendTestEmail(@Body('to') to: string, @Body('name') name: string) {
        await this.emailService.sendWelcomeEmail(to, name);
        return { message: `Test email sent to ${to}` };
    }
    
    @Post('send-reset-password')
    async sendResetPasswordEmail(@Body('to') to: string, @Body('token') token: string) {
        await this.emailService.sendPasswordResetEmail(to, token);
        return { message: `Password reset email sent to ${to}` };
    }

    @Post('send-verification')
    async sendVerificationEmail(@Body('to') to: string, @Body('token') token: string) {
        await this.emailService.sendVerificationEmail(to, token);
        return { message: `Verification email sent to ${to}` };
    }
}
