import { Participation } from "../entities/participation.entity";

export interface IParticipationRepository {
  findOne(drawId: string, participantId: string): Promise<Participation | null>;
  findAllParticipationByDrawId(drawId: string): Promise<Participation[]>;

  create(participation: Participation): Promise<void>;
}
