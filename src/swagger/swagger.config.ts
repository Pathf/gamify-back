import { createWriteStream } from "node:fs";
import { get } from "node:http";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

export const SWAGGER_PATH = "swagger";
const STATIC_PATH = "src/swagger-static";
const HOST = "http://localhost:3000";

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

  if (process.env.ENVIRONEMENT === "LOCAL") {
    get(`${HOST}/${SWAGGER_PATH}/swagger-ui-bundle.js`, (response) => {
      response.pipe(createWriteStream(`${STATIC_PATH}/swagger-ui-bundle.js`));
    });

    get(`${HOST}/${SWAGGER_PATH}/swagger-ui-init.js`, (response) => {
      response.pipe(createWriteStream(`${STATIC_PATH}/swagger-ui-init.js`));
    });

    get(
      `${HOST}/${SWAGGER_PATH}/swagger-ui-standalone-preset.js`,
      (response) => {
        response.pipe(
          createWriteStream(`${STATIC_PATH}/swagger-ui-standalone-preset.js`),
        );
      },
    );

    get(`${HOST}/${SWAGGER_PATH}/swagger-ui.css`, (response) => {
      response.pipe(createWriteStream(`${STATIC_PATH}/swagger-ui.css`));
    });
  }
};
