import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user-entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/register.dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './interfaces/auth-response.interface';
import { ConfigService } from 'src/config/config/config.service';
import { TokenBlacklistService } from './services/token-blacklist/token-blacklist.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenBlacklistService: TokenBlacklistService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const user = this.userRepository.create(registerDto);
        await this.userRepository.save(user);

        return this.generateAuthResponse(user);
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email }, select: ['id', 'email', 'name', 'avatarUrl', 'role', 'password'] });

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
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const access_token = this.jwtService.sign({ sub: user.id, email: user.email });
            return { access_token };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refresh_token: string): Promise<{ message: string }> {
        try {
            const payload = this.jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_SECRET });
            await this.tokenBlacklistService.blacklistToken(refresh_token, payload.sub);
            return { message: 'Logged out successfully' };
        } catch (error) {
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
                expiresIn: expiresIn as any
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiresIn as any
            }),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }
}
