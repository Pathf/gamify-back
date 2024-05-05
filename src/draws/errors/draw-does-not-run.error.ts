import { DomainError } from "../../shared/domain.error";

export class DrawDoesNotRunError extends DomainError {
  constructor() {
    super("The draw does not run");
  }
}
