import { Participation } from "../entities/participation.entity";
import { IParticipationRepository } from "../ports/participation-repository.interface";

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(private readonly participations: Participation[] = []) {}

  async findOne(
    drawId: string,
    participantId: string,
  ): Promise<Participation | null> {
    return this.findOneSync(drawId, participantId);
  }

  async findAllParticipationByDrawId(drawId: string): Promise<Participation[]> {
    return this.participations.filter(
      (participation) => participation.props.drawId === drawId,
    );
  }

  async create(participation: Participation): Promise<void> {
    this.participations.push(participation);
  }

  // Just for testing purposes
  findOneSync(drawId: string, participantId: string): Participation | null {
    return (
      this.participations.find(
        (participation) =>
          participation.props.drawId === drawId &&
          participation.props.participantId === participantId,
      ) || null
    );
  }
}
