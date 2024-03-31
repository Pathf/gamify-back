import { Participation } from "../entities/participation.entity";
import { IParticipationRepository } from "../ports/participation-repository.interface";

export class InMemoryParticipationRepository
  implements IParticipationRepository
{
  constructor(private participations: Participation[] = []) {}

  async findOne(
    drawId: string,
    participantId: string,
  ): Promise<Participation | null> {
    return this.findOneSync(drawId, participantId);
  }

  async findAllParticipationByDrawId(drawId: string): Promise<Participation[]> {
    return this.findAllParticipationByDrawIdSync(drawId);
  }

  async create(participation: Participation): Promise<void> {
    this.participations.push(participation);
  }

  async delete(drawId: string, participantId: string): Promise<void> {
    this.participations = this.participations.filter(
      (participation) =>
        participation.props.drawId !== drawId &&
        participation.props.participantId !== participantId,
    );
  }

  async deleteByDrawId(drawId: string): Promise<void> {
    this.participations = this.participations.filter(
      (participation) => participation.props.drawId !== drawId,
    );
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

  findAllParticipationByDrawIdSync(drawId: string): Participation[] {
    return this.participations.filter(
      (participation) => participation.props.drawId === drawId,
    );
  }
}
