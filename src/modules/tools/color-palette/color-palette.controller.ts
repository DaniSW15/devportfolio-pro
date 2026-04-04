import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ColorPaletteService } from './color-palette.service';
import { JwtOrApiKeyGuard } from 'src/modules/auth/guards/jwt-or-api-key/jwt-or-api-key.guard';
import { IsEnum, IsString, Matches } from 'class-validator';

class ColorPaletteDto {
    @ApiProperty({ description: 'Base color in hex format', example: '#3b82f6' })
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'baseColor must be a valid hex color (e.g. #3b82f6)' })
    baseColor!: string;

    @ApiProperty({ enum: ['monochromatic', 'analogous', 'complementary', 'triadic'] })
    @IsEnum(['monochromatic', 'analogous', 'complementary', 'triadic'])
    type!: 'monochromatic' | 'analogous' | 'complementary' | 'triadic';
}

@ApiTags('Color Palette')
@ApiBearerAuth()
@UseGuards(JwtOrApiKeyGuard)
@Controller('tools/color-palette')
export class ColorPaletteController {
    constructor(private readonly colorPaletteService: ColorPaletteService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a color palette from a base hex color' })
    @ApiResponse({ status: 200, description: 'Palette generated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid color or type' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    generate(@Body() dto: ColorPaletteDto): { palette: string[]; baseColor: string; type: string } {
        const palette = this.colorPaletteService.generatePalette(dto.baseColor, dto.type);
        return { palette, baseColor: dto.baseColor, type: dto.type };
    }
}
