import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JsonFormatterService } from './json-formatter.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JsonFormatterDto, JsonFormatterResponseDto } from './dto/json-formatter.dto';
import { JwtAuthGuardGuard } from 'src/modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RateLimitGuard } from 'src/modules/rate-limit/rate-limit/rate-limit.guard';

@ApiBearerAuth()
@Controller('json-formatter')
@UseGuards(JwtAuthGuardGuard, RateLimitGuard)
export class JsonFormatterController {
    constructor(private readonly jsonFormatterService: JsonFormatterService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Process JSON string with specified action' })
    @ApiResponse({ status: 200, description: 'JSON processed successfully', type: JsonFormatterResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async processJson(@Body() jsonFormatterDto: JsonFormatterDto) : Promise<JsonFormatterResponseDto> {
        return this.jsonFormatterService.processJson(jsonFormatterDto);
    }

    @Get('status')
    @ApiOperation({ summary: 'Get status of JSON Formatter tool' })
    @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
    getStatus() {
        return this.jsonFormatterService.getStata();
    }
}
