import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { IMailer } from "../../core/ports/mailer.interface";
import { ISecurity } from "../../core/ports/security.interface";
import { User } from "../entities/user.entity";
import { InvalidCodeForUserRegisterError } from "../errors/invalid-code-for-user-register.error";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { ICodeRepository } from "../ports/code-repository.interface";
import { IUserRepository } from "../ports/user-repository.interface";

type Response = void;

export class RegisterUserCommand implements ICommand {
  constructor(
    public emailAddress: string,
    public name: string,
    public password: string,
    public createCode: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler
  implements ICommandHandler<RegisterUserCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly codeRepository: ICodeRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly securityService: ISecurity,
    private readonly mailer: IMailer,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<Response> {
    await this.assertCode(command.createCode);
    await this.assertUserDoesNotExist(command.emailAddress);

    await this.createUser(command);
    await this.sendConfirmationEmail(command.emailAddress);
  }

  private async assertCode(code: string): Promise<void> {
    const registerUserCode = await this.codeRepository.findRegisterUserCode();

    if (registerUserCode?.props.code !== code) {
      throw new InvalidCodeForUserRegisterError();
    }
  }

  private async assertUserDoesNotExist(emailAddress: string): Promise<void> {
    const user = await this.userRepository.findByEmailAddress(emailAddress);

    if (user) {
      throw new UserAlreadyExistsError();
    }
  }

  private async createUser(command: RegisterUserCommand): Promise<void> {
    const id = this.idGenerator.generate();
    const passwordHash = await this.securityService.hash(command.password);

    const newUser = new User({
      id,
      emailAddress: command.emailAddress,
      name: command.name,
      password: passwordHash,
    });

    await this.userRepository.createUser(newUser);
  }

  private async sendConfirmationEmail(emailAddress: string): Promise<void> {
    await this.mailer.send({
      to: emailAddress,
      subject: "Confirmation e-mail",
      body: "Welcome to the gamify community!",
    });
  }
}
