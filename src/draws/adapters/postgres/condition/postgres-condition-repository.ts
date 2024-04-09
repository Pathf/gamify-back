import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Condition } from "../../../entities/condition.entity";
import { IConditionRepository } from "../../../ports/condition-repositroy.interface";
import { PostgresCondition } from "./postgres-condition";
import { ConditionMapper } from "./postgres-condition.mapper";

@Injectable()
export class PostgresConditionRepository implements IConditionRepository {
  private readonly mapper: ConditionMapper = new ConditionMapper();

  constructor(
    @InjectRepository(PostgresCondition)
    private readonly conditionRepository: Repository<PostgresCondition>,
  ) {}

  async find(condition: Condition): Promise<Condition | null> {
    return await this.findById(condition.props.id);
  }

  async findById(id: string): Promise<Condition | null> {
    const postgresCondition = await this.conditionRepository.findOneBy({ id });
    return postgresCondition ? this.mapper.toDomain(postgresCondition) : null;
  }

  async findAllByDrawId(drawId: string): Promise<Condition[]> {
    return (await this.conditionRepository.find({ where: { drawId } })).map(
      (postgresCondition) => this.mapper.toDomain(postgresCondition),
    );
  }

  async create(condition: Condition): Promise<void> {
    const postgresCondition = this.mapper.toPersistence(condition);
    await this.conditionRepository.save(postgresCondition);
  }

  async deleteById(id: string): Promise<void> {
    await this.conditionRepository.delete(id);
  }

  async deleteByDrawId(drawId: string): Promise<void> {
    await this.conditionRepository.delete(drawId);
  }

  async deleteAll(): Promise<void> {
    await this.conditionRepository.clear();
  }
}
