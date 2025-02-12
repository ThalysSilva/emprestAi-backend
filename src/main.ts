import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'authorization',
    )
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedUrls = process.env.ALLOWED_URLS?.split(',') ?? [];

  app.enableCors({
    origin: [...allowedUrls],
    methods: 'POST,GET',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORTA = process.env.PORT || 3000;
  await app.listen(PORTA);

  logger.log(`Aplicação rodando na porta ${PORTA} !!`);
}

bootstrap();
