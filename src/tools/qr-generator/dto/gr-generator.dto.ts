import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { QRErrorCorrection, QRFormat } from "../interfaces/qr-error-correction.interface";

export class QRGeneratorDto {
    @ApiProperty({ 
        description: 'Text or URL to encode',
        example: ['https://github.com', 'Hello World'],
        type: [String]
    })
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    text!: string;

    @ApiProperty({ 
        description: 'QR code width in pixels',
        default: 300,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(100)
    @Max(1000)
    width?: number = 300;

    @ApiProperty({ 
        description: 'Error correction level',
        enum: QRErrorCorrection,
        default: QRErrorCorrection.MEDIUM,
        required: false
    })
    @IsOptional()
    @IsEnum(QRErrorCorrection)
    errorCorrection?: QRErrorCorrection = QRErrorCorrection.MEDIUM;

    @ApiProperty({ 
        description: 'Output format',
        enum: QRFormat,
        default: QRFormat.PNG,
        required: false
    })
    @IsOptional()
    @IsEnum(QRFormat)
    format?: QRFormat = QRFormat.PNG;

    @ApiProperty({ 
        description: 'Margin (quiet zone)',
        default: 4,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    margin?: number = 4;

    @ApiProperty({ 
        description: 'Dark color (hex)',
        default: '#000000',
        required: false
    })
    @IsOptional()
    @IsString()
    colorDark?: string = '#000000';

    @ApiProperty({ 
        description: 'Light color (hex)',
        default: '#FFFFFF',
        required: false
    })
    @IsOptional()
    @IsString()
    colorLight?: string = '#FFFFFF';
}

export class QRGeneratorResponseDto {
    @ApiProperty({ description: 'Base64 encoded image data' })
    qrCode!: string;

    @ApiProperty({ description: 'MIME type of the image' })
    mimeType!: string;

    @ApiProperty({ description: 'Format of the QR code' })
    format!: string;

    @ApiProperty({ description: 'Size in bytes' })
    size!: number;

    @ApiProperty({ description: 'QR code metadata' })
    metadata!: {
        text: string;
        width: number;
        errorCorrection: string;
        timestamp: string;
    };
}