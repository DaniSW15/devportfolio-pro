import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from 'src/config/config/config.service';
import { AuthService } from '../../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => (req?.cookies as Record<string, string> | undefined)?.access_token ?? null,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret'),
        })
    }

    async validate(payload: { sub: string; email: string; role: string }) {
        const user = await this.authService.validateUser(payload.sub);

        if (!user) throw new UnauthorizedException();

        return user;
    }
}
