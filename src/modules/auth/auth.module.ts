import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'src/config/config/config.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategyService } from './strategies/jwt-strategy/jwt.strategy.service';
import { AuthController } from './auth.controller';
import { UserEntity } from './entities/user-entity/user.entity';
import { ConfigModule } from 'src/config/config.module';
import { TokenBlacklistService } from './services/token-blacklist/token-blacklist.service';
import { BlacklistedTokenEntity } from './entities/blacklisted-token/blacklisted-token';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, BlacklistedTokenEntity]),
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwt.secret'),
                signOptions: { expiresIn: configService.get('jwt.expiresIn') },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategyService, JwtStrategyService, TokenBlacklistService],
    exports: [AuthService],
})
export class AuthModule { }
