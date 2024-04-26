import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../users/entities/user.entity";
import { Draw } from "../entities/draw.entity";
import { DrawDoesNotRunError } from "../errors/draw-does-not-run.error";
import { DrawIsAlreadyOverError } from "../errors/draw-is-already-over.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { NotAllowedUpdateDrawError } from "../errors/not-allowed-update-draw.error";
import { IChainedDrawRepository } from "../ports/chained-draw-repository.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

type Response = void;

export class CloseDrawCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly drawId: string,
  ) {}
}

@CommandHandler(CloseDrawCommand)
export class CloseDrawCommandHandler
  implements ICommandHandler<CloseDrawCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly chainedDrawRepository: IChainedDrawRepository,
  ) {}

  async execute({ user, drawId }: CloseDrawCommand): Promise<Response> {
    const draw = await this.assertDrawExist(drawId);
    this.assertDrawDoesNotFinish(draw);
    this.assertUserIsOrganizer(user, draw);
    await this.assertDrawIsRun(drawId);

    draw.update({ isFinish: true });

    await this.drawRepository.update(draw);
  }

  private async assertDrawExist(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private assertDrawDoesNotFinish(draw: Draw): void {
    if (draw.isFinish()) {
      throw new DrawIsAlreadyOverError();
    }
  }

  private assertUserIsOrganizer(user: User, draw: Draw): void {
    if (!draw.isOrganizer(user)) {
      throw new NotAllowedUpdateDrawError();
    }
  }

  private async assertDrawIsRun(drawId: string): Promise<void> {
    const isDrawRun = await this.chainedDrawRepository.isDrawRun(drawId);
    if (!isDrawRun) {
      throw new DrawDoesNotRunError();
    }
  }
}
