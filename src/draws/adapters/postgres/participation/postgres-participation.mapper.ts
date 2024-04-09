import { Participation } from "../../../entities/participation.entity";
import { PostgresParticipation } from "./postgres-participation";

export class ParticipationMapper {
  toDomain({ drawId, participantId }: PostgresParticipation): Participation {
    return new Participation({
      drawId,
      participantId,
    });
  }

  toPersistence(participation: Participation): PostgresParticipation {
    const postgresParticipation = new PostgresParticipation();
    postgresParticipation.drawId = participation.props.drawId;
    postgresParticipation.participantId = participation.props.participantId;
    return postgresParticipation;
  }
}
