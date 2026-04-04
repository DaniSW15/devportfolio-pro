import { Module } from '@nestjs/common';
import { JwtDecoderController } from './jwt-decoder.controller';
import { JwtDecoderService } from './jwt-decoder.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [JwtDecoderController],
  providers: [JwtDecoderService],
  exports: [JwtDecoderService],
})
export class JwtDecoderModule {}
