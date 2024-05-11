import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { GoogleRegisterUserCommand } from "../command/google-register-user";
import { GoogleSignInCommand } from "../command/google-sign-in";
import { AuthAPI } from "../contract";
import { Public } from "../decorators/public.decorator";
import { GoogleUserDto } from "../dto/google-user.dto";
import { RegisterUserGoogleAuthGuard } from "../guards-strategy/google/register-user-google-auth.guard";

@ApiTags("auth")
@Controller("auth/google")
export class GoogleAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard("google"))
  async handleAuth() {}

  @Public()
  @Get("redirect")
  @UseGuards(AuthGuard("google"))
  async handleAuthRedirect(
    @Request() request: {
      user: GoogleUserDto;
    },
  ): Promise<AuthAPI.SignIn.Response> {
    return this.commandBus.execute(new GoogleSignInCommand(request.user.email));
  }

  @Public()
  @Get("register")
  @UseGuards(RegisterUserGoogleAuthGuard)
  async handleRegister() {}

  @Public()
  @Get("register/redirect")
  @UseGuards(AuthGuard("googleRegister"))
  async handleRegisterRedirect(
    @Request() {
      user,
    }: {
      user: GoogleUserDto;
    },
  ): Promise<AuthAPI.SignIn.Response> {
    return this.commandBus.execute(
      new GoogleRegisterUserCommand(
        user.email,
        `${user.firstName} ${user.lastName}`,
      ),
    );
  }
}
