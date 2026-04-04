import { Module } from '@nestjs/common';
import { ApiTesterController } from './api-tester.controller';
import { ApiTesterService } from './api-tester.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ApiTesterController],
  providers: [ApiTesterService],
  exports: [ApiTesterService],
})
export class ApiTesterModule {}
