import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtDecoderDto, JwtDecodeResponseDto } from './dto/jwt-decoder.dto';
import { features } from 'process';

@Injectable()
export class JwtDecoderService {
    decodeToken(dto: JwtDecoderDto): JwtDecodeResponseDto {
        const { token } = dto;

        try {
            const pars = token.split('.');
            if (pars.length !== 3) throw new BadRequestException('Invalid JWT token format. Expected format: header.payload.signature');

            const [headerB64, payloadB64, signature] = pars;

            const headerJson = this.decodeBase64Url(headerB64);
            const payloadJson = this.decodeBase64Url(payloadB64);
            const dates = this.processDates(payloadJson.iat, payloadJson.exp);

            return {
                isValid: true,
                header: headerJson,
                payload: payloadJson,
                signature,
                dates,
                originalToken: token
            } as JwtDecodeResponseDto;
        } catch (error) {
            return {
                isValid: false,
                header: { alg: '', typ: '' },
                payload: {},
                signature: '',
                error: (error as Error).message || 'Failed to decode JWT token',
                originalToken: token,
            } as JwtDecodeResponseDto;
        }
    }

    private decodeBase64Url(base64Url: string): any {
        try {
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const padding = base64.length % 4;
            if (padding > 0) {
                base64 += '='.repeat(4 - padding);
            }
            const decoded = Buffer.from(base64, 'base64').toString('utf-8');
            return JSON.parse(decoded);
        } catch (error) {
            throw new BadRequestException(`Invalid JWT token format. Failed to decode base64Url. Error: ${(error as Error).message}`);
        }
    }

    private processDates(iat?: number, exp?: number): any {
        const result: any = {};
        if (iat) {
            const issuedDate = new Date(iat * 1000);
            result.issuedAt = issuedDate.toISOString();
            result.issuedAtFormatted = issuedDate.toLocaleString();
        }
        if (exp) {
            const expiresDate = new Date(exp * 1000);
            const now = new Date();

            result.expiresAt = expiresDate.toISOString();
            result.expiresAtFormatted = expiresDate.toLocaleString();
            result.isExpired = now.getTime() > expiresDate.getTime();

            if (!result.isExpired) {
                const diffMs = expiresDate.getTime() - now.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                result.expiresIn = `${diffDays}d ${diffHours}h ${diffMinutes}m`;
            } else {
                result.expiresIn = 'Expired';
            }
        }

        return result;
    }

    getStats() {
        return {
            tool: 'JWT Decoder',
            version: '1.0.0',
            features: [
                'Decode JWT tokens',
                'Validate token structure',
                'Process standard claims (iat, exp)',
                'Provide detailed error messages for invalid tokens'
            ]
        }
    }
}
