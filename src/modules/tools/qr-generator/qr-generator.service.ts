import { BadRequestException, Injectable } from '@nestjs/common';
import { QRErrorCorrection, QRFormat } from './interfaces/qr-error-correction.interface';
import { QRGeneratorDto, QRGeneratorResponseDto } from './dto/gr-generator.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class QrGeneratorService {
    async generateQR(dto: QRGeneratorDto): Promise<QRGeneratorResponseDto> {
        const {
            text,
            width = 300,
            errorCorrection = QRErrorCorrection.MEDIUM,
            format = QRFormat.PNG,
            margin = 4,
            colorDark = '#000000',
            colorLight = '#FFFFFF'
        } = dto;

        try {
            const options: QRCode.QRCodeToBufferOptions = {
                width,
                margin,
                color: {
                    dark: colorDark,
                    light: colorLight,
                },
                errorCorrectionLevel: errorCorrection as any,
            };

            let qrCode: string;
            let mimeType: string;

            switch (format) {
                case QRFormat.PNG:
                    const buffer = await QRCode.toBuffer(text, options);
                    qrCode = buffer.toString('base64');
                    mimeType = 'image/png';
                    break;

                case QRFormat.SVG:
                    qrCode = await QRCode.toString(text, { ...options, type: 'svg' });
                    qrCode = Buffer.from(qrCode).toString('base64');
                    mimeType = 'image/svg+xml';
                    break;

                case QRFormat.TERMINAL:
                    qrCode = await QRCode.toString(text, { type: 'terminal' });
                    qrCode = Buffer.from(qrCode).toString('base64');
                    mimeType = 'text/plain';
                    break;

                default:
                    throw new BadRequestException('Unsupported format');
            }

            const size = Buffer.byteLength(qrCode, 'base64');

            return {
                qrCode,
                mimeType,
                format,
                size,
                metadata: {
                    text,
                    width,
                    errorCorrection,
                    timestamp: new Date().toISOString(),
                },
            };
        } catch (error: any) {
            throw new BadRequestException(`Failed to generate QR code: ${error.message}`);
        }
    }

    async generateMultipleQR(texts: string[]): Promise<QRGeneratorResponseDto[]> {
        const promises = texts.map(text =>
            this.generateQR({ text, width: 200, format: QRFormat.PNG })
        );
        return Promise.all(promises);
    }

    async getStats() {
        return {
            tool: 'qr-generator',
            version: '1.0.0',
            features: ['png', 'svg', 'terminal', 'custom-colors', 'error-correction'],
            supportedFormats: [QRFormat.PNG, QRFormat.SVG, QRFormat.TERMINAL],
        };
    }
}
