import { DomainError } from "../../shared/domaine.error";

export class NotAllowedDeleteAccountError extends DomainError {
  constructor() {
    super("You are not allowed to delete this account");
  }
}
