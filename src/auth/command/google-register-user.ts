import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { IMailer } from "../../core/ports/mailer.interface";
import { ISecurity } from "../../core/ports/security.interface";
import { User } from "../../users/entities/user.entity";
import { UserAlreadyExistsError } from "../../users/errors/user-already-exists.error";
import { IUserRepository } from "../../users/ports/user-repository.interface";

type Response = void;

export class GoogleRegisterUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {}
}

@CommandHandler(GoogleRegisterUserCommand)
export class GoogleRegisterUserCommandHandler
  implements ICommandHandler<GoogleRegisterUserCommand, Response>
{
  constructor(
    private readonly securityService: ISecurity,
    private readonly idGenerator: IIDGenerator,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ email, name }: GoogleRegisterUserCommand): Promise<Response> {
    await this.assertUserDoesNotExist(email);

    await this.registerUser(email, name);

    await this.sendConfirmationEmail(email);
  }

  private async assertUserDoesNotExist(email: string) {
    const user = await this.userRepository.findByEmailAddress(email);

    if (user) {
      throw new UserAlreadyExistsError();
    }
  }

  private async registerUser(email: string, name: string) {
    const id = this.idGenerator.generate();
    const randomPassword = await this.securityService.generatePassword(25);
    const hashedPassword = await this.securityService.hash(randomPassword);

    const newUser = new User({
      id: id,
      emailAddress: email,
      name,
      password: hashedPassword,
    });

    await this.userRepository.createUser(newUser);
  }

  private async sendConfirmationEmail(email: string) {
    await this.mailer.send({
      to: email,
      subject: "Confirmation e-mail",
      body: "Welcome to the gamify community!",
    });
  }
}
