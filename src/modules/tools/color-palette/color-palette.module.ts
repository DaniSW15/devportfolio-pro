import { Module } from '@nestjs/common';
import { ColorPaletteController } from './color-palette.controller';

@Module({
  controllers: [ColorPaletteController]
})
export class ColorPaletteModule {}
