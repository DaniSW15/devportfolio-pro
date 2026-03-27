import { Module } from '@nestjs/common';
import { JsonFormatterService } from './json-formatter.service';
import { JsonFormatterController } from './json-formatter.controller';

@Module({
  providers: [JsonFormatterService],
  controllers: [JsonFormatterController]
})
export class JsonFormatterModule {}
