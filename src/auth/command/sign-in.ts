import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ISecurity } from "../../core/ports/security.interface";
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

export class SignInCommand implements ICommand {
  constructor(
    public readonly emailAddress: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(SignInCommand)
export class SignInCommandHandler
  implements ICommandHandler<SignInCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly securityService: ISecurity,
  ) {}

  async execute({ emailAddress, password }: SignInCommand): Promise<Response> {
    const user = await this.assertUserExists(emailAddress);
    await this.assertPasswordIsValid(password, user);

    const access_token = await this.generateToken(user);

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

  private async assertPasswordIsValid(password: string, user: User) {
    const isValid = await this.securityService.compare(
      password,
      user.props.password,
    );
    if (!isValid) {
      throw new UserNotFoundError();
    }
  }

  private async generateToken(user: User) {
    const payload = { sub: user.props.id, name: user.props.name };
    return this.jwtService.signAsync(payload);
  }
}
