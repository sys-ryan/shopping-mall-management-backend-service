import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const prefix = "/api/v1";

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const docsConfig = new DocumentBuilder()
    .setTitle("Shopping mall management backend Service")
    .setDescription("제품 쇼핑몰 관리 페이지 Backend 서비스")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.listen(3000);

  console.log(`server is running on http://localhost:${PORT}${prefix}`);
  console.log(`api docs: http://localhost:${PORT}${prefix}/docs`);
}
bootstrap();
