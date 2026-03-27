import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistedTokenEntity } from '../../entities/blacklisted-token/blacklisted-token';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectRepository(BlacklistedTokenEntity)
        private readonly blacklistedTokenRepository: Repository<BlacklistedTokenEntity>,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    async blacklistToken(token: string, userId: string): Promise<void> {
        try {
            const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') });

            const blacklistedToken = this.blacklistedTokenRepository.create({
                token,
                userId,
                expiresAt: new Date(payload.exp * 1000), // Convert to milliseconds
            });

            await this.blacklistedTokenRepository.save(blacklistedToken);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const blacklistedToken = await this.blacklistedTokenRepository.findOne({ where: { token } });
        return !!blacklistedToken;
    }

    async removeExpiredTokens(): Promise<void> {
        await this.blacklistedTokenRepository.createQueryBuilder()
            .delete()
            .where('expiresAt < :now', { now: new Date() })
            .execute();
    }
}
