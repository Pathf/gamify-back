import { DomainError } from "../../shared/domain.error";

export class ParticipantDoesNotExistError extends DomainError {
  constructor() {
    super("Participant does not exist");
  }
}
