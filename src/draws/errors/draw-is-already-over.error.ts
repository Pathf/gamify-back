import { DomainError } from "../../shared/domain.error";

export class DrawIsAlreadyOverError extends DomainError {
  constructor() {
    super("The draw is already over");
  }
}
