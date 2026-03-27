import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'https://github.com/johndoe', required: false })
    @IsOptional()
    @IsUrl()
    githubUsername?: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsString()
    refresh_token!: string;
}

export class AuthResponseDto {
    @ApiProperty()
    access_token!: string;

    @ApiProperty()
    refresh_token!: string;

    @ApiProperty()
    user!: {
        id: string;
        email: string;
        name: string;
        avatarUrl?: string;
        role: string;
    }
}