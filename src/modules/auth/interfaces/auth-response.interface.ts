export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatarUrl?: string;
        role: string;
        createdAt: Date;
    };

}