import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SWAGGER_PATH } from "../swagger/swagger.config";
import { AppModule } from "./app.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "swagger-static"),
      serveRoot: `/${SWAGGER_PATH}`,
    }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
