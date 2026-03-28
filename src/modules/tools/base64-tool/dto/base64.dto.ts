import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Base64Dto {
    @ApiProperty({ description: 'Text to encode or decode' })
    @IsString()
    @IsNotEmpty()
    input!: string;

    @ApiProperty({ enum: ['encode', 'decode'], default: 'encode' })
    @IsEnum(['encode', 'decode'])
    @IsOptional()
    action?: 'encode' | 'decode' = 'encode';
}