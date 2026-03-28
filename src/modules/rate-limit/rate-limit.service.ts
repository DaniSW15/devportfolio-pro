import { Injectable } from '@nestjs/common';
import { ThrottlerStorageService } from '@nestjs/throttler';

@Injectable()
export class RateLimitService {
    private readonly planLimits = {
        free: {
            requests: 100,
            ttl: 60,
            dailyLimit: 1000,
        },
        premium: {
            requests: 1000,
            ttl: 60,
            dailyLimit: 10000,
        },
        enterprise: {
            requests: 10000,
            ttl: 60,
            dailyLimit: 100000,
        },
    };

    constructor(private throttlerService: ThrottlerStorageService) { }

    async checkLimit(userId: string, plan: string = 'free', endpoint: string): Promise<boolean> {
        const limits = this.planLimits[plan as keyof typeof this.planLimits] || this.planLimits.free;
        const key = `${userId}:${endpoint}`;
        const { totalHits } = await this.throttlerService.increment(key, limits.ttl * 1000, limits.requests, 0, 'default');

        if (totalHits > limits.requests) {
            throw new Error('Rate limit exceeded');
        }
        return true;
    }

    async checkDailyLimit(userId: string, plan: string): Promise<boolean> {
        const limits = this.planLimits[plan as keyof typeof this.planLimits] || this.planLimits.free;
        const today = new Date().toISOString().split('T')[0];
        const key = `daily:${userId}:${today}`;
        const { totalHits } = await this.throttlerService.increment(key, 86400000, limits.dailyLimit, 0, 'default');

        if (totalHits > limits.dailyLimit) {
            throw new Error('Daily limit exceeded');
        }
        return true;
    }

    getPlanLimits(plan: string) {
        return this.planLimits[plan as keyof typeof this.planLimits] || this.planLimits.free;
    }
}