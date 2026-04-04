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
import { ApiKeyService } from './services/api-key/api-key.service';
import { ApiKeyEntity } from './entities/api-key/api-key.entity';
import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { ApiKeyController } from './controllers/api-key/api-key.controller';
import { GithubStrategy } from './strategies/github/github.strategy';
import { JwtAuthGuardGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtOrApiKeyGuard } from './guards/jwt-or-api-key/jwt-or-api-key.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, BlacklistedTokenEntity, ApiKeyEntity]),
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('jwt.secret'),
                signOptions: { expiresIn: configService.get('jwt.expiresIn') },
            }),
        }),
    ],
    controllers: [AuthController, ApiKeyController],
    providers: [AuthService, JwtStrategyService, TokenBlacklistService, ApiKeyService, ApiKeyGuard, GithubStrategy, JwtAuthGuardGuard, JwtOrApiKeyGuard],
    exports: [AuthService, ApiKeyService, ApiKeyGuard, JwtAuthGuardGuard, JwtOrApiKeyGuard, TokenBlacklistService, JwtStrategyService],
})
export class AuthModule { }
