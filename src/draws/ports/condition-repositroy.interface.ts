import { Condition } from "../entities/condition.entity";

export const I_CONDITION_REPOSITORY = "I_CONDITION_REPOSITORY";

export interface IConditionRepository {
  find(condition: Condition): Promise<Condition | null>;

  create(condition: Condition): Promise<void>;
}
