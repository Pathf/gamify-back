import { Participation } from "../entities/participation.entity";

export const I_PARTICIPATION_REPOSITORY = "I_PARTICIPATION_REPOSITORY";

export interface IParticipationRepository {
  findOne(drawId: string, participantId: string): Promise<Participation | null>;
  findAllParticipationByDrawId(drawId: string): Promise<Participation[]>;

  create(participation: Participation): Promise<void>;

  delete(drawId: string, participantId: string): Promise<void>;
  deleteByDrawId(drawId: string): Promise<void>;
  deleteAll(): Promise<void>;
}
