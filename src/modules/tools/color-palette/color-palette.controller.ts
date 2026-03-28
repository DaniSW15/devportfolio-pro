import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('color-palette')
export class ColorPaletteController {}
