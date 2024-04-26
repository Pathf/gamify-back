import { DomainError } from "../../shared/domaine.error";

export class DrawIsAlreadyOverError extends DomainError {
  constructor() {
    super("The draw is already over");
  }
}
