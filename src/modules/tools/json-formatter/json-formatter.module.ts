import { Module } from '@nestjs/common';
import { JsonFormatterService } from './json-formatter.service';
import { JsonFormatterController } from './json-formatter.controller';
import { RateLimitModule } from 'src/modules/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  providers: [JsonFormatterService],
  controllers: [JsonFormatterController]
})
export class JsonFormatterModule {}
