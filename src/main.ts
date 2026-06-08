import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Mikura server running on http://localhost:${port}`);
}

bootstrap();
