import { Module } from '@nestjs/common';
import { UuidGeneratorController } from './uuid-generator.controller';
import { UuidGeneratorService } from './uuid-generator.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UuidGeneratorController],
  providers: [UuidGeneratorService],
})
export class UuidGeneratorModule {}
