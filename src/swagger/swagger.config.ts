import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

const SWAGGER_PATH = "/swagger";

export const setupSwagger = (app: INestApplication) => {
  const swaggerPassword = process.env.SWAGGER_PASSWORD;

  if (process.env.ENVIRONEMENT !== "LOCAL" && swaggerPassword) {
    app.use(
      [SWAGGER_PATH, `${SWAGGER_PATH}-json`],
      expressBasicAuth({
        challenge: true,
        users: {
          admin: swaggerPassword,
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle("Gamify API")
    .setDescription("L'ensemble des routes de l'API Gamify")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("draws")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
};
