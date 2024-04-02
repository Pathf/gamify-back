import { Condition } from "../../draws/entities/condition.entity";
import {
  IConditionRepository,
  I_CONDITION_REPOSITORY,
} from "../../draws/ports/condition-repositroy.interface";
import { IFixture } from "../utils/fixture";
import { TestApp } from "../utils/test-app";

export class ConditionFixture implements IFixture {
  constructor(public readonly entity: Condition) {}

  async load(app: TestApp): Promise<void> {
    const conditionRepository = app.get<IConditionRepository>(
      I_CONDITION_REPOSITORY,
    );
    await conditionRepository.create(this.entity);
  }
}
