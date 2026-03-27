import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: configService.get('cors.origin'),
    methods: configService.get('cors.methods'),
    allowedHeaders: configService.get('cors.allowedHeaders'),
    credentials: configService.get('cors.credentials'),
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

  const port = configService.get('port');

  await app.listen(process.env.PORT ?? port ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: http://localhost:${port ?? 3000}/api/docs`);
}
bootstrap();
