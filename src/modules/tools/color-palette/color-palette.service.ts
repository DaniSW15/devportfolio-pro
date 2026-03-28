// src/modules/tools/color-palette/color-palette.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorPaletteService {
    generatePalette(baseColor: string, type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic'): string[] {
        // Convertir hex a HSL
        const hsl = this.hexToHsl(baseColor);

        switch (type) {
            case 'monochromatic':
                return this.generateMonochromatic(hsl);
            case 'analogous':
                return this.generateAnalogous(hsl);
            case 'complementary':
                return this.generateComplementary(hsl);
            case 'triadic':
                return this.generateTriadic(hsl);
            default:
                return [baseColor];
        }
    }

    private hexToHsl(hex: string): { h: number; s: number; l: number } {
        // Convertir hex a RGB
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    private generateMonochromatic(hsl: { h: number; s: number; l: number }): string[] {
        const shades = [0.2, 0.4, 0.6, 0.8, 1];
        return shades.map(lightness =>
            this.hslToHex({ h: hsl.h, s: hsl.s, l: hsl.l * lightness })
        );
    }

    private hslToHex(hsl: { h: number; s: number; l: number }): string {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = (x: number) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    private generateAnalogous(hsl: { h: number; s: number; l: number }): string[] {
        const angles = [-30, -15, 0, 15, 30];
        return angles.map(angle =>
            this.hslToHex({ h: (hsl.h + angle + 360) % 360, s: hsl.s, l: hsl.l })
        );
    }

    private generateComplementary(hsl: { h: number; s: number; l: number }): string[] {
        return [
            this.hslToHex({ h: hsl.h, s: hsl.s, l: hsl.l }),
            this.hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    private generateTriadic(hsl: { h: number; s: number; l: number }): string[] {
        return [
            this.hslToHex({ h: hsl.h, s: hsl.s, l: hsl.l }),
            this.hslToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }),
            this.hslToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }
}