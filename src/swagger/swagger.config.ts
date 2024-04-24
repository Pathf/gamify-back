import { createWriteStream } from "node:fs";
import { get } from "node:http";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import expressBasicAuth from "express-basic-auth";

export const SWAGGER_PATH = "/swagger";
const serverUrl = "http://localhost:3000";

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
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, (response) => {
      response.pipe(createWriteStream("swagger-static/swagger-ui-bundle.js"));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, (response) => {
      response.pipe(createWriteStream("swagger-static/swagger-ui-init.js"));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, (response) => {
      response.pipe(
        createWriteStream("swagger-static/swagger-ui-standalone-preset.js"),
      );
      console.log(
        `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui.css`, (response) => {
      response.pipe(createWriteStream("swagger-static/swagger-ui.css"));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
};
