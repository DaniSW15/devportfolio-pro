import { Module } from '@nestjs/common';
import { PasswordGeneratorController } from './password-generator.controller';
import { PasswordGeneratorService } from './password-generator.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PasswordGeneratorController],
  providers: [PasswordGeneratorService],
  exports: [PasswordGeneratorService],
})
export class PasswordGeneratorModule { }
