import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApiKeyDto {
    @ApiProperty({ example: 'My App' })
    @IsString()
    name!: string;

    @ApiProperty({ required: false, example: '2027-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
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