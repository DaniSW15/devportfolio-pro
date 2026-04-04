import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuardGuard } from '../jwt-auth/jwt-auth.guard';
import { ApiKeyGuard } from '../api-key/api-key.guard';

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
    constructor(
        private jwtGuard: JwtAuthGuardGuard,
        private apiKeyGuard: ApiKeyGuard,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
        const authHeader: string | undefined = request.headers['authorization'];
        const apiKeyHeader: string | undefined = request.headers['x-api-key'];

        const isApiKey =
            apiKeyHeader != null ||
            (authHeader != null && authHeader.startsWith('Bearer dk_'));

        if (isApiKey) {
            return this.apiKeyGuard.canActivate(context);
        }

        try {
            return await Promise.resolve(this.jwtGuard.canActivate(context)) as boolean;
        } catch {
            throw new UnauthorizedException('Authentication required');
        }
    }
}
