import { Module } from '@nestjs/common';
import { JwtDecoderController } from './jwt-decoder.controller';
import { JwtDecoderService } from './jwt-decoder.service';

@Module({
  controllers: [JwtDecoderController],
  providers: [JwtDecoderService],
  exports: [JwtDecoderService],
})
export class JwtDecoderModule {}
