import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as helmet from 'helmet';
import * as compression from 'compression';

import { CspParams } from './configuration/csp.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose'],
  });
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...CspParams
    }
  }))
  app.use(compression());
  // To enable CORS
  app.enableCors({
    origin: "*",
    methods: "GET,OPTIONS,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();