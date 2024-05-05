import { DomainError } from "../../shared/domain.error";

export class ConditionAlreadyExistsError extends DomainError {
  constructor() {
    super("Condition already exists");
  }
}
