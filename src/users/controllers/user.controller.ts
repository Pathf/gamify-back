import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { RegisterUserCommand } from "../commands/register-user";
import { UserAPI } from "../contract";

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
}
