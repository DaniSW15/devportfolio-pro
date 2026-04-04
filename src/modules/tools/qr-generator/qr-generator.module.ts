import { Module } from '@nestjs/common';
import { QrGeneratorController } from './qr-generator.controller';
import { QrGeneratorService } from './qr-generator.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [QrGeneratorController],
  providers: [QrGeneratorService],
  exports: [QrGeneratorService],
})
export class QrGeneratorModule {}
