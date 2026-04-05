import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Base64ToolService } from './base64-tool.service';
import { Base64Dto } from './dto/base64.dto';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';

@ApiTags('Base64 Tool')
@ApiBearerAuth()
@UseGuards(JwtOrApiKeyGuard)
@Controller('tools/base64-tool')
export class Base64ToolController {
    constructor(private readonly base64ToolService: Base64ToolService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Encode or decode a Base64 string' })
    @ApiResponse({ status: 200, description: 'Processed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    process(@Body() dto: Base64Dto): { result: string; original: string; action: string } {
        return this.base64ToolService.process(dto);
    }
}
