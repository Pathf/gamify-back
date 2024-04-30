import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../entities/user.entity";
import { NotAllowedDeleteAccountError } from "../errors/not-allowed-delete-account.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { IUserRepository } from "../ports/user-repository.interface";

type Response = void;

export class DeleteAccountCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly isAdmin: boolean,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler
  implements ICommandHandler<DeleteAccountCommand, Response>
{
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute({
    user,
    isAdmin,
    userId,
  }: DeleteAccountCommand): Promise<void> {
    const userAtDeleted = await this.assertUserExists(userId);
    await this.assertUserIsAllowedToDeleteAccount(user, userAtDeleted, isAdmin);

    await this.userRepository.delete(userAtDeleted);
  }

  private async assertUserExists(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  private async assertUserIsAllowedToDeleteAccount(
    user: User,
    accountUser: User,
    isAdmin: boolean,
  ) {
    if (!isAdmin && !user.isSame(accountUser)) {
      throw new NotAllowedDeleteAccountError();
    }
  }
}
