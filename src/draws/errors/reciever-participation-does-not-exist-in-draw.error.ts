import { DomainError } from "../../shared/domain.error";

export class RecieverParticipationDoesNotExistInDrawError extends DomainError {
  constructor() {
    super("Reciever participation does not exist in the draw");
  }
}
