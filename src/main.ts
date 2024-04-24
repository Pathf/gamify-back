import { NestFactory } from "@nestjs/core";
import { MainModule } from "./core/main.module";
import { setupSwagger } from "./swagger/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
