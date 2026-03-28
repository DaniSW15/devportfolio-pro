import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateApiKeyDto {
    @ApiProperty({ example: 'My App' })
    @IsString()
    name!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    expiresAt?: Date;
}

export class ApiKeyResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    key!: string;

    @ApiProperty()
    isActive!: boolean;

    @ApiProperty()
    usageCount!: number;

    @ApiProperty()
    lastUsedAt?: Date;

    @ApiProperty()
    expiresAt?: Date;

    @ApiProperty()
    createdAt!: Date;
}

export class ApiKeyListResponseDto {
    @ApiProperty({ type: [ApiKeyResponseDto] })
    items!: ApiKeyResponseDto[];

    @ApiProperty()
    total!: number;
}