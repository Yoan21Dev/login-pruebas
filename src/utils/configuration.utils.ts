import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { Configuration } from '@core/types/configuration.types';
import { AppModule } from 'src/app.module';

export function getConfiguration(configService: ConfigService): Configuration {
  return {
    port: configService.get('LOCAL_PORT'),
    hostname: configService.get('HOST'),
    baseUrl: configService.get('BASE_URL'),
  };
}

export function configureOpenApi(
  app: NestExpressApplication,
  configuration: Configuration
): { url: string } {
  const openApiUrl = 'doc';
  const config = new DocumentBuilder()
    .addBearerAuth({
      flows: {
        password: {
          tokenUrl: `${configuration.baseUrl}/auth/login`,
          scopes: {},
          authorizationUrl: `${configuration.baseUrl}/auth/login`,
        },
      },
      type: 'oauth2',
      description:
        'it is not necessary to send the client_id or the client_secret',
    })
    .setTitle('Easter Island API Rest')
    .setDescription('The Easter Island API Rest description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(openApiUrl, app, document);

  return { url: openApiUrl };
}

export async function configureApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );

  return app;
}
