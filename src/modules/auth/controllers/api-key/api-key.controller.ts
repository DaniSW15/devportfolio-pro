import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuardGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { ApiKeyService } from '../../services/api-key/api-key.service';
import { ApiKeyListResponseDto, ApiKeyResponseDto, CreateApiKeyDto } from '../../dto/api-key-dto/api-key-dto';

@ApiTags('API Keys')
@Controller('api-keys')
@UseGuards(JwtAuthGuardGuard)
@ApiBearerAuth()
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) { }

    @Post()
    @ApiOperation({ summary: 'Generate new API key' })
    @ApiResponse({ status: 201, type: ApiKeyResponseDto })
    async createApiKey(@Request() req, @Body() dto: CreateApiKeyDto) {
        const { key, apiKey } = await this.apiKeyService.generateApiKey(req.user.id, dto);
        return {
            ...apiKey,
            key, // Mostrar la key solo una vez
        };
    }

    @Get()
    @ApiOperation({ summary: 'List all API keys' })
    @ApiResponse({ status: 200, type: ApiKeyListResponseDto })
    async listApiKeys(@Request() req) {
        const keys = await this.apiKeyService.getUserApiKeys(req.user.id);
        return {
            items: keys,
            total: keys.length,
        };
    }

    @Get(':id/stats')
    @ApiOperation({ summary: 'Get API key statistics' })
    async getApiKeyStats(@Request() req, @Param('id') id: string) {
        return this.apiKeyService.getApiKeyStats(id, req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Revoke API key' })
    async revokeApiKey(@Request() req, @Param('id') id: string) {
        await this.apiKeyService.revokeApiKey(id, req.user.id);
        return { message: 'API key revoked successfully' };
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Delete API key permanently' })
    async deleteApiKey(@Request() req, @Param('id') id: string) {
        await this.apiKeyService.deleteApiKey(id, req.user.id);
        return { message: 'API key deleted successfully' };
    }
}