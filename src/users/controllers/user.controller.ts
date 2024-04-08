import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Public } from "../../auth/public.decorator";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { DeleteAccountCommand } from "../commands/delete-account";
import { RegisterUserCommand } from "../commands/register-user";
import { UpdateAccountCommand } from "../commands/update-account";
import { UserAPI } from "../contract";
import { User } from "../entities/user.entity";
import { GetUsersQuery } from "../queries/get-users";

@Controller()
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get("/users")
  async handleGetUsers(): Promise<UserAPI.GetUsers.Response> {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @Public()
  @Post("/user")
  async handleRegisterUser(
    @Body(new ZodValidationPipe(UserAPI.RegisterUser.schema))
    body: UserAPI.RegisterUser.Request,
  ): Promise<UserAPI.RegisterUser.Response> {
    return this.commandBus.execute(
      new RegisterUserCommand(body.emailAddress, body.name, body.password),
    );
  }

  @Post("/user/:id")
  async handleUpdateAccount(
    @Param("id") userId: string,
    @Request() request: { user: User },
    @Body(new ZodValidationPipe(UserAPI.UpdateAccount.schema))
    body: UserAPI.UpdateAccount.Request,
  ): Promise<UserAPI.UpdateAccount.Response> {
    return this.commandBus.execute(
      new UpdateAccountCommand(
        request.user,
        userId,
        body.emailAddress,
        body.password,
        body.name,
      ),
    );
  }

  @Delete("/user")
  async handleDeleteAccount(
    @Request() request: { user: User },
  ): Promise<UserAPI.DeleteAccount.Response> {
    return this.commandBus.execute(
      new DeleteAccountCommand(request.user.props.emailAddress),
    );
  }
}
