import { BadRequestException, Injectable } from '@nestjs/common';
import { Base64Dto } from './dto/base64.dto';

@Injectable()
export class Base64ToolService {
    process(dto: Base64Dto): { result: string, original: string, action: string } {
        try {
            if (dto.action === 'encode') {
                const result = Buffer.from(dto.input).toString('base64');
                return {
                    result,
                    original: dto.input,
                    action: 'encode'
                };
            } else {
                const result = Buffer.from(dto.input, 'base64').toString('utf-8');
                return {
                    result,
                    original: dto.input,
                    action: 'decode'
                };
            }
        } catch (error) {
            throw new BadRequestException(`Invalid ${dto.action === 'decode' ? 'base64 string' : 'input'}`);
        }
    }
}
