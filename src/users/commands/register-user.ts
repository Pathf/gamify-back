import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IIDGenerator } from '../../core/ports/id-generator.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { ISecurity } from '../../core/ports/security.interface';
import { User } from '../entities/user.entity';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { IUserRepository } from '../ports/user-repository.interface';

type Response = void;

export class RegisterUserCommand implements ICommand {
  constructor(
    public emailAddress: string,
    public name: string,
    public password: string,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<RegisterUserCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly securityService: ISecurity,
    private readonly mailer: IMailer,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<Response> {
    const userExist = await this.userRepository.findByEmailAddress(
      command.emailAddress,
    );

    if (userExist) {
      throw new UserAlreadyExistsError();
    }

    await this.createUser(command);
    await this.sendConfirmationEmail(command.emailAddress);
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
      subject: 'Confirmation e-mail',
      body: 'Welcome to the gamify community!',
    });
  }
}
