// src/modules/billing/billing.controller.ts
import { Controller, Post, Get, Req, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { JwtAuthGuardGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Billing')
@Controller('billing')
@UseGuards(JwtAuthGuardGuard)
@ApiBearerAuth()
export class BillingController {
    constructor(private stripeService: StripeService) { }

    @Post('create-checkout-session')
    async createCheckoutSession(@Req() req, @Body('priceId') priceId: string) {
        const session = await this.stripeService.createCheckoutSession(
            req.user.stripeCustomerId,
            priceId,
            `${process.env.APP_URL}/billing/success`,
            `${process.env.APP_URL}/billing/cancel`,
        );
        return { url: session.url };
    }

    @Post('create-portal-session')
    async createPortalSession(@Req() req) {
        const session = await this.stripeService.createPortalSession(
            req.user.stripeCustomerId,
            `${process.env.APP_URL}/billing`,
        );
        return { url: session.url };
    }

    @Get('plans')
    async getPlans() {
        return {
            free: {
                price: 0,
                features: ['100 requests/hour', 'Basic tools', 'Community support'],
            },
            premium: {
                price: 29,
                features: ['1000 requests/hour', 'All tools', 'API access', 'Priority support'],
            },
            enterprise: {
                price: 99,
                features: ['10000 requests/hour', 'Custom tools', 'Dedicated support', 'SLA'],
            },
        };
    }
}