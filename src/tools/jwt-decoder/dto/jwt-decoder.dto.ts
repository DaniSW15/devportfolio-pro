import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JwtDecoderDto {
    @ApiProperty({
        description: 'JWT token to be decoded',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    })
    @IsString()
    @IsNotEmpty()
    token!: string;
}

export class jwtHeaderDto {
    @ApiProperty({ example: 'HS256' })
    alg!: string;

    @ApiProperty({ example: 'JWT' })
    typ!: string;

    @ApiProperty({ required: false })
    kid?: string;
}

export class JwtPayloadDto {
    @ApiProperty({ required: false })
    sub?: string;

    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    email?: string;

    @ApiProperty({ required: false })
    iat?: number;

    @ApiProperty({ required: false })
    exp?: number;

    [key: string]: any;
}

export class JwtDecodeResponseDto {
    @ApiProperty({ description: 'Whether the token is valid and successfully decoded' })
    isValid!: boolean;

    @ApiProperty({ type: jwtHeaderDto, description: 'Decoded JWT header' })
    header!: jwtHeaderDto;

    @ApiProperty({ type: JwtPayloadDto, description: 'Decoded JWT payload' })
    payload!: JwtPayloadDto;

    @ApiProperty({ description: 'Error message if the decoding failed', required: false })
    error?: string;

    @ApiProperty({ description: 'JWT signature part of the token' })
    signature!: string;

    @ApiProperty({ description: 'Formatted decoded token for display purposes', required: false })
    dates?: {
        issuedAt?: string;
        expiresAt?: string;
        isExpired?: boolean;
        expiresIn?: string;
    };

    @ApiProperty({ description: 'Original token that was decoded' })
    originalToken!: string;
}