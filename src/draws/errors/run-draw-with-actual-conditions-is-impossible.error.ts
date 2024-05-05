import { DomainError } from "../../shared/domain.error";

export class RunDrawWithActualConditionsIsImpossibleError extends DomainError {
  constructor() {
    super("Run draw with actual conditions is impossible");
  }
}
