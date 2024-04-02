import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Draw } from "../entities/draw.entity";
import { ConditionDoesNotExistError } from "../errors/condition-does-not-exist.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OnlyOrganizerCanCancelConditionError } from "../errors/only-organizer-can-cancel-condition.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { IConditionRepository } from "../ports/condition-repositroy.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";

type Respone = void;

export class CancelConditionCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly drawId: string,
    public readonly conditionId: string,
  ) {}
}

@CommandHandler(CancelConditionCommand)
export class CancelConditionCommandHandler
  implements ICommandHandler<CancelConditionCommand, Respone>
{
  constructor(
    private readonly conditionRepository: IConditionRepository,
    private readonly userRepository: IUserRepository,
    private readonly drawRepository: IDrawRepository,
  ) {}

  async execute({
    user,
    drawId,
    conditionId,
  }: CancelConditionCommand): Promise<void> {
    await this.assertConditionExists(conditionId);
    await this.assertOrganizerExist(user);
    const draw = await this.assertDrawExists(drawId);
    await this.assertUserIsOrganizer(user, draw);

    await this.conditionRepository.deleteById(conditionId);
  }

  private async assertConditionExists(conditionId: string): Promise<void> {
    const condition = await this.conditionRepository.findById(conditionId);

    if (!condition) {
      throw new ConditionDoesNotExistError();
    }
  }

  private async assertOrganizerExist(user: User): Promise<void> {
    const organizer = await this.userRepository.findOne(user.props.id);

    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
  }
  private async assertDrawExists(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);

    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private async assertUserIsOrganizer(user: User, draw: Draw) {
    if (!draw.isOrganizer(user)) {
      throw new OnlyOrganizerCanCancelConditionError();
    }
  }
}
