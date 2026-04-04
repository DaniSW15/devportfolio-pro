import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonFormatterDto, JsonFormatterResponseDto } from './dto/json-formatter.dto';
import { FormatAction } from './interfaces/format-action.interface';

@Injectable()
export class JsonFormatterService {
    processJson(dto: JsonFormatterDto): JsonFormatterResponseDto {
        const startTime = Date.now();
        const { jsonString, action = FormatAction.FORMAT, spaces = 2 } = dto;

        try {
            const parsedJson = this.validateJson((jsonString));
            const originalSize = Buffer.byteLength(jsonString, 'utf-8');
            let result: string;

            switch (action) {
                case FormatAction.FORMAT:
                    result = this.formatJson(parsedJson, spaces);
                    break;
                case FormatAction.MINIFY:
                    result = this.minifyJson(parsedJson);
                    break;
                case FormatAction.VALIDATE:
                    result = JSON.stringify({ valid: true, message: 'Valid JSON' });
                    break;
                default:
                    result = this.formatJson(parsedJson, spaces);
            }

            const resultSize = Buffer.byteLength(result, 'utf-8');
            const processingTime = Date.now() - startTime;

            return {
                result,
                success: true,
                originalSize,
                resultSize,
                processingTime
            };
        } catch (error: unknown) {
            const processingTime = Date.now() - startTime;
            return {
                result: '',
                success: false,
                error: error instanceof Error ? error.message : String(error),
                originalSize: Buffer.byteLength(jsonString, 'utf-8'),
                resultSize: 0,
                processingTime
            };
        }
    }

    private validateJson(jsonString: string): unknown {
        try {
            return JSON.parse(jsonString);
        } catch (error: unknown) {
            throw new BadRequestException(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private formatJson(json: any, spaces: number): string {
        return JSON.stringify(json, null, spaces);
    }

    private minifyJson(json: any): string {
        return JSON.stringify(json);
    }

    getStata(): { tools: string[]; version: string } {
        return {
            tools: ['json-formatter'],
            version: '1.0.0'
        };
    }
}