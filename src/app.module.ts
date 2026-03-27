import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { JsonFormatterModule } from './tools/json-formatter/json-formatter.module';
import { JwtDecoderModule } from './tools/jwt-decoder/jwt-decoder.module';
import { QrGeneratorModule } from './tools/qr-generator/qr-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: true,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          password: config.get('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),

    // Database
    DatabaseModule,

    // Feature Modules
    AuthModule,

    JsonFormatterModule,

    JwtDecoderModule,

    QrGeneratorModule,
    // ProfileModule,
    // ProjectsModule,
    // BlogModule,
    // DevtoolsModule,
    // CommentsModule,
    // AnalyticsModule,
    // IntegrationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
