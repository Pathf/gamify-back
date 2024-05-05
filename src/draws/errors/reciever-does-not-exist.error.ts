import { DomainError } from "../../shared/domain.error";

export class RecieverDoesNotExistError extends DomainError {
  constructor() {
    super("Receiver does not exist");
  }
}
