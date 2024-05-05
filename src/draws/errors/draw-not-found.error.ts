import { DomainError } from "../../shared/domain.error";

export class DrawNotFoundError extends DomainError {
  constructor() {
    super("Draw not found");
  }
}
