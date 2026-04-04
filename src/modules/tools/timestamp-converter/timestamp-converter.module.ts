import { Module } from '@nestjs/common';
import { TimestampConverterController } from './timestamp-converter.controller';
import { TimestampConverterService } from './timestamp-converter.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TimestampConverterController],
  providers: [TimestampConverterService],
})
export class TimestampConverterModule {}
