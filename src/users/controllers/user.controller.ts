import { Body, Controller, Delete, Post, Request } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { ADMIN_ROLE, Roles, USER_ROLE } from "../../core/utils/roles.decorator";
import { DeleteAccountCommand } from "../commands/delete-account";
import { RegisterUserCommand } from "../commands/register-user";
import { UserAPI } from "../contract";
import { User } from "../entities/user.entity";

@Controller()
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("/user")
  async handleRegisterUser(
    @Body(new ZodValidationPipe(UserAPI.RegisterUser.schema))
    body: UserAPI.RegisterUser.Request,
  ): Promise<UserAPI.RegisterUser.Response> {
    return this.commandBus.execute(
      new RegisterUserCommand(body.emailAddress, body.name, body.password),
    );
  }

  @Delete("/user")
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleDeleteAccount(
    @Request() request: { user: User },
  ): Promise<UserAPI.DeleteAccount.Response> {
    return this.commandBus.execute(
      new DeleteAccountCommand(request.user.props.emailAddress),
    );
  }
}
