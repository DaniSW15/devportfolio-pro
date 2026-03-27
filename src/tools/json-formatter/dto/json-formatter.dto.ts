import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { FormatAction } from "../interfaces/format-action.interface";

export class JsonFormatterDto {
    @ApiProperty({
        description: 'The JSON string to be formatted',
        example: '{"name":"John","age":30,"city":"New York"}'
    })
    @IsString()
    jsonString!: string;

    @ApiProperty({
        enum: FormatAction,
        description: 'The formatting action to be performed on the JSON string',
        example: FormatAction.FORMAT
    })
    @IsEnum(FormatAction)
    @IsOptional()
    action?: FormatAction = FormatAction.FORMAT;

    @ApiProperty({
        description: 'The indentation size for formatted JSON',
        example: 2,
        required: false
    })
    @IsOptional()
    spaces?: number = 2;
}

export class JsonFormatterResponseDto {
    @ApiProperty({ description: 'Processed JSON result' })
    result!: string;

    @ApiProperty({ description: 'Whether the operation was successful' })
    success!: boolean;

    @ApiProperty({ description: 'Error message if the operation failed', required: false })
    error?: string;

    @ApiProperty({ description: 'Original size in bytes of the input JSON string' })
    originalSize!: number;

    @ApiProperty({ description: 'Result size in bytes of the processed JSON string' })
    resultSize!: number;

    @ApiProperty({ description: 'Proccessing time in milliseconds' })
    processingTime!: number;
}