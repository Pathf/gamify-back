import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommonModule } from "../core/common.module";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_SECURITY } from "../core/ports/security.interface";
import { InMemoryUserRepository } from "./adapters/in-memory-user-repository";
import { InMemoryUserRolesRepository } from "./adapters/in-memory-user-roles-repository";
import { DeleteAccountCommandHandler } from "./commands/delete-account";
import { RegisterUserCommandHandler } from "./commands/register-user";
import { UpdateAccountCommandHandler } from "./commands/update-account";
import { UserController } from "./controllers/user.controller";
import { I_USER_REPOSITORY } from "./ports/user-repository.interface";
import { I_USER_ROLES_REPOSITORY } from "./ports/user-roles-repository.interface";

@Module({
  imports: [CqrsModule, CommonModule],
  controllers: [UserController],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useFactory: () => {
        return new InMemoryUserRepository();
      },
    },
    {
      provide: I_USER_ROLES_REPOSITORY,
      useFactory: () => {
        return new InMemoryUserRolesRepository();
      },
    },
    {
      provide: RegisterUserCommandHandler,
      inject: [I_USER_REPOSITORY, I_ID_GENERATOR, I_SECURITY, I_MAILER],
      useFactory: (userRepository, idGenerator, securityService, mailer) => {
        return new RegisterUserCommandHandler(
          userRepository,
          idGenerator,
          securityService,
          mailer,
        );
      },
    },
    {
      provide: DeleteAccountCommandHandler,
      inject: [I_USER_REPOSITORY, I_USER_ROLES_REPOSITORY],
      useFactory: (userRepository, userRolesRepository) => {
        return new DeleteAccountCommandHandler(
          userRepository,
          userRolesRepository,
        );
      },
    },
    {
      provide: UpdateAccountCommandHandler,
      inject: [
        I_USER_REPOSITORY,
        I_USER_ROLES_REPOSITORY,
        I_SECURITY,
        I_MAILER,
      ],
      useFactory: (
        userRepository,
        userRolesRepository,
        securityService,
        mailer,
      ) => {
        return new UpdateAccountCommandHandler(
          userRepository,
          userRolesRepository,
          securityService,
          mailer,
        );
      },
    },
  ],
  exports: [I_USER_REPOSITORY, I_USER_ROLES_REPOSITORY],
})
export class UsersModule {}
