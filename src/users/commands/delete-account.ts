import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { IUserRepository } from "../ports/user-repository.interface";
import { IUserRolesRepository } from "../ports/user-roles-repository.interface";

type Response = void;

export class DeleteAccountCommand implements ICommand {
  constructor(public emailAddress: string) {}
}

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler
  implements ICommandHandler<DeleteAccountCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userRolesRepository: IUserRolesRepository,
  ) {}

  public async execute(command: DeleteAccountCommand): Promise<void> {
    const user = await this.userRepository.findByEmailAddress(
      command.emailAddress,
    );

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.userRepository.delete(user);
    await this.userRolesRepository.deleteRolesByUserId(user.props.id);
  }
}
