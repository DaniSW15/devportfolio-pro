import { Module } from '@nestjs/common';
import { ColorPaletteController } from './color-palette.controller';
import { ColorPaletteService } from './color-palette.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ColorPaletteController],
  providers: [ColorPaletteService],
})
export class ColorPaletteModule {}
