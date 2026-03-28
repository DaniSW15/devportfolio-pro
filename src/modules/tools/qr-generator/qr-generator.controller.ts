import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { QrGeneratorService } from './qr-generator.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QRGeneratorDto, QRGeneratorResponseDto } from './dto/gr-generator.dto';
import type { Response } from 'express';
import { QRFormat } from './interfaces/qr-error-correction.interface';

@ApiBearerAuth()
@Controller('qr-generator')
export class QrGeneratorController {
    constructor(private readonly qrGeneratorService: QrGeneratorService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate QR code' })
    @ApiResponse({ status: 200, type: QRGeneratorResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async generateQR(@Body() dto: QRGeneratorDto): Promise<QRGeneratorResponseDto> {
        return this.qrGeneratorService.generateQR(dto);
    }

    @Post('batch')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate multiple QR codes' })
    @ApiResponse({ status: 200, type: [QRGeneratorResponseDto] })
    async generateMultipleQR(texts: string[]): Promise<QRGeneratorResponseDto[]> {
        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            throw new BadRequestException('texts must be a non-empty array');
        }

        const promises = texts.map(text =>
            this.generateQR({ text, width: 200, format: QRFormat.PNG })
        );
        return Promise.all(promises);
    }

    @Post('download')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate and download QR code' })
    async downloadQR(@Body() dto: QRGeneratorDto, @Res() res: Response) {
        const result = await this.qrGeneratorService.generateQR(dto);

        const buffer = Buffer.from(result.qrCode, 'base64');
        const filename = `qrcode-${Date.now()}.${result.format}`;

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get tool statistics' })
    @ApiResponse({ status: 200 })
    async getStats() {
        return this.qrGeneratorService.getStats();
    }
}
