import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Participation } from "../entities/participation.entity";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OnlyOrganizerCanRegisterParticipantsError } from "../errors/only-organizer-can-register-participants.error";
import { ParticipantAlreadyExistError } from "../errors/participant-already-exist.error";
import { ParticipantDoesNotExistError } from "../errors/participant-does-not-exist.error";
import { IDrawRepository } from "../ports/draw-repository.interace";
import { IParticipationRepository } from "../ports/participation-repository.interface";

type Response = void;

export class RegisterParticipationCommand implements ICommand {
  constructor(
    public readonly organizerId: string,
    public readonly drawId: string,
    public readonly participantId: string,
  ) {}
}

@CommandHandler(RegisterParticipationCommand)
export class RegisterParticipationCommandHandler
  implements ICommandHandler<RegisterParticipationCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly userRepository: IUserRepository,
    private readonly participationRepository: IParticipationRepository,
  ) {}

  async execute({
    organizerId,
    drawId,
    participantId,
  }: RegisterParticipationCommand): Promise<Response> {
    await this.assertParticipationDoesNotExist(drawId, participantId);
    await this.assertDrawExistsAndUserIsOrganizer(drawId, organizerId);
    await this.assertParticipantExists(participantId);

    await this.participationRepository.create(
      new Participation({
        drawId,
        participantId,
      }),
    );
  }

  private async assertParticipationDoesNotExist(
    drawId: string,
    participantId: string,
  ): Promise<void> {
    const participation = await this.participationRepository.findOne(
      drawId,
      participantId,
    );

    if (participation) {
      throw new ParticipantAlreadyExistError();
    }
  }

  private async assertDrawExistsAndUserIsOrganizer(
    drawId: string,
    organizerId: string,
  ): Promise<void> {
    const draw = await this.drawRepository.findById(drawId);

    if (!draw) {
      throw new DrawNotFoundError();
    }

    if (!draw.isOrganizerId(organizerId)) {
      throw new OnlyOrganizerCanRegisterParticipantsError();
    }
  }

  private async assertParticipantExists(participantId: string): Promise<void> {
    const participant = await this.userRepository.findById(participantId);

    if (!participant) {
      throw new ParticipantDoesNotExistError();
    }
  }
}
