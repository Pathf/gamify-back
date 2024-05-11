import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../core/common.module";
import { I_SECURITY } from "../core/ports/security.interface";
import { I_CODE_REPOSITORY } from "../users/ports/code-repository.interface";
import { I_USER_REPOSITORY } from "../users/ports/user-repository.interface";
import { UsersModule } from "../users/users.module";
import { JwtService } from "./adapters/jwt-service";
import { PostgresUserRole } from "./adapters/postgres/postgres-user-roles";
import { PostgresUserRolesRepository } from "./adapters/postgres/postgres-user-roles-repository";
import { AuthGuard } from "./auth.guard";
import { GoogleSignInCommandHandler } from "./command/google-sign-in";
import { SignInCommandHandler } from "./command/sign-in";
import { AuthController } from "./controllers/auth.controller";
import { GoogleAuthController } from "./controllers/google-auth.controller";
import { GoogleRegisterStrategy } from "./guards-strategy/google/google-register.strategy";
import { GoogleStrategy } from "./guards-strategy/google/google.strategy";
import { RegisterUserGoogleAuthGuard } from "./guards-strategy/google/register-user-google-auth.guard";
import { I_JWT_SERVICE } from "./ports/jwt-service.interface";
import { I_USER_ROLES_REPOSITORY } from "./ports/user-roles-repository.interface";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([PostgresUserRole]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "3600s" },
    }),
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [
    {
      provide: I_JWT_SERVICE,
      useClass: JwtService,
    },
    {
      provide: I_USER_ROLES_REPOSITORY,
      useClass: PostgresUserRolesRepository,
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
    GoogleStrategy,
    GoogleRegisterStrategy,
    {
      provide: RegisterUserGoogleAuthGuard,
      inject: [I_CODE_REPOSITORY],
      useFactory: (codeRepository) =>
        new RegisterUserGoogleAuthGuard(codeRepository),
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
    {
      provide: GoogleSignInCommandHandler,
      inject: [I_USER_REPOSITORY, I_JWT_SERVICE],
      useFactory: (userRepository, jwtService) => {
        return new GoogleSignInCommandHandler(userRepository, jwtService);
      },
    },
  ],
  exports: [],
})
export class AuthModule {}
