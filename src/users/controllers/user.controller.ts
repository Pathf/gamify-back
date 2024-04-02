import { Body, Controller, Delete, Param, Post, Request } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { ADMIN_ROLE, Roles, USER_ROLE } from "../../core/utils/roles.decorator";
import { DeleteAccountCommand } from "../commands/delete-account";
import { RegisterUserCommand } from "../commands/register-user";
import { UpdateAccountCommand } from "../commands/update-account";
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

  @Post("/user/:id")
  @Roles([USER_ROLE, ADMIN_ROLE])
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
  @Roles([USER_ROLE, ADMIN_ROLE])
  async handleDeleteAccount(
    @Request() request: { user: User },
  ): Promise<UserAPI.DeleteAccount.Response> {
    return this.commandBus.execute(
      new DeleteAccountCommand(request.user.props.emailAddress),
    );
  }
}
