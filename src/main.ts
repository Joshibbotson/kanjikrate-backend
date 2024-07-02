import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  const serverPort = process.env.SERVER_PORT || 3000;
  const serverHost = process.env.SERVER_HOST || 'localhost';
  const serverUrl = `http://${serverHost}:${serverPort}`;

  const config = new DocumentBuilder()
    .setTitle('Kanji Krate')
    .setDescription('Kanji Krate backend')
    .setVersion('1.0')
    .addServer(serverUrl)
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
