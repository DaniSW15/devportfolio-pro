# DevPortfolio Pro — Backend API

A robust REST API built with **NestJS** that powers a developer portfolio platform with an integrated suite of developer tools, JWT authentication, API key management, billing via Stripe, real-time WebSockets, and Redis-backed rate limiting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 + TypeScript |
| Database | PostgreSQL 15 + TypeORM |
| Cache / Queue | Redis 7 + Bull |
| Auth | JWT (access + refresh tokens) + API Keys |
| Billing | Stripe |
| Real-time | Socket.IO (WebSockets) |
| Validation | class-validator + Joi |
| Docs | Swagger / OpenAPI (`/api/docs`) |
| Containerization | Docker + Docker Compose |

---

## Modules

### Authentication (`/api/auth`)
- Register / Login with JWT (access & refresh tokens)
- Token blacklisting on logout
- API key generation and validation
- Passport JWT strategy

### Developer Tools (`/api/devtools`)
| Tool | Description |
|---|---|
| JSON Formatter | Format and validate JSON payloads |
| JWT Decoder | Decode and inspect JWT tokens |
| QR Generator | Generate QR codes from any string |
| Password Generator | Secure random password generation |
| API Tester | Make HTTP requests from the backend |
| Snippet Manager | Save and retrieve code snippets |
| Color Palette | Generate and manage color palettes |
| Base64 Tool | Encode / decode Base64 strings |
| UUID Generator | Generate v4 UUIDs |
| Timestamp Converter | Convert between Unix timestamps and human-readable dates |

### Billing (`/api/billing`)
- Stripe integration for subscription management
- Webhook handling

### Rate Limiting
- Redis-backed throttling per user/plan
- Per-tool rate limits (free vs premium tiers)

### WebSockets
- Real-time events via Socket.IO with JWT authentication guard

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL 15
- Redis 7
- (Optional) Docker & Docker Compose

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=devtools_hub

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@devtools-hub.com

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# CORS
CORS_ORIGIN=http://localhost:3001
```

### Run the App

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### Database Migrations

```bash
# Generate a new migration
npm run migration:generate -- -n MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

---

## Docker

```bash
docker-compose up
```

The compose file starts `postgres`, `redis`, the NestJS `api`, and an `nginx` reverse proxy.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

All endpoints live under the `/api` global prefix.

---

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

---

## Project Structure

```
src/
├── config/           # App configuration, TypeORM config, env validation
├── modules/
│   ├── auth/         # Authentication, JWT, API keys
│   ├── billing/      # Stripe integration
│   ├── rate-limit/   # Redis-backed rate limiting
│   ├── tools/        # All developer tools modules
│   └── websocket/    # Real-time WebSocket gateway
└── shared/
    └── database/     # TypeORM database module
```

---

## License

UNLICENSED — Private project.
