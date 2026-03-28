import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JwtDecoderService } from './jwt-decoder.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtDecoderDto, JwtDecodeResponseDto } from './dto/jwt-decoder.dto';

@ApiBearerAuth()
@Controller('jwt-decoder')
export class JwtDecoderController {
    constructor(private readonly jwtDecoderService: JwtDecoderService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Decode a JWT token' })
    @ApiResponse({ status: 200, description: 'JWT token decoded successfully' })
    @ApiResponse({ status: 400, description: 'Invalid JWT token format' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    decodeToken(@Body() jwtDecoderDto: JwtDecoderDto): JwtDecodeResponseDto {
        return this.jwtDecoderService.decodeToken(jwtDecoderDto);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get statistics for JWT Decoder tool' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
    getStats() {
        return this.jwtDecoderService.getStats();
    }
}
