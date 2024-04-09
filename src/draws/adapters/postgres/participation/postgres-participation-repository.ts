import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Participation } from "../../../entities/participation.entity";
import { IParticipationRepository } from "../../../ports/participation-repository.interface";
import { PostgresParticipation } from "./postgres-participation";
import { ParticipationMapper } from "./postgres-participation.mapper";

@Injectable()
export class PostgresParticipationRepository
  implements IParticipationRepository
{
  private readonly mapper: ParticipationMapper = new ParticipationMapper();

  constructor(
    @InjectRepository(PostgresParticipation)
    private readonly participationRepository: Repository<PostgresParticipation>,
  ) {}

  async findOne(
    drawId: string,
    participantId: string,
  ): Promise<Participation | null> {
    const postgresDraw = await this.participationRepository.findOneBy({
      drawId,
      participantId,
    });
    return postgresDraw ? this.mapper.toDomain(postgresDraw) : null;
  }

  async findAllParticipationByDrawId(drawId: string): Promise<Participation[]> {
    return (
      await this.participationRepository.find({
        where: {
          drawId,
        },
      })
    ).map((postgresParticipation) =>
      this.mapper.toDomain(postgresParticipation),
    );
  }

  async create(participation: Participation): Promise<void> {
    const postgresDraw = this.mapper.toPersistence(participation);
    await this.participationRepository.save(postgresDraw);
  }

  async delete(drawId: string, participantId: string): Promise<void> {
    await this.participationRepository.delete({ drawId, participantId });
  }

  async deleteByDrawId(drawId: string): Promise<void> {
    await this.participationRepository.delete({
      drawId,
    });
  }

  async deleteAll(): Promise<void> {
    await this.participationRepository.clear();
  }
}
