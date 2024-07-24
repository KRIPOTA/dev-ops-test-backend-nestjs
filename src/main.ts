import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: /https?:\//,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
    bufferLogs: true,
  });
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ transform: true })); // глобально добавляем валидацию https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe

  // авторизация для документации
  // if (process.env.MODE != 'dev') {
  //   app.use(
  //     ['/docs', '/docs-json'],
  //     basicAuth({
  //       challenge: true,
  //       users: {},
  //     }),
  //   );
  // }

  const configSwagger = new DocumentBuilder()
    .setTitle('API для шаблонов документов')
    .setDescription('Описание API')
    .setVersion('1.0')
    .build();

  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);

  const optionsSwagger: SwaggerCustomOptions = {
    swaggerOptions: {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'My API Docs',
    },
  };

  SwaggerModule.setup('docs', app, documentSwagger, optionsSwagger);
  await app.listen(3000);
}
bootstrap();
