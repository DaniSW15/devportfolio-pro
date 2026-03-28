import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RateLimitController } from './rate-limit.controller';
import { RateLimitService } from './rate-limit.service';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ThrottlerStorageService } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.get('THROTTLE_TTL', 60),
                        limit: configService.get('THROTTLE_LIMIT', 100),
                    },
                ],
                storage: new ThrottlerStorageRedisService({
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                }),
            }),
        }),
    ],
    providers: [
        RateLimitService,
        {
            provide: ThrottlerStorageService,
            useFactory: (configService: ConfigService) =>
                new ThrottlerStorageRedisService({
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                }),
            inject: [ConfigService],
        },
    ],
    exports: [RateLimitService],
    controllers: [RateLimitController],
})
export class RateLimitModule { }