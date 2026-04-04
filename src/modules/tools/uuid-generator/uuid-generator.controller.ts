import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UuidGeneratorService } from './uuid-generator.service';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';

@ApiTags('UUID Generator')
@ApiBearerAuth()
@UseGuards(JwtOrApiKeyGuard)
@Controller('tools/uuid-generator')
export class UuidGeneratorController {
    constructor(private readonly uuidGeneratorService: UuidGeneratorService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a single UUID' })
    @ApiQuery({ name: 'version', enum: ['v1', 'v4', 'v5'], required: false })
    @ApiQuery({ name: 'namespace', required: false, description: 'Required for v5' })
    @ApiQuery({ name: 'name', required: false, description: 'Required for v5' })
    @ApiResponse({ status: 200, description: 'UUID generated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    generate(
        @Query('version') version: 'v1' | 'v4' | 'v5' = 'v4',
        @Query('namespace') namespace?: string,
        @Query('name') name?: string,
    ): { uuid: string; version: string } {
        return this.uuidGeneratorService.generate(version, namespace, name);
    }

    @Get('bulk')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate multiple UUIDs' })
    @ApiQuery({ name: 'count', required: false, description: 'Number of UUIDs (max 100)' })
    @ApiQuery({ name: 'version', enum: ['v1', 'v4', 'v5'], required: false })
    @ApiResponse({ status: 200, description: 'UUIDs generated successfully' })
    generateMultiple(
        @Query('count') count = 5,
        @Query('version') version: 'v1' | 'v4' | 'v5' = 'v4',
    ): { uuids: string[]; count: number } {
        return this.uuidGeneratorService.generateMultiple(Number(count), version);
    }
}
