import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TimestampConverterService } from './timestamp-converter.service';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';

@ApiTags('Timestamp Converter')
@ApiBearerAuth()
@UseGuards(JwtOrApiKeyGuard)
@Controller('tools/timestamp-converter')
export class TimestampConverterController {
    constructor(private readonly timestampConverterService: TimestampConverterService) {}

    @Get('current')
    @ApiOperation({ summary: 'Get current timestamp in multiple formats' })
    @ApiResponse({ status: 200, description: 'Current timestamp returned' })
    getCurrent(): { timestamp: number; iso: string; utc: string; local: string } {
        return this.timestampConverterService.getCurrent();
    }

    @Post('to-date')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Convert Unix timestamp to date formats' })
    @ApiResponse({ status: 200, description: 'Timestamp converted' })
    @ApiResponse({ status: 400, description: 'Invalid timestamp' })
    convertToDate(
        @Body('timestamp') timestamp: number,
    ): { date: string; iso: string; utc: string; local: string } {
        return this.timestampConverterService.convertToDate(Number(timestamp));
    }

    @Post('to-timestamp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Convert date string to Unix timestamp' })
    @ApiResponse({ status: 200, description: 'Date converted to timestamp' })
    @ApiResponse({ status: 400, description: 'Invalid date string' })
    convertToTimestamp(
        @Body('date') date: string,
    ): { timestamp: number; date: string } {
        return this.timestampConverterService.convertToTimestamp(date);
    }
}
