import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SWAGGER_PATH } from "../swagger/swagger.config";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./filters/http-exception.filter";

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
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class MainModule {}
