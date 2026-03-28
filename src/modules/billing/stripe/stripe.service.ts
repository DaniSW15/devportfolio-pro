import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY') ?? '', {
            apiVersion: '2026-03-25.dahlia',
        });
    }

    async createCustomer(userId: string, email: string, name: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email,
            name,
            metadata: { userId },
        });
    }

    async createCheckoutSession(
        customerId: string,
        priceId: string,
        successUrl: string,
        cancelUrl: string,
    ): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }

    async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
        return this.stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
    }

    async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.retrieve(subscriptionId);
    }

    async handleWebhook(signature: string, payload: Buffer): Promise<void> {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
        }
    }

    private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
        // Actualizar plan del usuario a premium
        const userId = session.metadata?.userId;
        if (userId) {
            // Actualizar en base de datos
        }
    }

    private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        // Actualizar estado de suscripción
    }

    private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
        // Degradar a plan free
    }
}