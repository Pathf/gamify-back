import { Entity } from "../../shared/entity.abstract";

type ParticipationProps = {
  drawId: string;
  participantId: string;
};

export class Participation extends Entity<ParticipationProps> {}
