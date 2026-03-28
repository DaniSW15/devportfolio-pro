import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration/configuration';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { JsonFormatterModule } from './modules/tools/json-formatter/json-formatter.module';
import { JwtDecoderModule } from './modules/tools/jwt-decoder/jwt-decoder.module';
import { QrGeneratorModule } from './modules/tools/qr-generator/qr-generator.module';
import { PasswordGeneratorService } from './modules/tools/password-generator/password-generator.service';
import { PasswordGeneratorModule } from './modules/tools/password-generator/password-generator.module';
import { ApiTesterModule } from './modules/tools/api-tester/api-tester.module';
import { SnippetManagerModule } from './modules/tools/snippet-manager/snippet-manager.module';
import { ColorPaletteModule } from './modules/tools/color-palette/color-palette.module';
import { Base64ToolModule } from './modules/tools/base64-tool/base64-tool.module';
import { UuidGeneratorModule } from './modules/tools/uuid-generator/uuid-generator.module';
import { TimestampConverterModule } from './modules/tools/timestamp-converter/timestamp-converter.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { StripeService } from './modules/billing/stripe/stripe.service';
import { StripeModule } from './modules/billing/stripe/stripe.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

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

    PasswordGeneratorModule,

    ApiTesterModule,

    SnippetManagerModule,

    ColorPaletteModule,

    Base64ToolModule,

    UuidGeneratorModule,

    TimestampConverterModule,

    RateLimitModule,

    StripeModule,

    WebSocketModule,
  ],
  controllers: [],
  providers: [PasswordGeneratorService, StripeService],
})
export class AppModule { }
