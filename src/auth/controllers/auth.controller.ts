import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ZodValidationPipe } from "../../core/pipes/zod-validation.pipe";
import { GoogleSignInCommand } from "../command/google-sign-in";
import { SignInCommand } from "../command/sign-in";
import { AuthAPI } from "../contract";
import { Public } from "../decorators/public.decorator";
import { GoogleUserDto } from "../dto/google-user.dto";

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

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() _: any) {}

  @Public()
  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(
    @Request() request: {
      user: GoogleUserDto;
    },
  ): Promise<AuthAPI.SignIn.Response> {
    return this.commandBus.execute(new GoogleSignInCommand(request.user.email));
  }
}
