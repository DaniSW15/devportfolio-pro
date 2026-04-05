import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PasswordGeneratorService } from './password-generator.service';
import { PasswordGeneratorDto, PasswordGeneratorResponseDto } from './dto/password-generator.dto';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';

@ApiTags('Password Generator')
@Controller('tools/password-generator')
@UseGuards(JwtOrApiKeyGuard)
@ApiBearerAuth()
export class PasswordGeneratorController {
    constructor(private readonly passwordGeneratorService: PasswordGeneratorService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a secure password' })
    @ApiResponse({ status: 200, type: PasswordGeneratorResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    generatePassword(@Body() dto: PasswordGeneratorDto): PasswordGeneratorResponseDto {
        return this.passwordGeneratorService.generatePassword(dto);
    }

    @Post('multiple')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate multiple passwords' })
    @ApiResponse({ status: 200, type: [PasswordGeneratorResponseDto] })
    generateMultiple(
        @Body('count') count: number,
        @Body() dto: PasswordGeneratorDto
    ): PasswordGeneratorResponseDto[] {
        return this.passwordGeneratorService.generateMultiple(count || 5, dto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get tool statistics' })
    @ApiResponse({ status: 200 })
    getStats() {
        return this.passwordGeneratorService.getStats();
    }
}