import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IMailer } from "../../core/ports/mailer.interface";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { NotAllowedUpdateDrawError } from "../errors/not-allowed-update-draw.error";
import { IDrawRepository } from "../ports/draw-repository.interace";

type Response = void;

export class CancelDrawCommand implements ICommand {
  constructor(
    public readonly drawId: string,
    public readonly user: User,
  ) {}
}

@CommandHandler(CancelDrawCommand)
export class CancelDrawCommandHandler
  implements ICommandHandler<CancelDrawCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute(command: CancelDrawCommand) {
    const draw = await this.drawRepository.findById(command.drawId);

    if (!draw) {
      throw new DrawNotFoundError();
    }

    if (draw.props.organizerId !== command.user.props.id) {
      throw new NotAllowedUpdateDrawError();
    }

    await this.drawRepository.delete(command.drawId);
  }
}
