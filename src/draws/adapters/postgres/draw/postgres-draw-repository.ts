import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Draw } from "../../../entities/draw.entity";
import { IDrawRepository } from "../../../ports/draw-repository.interace";
import { PostgresDraw } from "./postgres-draw";
import { DrawMapper } from "./postgres-draw.mapper";

@Injectable()
export class PostgresDrawRepository implements IDrawRepository {
  private readonly drawMapper: DrawMapper = new DrawMapper();

  constructor(
    @InjectRepository(PostgresDraw)
    private readonly drawRepository: Repository<PostgresDraw>,
  ) {}

  async findOne(id: string): Promise<Draw | null> {
    const postgresDraw = await this.drawRepository.findOneBy({ id });
    return postgresDraw ? this.drawMapper.toDomain(postgresDraw) : null;
  }

  async findAll(): Promise<Draw[]> {
    return (await this.drawRepository.find()).map((postgresDraw) =>
      this.drawMapper.toDomain(postgresDraw),
    );
  }

  async create(draw: Draw): Promise<void> {
    const postgresDraw = this.drawMapper.toPersistence(draw);
    await this.drawRepository.save(postgresDraw);
  }

  async update(draw: Draw): Promise<void> {
    const postgresDraw = this.drawMapper.toPersistence(draw);
    await this.drawRepository.save(postgresDraw);
    draw.commit();
  }

  async delete(drawId: string): Promise<void> {
    await this.drawRepository.delete(drawId);
  }

  async deleteAll(): Promise<void> {
    await this.drawRepository.clear();
  }
}
