import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../users/entities/user.entity";
import { UserNotFoundError } from "../../users/errors/user-not-found.error";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { IJwtService } from "../ports/jwt-service.interface";

type Response = {
  access_token: string;
  id: string;
  name: string;
  emailAddress: string;
};

export class GoogleSignInCommand implements ICommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(GoogleSignInCommand)
export class GoogleSignInCommandHandler
  implements ICommandHandler<GoogleSignInCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute({ email }: GoogleSignInCommand): Promise<Response> {
    const user = await this.assertUserExists(email);

    const access_token = await this.buildAccessToken(user);

    return {
      access_token,
      id: user.props.id,
      name: user.props.name,
      emailAddress: user.props.emailAddress,
    };
  }

  private async assertUserExists(email: string): Promise<User> {
    const user = await this.userRepository.findByEmailAddress(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  private async buildAccessToken(user: User): Promise<string> {
    const payload = { sub: user.props.id, name: user.props.name };
    return await this.jwtService.signAsync(payload);
  }
}
