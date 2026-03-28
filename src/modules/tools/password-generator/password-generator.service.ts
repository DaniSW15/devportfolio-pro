import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordGeneratorDto, PasswordStrengthDto, PasswordGeneratorResponseDto } from './dto/password-generator.dto';
import * as crypto from 'crypto';

@Injectable()
export class PasswordGeneratorService {
    private readonly UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluye I, O
    private readonly LOWERCASE = 'abcdefghijkmnpqrstuvwxyz'; // Excluye l, o
    private readonly NUMBERS = '23456789'; // Excluye 0, 1
    private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    private readonly ALL_CHARS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    generatePassword(dto: PasswordGeneratorDto): PasswordGeneratorResponseDto {
        const {
            length = 12,
            uppercase = true,
            lowercase = true,
            numbers = true,
            symbols = true,
            excludeAmbiguous = false
        } = dto;

        // Validar que al menos un tipo está seleccionado
        if (!uppercase && !lowercase && !numbers && !symbols) {
            throw new BadRequestException('At least one character type must be selected');
        }

        let charset = '';
        if (uppercase) charset += excludeAmbiguous ? this.UPPERCASE : this.ALL_CHARS.uppercase;
        if (lowercase) charset += excludeAmbiguous ? this.LOWERCASE : this.ALL_CHARS.lowercase;
        if (numbers) charset += excludeAmbiguous ? this.NUMBERS : this.ALL_CHARS.numbers;
        if (symbols) charset += this.ALL_CHARS.symbols;

        if (charset.length === 0) {
            throw new BadRequestException('No characters available for password generation');
        }

        let password = '';
        const charsetLength = charset.length;

        // Generar contraseña usando crypto seguro
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charsetLength);
            password += charset[randomIndex];
        }

        // Asegurar que contiene al menos un carácter de cada tipo seleccionado
        password = this.ensureAllTypes(password, uppercase, lowercase, numbers, symbols, charset);

        const strength = this.calculateStrength(password);
        const entropy = this.calculateEntropy(password, charsetLength);

        return {
            password,
            strength,
            length: password.length,
            entropy: Math.round(entropy)
        };
    }

    private ensureAllTypes(
        password: string,
        uppercase: boolean,
        lowercase: boolean,
        numbers: boolean,
        symbols: boolean,
        charset: string
    ): string {
        let result = password;
        const types: any = [];

        if (uppercase) types.push({ regex: /[A-Z]/, chars: this.ALL_CHARS.uppercase });
        if (lowercase) types.push({ regex: /[a-z]/, chars: this.ALL_CHARS.lowercase });
        if (numbers) types.push({ regex: /[0-9]/, chars: this.ALL_CHARS.numbers });
        if (symbols) types.push({ regex: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/, chars: this.ALL_CHARS.symbols });

        for (const type of types) {
            if (!type.regex.test(result)) {
                const randomIndex = crypto.randomInt(0, type.chars.length);
                const replaceIndex = crypto.randomInt(0, result.length);
                result = result.substring(0, replaceIndex) + type.chars[randomIndex] + result.substring(replaceIndex + 1);
            }
        }

        return result;
    }

    private calculateStrength(password: string): PasswordStrengthDto {
        let score = 0;
        const length = password.length;

        // Longitud
        if (length >= 8) score++;
        if (length >= 12) score++;
        if (length >= 16) score++;

        // Tipos de caracteres
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        // Normalizar score (0-4)
        score = Math.min(4, Math.floor(score / 2));

        const strengths: Record<number, { label: PasswordStrengthDto['label']; color: string; description: string }> = {
            0: { label: 'Very Weak', color: '#ff4444', description: 'Too short or only one character type' },
            1: { label: 'Weak', color: '#ff8844', description: 'Short length or limited character variety' },
            2: { label: 'Medium', color: '#ffcc44', description: 'Good length with decent variety' },
            3: { label: 'Strong', color: '#88ff44', description: 'Long length with good character variety' },
            4: { label: 'Very Strong', color: '#44ff44', description: 'Excellent length and character variety' }
        };

        return {
            score,
            label: strengths[score].label,
            color: strengths[score].color,
            description: strengths[score].description
        };
    }

    private calculateEntropy(password: string, charsetSize: number): number {
        return Math.log2(Math.pow(charsetSize, password.length));
    }

    async generateMultiple(count: number, dto: PasswordGeneratorDto): Promise<PasswordGeneratorResponseDto[]> {
        if (count < 1 || count > 50) {
            throw new BadRequestException('Count must be between 1 and 50');
        }

        const passwords: PasswordGeneratorResponseDto[] = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generatePassword(dto));
        }
        return passwords;
    }

    async getStats() {
        return {
            tool: 'password-generator',
            version: '1.0.0',
            features: ['custom-length', 'character-types', 'exclude-ambiguous', 'strength-check', 'entropy-calculation'],
            defaultLength: 12,
            maxLength: 128,
            minLength: 4
        };
    }
}