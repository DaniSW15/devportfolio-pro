export interface Config {
    nodeEnv: string;
    port: number;
    appName: string;
    appUrl: string;

    database: DatabaseConfig;
    redis: RedisConfig;
    jwt: JwtConfig;
    email: EmailConfig;
    github: GithubConfig;
    throttle: ThrottleConfig;
    tools: ToolsConfig;
    features: FeaturesConfig;
    cors: CorsConfig;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export interface JwtConfig {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
}

export interface EmailConfig {
    from: string;
    resendApiKey?: string;
}

export interface GithubConfig {
    clientId?: string;
    clientSecret?: string;
}

export interface ThrottleConfig {
    ttl: number;
    limit: number;
}

export interface ToolsConfig {
    maxPayloadSize: string;
    rateLimits: {
        [key: string]: {
            free: number;
            premium: number;
        };
    };
}

export interface FeaturesConfig {
    websocketEnabled: boolean;
    premiumEnabled: boolean;
    docsEnabled: boolean;
}

export interface CorsConfig {
    allowedOrigins: string[];
    credentials: boolean;
}