import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChainedDraw } from "../../../entities/chained-draw.entity";
import { IChainedDrawRepository } from "../../../ports/chained-draw-repository.interface";
import { PostgresChainedDraw } from "./postgres-chained-draw";
import { ChainedDrawMapper } from "./postgres-chained-draw.mapper";

@Injectable()
export class PostgresChainedDrawRepository implements IChainedDrawRepository {
  private readonly chainedDrawMapper: ChainedDrawMapper =
    new ChainedDrawMapper();

  constructor(
    @InjectRepository(PostgresChainedDraw)
    private readonly chainedDrawRepository: Repository<PostgresChainedDraw>,
  ) {}

  async findByDrawId(drawId: string): Promise<ChainedDraw[]> {
    return (await this.chainedDrawRepository.findBy({ drawId })).map(
      (postgresChainedDraw) =>
        this.chainedDrawMapper.toDomain(postgresChainedDraw),
    );
  }

  async findByDonorId(
    drawId: string,
    donorId: string,
  ): Promise<ChainedDraw | null> {
    const postgresDraw = await this.chainedDrawRepository.findOneBy({
      drawId,
      donorId,
    });
    return postgresDraw ? this.chainedDrawMapper.toDomain(postgresDraw) : null;
  }

  async findRunDrawDate(drawId: string): Promise<Date | null> {
    const postgresChainedDraw = await this.chainedDrawRepository.findOneBy({
      drawId,
    });
    return postgresChainedDraw ? postgresChainedDraw.dateDraw : null;
  }

  async findAllByDonorId(donorId: string): Promise<ChainedDraw[]> {
    return (await this.chainedDrawRepository.findBy({ donorId })).map(
      (postgresChainedDraw) =>
        this.chainedDrawMapper.toDomain(postgresChainedDraw),
    );
  }

  async isDrawRun(drawId: string): Promise<boolean> {
    return (
      (await this.chainedDrawRepository.findBy({ drawId })).some(
        (postgresChainedDraw) => postgresChainedDraw.dateDraw !== null,
      ) ?? false
    );
  }

  async create(chainedDraw: ChainedDraw): Promise<void> {
    const postgresChainedDraw =
      this.chainedDrawMapper.toPersistence(chainedDraw);
    await this.chainedDrawRepository.save(postgresChainedDraw);
  }

  async deleteAllByDrawId(drawId: string): Promise<void> {
    await this.chainedDrawRepository.delete({ drawId });
  }

  async deleteAll(): Promise<void> {
    await this.chainedDrawRepository.clear();
  }
}
