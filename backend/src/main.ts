import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4200', 'http://localhost:8080'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const { default: helmet } = await import('helmet');
  const { default: compression } = await import('compression');
  app.use(helmet());
  app.use(compression());

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🚀 Habit Tracker Backend запущен на http://${host}:${port}`);
}
bootstrap();
