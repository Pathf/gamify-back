import { Module } from "@nestjs/common";

import { APP_GUARD, Reflector } from "@nestjs/core";
import { DrawsModule } from "../draws/draws.module";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { I_USER_ROLES_REPOSITORY } from "../users/ports/user-roles-repository.interface";
import { AuthService } from "../users/services/authenticator";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthGuard } from "./auth.guard";
import { CommonModule } from "./common.module";

@Module({
  imports: [
    // bddmodule ou config
    CommonModule,
    UsersModule,
    DrawsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: AuthService,
      inject: [I_USER_REPOSITORY, I_USER_ROLES_REPOSITORY],
      useFactory: (userRepository, userRolesRepository) => {
        return new AuthService(userRepository, userRolesRepository);
      },
    },
    {
      provide: APP_GUARD,
      inject: [AuthService, Reflector],
      useFactory(authenticator, reflector) {
        return new AuthGuard(authenticator, reflector);
      },
    },
  ],
})
export class AppModule {}
