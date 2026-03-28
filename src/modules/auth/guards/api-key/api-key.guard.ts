import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../../services/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private apiKeyService: ApiKeyService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            throw new UnauthorizedException('API key required');
        }

        try {
            const user = await this.apiKeyService.validateApiKey(apiKey);
            request.user = user;
            request.apiKey = apiKey;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid API key');
        }
    }
}