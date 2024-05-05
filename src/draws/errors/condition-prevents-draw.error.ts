import { DomainError } from "../../shared/domain.error";

export class ConditionPreventsNotDrawError extends DomainError {
  constructor() {
    super("Condition prevents the draw");
  }
}
