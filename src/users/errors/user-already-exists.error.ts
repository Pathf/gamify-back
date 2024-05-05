import { DomainError } from "../../shared/domain.error";

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super("User already exists with this e-mail address");
  }
}
