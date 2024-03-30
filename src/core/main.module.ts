import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppModule } from "./app.module";

@Module({
  imports: [AppModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class MainModule {}
