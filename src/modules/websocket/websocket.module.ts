import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CollaborativeGateway } from './websocket';
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
                },
            }),
        }),
    ],
    providers: [CollaborativeGateway, WsJwtGuard],
    exports: [CollaborativeGateway],
})
export class WebSocketModule { }