import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { CommonModule } from "../core/common.module";
import { I_SECURITY } from "../core/ports/security.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { InMemoryUserRolesRepository } from "./adapters/in-memory-user-roles-repository";
import { JwtService } from "./adapters/jwt-service";
import { AuthGuard } from "./auth.guard";
import { SignInCommandHandler } from "./command/sign-in";
import { AuthController } from "./controllers/auth.controller";
import { I_JWT_SERVICE } from "./ports/jwt-service.interface";
import { I_USER_ROLES_REPOSITORY } from "./ports/user-roles-repository.interface";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    CqrsModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "3600s" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: I_JWT_SERVICE,
      useClass: JwtService,
    },
    {
      provide: I_USER_ROLES_REPOSITORY,
      useFactory: () => new InMemoryUserRolesRepository(),
    },
    {
      provide: APP_GUARD,
      inject: [
        I_JWT_SERVICE,
        I_USER_REPOSITORY,
        I_USER_ROLES_REPOSITORY,
        Reflector,
      ],
      useFactory(jwtService, userRepository, userRolesRepository, reflector) {
        return new AuthGuard(
          jwtService,
          userRepository,
          userRolesRepository,
          reflector,
        );
      },
    },
    {
      provide: SignInCommandHandler,
      inject: [I_USER_REPOSITORY, I_JWT_SERVICE, I_SECURITY],
      useFactory: (userRepository, jwtService, securityService) => {
        return new SignInCommandHandler(
          userRepository,
          jwtService,
          securityService,
        );
      },
    },
  ],
  exports: [],
})
export class AuthModule {}
