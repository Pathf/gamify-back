import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { User } from "../../users/entities/user.entity";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Condition } from "../entities/condition.entity";
import { Draw } from "../entities/draw.entity";
import { ConditionAlreadyExistsError } from "../errors/condition-already-exists.error";
import { DonorDoesNotExistError } from "../errors/donor-does-not-exist.error";
import { DonorParticipationDoesNotExistInDrawError } from "../errors/donor-participation-does-not-exist-in-draw.error";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OnlyOrganizerCanRegisterConditionError } from "../errors/only-organizer-can-register-condition.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { RecieverDoesNotExistError } from "../errors/reciever-does-not-exist.error";
import { RecieverParticipationDoesNotExistInDrawError } from "../errors/reciever-participation-does-not-exist-in-draw.error";
import { IConditionRepository } from "../ports/condition-repositroy.interface";
import { IDrawRepository } from "../ports/draw-repository.interace";
import { IParticipationRepository } from "../ports/participation-repository.interface";

type Response = void;

export class RegisterConditionCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly drawId: string,
    public readonly donorId: string,
    public readonly receiverId: string,
    public readonly isViceVersa: boolean,
  ) {}
}

@CommandHandler(RegisterConditionCommand)
export class RegisterConditionCommandHandler
  implements ICommandHandler<RegisterConditionCommand, Response>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly drawRepository: IDrawRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly conditionRepository: IConditionRepository,
  ) {}

  async execute(command: RegisterConditionCommand): Promise<Response> {
    const { drawId, user, donorId, receiverId, isViceVersa } = command;

    const draw = await this.assertDrawExist(drawId);
    await this.assertOrganizerExist(user);
    this.assertUserIsOrganizer(draw, user);
    await this.assertDonorExist(donorId);
    await this.assertDonorParticipationInDrawExist(drawId, donorId);
    await this.assertRecieverExist(command.receiverId);
    await this.assertRecieverParticipationInDrawExist(drawId, receiverId);

    const condition = new Condition({
      drawId,
      donorId,
      receiverId,
      isViceVersa,
    });

    await this.assertConditionDoesNotExist(condition);

    await this.conditionRepository.create(condition);
  }

  private async assertDrawExist(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findOne(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }

    return draw;
  }

  private async assertOrganizerExist(user: User): Promise<void> {
    const organizer = await this.userRepository.findOne(user.props.id);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
  }

  private assertUserIsOrganizer(draw: Draw, user: User): void {
    if (draw.props.organizerId !== user.props.id) {
      throw new OnlyOrganizerCanRegisterConditionError();
    }
  }

  private async assertDonorExist(donorId: string): Promise<void> {
    const donorParticipant = await this.userRepository.findOne(donorId);
    if (!donorParticipant) {
      throw new DonorDoesNotExistError();
    }
  }

  private async assertDonorParticipationInDrawExist(
    drawId: string,
    donorId: string,
  ) {
    const donorParticipation = await this.participationRepository.findOne(
      drawId,
      donorId,
    );

    if (!donorParticipation) {
      throw new DonorParticipationDoesNotExistInDrawError();
    }
  }

  private async assertRecieverExist(recieverId: string): Promise<void> {
    const recieverParticipant = await this.userRepository.findOne(recieverId);
    if (!recieverParticipant) {
      throw new RecieverDoesNotExistError();
    }
  }

  private async assertRecieverParticipationInDrawExist(
    drawId: string,
    recieverId: string,
  ) {
    const recieverParticipation = await this.participationRepository.findOne(
      drawId,
      recieverId,
    );

    if (!recieverParticipation) {
      throw new RecieverParticipationDoesNotExistInDrawError();
    }
  }

  private async assertConditionDoesNotExist(condition: Condition) {
    const existingCondition = await this.conditionRepository.find(condition);
    if (existingCondition) {
      throw new ConditionAlreadyExistsError();
    }
  }
}
