import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: configService.get<string[]>('cors.allowedOrigins', ['http://localhost:3000']),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('DevPortfolio Pro API')
    .setDescription('API for DevPortfolio Pro - Portfolio and DevTools Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('profile', 'User profile management')
    .addTag('projects', 'Projects CRUD')
    .addTag('blog', 'Blog articles')
    .addTag('devtools', 'Developer tools')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT');

  await app.listen(process.env.PORT ?? port ?? 3001);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: http://localhost:${port ?? 3001}/api/docs`);
}
void bootstrap();
