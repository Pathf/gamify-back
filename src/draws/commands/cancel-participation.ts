import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IUserRepository } from "../../users/ports/user-repository.interface";
import { Draw } from "../entities/draw.entity";
import { DrawNotFoundError } from "../errors/draw-not-found.error";
import { OnlyOrganizerCanCancelParticipationError } from "../errors/only-organizer-can-cancel-participation.error";
import { OrganizerDoesNotExistError } from "../errors/organizer-does-not-exist.error";
import { ParticipantDoesNotExistError } from "../errors/participant-does-not-exist.error";
import { IDrawRepository } from "../ports/draw-repository.interace";
import { IParticipationRepository } from "../ports/participation-repository.interface";

type Response = void;

export class CancelParticipationCommand implements ICommand {
  constructor(
    public readonly organizerId: string,
    public readonly drawId: string,
    public readonly participantId: string,
  ) {}
}

@CommandHandler(CancelParticipationCommand)
export class CancelParticipationCommandHandler
  implements ICommandHandler<CancelParticipationCommand, Response>
{
  constructor(
    private readonly drawRepository: IDrawRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    organizerId,
    drawId,
    participantId,
  }: CancelParticipationCommand) {
    const draw = await this.assertDrawExists(drawId);
    await this.assertParticipantExists(participantId);
    await this.assertOrganizerExists(organizerId);
    await this.assertUserIsOrganizer(organizerId, draw);

    await this.participationRepository.delete(drawId, participantId);
  }

  private async assertDrawExists(drawId: string): Promise<Draw> {
    const draw = await this.drawRepository.findById(drawId);
    if (!draw) {
      throw new DrawNotFoundError();
    }
    return draw;
  }

  private async assertParticipantExists(participantId: string) {
    const participant = await this.userRepository.findById(participantId);
    if (!participant) {
      throw new ParticipantDoesNotExistError();
    }
  }

  private async assertOrganizerExists(organizerId: string) {
    const organizer = await this.userRepository.findById(organizerId);
    if (!organizer) {
      throw new OrganizerDoesNotExistError();
    }
  }

  private async assertUserIsOrganizer(organizerId: string, draw: Draw) {
    if (draw.isOrganizerId(organizerId) === false) {
      throw new OnlyOrganizerCanCancelParticipationError();
    }
  }
}
