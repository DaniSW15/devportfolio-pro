import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { StringValue } from 'ms';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user-entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/register.dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './interfaces/auth-response.interface';
import { TokenBlacklistService } from './services/token-blacklist/token-blacklist.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from 'src/config/config/config.service';

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenBlacklistService: TokenBlacklistService,
        private readonly emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const user = this.userRepository.create(registerDto);
        const savedUser = await this.userRepository.save(user);

        await this.emailService.sendWelcomeEmail(savedUser.email, savedUser.name);

        return this.generateAuthResponse(savedUser);
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email }, select: ['id', 'email', 'name', 'avatarUrl', 'role', 'password', 'createdAt'] });
        if (!user || !(await user.validatePassword(loginDto.password))) {
            throw new ConflictException('Invalid email or password');
        }

        return this.generateAuthResponse(user);
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
        const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(refreshToken);
        if (isBlacklisted) {
            throw new UnauthorizedException('Refresh token is blacklisted');
        }

        try {
            const payload = this.jwtService.verify<JwtPayload>(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const { secret, expiresIn } = this.configService.jwt;
            const access_token = this.jwtService.sign(
                { sub: user.id, email: user.email, role: user.role },
                { secret, expiresIn: expiresIn as StringValue },
            );
            return { access_token };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refresh_token: string): Promise<{ message: string }> {
        try {
            const payload = this.jwtService.verify<JwtPayload>(refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
            await this.tokenBlacklistService.blacklistToken(refresh_token, payload.sub);
            return { message: 'Logged out successfully' };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateUser(userId: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id: userId, isActive: true } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private generateAuthResponse(user: UserEntity): AuthResponse {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const { secret, refreshSecret, expiresIn, refreshExpiresIn } = this.configService.jwt;

        return {
            access_token: this.jwtService.sign(payload, {
                secret,
                expiresIn: expiresIn as StringValue
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiresIn as StringValue
            }),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
                createdAt: user.createdAt,
            },
        };
    }

    async validateOrCreateGithubUser(profile: {
        email: string;
        name: string;
        avatarUrl?: string;
    }): Promise<UserEntity> {
        let user = await this.userRepository.findOne({
            where: { email: profile.email },
        });

        if (!user) {
            user = this.userRepository.create({
                email: profile.email,
                name: profile.name,
                avatarUrl: profile.avatarUrl,
                password: Math.random().toString(36), // Password aleatorio para OAuth
            });
            await this.userRepository.save(user);
        }

        return user;
    }

    githubLogin(user: UserEntity): { access_token: string; refresh_token: string } {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const { secret, refreshSecret, expiresIn, refreshExpiresIn } = this.configService.jwt;

        return {
            access_token: this.jwtService.sign(payload, {
                secret,
                expiresIn: expiresIn as StringValue,
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiresIn as StringValue,
            }),
        };
    }
}
