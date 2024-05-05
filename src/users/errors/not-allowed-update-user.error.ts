import { DomainError } from "../../shared/domain.error";

export class NotAllowedUpdateUserError extends DomainError {
  constructor() {
    super("You are not allowed to update this user");
  }
}
