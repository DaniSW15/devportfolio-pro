import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto/register.dto/register.dto';
import { JwtAuthGuardGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entities/user-entity/user.entity';
import type { Response, Request } from 'express';
import { AuthResponse } from './interfaces/auth-response.interface';

const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;   // 1d
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7d

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    private setAuthCookies(res: Response, authResponse: AuthResponse): void {
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('access_token', authResponse.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: '/',
        });
        res.cookie('refresh_token', authResponse.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: '/',
        });
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const authResponse = await this.authService.register(registerDto);
        this.setAuthCookies(res, authResponse);
        return { user: authResponse.user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const authResponse = await this.authService.login(loginDto);
        this.setAuthCookies(res, authResponse);
        return { user: authResponse.user };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using cookie' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = (req.cookies as Record<string, string> | undefined)?.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }
        const { access_token } = await this.authService.refreshToken(refreshToken);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: '/',
        });
        return { message: 'Token refreshed successfully' };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuardGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout a user' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = (req.cookies as Record<string, string> | undefined)?.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }
        await this.authService.logout(refreshToken);
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        return { message: 'Logged out successfully' };
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth() {
        // GitHub redirects automatically
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    githubAuthRedirect(@Req() req: { user: UserEntity }, @Res() res: Response) {
        const tokens = this.authService.githubLogin(req.user);
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: '/',
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: '/',
        });
        res.redirect('http://localhost:3000/auth/callback');
    }
}
