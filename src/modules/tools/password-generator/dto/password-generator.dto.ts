import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class PasswordGeneratorDto {
    @ApiProperty({ description: 'Password length', default: 12, minimum: 4, maximum: 128 })
    @IsOptional()
    @IsNumber()
    @Min(4)
    @Max(128)
    length?: number = 12;

    @ApiProperty({ description: 'Include uppercase letters', default: true })
    @IsOptional()
    @IsBoolean()
    uppercase?: boolean = true;

    @ApiProperty({ description: 'Include lowercase letters', default: true })
    @IsOptional()
    @IsBoolean()
    lowercase?: boolean = true;

    @ApiProperty({ description: 'Include numbers', default: true })
    @IsOptional()
    @IsBoolean()
    numbers?: boolean = true;

    @ApiProperty({ description: 'Include symbols', default: true })
    @IsOptional()
    @IsBoolean()
    symbols?: boolean = true;

    @ApiProperty({ description: 'Exclude ambiguous characters (e.g., 0, O, I, l)', default: false })
    @IsOptional()
    @IsBoolean()
    excludeAmbiguous?: boolean = false;
}

export class PasswordStrengthDto {
    @ApiProperty()
    score!: number; // 0-4

    @ApiProperty()
    label!: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

    @ApiProperty()
    color!: string;

    @ApiProperty()
    description!: string;
}

export class PasswordGeneratorResponseDto {
    @ApiProperty({ description: 'Generated password' })
    password!: string;

    @ApiProperty({ description: 'Password strength' })
    strength!: PasswordStrengthDto;

    @ApiProperty({ description: 'Password length' })
    length!: number;

    @ApiProperty({ description: 'Entropy in bits' })
    entropy!: number;
}