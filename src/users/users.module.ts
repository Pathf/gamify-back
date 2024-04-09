import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "../core/common.module";
import { I_ID_GENERATOR } from "../core/ports/id-generator.interface";
import { I_MAILER } from "../core/ports/mailer.interface";
import { I_SECURITY } from "../core/ports/security.interface";
import { PostgresUser } from "./adapters/postgres/postgres-user";
import { PostgresUserRepository } from "./adapters/postgres/postgres-user-repository";
import { DeleteAccountCommandHandler } from "./commands/delete-account";
import { RegisterUserCommandHandler } from "./commands/register-user";
import { UpdateAccountCommandHandler } from "./commands/update-account";
import { UserController } from "./controllers/user.controller";
import { I_USER_REPOSITORY } from "./ports/user-repository.interface";
import { GetUserByIdQueryHandler } from "./queries/get-user-by-id";
import { GetUsersQueryHandler } from "./queries/get-users";

@Module({
  imports: [CqrsModule, CommonModule, TypeOrmModule.forFeature([PostgresUser])],
  controllers: [UserController],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useClass: PostgresUserRepository,
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
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => {
        return new DeleteAccountCommandHandler(userRepository);
      },
    },
    {
      provide: UpdateAccountCommandHandler,
      inject: [I_USER_REPOSITORY, I_SECURITY, I_MAILER],
      useFactory: (userRepository, securityService, mailer) => {
        return new UpdateAccountCommandHandler(
          userRepository,
          securityService,
          mailer,
        );
      },
    },
    {
      provide: GetUsersQueryHandler,
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => {
        return new GetUsersQueryHandler(userRepository);
      },
    },

    {
      provide: GetUserByIdQueryHandler,
      inject: [I_USER_REPOSITORY],
      useFactory: (userRepository) => {
        return new GetUserByIdQueryHandler(userRepository);
      },
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UsersModule {}
