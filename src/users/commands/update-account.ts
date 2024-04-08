import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IMailer } from "../../core/ports/mailer.interface";
import { ISecurity } from "../../core/ports/security.interface";
import { User } from "../entities/user.entity";
import { NotAllowedUpdateUserError } from "../errors/not-allowed-update-user.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { IUserRepository } from "../ports/user-repository.interface";

type Response = void;

export class UpdateAccountCommand implements ICommand {
  constructor(
    public user: User,
    public userId: string,
    public emailAddress: string,
    public password: string,
    public name: string,
  ) {}
}

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler
  implements ICommandHandler<UpdateAccountCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly securityService: ISecurity,
    private readonly mailer: IMailer,
  ) {}

  async execute({
    user,
    userId,
    emailAddress,
    password,
    name,
  }: UpdateAccountCommand): Promise<Response> {
    const userAtUpdate = await this.userRepository.findOne(userId);

    if (!userAtUpdate) {
      throw new UserNotFoundError();
    }

    if (user.isSameUser(userId) === false) {
      throw new NotAllowedUpdateUserError();
    }

    userAtUpdate.update({
      emailAddress,
      password: await this.securityService.hash(password),
      name,
    });

    await this.userRepository.update(userAtUpdate);
  }
}
