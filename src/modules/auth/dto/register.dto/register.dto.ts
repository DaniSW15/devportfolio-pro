import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

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
    @IsNotEmpty()
    refresh_token!: string;
}

export class UserResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;

    @ApiProperty({ example: 'user@example.com' })
    email!: string;

    @ApiProperty({ example: 'John Doe' })
    name!: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    avatarUrl?: string;

    @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
    role!: string;
}

export class AuthResponseDto {
    @ApiProperty()
    access_token!: string;

    @ApiProperty()
    refresh_token!: string;

    @ApiProperty({ type: UserResponseDto })
    user!: {
        id: string;
        email: string;
        name: string;
        avatarUrl?: string;
        role: string;
    }
}