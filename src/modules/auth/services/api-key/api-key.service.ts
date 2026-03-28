import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from '../../entities/api-key/api-key.entity';
import { UserEntity } from '../../entities/user-entity/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKeyEntity)
        private apiKeyRepository: Repository<ApiKeyEntity>,
    ) { }

    async generateApiKey(userId: string, name: string): Promise<{ key: string; apiKey: ApiKeyEntity }> {
        const key = `dk_${crypto.randomBytes(32).toString('hex')}`;

        const apiKey = this.apiKeyRepository.create({
            name,
            key,
            user: { id: userId },
        });

        await this.apiKeyRepository.save(apiKey);

        return { key, apiKey };
    }

    async validateApiKey(key: string): Promise<UserEntity> {
        const apiKey = await this.apiKeyRepository.findOne({
            where: { key, isActive: true },
            relations: ['user'],
        });

        if (!apiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            throw new UnauthorizedException('API key expired');
        }

        // Actualizar estadísticas
        apiKey.usageCount++;
        apiKey.lastUsedAt = new Date();
        await this.apiKeyRepository.save(apiKey);

        return apiKey.user;
    }

    async getUserApiKeys(userId: string): Promise<ApiKeyEntity[]> {
        return this.apiKeyRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async revokeApiKey(id: string, userId: string): Promise<void> {
        const apiKey = await this.apiKeyRepository.findOne({
            where: { id, user: { id: userId } },
        });

        if (apiKey) {
            apiKey.isActive = false;
            await this.apiKeyRepository.save(apiKey);
        }
    }
}