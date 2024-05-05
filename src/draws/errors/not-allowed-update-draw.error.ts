import { DomainError } from "../../shared/domain.error";

export class NotAllowedUpdateDrawError extends DomainError {
  constructor() {
    super("You are not allowed to update this draw");
  }
}
