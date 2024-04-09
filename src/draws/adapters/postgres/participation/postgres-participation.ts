import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PostgresParticipation {
  @PrimaryColumn()
  drawId: string;

  @PrimaryColumn()
  participantId: string;
}
