import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { DatabaseConfig, JwtConfig, RedisConfig } from '../interfaces/config-interface/config-interface.interface';

@Injectable()
export class ConfigService {
    constructor(private configService: NestConfigService) { }

    // Método get con tipado y valores por defecto
    get<T = any>(key: string, defaultValue?: T): T {
        const value = this.configService.get<T>(key);
        return value !== undefined && value !== null ? value : (defaultValue as T);
    }

    get nodeEnv(): string {
        return this.configService.get<string>('nodeEnv', 'development');
    }

    get port(): number {
        return this.configService.get<number>('port', 3000);
    }

    get appName(): string {
        return this.configService.get<string>('appName', 'DevTools Hub');
    }

    get appUrl(): string {
        return this.configService.get<string>('appUrl', 'http://localhost:3000');
    }

    get database(): DatabaseConfig {
        return {
            host: this.get('database.host', 'localhost'),
            port: this.get('database.port', 5432),
            username: this.get('database.username', 'postgres'),
            password: this.get('database.password', 'postgres'),
            database: this.get('database.database', 'devtools_hub'),
        };
    }

    get redis(): RedisConfig {
        return {
            host: this.get('redis.host', 'localhost'),
            port: this.get('redis.port', 6379),
            password: this.get('redis.password', ''),
        };
    }

    get jwt(): JwtConfig {
        return {
            secret: this.get('jwt.secret', 'default-secret'),  // 👈 valor por defecto
            refreshSecret: this.get('jwt.refreshSecret', 'default-refresh-secret'),
            expiresIn: this.get('jwt.expiresIn', '1d'),
            refreshExpiresIn: this.get('jwt.refreshExpiresIn', '7d'),
        };
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get isTest(): boolean {
        return this.nodeEnv === 'test';
    }

    getToolRateLimit(tool: string, plan: 'free' | 'premium'): number {
        const rateLimits = this.configService.get<Record<string, Record<'free' | 'premium', number>>>('tools.rateLimits');
        return rateLimits?.[tool]?.[plan] || (plan === 'free' ? 100 : 1000);
    }

    get databaseUrl(): string {
        const { host, port, username, password, database } = this.database;
        return `postgresql://${username}:${password}@${host}:${port}/${database}`;
    }

    get redisUrl(): string {
        const { host, port, password } = this.redis;
        if (password) {
            return `redis://:${password}@${host}:${port}`;
        }
        return `redis://${host}:${port}`;
    }
}
