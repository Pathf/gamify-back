import { DomainError } from "../../shared/domain.error";

export class InvalidCodeForUserRegisterError extends DomainError {
  constructor() {
    super("Invalid code for user register");
  }
}
