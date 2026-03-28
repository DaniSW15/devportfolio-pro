import { Module } from '@nestjs/common';
import { TimestampConverterController } from './timestamp-converter.controller';
import { TimestampConverterService } from './timestamp-converter.service';

@Module({
  controllers: [TimestampConverterController],
  providers: [TimestampConverterService]
})
export class TimestampConverterModule {}
