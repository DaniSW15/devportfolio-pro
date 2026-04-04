import { Module } from '@nestjs/common';
import { Base64ToolController } from './base64-tool.controller';
import { Base64ToolService } from './base64-tool.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [Base64ToolController],
  providers: [Base64ToolService],
})
export class Base64ToolModule {}
