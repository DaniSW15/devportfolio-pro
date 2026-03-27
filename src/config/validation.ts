import * as Joi from 'joi';

export const validate = (config: Record<string, any>) => {
    const schema = Joi.object({
        nodeEnv: Joi.string()
            .valid('development', 'production', 'test', 'staging')
            .default('development'),
        port: Joi.number().default(3000),
        appName: Joi.string().default('DevTools Hub'),
        appUrl: Joi.string().uri().default('http://localhost:3000'),

        database: Joi.object({
            host: Joi.string().default('localhost'),
            port: Joi.number().default(5432),
            username: Joi.string().default('postgres'),
            password: Joi.string().default('postgres'),
            database: Joi.string().default('devtools_hub'),
        }),

        redis: Joi.object({
            host: Joi.string().default('localhost'),
            port: Joi.number().default(6379),
            password: Joi.string().optional().allow(''),
        }),

        jwt: Joi.object({
            secret: Joi.string().required(),
            refreshSecret: Joi.string().required(),
            expiresIn: Joi.string().default('1d'),
            refreshExpiresIn: Joi.string().default('7d'),
        }),

        email: Joi.object({
            from: Joi.string().email().default('noreply@devtools-hub.com'),
            resendApiKey: Joi.string().optional(),
        }),

        github: Joi.object({
            clientId: Joi.string().optional(),
            clientSecret: Joi.string().optional(),
        }),

        throttle: Joi.object({
            ttl: Joi.number().default(60),
            limit: Joi.number().default(100),
        }),

        tools: Joi.object({
            maxPayloadSize: Joi.string().default('10mb'),
            rateLimits: Joi.object().pattern(
                Joi.string(),
                Joi.object({
                    free: Joi.number().required(),
                    premium: Joi.number().required(),
                })
            ).default({
                'api-tester': { free: 50, premium: 500 },
                'jwt-decoder': { free: 200, premium: 2000 },
                'qr-generator': { free: 100, premium: 1000 },
                'json-formatter': { free: 150, premium: 1500 },
                'password-generator': { free: 300, premium: 3000 },
            }),
        }),

        features: Joi.object({
            websocketEnabled: Joi.boolean().default(false),
            premiumEnabled: Joi.boolean().default(false),
            docsEnabled: Joi.boolean().default(true),
        }),

        cors: Joi.object({
            allowedOrigins: Joi.array().items(Joi.string()).default(['http://localhost:3000']),
            credentials: Joi.boolean().default(true),
        }),
    });

    const { error, value } = schema.validate(config, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    });

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
};