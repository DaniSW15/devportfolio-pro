import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import configuration from './configuration/configuration';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from '../config/validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '.env.example'],
      cache: true,
      expandVariables: true, // Permite usar variables como ${DATABASE_URL}
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule { }
