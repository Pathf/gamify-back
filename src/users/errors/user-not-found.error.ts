import { DomainError } from "../../shared/domain.error";

export class UserNotFoundError extends DomainError {
  constructor() {
    super("User not found");
  }
}
