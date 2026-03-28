// src/modules/tools/snippet-manager/dto/snippet.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';

export class CreateSnippetDto {
    @ApiProperty({ example: 'Fetch API Example' })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'async function fetchData() { ... }' })
    @IsString()
    @IsNotEmpty()
    content!: string;

    @ApiProperty({ example: 'javascript' })
    @IsString()
    @IsNotEmpty()
    language!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    tags?: string[];
}

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) { }

export class SnippetResponseDto extends CreateSnippetDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    userId!: string;
}