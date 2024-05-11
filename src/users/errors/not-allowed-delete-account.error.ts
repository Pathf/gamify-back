import { DomainError } from "../../shared/domain.error";

export class NotAllowedDeleteAccountError extends DomainError {
  constructor() {
    super("You are not allowed to delete this account");
  }
}
