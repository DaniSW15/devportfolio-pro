import { Module } from '@nestjs/common';
import { SnippetManagerController } from './snippet-manager.controller';
import { SnippetManagerService } from './snippet-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnippetEntity } from './entity/snippet.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SnippetEntity]),
    AuthModule,
  ],
  controllers: [SnippetManagerController],
  providers: [SnippetManagerService],
  exports: [SnippetManagerService],
})
export class SnippetManagerModule { }
