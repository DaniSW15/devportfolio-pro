import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PasswordGeneratorService } from './password-generator.service';
import { PasswordGeneratorDto, PasswordGeneratorResponseDto } from './dto/password-generator.dto';
import { JwtAuthGuardGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Password Generator')
@Controller('tools/password-generator')
@UseGuards(JwtAuthGuardGuard)
@ApiBearerAuth()
export class PasswordGeneratorController {
    constructor(private readonly passwordGeneratorService: PasswordGeneratorService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a secure password' })
    @ApiResponse({ status: 200, type: PasswordGeneratorResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async generatePassword(@Body() dto: PasswordGeneratorDto): Promise<PasswordGeneratorResponseDto> {
        return this.passwordGeneratorService.generatePassword(dto);
    }

    @Post('multiple')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate multiple passwords' })
    @ApiResponse({ status: 200, type: [PasswordGeneratorResponseDto] })
    async generateMultiple(
        @Body('count') count: number,
        @Body() dto: PasswordGeneratorDto
    ): Promise<PasswordGeneratorResponseDto[]> {
        return this.passwordGeneratorService.generateMultiple(count || 5, dto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get tool statistics' })
    @ApiResponse({ status: 200 })
    async getStats() {
        return this.passwordGeneratorService.getStats();
    }
}