import { Condition } from "../entities/condition.entity";

export const I_CONDITION_REPOSITORY = "I_CONDITION_REPOSITORY";

export interface IConditionRepository {
  find(condition: Condition): Promise<Condition | null>;
  findById(id: string): Promise<Condition | null>;
  findAllByDrawId(drawId: string): Promise<Condition[]>;

  create(condition: Condition): Promise<void>;

  deleteById(id: string): Promise<void>;
  deleteByDrawId(drawId: string): Promise<void>;
  deleteAll(): Promise<void>;
}
