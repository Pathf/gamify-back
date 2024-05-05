import { DomainError } from "../../shared/domain.error";

export class ConditionDoesNotExistError extends DomainError {
  constructor() {
    super("Condition does not exist");
  }
}
