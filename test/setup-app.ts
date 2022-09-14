import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupApp = (app: any) => {
  const PORT = process.env.PORT || 3000;
  const prefix = "/api/v1";

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
};
