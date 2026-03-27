export default () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(String(process.env.PORT), 10) || 3000,
    appName: process.env.APP_NAME || 'DevTools Hub',
    appUrl: process.env.APP_URL || 'http://localhost:3000',

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(String(process.env.DB_PORT), 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'devtools_hub',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(String(process.env.REDIS_PORT), 10) || 6379,
        password: process.env.REDIS_PASSWORD,
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    email: {
        from: process.env.EMAIL_FROM || 'noreply@devtools-hub.com',
        resendApiKey: process.env.RESEND_API_KEY,
    },

    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },

    throttle: {
        ttl: parseInt(String(process.env.THROTTLE_TTL), 10) || 60,
        limit: parseInt(String(process.env.THROTTLE_LIMIT), 10) || 100,
    },
    
    // Agregar configuración de herramientas específicas
    tools: {
        maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '10mb',
        rateLimits: {
            'api-tester': { free: 50, premium: 500 },
            'jwt-decoder': { free: 200, premium: 2000 },
            'qr-generator': { free: 100, premium: 1000 },
            'json-formatter': { free: 150, premium: 1500 },
            'password-generator': { free: 300, premium: 3000 },
        },
    },
    
    // Features flags
    features: {
        websocketEnabled: process.env.WEBSOCKET_ENABLED === 'true',
        premiumEnabled: process.env.PREMIUM_ENABLED === 'true',
        docsEnabled: process.env.DOCS_ENABLED !== 'false',
    },
    
    // CORS
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    },
});