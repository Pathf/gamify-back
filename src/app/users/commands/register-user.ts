import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IIDGenerator } from '../../core/ports/id-generator.interface';
import { IMailer } from '../../core/ports/mailer.interface';
import { User } from '../entities/user.entity';
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
    private readonly mailer: IMailer,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<Response> {
    const id = this.idGenerator.generate();
    
    const newUser = new User({
      id,
      emailAddress: command.emailAddress,
      name: command.name,
      password: command.password,
    });

    this.userRepository.createUser(newUser);
  }
}
