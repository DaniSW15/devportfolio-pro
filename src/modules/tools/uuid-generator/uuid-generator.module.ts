import { Module } from '@nestjs/common';
import { UuidGeneratorController } from './uuid-generator.controller';
import { UuidGeneratorService } from './uuid-generator.service';

@Module({
  controllers: [UuidGeneratorController],
  providers: [UuidGeneratorService]
})
export class UuidGeneratorModule {}
