import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { SignInCommand } from "../command/sign-in";
import { AuthAPI } from "../contract";
import { Public } from "../decorators/public.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBody({ type: AuthAPI.SignIn.SwaggerBody })
  @ApiResponse({ type: AuthAPI.SignIn.SwaggerResponse })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  async handleSignIn(
    @Body(new ZodValidationPipe(AuthAPI.SignIn.schema))
    body: AuthAPI.SignIn.Request,
  ): Promise<AuthAPI.SignIn.Response> {
    return this.commandBus.execute(
      new SignInCommand(body.emailAddress, body.password),
    );
  }
}
