import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth.service';

interface GithubProfile {
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID', ''),
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', ''),
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL', 'http://localhost:3000/api/auth/github/callback'),
            scope: ['user:email'],
        } as ConstructorParameters<typeof Strategy>[0]);
    }

    async validate(accessToken: string, refreshToken: string, profile: GithubProfile) {
        const email = profile.emails?.[0]?.value ?? '';
        const name = profile.displayName || email.split('@')[0];
        const avatarUrl = profile.photos?.[0]?.value ?? '';

        if (!email) {
            throw new Error('No email found from GitHub profile');
        }

        return this.authService.validateOrCreateGithubUser({
            email,
            name,
            avatarUrl,
        });
    }
}