import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      resave:false,
      saveUninitialized:false,
      cookie:{
        httpOnly:true,
        secure:config.get('NODE_ENV') === 'production',
        sameSite:'lax',
        maxAge:1800000
      }
    })
  );
  app.enableCors({
    origin:'http://localhost:5173',
    credentials:true
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
