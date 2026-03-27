import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, RefreshTokenDto, RegisterDto } from './dto/register.dto/register.dto';
import { JwtAuthGuardGuard } from './guards/jwt-auth/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: RegisterDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refresh_token);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuardGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout a user' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Body() body: RefreshTokenDto) {
        return this.authService.logout(body.refresh_token);
    }
}
