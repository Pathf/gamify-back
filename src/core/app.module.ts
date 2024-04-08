import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DrawsModule } from "../draws/draws.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";

import { CommonModule } from "./common.module";

@Module({
  imports: [
    // bddmodule ou config
    CommonModule,
    AuthModule,
    UsersModule,
    DrawsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
