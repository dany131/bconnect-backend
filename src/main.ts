import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { SwaggerModule } from "@nestjs/swagger";
import { createDocument } from "./swagger/swagger";
import { ConfigService } from "@nestjs/config";


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");
  const version = configService.get<string>("VERSION");

  app.setGlobalPrefix(`api/${version}`);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());
  SwaggerModule.setup("api/docs", app, createDocument(app));
  await app.listen(port);
}

bootstrap();
